// Content Opportunity Engine: scans existing CMS content for gaps, sparsity,
// staleness, missing media, missing metadata, and missing relationships.
// Results are stored in cm_content_opportunities for admin triage.
import { randomUUID } from 'node:crypto';
import { AIError } from '../ai/errors.mjs';
import { getTableName, EXTRACTABLE_FIELDS, ENTITY_TYPES } from '../content-manager/validate.mjs';
import { getAIService } from '../ai/service.mjs';
import { readServerConfig } from '../ai/config.mjs';

// ── Cadence definitions ───────────────────────────────────────────────────────

// Days of staleness before content is flagged.
const STALE_CONTENT_DAYS = 90;

// Content older than this is considered "recently published" and gets
// higher priority for missing-media checks.
const RECENT_PUBLICATION_DAYS = 30;

// Minimum field completeness (0–1) before a listing is considered "sparse".
const SPARSE_THRESHOLD = 0.5;

// Entity type priority weights for scoring (higher = more important).
const ENTITY_PRIORITY = {
  country: 0.9,
  region: 0.8,
  attraction: 1.0,
  accommodation: 0.85,
  restaurant: 0.7,
  activity: 0.7,
  tour_operator: 0.6,
  travel_article: 0.65,
};

// Tables that represent "destination-level" content (countries, regions,
// attractions) — checked for coverage gaps.
const COVERAGE_TABLES = ['regions', 'countries', 'attractions', 'activities', 'accommodations', 'restaurants', 'tour_operators', 'travel_articles'];

// ── Opportunity type constants ────────────────────────────────────────────────

export const OPPORTUNITY_TYPES = {
  MISSING_LISTING: 'missing_listing',
  SPARSE_LISTING: 'sparse_listing',
  STALE_CONTENT: 'stale_content',
  MISSING_MEDIA: 'missing_media',
  MISSING_METADATA: 'missing_metadata',
  MISSING_RELATIONSHIP: 'missing_relationship',
  MISSING_INTERNAL_LINK: 'missing_internal_link',
  ORPHANED_CONTENT: 'orphaned_content',
};

export const CADENCES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
};

export const STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
};

/**
 * Main entry point — run content gap scans for a given cadence.
 * Dispatches to the appropriate set of scanners.
 *
 * @param {object} params
 * @param {string} params.cadence - 'daily' | 'weekly' | 'monthly' | 'quarterly'
 * @param {string} params.actorId - admin user ID
 * @param {object} params.client - Supabase server client
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{scanned, newOpportunities, opportunities, results}>}
 */
