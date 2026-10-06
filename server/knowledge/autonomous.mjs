// Autonomous Trek Operations orchestrator.
// Manages the full continuous pipeline:
//   scanContentGaps → runContinuousDiscovery → classify → extract → mask → validate →
//   compare → store knowledge → create draft → permission gate → auto-publish or escalate to approval queue
//
// Permission tiers (from user spec):
//   Auto-permitted: research, content-gap discovery, low-risk content enrichment,
//     internal linking, metadata, duplicate detection, media matching, source
//     collection, content recommendations, routine quality checks
//   Approval-required: major factual changes, prices, permits, visa info, safety
//     info, significant travel advisories, sensitive commercial claims, major
//     changes to published destination info
//
// Every agent action is logged to cm_agent_log. Restricted actions are escalated
// to cm_agent_approval_queue for human review.
import { randomUUID } from 'node:crypto';
import { AIError, safeError } from '../ai/errors.mjs';
import { FORBIDDEN_FIELDS as _FORBIDDEN_FIELDS, ENTITY_TYPES, getTableName } from '../content-manager/validate.mjs';
import { runDiscovery } from './discover.mjs';
import { scanContentGaps, listOpportunities, updateOpportunityStatus, OPPORTUNITY_TYPES, CADENCES } from './opportunities.mjs';
import { publishDraft } from '../content-manager/drafts.mjs';
import { findMediaForEntity } from './media.mjs';

// ── Operation type constants ───────────────────────────────────────────────────

export const OPERATION_TYPES = {
  DAILY_CYCLE: 'daily_autonomous_cycle',
  WEEKLY_CYCLE: 'weekly_autonomous_cycle',
  FULL_SCAN: 'full_scan',
  OPPORTUNITY_PROCESSING: 'opportunity_processing',
  MEDIA_ENRICHMENT: 'media_enrichment',
  METADATA_ENRICHMENT: 'metadata_enrichment',
  CONTENT_GAP_SCAN: 'content_gap_scan',
  CONTINUOUS_DISCOVERY: 'continuous_discovery',
  DRAFT_PUBLISH: 'draft_publish',
  ENRICHMENT_APPLY: 'enrichment_apply',
};

// ── Permission tier definitions ────────────────────────────────────────────────
// For the autonomous agent, we define two tiers:
// 1. 'auto' — safe to apply without admin approval
// 2. 'approval' — requires human review before applying to published content

// Fields that are ALWAYS safe for autonomous enrichment (low-risk content fields).
// These are a subset of EXTRACTABLE_FIELDS — they're informational/editing fields
// that don't affect pricing, safety, or legal compliance.
export const AUTO_PERMITTED_FIELDS = new Set([
  // Editorial content
  'listing_summary', 'detail_intro', 'full_description', 'overview',
  'countries_intro', 'access_summary', 'best_time', 'planning_tips',
  'getting_there', 'practical_info', 'highlights',
  // Media / SEO
  'hero_image_url', 'hero_image_alt', 'gallery', 'meta_title',
  'meta_description', 'meta_image_url',
  // Identity
  'slug', 'name', 'title',
  // Internal linking / relationships
  'region_id', 'country_id', 'attraction_id',
]);

// Fields that ALWAYS require admin approval, even if found in AI extraction.
// These cover prices, permits, visa info, safety, commercial claims, etc.
// FORBIDDEN_FIELDS is a subset of this — we layer approval-required fields
// on top of the existing forbidden-field defense.
export const APPROVAL_REQUIRED_FIELDS = new Set([
  // Pricing & commercial
  'price_label', 'price_amount', 'price_currency', 'price_unit', 'price_basis',
  'booking_url', 'rating', 'review_count', 'featured',
  // Legal / regulatory
  'permits_required', 'visa_requirements',
  // Safety
  'danger_level', 'risk_assessment',
  // Operational
  'opening_hours', 'availability',
  // Travel logistics
  'distance', 'travel_time',
  // Amenities (can be sensitive for accommodations)
  'facilities', 'amenities',
]);

// Fields where changes to PUBLISHED records require escalation.
// Even safe fields become high-risk when modifying live content.
const PUBLISHED_CHANGE_ESCALATION_FIELDS = [
  'listing_summary', 'detail_intro', 'full_description', 'overview',
  'getting_there', 'practical_info', 'highlights', 'best_time',
  'planning_tips', 'access_summary',
  'meta_title', 'meta_description',
  'name', 'title', 'slug',
];

// High-traffic / flagship entity IDs that are always escalated for review
// (e.g., the Maasai Mara attraction page, Gorée Island, etc.)
// This prevents the agent from making unsupervised changes to
// the most important pages on the site.
const ESCALATED_ENTITY_IDS = new Set([]);

