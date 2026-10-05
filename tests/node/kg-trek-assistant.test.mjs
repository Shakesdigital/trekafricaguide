// Tests for the Ask Trek AI Assistant — context extraction, intent classification,
// response structure validation, and trip planning handlers.
// Run: node --test tests/node/kg-trek-assistant.test.mjs
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import {
  processAskTrekRequest,
  extractViewedEntities,
  buildContextSummary,
  classifyIntent,
  handleTripPlanning,
  handleComparison,
  handleRecommendation,
  parseTrekResponse,
  buildAskTrekPrompt,
  getSuggestedPrompts,
  INTENT_TYPES,
  ASK_TREK_TASK_TYPES,
  COORDINATES,
} from '../../server/knowledge/trek-assistant.mjs';

// ── Mock AI service ───────────────────────────────────────────────────────────

/**
 * Create a mock AI service that returns predefined JSON responses.
 * @param {object} responses - map of task_type to JSON string response
 * @returns {object} AI service with run() method
 */
function createMockAIService(responses = {}) {
  return {
    run: async (input, { signal } = {}) => {
      if (signal?.aborted) throw new AIError('CANCELLED');
      const resp = responses[input.task_type] || responses._default || '{}';
      return {
        id: 'mock-job-id',
        text: resp,
        cached: false,
        provider: 'mock',
        model: 'mock-model',
        usage: { input_tokens: 10, output_tokens: 20, complete: true },
      };
    },
  };
}

// ── Mock site model ───────────────────────────────────────────────────────────

