// Ask Trek AI Assistant: visual, contextual, agentic travel interface.
// The traveler asks a natural-language question (optionally with page context)
// and the AI responds with structured JSON blocks the frontend renders as
// visual components (routes, cards, maps, itineraries, action buttons).
//
// Reuses existing patterns from classify.mjs, opportunities.mjs, and the
// AI service abstraction (getAIService → service.run).

import { randomUUID } from 'node:crypto';
import { AIError } from '../ai/errors.mjs';
import { getAIService } from '../ai/service.mjs';
import { FORBIDDEN_FIELDS } from '../content-manager/validate.mjs';
// getSiteModel is imported lazily inside processAskTrekRequest so test
// environments can inject a mock siteModel without triggering Supabase client init.

// ── Constants ─────────────────────────────────────────────────────────────────

// AI task type names (must match ai_task_config rows seeded by the migration seed).
export const ASK_TREK_TASK_TYPES = {
  PLAN: 'ask_trek_plan',
  COMPARE: 'ask_trek_compare',
  RECOMMEND: 'ask_trek_recommend',
};

// Intent classification values returned by the classify step.
export const INTENT_TYPES = {
  PLAN: 'plan',
  COMPARE: 'compare',
  RECOMMEND: 'recommend',
  OTHER: 'other',
};

// Route segment patterns for extracting viewed-entity context from pathnames.
const PATH_PATTERNS = {
  country: /^\/countries\/([^/]+)\/?$/,
  attraction: /^\/attractions\/([^/]+)\/?$/,
  activity: /^\/activities\/([^/]+)\/?$/,
  accommodation: /^\/accommodations\/([^/]+)\/?$/,
  restaurant: /^\/restaurants\/([^/]+)\/?$/,
};

// Curated centroid coordinates for known entities (countries, attractions).
// Used for map rendering — avoids schema migrations for lat/lng columns.
// Coordinates are approximate centroids of each destination's geographic area.
export const COORDINATES = {
  // Countries
  'kenya': { lat: -1.2921, lng: 36.8213 },
  'tanzania': { lat: -6.3690, lng: 27.9235 },
  'uganda': { lat: 1.3770, lng: 32.2903 },
  'south-africa': { lat: -30.5595, lng: 22.9375 },
  'morocco': { lat: 31.7881, lng: -7.0924 },
  'sao-tome-and-principe': { lat: 1.6170, lng: 54.7790 },

  // Uganda attractions
  'bwindi-impenetrable-national-park': { lat: -1.4700, lng: 29.5830 },
  'maasai-mara-national-reserve': { lat: -1.4941, lng: 35.0078 },
  'serengeti-national-park': { lat: -2.3387, lng: 34.8333 },
  'queen-elizabeth-national-park': { lat: -0.1883, lng: 29.7094 },
  'entebbe': { lat: 0.2366, lng: 32.5033 },

  // Kenya attractions
  'amboseli-national-park': { lat: -2.4269, lng: 37.2266 },
  'masai-mara': { lat: -1.4941, lng: 35.0078 },

  // Accommodations (approximate centroids)
  'governors-camp': { lat: -1.4941, lng: 35.0078 },
  'mount-nelson-a-belmond-hotel': { lat: -33.9320, lng: 18.4103 },
  'ol-tukai-lodge-amboseli': { lat: -2.4269, lng: 37.2266 },
  'paraa-safari-lodge': { lat: -1.4941, lng: 35.0078 },
  'riad-rosemary': { lat: 31.7881, lng: -7.0924 },
  'sanctuary-gorilla-forest-camp': { lat: -1.4700, lng: 29.5830 },
  'desert-luxury-camp': { lat: 27.1250, lng: -10.9420 },
  'emerson-spice': { lat: -3.3833, lng: 36.8167 },
};

