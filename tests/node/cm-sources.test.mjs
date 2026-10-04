import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import { fetchSourceContent } from '../../server/content-manager/research.mjs';
import { maskForbiddenFields, validateDraftData, FORBIDDEN_FIELDS, buildExtractionPrompt } from '../../server/content-manager/validate.mjs';
import { createDraft, forkDraftVersion } from '../../server/content-manager/drafts.mjs';
import { createMockClient } from './cm-mock-client.mjs';

const SAMPLE_HTML = `
<!DOCTYPE html>
<html><head><title>Test Travel Blog - Gorilla Trek</title>
<style>.hero { color: red; }</style>
<script>alert('hi');</script>
</head><body>
<h1>Bwindi Gorilla Trek</h1>
<p>Mountain gorilla trekking in Bwindi Impenetrable National Park, Uganda.</p>
<p>Best time to visit is June to September. The trek takes 2-4 hours through dense forest.</p>
<p>Permits cost $700 per person per day. Book in advance through the park office.</p>
</body></html>`;

const SAMPLE_HTML_WITH_SCRIPTS = `
<html><head><title>My Travel Site</title></head>
<body>
<div class="content">
  <script>console.log('analytics');</script>
  <style>body { font-family: sans-serif; }</style>
  <p>The gorilla family was habituated in 1992.</p>
  <span class="hidden">SEO keywords: gorilla, trekking, bwindi</span>
</div>
<script src="/analytics.js"></script>
</body></html>`;

// ── fetchSourceContent ─────────────────────────────────────────────

test('fetchSourceContent extracts text from HTML', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML),
  });

  try {
    const result = await fetchSourceContent('https://example.com/gorilla-trek');
    assert.equal(result.status, 'ok');
    assert.ok(result.title, 'should extract title');
    assert.ok(result.text.length > 0, 'should extract text content');
    assert.ok(result.text.includes('Bwindi Gorilla Trek'), 'text should contain h1 content');
    assert.ok(result.text.includes('gorilla trekking'), 'text should contain body content');
  } finally {
    global.fetch = originalFetch;
  }
});

test('fetchSourceContent strips script and style tags from extracted text', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(SAMPLE_HTML_WITH_SCRIPTS),
  });

  try {
    const result = await fetchSourceContent('https://example.com/article');
    assert.equal(result.status, 'ok');
    assert.ok(!result.text.includes('console.log'), 'script content should be stripped');
    assert.ok(!result.text.includes('font-family'), 'style content should be stripped');
    assert.ok(!result.text.includes('analytics.js'), 'script src should be stripped');
    assert.ok(result.text.includes('gorilla family was habituated'), 'real content should remain');
  } finally {
    global.fetch = originalFetch;
  }
});

test('fetchSourceContent truncates text to 32000 characters', async () => {
  const longHtml = '<html><body><p>' + 'x'.repeat(40000) + '</p></body></html>';
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve(longHtml),
  });

  try {
    const result = await fetchSourceContent('https://example.com/long');
    assert.ok(result.text.length <= 32000, 'text should be truncated to 32000 chars');
  } finally {
    global.fetch = originalFetch;
  }
});

test('fetchSourceContent extracts title from HTML', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve('<html><head><title>Interesting Travel Guide</title></head><body>Content</body></html>'),
  });

  try {
    const result = await fetchSourceContent('https://example.com');
    assert.equal(result.title, 'Interesting Travel Guide');
  } finally {
    global.fetch = originalFetch;
  }
});

test('fetchSourceContent handles HTTP errors gracefully', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  });

  try {
    const result = await fetchSourceContent('https://example.com/missing');
    assert.equal(result.status, 'error');
    assert.equal(result.error, 'PROVIDER_ERROR');
    assert.ok(result.message, 'should have error message');
    assert.equal(result.text, '');
    assert.equal(result.title, '');
  } finally {
    global.fetch = originalFetch;
  }
});

test('fetchSourceContent handles network failures gracefully', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => { throw new Error('Network error'); };

  try {
    const result = await fetchSourceContent('https://example.com');
    assert.equal(result.status, 'error');
    assert.ok(result.error, 'should have error code');
    assert.ok(result.message, 'should have error message');
  } finally {
    global.fetch = originalFetch;
  }
});

test('fetchSourceContent returns empty text when no title in HTML', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve('<html><body>No title here</body></html>'),
  });

  try {
    const result = await fetchSourceContent('https://example.com');
    assert.equal(result.status, 'ok');
    assert.equal(result.title, '');
    assert.ok(result.text.includes('No title here'));
  } finally {
    global.fetch = originalFetch;
  }
});

