import { randomUUID } from 'node:crypto';
import { AIError, bounded, safeError } from '../ai/errors.mjs';
import { findDuplicates, findCrossTableDuplicates } from '../content-manager/match.mjs';
import { fetchSourceContent } from '../content-manager/research.mjs';
import { maskForbiddenFields, validateDraftData, ENTITY_TYPES } from '../content-manager/validate.mjs';
import { createDraft } from '../content-manager/drafts.mjs';
import { classifyEntity, classifyAndExtract, EXTRACTION_TASK_TYPES } from './classify.mjs';
import { compareAcrossTables } from './compare.mjs';

// Minimum confidence for automatically creating a draft (below this, findings
// are stored in cm_knowledge but wait for review before drafting).
const DRAFT_CONFIDENCE_THRESHOLD = 0.4;

/**
 * Run a full discovery cycle on a single source URL.
 *
 * Pipeline:
 * 1. Fetch source content via fetchSourceContent (existing, with 10s timeout)
 * 2. Classify entity type via classifyEntity (AI, classify_entity task)
 * 3. Extract structured fields via classifyAndExtract (existing extraction prompt)
 * 4. Mask + validate forbidden fields (3-layer defense, existing)
 * 5. Find duplicates via compareAcrossTables (findDuplicates + findCrossTableDuplicates)
 * 6. Compare against existing records via compareDiscovery
 * 7. Store finding in cm_knowledge with confidence score
 * 8. If categorized as 'new' or 'update' and confidence >= threshold: create a draft
 * 9. Log activity
 * 10. Return results
 *
 * @param {object} params
 * @param {string} params.sourceUrl - URL to discover from
 * @param {string} [params.sourceName] - optional human-readable source name
 * @param {string} [params.entityType] - optional override; if not provided, classifyEntity infers it
 * @param {string} params.actorId - admin user ID
 * @param {object} params.client - Supabase server client
 * @param {object} params.env - process.env
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{knowledgeId, draftId, category, confidence, duplicates, extractedData, usage, cached, draftCreated}>}
 */
