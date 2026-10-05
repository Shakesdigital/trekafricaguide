import { z } from 'zod';
import { AIError } from '../ai/errors.mjs';

// Fields the AI must NEVER invent. These map directly to the user's constraint:
// "prices, opening hours, availability, permits, visa requirements, distances,
// travel times, facilities, booking links"
// Any draft_data containing non-null values for these fields is rejected.
export const FORBIDDEN_FIELDS = new Set([
  'price_label', 'price_amount', 'price_currency', 'price_unit', 'price_basis',
  'booking_url', 'rating', 'review_count', 'featured',
  'opening_hours', 'availability', 'permits_required', 'visa_requirements',
  'distance', 'travel_time', 'facilities', 'amenities',
]);

// Entity types the Content Manager can write to. Each maps to a database
// table that has status/published_at/meta_* columns from the harden migration.
export const ENTITY_TYPES = new Set([
  'region', 'country', 'attraction', 'accommodation', 'restaurant',
  'tour_operator', 'activity', 'travel_article',
]);

const entityTableMap = {
  region: 'regions',
  country: 'countries',
  attraction: 'attractions',
  accommodation: 'accommodations',
  restaurant: 'restaurants',
  tour_operator: 'tour_operators',
  activity: 'activities',
  travel_article: 'travel_articles',
};

export function getTableName(entityType) {
  const table = entityTableMap[entityType];
  if (!table) throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${entityType}` });
  return table;
}

// Fields that are allowed to be AI-extracted per entity type.
// These exclude all FORBIDDEN_FIELDS plus editorial-only columns.
export const EXTRACTABLE_FIELDS = {
  region: ['slug', 'name', 'hero_title', 'hero_text', 'overview',
    'hero_image_url', 'hero_image_alt', 'gallery', 'countries_intro',
    'meta_title', 'meta_description', 'meta_image_url'],
  country: ['slug', 'name', 'hero_title', 'hero_text', 'overview',
    'access_summary', 'best_time', 'planning_tips',
    'hero_image_url', 'hero_image_alt', 'gallery', 'meta_title',
    'meta_description', 'meta_image_url'],
  attraction: ['slug', 'name', 'location_name', 'listing_summary',
    'detail_intro', 'full_description', 'getting_there', 'best_time',
    'practical_info', 'highlights', 'hero_image_url', 'hero_image_alt',
    'gallery', 'meta_title', 'meta_description', 'meta_image_url'],
  accommodation: ['slug', 'name', 'property_type', 'location_name',
    'listing_summary', 'detail_intro', 'practical_info', 'hero_image_url',
    'hero_image_alt', 'gallery', 'meta_title', 'meta_description',
    'meta_image_url'],
  restaurant: ['slug', 'name', 'cuisine', 'location_name', 'signature_dish',
    'listing_summary', 'detail_intro', 'practical_info', 'hero_image_url',
    'hero_image_alt', 'gallery', 'meta_title', 'meta_description',
    'meta_image_url'],
  tour_operator: ['slug', 'name', 'summary', 'website_url', 'hero_image_url',
    'hero_image_alt', 'specialties', 'meta_title', 'meta_description',
    'meta_image_url'],
  activity: ['slug', 'name', 'location_name', 'listing_summary', 'detail_intro',
    'full_description', 'highlights', 'best_time', 'practical_info',
    'hero_image_url', 'hero_image_alt', 'gallery', 'source_url',
    'meta_title', 'meta_description', 'meta_image_url'],
  travel_article: ['slug', 'title', 'category', 'region', 'country',
    'excerpt', 'body', 'read_time', 'hero_image_url', 'hero_image_alt',
    'video_url', 'source_url', 'meta_title', 'meta_description',
    'meta_image_url'],
};

/**
 * Validate that draft_data only contains allowed fields for the entity type
 * and that no forbidden fields have non-null values.
 *
 * @param {string} targetEntity - one of ENTITY_TYPES
 * @param {object} draftData - the structured field values extracted by AI
 * @returns {object} the validated draftData (cleaned of null forbidden fields)
 * @throws {AIError} INVALID_REQUEST if forbidden field is present with value
 */
export function validateDraftData(targetEntity, draftData) {
  if (!ENTITY_TYPES.has(targetEntity)) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${targetEntity}` });
  }

  if (!draftData || typeof draftData !== 'object') {
    throw new AIError('INVALID_REQUEST', { message: 'draft_data must be an object' });
  }

  const allowed = EXTRACTABLE_FIELDS[targetEntity];
  const allowedSet = new Set(allowed);

  for (const [field, value] of Object.entries(draftData)) {
    // Reject forbidden fields with non-null values
    if (FORBIDDEN_FIELDS.has(field) && value !== null && value !== undefined) {
      throw new AIError('INVALID_REQUEST', {
        message: `AI must not produce value for forbidden field: ${field}`,
      });
    }

    // Warn but allow: fields not in the allowed set are stripped during publish
    // (we don't reject them here to keep draft_data flexible for review)
    if (!allowedSet.has(field) && FORBIDDEN_FIELDS.has(field)) {
      delete draftData[field];
    }
  }

  return draftData;
}

/**
 * Strip forbidden fields from draft_data, replacing with null.
 * This is called after AI extraction to enforce the constraint.
 */
export function maskForbiddenFields(draftData) {
  if (!draftData || typeof draftData !== 'object') return {};

  for (const field of FORBIDDEN_FIELDS) {
    if (field in draftData && draftData[field] !== null && draftData[field] !== undefined) {
      draftData[field] = null;
    }
  }
  return draftData;
}

/**
 * Filter draft_data to only include fields the target table actually has.
 */
export function filterToTableColumns(targetEntity, draftData, client) {
  // We can't easily introspect column names without a query, so we rely on
  // the EXTRACTABLE_FIELDS whitelist which matches the actual table columns.
  const allowed = EXTRACTABLE_FIELDS[targetEntity];
  const filtered = {};
  for (const field of allowed) {
    if (field in draftData) {
      filtered[field] = draftData[field];
    }
  }
  return filtered;
}

/**
 * Convert a display name to a URL-safe slug.
 */
export function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate the AI extraction prompt for a given entity type.
 * This prompt is sent to the AI model and explicitly forbids it from
 * inventing certain categories of information.
 */
export function buildExtractionPrompt(targetEntity, sourceContent) {
  const fields = EXTRACTABLE_FIELDS[targetEntity];
  const forbiddenList = Array.from(FORBIDDEN_FIELDS);

  return [
    {
      role: 'system',
      content: `You are a meticulous travel content editor. Extract ONLY the following structured fields from the source text. Do NOT invent any values. If a field cannot be determined from the source, return null.

FORBIDDEN to invent (always return null if not stated in source):
${forbiddenList.map((f) => `- ${f}`).join('\n')}

Allowed fields to extract:
${fields.map((f) => `- ${f}`).join('\n')}

Output strictly valid JSON only. No prose, no explanations.`,
    },
    {
      role: 'user',
      content: `Source:\n${sourceContent}\n\nExtract the allowed fields as JSON:`,
    },
  ];
}