const MOCK_SITE_MODEL = {
  countriesBySlug: new Map([
    ['kenya', { id: 1, slug: 'kenya', name: 'Kenya', region: { name: 'East Africa', slug: 'east-africa' } }],
    ['uganda', { id: 2, slug: 'uganda', name: 'Uganda', region: { name: 'East Africa', slug: 'east-africa' } }],
  ]),
  attractionsBySlug: new Map([
    ['bwindi-impenetrable-national-park', { id: 1, slug: 'bwindi-impenetrable-national-park', name: 'Bwindi Impenetrable National Park', country: { name: 'Uganda', slug: 'uganda' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Home to endangered mountain gorillas.', detail_intro: 'A UNESCO World Heritage site.', hero_image_url: '/images/bwindi.jpg', hero_image_alt: 'Bwindi rainforest', internalUrl: '/attractions/bwindi-impenetrable-national-park' }],
    ['maasai-mara', { id: 2, slug: 'maasai-mara', name: 'Maasai Mara National Reserve', country: { name: 'Kenya', slug: 'kenya' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Famous for the Great Wildebeest Migration.', detail_intro: 'Renowned for wildlife.', hero_image_url: '/images/maasai-mara.jpg', hero_image_alt: 'Savannah landscape', internalUrl: '/attractions/maasai-mara' }],
  ]),
  accommodationsBySlug: new Map([
    ['governors-camp', { id: 1, slug: 'governors-camp', name: "Governor's Camp", country: { name: 'Kenya', slug: 'kenya' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Luxury tented camp in the Mara.', detail_intro: 'A classic safari camp.', hero_image_url: '/images/governors-camp.jpg', hero_image_alt: 'Governors Camp', internalUrl: '/accommodations/governors-camp' }],
    ['sanctuary-gorilla-forest-camp', { id: 2, slug: 'sanctuary-gorilla-forest-camp', name: 'Sanctuary Gorilla Forest Camp', country: { name: 'Uganda', slug: 'uganda' }, region: { name: 'East Africa', slug: 'east-africa' }, listing_summary: 'Luxury camp near gorilla trekking trails.', detail_intro: 'Overlooks a clear-water stream.', hero_image_url: '/images/sanctuary.jpg', hero_image_alt: 'Gorilla Forest Camp', internalUrl: '/accommodations/sanctuary-gorilla-forest-camp' }],
  ]),
  activitiesBySlug: new Map([
    ['gorilla-trekking-bwindi', { id: 1, slug: 'gorilla-trekking-bwindi', name: 'Gorilla Trekking', country: { name: 'Uganda', slug: 'uganda' }, listing_summary: 'Track mountain gorillas.', hero_image_url: '/images/gorilla.jpg', internalUrl: '/activities/gorilla-trekking-bwindi' }],
  ]),
  attractions: [
    { id: 1, slug: 'bwindi-impenetrable-national-park', name: 'Bwindi', country_id: 2 },
    { id: 2, slug: 'maasai-mara', name: 'Maasai Mara', country_id: 1 },
  ],
  accommodations: [
    { id: 1, slug: 'governors-camp', name: "Governor's Camp", country_id: 1 },
    { id: 2, slug: 'sanctuary-gorilla-forest-camp', name: 'Sanctuary', country_id: 2 },
  ],
  activities: [
    { id: 1, slug: 'gorilla-trekking-bwindi', name: 'Gorilla Trekking', country_id: 2 },
  ],
  searchSuggestions: [
    { label: 'Kenya', type: 'country', value: 'kenya', context: 'East Africa' },
    { label: 'Uganda', type: 'country', value: 'uganda', context: 'East Africa' },
  ],
};

// ── Context extraction tests ──────────────────────────────────────────────────

describe('extractViewedEntities', () => {
  test('extracts country entity from pathname', () => {
    const entities = extractViewedEntities('/countries/kenya', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'country');
    assert.equal(entities[0].entity_slug, 'kenya');
    assert.equal(entities[0].entity_name, 'Kenya');
    assert.equal(entities[0].region.name, 'East Africa');
  });

  test('extracts attraction entity from pathname', () => {
    const entities = extractViewedEntities('/attractions/bwindi-impenetrable-national-park', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'attraction');
    assert.equal(entities[0].entity_slug, 'bwindi-impenetrable-national-park');
  });

  test('extracts accommodation entity from pathname', () => {
    const entities = extractViewedEntities('/accommodations/governors-camp', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'accommodation');
  });

  test('extracts activity entity from pathname', () => {
    const entities = extractViewedEntities('/activities/gorilla-trekking-bwindi', MOCK_SITE_MODEL);
    assert.equal(entities.length, 1);
    assert.equal(entities[0].entity_type, 'activity');
  });

  test('returns empty array for non-content pathnames', () => {
    assert.deepStrictEqual(extractViewedEntities('/contact', MOCK_SITE_MODEL), []);
    assert.deepStrictEqual(extractViewedEntities('/', MOCK_SITE_MODEL), []);
    assert.deepStrictEqual(extractViewedEntities('', MOCK_SITE_MODEL), []);
  });

  test('returns empty array when slug not found in site model', () => {
    const entities = extractViewedEntities('/countries/unknown-country', MOCK_SITE_MODEL);
    assert.deepStrictEqual(entities, []);
  });

  test('returns empty array when site model is null', () => {
    assert.deepStrictEqual(extractViewedEntities('/countries/kenya', null), []);
  });
});

// ── Context summary tests ─────────────────────────────────────────────────────

describe('buildContextSummary', () => {
  test('returns generic summary when no entities', () => {
    const summary = buildContextSummary([], MOCK_SITE_MODEL);
    assert.equal(summary, 'The traveler is browsing the Trek Africa Guide website.');
  });

  test('includes entity name and type for single entity', () => {
    const entities = [{ entity_type: 'country', entity_slug: 'kenya', entity_name: 'Kenya', country: { name: 'Kenya' } }];
    const summary = buildContextSummary(entities, MOCK_SITE_MODEL);
    assert.ok(summary.includes('Kenya'));
    assert.ok(summary.includes('country'));
  });

  test('includes country and region context', () => {
    const entities = [{
      entity_type: 'attraction',
      entity_slug: 'bwindi',
      entity_name: 'Bwindi Impenetrable National Park',
      country: { name: 'Uganda' },
      region: { name: 'East Africa' },
    }];
    const summary = buildContextSummary(entities, MOCK_SITE_MODEL);
    assert.ok(summary.includes('Uganda'));
    assert.ok(summary.includes('East Africa'));
  });
});

// ── Intent classification tests ───────────────────────────────────────────────

describe('classifyIntent', () => {
  test('classifies plan intent', async () => {
    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: JSON.stringify({
        intent: 'plan',
        confidence: 0.95,
        reasoning: 'User wants a multi-day itinerary',
      }),
    });

    const result = await classifyIntent({
      query: 'Plan a 7-day Kenya safari',
      contextSummary: 'Viewing Kenya',
      aiService,
    });

    assert.equal(result.intent, 'plan');
    assert.equal(result.confidence, 0.95);
    assert.ok(result.reasoning.length > 0);
  });

  test('classifies compare intent', async () => {
    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: JSON.stringify({
        intent: 'compare',
        confidence: 0.9,
        reasoning: 'User wants to compare two destinations',
      }),
    });

    const result = await classifyIntent({
      query: 'Compare Kenya and Uganda safaris',
      contextSummary: 'Viewing Kenya',
      aiService,
    });

    assert.equal(result.intent, 'compare');
  });

  test('classifies recommend intent', async () => {
    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: JSON.stringify({
        intent: 'recommend',
        confidence: 0.85,
        reasoning: 'User wants recommendations',
      }),
    });

    const result = await classifyIntent({
      query: 'What are the best places to stay in Uganda?',
      contextSummary: 'Viewing Uganda',
      aiService,
    });

    assert.equal(result.intent, 'recommend');
  });

  test('throws INVALID_RESPONSE on non-JSON', async () => {
    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: 'not json',
    });

    await assert.rejects(
      () => classifyIntent({ query: 'test', contextSummary: '', aiService }),
      (err) => err.code === 'INVALID_RESPONSE'
    );
  });

  test('throws INVALID_RESPONSE on unknown intent', async () => {
    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: JSON.stringify({ intent: 'unknown', confidence: 0.5, reasoning: 'x' }),
    });

    await assert.rejects(
      () => classifyIntent({ query: 'test', contextSummary: '', aiService }),
      (err) => err.code === 'INVALID_RESPONSE'
    );
  });
});