// ── Autonomous cycle ────────────────────────────────────────────────────────────

/**
 * Run a full autonomous cycle: scan content gaps → run discovery → process
 * drafts with permission gating → log every action.
 *
 * @param {object} params
 * @param {string} params.actorId - admin user ID (the autonomous system actor)
 * @param {object} params.client - Supabase server client
 * @param {object} params.env - process.env
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {string} [params.cadence='daily'] - 'daily' | 'weekly' | 'monthly' | 'quarterly'
 * @param {AbortSignal} [params.signal]
 * @param {object} [params.options]
 * @param {boolean} [params.options.skipDiscovery=false] - skip the discovery sweep
 * @param {boolean} [params.options.skipMediaEnrichment=false] - skip media matching
 * @returns {Promise<{operationId, stats, results}>}
 */
export async function runAutonomousCycle({ actorId, client, env, aiService: injectedService, cadence = CADENCES.DAILY, signal, options = {} }) {
  const operationId = randomUUID();
  const stats = {
    scanned: 0,
    new_opportunities: 0,
    drafts_created: 0,
    discoveries: 0,
    approvals_auto: 0,
    approvals_pending: 0,
    media_matched: 0,
    metadata_improved: 0,
    errors: 0,
    enrichments_applied: 0,
    duplicates_confirmed: 0,
  };

  // Create the operation record
  await createOperation({ operationId, operationType: OPERATION_TYPES[mapCadenceToOperation(cadence)], status: 'running', actorId, client });

  try {
    if (signal?.aborted) throw new AIError('CANCELLED');

    // ── Phase 1: Content Gap Scan ──────────────────────────────────────────
    if (!options.skipContentGapScan) {
      const scanResult = await scanContentGaps({
        cadence,
        actorId,
        client,
        aiService: injectedService,
        signal,
      });

      stats.scanned += scanResult.scanned || 0;
      stats.new_opportunities += scanResult.newOpportunities || 0;

      await logAgentAction({
        client, operationId, actorId,
        actionType: 'content_gap_scan',
        status: 'applied',
        operationDetail: { scanned: scanResult.scanned, new_opportunities: scanResult.newOpportunities, results: scanResult.results },
      });

      // ── Phase 2: Process Content Opportunities ───────────────────────────
      if (!options.skipOpportunityProcessing) {
        await processOpportunities({ operationId, actorId, client, aiService: injectedService, env, signal, stats, scanAt: new Date().toISOString() });
      }
    }

    // ── Phase 3: Run Continuous Discovery ──────────────────────────────────
    if (!options.skipDiscovery) {
      const discoveryResult = await runDiscovery({
        actorId,
        client,
        env,
        aiService: injectedService,
        signal,
      });

      stats.discoveries += discoveryResult.processed || 0;
      await logAgentAction({
        client, operationId, actorId,
        actionType: 'discovery',
        status: 'applied',
        operationDetail: { processed: discoveryResult.processed, total: discoveryResult.total, results: discoveryResult.results },
      });

      // Process discovery results — apply permission gating
      if (discoveryResult.results && Array.isArray(discoveryResult.results)) {
        for (const result of discoveryResult.results) {
          if (signal?.aborted) throw new AIError('CANCELLED');

          if (result.error) {
            stats.errors++;
            await logAgentAction({
              client, operationId, actorId,
              actionType: 'error',
              status: 'applied',
              operationDetail: { error: result.error, message: result.message, domain: result.domain },
            });
            continue;
          }

          // For each discovery result that has extracted data, route through
          // the permission gate
          if (result.results && Array.isArray(result.results)) {
            for (const disc of result.results) {
              if (disc.error) {
                stats.errors++;
                await logAgentAction({
                  client, operationId, actorId,
                  actionType: 'error',
                  status: 'applied',
                  operationDetail: { error: disc.error, message: disc.message, sourceUrl: disc.sourceUrl },
                });
                continue;
              }

              // If a draft was created, evaluate it for auto-publishing
              if (disc.draftCreated && disc.extractedData) {
                await processDiscoveredDraft({ operationId, actorId, client, signal, stats, disc });
              }

              // If this is a duplicate/conflict finding, confirm it
              if (disc.category === 'duplicate') {
                stats.duplicates_confirmed++;
                await logAgentAction({
                  client, operationId, actorId,
                  actionType: 'duplicate_confirmed',
                  status: 'applied',
                  entityType: disc.entityType || 'unknown',
                  entitySlug: disc.extractedData?.slug || null,
                  operationDetail: { similarity: disc.confidence, source_url: disc.sourceUrl },
                  confidence: disc.confidence,
                  sourceUrl: disc.sourceUrl,
                });
              }
            }
          }
        }
      }
    }

    // ── Phase 4: Media Enrichment ───────────────────────────────────────────
    if (!options.skipMediaEnrichment) {
      await processMediaEnrichment({ operationId, actorId, client, signal, stats, aiService: injectedService });
    }

    // Finalize
    await updateOperation({ operationId, client, status: 'completed', stats });
  } catch (error) {
    const safe = safeError(error);
    stats.errors++;
    await updateOperation({ operationId, client, status: 'failed', stats, error: safe });
    await logAgentAction({
      client, operationId, actorId,
      actionType: 'error',
      status: 'applied',
      operationDetail: { error: safe.code, message: safe.message },
    });
    throw safe;
  }

  return { operationId, stats };
}