// ── Source metadata preservation ───────────────────────────────────

test('createDraft preserves source_url, source_name, and research_date', async () => {
  const client = createMockClient();
  const beforeDate = new Date().toISOString();

  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { slug: 'test', name: 'Test Attraction', listing_summary: 'Summary' },
    sourceUrl: 'https://example.com/gorilla-trek',
    sourceName: 'Mountain Explorer Blog',
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.source_url, 'https://example.com/gorilla-trek');
  assert.equal(draft.source_name, 'Mountain Explorer Blog');
  assert.ok(draft.research_date, 'research_date should be set');
  assert.ok(draft.research_date >= beforeDate, 'research_date should be recent');
});

test('createDraft preserves ai_model and ai_task_type when AI-generated', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { slug: 'test', name: 'Test', listing_summary: 'Summary' },
    sourceUrl: 'https://example.com/source',
    sourceName: 'Source Blog',
    aiModel: 'gpt-4o-mini',
    aiTaskType: 'extract_attraction',
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.ai_model, 'gpt-4o-mini');
  assert.equal(draft.ai_task_type, 'extract_attraction');
  assert.equal(draft.ai_generated, true);
  assert.equal(draft.source_url, 'https://example.com/source');
  assert.equal(draft.source_name, 'Source Blog');
});

test('forkDraftVersion preserves all source metadata from original', async () => {
  const client = createMockClient();
  const researchDate = '2026-10-04T10:00:00Z';
  const draft = {
    slug: 'test', name: 'Test', listing_summary: 'Summary',
    price_label: null, // would be masked
  };

  // Create a draft with full source metadata
  const original = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { slug: 'orig', name: 'Original', listing_summary: 'Summary' },
    sourceUrl: 'https://example.com/original-source',
    sourceName: 'Original Blog',
    aiModel: 'gpt-4o-mini',
    aiTaskType: 'extract_attraction',
    actorId: 'admin-1',
    client,
  });

  // Override research_date to verify it's carried
  await client.from('cm_drafts').update({ research_date: researchDate }).eq('id', original.id);

  const fork = await forkDraftVersion(original.id, 'admin-2', client, {
    draftData: { slug: 'orig', name: 'Updated Name', listing_summary: 'Summary' },
  });

  const fetched = await client.from('cm_drafts').select('*').eq('id', fork.draftId).single();
  assert.equal(fetched.data.source_url, 'https://example.com/original-source');
  assert.equal(fetched.data.source_name, 'Original Blog');
  assert.equal(fetched.data.research_date, researchDate);
  assert.equal(fetched.data.ai_model, 'gpt-4o-mini');
  assert.equal(fetched.data.ai_task_type, 'extract_attraction');
  assert.equal(fetched.data.ai_generated, true);
});

test('createDraft with null source_url still stores record', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { slug: 'test', name: 'Test', listing_summary: 'Summary' },
    // No source_url, source_name
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.source_url, null);
  assert.equal(draft.source_name, null);
  // research_date is always set
  assert.ok(draft.research_date);
});

// ── maskForbiddenFields ────────────────────────────────────────────

test('maskForbiddenFields replaces non-null forbidden values with null', () => {
  const data = {
    slug: 'test',
    name: 'Test Attraction',
    price_label: '$50',
    rating: 4.5,
    booking_url: 'https://book.example.com',
    opening_hours: '9am-5pm',
    distance: '10km',
  };

  const result = maskForbiddenFields(data);
  assert.equal(result.price_label, null);
  assert.equal(result.rating, null);
  assert.equal(result.booking_url, null);
  assert.equal(result.opening_hours, null);
  assert.equal(result.distance, null);
  // Non-forbidden fields preserved
  assert.equal(result.slug, 'test');
  assert.equal(result.name, 'Test Attraction');
});

test('maskForbiddenFields leaves null forbidden values as null', () => {
  const data = { name: 'Test', price_label: null, rating: null };
  const result = maskForbiddenFields(data);
  assert.equal(result.price_label, null);
  assert.equal(result.rating, null);
  assert.equal(result.name, 'Test');
});

test('maskForbiddenFields handles undefined forbidden values', () => {
  const data = { name: 'Test', price_label: undefined, rating: undefined };
  const result = maskForbiddenFields(data);
  assert.equal(result.price_label, undefined);
  assert.equal(result.rating, undefined);
  assert.equal(result.name, 'Test');
});

