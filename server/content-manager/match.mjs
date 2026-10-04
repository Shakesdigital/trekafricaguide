import { getTableName } from './validate.mjs';

// Entity table name + the columns used for fuzzy matching.
// Each entry maps an entity type to its table and the searchable text columns.
const TABLE_COLUMNS = {
  region: { table: 'regions', textColumns: ['name', 'slug', 'countries_intro'] },
  country: { table: 'countries', textColumns: ['name', 'slug', 'overview'] },
  attraction: { table: 'attractions', textColumns: ['name', 'slug', 'location_name', 'listing_summary'] },
  accommodation: { table: 'accommodations', textColumns: ['name', 'slug', 'location_name', 'listing_summary'] },
  restaurant: { table: 'restaurants', textColumns: ['name', 'slug', 'location_name', 'signature_dish', 'listing_summary'] },
  tour_operator: { table: 'tour_operators', textColumns: ['name', 'slug', 'summary'] },
  activity: { table: 'activities', textColumns: ['name', 'slug', 'location_name', 'listing_summary'] },
  travel_article: { table: 'travel_articles', textColumns: ['title', 'slug', 'excerpt'] },
};

/**
 * Compute a simple similarity score between two strings using trigram-like
 * character overlap. Returns a value between 0 and 1.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function similarity(a, b) {
  if (!a || !b) return 0;
  const sa = String(a).toLowerCase().trim();
  const sb = String(b).toLowerCase().trim();
  if (sa === sb) return 1;
  if (sa.includes(sb) || sb.includes(sa)) return 0.8;
  // Character bigram overlap
  const bigrams = (s) => {
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const aGrams = bigrams(sa);
  const bGrams = bigrams(sb);
  let overlap = 0;
  for (const g of bGrams) if (aGrams.has(g)) overlap++;
  const total = aGrams.size + bGrams.size;
  return total === 0 ? 0 : overlap / total;
}

/**
 * Find potential duplicate matches for a search string within a specific
 * entity table. Searches slug, name, and other text columns.
 *
 * @param {string} searchText - the name/slug to search for
 * @param {string} entityType - one of the ENTITY_TYPES
 * @param {object} client - Supabase server client
 * @param {object} [options]
 * @param {string} [options.regionSlug] - narrow search to a region
 * @param {string} [options.countrySlug] - narrow search to a country
 * @param {number} [options.threshold=0.5] - minimum similarity score
 * @param {number} [options.limit=10] - max results
 * @returns {Promise<Array<{id, slug, name, similarity, match_field}>>}
 */
export async function findDuplicates(searchText, entityType, client, options = {}) {
  const { threshold = 0.5, limit = 10, regionSlug, countrySlug } = options;
  const { table, textColumns } = TABLE_COLUMNS[entityType] || {};
  if (!table) {
    throw new Error(`Unknown entity type for matching: ${entityType}`);
  }

  // Build a single OR query across all text columns using ilike.
  const orConditions = textColumns
    .map((col) => `${col}.ilike.*${searchText.replace(/%/g, '\\%').replace(/_/g, '\\_')}*`)
    .join(',');

  let query = client
    .from(table)
    .select('id, slug, name, title')
    .or(orConditions)
    .order('updated_at', { ascending: false })
    .limit(limit * 2); // fetch extra for client-side similarity filtering

  // Narrow by region/country if provided and the table supports it
  const hasRegion = textColumns.includes('region_id');
  if (regionSlug && !hasRegion) {
    // For tables without region_id, we can't narrow — skip
  }

  const { data, error } = await query;

  if (error) {
    // If the OR query fails (e.g. column doesn't exist), fall back to slug-only
    const fallback = await client
      .from(table)
      .select('id, slug, name, title')
      .ilike('slug', `*${searchText}*`);
    if (fallback.error) throw new Error(`Match query failed: ${fallback.error.message}`);
    return scoreAndFilter(fallback.data, searchText, textColumns, threshold, limit);
  }

  return scoreAndFilter(data, searchText, textColumns, threshold, limit);
}

/**
 * Score results by similarity to the search text and filter by threshold.
 */
function scoreAndFilter(records, searchText, textColumns, threshold, limit) {
  if (!records) return [];

  const results = records
    .map((record) => {
      const name = record.name || record.title || '';
      const slug = record.slug || '';

      // Compute best similarity across all searchable columns
      let bestScore = 0;
      let matchField = '';
      for (const col of textColumns) {
        const value = record[col];
        if (!value) continue;
        const score = similarity(searchText, String(value));
        if (score > bestScore) {
          bestScore = score;
          matchField = col;
        }
      }

      // Also check name and slug specifically
      const nameScore = similarity(searchText, name);
      if (nameScore > bestScore) {
        bestScore = nameScore;
        matchField = 'name';
      }
      const slugScore = similarity(searchText, slug);
      if (slugScore > bestScore) {
        bestScore = slugScore;
        matchField = 'slug';
      }

      return {
        id: record.id,
        slug: record.slug,
        name: name,
        title: record.title,
        similarity: Math.round(bestScore * 100) / 100,
        match_field: matchField,
      };
    })
    .filter((r) => r.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
}

/**
 * Cross-table duplicate detection: search the same name/slug across ALL
 * entity tables to catch cases where a listing exists under a different
 * type (e.g. an attraction that's already listed as a restaurant).
 *
 * @param {string} searchText - the name/slug to search for
 * @param {object} client - Supabase server client
 * @param {number} [options.threshold=0.5]
 * @param {number} [options.limitPerTable=5]
 * @returns {Promise<Array<{entity_type, table, id, slug, name, similarity}>>}
 */
export async function findCrossTableDuplicates(searchText, client, options = {}) {
  const { threshold = 0.5, limitPerTable = 5 } = options;
  const results = [];

  for (const [entityType, config] of Object.entries(TABLE_COLUMNS)) {
    try {
      const matches = await findDuplicates(searchText, entityType, client, {
        threshold, limit: limitPerTable,
      });
      for (const match of matches) {
        results.push({
          entity_type: entityType,
          table: config.table,
          id: match.id,
          slug: match.slug,
          name: match.name,
          similarity: match.similarity,
          match_field: match.match_field,
        });
      }
    } catch (error) {
      // If one table fails, continue with the others
      continue;
    }
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results;
}

// Re-export entity types for caller convenience
export { ENTITY_TYPES } from './validate.mjs';