// Suggested prompts shown to travelers before they type a query.
export const SUGGESTED_PROMPTS = [
  { prompt_text: 'Plan a 7-day Kenya safari itinerary', trigger_keywords: ['safari', 'kenya', 'itinerary', 'trip'], category: 'trip_planning', sort_order: 10 },
  { prompt_text: 'Plan 8 days in Uganda for gorilla trekking and wildlife', trigger_keywords: ['uganda', 'gorilla', 'wildlife', 'bwindi'], category: 'trip_planning', sort_order: 20 },
  { prompt_text: 'Compare luxury lodges in Maasai Mara', trigger_keywords: ['compare', 'lodge', 'maasai mara', 'luxury'], category: 'comparison', sort_order: 30 },
  { prompt_text: 'What are the best activities near Bwindi?', trigger_keywords: ['activity', 'bwindi', 'thing to do'], category: 'recommendation', sort_order: 40 },
  { prompt_text: 'Suggest accommodations near Serengeti National Park', trigger_keywords: ['accommodation', 'stay', 'serengeti', 'hotel'], category: 'recommendation', sort_order: 50 },
  { prompt_text: 'Plan a road trip through Morocco', trigger_keywords: ['morocco', 'road trip', 'itinerary'], category: 'trip_planning', sort_order: 60 },
  { prompt_text: 'Compare Uganda and Kenya safari experiences', trigger_keywords: ['compare', 'uganda', 'kenya', 'safari'], category: 'comparison', sort_order: 70 },
  { prompt_text: 'What wildlife can I see in each Ugandan park?', trigger_keywords: ['wildlife', 'uganda', 'animal', 'park'], category: 'recommendation', sort_order: 80 },
];

// ── System prompt for intent classification ────────────────────────────────────

const CLASSIFY_INTENT_PROMPT = [
  {
    role: 'system',
    content: `You are an AI travel assistant classifier. Given a traveler's query and context, determine the primary intent.

Possible intents: plan, compare, recommend, other.

- "plan": the traveler wants an itinerary, route, or multi-day plan covering multiple destinations.
- "compare": the traveler wants to compare two or more destinations, accommodations, activities, or attractions side by side.
- "recommend": the traveler wants a filtered or sorted list of suggestions (a single-type recommendation).
- "other": the query doesn't fit the above clearly.

Output strictly valid JSON only. Format:
{
  "intent": "plan" | "compare" | "recommend" | "other",
  "confidence": 0.0-1.0,
  "reasoning": "one sentence"
}
`,
  },
  {
    role: 'user',
    content: `Query: "{QUERY}"

Context: {CONTEXT}

Classify the intent:`,
  },
];

// ── System prompt for trip planning ───────────────────────────────────────────

const PLAN_PROMPT = `You are "Ask Trek", a visual AI travel assistant for Trek Africa Guide. The traveler is planning a trip and wants a structured, visual response.

**Strict rules:**
- Only reference real entities by their CMS slug (provided in context). Do NOT invent new destinations, accommodations, or attractions.
- Return strictly valid JSON matching the response block schema below. No prose, no explanations, no markdown.
- For any field you cannot determine, use null.
- NEVER include booking links, prices, availability, ratings, review counts, or visa/permit information for any entity — these are forbidden.
- Use the curated coordinates provided for map markers (lat/lng pairs).

Response block schema (JSON array of blocks):
[
  {
    "type": "route",
    "total_days": 8,
    "steps": [
      { "stop": "Bwindi Impenetrable National Park", "entity_slug": "bwindi-impenetrable-national-park", "entity_type": "attraction", "duration_days": 3, "description": "Gorilla trekking in the misty rainforest.", "hero_image_url": "/images/bwindi.jpg" }
    ]
  },
  {
    "type": "experiences",
    "items": [
      { "name": "Gorilla trekking", "description": "Track mountain gorillas with a guide.", "duration": "4 hours", "hero_image_url": "/images/gorilla.jpg" }
    ]
  },
  {
    "type": "accommodations",
    "items": [
      { "name": "Sanctuary Gorilla Forest Camp", "slug": "sanctuary-gorilla-forest-camp", "location_name": "Bwindi, Uganda", "listing_summary": "Luxury camp near gorilla trekking trails.", "hero_image_url": "/images/sanctuary.jpg", "hero_image_alt": "Sanctuary Gorilla Forest Camp" }
    ]
  },
  {
    "type": "itinerary",
    "days": [
      { "day": 1, "location": "Kampala", "activities": ["Arrival", "City tour"], "description": "Arrive in Entebbe, transfer to Kampala.", "accommodation": null }
    ]
  },
  {
    "type": "map",
    "markers": [
      { "lat": -1.4700, "lng": 29.5830, "label": "Bwindi Impenetrable National Park", "entity_type": "attraction", "entity_slug": "bwindi-impenetrable-national-park" }
    ],
    "route_path": [[-1.4700, 29.5830], [-1.4700, 30.0000]]
  },
  {
    "type": "actions",
    "buttons": [
      { "label": "Save this plan to my trip", "action": "add_to_trip", "payload": { "blocks": "<blocks reference>" } },
      { "label": "Compare accommodations", "action": "compare", "payload": {} }
    ]
  }
]

Available entity slugs in context: {ENTITY_SLUGS}

Query: "{QUERY}"
Context: {CONTEXT}

JSON output:`;