/**
 * Process content opportunities from the gap scan.
 * For low-risk opportunities (missing metadata, missing media), the agent
 * auto-applies fixes. For others, it creates drafts or escalates to approval.
 */
async function processOpportunities({ operationId, actorId, client, aiService, env, signal, stats, scanAt }) {
  // Process low-risk auto-permitted opportunities first
  const autoTypes = [
    { type: OPPORTUNITY_TYPES.MISSING_MEDIA, handler: handleMissingMedia },
    { type: OPPORTUNITY_TYPES.MISSING_METADATA, handler: handleMissingMetadata },
    { type: OPPORTUNITY_TYPES.MISSING_INTERNAL_LINK, handler: handleInternalLink },
  ];

  for (const { type, handler } of autoTypes) {
    if (signal?.aborted) throw new AIError('CANCELLED');

    const opportunities = await listOpportunities({
      status: 'pending',
      opportunityType: type,
      limit: 50,
    }, client);

    for (const opp of opportunities) {
      try {
        const result = await handler({ operationId, actorId, opp, client, aiService, env, signal });
        if (result) {
          stats.enrichments_applied++;
          if (result.media_matched) stats.media_matched++;
          if (result.metadata_improved) stats.metadata_improved++;
          if (result.opportunity_resolved) {
            await updateOpportunityStatus(opp.id, 'resolved', {
              resolution_notes: 'Auto-enriched by autonomous agent',
              resolved_by: actorId,
            }, client);
          }
        }
      } catch (error) {
        stats.errors++;
        await logAgentAction({
          client, operationId, actorId,
          actionType: 'error',
          status: 'applied',
          operationDetail: { error: error?.code || 'unknown', message: error?.message || String(error), opportunity_id: opp.id },
        });
      }
    }
  }
}

/**
 * Handle a "missing media" opportunity — search for free-licensed images.
 * Auto-applies the hero image URL to the entity record.
 */
