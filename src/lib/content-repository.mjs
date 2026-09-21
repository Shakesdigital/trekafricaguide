// src/lib/content-repository.mjs — Supabase table loading and publication filtering.
// Reads public Supabase tables, validates the, and applies publication
// so only published, currently visible records reach the page templates.

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
  'accommodations',
  'booking_offers',
  'site_settings',
  'page_sections',
  'media_assets',
];

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
      throw new Error(`Failed to load ${table}: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Failed to load ${table}: no data returned`);
    }

    tables[table] = data;
  }

  // Publication filtering
  tables.regions = visibleRecords(tables.regions, now);
  tables.countries = visibleRecords(tables.countries, now);
  tables.attractions = visibleRecords(tables.attractions, now);
  tables.accommodations = visibleRecords(tables.accommodations, now);
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
      districts: visibleRecords(raw.districts || [], nowDate),
      attractions: visibleRecords(raw.attractions || [], nowDate),
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