// ── System prompt for comparison ──────────────────────────────────────────────

const COMPARE_PROMPT = `You are "Ask Trek", a visual AI travel assistant for Trek Africa Guide. The traveler wants to compare options side by side.

**Strict rules:**
- Only compare entities that exist in the provided context (real CMS slugs).
- Return strictly valid JSON matching the block schema below. No prose.
- NEVER include booking links, prices, availability, ratings, or review counts.
- If you can't determine a field, use null.

Comparison block schema:
[
  {
    "type": "comparison",
    "entities": [
      { "name": "Bwindi Impenetrable National Park", "slug": "bwindi-impenetrable-national-park", "type": "attraction" },
      { "name": "Queen Elizabeth National Park", "slug": "queen-elizabeth-national-park", "type": "attraction" }
    ],
    "fields": [
      { "field": "Gorilla trekking", "values": { "bwindi-impenetrable-national-park": "Yes — mountain gorillas", "queen-elizabeth-national-park": "No" }, "description": "Whether the park offers gorilla tracking." }
    ]
  },
  {
    "type": "actions",
    "buttons": [
      { "label": "Save comparison", "action": "save", "payload": {} }
    ]
  }
]

Entities in context: {ENTITY_SLUGS}
Query: "{QUERY}"
Context: {CONTEXT}

JSON output:`;

// ── System prompt for recommendation ──────────────────────────────────────────

const RECOMMEND_PROMPT = `You are "Ask Trek", a visual AI travel assistant for Trek Africa Guide. The traveler wants recommendations.

**Strict rules:**
- Only recommend entities that exist in the provided context (real CMS slugs).
- Return strictly valid JSON matching the block schema below. No prose.
- NEVER include booking links, prices, availability, ratings, or review counts.
- If you can't determine a field, use null.

Recommendation block schema:
[
  {
    "type": "attractions",
    "items": [
      { "name": "Bwindi Impenetrable National Park", "slug": "bwindi-impenetrable-national-park", "location_name": "Southwestern Uganda", "listing_summary": "Home to endangered mountain gorillas.", "hero_image_url": "/images/bwindi.jpg", "hero_image_alt": "Bwindi rainforest" }
    ]
  },
  {
    "type": "accommodations",
    "items": [
      { "name": "Sanctuary Gorilla Forest Camp", "slug": "sanctuary-gorilla-forest-camp", "location_name": "Bwindi, Uganda", "listing_summary": "Luxury camp near gorilla trekking trails.", "hero_image_url": "/images/sanctuary.jpg", "hero_image_alt": "Sanctuary Gorilla Forest Camp" }
    ]
  },
  {
    "type": "activities",
    "items": [
      { "name": "Gorilla trekking", "slug": "gorilla-trekking-bwindi", "location_name": "Bwindi Impenetrable National Park", "listing_summary": "Track mountain gorillas with a licensed guide.", "hero_image_url": "/images/gorilla.jpg", "hero_image_alt": "Mountain gorilla family" }
    ]
  },
  {
    "type": "actions",
    "buttons": [
      { "label": "Add to my trip", "action": "add_to_trip", "payload": {} }
    ]
  }
]

Available entity slugs in context: {ENTITY_SLUGS}
Query: "{QUERY}"
Context: {CONTEXT}

JSON output:`;

// ── Response block types (JSDoc typedef for reference) ───────────────────────

/**
 * @typedef {Object} RouteStep
 * @property {string} stop
 * @property {string} entity_slug
 * @property {string} entity_type
 * @property {number} duration_days
 * @property {string} description
 * @property {string|null} hero_image_url
 */

/**
 * @typedef {Object} ExperienceItem
 * @property {string} name
 * @property {string} description
 * @property {string} duration
 * @property {string|null} hero_image_url
 */

/**
 * @typedef {Object} EntityItem
 * @property {string} name
 * @property {string} slug
 * @property {string} type
 * @property {string} location_name
 * @property {string} listing_summary
 * @property {string|null} hero_image_url
 * @property {string|null} hero_image_alt
 */

/**
 * @typedef {Object} ComparisonField
 * @property {string} field
 * @property {Record<string, string>} values
 * @property {string|null} [description]
 */

/**
 * @typedef {Object} MapMarker
 * @property {number} lat
 * @property {number} lng
 * @property {string} label
 * @property {string} entity_type
 * @property {string} entity_slug
 */