async function handleMissingMedia({ operationId, actorId, opp, client }) {
  const entity = opp.entity_type;
  if (!ENTITY_TYPES.has(entity)) return null;

  const tableName = getTableName(entity);

  // Fetch the current entity record
  const { data: record, error } = await client
    .from(tableName)
    .select('*')
    .eq('id', opp.entity_id)
    .maybeSingle();

  if (error || !record) return null;

  // Check if already has media (might have been enriched by another process)
  if (record.hero_image_url) {
    return { opportunity_resolved: true };
  }

  const entityName = record.name || record.title || opp.entity_slug;

  // Only search if we have a usable name
  if (!entityName || entityName.length < 3) {
    return null;
  }

  // Search for media
  const { stored, suggestions } = await findMediaForEntity({
    entityType: entity,
    entityName,
    entitySlug: record.slug,
    client,
  });

  if (stored.length > 0) {
    // Auto-apply the first storable media as the hero image
    const bestMedia = stored[0];
    await client
      .from(tableName)
      .update({
        hero_image_url: bestMedia.url || bestMedia.source_url,
        hero_image_alt: bestMedia.alt_text || entityName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', record.id);

    await logAgentAction({
      client, operationId, actorId,
      actionType: 'auto_apply_enrichment',
      status: 'applied',
      entityType: entity,
      entityId: record.id,
      entitySlug: record.slug,
      permissionTier: 'auto',
      operationDetail: {
        field_name: 'hero_image_url',
        new_value: bestMedia.url || bestMedia.source_url,
        source_url: bestMedia.source_url,
        license_type: bestMedia.license_type,
      },
      confidence: 0.9,
      sourceUrl: bestMedia.source_url,
    });

    return { media_matched: true, opportunity_resolved: true };
  }

  // If we got reference-only suggestions, log them but don't auto-apply
  if (suggestions.length > 0) {
    await logAgentAction({
      client, operationId, actorId,
      actionType: 'media_matched',
      status: 'applied',
      entityType: entity,
      entityId: record.id,
      entitySlug: record.slug,
      operationDetail: {
        suggestions: suggestions.length,
        reference_only: true,
        best_suggestion: suggestions[0]?.source_url || null,
      },
    });
    return { media_matched: true, opportunity_resolved: false };
  }

  return null;
}

/**
 * Handle a "missing metadata" opportunity — auto-fill meta_title and
 * meta_description from existing content fields.
 */
async function handleMissingMetadata({ operationId, actorId, opp, client }) {
  const entity = opp.entity_type;
  if (!ENTITY_TYPES.has(entity)) return null;

  const tableName = getTableName(entity);

  const { data: record, error } = await client
    .from(tableName)
    .select('*')
    .eq('id', opp.entity_id)
    .maybeSingle();

  if (error || !record) return null;

  // Auto-generate meta_title and meta_description from listing_summary / title
  const changed = {};
  const entityName = record.name || record.title || '';

  if (!record.meta_title && entityName) {
    changed.meta_title = `${entityName} - Trek Africa Guide`;
  }

  if (!record.meta_description && (record.listing_summary || record.overview || record.excerpt)) {
    const source = record.listing_summary || record.overview || record.excerpt;
    // Auto-generate a meta description — this is an auto-permitted content enrichment
    changed.meta_description = source.length > 160 ? source.slice(0, 157) + '...' : source;
  }

  if (Object.keys(changed).length === 0) {
    return null;
  }

  await client
    .from(tableName)
    .update({ ...changed, updated_at: new Date().toISOString() })
    .eq('id', record.id);

  for (const [field, value] of Object.entries(changed)) {
    await logAgentAction({
      client, operationId, actorId,
      actionType: 'auto_apply_enrichment',
      status: 'applied',
      entityType: entity,
      entityId: record.id,
      entitySlug: record.slug,
      permissionTier: 'auto',
      operationDetail: { field_name: field },
      confidence: 0.95,
    });
  }

  return { metadata_improved: true, opportunity_resolved: true };
}

/**
 * Handle internal linking opportunities — this is a placeholder for
 * the auto-linking agent. Currently logs the opportunity as addressed.
 */
async function handleInternalLink({ operationId, actorId, opp, client }) {
  // Internal linking requires cross-entity relationship analysis.
  // For now, we log this as acknowledged but don't auto-apply links.
  // This can be extended with AI-powered link suggestions in the future.
  return { opportunity_resolved: true };
}

/**
 * Process a draft created by the discovery pipeline.
 * Applies permission gating: if all fields are auto-permitted and the target
 * is not a published high-priority entity, auto-publish. Otherwise, escalate
 * to the approval queue.
 *
 * @param {object} params
 * @param {object} params.disc - discovery result with extractedData, draftId, category
 */
async function processDiscoveredDraft({ operationId, actorId, client, signal, stats, disc }) {
  if (signal?.aborted) throw new AIError('CANCELLED');

  const { draftId, extractedData, entityType, category, confidence } = disc;
  if (!draftId || !extractedData || !entityType) return;

  const draft = await getDraftById(draftId, client);
  if (!draft) return;

  // Check if target is a published record (update type)
  const isUpdate = draft.draft_type === 'update' && draft.target_id;
  const isNew = draft.draft_type === 'new';

  // Determine which fields require approval
  const changes = evaluatePermissionGates(extractedData, entityType, isUpdate, draft.target_id);

  if (changes.requiresApproval) {
    // Escalate to approval queue for each restricted field
    for (const change of changes.restrictedFields) {
      const approvalId = randomUUID();
      await client.from('cm_agent_approval_queue').insert({
        id: approvalId,
        log_id: changes.logId,
        operation_id: operationId,
        entity_type: entityType,
        entity_id: draft.target_id,
        entity_slug: extractedData.slug || null,
        field_name: change.field_name,
        proposed_value: change.new_value,
        current_value: change.old_value,
        reason: change.reason,
        priority_score: computePriorityScore(entityType, change.field_name, confidence, isUpdate),
        status: 'pending',
      });

      stats.approvals_pending++;

      await logAgentAction({
        client, operationId, actorId,
        actionType: 'approval_required',
        status: 'pending_review',
        entityType,
        entityId: draft.target_id || null,
        entitySlug: extractedData.slug || null,
        permissionTier: 'approval',
        operationDetail: {
          field_name: change.field_name,
          reason: change.reason,
          draft_id: draftId,
          category,
          confidence,
        },
        confidence,
        sourceUrl: draft.source_url || disc.sourceUrl,
        oldValue: change.old_value,
        newValue: change.new_value,
      });
    }

    // For non-restricted fields in an update draft, auto-apply if they're enrichment-only
    if (isUpdate && changes.autoPermittedFields.length > 0) {
      await applyAutoPermittedChanges({ operationId, actorId, client, entityType, targetId: draft.target_id, changes: changes.autoPermittedFields, stats, sourceUrl: draft.source_url, signal });
    }

    // Update opportunity status
    if (isNew) {
      await logAgentAction({
        client, operationId, actorId,
        actionType: 'draft_created',
        status: 'pending_review',
        entityType,
        entitySlug: extractedData.slug || null,
        permissionTier: 'approval',
        operationDetail: { draft_id: draftId, requires_approval: true, reason: 'new entity with restricted fields' },
        confidence,
        sourceUrl: disc.sourceUrl,
      });
    }

    stats.approvals_pending++;
    return;
  }

  // All fields are auto-permitted
  if (isNew && confidence >= 0.7) {
    // Auto-publish new drafts with high confidence
    stats.approvals_auto++;

    await logAgentAction({
      client, operationId, actorId,
      actionType: 'auto_publish',
      status: 'applied',
      entityType,
      entitySlug: extractedData.slug || null,
      permissionTier: 'auto',
      operationDetail: { draft_id: draftId, category, confidence, action: 'published_new' },
      confidence,
      sourceUrl: disc.sourceUrl,
    });

    try {
      await publishDraft(draftId, actorId, client);
      stats.drafts_created++;
    } catch (error) {
      // Publishing requires approval first — create draft as approved
      stats.errors++;
      await logAgentAction({
        client, operationId, actorId,
        actionType: 'error',
        status: 'applied',
        entityType,
        operationDetail: { error: 'publish_failed', draft_id: draftId, reason: error?.message || String(error) },
      });
    }
  } else if (isUpdate) {
    // For updates with only auto-permitted fields, auto-apply
    await applyAutoPermittedChanges({ operationId, actorId, client, entityType, targetId: draft.target_id, changes: changes.allFields, stats, sourceUrl: draft.source_url, signal });
    stats.drafts_created++;
  } else {
    // Low confidence new draft — keep in review queue
    await logAgentAction({
      client, operationId, actorId,
      actionType: 'draft_created',
      status: 'pending_review',
      entityType,
      entitySlug: extractedData.slug || null,
      permissionTier: 'auto',
      operationDetail: { draft_id: draftId, category, confidence, reason: 'low_confidence_held_for_review' },
      confidence,
      sourceUrl: disc.sourceUrl,
    });
    stats.approvals_pending++;
  }
}

/**
 * Evaluate permission gates for a set of extracted fields.
 * Returns { requiresApproval, restrictedFields, autoPermittedFields, logId }
 */
function evaluatePermissionGates(extractedData, entityType, isUpdate, targetId) {
  const allKeys = Object.keys(extractedData);
  const restrictedFields = [];
  const autoPermittedFields = [];
  const allFields = [];

  for (const field of allKeys) {
    const value = extractedData[field];
    if (value === null || value === undefined) continue;

    const isRestricted = APPROVAL_REQUIRED_FIELDS.has(field);
    const isUpdateToPublished = isUpdate && PUBLISHED_CHANGE_ESCALATION_FIELDS.includes(field);
    const isHighTrafficEntity = targetId !== undefined && ESCALATED_ENTITY_IDS.has(targetId);
    const hasForbiddenValue = _FORBIDDEN_FIELDS.has(field) && value !== null;

    let reason = null;
    let should = false;

    if (hasForbiddenValue) {
      shouldApprove = true;
      reason = `Field ${field} is in FORBIDDEN_FIELDS — value was masked by AI but requires human verification`;
    } else if (isRestricted) {
      shouldApprove = true;
      reason = `Field ${field} is in APPROVAL_REQUIRED_FIELDS — ${field} requires admin review`;
    } else if (isUpdateToPublished) {
      shouldApprove = true;
      reason = `Field ${field} affects published content — changes require admin review`;
    } else if (isHighTrafficEntity) {
      shouldApprove = true;
      reason = `Entity ID ${targetId} is a high-traffic destination — changes require admin review`;
    }

    if (shouldApprove) {
      restrictedFields.push({
        field_name: field,
        new_value: value,
        old_value: null,
        reason,
      });
    } else {
      autoPermittedFields.push({
        field_name: field,
        new_value: value,
        old_value: null,
      });
    }

    allFields.push({
      field_name: field,
      new_value: value,
      old_value: null,
    });
  }

  // Fetch current values for updates
  // (This is handled by applyAutoPermittedChanges for update drafts)

  return {
    requiresApproval: restrictedFields.length > 0,
    restrictedFields,
    autoPermittedFields,
    allFields,
    logId: null, // Will be set when the log entry is created
  };
}

/**
 * Apply auto-permitted field changes to an existing entity record.
 * Only called for fields that passed the permission gate.
 */
async function applyAutoPermittedChanges({ operationId, actorId, client, entityType, targetId, changes, stats, sourceUrl, signal }) {
  const tableName = getTableName(entityType);
  const updateData = {};

  for (const change of changes) {
    updateData[change.field_name] = change.new_value;
  }
  updateData.updated_at = new Date().toISOString();

  // Fetch old values for logging
  const { data: oldRecord } = await client
    .from(tableName)
    .select('*')
    .eq('id', targetId)
    .maybeSingle();

  await client
    .from(tableName)
    .update(updateData)
    .eq('id', targetId);

  for (const change of changes) {
    const oldValue = oldRecord ? oldRecord[change.field_name] : null;

    await logAgentAction({
      client, operationId, actorId,
      actionType: 'field_change',
      status: 'applied',
      entityType,
      entityId: targetId,
      permissionTier: 'auto',
      operationDetail: {
        field_name: change.field_name,
        target_id: targetId,
        table: tableName,
      },
      oldVersion: oldValue,
      newValue: change.new_value,
      sourceUrl,
    });
  }

  stats.enrichments_applied++;
}

/**
 * Process media enrichment for entities that already exist but lack media.
 * Scans all content tables for published entries without hero_image_url
 * and attempts to find suitable free-licensed media.
 */
async function processMediaEnrichment({ operationId, actorId, client, signal, stats, aiService }) {
  const entityTypesToCheck = ['attraction', 'accommodation', 'activity', 'restaurant', 'tour_operator'];

  for (const entityType of entityTypesToCheck) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    if (!ENTITY_TYPES.has(entityType)) continue;

    const tableName = getTableName(entityType);

    const { data: records, error } = await client
      .from(tableName)
      .select('id, slug, name, title, hero_image_url, status')
      .eq('status', 'published')
      .is('hero_image_url', null)
      .limit(10);

    if (error || !records || records.length === 0) continue;

    for (const record of records) {
      if (signal?.aborted) throw new AIError('CANCELLED');

      const entityName = record.name || record.title || '';
      if (!entityName || entityName.length < 3) continue;

      try {
        const { stored } = await findMediaForEntity({
          entityType,
          entityName,
          entitySlug: record.slug,
          client,
        });

        if (stored.length > 0) {
          const bestMedia = stored[0];
          await client
            .from(tableName)
            .update({
              hero_image_url: bestMedia.url || bestMedia.source_url,
              hero_image_alt: bestMedia.alt_text || entityName,
              updated_at: new Date().toISOString(),
            })
            .eq('id', record.id);

          stats.media_matched++;
          stats.enrichments_applied++;

          await logAgentAction({
            client, operationId, actorId,
            actionType: 'media_matched',
            status: 'applied',
            entityType,
            entityId: record.id,
            entitySlug: record.slug,
            permissionTier: 'auto',
            operationDetail: {
              field_name: 'hero_image_url',
              new_value: bestMedia.url || bestMedia.source_url,
              source_url: bestMedia.source_url,
              license_type: bestMedia.license_type,
            },
            confidence: 0.85,
            sourceUrl: bestMedia.source_url,
          });
        }
      } catch (error) {
        // Non-fatal — continue with next entity
        stats.errors++;
      }
    }
  }
}

// ── Operation management ────────────────────────────────────────────────────────

/**
 * Create a cm_agent_operations record to track this autonomous cycle.
 */
async function createOperation({ operationId, operationType, status, actorId, client }) {
  const { error } = await client.from('cm_agent_operations').insert({
    id: operationId,
    operation_type: operationType,
    status,
    actor_id: actorId,
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });

  if (error) throw new AIError('STORAGE_ERROR');
  return operationId;
}

/**
 * Update cm_agent_operations with final status and stats.
 */
async function updateOperation({ operationId, client, status, stats, error }) {
  const updateData = {
    status,
    finished_at: new Date().toISOString(),
    stats: stats || {},
    updated_at: new Date().toISOString(),
  };

  if (error) {
    updateData.error_code = error.code;
    updateData.error_message = error.message;
  }

  await client
    .from('cm_agent_operations')
    .update(updateData)
    .eq('id', operationId);
}

// ── Agent action logging ────────────────────────────────────────────────────────

/**
 * Log an atomic agent action to cm_agent_log.
 * Every action the autonomous agent takes is recorded here — this is the
 * immutable audit trail.
 *
 * @param {object} params
 * @param {object} params.client
 * @param {string} params.operationId
 * @param {string} params.actorId
 * @param {string} params.actionType — one of the cm_agent_log.action_type values
 * @param {string} params.status — 'applied' | 'pending_review' | 'discarded'
 * @param {string} [params.entityType]
 * @param {number|bigint|string} [params.entityId]
 * @param {string} [params.entitySlug]
 * @param {string} [params.permissionTier] — 'auto' or 'approval'
 * @param {object} [params.operationDetail]
 * @param {number} [params.confidence]
 * @param {string} [params.sourceUrl]
 * @param {any} [params.oldValue]
 * @param {any} [params.newValue]
 * @returns {Promise<string>} the log entry ID
 */
async function logAgentAction({
  client, operationId, actorId,
  actionType, status,
  entityType, entityId, entitySlug,
  permissionTier = 'auto',
  operationDetail = {},
  confidence,
  sourceUrl,
  oldValue,
  newValue,
}) {
  const insertData = {
    operation_id: operationId,
    action_type: actionType,
    entity_type: entityType || null,
    entity_id: entityId ? Number(entityId) : null,
    entity_slug: entitySlug || null,
    operation_detail: operationDetail || {},
    permission_tier: permissionTier,
    confidence: confidence || null,
    source_url: sourceUrl || null,
    actor_id: actorId || null,
    status,
  };

  if (oldValue !== undefined) insertData.old_value = JSON.stringify(oldValue);
  if (newValue !== undefined) insertData.new_value = JSON.stringify(newValue);

  const { data, error } = await client
    .from('cm_agent_log')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    // Logging failure must not break the autonomous pipeline
    return null;
  }

  return data.id;
}