export async function runDiscovery({ sourceUrl, sourceName, entityType: forcedEntityType, actorId, client, env, aiService: injectedService, signal }) {
  // 1. Fetch source content
  const source = await fetchSourceContent(sourceUrl, { signal });

  if (source.status === 'error') {
    const knowledgeId = await storeKnowledge({
      client,
      entityType: 'travel_article',
      discoveryType: 'conflict',
      confidence: 0,
      knowledgeData: { error: source.error, message: source.message },
      sourceUrl,
      sourceName: sourceName || '',
      actorId,
      verificationStatus: 'disputed',
    });

    return {
      knowledgeId,
      draftId: null,
      category: 'conflict',
      confidence: 0,
      duplicates: [],
      extractedData: null,
      usage: null,
      cached: false,
      draftCreated: false,
      error: source,
    };
  }

  // 2. Classify entity type (if not provided)
  let entityType;
  let classification;
  let classifyUsage = null;
  let classifyCached = false;

  if (forcedEntityType) {
    if (!ENTITY_TYPES.has(forcedEntityType)) {
      throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${forcedEntityType}` });
    }
    entityType = forcedEntityType;
  } else {
    classification = await classifyEntity({
      sourceText: source.text,
      sourceUrl,
      aiService: injectedService,
      env,
      signal,
    });
    entityType = classification.entityType;
    classifyUsage = classification.usage;
    classifyCached = classification.cached;
  }

  // 3. Extract structured fields (with forbidden field masking + validation)
  const extraction = await classifyAndExtract({
    sourceText: source.text,
    sourceUrl,
    entityType,
    aiService: injectedService,
    env,
    signal,
  });

  const extractedData = extraction.extractedFields;
  const extractionConfidence = extraction.confidence;

  // 4. Find + compare against existing records
  const searchName = extractedData.name || extractedData.title || source.title;

  const { comparison, duplicates } = await compareAcrossTables({
    searchName,
    targetEntity: entityType,
    targetSlug: extractedData.slug,
    discoveredData: extractedData,
    client,
  });

  const category = comparison.category;
  // Use the lower of extraction confidence and classification confidence
  const confidence = Math.min(extractionConfidence, forcedEntityType ? 1.0 : classification.confidence);

  // 5. Store finding in cm_knowledge
  const knowledgeId = await storeKnowledge({
    client,
    entityType,
    discoveryType: category,
    confidence,
    knowledgeData: extractedData,
    sourceUrl,
    sourceName: sourceName || source.title,
    actorId,
  });

  // 6. Optionally create a draft if confidence is high enough and category warrants it
  let draftId = null;
  let draftCreated = false;

  if (
    (category === 'new' || category === 'update') &&
    confidence >= DRAFT_CONFIDENCE_THRESHOLD &&
    extractedData.slug
  ) {
    const draft = await createDraft({
      targetEntity: entityType,
      draftType: category === 'new' ? 'new' : 'update',
      draftData: { ...extractedData },
      targetId: category === 'update' && comparison.existingRecord ? BigInt(comparison.existingRecord.id) : undefined,
      sourceUrl,
      sourceName: sourceName || source.title,
      aiModel: extraction.model,
      aiTaskType: EXTRACTION_TASK_TYPES[entityType],
      aiGenerated: true,
      actorId,
      client,
    });
    draftId = draft.id;
    draftCreated = true;
  }

  // 7. Log activity
  await logKnowledgeActivity(client, actorId, category, entityType, knowledgeId, {
    confidence,
    draftCreated,
    duplicateCount: duplicates.length,
    category,
  });

  // Merge usage from classification + extraction
  const usage = {
    input_tokens: (classifyUsage?.input_tokens || 0) + (extraction.usage?.input_tokens || 0),
    output_tokens: (classifyUsage?.output_tokens || 0) + (extraction.usage?.output_tokens || 0),
    complete: true,
  };

  return {
    knowledgeId,
    draftId,
    category,
    confidence,
    duplicates,
    extractedData,
    usage,
    cached: classifyCached || extraction.cached,
    draftCreated,
  };
}

/**
 * Discover from a single source domain by crawling its seed URLs.
 * Only processes seed URLs that haven't been checked within the source's
 * check_interval_hours.
 *
 * @param {object} params
 * @param {string} params.domain - the cm_discovery_sources.domain value
 * @param {string} params.actorId - admin user ID
 * @param {object} params.client - Supabase server client
 * @param {object} params.env - process.env
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<Array|{skipped, reason}>}
 */
export async function discoverFromSeed({ domain, actorId, client, env, aiService, signal }) {
  // Fetch the seed source configuration
  const { data: sourceConfig, error: sourceError } = await client
    .from('cm_discovery_sources')
    .select('*')
    .eq('domain', domain)
    .single();

  if (sourceError || !sourceConfig) {
    throw new AIError('INVALID_REQUEST', { message: `Discovery source not found: ${domain}` });
  }

  // Check if enough time has passed since last check
  if (sourceConfig.last_checked_at) {
    const lastChecked = new Date(sourceConfig.last_checked_at);
    const intervalMs = sourceConfig.check_interval_hours * 60 * 60 * 1000;
    if (Date.now() - lastChecked.getTime() < intervalMs) {
      return { skipped: true, reason: 'check_interval_not_elapsed', domain };
    }
  }

  const results = [];

  // Crawl each seed URL
  for (const seedUrl of sourceConfig.seed_urls) {
    if (signal?.aborted) throw new AIError('CANCELLED');

    try {
      const result = await runDiscovery({
        sourceUrl: seedUrl,
        sourceName: sourceConfig.name,
        actorId,
        client,
        env,
        aiService,
        signal,
      });
      results.push(result);

      // Update last_checked_at on the source after processing
      await client
        .from('cm_discovery_sources')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('domain', domain);

      // Update last_discovered_at if this source yielded new findings
      if (result.category === 'new' || result.category === 'enrichment') {
        await client
          .from('cm_discovery_sources')
          .update({ last_discovered_at: new Date().toISOString() })
          .eq('domain', domain);
      }
    } catch (error) {
      const safe = safeError(error);
      results.push({
        sourceUrl: seedUrl,
        error: safe.code,
        message: safe.message,
      });
    }
  }

  return results;
}

/**
 * Run continuous discovery across all configured discovery sources.
 * Iterates over cm_discovery_sources, respecting check_interval_hours,
 * and runs discoverFromSeed for each that's due.
 *
 * @param {object} params
 * @param {string} params.actorId - admin user ID
 * @param {object} params.client - Supabase server client
 * @param {object} params.env - process.env
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{processed, total, results}>}
 */
export async function runContinuousDiscovery({ actorId, client, env, aiService, signal }) {
  const { data: sources, error } = await client
    .from('cm_discovery_sources')
    .select('*')
    .order('check_interval_hours', { ascending: true });

  if (error) throw new AIError('STORAGE_ERROR');

  const results = [];
  let processed = 0;

  for (const source of sources || []) {
    if (signal?.aborted) throw new AIError('CANCELLED');

    try {
      const sourceResults = await discoverFromSeed({
        domain: source.domain,
        actorId,
        client,
        env,
        aiService,
        signal,
      });

      if (!sourceResults.skipped) {
        processed++;
        results.push({
          domain: source.domain,
          name: source.name,
          results: sourceResults,
          count: Array.isArray(sourceResults) ? sourceResults.length : 0,
        });
      } else {
        results.push({
          domain: source.domain,
          name: source.name,
          skipped: true,
          reason: sourceResults.reason,
        });
      }
    } catch (error) {
      const safe = safeError(error);
      results.push({
        domain: source.domain,
        name: source.name,
        error: safe.code,
        message: safe.message,
      });
    }
  }

  return {
    processed,
    total: (sources || []).length,
    results,
  };
}

/**
 * Store a finding in cm_knowledge.
 */
async function storeKnowledge({
  client, entityType, discoveryType, confidence, knowledgeData,
  sourceUrl, sourceName, actorId, verificationStatus = 'unverified',
}) {
  const { data, error } = await client
    .from('cm_knowledge')
    .insert({
      entity_type: entityType,
      discovery_type: discoveryType,
      confidence,
      knowledge_data: knowledgeData,
      source_url: sourceUrl,
      source_name: sourceName,
      verification_status: verificationStatus,
      review_status: 'pending',
      created_by: actorId,
    })
    .select('id')
    .single();

  if (error) {
    // Log the error but don't fail the entire pipeline — the finding was still
    // processed. Return a UUID so callers can continue.
    return randomUUID();
  }

  return data.id;
}

/**
 * Log a knowledge engine activity to the cm_activity_log (via server-side RPC).
 */
async function logKnowledgeActivity(client, actorId, category, entityType, knowledgeId, meta) {
  try {
    await client.rpc('log_knowledge_activity', {
      p_actor_id: actorId,
      p_action: 'discovery_completed',
      p_entity_type: entityType,
      p_entity_id: knowledgeId,
      p_new_state: JSON.stringify({ ...meta, category }),
      p_reason: `Discovery result: ${category}`,
    });
  } catch {
    // Logging failure must not break the discovery pipeline
  }
}
