import { randomUUID } from 'node:crypto';
import { AIError, bounded, safeError } from '../ai/errors.mjs';
import { getAIService } from '../ai/service.mjs';
import { createStore, createServerClient } from '../ai/store.mjs';
import { readServerConfig } from '../ai/config.mjs';
import { findDuplicates, findCrossTableDuplicates } from './match.mjs';
import { validateDraftData, maskForbiddenFields, buildExtractionPrompt, ENTITY_TYPES } from './validate.mjs';

// Extraction task types — must match the seeded ai_task_config entries.
const EXTRACTION_TASK_TYPES = {
  region: 'extract_destination',
  country: 'extract_destination',
  attraction: 'extract_attraction',
  accommodation: 'extract_accommodation',
  restaurant: 'extract_accommodation', // reuses accommodation schema (similar fields)
  tour_operator: 'extract_attraction', // reuses attraction schema
  activity: 'extract_activity',
  travel_article: 'extract_travel_insight',
};

const EXTRACTION_TIMEOUT = 20000; // 20s — shorter than default AI timeout

/**
 * Fetch the raw text content from a URL.
 * This is a simple text extraction — we strip scripts/styles and grab
 * the main body text. We store the raw HTML hash for cache-busting.
 *
 * @param {string} url - the source URL
 * @returns {Promise<{text: string, title: string, status: string}>}
 */
export async function fetchSourceContent(url, { signal } = {}) {
  try {
    const response = await bounded(
      (abortSignal) => fetch(url, {
        signal: abortSignal,
        headers: { 'User-Agent': 'TrekAfricaGuide-ContentManager/1.0 (+research)' },
      }),
      10000, // 10s timeout
      signal
    );
    if (!response.ok) throw new AIError('PROVIDER_ERROR', { message: `HTTP ${response.status}` });
    const html = await response.text();
    // Basic HTML → text extraction
    const text = extractTextFromHtml(html);
    const title = extractTitleFromHtml(html);
    return { text, title, status: 'ok' };
  } catch (error) {
    const safe = safeError(error);
    return { text: '', title: '', status: 'error', error: safe.code, message: safe.message };
  }
}

function extractTextFromHtml(html) {
  // Strip script/style blocks
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  // Take the first 32000 chars to stay within token limits
  return text.slice(0, 32000);
}