export async function scanContentGaps({ cadence, actorId, client, aiService: injectedService, signal }) {
  if (!['daily', 'weekly', 'monthly', 'quarterly'].includes(cadence)) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown cadence: ${cadence}` });
  }

  const aiService = injectedService || getAIService(process.env);

  // Mark the scan start time so we can exclude recently-seen opportunities.
  const scanAt = new Date().toISOString();

  const result = {
    scanned: 0,
    newOpportunities: 0,
    opportunities: [],
    results: {},
  };

  // ── Daily scanners ─────────────────────────────────────────────────────
  // Stale content, newly published listings missing media, missing meta images
  const dailyScanners = [
    { name: 'stale_content', fn: scanStaleContent },
    { name: 'missing_meta_images', fn: scanMissingMetaImages },
    { name: 'new_listings_without_media', fn: scanNewListingsWithoutMedia },
  ];

  // ── Weekly scanners ────────────────────────────────────────────────────
  const weeklyScanners = [
    { name: 'missing_media', fn: scanMissingMedia },
    { name: 'missing_metadata', fn: scanMissingMetadata },
    { name: 'missing_relationships', fn: scanMissingRelationships },
  ];

  // ── Monthly scanners ───────────────────────────────────────────────────
  const monthlyScanners = [
    { name: 'sparse_listings', fn: scanSparseListings },
    { name: 'coverage_gaps', fn: scanCoverageGaps },
  ];

  // ── Quarterly scanners ─────────────────────────────────────────────────
  const quarterlyScanners = [
    { name: 'stale_content', fn: scanStaleContent },
    { name: 'orphaned_content', fn: scanOrphanedContent },
    { name: 'outdated_sources', fn: scanOutdatedSources },
  ];

  const scannerSets = {
    daily: dailyScanners,
    weekly: weeklyScanners,
    monthly: [...monthlyScanners, ...weeklyScanners],
    quarterly: [...quarterlyScanners, ...monthlyScanners, ...weeklyScanners],
  };

  const scanners = scannerSets[cadence];

  for (const { name, fn } of scanners) {
    if (signal?.aborted) throw new AIError('CANCELLED');

    try {
      const scanResult = await fn({ cadence, actorId, client, aiService, scanAt, signal });
      result.scanned += scanResult.scanned;
      result.newOpportunities += scanResult.newOpportunities;
      result.opportunities.push(...(scanResult.opportunities || []));
      result.results[name] = {
        scanned: scanResult.scanned,
        new_opportunities: scanResult.newOpportunities,
      };
    } catch (error) {
      // A scanner failure doesn't abort the whole scan — log and continue
      result.results[name] = { error: true, message: safeErrorMessage(error) };
    }
  }

  return result;
}

// ── Scanner: Missing Hero Images & Gallery ────────────────────────────────────
// For weekly cadence: find published listings missing hero_image_url, gallery,
// or meta_image_url. For daily cadence: focus on featured/published entries
// that are recent (within RECENT_PUBLICATION_DAYS).

/**
 * Find published listings missing hero images, galleries, or meta images.
 * Runs across all entity tables.
 */
export async function scanMissingMedia({ cadence, actorId, client, aiService, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;

  const mediaFieldsByEntity = {
    region: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
    country: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
    attraction: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
    accommodation: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
    restaurant: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
    tour_operator: ['hero_image_url', 'hero_image_alt', 'meta_image_url'],
    activity: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
    travel_article: ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'],
  };

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);
    const mediaFields = mediaFieldsByEntity[entityType] || ['hero_image_url', 'hero_image_alt', 'gallery', 'meta_image_url'];

    // Build OR conditions for null/empty media fields
    const orConditions = mediaFields.map((f) => `${f}.is.null`).join(',');
    const { data, error } = await client
      .from(table)
      .select('id, slug, name, title, status, updated_at, published_at, region_id, country_id')
      .or(orConditions);

    if (error) {
      // Table might not have all columns — skip
      continue;
    }

    for (const row of data || []) {
      scanned++;

      const missingFields = [];
      for (const field of mediaFields) {
        if (!row[field] || (Array.isArray(row[field]) && row[field].length === 0) || row[field] === 'image-slot:') {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        const pubStatus = row.published_at ? 'published' : 'draft';
        const priority = pubStatus === 'published' ? CADENCES.WEEKLY : CADENCES.WEEKLY;

        const opp = await createOpportunity({
          opportunityType: OPPORTUNITY_TYPES.MISSING_MEDIA,
          entityType,
          entityId: row.id,
          entitySlug: row.slug,
          title: `Missing media for ${row.name || row.title || row.slug}`,
          description: `Published listing is missing: ${missingFields.join(', ')}`,
          gapDetails: { missing_fields: missingFields, media_fields_checked: mediaFields },
          cadence,
          priority,
          actorId,
          client,
          scanAt,
        });

        if (opp) {
          opportunities.push(opp);
        }
      }
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Missing Meta Images (daily focus) ────────────────────────────────

/**
 * Daily scanner: focus on recently published or featured content missing
 * hero_image_url specifically.
 */
export async function scanMissingMetaImages({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;
  const recentCutoff = new Date(Date.now() - RECENT_PUBLICATION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);

    // Find recent or featured content without hero_image_url
    const { data: recentRows, error: recentErr } = await client
      .from(table)
      .select('id, slug, name, title, hero_image_url, featured, published_at, updated_at')
      .is('hero_image_url', null)
      .gte('published_at', recentCutoff)
      .order('published_at', { ascending: false });

    const { data: featuredRows, error: featuredErr } = await client
      .from(table)
      .select('id, slug, name, title, hero_image_url, featured, published_at, updated_at')
      .eq('featured', true)
      .is('hero_image_url', null);

    const rows = [...(recentRows || []), ...(featuredRows || [])];

    for (const row of rows) {
      const isDupe = opportunities.find((o) => o.entity_type === entityType && o.entity_id === row.id);
      if (isDupe) continue;

      scanned++;
      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_MEDIA,
        entityType,
        entityId: row.id,
        entitySlug: row.slug,
        title: `Missing hero image for ${row.name || row.title || row.slug}`,
        description: `Recently published or featured listing has no hero_image_url.`,
        gapDetails: { missing_fields: ['hero_image_url'], reason: 'recent_or_featured' },
        cadence: CADENCES.DAILY,
        priority: CADENCES.DAILY,
        actorId,
        client,
        scanAt,
      });
      if (opp) opportunities.push(opp);
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: New Listings Without Media (daily) ─────────────────────────────────

/**
 * Daily scanner: find newly published content (within RECENT_PUBLICATION_DAYS)
 * that lacks a gallery or meta_image_url.
 */
export async function scanNewListingsWithoutMedia({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;
  const recentCutoff = new Date(Date.now() - RECENT_PUBLICATION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);

    const { data, error } = await client
      .from(table)
      .select('id, slug, name, title, gallery, meta_image_url, published_at')
      .gte('published_at', recentCutoff)
      .is('gallery', null);

    if (error) continue;

    for (const row of data || []) {
      scanned++;
      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_MEDIA,
        entityType,
        entityId: row.id,
        entitySlug: row.slug,
        title: `New listing ${row.name || row.title || row.slug} missing gallery`,
        description: `Published within the last ${RECENT_PUBLICATION_DAYS} days but has no gallery or meta_image_url.`,
        gapDetails: { missing_fields: ['gallery', 'meta_image_url'], reason: 'recent_publication' },
        cadence: CADENCES.DAILY,
        priority: CADENCES.DAILY,
        actorId,
        client,
        scanAt,
      });
      if (opp) opportunities.push(opp);
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Missing Metadata ────────────────────────────────────────────────

/**
 * Find published listings missing meta_title or meta_description.
 */
export async function scanMissingMetadata({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);

    const { data, error } = await client
      .from(table)
      .select('id, slug, name, title, meta_title, meta_description, status')
      .or('meta_title.is.null,meta_description.is.null');

    if (error) continue;

    for (const row of data || []) {
      scanned++;
      const missingFields = [];
      if (!row.meta_title) missingFields.push('meta_title');
      if (!row.meta_description) missingFields.push('meta_description');

      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_METADATA,
        entityType,
        entityId: row.id,
        entitySlug: row.slug,
        title: `Missing SEO metadata for ${row.name || row.title || row.slug}`,
        description: `Published listing missing: ${missingFields.join(', ')}`,
        gapDetails: { missing_fields: missingFields },
        cadence,
        priority: CADENCES.WEEKLY,
        actorId,
        client,
        scanAt,
      });
      if (opp) opportunities.push(opp);
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Stale Content ────────────────────────────────────────────────────

/**
 * Find published content that hasn't been updated in STALE_CONTENT_DAYS.
 */
export async function scanStaleContent({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;
  const staleCutoff = new Date(Date.now() - STALE_CONTENT_DAYS * 24 * 60 * 60 * 1000).toISOString();

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);

    const { data, error } = await client
      .from(table)
      .select('id, slug, name, title, updated_at, published_at, status')
      .eq('status', 'published')
      .lte('updated_at', staleCutoff);

    if (error) continue;

    for (const row of data || []) {
      scanned++;
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(row.updated_at).getTime()) / (24 * 60 * 60 * 1000)
      );

      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.STALE_CONTENT,
        entityType,
        entityId: row.id,
        entitySlug: row.slug,
        title: `Stale content: ${row.name || row.title || row.slug}`,
        description: `Content last updated ${daysSinceUpdate} days ago (>${STALE_CONTENT_DAYS} days threshold).`,
        gapDetails: { days_since_update: daysSinceUpdate, threshold_days: STALE_CONTENT_DAYS, last_updated: row.updated_at },
        cadence,
        priority: daysSinceUpdate > STALE_CONTENT_DAYS * 2 ? CADENCES.DAILY : cadence,
        actorId,
        client,
        scanAt,
      });
      if (opp) opportunities.push(opp);
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Sparse Listings ──────────────────────────────────────────────────

/**
 * Find listings with low field completeness relative to EXTRACTABLE_FIELDS.
 */
export async function scanSparseListings({ cadence, actorId, client, aiService, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);
    const allowedFields = EXTRACTABLE_FIELDS[entityType] || [];

    if (allowedFields.length === 0) continue;

    // Fetch all published records with only the fields we need to check
    const selectCols = ['id', 'slug', 'name', 'title', 'status'].concat(allowedFields).join(',');
    const { data, error } = await client
      .from(table)
      .select(selectCols);

    if (error) continue;

    for (const row of data || []) {
      scanned++;

      const presentFields = allowedFields.filter(
        (f) => row[f] !== null && row[f] !== undefined && row[f] !== '' &&
          !(Array.isArray(row[f]) && row[f].length === 0)
      );
      const completeness = presentFields.length / allowedFields.length;

      if (completeness < SPARSE_THRESHOLD) {
        const missingFields = allowedFields.filter(
          (f) => !presentFields.includes(f)
        );

        const score = prioritizeOpportunity({
          entityType,
          status: row.status || 'draft',
          completeness,
          gapType: OPPORTUNITY_TYPES.SPARSE_LISTING,
        });

        const opp = await createOpportunity({
          opportunityType: OPPORTUNITY_TYPES.SPARSE_LISTING,
          entityType,
          entityId: row.id,
          entitySlug: row.slug,
          title: `Sparse listing: ${row.name || row.title || row.slug} (${Math.round(completeness * 100)}% complete)`,
          description: `${allowedFields.length - presentFields.length} of ${allowedFields.length} fields are empty. Missing: ${missingFields.slice(0, 5).join(', ')}${missingFields.length > 5 ? '...' : ''}`,
          gapDetails: {
            completeness,
            present_fields: presentFields,
            missing_fields: missingFields,
            total_fields: allowedFields.length,
          },
          cadence,
          priority: score >= 0.7 ? CADENCES.MONTHLY : score >= 0.4 ? CADENCES.QUARTERLY : CADENCES.QUARTERLY,
          priorityScore: score,
          actorId,
          client,
          scanAt,
        });
        if (opp) opportunities.push(opp);
      }
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Coverage Gaps ────────────────────────────────────────────────────

/**
 * Find countries/regions that lack entries, and entities missing relationships.
 * Checks: regions without countries, attractions without activities,
 * accommodations without attractions, etc.
 */
export async function scanCoverageGaps({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;

  // Check which entity tables have data
  const tableEntityMap = {
    regions: 'region',
    countries: 'country',
    attractions: 'attraction',
    activities: 'activity',
    accommodations: 'accommodation',
    restaurants: 'restaurant',
    tour_operators: 'tour_operator',
    travel_articles: 'travel_article',
  };

  const tableCounts = {};
  for (const [table, entityType] of Object.entries(tableEntityMap)) {
    const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
    if (!error) {
      tableCounts[table] = count;
      scanned++;
    }
  }

  // Check: countries without regions
  if (tableCounts.countries > 0 && (tableCounts.regions || 0) < 2) {
    const { data: countries } = await client.from('countries').select('id, slug, name, region_id').is('region_id', null);
    for (const country of countries || []) {
      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_LISTING,
        entityType: 'country',
        entityId: country.id,
        entitySlug: country.slug,
        title: `Country missing region assignment: ${country.name}`,
        description: `Country "${country.name}" has no region_id — consider adding to regions table.`,
        gapDetails: { country_id: country.id, country_slug: country.slug },
        cadence,
        priority: CADENCES.MONTHLY,
        actorId,
        client,
        scanAt,
      });
      if (opp) opportunities.push(opp);
    }
  }

  // Check: attractions without activities
  const { data: attractions, error: attrErr } = await client
    .from('attractions')
    .select('id, slug, name');
  if (!attrErr) {
    for (const attr of attractions || []) {
      scanned++;
      const { data: acts, error: actErr } = await client
        .from('activities')
        .select('id', { count: 'exact' })
        .eq('attraction_id', attr.id);
      const count = actErr ? 0 : (acts ? acts.length : 0);
      if (count === 0) {
        const opp = await createOpportunity({
          opportunityType: OPPORTUNITY_TYPES.MISSING_RELATIONSHIP,
          entityType: 'attraction',
          entityId: attr.id,
          entitySlug: attr.slug,
          title: `Attraction has no activities: ${attr.name}`,
          description: `Attraction "${attr.name}" has no linked activities. Consider adding activities.`,
          gapDetails: { attraction_id: attr.id, missing_relationship: 'activities' },
          cadence,
          priority: CADENCES.MONTHLY,
          actorId,
          client,
          scanAt,
        });
        if (opp) opportunities.push(opp);
      }
    }
  }

  // Check: attractions without accommodations (no direct FK, but check
  // if any accommodation lists this attraction in its location_name or
  // if the accommodation has a related_attraction field)
  // For now, just check if accommodations table has records at all
  if (tableCounts.attractions > 0 && (tableCounts.accommodations || 0) === 0) {
    const opp = await createOpportunity({
      opportunityType: OPPORTUNITY_TYPES.MISSING_LISTING,
      entityType: 'accommodation',
      entitySlug: 'coverage',
      title: 'No accommodations in database',
      description: `Found ${tableCounts.attractions} attractions but 0 accommodations — coverage gap.`,
      gapDetails: { attraction_count: tableCounts.attractions, accommodation_count: 0 },
      cadence,
      priority: CADENCES.MONTHLY,
      actorId,
      client,
      scanAt,
    });
    if (opp) opportunities.push(opp);
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Missing Relationships ────────────────────────────────────────────

/**
 * Find activities without attraction_id, tour_operators without region/country,
 * and other relationship gaps.
 */
export async function scanMissingRelationships({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;

  // Activities without attraction_id
  const { data: activities, error: actErr } = await client
    .from('activities')
    .select('id, slug, name, attraction_id')
    .is('attraction_id', null);
  if (!actErr) {
    for (const act of activities || []) {
      scanned++;
      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_RELATIONSHIP,
        entityType: 'activity',
        entityId: act.id,
        entitySlug: act.slug,
        title: `Activity without attraction link: ${act.name}`,
        description: `Activity "${act.name}" has no attraction_id — it should be linked to its parent attraction.`,
        gapDetails: { missing_field: 'attraction_id' },
        cadence,
        priority: CADENCES.WEEKLY,
        actorId,
        client,
        scanAt,
      });
      if (opp) opportunities.push(opp);
    }
  }

  // Tour operators without region/country (if the table has those columns)
  // These are softer checks — tour_operators schema may vary
  // Skipped if columns don't exist (graceful degradation)

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Orphaned Content ─────────────────────────────────────────────────

/**
 * Find published content with no media_assets rows AND no relationships.
 */
export async function scanOrphanedContent({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;

  // Check media_assets for existing associations
  const { data: mediaRefs, error: mediaErr } = await client
    .from('media_assets')
    .select('associated_entity_type, associated_entity_id')
    .not('associated_entity_type', 'is', null);

  const mediaKeys = new Set();
  if (!mediaErr) {
    for (const m of mediaRefs || []) {
      mediaKeys.add(`${m.associated_entity_type}:${m.associated_entity_id}`);
    }
  }

  for (const entityType of ENTITY_TYPES) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const table = getTableName(entityType);

    const { data, error } = await client
      .from(table)
      .select('id, slug, name, title, status, hero_image_url, gallery')
      .eq('status', 'published');

    if (error) continue;

    for (const row of data || []) {
      scanned++;
      const mediaKey = `${entityType}:${row.id}`;
      const hasMedia = !!row.hero_image_url || (row.gallery && row.gallery.length > 0) || mediaKeys.has(mediaKey);

      if (!hasMedia) {
        const opp = await createOpportunity({
          opportunityType: OPPORTUNITY_TYPES.ORPHANED_CONTENT,
          entityType,
          entityId: row.id,
          entitySlug: row.slug,
          title: `Orphaned content: ${row.name || row.title || row.slug}`,
          description: `Published listing has no hero image, gallery, or media_assets association.`,
          gapDetails: { has_hero_image: !!row.hero_image_url, has_gallery: !!(row.gallery && row.gallery.length > 0) },
          cadence,
          priority: CADENCES.QUARTERLY,
          actorId,
          client,
          scanAt,
        });
        if (opp) opportunities.push(opp);
      }
    }
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Scanner: Outdated Sources ─────────────────────────────────────────────────

/**
 * Find cm_knowledge entries with source URLs older than 180 days,
 * suggesting the source may need re-checking.
 */
export async function scanOutdatedSources({ cadence, actorId, client, scanAt, signal } = {}) {
  const opportunities = [];
  let scanned = 0;
  const outdatedCutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from('cm_knowledge')
    .select('id, entity_type, entity_id, source_url, source_name, discovery_date, confidence, verification_status')
    .lt('discovery_date', outdatedCutoff)
    .eq('verification_status', 'unverified');

  if (error) return { scanned: 0, newOpportunities: 0, opportunities: [] };

  for (const row of data || []) {
    scanned++;
    const opp = await createOpportunity({
      opportunityType: OPPORTUNITY_TYPES.STALE_CONTENT,
      entityType: row.entity_type,
      entityId: row.entity_id,
      title: `Outdated source: ${row.source_name || row.source_url}`,
      description: `Knowledge entry from ${new Date(row.discovery_date).toLocaleDateString()} needs re-verification. Source: ${row.source_url}`,
      gapDetails: {
        source_url: row.source_url,
        discovery_date: row.discovery_date,
        confidence: row.confidence,
        age_days: Math.floor(
          (Date.now() - new Date(row.discovery_date).getTime()) / (24 * 60 * 60 * 1000)
        ),
      },
      cadence,
      priority: CADENCES.QUARTERLY,
      actorId,
      client,
      scanAt,
    });
    if (opp) opportunities.push(opp);
  }

  return { scanned, newOpportunities: opportunities.length, opportunities };
}

// ── Opportunity creation + deduplication ────────────────────────────────────────

/**
 * Create a content opportunity, de-duplicating against existing open entries
 * for the same entity + opportunity_type.
 *
 * @returns {Promise<object|null>} the created opportunity, or null if skipped
 */
export async function createOpportunity({
  opportunityType, entityType, entityId, entitySlug, title, description,
  gapDetails, affectedEntities, cadence, priority, priorityScore,
  actorId, client, scanAt,
}) {
  // Check if an open opportunity already exists for this entity + type
  let existingQuery = client
    .from('cm_content_opportunities')
    .select('id, updated_at')
    .eq('opportunity_type', opportunityType)
    .in('status', ['pending', 'in_progress']);

  if (entityId !== undefined && entityId !== null) {
    existingQuery = existingQuery
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
  } else {
    existingQuery = existingQuery
      .eq('entity_type', entityType)
      .eq('entity_slug', entitySlug);
  }

  const { data: existing, error: existingErr } = await existingQuery.maybeSingle();

  if (existingErr && existingErr.code !== 'PGRST116') {
    // PGRST116 = no rows found — that's expected for new opportunities
    if (existingErr.code !== 'PGRST116') {
      // Could be column doesn't exist — fall through to create
    }
  }

  if (existing && existing.id) {
    // Update last_scan_at and return null — opportunity already tracked
    await client
      .from('cm_content_opportunities')
      .update({ last_scan_at: scanAt })
      .eq('id', existing.id);
    return null;
  }

  // Compute priority score if not provided
  const score = priorityScore !== undefined
    ? priorityScore
    : prioritizeOpportunity({ entityType, status: 'published', completeness: 0.5, gapType: opportunityType });

  const result = await client
    .from('cm_content_opportunities')
    .insert({
      id: randomUUID(),
      opportunity_type: opportunityType,
      entity_type: entityType,
      entity_id: entityId || null,
      entity_slug: entitySlug || null,
      priority: priority || CADENCES.WEEKLY,
      priority_score: score,
      cadence: cadence || CADENCES.WEEKLY,
      status: 'pending',
      title,
      description,
      gap_details: gapDetails || null,
      affected_entities: affectedEntities || null,
      last_scan_at: scanAt,
      created_by: actorId,
    })
    .select()
    .single();

  if (result.error) return null;
  return result.data;
}

// ── Prioritization ────────────────────────────────────────────────────────────

/**
 * Compute a priority score (0–1) for a content opportunity.
 * Higher = more important to address.
 *
 * @param {object} params
 * @param {string} params.entityType - entity type
 * @param {string} params.status - 'published' or 'draft'
 * @param {number} params.completeness - field completeness 0–1 (for sparse listings)
 * @param {string} params.gapType - the OPPORTUNITY_TYPES value
 * @returns {number} priority score 0–1
 */
export function prioritizeOpportunity({ entityType, status = 'draft', completeness = 1, gapType }) {
  const entityWeight = ENTITY_PRIORITY[entityType] || 0.5;
  const publishMultiplier = status === 'published' ? 1.0 : 0.6;

  // Gap type multipliers
  const GAP_WEIGHTS = {
    [OPPORTUNITY_TYPES.MISSING_LISTING]: 0.9,
    [OPPORTUNITY_TYPES.MISSING_MEDIA]: 0.7,
    [OPPORTUNITY_TYPES.MISSING_METADATA]: 0.6,
    [OPPORTUNITY_TYPES.STALE_CONTENT]: 0.8,
    [OPPORTUNITY_TYPES.SPARSE_LISTING]: 0.5,
    [OPPORTUNITY_TYPES.MISSING_RELATIONSHIP]: 0.6,
    [OPPORTUNITY_TYPES.MISSING_INTERNAL_LINK]: 0.5,
    [OPPORTUNITY_TYPES.ORPHANED_CONTENT]: 0.4,
  };

  const gapWeight = GAP_WEIGHTS[gapType] || 0.5;

  // For sparse listings, lower completeness = higher priority
  let completenessFactor = 1;
  if (gapType === OPPORTUNITY_TYPES.SPARSE_LISTING) {
    completenessFactor = 1 - completeness; // 0% complete = 1, 100% = 0
  }

  // Combine: start with entity importance, apply gap weight,
  // boost for published status, adjust for completeness
  const score = entityWeight * gapWeight * publishMultiplier * (0.5 + 0.5 * completenessFactor);

  return Math.min(1.0, Math.max(0.0, score));
}

// ── Opportunity listing ────────────────────────────────────────────────────────

/**
 * List content opportunities with optional filtering.
 *
 * @param {object} params
 * @param {string} [params.status] - filter by status
 * @param {string} [params.cadence] - filter by cadence
 * @param {string} [params.opportunityType] - filter by opportunity_type
 * @param {string} [params.entityType] - filter by entity_type
 * @param {number} [params.minScore] - filter by priority_score minimum
 * @param {number} [params.limit=50]
 * @param {object} client - Supabase client
 * @returns {Promise<Array>}
 */
export async function listOpportunities({ status, cadence, opportunityType, entityType, minScore, limit = 50 }, client) {
  let query = client
    .from('cm_content_opportunities')
    .select('*')
    .order('priority_score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (cadence) query = query.eq('cadence', cadence);
  if (opportunityType) query = query.eq('opportunity_type', opportunityType);
  if (entityType) query = query.eq('entity_type', entityType);
  if (minScore !== undefined) query = query.gte('priority_score', minScore);

  const { data, error } = await query;
  if (error) throw new AIError('STORAGE_ERROR');
  return data || [];
}

/**
 * Update an opportunity's status.
 */
export async function updateOpportunityStatus(opportunityId, status, updates, client) {
  const validStatuses = ['pending', 'in_progress', 'resolved', 'dismissed'];
  if (!validStatuses.includes(status)) {
    throw new AIError('INVALID_REQUEST', { message: `Invalid status: ${status}` });
  }

  const updateData = {
    status,
    updated_at: new Date().toISOString(),
    ...updates,
  };

  if (status === 'resolved' || status === 'dismissed') {
    updateData.resolved_at = new Date().toISOString();
  }

  const { data, error } = await client
    .from('cm_content_opportunities')
    .update(updateData)
    .eq('id', opportunityId)
    .select()
    .single();

  if (error) throw new AIError('STORAGE_ERROR');
  return data;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function safeErrorMessage(error) {
  if (error instanceof AIError) return error.message;
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

// Re-export for consumers
export { CADENCES as CADENCE, STATUSES as OPPORTUNITY_STATUS };
