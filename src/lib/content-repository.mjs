// src/lib/content-repository.mjs — Supabase table loading and publication filtering.
// Reads public Supabase tables, validates the, and applies publication
// so only published, currently visible records reach the page templates.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createPublicClient } from './supabase.mjs';

/**
 * Determine whether a record is publicly visible at the given time.
 * A record is visible when status === 'published' and
 * (published_at is null OR published_at <= now).
 * @param {{status:string, published_at:string|null}|null|undefined} record
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function visibleAt(record, now = new Date()) {
  if (!record || record.status !== 'published') return false;
  if (!record.published_at) return true;
  const publishedAt = Date.parse(record.published_at);
  return Number.isFinite(publishedAt) && publishedAt <= now.getTime();
}

/**
 * Filter an array of records to only those visible at `now`.
 * @param {Array} records
 * @param {Date} [now]
 * @returns {Array}
 */
export function visibleRecords(records, now = new Date()) {
  return (records || []).filter((r) => visibleAt(r, now));
}

/**
 * @typedef {Object} RawTables
 * @property {Array} regions
 * @property {Array} countries
 * @property {Array} districts
 * @property {Array} attractions
 * @property {Array} accommodations
 * @property {Array} restaurants
 * @property {Array} tour_operators
 * @property {Array} booking_offers
 * @property {Array} site_settings
 * @property {Array} page_sections
 * @property {Array} media_assets
 */

const TABLE_NAMES = [
  'regions',
  'countries',
  'districts',
  'attractions',
  'activities',
  'travel_articles',
  'accommodations',
  'restaurants',
  'tour_operators',
  'booking_offers',
  'site_settings',
  'page_sections',
  'media_assets',
];
const OPTIONAL_NEW_TABLES = new Set(['activities', 'travel_articles']);

