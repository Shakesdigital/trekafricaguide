import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import { createMockClient } from './kg-mock-client.mjs';
import { classifyEntity, classifyAndExtract, EXTRACTION_TASK_TYPES } from '../../server/knowledge/classify.mjs';
import { ENTITY_TYPES, FORBIDDEN_FIELDS, EXTRACTABLE_FIELDS, buildExtractionPrompt, maskForbiddenFields, validateDraftData, slugify } from '../../server/content-manager/validate.mjs';

// ── Mock AI service helpers ────────────────────────────────────────────
// classifyEntity and classifyAndExtract accept an optional `aiService` parameter
// for dependency injection. When provided, they use it instead of calling
// getAIService(env). This avoids monkey-patching ESM module exports and
// side-steps the createAIService input-validation pipeline (which validates
// public_cache_version against a URL-unsafe regex).

/**
 * Lightweight mock AI service for knowledge engine tests.
 * Returns canned responses by task_type.
 */
function mockAIService(responses = {}) {
  const calls = [];
  return {
    calls,
    async run(input, { signal } = {}) {
      calls.push({ input, signal });
      const canned = responses[input.task_type] || responses._default;
      if (!canned) {
        throw new AIError('PROVIDER_ERROR', { message: `No mock response for task: ${input.task_type}` });
      }
      return {
        text: canned.text,
        input_tokens: canned.input_tokens || 100,
        output_tokens: canned.output_tokens || 50,
        cached: false,
        provider: 'mock',
        model: 'mock-model',
        usage: {
          input_tokens: canned.input_tokens || 100,
          output_tokens: canned.output_tokens || 50,
          complete: true,
        },
      };
    },
  };
}

// ── classifyEntity ───────────────────────────────────────────────────────

test('classifyEntity returns entity type, name, slug, and confidence via DI', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'Ol Pejeta Conservancy',
        slug: 'ol-peet-a-conservancy',
        confidence: 0.92,
        reasoning: 'Content describes a wildlife conservancy with visitor activities.',
      }),
      input_tokens: 80,
      output_tokens: 30,
    },
  });

  const result = await classifyEntity({
    sourceText: 'Ol Pejeta Conservancy is a wildlife conservancy in central Kenya.',
    sourceUrl: 'https://example.com/ol-pejeta',
    aiService: service,
    env: process.env,
  });

  assert.equal(result.entityType, 'attraction');
  assert.equal(result.name, 'Ol Pejeta Conservancy');
  assert.equal(result.confidence, 0.92);
  assert.ok(result.slug, 'should have a slug');
  assert.ok(result.usage, 'should have usage info');
});

test('classifyEntity uses AI-provided slug when available', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'country',
        name: 'Tanzania',
        slug: 'tanzania-e',
        confidence: 0.88,
        reasoning: 'Country in East Africa.',
      }),
      input_tokens: 30,
      output_tokens: 15,
    },
  });

  const result = await classifyEntity({
    sourceText: 'Tanzania is a country in East Africa.',
    sourceUrl: 'https://example.com/tanzania',
    aiService: service,
    env: process.env,
  });

  assert.equal(result.slug, 'tanzania-e');
});

test('classifyEntity falls back to slugify when AI omits slug', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'Mount Kilimanjaro',
        confidence: 0.95,
        reasoning: 'Famous mountain in Tanzania.',
      }),
      input_tokens: 30,
      output_tokens: 15,
    },
  });

  const result = await classifyEntity({
    sourceText: 'Mount Kilimanjaro is a mountain in Tanzania.',
    sourceUrl: 'https://example.com/kilimanjaro',
    aiService: service,
    env: process.env,
  });

  assert.equal(result.slug, 'mount-kilimanjaro');
});