/**
 * @typedef {Object} ItineraryDay
 * @property {number} day
 * @property {string} location
 * @property {string[]} activities
 * @property {string|null} [accommodation]
 * @property {string|null} [description]
 */

/**
 * @typedef {Object} ActionButton
 * @property {string} label
 * @property {('add_to_trip'|'compare'|'save'|'explore')} action
 * @property {Object} payload
 */

/**
 * @typedef {Object} FilterOption
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} ResponseBlock
 * @property {string} type
 */

/**
 * @typedef {Object} AskTrekResponse
 * @property {string} response_type
 * @property {ResponseBlock[]} blocks
 * @property {string[]} suggestions
 * @property {Object} actions
 */

// ── Context extraction ────────────────────────────────────────────────────────

const PATH_SEGMENT_TO_TYPE = {
  countries: 'country',
  attractions: 'attraction',
  activities: 'activity',
  accommodations: 'accommodation',
  restaurants: 'restaurant',
};

// Map singular entity_type to the site-model slug-map property name.
// Handles irregular plurals (country→countries, activity→activities).
const SLUG_MAP_NAMES = {
  country: 'countriesBySlug',
  attraction: 'attractionsBySlug',
  activity: 'activitiesBySlug',
  accommodation: 'accommodationsBySlug',
  restaurant: 'restaurantsBySlug',
  region: 'regionsBySlug',
};

/**
 * Extract viewed entities from a URL pathname using the site model's slug maps.
 * Returns an array of { entity_type, entity_slug, entity_id, entity_name, country, region }.
 *
 * @param {string} pathname - e.g. "/countries/kenya" or "/attractions/bwindi-impenetrable-national-park"
 * @param {object} siteModel - the frozen site model from getSiteModel()
 * @returns {Array<{entity_type: string, entity_slug: string, entity_id?: number, entity_name: string, country?: object, region?: object}>}
 */
export function extractViewedEntities(pathname, siteModel) {
  if (!pathname) return [];
  if (!siteModel) return [];

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return [];

  const collection = segments[0]; // countries, attractions, etc.
  const slug = segments[1];
  const entityType = PATH_SEGMENT_TO_TYPE[collection];

  if (!entityType) return [];

  // Look up the entity in the appropriate slug map
  const slugMapName = SLUG_MAP_NAMES[entityType];
  const slugMap = slugMapName ? siteModel[slugMapName] : siteModel[`${entityType}sBySlug`];
  if (!slugMap) return [];

  const entity = slugMap.get(slug);
  if (!entity) return [];

  return [{
    entity_type: entityType,
    entity_slug: slug,
    entity_id: entity.id,
    entity_name: entity.name || entity.title || slug,
    country: entity.country ? { name: entity.country.name, slug: entity.country.slug } : undefined,
    region: entity.region ? { name: entity.region.name, slug: entity.region.slug } : undefined,
    hero_image_url: entity.hero_image_url || null,
  }];
}

/**
 * Build a concise context summary for the AI prompt.
 *
 * @param {Array} entities - output of extractViewedEntities
 * @param {object} siteModel - the frozen site model
 * @returns {string} human-readable context string
 */
export function buildContextSummary(entities, siteModel) {
  if (!entities || entities.length === 0) {
    return 'The traveler is browsing the Trek Africa Guide website.';
  }

  const parts = entities.map((e) => {
    const lines = [];
    lines.push(`Viewing: ${e.entity_name} (${e.entity_type})`);
    if (e.country) lines.push(`  Country: ${e.country.name}`);
    if (e.region) lines.push(`  Region: ${e.region.name}`);
    return lines.join('\n');
  });

  return `Current page context:\n${parts.join('\n')}`;
}

/**
 * Build the list of entity slugs available in context for the AI prompt.
 *
 * @param {Array} entities
 * @param {object} siteModel
 * @returns {string} comma-separated slug list
 */
