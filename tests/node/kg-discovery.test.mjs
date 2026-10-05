import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import { createMockClient } from './kg-mock-client.mjs';
import { runDiscovery, discoverFromSeed, runContinuousDiscovery } from '../../server/knowledge/discover.mjs';
import { ENTITY_TYPES, FORBIDDEN_FIELDS } from '../../server/content-manager/validate.mjs';

// ── Mock AI service helpers ────────────────────────────────────────────
// Lightweight mock that bypasses the real createAIService pipeline.
// classifyEntity and classifyAndExtract accept an optional `aiService` parameter
// for dependency injection, so we pass this mock directly.

function mockAIService(responses = {}) {
  const calls = [];
  return {
    calls,
    async run(input, { signal } = {}) {
      calls.push({ input, signal });
      const canned = responses[input.task_type] || responses._default;
      if (!canned) {
        throw new AIError('PROVIDER_ERROR', { message: `No mock response for: ${input.task_type}` });
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

// Mock fetch for fetchSourceContent
const SAMPLE_HTML = `
<!DOCTYPE html>
<html><head><title>Ol Pejeta Rhino Sanctuary</title></head>
<body>
<h1>Ol Pejeta Conservancy</h1>
<p>Ol Pejeta Conservancy is a wildlife conservancy in central Kenya. It is home to the largest black rhino sanctuary in East Africa.</p>
<p>The conservancy offers guided game drives, nature walks, and visits to the Sweetwaters Chimpanzee Sanctuary.</p>
<p>Location: Nanyuki, Kenya. Best visited June to October.</p>
</body></html>`;

// ── Full discovery pipeline tests ─────────────────────────────────────────

test('runDiscovery completes full pipeline: fetch → classify → extract → compare → store', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'Ol Pejeta Conservancy',
        slug: 'ol-pejeta-conservancy',
        confidence: 0.92,
        reasoning: 'Wildlife conservancy with rhino sanctuary.',
      }),
      input_tokens: 80,
      output_tokens: 30,
    },
    extract_attraction: {
      text: JSON.stringify({
        slug: 'ol-pejeta-conservancy',
        name: 'Ol Pejeta Conservancy',
        location_name: 'Nanyuki, Kenya',
        listing_summary: 'Wildlife conservancy home to the largest black rhino sanctuary in East Africa.',
        detail_intro: 'Ol Pejeta Conservancy is a 940-square-kilometre wildlife conservancy in central Kenya.',
        full_description: 'The conservancy offers guided game drives, nature walks, and visits to the Sweetwaters Chimpanzee Sanctuary.',
        getting_there: 'Located 200km north of Nairobi via the Nanyuki road.',
        best_time: 'June to October',
        practical_info: 'Open year-round. Entry fees apply. Book guided tours in advance.',
        // All 17 forbidden fields — should be masked to null
        price_label: '$50', price_amount: 100, price_currency: 'USD',
        price_unit: 'per night', price_basis: 'total', booking_url: 'https://book.com',
        rating: 4.5, review_count: 50, featured: true, opening_hours: '6am-6pm',
        availability: 'open', permits_required: 'none', visa_requirements: 'none',
        distance: '10km', travel_time: '2 hours', facilities: 'pool', amenities: 'wifi',
      }),
      input_tokens: 100,
      output_tokens: 60,
    },
  });

  try {
    const client = createMockClient();
    client._seed('attractions', [
      { id: 1, slug: 'maasai-mara', name: 'Maasai Mara', location_name: 'Kenya', listing_summary: 'Migration.', detail_intro: 'Wildlife.', status: 'published', created_at: '2026-01-01', updated_at: '2026-01-01' },
    ]);

    const result = await runDiscovery({
      sourceUrl: 'https://example.com/ol-pejeta',
      sourceName: 'Ol Pejeta Blog',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.knowledgeId, 'should create a knowledge record');
    assert.equal(result.category, 'new');
    assert.ok(result.confidence >= 0 && result.confidence <= 1);
    assert.ok(result.extractedData, 'should have extracted data');
    assert.equal(result.extractedData.slug, 'ol-pejeta-conservancy');
    assert.equal(result.extractedData.name, 'Ol Pejeta Conservancy');
    // Forbidden fields should be masked
    assert.equal(result.extractedData.price_label, null);
    assert.equal(result.extractedData.rating, null);
    // Should create a draft since category is 'new' and confidence >= threshold
    assert.ok(result.draftId, 'should create a draft for new finding');
    assert.equal(result.draftCreated, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test('runDiscovery stores finding in cm_knowledge even on fetch error', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  });

  const service = mockAIService({});

  try {
    const client = createMockClient();

    const result = await runDiscovery({
      sourceUrl: 'https://example.com/broken-link',
      sourceName: 'Broken Source',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.knowledgeId, 'should still store a knowledge record');
    assert.equal(result.category, 'conflict');
    assert.equal(result.confidence, 0);
    assert.ok(result.error, 'should have error info');
    assert.equal(result.error.error, 'PROVIDER_ERROR');
    assert.equal(result.draftId, null);
  } finally {
    global.fetch = originalFetch;
  }
});

test('runDiscovery does not create draft when confidence is below threshold', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'attraction',
        name: 'Obscure Place',
        slug: 'obscure-place',
        confidence: 0.1, // very low confidence
        reasoning: 'Hard to classify.',
      }),
      input_tokens: 80,
      output_tokens: 30,
    },
    extract_attraction: {
      text: JSON.stringify({
        slug: 'obscure-place',
        name: 'Obscure Place',
        location_name: 'Nowhere',
        listing_summary: 'A place.',
        detail_intro: 'An intro.',
      }),
      input_tokens: 100,
      output_tokens: 60,
    },
  });

  try {
    const client = createMockClient();

    const result = await runDiscovery({
      sourceUrl: 'https://example.com/obscure',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.knowledgeId);
    // Low confidence from classification → overall confidence is low
    // When category is 'new' but confidence < 0.4, no draft is created
    assert.equal(result.draftId, null);
    assert.equal(result.draftCreated, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test('runDiscovery accepts forced entity type override', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  const service = mockAIService({
    extract_attraction: {
      text: JSON.stringify({
        slug: 'forced-attraction',
        name: 'Forced Attraction',
        location_name: 'Forced Location',
        listing_summary: 'Summary.',
        detail_intro: 'Intro.',
      }),
      input_tokens: 50,
      output_tokens: 30,
    },
  });

  try {
    const client = createMockClient();

    const result = await runDiscovery({
      sourceUrl: 'https://example.com/forced',
      entityType: 'attraction', // forced — should skip classifyEntity
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.knowledgeId);
    assert.equal(result.extractedData.slug, 'forced-attraction');
    // classify_entity transport should NOT have been called
    assert.equal(service.calls.filter(c => c.input.task_type === 'classify_entity').length, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('runDiscovery throws INVALID_REQUEST for unknown forced entity type', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  const client = createMockClient();

  let threw = false;
  try {
    await runDiscovery({
      sourceUrl: 'https://example.com/test',
      entityType: 'nonexistent_type',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: mockAIService({}),
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  } finally {
    global.fetch = originalFetch;
  }
  assert.equal(threw, true);
});

test('runDiscovery preserves source attribution (url + name)', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'country',
        name: 'Kenya',
        slug: 'kenya',
        confidence: 0.9,
        reasoning: 'A country in East Africa.',
      }),
      input_tokens: 30,
      output_tokens: 15,
    },
    extract_destination: {
      text: JSON.stringify({
        slug: 'kenya',
        name: 'Kenya',
        overview: 'A country in East Africa.',
        access_summary: 'Via Nairobi airport.',
        best_time: 'June to October',
      }),
      input_tokens: 80,
      output_tokens: 40,
    },
  });

  try {
    const client = createMockClient();

    const result = await runDiscovery({
      sourceUrl: 'https://www.kws.go.ke/safari-guide',
      sourceName: 'Kenya Wildlife Service Guide',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.knowledgeId);
    // Verify the knowledge record was stored with source attribution
    const stored = client._get('cm_knowledge');
    const found = stored.find((k) => k.id === result.knowledgeId);
    assert.ok(found, 'knowledge record should exist');
    assert.equal(found.source_url, 'https://www.kws.go.ke/safari-guide');
    assert.equal(found.source_name, 'Kenya Wildlife Service Guide');
  } finally {
    global.fetch = originalFetch;
  }
});

test('runDiscovery masks forbidden fields from extracted data', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  const service = mockAIService({
    classify_entity: {
      text: JSON.stringify({
        entity_type: 'accommodation',
        name: 'Test Lodge',
        slug: 'test-lodge',
        confidence: 0.8,
        reasoning: 'A lodge.',
      }),
      input_tokens: 30,
      output_tokens: 15,
    },
    extract_accommodation: {
      text: JSON.stringify({
        slug: 'test-lodge',
        name: 'Test Lodge',
        location_name: 'Nairobi, Kenya',
        listing_summary: 'A luxury lodge.',
        detail_intro: 'Located in Nairobi.',
        // All 17 forbidden fields — should be masked to null
        price_label: '$200/night', price_amount: 200, price_currency: 'USD',
        price_unit: 'per night', price_basis: 'total', booking_url: 'https://book.com',
        rating: 5, review_count: 100, featured: true, opening_hours: '24/7',
        availability: 'full', permits_required: 'yes', visa_requirements: 'required',
        distance: '10km', travel_time: '2 hours', facilities: 'pool, gym', amenities: 'wifi',
      }),
      input_tokens: 100,
      output_tokens: 60,
    },
  });

  try {
    const client = createMockClient();

    const result = await runDiscovery({
      sourceUrl: 'https://example.com/lodge',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.extractedData);
    // All 17 forbidden fields should be null
    for (const field of FORBIDDEN_FIELDS) {
      assert.equal(result.extractedData[field], null, `${field} should be null`);
    }
    // Non-forbidden fields preserved
    assert.equal(result.extractedData.slug, 'test-lodge');
    assert.equal(result.extractedData.name, 'Test Lodge');
  } finally {
    global.fetch = originalFetch;
  }
});

// ── Discovery from seed ────────────────────────────────────────────────────

test('discoverFromSeed skips sources that were checked within interval', async () => {
  const client = createMockClient();
  // The default seed has last_checked_at = 2 days ago with 168h interval
  // So 2 days < 168 hours = 7 days → should skip
  const result = await discoverFromSeed({
    domain: 'www.ugandawildlife.org',
    actorId: 'admin-user-id',
    client,
    env: process.env,
    aiService: mockAIService({}),
  });

  assert.equal(result.skipped, true);
  assert.equal(result.reason, 'check_interval_not_elapsed');
});

test('discoverFromSeed processes domain when check interval has elapsed', async () => {
  const client = createMockClient();

  // Update last_checked_at to be far enough ago
  await client.from('cm_discovery_sources')
    .update({ last_checked_at: new Date(Date.now() - 200 * 60 * 60 * 1000).toISOString() })
    .eq('domain', 'www.ugandawildlife.org');

  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 404 });

  const service = mockAIService({});

  try {
    const result = await discoverFromSeed({
      domain: 'www.ugandawildlife.org',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });
    // Since fetch fails, results will have error entries but shouldn't be skipped
    assert.notEqual(result.skipped, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test('discoverFromSeed throws INVALID_REQUEST for unknown domain', async () => {
  const client = createMockClient();

  let threw = false;
  try {
    await discoverFromSeed({
      domain: 'unknown-domain.com',
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: mockAIService({}),
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

// ── Continuous discovery ────────────────────────────────────────────────────

test('runContinuousDiscovery iterates all sources and respects intervals', async () => {
  const client = createMockClient();

  // Mark all sources as recently checked (within interval)
  await client.from('cm_discovery_sources')
    .update({ last_checked_at: new Date().toISOString() })
    .neq('domain', '');

  const result = await runContinuousDiscovery({
    actorId: 'admin-user-id',
    client,
    env: process.env,
    aiService: mockAIService({}),
  });

  const total = result.total;
  // All sources should be skipped due to check interval
  let skippedCount = 0;
  for (const r of result.results) {
    if (r.skipped) skippedCount++;
  }
  assert.equal(result.processed, 0, 'no sources should be processed when all are within interval');
  assert.equal(skippedCount, total, 'all sources should be skipped');
});

test('runContinuousDiscovery processes sources when interval has elapsed', async () => {
  const client = createMockClient();

  // Mark all sources as checked long ago
  await client.from('cm_discovery_sources')
    .update({ last_checked_at: new Date(Date.now() - 200 * 60 * 60 * 1000).toISOString() })
    .neq('domain', '');

  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 404 });

  const service = mockAIService({});

  try {
    const result = await runContinuousDiscovery({
      actorId: 'admin-user-id',
      client,
      env: process.env,
      aiService: service,
    });

    assert.ok(result.total > 0);
    // Sources should be processed (even if discovery fails due to 404)
    // But since fetch fails for all, results should contain error entries
    for (const r of result.results) {
      if (r.results) {
        for (const sr of r.results) {
          assert.ok(sr.error || sr.knowledgeId, 'each result should have either error or knowledgeId');
        }
      }
    }
  } finally {
    global.fetch = originalFetch;
  }
});