// ── Response parsing and validation tests ─────────────────────────────────────

describe('parseTrekResponse', () => {
  test('parses valid JSON array of blocks', () => {
    const text = JSON.stringify([
      { type: 'text', content: 'Hello' },
      { type: 'route', total_days: 3, steps: [] },
    ]);
    const blocks = parseTrekResponse(text, 'plan');
    assert.equal(blocks.length, 2);
    assert.equal(blocks[0].type, 'text');
    assert.equal(blocks[1].type, 'route');
  });

  test('throws INVALID_RESPONSE on non-JSON', () => {
    assert.throws(
      () => parseTrekResponse('not json', 'plan'),
      (err) => err.code === 'INVALID_RESPONSE'
    );
  });

  test('throws INVALID_RESPONSE on non-array', () => {
    assert.throws(
      () => parseTrekResponse(JSON.stringify({ foo: 'bar' }), 'plan'),
      (err) => err.code === 'INVALID_RESPONSE'
    );
  });

  test('filters out blocks with unknown types', () => {
    const text = JSON.stringify([
      { type: 'text', content: 'Hello' },
      { type: 'unknown_type', data: 'x' },
      { type: 'route', total_days: 3, steps: [] },
    ]);
    const blocks = parseTrekResponse(text, 'plan');
    assert.equal(blocks.length, 2);
    assert.ok(blocks.every((b) => ['text', 'route'].includes(b.type)));
  });

  test('throws INVALID_RESPONSE when no valid blocks', () => {
    assert.throws(
      () => parseTrekResponse(JSON.stringify([{ type: 'bad' }]), 'plan'),
      (err) => err.code === 'INVALID_RESPONSE'
    );
  });

  test('enriches accommodation blocks with site model data', () => {
    const text = JSON.stringify([
      { type: 'accommodations', items: [
        { name: '', slug: 'governors-camp', location_name: '', listing_summary: '' },
      ] },
    ]);
    const blocks = parseTrekResponse(text, 'recommend', MOCK_SITE_MODEL);
    assert.equal(blocks[0].type, 'accommodations');
    const item = blocks[0].items[0];
    assert.equal(item.name, "Governor's Camp");
    assert.ok(item.hero_image_url);
    assert.equal(item.internal_url, '/accommodations/governors-camp');
  });

  test('fills in map marker coordinates from COORDINATES', () => {
    const text = JSON.stringify([
      { type: 'map', markers: [
        { lat: null, lng: null, label: 'Bwindi', entity_type: 'attraction', entity_slug: 'bwindi-impenetrable-national-park' },
      ] },
    ]);
    const blocks = parseTrekResponse(text, 'plan', MOCK_SITE_MODEL);
    const marker = blocks[0].markers[0];
    assert.equal(marker.lat, -1.47);
    assert.equal(marker.lng, 29.583);
  });
});

