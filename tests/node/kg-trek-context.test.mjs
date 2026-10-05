// Tests for Ask Trek context extraction and session management.
// Run: node --test tests/node/kg-trek-context.test.mjs
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractViewedEntities,
  buildContextSummary,
  getEntitySlugs,
  COORDINATES,
  SUGGESTED_PROMPTS,
} from '../../server/knowledge/trek-assistant.mjs';

// ── Mock site model (minimal for context tests) ───────────────────────────────

const MOCK_SITE_MODEL = {
  countriesBySlug: new Map([
    ['kenya', { id: 1, slug: 'kenya', name: 'Kenya', region: { name: 'East Africa', slug: 'east-africa' } }],
    ['uganda', { id: 2, slug: 'uganda', name: 'Uganda', region: { name: 'East Africa', slug: 'east-africa' } }],
    ['tanzania', { id: 3, slug: 'tanzania', name: 'Tanzania', region: { name: 'East Africa', slug: 'east-africa' } }],
  ]),
  attractionsBySlug: new Map([
    ['bwindi-impenetrable-national-park', { id: 1, slug: 'bwindi-impenetrable-national-park', name: 'Bwindi Impenetrable National Park', country: { name: 'Uganda', slug: 'uganda' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Home to mountain gorillas.', hero_image_url: '/images/bwindi.jpg', hero_image_alt: 'Bwindi rainforest', internalUrl: '/attractions/bwindi-impenetrable-national-park' }],
    ['maasai-mara', { id: 2, slug: 'maasai-mara', name: 'Maasai Mara', country: { name: 'Kenya', slug: 'kenya' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Great Wildebeest Migration.', hero_image_url: null, internalUrl: '/attractions/maasai-mara' }],
    ['serengeti-national-park', { id: 3, slug: 'serengeti-national-park', name: 'Serengeti', country: { name: 'Tanzania', slug: 'tanzania' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Endless plains.', hero_image_url: null, internalUrl: '/attractions/serengeti-national-park' }],
  ]),
  accommodationsBySlug: new Map([
    ['governors-camp', { id: 1, slug: 'governors-camp', name: "Governor's Camp", country: { name: 'Kenya', slug: 'kenya' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Luxury tented camp.', hero_image_url: '/images/governors-camp.jpg', hero_image_alt: 'Camp', internalUrl: '/accommodations/governors-camp' }],
    ['sanctuary-gorilla-forest-camp', { id: 2, slug: 'sanctuary-gorilla-forest-camp', name: 'Sanctuary Gorilla Forest Camp', country: { name: 'Uganda', slug: 'uganda' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Near gorilla trekking trails.', hero_image_url: null, internalUrl: '/accommodations/sanctuary-gorilla-forest-camp' }],
  ]),
  activitiesBySlug: new Map([
    ['gorilla-trekking-bwindi', { id: 1, slug: 'gorilla-trekking-bwindi', name: 'Gorilla Trekking', country: { name: 'Uganda', slug: 'uganda' }, listing_summary: 'Track mountain gorillas.', hero_image_url: null, internalUrl: '/activities/gorilla-trekking-bwindi' }],
  ]),
  attractions: [
    { id: 1, slug: 'bwindi-impenetrable-national-park', name: 'Bwindi', country_id: 2 },
    { id: 2, slug: 'maasai-mara', name: 'Maasai Mara', country_id: 1 },
    { id: 3, slug: 'serengeti-national-park', name: 'Serengeti', country_id: 3 },
  ],
  accommodations: [
    { id: 1, slug: 'governors-camp', name: 'Governors', country_id: 1 },
    { id: 2, slug: 'sanctuary-gorilla-forest-camp', name: 'Sanctuary', country_id: 2 },
  ],
  activities: [
    { id: 1, slug: 'gorilla-trekking-bwindi', name: 'Gorilla Trekking', country_id: 2 },
  ],
  searchSuggestions: [],
};

// ── extractViewedEntities ─────────────────────────────────────────────────────

describe('extractViewedEntities — pathname parsing', () => {
  test('extracts country from /countries/{slug}', () => {
    const entities = extractViewedEntities('/countries/kenya', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'country');
    assert.equal(entities[0].entity_slug, 'kenya');
    assert.equal(entities[0].entity_name, 'Kenya');
    assert.equal(entities[0].region.name, 'East Africa');
  });

  test('extracts attraction from /attractions/{slug}', () => {
    const entities = extractViewedEntities('/attractions/bwindi-impenetrable-national-park', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'attraction');
    assert.equal(entities[0].entity_name, 'Bwindi Impenetrable National Park');
    assert.equal(entities[0].country.name, 'Uganda');
  });

  test('extracts accommodation from /accommodations/{slug}', () => {
    const entities = extractViewedEntities('/accommodations/governors-camp', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'accommodation');
    assert.equal(entities[0].entity_name, "Governor's Camp");
    assert.equal(entities[0].country.name, 'Kenya');
  });

  test('extracts activity from /activities/{slug}', () => {
    const entities = extractViewedEntities('/activities/gorilla-trekking-bwindi', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'activity');
    assert.equal(entities[0].entity_name, 'Gorilla Trekking');
  });

  test('returns empty for listing pages (no slug)', () => {
    assert.deepStrictEqual(extractViewedEntities('/countries', MOCK_SITE_MODEL), []);
    assert.deepStrictEqual(extractViewedEntities('/attractions', MOCK_SITE_MODEL), []);
  });

  test('returns empty for non-content pathnames', () => {
    assert.deepStrictEqual(extractViewedEntities('/contact', MOCK_SITE_MODEL), []);
    assert.deepStrictEqual(extractViewedEntities('/travel-insights/my-article', MOCK_SITE_MODEL), []);
    assert.deepStrictEqual(extractViewedEntities('/', MOCK_SITE_MODEL), []);
  });

  test('returns empty when slug not in site model', () => {
    assert.deepStrictEqual(extractViewedEntities('/countries/mars', MOCK_SITE_MODEL), []);
  });

  test('returns empty when site model is null', () => {
    assert.deepStrictEqual(extractViewedEntities('/countries/kenya', null), []);
  });

  test('handles trailing slashes', () => {
    const entities = extractViewedEntities('/countries/kenya/', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_slug, 'kenya');
  });

  test('handles empty pathname', () => {
    assert.deepStrictEqual(extractViewedEntities('', MOCK_SITE_MODEL), []);
  });
});

// ── buildContextSummary ───────────────────────────────────────────────────────

describe('buildContextSummary', () => {
  test('returns generic message when no entities', () => {
    const summary = buildContextSummary([], MOCK_SITE_MODEL);
    assert.equal(summary, 'The traveler is browsing the Trek Africa Guide website.');
  });

  test('returns generic message when entities is null', () => {
    const summary = buildContextSummary(null, MOCK_SITE_MODEL);
    assert.equal(summary, 'The traveler is browsing the Trek Africa Guide website.');
  });

  test('includes entity name and type for single entity', () => {
    const entities = [{
      entity_type: 'attraction',
      entity_slug: 'bwindi-impenetrable-national-park',
      entity_name: 'Bwindi Impenetrable National Park',
      country: { name: 'Uganda', slug: 'uganda' },
      region: { name: 'East Africa', slug: 'east-africa' },
    }];
    const summary = buildContextSummary(entities, MOCK_SITE_MODEL);
    assert.ok(summary.includes('Bwindi Impenetrable National Park'));
    assert.ok(summary.includes('attraction'));
    assert.ok(summary.includes('Uganda'));
    assert.ok(summary.includes('East Africa'));
  });

  test('handles multiple entities in summary', () => {
    const entity1 = extractViewedEntities('/countries/kenya', MOCK_SITE_MODEL);
    const entity2 = extractViewedEntities('/attractions/maasai-mara', MOCK_SITE_MODEL);
    const entities = [...entity1, ...entity2];
    const summary = buildContextSummary(entities, MOCK_SITE_MODEL);
    assert.ok(summary.includes('Kenya'));
    assert.ok(summary.includes('Maasai Mara'));
  });

  test('handles entity without country/region', () => {
    const entities = [{
      entity_type: 'country',
      entity_slug: 'test',
      entity_name: 'Test',
    }];
    const summary = buildContextSummary(entities, MOCK_SITE_MODEL);
    assert.ok(summary.includes('Test'));
    assert.ok(summary.includes('country'));
    // Should not crash without country/region
  });
});

// ── getEntitySlugs ─────────────────────────────────────────────────────────────

describe('getEntitySlugs', () => {
  test('returns empty string for no entities', () => {
    const slugs = getEntitySlugs([], MOCK_SITE_MODEL);
    assert.equal(slugs, '');
  });

  test('returns slug list for single entity', () => {
    const entities = extractViewedEntities('/countries/kenya', MOCK_SITE_MODEL);
    const slugs = getEntitySlugs(entities, MOCK_SITE_MODEL);
    assert.ok(slugs.includes('kenya (country)'));
  });

  test('includes nearby entities for country context', () => {
    const entities = extractViewedEntities('/countries/kenya', MOCK_SITE_MODEL);
    const slugs = getEntitySlugs(entities, MOCK_SITE_MODEL);
    // Should include attractions in Kenya
    assert.ok(slugs.includes('maasai-mara (attraction)'));
  });

  test('includes nearby accommodations for country context', () => {
    const entities = extractViewedEntities('/countries/kenya', MOCK_SITE_MODEL);
    const slugs = getEntitySlugs(entities, MOCK_SITE_MODEL);
    // Should include accommodations in Kenya
    assert.ok(slugs.includes('governors-camp (accommodation)'));
  });

  test('dedupes overlapping slugs', () => {
    const entities = extractViewedEntities('/attractions/maasai-mara', MOCK_SITE_MODEL);
    const slugs = getEntitySlugs(entities, MOCK_SITE_MODEL);
    const maasaiCount = slugs.split(',').filter((s) => s.includes('maasai-mara')).length;
    assert.equal(maasaiCount, 1);
  });
});

// ── COORDINATES ───────────────────────────────────────────────────────────────

describe('COORDINATES map', () => {
  test('contains coordinates for all major countries', () => {
    const countries = ['kenya', 'tanzania', 'uganda', 'south-africa', 'morocco', 'sao-tome-and-principe'];
    for (const c of countries) {
      assert.ok(COORDINATES[c], `Missing coordinates for ${c}`);
      assert.equal(typeof COORDINATES[c].lat, 'number');
      assert.equal(typeof COORDINATES[c].lng, 'number');
    }
  });

  test('contains coordinates for key Uganda attractions', () => {
    const attractions = [
      'bwindi-impenetrable-national-park',
      'maasai-mara-national-reserve',
      'serengeti-national-park',
      'queen-elizabeth-national-park',
      'entebbe',
    ];
    for (const a of attractions) {
      assert.ok(COORDINATES[a], `Missing coordinates for ${a}`);
    }
  });

  test('contains coordinates for known accommodations', () => {
    const accommodations = [
      'governors-camp',
      'sanctuary-gorilla-forest-camp',
      'mount-nelson-a-belmond-hotel',
      'ol-tukai-lodge-amboseli',
      'paraa-safari-lodge',
    ];
    for (const a of accommodations) {
      assert.ok(COORDINATES[a], `Missing coordinates for ${a}`);
    }
  });

  test('Uganda coordinates are within Uganda bounds', () => {
    const uganda = COORDINATES['uganda'];
    assert.ok(uganda.lat > -2 && uganda.lat < 4, 'Uganda latitude out of range');
    assert.ok(uganda.lng > 29 && uganda.lng < 36, 'Uganda longitude out of range');
  });

  test('Kenya coordinates are within Kenya bounds', () => {
    const kenya = COORDINATES['kenya'];
    assert.ok(kenya.lat > -5 && kenya.lat < 5, 'Kenya latitude out of range');
    assert.ok(kenya.lng > 33 && kenya.lng < 42, 'Kenya longitude out of range');
  });
});

// ── SUGGESTED_PROMPTS ─────────────────────────────────────────────────────────

describe('SUGGESTED_PROMPTS', () => {
  test('exports an array of prompt objects', () => {
    assert.ok(Array.isArray(SUGGESTED_PROMPTS));
    assert.ok(SUGGESTED_PROMPTS.length >= 5);
  });

  test('each prompt has required fields', () => {
    for (const p of SUGGESTED_PROMPTS) {
      assert.ok(p.prompt_text, 'Missing prompt_text');
      assert.ok(p.trigger_keywords, 'Missing trigger_keywords');
      assert.ok(p.category, 'Missing category');
      assert.equal(typeof p.sort_order, 'number');
    }
  });

  test('categories include trip_planning, comparison, and recommendation', () => {
    const categories = new Set(SUGGESTED_PROMPTS.map((p) => p.category));
    assert.ok(categories.has('trip_planning'));
    assert.ok(categories.has('comparison'));
    assert.ok(categories.has('recommendation'));
  });

  test('trip planning prompts include Uganda-related prompts', () => {
    const ugandaPrompt = SUGGESTED_PROMPTS.find((p) => p.prompt_text.includes('Uganda'));
    assert.ok(ugandaPrompt, 'Expected an Uganda-related prompt');
    assert.ok(ugandaPrompt.trigger_keywords.includes('uganda'));
  });

  test('sort orders are unique and ascending', () => {
    const sorted = [...SUGGESTED_PROMPTS].sort((a, b) => a.sort_order - b.sort_order);
    for (let i = 1; i < sorted.length; i++) {
      assert.ok(sorted[i].sort_order >= sorted[i - 1].sort_order);
    }
  });
});