export function getEntitySlugs(entities, siteModel) {
  if (!entities || entities.length === 0) return '';
  const slugs = entities.map((e) => `${e.entity_slug} (${e.entity_type})`);

  // Also include nearby entities (same country) so the AI can suggest alternatives
  const nearby = [];
  for (const e of entities) {
    const slugMapName = SLUG_MAP_NAMES[e.entity_type];
    const entity = slugMapName ? siteModel[slugMapName]?.get(e.entity_slug) : undefined;
    if (entity) {
      if (e.entity_type === 'country') {
        // Add attractions in this country
        const countryAttractions = (siteModel.attractions || []).filter((a) => a.country_id === entity.id);
        for (const a of countryAttractions) {
          nearby.push(`${a.slug} (attraction)`);
        }
        const countryAccommodations = (siteModel.accommodations || []).filter((a) => a.country_id === entity.id);
        for (const a of countryAccommodations) {
          nearby.push(`${a.slug} (accommodation)`);
        }
      }
    }
  }

  // Dedupe
  const all = [...new Set([...slugs, ...nearby])];
  return all.join(', ');
}

// ── Intent classification ─────────────────────────────────────────────────────

/**
 * Classify the traveler's intent using the AI service.
 *
 * @param {object} params
 * @param {string} params.query
 * @param {string} params.contextSummary
 * @param {object} [params.aiService]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{intent: string, confidence: number, reasoning: string}>}
 */
export async function classifyIntent({ query, contextSummary, aiService: injectedService, env, signal }) {
  const aiService = injectedService || getAIService(env || process.env);

  const messages = CLASSIFY_INTENT_PROMPT.map((m) => ({
    ...m,
    content: m.content
      .replace('{QUERY}', query || '')
      .replace('{CONTEXT}', contextSummary || ''),
  }));

  const result = await aiService.run(
    { task_type: ASK_TREK_TASK_TYPES.PLAN, messages, public_cache_version: query },
    { signal }
  );

  let parsed;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    throw new AIError('INVALID_RESPONSE', { message: 'classifyIntent returned non-JSON' });
  }

  if (!parsed.intent || !Object.values(INTENT_TYPES).includes(parsed.intent)) {
    throw new AIError('INVALID_RESPONSE', { message: 'classifyIntent missing valid intent' });
  }

  return {
    intent: parsed.intent,
    confidence: Math.min(1.0, Math.max(0.0, Number(parsed.confidence) || 0)),
    reasoning: parsed.reasoning || '',
  };
}

// ── Intent handlers ───────────────────────────────────────────────────────────

/**
 * Handle trip planning intent — generate routes, experiences, accommodations,
 * itinerary, map, and action blocks.
 *
 * @param {object} params
 * @param {string} params.query
 * @param {string} params.contextSummary
 * @param {string} params.entitySlugs
 * @param {object} [params.aiService]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{response_type: string, blocks: Array, suggestions: string[], actions: object}>}
 */
export async function handleTripPlanning({ query, contextSummary, entitySlugs, aiService: injectedService, env, signal }) {
  const aiService = injectedService || getAIService(env || process.env);

  const prompt = buildAskTrekPrompt({
    intent: INTENT_TYPES.PLAN,
    query,
    contextSummary,
    entitySlugs,
  });

  const result = await aiService.run(
    { task_type: ASK_TREK_TASK_TYPES.PLAN, messages: prompt, public_cache_version: `plan:${query}:${entitySlugs}` },
    { signal }
  );

  const blocks = parseTrekResponse(result.text, INTENT_TYPES.PLAN);

  return {
    response_type: INTENT_TYPES.PLAN,
    blocks,
    suggestions: extractSuggestedQueries(blocks, query),
    actions: { response_id: result.id, provider: result.provider, model: result.model, cached: result.cached },
  };
}

/**
 * Handle comparison intent — generate comparison tables.
 *
 * @param {object} params
 * @param {string} params.query
 * @param {string} params.contextSummary
 * @param {string} params.entitySlugs
 * @param {object} [params.aiService]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{response_type: string, blocks: Array, suggestions: string[], actions: object}>}
 */
export async function handleComparison({ query, contextSummary, entitySlugs, aiService: injectedService, env, signal }) {
  const aiService = injectedService || getAIService(env || process.env);

  const prompt = buildAskTrekPrompt({
    intent: INTENT_TYPES.COMPARE,
    query,
    contextSummary,
    entitySlugs,
  });

  const result = await aiService.run(
    { task_type: ASK_TREK_TASK_TYPES.COMPARE, messages: prompt, public_cache_version: `compare:${query}:${entitySlugs}` },
    { signal }
  );

  const blocks = parseTrekResponse(result.text, INTENT_TYPES.COMPARE);

  return {
    response_type: INTENT_TYPES.COMPARE,
    blocks,
    suggestions: extractSuggestedQueries(blocks, query),
    actions: { response_id: result.id, provider: result.provider, model: result.model, cached: result.cached },
  };
}