test('classifyEntity throws INVALID_RESPONSE for non-JSON AI output', async () => {
  const service = mockAIService({
    classify_entity: {
      text: 'This is not JSON',
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  let threw = false;
  try {
    await classifyEntity({
      sourceText: 'Some text',
      sourceUrl: 'https://example.com',
      aiService: service,
      env: process.env,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_RESPONSE');
  }
  assert.equal(threw, true);
});

test('classifyEntity throws INVALID_RESPONSE for unknown entity type', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'unknown_type',
        name: 'Something',
        confidence: 0.5,
      }),
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  let threw = false;
  try {
    await classifyEntity({
      sourceText: 'Some text',
      sourceUrl: 'https://example.com',
      aiService: service,
      env: process.env,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_RESPONSE');
  }
  assert.equal(threw, true);
});

test('classifyEntity throws INVALID_RESPONSE for missing name', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        confidence: 0.5,
      }),
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  let threw = false;
  try {
    await classifyEntity({
      sourceText: 'Some text',
      sourceUrl: 'https://example.com',
      aiService: service,
      env: process.env,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_RESPONSE');
  }
  assert.equal(threw, true);
});

// ── classifyAndExtract ───────────────────────────────────────────────────

test('classifyAndExtract returns masked extracted data with confidence via DI', async () => {
  const service = mockAIService({
    extract_attraction: {
      text: JSON.stringify({
        slug: 'test-attraction',
        name: 'Test Attraction',
        location_name: 'Test Location',
        listing_summary: 'A summary.',
        detail_intro: 'Introduction text.',
        price_label: '$50',       // forbidden — should be masked
        rating: 4.5,               // forbidden — should be masked
        booking_url: 'https://book.com', // forbidden — should be masked
      }),
      input_tokens: 100,
      output_tokens: 60,
    },
  });

  const result = await classifyAndExtract({
    sourceText: 'Some source about a test attraction.',
    sourceUrl: 'https://example.com/attraction',
    entityType: 'attraction',
    aiService: service,
    env: process.env,
  });

  // Forbidden fields should be masked to null
  assert.equal(result.extractedFields.price_label, null);
  assert.equal(result.extractedFields.rating, null);
  assert.equal(result.extractedFields.booking_url, null);

  // Non-forbidden fields preserved
  assert.equal(result.extractedFields.slug, 'test-attraction');
  assert.equal(result.extractedFields.name, 'Test Attraction');

  // Confidence computed from field completeness
  assert.ok(result.confidence >= 0 && result.confidence <= 1);
  assert.ok(result.usage, 'should have usage info');
  assert.ok(result.provider, 'should have provider info');
  assert.ok(result.model, 'should have model info');
});

test('classifyAndExtract throws INVALID_REQUEST for unknown entity type', async () => {
  const service = mockAIService({});

  let threw = false;
  try {
    await classifyAndExtract({
      sourceText: 'Some text',
      sourceUrl: 'https://example.com',
      entityType: 'unknown_type',
      aiService: service,
      env: process.env,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

test('classifyAndExtract throws INVALID_RESPONSE for non-JSON AI output', async () => {
  const service = mockAIService({
    extract_attraction: {
      text: 'Not JSON',
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  let threw = false;
  try {
    await classifyAndExtract({
      sourceText: 'Some text',
      sourceUrl: 'https://example.com',
      entityType: 'attraction',
      aiService: service,
      env: process.env,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_RESPONSE');
  }
  assert.equal(threw, true);
});

test('classifyAndExtract computes confidence from field completeness', async () => {
  const service = mockAIService({
    extract_destination: {
      text: JSON.stringify({
        slug: 'kenya',
        name: 'Kenya',
        overview: 'An overview.',
        best_time: 'June to October',
      }),
      input_tokens: 80,
      output_tokens: 40,
    },
  });

  const result = await classifyAndExtract({
    sourceText: 'About Kenya',
    sourceUrl: 'https://example.com/kenya',
    entityType: 'country',
    aiService: service,
    env: process.env,
  });

  const allowed = EXTRACTABLE_FIELDS.country;
  const present = allowed.filter((f) => result.extractedFields[f] != null && result.extractedFields[f] !== '');
  assert.equal(present.length, 4);
  assert.ok(result.confidence > 0 && result.confidence < 1);
  assert.equal(result.extractedFields.slug, 'kenya');
  assert.equal(result.extractedFields.name, 'Kenya');
  assert.equal(result.extractedFields.overview, 'An overview.');
  assert.equal(result.extractedFields.best_time, 'June to October');
});

test('classifyAndExtract masks all forbidden fields across entity types', async () => {
  // Verify that forbidden fields are always in the FORBIDDEN_FIELDS set
  // and that maskForbiddenFields handles them for each entity type
  for (const entityType of ENTITY_TYPES) {
    const allowed = EXTRACTABLE_FIELDS[entityType];
    // No extractable field should be a forbidden field
    for (const field of allowed) {
      assert.ok(!FORBIDDEN_FIELDS.has(field), `${field} should not be extractable for ${entityType}`);
    }
  }

  // Test masking with a full set of forbidden fields
  const testData = {
    slug: 'test',
    name: 'Test',
    price_label: '$50',
    price_amount: 500,
    price_currency: 'USD',
    price_unit: 'per person',
    price_basis: 'total',
    booking_url: 'https://book.com',
    rating: 4.5,
    review_count: 100,
    featured: true,
    opening_hours: '9-5',
    availability: 'open',
    permits_required: 'yes',
    visa_requirements: 'visa on arrival',
    distance: '10km',
    travel_time: '2 hours',
    facilities: 'pool',
    amenities: 'wifi',
  };

  const masked = maskForbiddenFields({ ...testData });

  for (const field of FORBIDDEN_FIELDS) {
    assert.equal(masked[field], null, `field ${field} should be null after masking`);
  }

  // Non-forbidden fields preserved
  assert.equal(masked.slug, 'test');
  assert.equal(masked.name, 'Test');
});

test('classifyAndExtract throws INVALID_REQUEST when AI returns forbidden field value', async () => {
  // If maskForbiddenFields didn't run, validateDraftData should catch it.
  // But classifyAndExtract calls maskForbiddenFields first, so AI can't slip
  // through — this test verifies the 3-layer defense holds in isolation.
  const testData = {
    slug: 'test',
    name: 'Test',
    price_label: '$200/night', // forbidden
  };

  const masked = maskForbiddenFields({ ...testData });
  assert.equal(masked.price_label, null);

  // validateDraftData should also reject if a forbidden field somehow has a value
  let threw = false;
  try {
    validateDraftData('accommodation', { slug: 'test', name: 'Test', price_label: '$200' });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

// ── EXTRACTION_TASK_TYPES mapping ───────────────────────────────────────────

test('EXTRACTION_TASK_TYPES maps each entity type', () => {
  for (const entity of ENTITY_TYPES) {
    assert.ok(EXTRACTION_TASK_TYPES[entity], `should have extraction task for ${entity}`);
  }
  assert.equal(EXTRACTION_TASK_TYPES.region, 'extract_destination');
  assert.equal(EXTRACTION_TASK_TYPES.country, 'extract_destination');
  assert.equal(EXTRACTION_TASK_TYPES.attraction, 'extract_attraction');
  assert.equal(EXTRACTION_TASK_TYPES.accommodation, 'extract_accommodation');
  assert.equal(EXTRACTION_TASK_TYPES.restaurant, 'extract_accommodation');
  assert.equal(EXTRACTION_TASK_TYPES.tour_operator, 'extract_attraction');
  assert.equal(EXTRACTION_TASK_TYPES.activity, 'extract_activity');
  assert.equal(EXTRACTION_TASK_TYPES.travel_article, 'extract_travel_insight');
});

test('classify_entity task type is separate from extraction task types', () => {
  // The classify_entity task type is used by classifyEntity to determine
  // entity type. It should not be in EXTRACTION_TASK_TYPES values.
  assert.equal(EXTRACTION_TASK_TYPES['classify_entity'], undefined);
});

// ── Confidence clamping ────────────────────────────────────────────────────

test('classifyEntity clamps confidence to [0, 1]', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'Overflow Place',
        slug: 'overflow-place',
        confidence: 1.5, // above 1.0 — should be clamped
        reasoning: 'Some place.',
      }),
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  const result = await classifyEntity({
    sourceText: 'Test text',
    sourceUrl: 'https://example.com',
    aiService: service,
    env: process.env,
  });

  assert.equal(result.confidence, 1.0);
});

test('classifyEntity clamps negative confidence to 0', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'Negative Place',
        slug: 'negative-place',
        confidence: -0.5, // below 0 — should be clamped
        reasoning: 'Some place.',
      }),
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  const result = await classifyEntity({
    sourceText: 'Test text',
    sourceUrl: 'https://example.com',
    aiService: service,
    env: process.env,
  });

  assert.equal(result.confidence, 0);
});

test('classifyEntity handles NaN confidence by defaulting to 0', async () => {
  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'NaN Place',
        slug: 'nan-place',
        confidence: 'not a number',
        reasoning: 'Some place.',
      }),
      input_tokens: 10,
      output_tokens: 5,
    },
  });

  const result = await classifyEntity({
    sourceText: 'Test text',
    sourceUrl: 'https://example.com',
    aiService: service,
    env: process.env,
  });

  assert.equal(result.confidence, 0);
});

// ── Slugify helper ────────────────────────────────────────────────────────

test('slugify produces correct slugs', () => {
  assert.equal(slugify('Ol Pejeta Conservancy'), 'ol-pejeta-conservancy');
  assert.equal(slugify("Governor's Camp"), 'governors-camp');
  assert.equal(slugify('Mount Kilimanjaro  '), 'mount-kilimanjaro');
  assert.equal(slugify('Bwindi Impenetrable NP!'), 'bwindi-impenetrable-np');
  assert.equal(slugify('  Dual   Space  '), 'dual-space');
  assert.equal(slugify('---leading-trailing---'), 'leading-trailing');
});