const EDITORIAL_OVERRIDE_PATH = resolve(process.cwd(), 'content/editorial-overrides.json');
const LOCAL_DESTINATIONS_PATH = resolve(process.cwd(), 'content/local-destinations.json');
const EDITORIAL_FIELDS = {
  countries: new Set(['id', 'region_id', 'slug', 'name', 'hero_title', 'hero_text', 'overview', 'access_summary', 'best_time', 'planning_tips', 'hero_image_url', 'hero_image_alt', 'gallery', 'sort_order', 'status', 'published_at', 'featured']),
  attractions: new Set(['id', 'region_id', 'country_id', 'slug', 'name', 'location_name', 'hero_image_url', 'hero_image_alt', 'gallery', 'listing_summary', 'detail_intro', 'full_description', 'getting_there', 'best_time', 'practical_info', 'highlights', 'rating', 'review_count', 'price_label', 'booking_url', 'featured', 'sort_order', 'status', 'published_at']),
  accommodations: new Set(['id', 'region_id', 'country_id', 'attraction_id', 'slug', 'name', 'property_type', 'location_name', 'hero_image_url', 'hero_image_alt', 'gallery', 'listing_summary', 'detail_intro', 'practical_info', 'amenities', 'rating', 'review_count', 'price_label', 'booking_url', 'featured', 'sort_order', 'status', 'published_at']),
  activities: new Set(['id', 'attraction_id', 'slug', 'name', 'location_name', 'listing_summary', 'detail_intro', 'full_description', 'highlights', 'best_time', 'practical_info', 'hero_image_url', 'hero_image_alt', 'gallery', 'booking_url', 'source_url', 'featured', 'sort_order', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url']),
  travel_articles: new Set(['id', 'slug', 'title', 'category', 'region', 'country', 'excerpt', 'body', 'read_time', 'hero_image_url', 'hero_image_alt', 'video_url', 'source_url', 'featured', 'sort_order', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url']),
};
for (const fields of Object.values(EDITORIAL_FIELDS)) {
  for (const field of ['research_sources', 'last_researched', 'traveler_feedback', 'nearby_stay_options', 'source_url']) fields.add(field);
}

const REQUIRED_NEW_FIELDS = {
  countries: ['region_id', 'name', 'hero_title', 'hero_text', 'overview'],
  attractions: ['region_id', 'country_id', 'name', 'listing_summary', 'detail_intro'],
  accommodations: ['region_id', 'country_id', 'name', 'listing_summary', 'detail_intro'],
  activities: ['attraction_id', 'name', 'listing_summary'],
  travel_articles: ['title', 'excerpt', 'body'],
};

/** Read the committed repository-managed editorial records. */
async function readEditorialOverrides() {
  try {
    return JSON.parse(await readFile(EDITORIAL_OVERRIDE_PATH, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to load required editorial overrides at ${EDITORIAL_OVERRIDE_PATH}: ${error.message}`);
  }
}

/**
 * Merge only editorial entity rows, keyed by id or slug, before publication filtering.
 * Existing IDs remain owned by Supabase; new records receive build-only IDs.
 */
export function mergeEditorialOverrides(tables, overrides) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new Error('Editorial overrides must be a JSON object keyed by supported table');
  }
  for (const table of Object.keys(overrides)) {
    if (!Object.hasOwn(EDITORIAL_FIELDS, table)) {
      throw new Error(`Editorial overrides cannot modify "${table}"`);
    }
    const entries = overrides[table];
    if (!Array.isArray(entries)) throw new Error(`Editorial overrides for ${table} must be an array`);
    const rows = [...(tables[table] || [])];
    const seenSlugs = new Set();
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new Error(`Editorial override in ${table} must be an object`);
      }
      for (const key of Object.keys(entry)) {
        if (!EDITORIAL_FIELDS[table].has(key)) throw new Error(`Unsupported ${table} field: ${key}`);
      }
      if (typeof entry.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
        throw new Error(`Editorial override in ${table} needs a lowercase route slug`);
      }
      if (seenSlugs.has(entry.slug)) throw new Error(`Duplicate editorial slug in ${table}: ${entry.slug}`);
      seenSlugs.add(entry.slug);

      const byId = entry.id == null ? -1 : rows.findIndex((row) => row.id != null && String(row.id) === String(entry.id));
      const bySlug = rows.findIndex((row) => row.slug === entry.slug);
      if (byId >= 0 && bySlug >= 0 && byId !== bySlug) {
        throw new Error(`Editorial override in ${table} matches different rows by id and slug`);
      }
      const index = byId >= 0 ? byId : bySlug;
      const merged = index >= 0
        ? { ...rows[index], ...entry, id: rows[index].id }
        : { ...entry, id: entry.id ?? `repo:${table}:${entry.slug}` };

      // Draft overrides also act as unpublication records. They may intentionally
      // lack content (or have no remaining base row), and are filtered below.
      // Keep completeness checks for every non-draft record, including scheduled ones.
      if (merged.status !== 'draft') {
        for (const field of REQUIRED_NEW_FIELDS[table]) {
          if (merged[field] == null || merged[field] === '') {
            throw new Error(`Editorial record ${table}/${entry.slug} needs ${field}`);
          }
        }
      }
      if (index >= 0) rows[index] = merged;
      else rows.push(merged);
    }
    tables[table] = rows;
  }
  return tables;
}

/**
 * Load published records from all content tables.
 * Each query uses select('*') and checks { data, error } on every result.
 * @param {SupabaseClient} client
 * @param {Date} [now=new Date()]
 * @returns {Promise<RawTables>}
 */
export async function loadPublishedTables(client, now = new Date()) {
  const tables = {};

  for (const table of TABLE_NAMES) {
    const { data, error } = await client.from(table).select('*');

    if (error) {
      if (OPTIONAL_NEW_TABLES.has(table) && ['PGRST205', '42P01'].includes(error.code)) {
        tables[table] = [];
        continue;
      }
      throw new Error(`Failed to load ${table}: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Failed to load ${table}: no data returned`);
    }

    tables[table] = data;
  }

  // Repository overrides affect editorial rows only and still pass through publication filtering.
  mergeEditorialOverrides(tables, await readEditorialOverrides());
  // Git-managed only: do not query a new Supabase table.
  try {
    const destinations = JSON.parse(await readFile(LOCAL_DESTINATIONS_PATH, 'utf8'));
    if (!Array.isArray(destinations)) throw new Error('expected an array');
    tables.local_destinations = visibleRecords(destinations, now);
  } catch (error) {
    throw new Error(`Failed to load local destinations at ${LOCAL_DESTINATIONS_PATH}: ${error.message}`);
  }

  // Publication filtering
  tables.regions = visibleRecords(tables.regions, now);
  tables.countries = visibleRecords(tables.countries, now);
  tables.attractions = visibleRecords(tables.attractions, now);
  tables.activities = visibleRecords(tables.activities, now);
  tables.travel_articles = visibleRecords(tables.travel_articles, now);
  tables.accommodations = visibleRecords(tables.accommodations, now);
  tables.restaurants = visibleRecords(tables.restaurants, now);
  tables.districts = visibleRecords(tables.districts, now);
  tables.page_sections = visibleRecords(tables.page_sections, now);
  tables.media_assets = visibleRecords(tables.media_assets, now);

  // booking_offers are filtered by active === true (RLS also enforces this)
  tables.booking_offers = (tables.booking_offers || []).filter((o) => o && o.active === true);

  // site_settings are filtered by is_public === true
  tables.site_settings = (tables.site_settings || []).filter((s) => s && s.is_public === true);

  // Reject empty essential collections
  if (tables.regions.length === 0) {
    throw new Error('Essential collection "regions" is empty after publication filtering');
  }
  if (tables.countries.length === 0) {
    throw new Error('Essential collection "countries" is empty after publication filtering');
  }

  return tables;
}

/**
 * Load content from Supabase or, in test mode only, from a fixture file.
 * @param {Object} opts
 * @param {BuildEnv} opts.env
 * @param {SupabaseClient} [opts.client]
 * @param {Date} [opts.now]
 * @param {string} [opts.fixturePath]
 * @returns {Promise<RawTables>}
 */
export async function loadContent({ env, client, now = new Date(), fixturePath } = {}) {
  // Fixture loading is only allowed in test mode.
  // Production must throw if CONTENT_FIXTURE_PATH is set.
  const isTest = process.env.NODE_ENV === 'test';

  if (fixturePath || process.env.CONTENT_FIXTURE_PATH) {
    if (!isTest) {
      throw new Error('CONTENT_FIXTURE_PATH is only allowed when NODE_ENV === "test"');
    }
    const path = fixturePath || process.env.CONTENT_FIXTURE_PATH;
    const { readFile } = await import('node:fs/promises');
    const raw = JSON.parse(await readFile(path, 'utf8'));

    const nowDate = now;
    return {
      regions: visibleRecords(raw.regions || [], nowDate),
      countries: visibleRecords(raw.countries || [], nowDate),
      local_destinations: visibleRecords(raw.local_destinations || [], nowDate),
      districts: visibleRecords(raw.districts || [], nowDate),
      attractions: visibleRecords(raw.attractions || [], nowDate),
      activities: visibleRecords(raw.activities || [], nowDate),
      travel_articles: visibleRecords(raw.travel_articles || [], nowDate),
      accommodations: visibleRecords(raw.accommodations || [], nowDate),
      booking_offers: (raw.booking_offers || []).filter((o) => o && o.active === true),
      site_settings: (raw.site_settings || []).filter((s) => s && s.is_public === true),
      page_sections: visibleRecords(raw.page_sections || [], nowDate),
      media_assets: visibleRecords(raw.media_assets || [], nowDate),
    };
  }

  if (!client) {
    client = createPublicClient(env);
  }

  return loadPublishedTables(client, now);
}