/**
 * Handle recommendation intent — generate filtered entity lists.
 *
 * @param {object} params
 * @param {string} params.query
 * @param {string} params.contextSummary
 * @param {string} params.entitySlugs
 * @param {object} [params.aiService]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{response_type: string, blocks: Array, suggestions: string[], actions: object}>}
 */
export async function handleRecommendation({ query, contextSummary, entitySlugs, aiService: injectedService, env, signal }) {
  const aiService = injectedService || getAIService(env || process.env);

  const prompt = buildAskTrekPrompt({
    intent: INTENT_TYPES.RECOMMEND,
    query,
    contextSummary,
    entitySlugs,
  });

  const result = await aiService.run(
    { task_type: ASK_TREK_TASK_TYPES.RECOMMEND, messages: prompt, public_cache_version: `recommend:${query}:${entitySlugs}` },
    { signal }
  );

  const blocks = parseTrekResponse(result.text, INTENT_TYPES.RECOMMEND);

  return {
    response_type: INTENT_TYPES.RECOMMEND,
    blocks,
    suggestions: extractSuggestedQueries(blocks, query),
    actions: { response_id: result.id, provider: result.provider, model: result.model, cached: result.cached },
  };
}

// ── Prompt builder ────────────────────────────────────────────────────────────

const INTENT_PROMPTS = {
  [INTENT_TYPES.PLAN]: PLAN_PROMPT,
  [INTENT_TYPES.COMPARE]: COMPARE_PROMPT,
  [INTENT_TYPES.RECOMMEND]: RECOMMEND_PROMPT,
};

/**
 * Build AI messages for the given intent, substituting query, context, and entity slugs.
 *
 * @param {object} params
 * @param {string} params.intent
 * @param {string} params.query
 * @param {string} params.contextSummary
 * @param {string} params.entitySlugs
 * @returns {Array<{role: string, content: string}>}
 */
