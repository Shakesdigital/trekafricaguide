import { AIError } from '../ai/errors.mjs';
import { findDuplicates, findCrossTableDuplicates } from '../content-manager/match.mjs';
import { EXTRACTABLE_FIELDS, getTableName } from '../content-manager/validate.mjs';

// Threshold for treating two records as the same entity (duplicate).
const DUPLICATE_SIMILARITY_THRESHOLD = 0.95;

// Threshold below which a match is ignored entirely.
const MIN_SIMILARITY_THRESHOLD = 0.4;

// Fields that, if they conflict, indicate a "conflict" discovery type rather
// than a simple "update". These are identity-critical fields.
const CONFLICT_FIELDS = new Set([
  'slug', 'name', 'location_name',
]);

/**
 * Compare discovered data against an existing record to categorize the finding.
 *
 * Categories:
 * - 'new': no existing record found by slug/name similarity
 * - 'duplicate': exact slug or name match (similarity >= 0.95)
 * - 'update': record exists, fields differ → field-level diffs
 * - 'enrichment': record exists, new fields have data that existing record lacks
 * - 'conflict': record exists, key fields contradict (e.g., different location)
 *
 * @param {object} params
 * @param {object} params.discoveredData - extracted fields from AI (already masked/validated)
 * @param {object} params.existingRecord - the matched existing content record
 * @param {string} params.entityType - one of ENTITY_TYPES
 * @param {number} [params.matchSimilarity] - similarity score that triggered the match (0-1)
 * @returns {Promise<{category, existingRecord, fieldDiffs, confidence}>}
 */