// ── Prompt builder tests ──────────────────────────────────────────────────────

describe('buildAskTrekPrompt', () => {
  test('builds messages for plan intent', () => {
    const messages = buildAskTrekPrompt({
      intent: INTENT_TYPES.PLAN,
      query: '8 days in Uganda',
      contextSummary: 'Viewing Uganda',
      entitySlugs: 'uganda (country), bwindi-impenetrable-national-park (attraction)',
    });
    assert.equal(messages.length, 2);
    assert.equal(messages[0].role, 'system');
    assert.ok(messages[0].content.includes('Ask Trek'));
    assert.ok(messages[0].content.includes('8 days in Uganda'));
    assert.ok(messages[0].content.includes('bwindi-impenetrable-national-park'));
  });

  test('builds messages for compare intent', () => {
    const messages = buildAskTrekPrompt({
      intent: INTENT_TYPES.COMPARE,
      query: 'Compare lodges',
      contextSummary: 'Viewing Kenya',
      entitySlugs: 'kenya (country)',
    });
    assert.equal(messages[0].role, 'system');
    assert.ok(messages[0].content.includes('compare'));
  });

  test('builds messages for recommend intent', () => {
    const messages = buildAskTrekPrompt({
      intent: INTENT_TYPES.RECOMMEND,
      query: 'Best activities',
      contextSummary: 'Viewing Uganda',
      entitySlugs: '',
    });
    assert.ok(messages[0].content.includes('recommend'));
  });

  test('throws INVALID_REQUEST for unknown intent', () => {
    assert.throws(
      () => buildAskTrekPrompt({ intent: 'unknown', query: 'test', contextSummary: '', entitySlugs: '' }),
      (err) => err.code === 'INVALID_REQUEST'
    );
  });
});

// ── Intent handler tests ──────────────────────────────────────────────────────