function extractTitleFromHtml(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

/**
 * Start a research task for a given source URL and target entity type.
 *
 * This orchestrates:
 * 1. Create a cm_research_queue entry (status: 'researching')
 * 2. Fetch source content
 * 3. Call AI extraction with forbidden-fields-masked prompt
 * 4. Find duplicates against existing content
 * 5. Create a cm_drafts entry (status: 'needs_verification')
 * 6. Log activity
 *
 * @param {object} params
 * @param {string} params.sourceUrl - URL to extract from
 * @param {string} params.targetEntity - entity type (attraction, accommodation, etc.)
 * @param {string|undefined} params.searchQuery - for search-type tasks (unused for URL)
 * @param {string} params.actorId - admin user ID
 * @param {object} params.client - Supabase server client
 * @param {object} params.env - process.env
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{queueId, draftId, jobId, duplicates}>}
 */
export async function startResearch({ sourceUrl, targetEntity, actorId, client, env, signal }) {
  if (!ENTITY_TYPES.has(targetEntity)) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${targetEntity}` });
  }

  // 1. Create research queue entry
  const queueId = randomUUID();
  const taskType = EXTRACTION_TASK_TYPES[targetEntity];

  const queueInsert = await client.from('cm_research_queue').insert({
    id: queueId,
    source_type: 'url',
    source_url: sourceUrl,
    target_entity: targetEntity,
    status: 'researching',
    created_by: actorId,
  }).select().single();

  if (queueInsert.error) throw new AIError('STORAGE_ERROR');

  const aiService = getAIService(env);
  const server = readServerConfig(env);

  let jobId = null;
  let extractedData = null;
  let duplicates = [];

  try {
    // 2. Fetch source content
    const source = await fetchSourceContent(sourceUrl, { signal });

    if (source.status === 'error') {
      await client.from('cm_research_queue').update({
        status: 'errored',
        error_code: source.error,
        error_message: source.message,
      }).eq('id', queueId);

      await logActivity(client, actorId, 'research_started', 'cm_research_queue', queueId,
        null, { status: 'errored' }, `Source fetch failed: ${source.error}`);

      return { queueId, draftId: null, jobId: null, duplicates: [], error: source };
    }

    // 3. Build extraction prompt with forbidden-fields masking
    const prompt = buildExtractionPrompt(targetEntity, source.text);

    // 4. Call AI extraction
    const result = await aiService.run({
      task_type: taskType,
      messages: prompt,
    }, { signal });

    jobId = result.id;

    // Update queue with AI job reference
    await client.from('cm_research_queue').update({
      ai_job_id: jobId,
      assigned_provider: result.provider,
      model_used: result.model,
      status: 'extracted',
    }).eq('id', queueId);

    // 5. Parse + validate extracted data
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch {
      throw new AIError('INVALID_RESPONSE', { message: 'AI response was not valid JSON' });
    }

    // Mask forbidden fields (replace non-null values with null)
    extractedData = maskForbiddenFields(parsed);
    validateDraftData(targetEntity, extractedData);

    await logActivity(client, actorId, 'extracted', 'cm_research_queue', queueId,
      { status: 'extracted' }, { status: 'extracted', ai_job_id: jobId });

    // 6. Duplicate detection
    const searchName = extractedData.name || extractedData.title || source.title;
    const searchSlug = extractedData.slug || '';

    if (searchName) {
      duplicates = await findDuplicates(
        searchName, targetEntity, client,
        { threshold: 0.7, limit: 10 }
      );
    }

    // Also run cross-table duplicate detection for high-name matches
    if (searchName && searchName.length > 3) {
      const crossDuplicates = await findCrossTableDuplicates(searchName, client, {
        threshold: 0.8, limitPerTable: 3,
      });
      // Merge results (deduplicate by id + entity_type)
      for (const cd of crossDuplicates) {
        if (cd.entity_type !== targetEntity) {
          duplicates.push({
            entity_type: cd.entity_type,
            table: cd.table,
            id: cd.id,
            slug: cd.slug,
            name: cd.name,
            similarity: cd.similarity,
            match_field: cd.match_field,
            cross_table: true,
          });
        }
      }
    }

    if (duplicates.length > 0) {
      await logActivity(client, actorId, 'duplicate_detected', 'cm_research_queue', queueId,
        { status: 'matched' }, { status: 'matched', duplicate_count: duplicates.length });
    }

    // 7. Update queue status to 'matched'
    await client.from('cm_research_queue').update({
      status: 'matched',
    }).eq('id', queueId);

    // 8. Create draft (initial status: 'needs_verification')
    const draftInsert = await client.from('cm_drafts').insert({
      id: randomUUID(),
      target_entity: targetEntity,
      draft_type: 'new',
      draft_data: extractedData,
      workflow_status: 'needs_verification',
      approval_status: 'pending',
      source_url: sourceUrl,
      source_name: source.title,
      research_date: new Date().toISOString(),
      ai_model: result.model,
      ai_task_type: taskType,
      ai_job_id: jobId,
      ai_generated: true,
      created_by: actorId,
    }).select().single();

    if (draftInsert.error) throw new AIError('STORAGE_ERROR');

    await logActivity(client, actorId, 'draft_created', 'cm_drafts', draftInsert.data.id,
      null, { id: draftInsert.data.id, target_entity: targetEntity, workflow_status: 'needs_verification' });

    return {
      queueId,
      draftId: draftInsert.data.id,
      jobId,
      duplicates,
      extractedData,
      usage: result.usage,
      cached: result.cached,
    };
  } catch (error) {
    const safe = safeError(error);
    await client.from('cm_research_queue').update({
      status: 'errored',
      error_code: safe.code,
      error_message: safe.message,
    }).eq('id', queueId);

    await logActivity(client, actorId, 'research_started', 'cm_research_queue', queueId,
      { status: 'researching' }, { status: 'errored' }, `Error: ${safe.code}`);

    throw safe;
  }
}

/**
 * Log an activity entry to the cm_activity_log table.
 * Swallows errors to avoid breaking the main workflow if logging fails.
 */
async function logActivity(client, actorId, action, entityType, entityId, oldState, newState, reason = null) {
  try {
    await client.from('cm_activity_log').insert({
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_state: oldState,
      new_state: newState,
      reason,
    });
  } catch {
    // Logging failure must not break the main workflow
  }
}

export { EXTRACTION_TASK_TYPES };
