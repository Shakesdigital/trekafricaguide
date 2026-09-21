// src/lib/site-model.mjs — Relationship joining, indexes, validation, and page models.
// Builds a deterministic, immutable site model from raw Supabase tables.

import { resolveImage, pickHero, pickGallery, normalizeList, resolveHeroMedia } from './images.mjs';
import { loadContent } from './content-repository.mjs';
import { createPublicClient } from './supabase.mjs';
import { readBuildEnv } from './env.mjs';

let cachedModelPromise = null;

/**
 * Build a validated, joined site model from raw Supabase tables.
 * @param {Object} tables - RawTables
 * @param {Date} [now=new Date()]
 * @returns {SiteModel}
 */
export function buildSiteModel(tables, now = new Date()) {
  // Build lookup maps by ID
  const regionsById = new Map();
  const countriesById = new Map();
  const attractionsById = new Map();
  const accommodationsById = new Map();
  const districtsById = new Map();
  const bookingOffersByOwnerId = new Map();

  // Track slugs for duplicate detection within each route family
  const attrSlugs = new Set();
  const accoSlugs = new Set();
  const countrySlugs = new Set();
  const regionSlugs = new Set();

  // Validate and index regions
  const regions = [...(tables.regions || [])]
    .sort((a, b) => sortByFeaturedThenOrder(a, b))
    .map((r) => {
      assertRouteSlug(r.slug, 'region');
      if (regionSlugs.has(r.slug)) {
        throw new Error(`Duplicate region slug: ${r.slug}`);
      }
      regionSlugs.add(r.slug);
      const joined = { ...r };
      joined.countries_count = (tables.countries || []).filter((c) => c.region_id === r.id && isPublished(c, now)).length;
      regionsById.set(r.id, joined);
      return joined;
    });

  // Validate and index countries
  const countries = [...(tables.countries || [])]
    .sort((a, b) => sortByFeaturedThenOrder(a, b))
    .map((c) => {
      assertRouteSlug(c.slug, 'country');
      if (countrySlugs.has(c.slug)) {
        throw new Error(`Duplicate country slug: ${c.slug}`);
      }
      countrySlugs.add(c.slug);

      // Validate parent region is published
      const region = regionsById.get(c.region_id);
      if (!region) {
        throw new Error(`Country ${c.slug} has missing region ${c.region_id}`);
      }
      if (!isPublished(region, now)) {
        throw new Error(`Published country ${c.slug} has unpublished region ${region.slug}`);
      }

      const joined = { ...c };
      joined.region = region;
      joined.internalUrl = `/countries/${c.slug}`;
      joined.routeFamily = 'countries';
      countriesById.set(c.id, joined);
      return joined;
    });

  // Validate and index districts
  const districts = [...(tables.districts || [])]
    .sort((a, b) => sortByFeaturedThenOrder(a, b))
    .map((d) => {
      assertRouteSlug(d.slug, 'district');
      const country = countriesById.get(d.country_id);
      if (!country) {
        throw new Error(`District ${d.slug} has missing country ${d.country_id}`);
      }
      const joined = { ...d, country };
      districtsById.set(d.id, joined);
      return joined;
    });

  // Validate and index attractions
  const attractions = [...(tables.attractions || [])]
    .sort((a, b) => sortByFeaturedThenOrder(a, b))
    .map((a) => {
      assertRouteSlug(a.slug, 'attraction');
      if (attrSlugs.has(a.slug)) {
        throw new Error(`Duplicate attraction slug: ${a.slug}`);
      }
      attrSlugs.add(a.slug);

      const region = regionsById.get(a.region_id);
      const country = countriesById.get(a.country_id);

      if (!region) {
        throw new Error(`Attraction ${a.slug} has missing region ${a.region_id}`);
      }
      if (!isPublished(region, now)) {
        throw new Error(`Published attraction ${a.slug} has unpublished region ${region.slug}`);
      }
      if (!country) {
        throw new Error(`Missing country for attraction ${a.slug}`);
      }
      if (!isPublished(country, now)) {
        throw new Error(`Published attraction ${a.slug} has unpublished country ${country.slug}`);
      }

      const joined = { ...a };
      joined.region = region;
      joined.country = country;
      joined.heroMedia = resolveHeroMedia(forEntity(tables.media_assets, 'attraction', a.id));
      joined.internalUrl = `/attractions/${a.slug}`;
      joined.routeFamily = 'attractions';
      attractionsById.set(a.id, joined);
      return joined;
    });

  // Validate and index accommodations
  const accommodations = [...(tables.accommodations || [])]
    .sort((a, b) => sortByFeaturedThenOrder(a, b))
    .map((a) => {
      assertRouteSlug(a.slug, 'accommodation');
      if (accoSlugs.has(a.slug)) {
        throw new Error(`Duplicate accommodation slug: ${a.slug}`);
      }
      accoSlugs.add(a.slug);

      const region = regionsById.get(a.region_id);
      const country = countriesById.get(a.country_id);
      const attraction = a.attraction_id ? attractionsById.get(a.attraction_id) : null;

      if (!region) {
        throw new Error(`Accommodation ${a.slug} has missing region ${a.region_id}`);
      }
      if (!isPublished(region, now)) {
        throw new Error(`Published accommodation ${a.slug} has unpublished region ${region.slug}`);
      }
      if (!country) {
        throw new Error(`Missing country for accommodation ${a.slug}`);
      }
      if (!isPublished(country, now)) {
        throw new Error(`Published accommodation ${a.slug} has unpublished country ${country.slug}`);
      }
      if (a.attraction_id && !attraction) {
        throw new Error(`Accommodation ${a.slug} has missing attraction ${a.attraction_id}`);
      }

      const joined = { ...a };
      joined.region = region;
      joined.country = country;
      joined.attraction = attraction;
      joined.heroMedia = resolveHeroMedia(forEntity(tables.media_assets, 'accommodation', a.id));
      joined.internalUrl = `/accommodations/${a.slug}`;
      joined.routeFamily = 'accommodations';

      // Validate that the internal URL stays within the route family
      const expectedPrefix = `/accommodations/${a.slug}`;
      if (!joined.internalUrl.startsWith('/accommodations/')) {
        throw new Error(`Internal URL for accommodation ${a.slug} escapes route family: ${joined.internalUrl}`);
      }

      accommodationsById.set(a.id, joined);
      return joined;
    });

  // Join booking offers to their parent entities
  const bookingOffersByEntity = new Map();
  for (const offer of tables.booking_offers || []) {
    const key = `${offer.offerable_type}:${offer.offerable_id}`;
    if (!bookingOffersByEntity.has(key)) {
      bookingOffersByEntity.set(key, []);
    }
    bookingOffersByEntity.get(key).push({ ...offer });
  }

  // Attach offers to accommodations and attractions
  for (const accommodation of accommodations) {
    const key = `accommodation:${accommodation.id}`;
    accommodation.bookingOffers = (bookingOffersByEntity.get(key) || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  for (const attraction of attractions) {
    const key = `attraction:${attraction.id}`;
    attraction.bookingOffers = (bookingOffersByEntity.get(key) || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  // Compute nearby attractions (same country, different ID, deterministic)
  for (const attraction of attractions) {
    const nearby = attractions
      .filter((a) => a.id !== attraction.id && a.country_id === attraction.country_id)
      .slice(0, 3);
    attraction.nearbyAttractions = nearby;
  }

  // Compute nearby stays (linked to this attraction)
  for (const attraction of attractions) {
    const nearby = accommodations
      .filter((s) => s.attraction_id === attraction.id)
      .slice(0, 3);
    attraction.nearbyStays = nearby;
  }

  // Compute nearby attractions for accommodations (attractions in same country)
  for (const accommodation of accommodations) {
    const nearby = attractions
      .filter((a) => a.country_id === accommodation.country_id)
      .slice(0, 3);
    accommodation.nearbyAttractions = nearby;
  }

  // Build settings from site_settings
  const settings = {};
  for (const s of tables.site_settings || []) {
    if (s.group_name && s.key) {
      settings[`${s.group_name}.${s.key}`] = s.value;
    }
  }

  // Build page sections (sorted)
  const pageSections = [...(tables.page_sections || [])]
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) ||
      (a.page_key || '').localeCompare(b.page_key || '') ||
      (a.section_key || '').localeCompare(b.section_key || ''));

  // Search suggestions from countries, attractions, and accommodations
  const searchSuggestions = [];
  for (const country of countries) {
    searchSuggestions.push({ label: country.name, type: 'country', value: country.slug, context: country.region?.name });
  }
  for (const attraction of attractions) {
    searchSuggestions.push({ label: attraction.name, type: 'attraction', value: attraction.slug, context: attraction.country?.name });
  }
  for (const accommodation of accommodations) {
    searchSuggestions.push({ label: accommodation.name, type: 'accommodation', value: accommodation.slug, context: accommodation.country?.name });
  }

  // Expose maps by slug
  const regionsBySlug = new Map();
  for (const r of regions) regionsBySlug.set(r.slug, r);

  const countriesBySlug = new Map();
  for (const c of countries) countriesBySlug.set(c.slug, c);

  const attractionsBySlug = new Map();
  for (const a of attractions) attractionsBySlug.set(a.slug, a);

  const accommodationsBySlug = new Map();
  for (const a of accommodations) accommodationsBySlug.set(a.slug, a);

  return Object.freeze({
    settings,
    pageSections,
    regions,
    countries,
    attractions,
    accommodations,
    districts,
    regionsBySlug,
    countriesBySlug,
    attractionsBySlug,
    accommodationsBySlug,
    searchSuggestions,
  });
}

/**
 * Get the cached site model (one build-time promise).
 * @returns {Promise<SiteModel>}
 */
export function getSiteModel() {
  if (!cachedModelPromise) {
    cachedModelPromise = (async () => {
      const fixturePath = process.env.CONTENT_FIXTURE_PATH;
      const env = fixturePath && process.env.NODE_ENV === 'test'
        ? {
            supabaseUrl: 'https://example.supabase.co',
            supabasePublishableKey: 'sb_publishable_test_key',
            stay22AffiliateId: 'aid-test',
            siteUrl: 'https://trekafricaguide.com',
          }
        : readBuildEnv();
      const client = fixturePath && process.env.NODE_ENV === 'test' ? null : createPublicClient(env);
      const tables = await loadContent({ env, client, fixturePath });
      return buildSiteModel(tables);
    })();
  }
  return cachedModelPromise;
}

/**
 * Set the cached site model promise.
 * @param {Promise<SiteModel>|SiteModel} promise
 */
export function setSiteModel(promise) {
  cachedModelPromise = Promise.resolve(promise);
}

// Helper: sort by featured DESC, then sort_order ASC, then name ASC
function sortByFeaturedThenOrder(a, b) {
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }
  const orderA = a.sort_order || 0;
  const orderB = b.sort_order || 0;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  const nameA = a.name || '';
  const nameB = b.name || '';
  return nameA.localeCompare(nameB);
}

function assertRouteSlug(slug, routeFamily) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid ${routeFamily} slug escapes route family: ${slug}`);
  }
}

// Helper: check if a record is published and currently visible
function isPublished(record, now = new Date()) {
  if (!record) return false;
  if (record.status !== 'published') return false;
  if (record.status === 'published' && record.published_at) {
    const publishedAt = Date.parse(record.published_at);
    if (!Number.isFinite(publishedAt) || publishedAt > now.getTime()) {
      return false;
    }
  }
  return true;
}

// Helper: get media assets for a specific entity
function forEntity(mediaAssets, entityType, entityId) {
  return (mediaAssets || []).filter(
    (m) => m.mediable_type === entityType && m.mediable_id === entityId && m.status === 'published'
  );
}