describe('handleTripPlanning', () => {
  test('returns plan response with blocks from AI', async () => {
    const aiResponse = JSON.stringify([
      { type: 'route', total_days: 8, steps: [
        { stop: 'Bwindi Impenetrable National Park', entity_slug: 'bwindi-impenetrable-national-park', entity_type: 'attraction', duration_days: 3, description: 'Gorilla trekking', hero_image_url: '/images/bwindi.jpg' },
        { stop: 'Queen Elizabeth National Park', entity_slug: 'queen-elizabeth-national-park', entity_type: 'attraction', duration_days: 2, description: 'Game drives', hero_image_url: null },
        { stop: 'Entebbe', entity_slug: 'entebbe', entity_type: 'attraction', duration_days: 1, description: 'Departure', hero_image_url: null },
      ] },
      { type: 'experiences', items: [
        { name: 'Gorilla trekking', description: 'Track mountain gorillas', duration: '4 hours', hero_image_url: '/images/gorilla.jpg' },
      ] },
      { type: 'accommodations', items: [
        { name: 'Sanctuary Gorilla Forest Camp', slug: 'sanctuary-gorilla-forest-camp', location_name: 'Bwindi, Uganda', listing_summary: 'Luxury camp', hero_image_url: '/images/sanctuary.jpg', hero_image_alt: 'Camp' },
      ] },
      { type: 'map', markers: [
        { lat: -1.47, lng: 29.583, label: 'Bwindi', entity_type: 'attraction', entity_slug: 'bwindi-impenetrable-national-park' },
      ], route_path: [[-1.47, 29.583], [-1.47, 30.0]] },
      { type: 'actions', buttons: [
        { label: 'Save to trip', action: 'add_to_trip', payload: {} },
      ] },
    ]);

    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: aiResponse,
    });

    const result = await handleTripPlanning({
      query: 'I have eight days in Uganda and want gorillas and wildlife',
      contextSummary: 'Viewing Uganda',
      entitySlugs: 'uganda (country), bwindi-impenetrable-national-park (attraction)',
      aiService,
    });

    assert.equal(result.response_type, 'plan');
    assert.ok(result.blocks.length >= 5);
    assert.ok(result.blocks.some((b) => b.type === 'route'));
    assert.ok(result.blocks.some((b) => b.type === 'experiments' || b.type === 'experiences'));
    assert.ok(result.blocks.some((b) => b.type === 'map'));
    assert.ok(result.blocks.some((b) => b.type === 'actions'));
    assert.ok(result.suggestions.length > 0);
    assert.ok(result.actions.response_id);
  });

  test('enriches accommodation blocks with real CMS data', async () => {
    const aiResponse = JSON.stringify([
      { type: 'accommodations', items: [
        { slug: 'governors-camp', name: '', location_name: '', listing_summary: '' },
      ] },
    ]);

    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.PLAN]: aiResponse,
    });

    const result = await handleTripPlanning({
      query: 'Plan a trip',
      contextSummary: 'Viewing Kenya',
      entitySlugs: 'kenya (country), governors-camp (accommodation)',
      aiService,
    });

    // processAskTrekRequest enriches, but handler doesn't have site model.
    // The handler returns parsed blocks; enrichment happens in processAskTrekRequest.
    // Here we test parseTrekResponse directly for enrichment:
    const { parseTrekResponse } = await import('../../server/knowledge/trek-assistant.mjs');
    const blocks = parseTrekResponse(aiResponse, 'plan', MOCK_SITE_MODEL);
    const accItem = blocks[0].items[0];
    assert.equal(accItem.name, "Governor's Camp");
    assert.equal(accItem.hero_image_url, '/images/governors-camp.jpg');
    assert.equal(accItem.internal_url, '/accommodations/governors-camp');
  });
});

// ── Comparison handler tests ──────────────────────────────────────────────────

describe('handleComparison', () => {
  test('returns comparison response with blocks', async () => {
    const aiResponse = JSON.stringify([
      { type: 'comparison', entities: [
        { name: 'Bwindi Impenetrable National Park', slug: 'bwindi-impenetrable-national-park', type: 'attraction' },
        { name: 'Queen Elizabeth National Park', slug: 'queen-elizabeth-national-park', type: 'attraction' },
      ], fields: [
        { field: 'Gorilla trekking', values: { 'bwindi-impenetrable-national-park': 'Yes', 'queen-elizabeth-national-park': 'No' } },
      ] },
      { type: 'actions', buttons: [
        { label: 'Save comparison', action: 'save', payload: {} },
      ] },
    ]);

    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.COMPARE]: aiResponse,
    });

    const result = await handleComparison({
      query: 'Compare Bwindi and Queen Elizabeth',
      contextSummary: 'Viewing Uganda',
      entitySlugs: 'bwindi-impenetrable-national-park (attraction), queen-elizabeth-national-park (attraction)',
      aiService,
    });

    assert.equal(result.response_type, 'compare');
    assert.ok(result.blocks.some((b) => b.type === 'comparison'));
    assert.ok(result.blocks[0].entities.length === 2);
    assert.ok(result.blocks[0].fields.length === 1);
  });
});

// ── Recommendation handler tests ──────────────────────────────────────────────