export async function compareDiscovery({ discoveredData, existingRecord, entityType, matchSimilarity = 0 }, client) {
  const allowed = EXTRACTABLE_FIELDS[entityType];
  if (!allowed) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${entityType}` });
  }

  if (!existingRecord) {
    // No existing record found at all → this is genuinely new
    return {
      category: 'new',
      existingRecord: null,
      fieldDiffs: [],
      confidence: 1.0,
    };
  }

  // Check for exact duplicate (very high similarity on slug or name)
  if (matchSimilarity >= DUPLICATE_SIMILARITY_THRESHOLD) {
    return {
      category: 'duplicate',
      existingRecord,
      fieldDiffs: [],
      confidence: matchSimilarity,
    };
  }

  // Compute field-level diffs between discovered and existing data
  const fieldDiffs = [];
  const enrichmentFields = [];
  const conflictFields = [];

  for (const field of allowed) {
    const discoveredValue = discoveredData[field];
    const existingValue = existingRecord[field];

    // Skip if both are null/undefined
    if (isNullOrEmpty(discoveredValue) && isNullOrEmpty(existingValue)) continue;

    if (isNullOrEmpty(discoveredValue)) {
      // Discovered has no value but existing does — not a diff to apply
      continue;
    }

    if (isNullOrEmpty(existingValue)) {
      // Existing has no value but discovered does → enrichment
      enrichmentFields.push(field);
      fieldDiffs.push({
        field_name: field,
        old_value: existingValue,
        new_value: discoveredValue,
        type: 'enrichment',
      });
      continue;
    }

    // Both have values — check for conflict or update
    const valuesEqual = JSON.stringify(existingValue) === JSON.stringify(discoveredValue);

    if (!valuesEqual) {
      if (CONFLICT_FIELDS.has(field)) {
        conflictFields.push({ field_name: field, old_value: existingValue, new_value: discoveredValue });
      } else {
        fieldDiffs.push({
          field_name: field,
          old_value: existingValue,
          new_value: discoveredValue,
          type: 'update',
        });
      }
    }
  }

  // Determine final category based on conflict vs update vs enrichment
  if (conflictFields.length > 0) {
    return {
      category: 'conflict',
      existingRecord,
      fieldDiffs: conflictFields.map((c) => ({
        field_name: c.field_name,
        old_value: c.old_value,
        new_value: c.new_value,
        type: 'conflict',
      })),
      confidence: 0.3, // conflicts need manual review — low confidence
    };
  }

  if (enrichmentFields.length > 0 && fieldDiffs.filter((d) => d.type === 'update').length === 0) {
    // Only enrichment, no updates → 'enrichment'
    return {
      category: 'enrichment',
      existingRecord,
      fieldDiffs,
      confidence: 0.6,
    };
  }

  if (fieldDiffs.filter((d) => d.type === 'update').length > 0) {
    // At least one field changed → 'update'
    return {
      category: 'update',
      existingRecord,
      fieldDiffs,
      confidence: 0.7,
    };
  }

  // Record exists and nothing differs — treat as enrichment at minimum
  if (enrichmentFields.length > 0) {
    return {
      category: 'enrichment',
      existingRecord,
      fieldDiffs,
      confidence: 0.6,
    };
  }

  // Same data → duplicate (informational)
  return {
    category: 'duplicate',
    existingRecord,
    fieldDiffs: [],
    confidence: 0.9,
  };
}

/**
 * Run discovery comparison for a search name across all entity tables.
 * Uses findDuplicates for the target entity and findCrossTableDuplicates
 * for cross-table matches. Returns the best existing record found (if any)
 * and the comparison result.
 *
 * @param {object} params
 * @param {string} params.searchName - name to search for
 * @param {string} params.targetEntity - the entity type from classification
 * @param {string} [params.targetSlug] - slug from discovered data (for exact match detection)
 * @param {object} params.discoveredData - extracted fields
 * @param {object} params.client - Supabase server client
 * @returns {Promise<{comparison, duplicates}>}
 */
export async function compareAcrossTables({ searchName, targetEntity, targetSlug, discoveredData, client }) {
  const duplicates = [];

  // 1. Find duplicates within the target entity type
  if (searchName) {
    const targetMatches = await findDuplicates(
      searchName, targetEntity, client,
      { threshold: MIN_SIMILARITY_THRESHOLD, limit: 10 }
    );
    for (const match of targetMatches) {
      duplicates.push({
        entity_type: targetEntity,
        id: match.id,
        slug: match.slug,
        name: match.name,
        similarity: match.similarity,
        match_field: match.match_field,
        cross_table: false,
      });
    }
  }

  // 2. Cross-table duplicate detection (same name in other entity types)
  if (searchName && searchName.length > 3) {
    const crossDuplicates = await findCrossTableDuplicates(searchName, client, {
      threshold: 0.5, limitPerTable: 3,
    });
    for (const cd of crossDuplicates) {
      duplicates.push({
        entity_type: cd.entity_type,
        id: cd.id,
        slug: cd.slug,
        name: cd.name,
        similarity: cd.similarity,
        match_field: cd.match_field,
        cross_table: true,
      });
    }
  }

  // 3. Check for exact slug match across all tables
  if (targetSlug) {
    for (const [entityType, config] of Object.entries(getAllTableConfig())) {
      try {
        const { data, error } = await client
          .from(config.table)
          .select('id, slug, name, title')
          .eq('slug', targetSlug)
          .maybeSingle();
        if (!error && data) {
          const alreadyListed = duplicates.some(
            (d) => d.entity_type === entityType && String(d.id) === String(data.id)
          );
          if (!alreadyListed) {
            duplicates.push({
              entity_type,
              id: data.id,
              slug: data.slug,
              name: data.name || data.title,
              similarity: 1.0,
              match_field: 'slug',
              cross_table: entityType !== targetEntity,
            });
          }
        }
      } catch {
        // Continue if one table fails
      }
    }
  }

  // Sort by similarity descending
  duplicates.sort((a, b) => b.similarity - a.similarity);

  // Use the best match for comparison
  const bestMatch = duplicates.length > 0 ? duplicates[0] : null;

  let existingRecord = null;
  if (bestMatch) {
    // Fetch the full existing record for comparison
    const table = getTableName(bestMatch.entity_type);
    try {
      const { data, error } = await client
        .from(table)
        .select('*')
        .eq('id', bestMatch.id)
        .maybeSingle();
      if (!error && data) {
        existingRecord = data;
      }
    } catch {
      // If fetch fails, proceed with null — comparison will treat as 'new'
    }
  }

  const comparison = await compareDiscovery({
    discoveredData,
    existingRecord,
    entityType: targetEntity,
    matchSimilarity: bestMatch ? bestMatch.similarity : 0,
  }, client);

  return { comparison, duplicates };
}

// Table config for cross-table slug lookup (mirrors match.mjs TABLE_COLUMNS)
function getAllTableConfig() {
  return {
    region: { table: 'regions', textColumns: ['name', 'slug'] },
    country: { table: 'countries', textColumns: ['name', 'slug'] },
    attraction: { table: 'attractions', textColumns: ['name', 'slug'] },
    accommodation: { table: 'accommodations', textColumns: ['name', 'slug'] },
    restaurant: { table: 'restaurants', textColumns: ['name', 'slug'] },
    tour_operator: { table: 'tour_operators', textColumns: ['name', 'slug'] },
    activity: { table: 'activities', textColumns: ['name', 'slug'] },
    travel_article: { table: 'travel_articles', textColumns: ['title', 'slug'] },
  };
}

function isNullOrEmpty(value) {
  return value === null || value === undefined || value === '';
}