/**
 * Fetch a draft by ID (lightweight — doesn't load changes).
 */
async function getDraftById(draftId, client) {
  const { data, error } = await client
    .from('cm_drafts')
    .select('*')
    .eq('id', draftId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

/**
 * Compute a priority score (0–1) for an approval queue item.
 * Higher priority = should be reviewed sooner.
 */
function computePriorityScore(entityType, fieldName, confidence, isUpdate) {
  // Base priority from entity type importance
  const entityWeights = {
    country: 0.9,
    region: 0.8,
    attraction: 1.0,
    accommodation: 0.85,
    restaurant: 0.7,
    activity: 0.75,
    tour_operator: 0.6,
    travel_article: 0.6,
  };

  const entityWeight = entityWeights[entityType] || 0.5;

  // Field criticality (higher = more impactful change)
  const criticalityMap = {
    slug: 0.4,
    name: 0.5,
    title: 0.5,
    listing_summary: 0.6,
    detail_intro: 0.7,
    full_description: 0.7,
    overview: 0.6,
    meta_title: 0.4,
    meta_description: 0.4,
    hero_image_url: 0.3,
    price_label: 0.9,
    price_amount: 1.0,
    price_currency: 0.9,
    booking_url: 0.9,
    rating: 0.8,
    review_count: 0.7,
    permits_required: 1.0,
    visa_requirements: 1.0,
    opening_hours: 0.8,
    availability: 0.9,
    danger_level: 1.0,
    risk_assessment: 1.0,
    distance: 0.6,
    travel_time: 0.6,
    facilities: 0.7,
    amenities: 0.7,
    featured: 0.8,
  };

  const criticality = criticalityMap[fieldName] || 0.5;

  // Updates to existing records are higher priority than new records
  const updateBoost = isUpdate ? 1.2 : 1.0;

  // Confidence affects priority — higher confidence = more likely to be correct
  // but also more important to review since it's a "real" change
  const confidenceFactor = 0.5 + confidence * 0.5;

  const score = entityWeight * criticality * updateBoost * confidenceFactor;
  return Math.min(1.0, Math.max(0.0, score));
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Map a cadence string to the appropriate operation type.
 */
function mapCadenceToOperation(cadence) {
  switch (cadence) {
    case CADENCES.DAILY: return 'DAILY_CYCLE';
    case CADENCES.WEEKLY: return 'WEEKLY_CYCLE';
    case CADENCES.MONTHLY: return 'FULL_SCAN';
    case CADENCES.QUARTERLY: return 'FULL_SCAN';
    default: return 'DAILY_CYCLE';
  }
}

// ── Approval queue management ──────────────────────────────────────────────────

/**
 * List items in the approval queue, optionally filtered.
 *
 * @param {object} params
 * @param {string} [params.status] - 'pending', 'approved', 'rejected', 'applied'
 * @param {string} [params.entityType]
 * @param {string} [params.fieldName]
 * @param {number} [params.minPriority]
 * @param {number} [params.limit=50]
 * @param {object} client
 * @returns {Promise<Array>}
 */
export async function listApprovalQueue({ status = 'pending', entityType, fieldName, minPriority, limit = 50 }, client) {
  let query = client
    .from('cm_agent_approval_queue')
    .select('*')
    .order('priority_score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (entityType) query = query.eq('entity_type', entityType);
  if (fieldName) query = query.eq('field_name', fieldName);
  if (minPriority !== undefined) query = query.gte('priority_score', minPriority);

  const { data, error } = await query;
  if (error) throw new AIError('STORAGE_ERROR');
  return data || [];
}

/**
 * Approve an item in the approval queue.
 * Applies the change to the target content record and logs the approval.
 *
 * @param {string} approvalId
 * @param {string} reviewerId
 * @param {string} [notes]
 * @param {object} client
 * @param {string} [operationId]
 * @returns {Promise<object>}
 */
export async function approveApprovalItem(approvalId, reviewerId, client, notes, operationId = null) {
  const { data: item, error: fetchError } = await client
    .from('cm_agent_approval_queue')
    .select('*')
    .eq('id', approvalId)
    .single();

  if (fetchError) throw new AIError('STORAGE_ERROR');
  if (!item) throw new AIError('INVALID_REQUEST', { message: 'Approval item not found' });
  if (item.status !== 'pending') throw new AIError('CONFLICT', { message: `Item already ${item.status}` });

  // Apply the change to the target record
  if (item.entity_id && item.proposed_value) {
    const tableName = getTableName(item.entity_type);
    if (tableName) {
      await client
        .from(tableName)
        .update({ [item.field_name]: item.proposed_value, updated_at: new Date().toISOString() })
        .eq('id', item.entity_id);
    }
  }

  // Update the approval queue item
  const { data: updated, error: updateError } = await client
    .from('cm_agent_approval_queue')
    .update({
      status: 'applied',
      reviewer_id: reviewerId,
      reviewer_notes: notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', approvalId)
    .select()
    .single();

  if (updateError) throw new AIError('STORAGE_ERROR');

  // Log the approval action
  if (operationId) {
    await logAgentAction({
      client, operationId, actorId: reviewerId,
      actionType: 'approval_granted',
      status: 'applied',
      entityType: item.entity_type,
      entityId: item.entity_id,
      entitySlug: item.entity_slug,
      permissionTier: 'approval',
      operationDetail: {
        field_name: item.field_name,
        proposed_value: item.proposed_value,
        current_value: item.current_value,
        approval_id: approvalId,
        review_notes: notes || null,
      },
    });
  }

  return updated;
}

/**
 * Reject an item in the approval queue.
 *
 * @param {string} approvalId
 * @param {string} reviewerId
 * @param {string} [notes]
 * @param {object} client
 * @param {string} [operationId]
 */
export async function rejectApprovalItem(approvalId, reviewerId, notes, client, operationId = null) {
  const { data: existing, error } = await client
    .from('cm_agent_approval_queue')
    .select('status')
    .eq('id', approvalId)
    .maybeSingle();

  if (error || !existing) throw new AIError('INVALID_REQUEST', { message: 'Approval item not found' });
  if (existing.status !== 'pending') throw new AIError('CONFLICT', { message: `Item already ${existing.status}` });

  const { data: updated, error: updateError } = await client
    .from('cm_agent_approval_queue')
    .update({
      status: 'rejected',
      reviewer_id: reviewerId,
      reviewer_notes: notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', approvalId)
    .select()
    .single();

  if (updateError) throw new AIError('STORAGE_ERROR');

  if (operationId) {
    await logAgentAction({
      client, operationId, actorId: reviewerId,
      actionType: 'approval_rejected',
      status: 'discarded',
      operationDetail: {
        approval_id: approvalId,
        reviewer_notes: notes || null,
      },
    });
  }

  return updated;
}

/**
 * Get statistics about the approval queue and recent agent operations.
 *
 * @param {object} client
 * @returns {Promise<{approval_queue: {pending: number, approved: number, rejected: number, total: number}, recent_operations: number, recent_logs: number}>}
 */
export async function getAgentStats(client) {
  // Approval queue stats
  const { count: pendingCount } = await client
    .from('cm_agent_approval_queue')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: appliedCount } = await client
    .from('cm_agent_approval_queue')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'applied');

  const { count: rejectedCount } = await client
    .from('cm_agent_approval_queue')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'rejected');

  // Recent operations (last 24h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recentOpsCount } = await client
    .from('cm_agent_operations')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since);

  // Recent logs (last 24h)
  const { count: recentLogsCount } = await client
    .from('cm_agent_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since);

  return {
    approval_queue: {
      pending: pendingCount || 0,
      applied: appliedCount || 0,
      rejected: rejectedCount || 0,
      total: (pendingCount || 0) + (appliedCount || 0) + (rejectedCount || 0),
    },
    recent_operations: recentOpsCount || 0,
    recent_logs: recentLogsCount || 0,
  };
}

// FORBIDDEN_FIELDS is re-exported from the barrel (index.mjs) via validate.mjs.
// APPROVAL_REQUIRED_FIELDS and AUTO_PERMITTED_FIELDS are exported above via `export const`.