test('maskForbiddenFields handles null input', () => {
  const result = maskForbiddenFields(null);
  assert.deepEqual(result, {});
});

test('maskForbiddenFields handles undefined input', () => {
  const result = maskForbiddenFields(undefined);
  assert.deepEqual(result, {});
});

test('FORBIDDEN_FIELDS contains all critical categories', () => {
  // Prices
  assert.ok(FORBIDDEN_FIELDS.has('price_label'));
  assert.ok(FORBIDDEN_FIELDS.has('price_amount'));
  assert.ok(FORBIDDEN_FIELDS.has('price_currency'));
  // Booking
  assert.ok(FORBIDDEN_FIELDS.has('booking_url'));
  // Ratings
  assert.ok(FORBIDDEN_FIELDS.has('rating'));
  assert.ok(FORBIDDEN_FIELDS.has('review_count'));
  // Opening hours / availability
  assert.ok(FORBIDDEN_FIELDS.has('opening_hours'));
  assert.ok(FORBIDDEN_FIELDS.has('availability'));
  // Travel logistics
  assert.ok(FORBIDDEN_FIELDS.has('permits_required'));
  assert.ok(FORBIDDEN_FIELDS.has('visa_requirements'));
  assert.ok(FORBIDDEN_FIELDS.has('distance'));
  assert.ok(FORBIDDEN_FIELDS.has('travel_time'));
  // Facilities
  assert.ok(FORBIDDEN_FIELDS.has('facilities'));
  assert.ok(FORBIDDEN_FIELDS.has('amenities'));
  // Editorial
  assert.ok(FORBIDDEN_FIELDS.has('featured'));
});

// ── validateDraftData ──────────────────────────────────────────────

test('validateDraftData throws INVALID_REQUEST for forbidden field with value', () => {
  let threw = false;
  try {
    validateDraftData('attraction', {
      slug: 'test', name: 'Test',
      price_label: '$50',
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw for forbidden field with value');
});

test('validateDraftData allows null forbidden fields (they are deleted)', () => {
  const data = { slug: 'test', name: 'Test', price_label: null };
  const result = validateDraftData('attraction', data);
  assert.equal(result.price_label, undefined, 'null forbidden field should be deleted');
  assert.equal(result.slug, 'test');
  assert.equal(result.name, 'Test');
});

test('validateDraftData throws for unknown entity type', () => {
  let threw = false;
  try {
    validateDraftData('nonexistent', { name: 'Test' });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

test('validateDraftData throws for null draft_data', () => {
  let threw = false;
  try {
    validateDraftData('attraction', null);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

// ── buildExtractionPrompt ──────────────────────────────────────────

test('buildExtractionPrompt returns system and user messages', () => {
  const messages = buildExtractionPrompt('attraction', 'Some source text');
  assert.equal(messages.length, 2);
  assert.equal(messages[0].role, 'system');
  assert.equal(messages[1].role, 'user');
  assert.ok(messages[0].content.includes('FORBIDDEN'), 'system prompt should mention forbidden fields');
  assert.ok(messages[0].content.includes('price_label'), 'system prompt should list price_label');
  assert.ok(messages[0].content.includes('booking_url'), 'system prompt should list booking_url');
  assert.ok(messages[0].content.includes('rating'), 'system prompt should list rating');
  assert.ok(messages[1].content.includes('Some source text'), 'user message should include source text');
});

test('buildExtractionPrompt includes all forbidden fields in system prompt', () => {
  const messages = buildExtractionPrompt('attraction', 'source');
  const systemContent = messages[0].content;
  // Check a representative subset of forbidden fields
  for (const field of ['price_label', 'booking_url', 'rating', 'opening_hours', 'distance', 'visa_requirements']) {
    assert.ok(systemContent.includes(field), `system prompt should mention ${field}`);
  }
});

test('buildExtractionPrompt lists allowed fields for each entity type', () => {
  for (const entityType of ['region', 'country', 'attraction', 'accommodation', 'restaurant', 'tour_operator', 'activity', 'travel_article']) {
    const messages = buildExtractionPrompt(entityType, 'source');
    assert.ok(messages[0].content.includes('Allowed fields to extract'), `should mention allowed fields for ${entityType}`);
    assert.ok(messages[0].content.includes('Output strictly valid JSON only'), 'should demand JSON output');
  }
});