describe('handleRecommendation', () => {
  test('returns recommendation response with entity blocks', async () => {
    const aiResponse = JSON.stringify([
      { type: 'attractions', items: [
        { name: 'Bwindi Impenetrable National Park', slug: 'bwindi-impenetrable-national-park', location_name: 'Southwestern Uganda', listing_summary: 'Home to mountain gorillas.', hero_image_url: '/images/bwindi.jpg', hero_image_alt: 'Bwindi' },
      ] },
      { type: 'activities', items: [
        { name: 'Gorilla trekking', slug: 'gorilla-trekking-bwindi', location_name: 'Bwindi', listing_summary: 'Track gorillas', hero_image_url: '/images/gorilla.jpg', hero_image_alt: 'Gorilla' },
      ] },
    ]);

    const aiService = createMockAIService({
      [ASK_TREK_TASK_TYPES.RECOMMEND]: aiResponse,
    });

    const result = await handleRecommendation({
      query: 'Best activities near Bwindi?',
      contextSummary: 'Viewing Bwindi',
      entitySlugs: 'bwindi-impenetrable-national-park (attraction)',
      aiService,
    });

    assert.equal(result.response_type, 'recommend');
    assert.ok(result.blocks.some((b) => b.type === 'attractions'));
    assert.ok(result.blocks.some((b) => b.type === 'activities'));
  });
});

// ── processAskTrekRequest integration tests ───────────────────────────────────

describe('processAskTrekRequest', () => {
  test('throws INVALID_REQUEST for empty query', async () => {
    await assert.rejects(
      () => processAskTrekRequest({ query: '', env: {} }),
      (err) => err.code === 'INVALID_REQUEST'
    );
  });

  test('throws INVALID_REQUEST for whitespace-only query', async () => {
    await assert.rejects(
      () => processAskTrekRequest({ query: '   ', env: {} }),
      (err) => err.code === 'INVALID_REQUEST'
    );
  });

  test('throws INVALID_REQUEST for non-string query', async () => {
    await assert.rejects(
      () => processAskTrekRequest({ query: 123, env: {} }),
      (err) => err.code === 'INVALID_REQUEST'
    );
  });
});

// ── Suggested prompts tests ───────────────────────────────────────────────────

describe('getSuggestedPrompts', () => {
  test('returns all prompts when no filter', async () => {
    const prompts = await getSuggestedPrompts({});
    assert.ok(prompts.length > 0);
    assert.ok(prompts[0].prompt_text);
    assert.ok(prompts[0].category);
  });

  test('filters by category', async () => {
    const prompts = await getSuggestedPrompts({ category: 'trip_planning' });
    assert.ok(prompts.every((p) => p.category === 'trip_planning'));
  });

  test('filters by entity type keywords', async () => {
    const prompts = await getSuggestedPrompts({ entityType: 'country' });
    // Should include prompts with safari/itinerary/trip keywords
    assert.ok(prompts.length > 0);
  });

  test('sorts by sort_order', async () => {
    const prompts = await getSuggestedPrompts({});
    for (let i = 1; i < prompts.length; i++) {
      assert.ok(prompts[i].sort_order >= prompts[i - 1].sort_order);
    }
  });
});

// ── COORDINATES tests ─────────────────────────────────────────────────────────

describe('COORDINATES', () => {
  test('contains coordinates for known Uganda attractions', () => {
    assert.ok(COORDINATES['bwindi-impenetrable-national-park']);
    assert.ok(COORDINATES['bwindi-impenetrable-national-park'].lat !== undefined);
    assert.ok(COORDINATES['bwindi-impenetrable-national-park'].lng !== undefined);
  });

  test('contains coordinates for Kenya', () => {
    assert.ok(COORDINATES['kenya']);
    assert.ok(COORDINATES['amboseli-national-park']);
  });

  test('all entries have lat and lng numbers', () => {
    for (const [key, coord] of Object.entries(COORDINATES)) {
      assert.equal(typeof coord.lat, 'number', `COORDINATES[${key}].lat is not a number`);
      assert.equal(typeof coord.lng, 'number', `COORDINATES[${key}].lng is not a number`);
    }
  });
});
