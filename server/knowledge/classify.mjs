import { AIError } from '../ai/errors.mjs';
import { getAIService } from '../ai/service.mjs';
import { readServerConfig } from '../ai/config.mjs';
import {
  ENTITY_TYPES, EXTRACTABLE_FIELDS, maskForbiddenFields, validateDraftData,
  buildExtractionPrompt,
} from '../content-manager/validate.mjs';

// Maps entity types to their AI extraction task names (reused from research.mjs).
// The Knowledge Engine needs this to classify and then extract in one pass.
const EXTRACTION_TASK_TYPES = {
  region: 'extract_destination',
  country: 'extract_destination',
  attraction: 'extract_attraction',
  accommodation: 'extract_accommodation',
  restaurant: 'extract_accommodation',
  tour_operator: 'extract_attraction',
  activity: 'extract_activity',
  travel_article: 'extract_travel_insight',
};

// System prompt for classify_entity task — classifies content into entity type
// and extracts name/slug/confidence.
const CLASSIFY_PROMPT = [
  {
    role: 'system',
    content: `You are a travel content classifier. Given a source text and its URL, determine the most likely entity type this content describes and extract a name and slug.

Entity types: region, country, attraction, accommodation, restaurant, tour_operator, activity, travel_article

Output strictly valid JSON only. No prose, no explanations. Format:
{
  "entity_type": "one of the types above",
  "name": "the destination/place/entry name",
  "slug": "url-safe slug derived from the name",
  "confidence": 0.0-1.0,
  "reasoning": "brief 1-sentence justification"
}`,
  },
  {
    role: 'user',
    content: `Source URL: {SOURCE_URL}\n\nSource text:\n{SOURCE_TEXT}\n\nClassify:`,
  },
];

/**
 * Classify source text into a Trek Africa entity type and extract name/slug.
 * Calls the AI service with the classify_entity task type.
 *
 * @param {object} params
 * @param {string} params.sourceText - raw text content from the source
 * @param {string} params.sourceUrl - URL the text was extracted from
 * @param {object} [params.aiService] - injected AI service (for testing); if omitted, getAIService(env) is used
 * @param {object} params.env - process.env
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{entityType, name, slug, confidence, reasoning, usage, cached}>}
 * @throws {AIError} if AI is disabled, config missing, or response invalid
 */
export async function classifyEntity({ sourceText, sourceUrl, aiService: injectedService, env, signal }) {
  const aiService = injectedService || getAIService(env);

  // Build the classify prompt with actual source values substituted in
  const messages = CLASSIFY_PROMPT.map((m) => ({
    ...m,
    content: m.content
      .replace('{SOURCE_URL}', sourceUrl)
      .replace('{SOURCE_TEXT}', sourceText),
  }));

  const result = await aiService.run(
    { task_type: 'classify_entity', messages, public_cache_version: sourceUrl },
    { signal }
  );

  let parsed;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    throw new AIError('INVALID_RESPONSE', { message: 'classify_entity returned non-JSON' });
  }

  // Validate the classification result
  if (!ENTITY_TYPES.has(parsed.entity_type)) {
    throw new AIError('INVALID_RESPONSE', { message: `Unknown entity type: ${parsed.entity_type}` });
  }

  if (!parsed.name || typeof parsed.name !== 'string') {
    throw new AIError('INVALID_RESPONSE', { message: 'classify_entity missing name' });
  }

  const confidence = Math.min(1.0, Math.max(0.0, Number(parsed.confidence) || 0));

  return {
    entityType: parsed.entity_type,
    name: parsed.name,
    slug: parsed.slug || slugify(parsed.name),
    confidence,
    reasoning: parsed.reasoning || '',
    usage: result.usage,
    cached: result.cached,
  };
}

/**
 * Extract structured fields for a known entity type from source content.
 * Reuses the existing buildExtractionPrompt + maskForbiddenFields + validateDraftData
 * three-layer defense from the Content Manager.
 *
 * @param {object} params
 * @param {string} params.sourceText - raw text content
 * @param {string} params.sourceUrl - URL the text was extracted from
 * @param {string} params.entityType - one of ENTITY_TYPES
 * @param {object} [params.aiService] - injected AI service (for testing)
 * @param {object} params.env - process.env
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{extractedFields, confidence, usage, cached, provider, model}>}
 */
export async function classifyAndExtract({ sourceText, sourceUrl, entityType, aiService: injectedService, env, signal }) {
  if (!ENTITY_TYPES.has(entityType)) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${entityType}` });
  }

  const aiService = injectedService || getAIService(env);
  const taskType = EXTRACTION_TASK_TYPES[entityType];

  // Reuse the existing extraction prompt builder — it includes the
  // FORBIDDEN_FIELDS list in the system prompt (layer 1 of defense).
  const prompt = buildExtractionPrompt(entityType, sourceText);

  const result = await aiService.run(
    { task_type: taskType, messages: prompt, public_cache_version: sourceUrl },
    { signal }
  );

  let parsed;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    throw new AIError('INVALID_RESPONSE', { message: `${taskType} returned non-JSON` });
  }

  // Layer 2: mask forbidden fields (replace non-null values with null)
  const masked = maskForbiddenFields(parsed);

  // Layer 3: validate — throws INVALID_REQUEST if a forbidden field has a value
  validateDraftData(entityType, { ...masked });

  // Compute a confidence score based on how many extractable fields have values.
  // A field is "present" if it has a non-null value.
  const allowed = EXTRACTABLE_FIELDS[entityType];
  const present = allowed.filter((f) => masked[f] !== null && masked[f] !== undefined && masked[f] !== '');
  const confidence = allowed.length > 0 ? present.length / allowed.length : 0.5;

  return {
    extractedFields: masked,
    confidence,
    usage: result.usage,
    cached: result.cached,
    provider: result.provider,
    model: result.model,
  };
}

/**
 * Convert a display name to a URL-safe slug.
 */
function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export { EXTRACTION_TASK_TYPES };