export function buildAskTrekPrompt({ intent, query, contextSummary, entitySlugs }) {
  const template = INTENT_PROMPTS[intent];
  if (!template) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown intent: ${intent}` });
  }

  const content = template
    .replace('{ENTITY_SLUGS}', entitySlugs || '')
    .replace('{QUERY}', query || '')
    .replace('{CONTEXT}', contextSummary || '');

  return [
    { role: 'system', content },
    { role: 'user', content: `Query: "${query}"\nContext: ${contextSummary || ''}\n\nJSON output:` },
  ];
}

// ── Response parsing ──────────────────────────────────────────────────────────

const VALID_BLOCK_TYPES = new Set([
  'text', 'route', 'experiences', 'accommodations', 'activities',
  'attractions', 'comparison', 'map', 'itinerary', 'actions', 'filters',
]);

/**
 * Parse raw AI JSON text into validated response blocks.
 * Validates each block has a known type; enriches entity items with CMS data.
 *
 * @param {string} text - raw AI response text
 * @param {string} intent - the intent type (for logging/validation)
 * @param {object} [siteModel] - optional site model for enrichment
 * @returns {Array} validated block array
 * @throws {AIError} INVALID_RESPONSE if JSON is invalid or no valid blocks
 */
export function parseTrekResponse(text, intent, siteModel) {
  let blocks;
  try {
    blocks = JSON.parse(text);
  } catch {
    throw new AIError('INVALID_RESPONSE', { message: 'parseTrekResponse: non-JSON response' });
  }

  if (!Array.isArray(blocks)) {
    throw new AIError('INVALID_RESPONSE', { message: 'parseTrekResponse: response is not an array' });
  }

  // Filter to known block types and validate minimal shape
  const validated = blocks
    .filter((b) => b && typeof b === 'object' && b.type && VALID_BLOCK_TYPES.has(b.type))
    .map((b) => enrichBlock(b, intent, siteModel));

  if (validated.length === 0) {
    throw new AIError('INVALID_RESPONSE', { message: 'parseTrekResponse: no valid blocks' });
  }

  return validated;
}

/**
 * Enrich a block by resolving entity references against the site model.
 * Attaches hero_image_url, hero_image_alt, listing_summary, internalUrl, country
 * for entity items in accommodations/activities/attractions blocks.
 */
function enrichBlock(block, intent, siteModel) {
  if (!siteModel) return block;

  if (block.type === 'accommodations' && Array.isArray(block.items)) {
    block.items = block.items.map((item) => enrichEntityItem(item, siteModel.accommodationsBySlug, siteModel, 'accommodation'));
  }
  if (block.type === 'activities' && Array.isArray(block.items)) {
    block.items = block.items.map((item) => enrichEntityItem(item, siteModel.activitiesBySlug, siteModel, 'activity'));
  }
  if (block.type === 'attractions' && Array.isArray(block.items)) {
    block.items = block.items.map((item) => enrichEntityItem(item, siteModel.attractionsBySlug, siteModel, 'attraction'));
  }
  if (block.type === 'route' && Array.isArray(block.steps)) {
    block.steps = block.steps.map((step) => {
      const slugMapName = `${step.entity_type}sBySlug`;
      const map = siteModel[slugMapName];
      const entity = map?.get(step.entity_slug);
      if (entity) {
        step.hero_image_url = step.hero_image_url || entity.hero_image_url || null;
      }
      return step;
    });
  }
  if (block.type === 'map' && Array.isArray(block.markers)) {
    block.markers = block.markers.map((m) => {
      // Fill in coordinates from the COORDINATES map if not provided
      const coord = COORDINATES[m.entity_slug];
      if (coord && (!m.lat || !m.lng)) {
        m.lat = coord.lat;
        m.lng = coord.lng;
      }
      return m;
    });
  }

  return block;
}

/**
 * Enrich a single entity item with real CMS data from the site model.
 */
function enrichEntityItem(item, slugMap, siteModel, entityType) {
  const entity = slugMap?.get(item.slug);
  if (entity) {
    return {
      ...item,
      name: item.name || entity.name,
      slug: item.slug || entity.slug,
      location_name: item.location_name || entity.location_name || '',
      listing_summary: item.listing_summary || entity.listing_summary || entity.detail_intro || '',
      hero_image_url: item.hero_image_url || entity.hero_image_url || null,
      hero_image_alt: item.hero_image_alt || entity.hero_image_alt || entity.name || '',
      internal_url: entity.internalUrl || `/${entityType}s/${entity.slug}`,
      country: entity.country ? { name: entity.country.name, slug: entity.country.slug } : undefined,
      region: entity.region ? { name: entity.region.name, slug: entity.region.slug } : undefined,
    };
  }
  return item;
}

/**
 * Extract suggested follow-up query strings from the response blocks.
 */
function extractSuggestedQueries(blocks, originalQuery) {
  const suggestions = [];
  for (const block of blocks) {
    if (block.type === 'suggestions' && Array.isArray(block.queries)) {
      suggestions.push(...block.queries);
    }
  }
  // Always include a few generic follow-ups if we don't have enough
  if (suggestions.length < 3) {
    const defaults = [
      'Show me accommodations near this area',
      'Compare this with alternative destinations',
      'What activities are available here?',
    ];
    for (const d of defaults) {
      if (!suggestions.includes(d)) suggestions.push(d);
    }
  }
  return suggestions.slice(0, 5);
}

// ── Main entry point ──────────────────────────────────────────────────────────

/**
 * Process an Ask Trek request — the main orchestrator.
 *
 * Flow:
 * 1. Extract viewed entities from context pathname
 * 2. Build context summary + entity slug list
 * 3. Classify intent (plan/compare/recommend)
 * 4. Dispatch to the appropriate handler
 * 5. Parse and validate the AI response
 * 6. Return structured result for the frontend to render
 *
 * @param {object} params
 * @param {string} params.query - the traveler's natural-language question
 * @param {object} [params.context] - context object with pathname
 * @param {string} [params.context.pathname] - current URL pathname
 * @param {object} [params.client] - Supabase server client (for session/message logging)
 * @param {object} [params.siteModel] - pre-loaded site model (injected for testing; if omitted, getSiteModel() is called)
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {object} [params.env] - process.env
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{response_type: string, blocks: Array, suggestions: string[], actions: object}>}
 */
export async function processAskTrekRequest({ query, context, client, siteModel: injectedModel, aiService: injectedService, env, signal }) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new AIError('INVALID_REQUEST', { message: 'query is required' });
  }

  // 1. Get site model for context extraction
  let siteModel = injectedModel;
  if (!siteModel) {
    try {
      const { getSiteModel } = await import('../../src/lib/site-model.mjs');
      siteModel = await getSiteModel();
    } catch {
      // Site model may not be available in test environments — proceed with empty entities
    }
  }

  // 2. Extract viewed entities from context
  const pathname = context?.pathname;
  const entities = extractViewedEntities(pathname || '', siteModel);

  // 3. Build context summary and entity slug list
  const contextSummary = buildContextSummary(entities, siteModel);
  const entitySlugs = getEntitySlugs(entities, siteModel);

  // 4. Classify intent
  const aiService = injectedService || getAIService(env || process.env);
  const classification = await classifyIntent({
    query,
    contextSummary,
    aiService,
    env,
    signal,
  });

  // 5. Dispatch to intent handler
  const intent = classification.confidence < 0.3 ? INTENT_TYPES.OTHER : classification.intent;

  let result;
  if (intent === INTENT_TYPES.PLAN) {
    result = await handleTripPlanning({ query, contextSummary, entitySlugs, aiService, env, signal });
  } else if (intent === INTENT_TYPES.COMPARE) {
    result = await handleComparison({ query, contextSummary, entitySlugs, aiService, env, signal });
  } else if (intent === INTENT_TYPES.RECOMMEND) {
    result = await handleRecommendation({ query, contextSummary, entitySlugs, aiService, env, signal });
  } else {
    // Default to recommendation for "other" — still produces visual blocks
    result = await handleRecommendation({ query, contextSummary, entitySlugs, aiService, env, signal });
    result.response_type = INTENT_TYPES.OTHER;
  }

  // 6. Optionally log to dm_trek_sessions/messages
  if (client && context?.session_token) {
    try {
      await logSession({ query, response: result, sessionToken: context.session_token, entities, client, signal });
    } catch {
      // Logging is best-effort — never block the response
    }
  }

  return result;
}

// ── Session logging ───────────────────────────────────────────────────────────

/**
 * Log the Ask Trek request/response to cm_trek_sessions and cm_trek_messages.
 * Best-effort only — errors are swallowed.
 */
async function logSession({ query, response, sessionToken, entities, client, signal }) {
  if (signal?.aborted) return;

  // Upsert session
  let session;
  const sessResult = await client
    .from('cm_trek_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .maybeSingle();

  if (sessResult.data) {
    session = sessResult.data;
    await client
      .from('cm_trek_sessions')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', session.id);
  } else {
    const contextEntityType = entities[0]?.entity_type || null;
    const contextEntityId = entities[0]?.entity_id || null;
    const insertResult = await client
      .from('cm_trek_sessions')
      .insert({
        session_token: sessionToken,
        context_entity_type: contextEntityType,
        context_entity_id: contextEntityId,
      })
      .select()
      .single();
    session = insertResult.data;
  }

  if (!session?.id) return;

  // Log messages
  const contextJson = entities.length > 0 ? JSON.stringify(entities) : null;

  await client.from('cm_trek_messages').insert([
    { session_id: session.id, role: 'user', query, context_jsonb: contextJson },
    { session_id: session.id, role: 'assistant', query: '', response, context_jsonb: null },
  ]);
}

// ── Public API for frontend ───────────────────────────────────────────────────

/**
 * Get suggested prompts, optionally filtered by category or context entity type.
 *
 * @param {object} params
 * @param {string} [params.category] - filter by category
 * @param {string} [params.entityType] - entity being viewed (for trigger keyword matching)
 * @param {object} [params.client] - Supabase client (reads from cm_trek_suggested_prompts)
 * @returns {Promise<Array<{prompt_text: string, category: string, sort_order: number}>>}
 */
export async function getSuggestedPrompts({ category, entityType, client }) {
  let suggestions = [...SUGGESTED_PROMPTS];

  if (category) {
    suggestions = suggestions.filter((s) => s.category === category);
  }

  if (entityType && !category) {
    // Filter by trigger keywords relevant to the entity type
    const entityKeywords = {
      country: ['safari', 'itinerary', 'trip', 'travel'],
      attraction: ['activity', 'thing to do', 'wildlife'],
      accommodation: ['stay', 'lodge', 'hotel', 'where to stay'],
      activity: ['activity', 'thing to do'],
    };
    const keywords = entityKeywords[entityType] || [];
    suggestions = suggestions.filter((s) =>
      keywords.some((kw) => s.trigger_keywords?.some((tk) => tk.toLowerCase().includes(kw)))
    );
  }

  // If a client is provided, merge with DB-sourced prompts
  if (client) {
    const { data, error } = await client
      .from('cm_trek_suggested_prompts')
      .select('prompt_text, trigger_keywords, category, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data) {
      // DB prompts take precedence (sorted after static suggestions)
      suggestions = [...suggestions, ...data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }
  }

  return suggestions
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((s) => ({
      prompt_text: s.prompt_text,
      category: s.category || 'general',
      sort_order: s.sort_order || 0,
    }));
}
