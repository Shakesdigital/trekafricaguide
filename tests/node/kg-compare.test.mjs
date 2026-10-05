import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import { createMockClient } from './kg-mock-client.mjs';
import { compareDiscovery } from '../../server/knowledge/compare.mjs';

// ── Helper to create an existing record for comparison ──────────────────────

function makeRecord(overrides = {}) {
  return {
    id: 1,
    slug: 'maasai-mara',
    name: 'Maasai Mara National Reserve',
    location_name: 'Narok County, Kenya',
    listing_summary: 'Famous for the Great Wildebeest Migration.',
    detail_intro: 'The Maasai Mara is renowned for its wildlife.',
    hero_image_url: '/images/maasai-mara.jpg',
    hero_image_alt: 'Savannah landscape',
    status: 'published',
    ...overrides,
  };
}

// ── Category: new ──────────────────────────────────────────────────────────

test('compareDiscovery returns new when no existing record', async () => {
  const client = createMockClient();
  const { ENTITY_TYPES } = await import('../../server/content-manager/validate.mjs');

  const discoveredData = { slug: 'new-place', name: 'New Place', listing_summary: 'A new attraction.' };
  const result = await compareDiscovery({
    discoveredData,
    existingRecord: null,
    entityType: 'attraction',
    matchSimilarity: 0,
  }, client);

  assert.equal(result.category, 'new');
  assert.equal(result.existingRecord, null);
  assert.equal(result.fieldDiffs.length, 0);
  assert.equal(result.confidence, 1.0);
});

// ── Category: duplicate ────────────────────────────────────────────────────

test('compareDiscovery returns duplicate for exact name match (similarity >= 0.95)', async () => {
  const client = createMockClient();
  const existing = makeRecord();
  const discoveredData = { ...existing, name: 'Maasai Mara National Reserve' };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.98,
  }, client);

  assert.equal(result.category, 'duplicate');
  assert.equal(result.existingRecord.id, existing.id);
  assert.equal(result.confidence, 0.98);
});

test('compareDiscovery returns duplicate when no field differences (similarity >= 0.95)', async () => {
  const client = createMockClient();
  const existing = makeRecord();
  // Exact copy — same data
  const discoveredData = { ...existing };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.96,
  }, client);

  assert.equal(result.category, 'duplicate');
});

// ── Category: update ───────────────────────────────────────────────────────

test('compareDiscovery returns update when fields differ', async () => {
  const client = createMockClient();
  const existing = makeRecord({
    listing_summary: 'Old summary text.',
    detail_intro: 'Old intro.',
  });
  const discoveredData = {
    ...existing,
    listing_summary: 'Updated summary text.',
    detail_intro: 'New intro.',
  };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.7,
  }, client);

  assert.equal(result.category, 'update');
  assert.equal(result.fieldDiffs.length, 2);
  assert.ok(result.fieldDiffs.some((d) => d.field_name === 'listing_summary'));
  assert.ok(result.fieldDiffs.some((d) => d.field_name === 'detail_intro'));

  const summaryDiff = result.fieldDiffs.find((d) => d.field_name === 'listing_summary');
  assert.equal(summaryDiff.type, 'update');
  assert.equal(summaryDiff.old_value, 'Old summary text.');
  assert.equal(summaryDiff.new_value, 'Updated summary text.');
});

test('compareDiscovery update fieldDiffs includes old and new values', async () => {
  const client = createMockClient();
  const existing = makeRecord({ listing_summary: 'Old Summary' });
  const discoveredData = { ...existing, listing_summary: 'New Summary' };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.6,
  }, client);

  assert.equal(result.category, 'update');
  const diff = result.fieldDiffs.find((d) => d.field_name === 'listing_summary');
  assert.equal(diff.old_value, 'Old Summary');
  assert.equal(diff.new_value, 'New Summary');
  assert.equal(diff.type, 'update');
});

// ── Category: enrichment ────────────────────────────────────────────────────

test('compareDiscovery returns enrichment when new fields are populated that existing lacks', async () => {
  const client = createMockClient();
  const existing = makeRecord({
    listing_summary: 'Old summary.',
    detail_intro: null, // existing has no detail_intro
    best_time: null,    // existing has no best_time
  });
  const discoveredData = {
    ...existing,
    detail_intro: 'New intro text.',
    best_time: 'June to October',
  };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.55,
  }, client);

  assert.equal(result.category, 'enrichment');
  assert.ok(result.fieldDiffs.some((d) => d.field_name === 'detail_intro'));
  const detailDiff = result.fieldDiffs.find((d) => d.field_name === 'detail_intro');
  assert.equal(detailDiff.type, 'enrichment');
});

// ── Category: conflict ─────────────────────────────────────────────────────

test('compareDiscovery returns conflict when key fields contradict', async () => {
  const client = createMockClient();
  const existing = makeRecord({ name: 'Maasai Mara Game Reserve' });
  // discovered has a different name — this is a CONFLICT_FIELDS field
  const discoveredData = {
    ...existing,
    name: 'Serengeti National Park', // conflicting name
  };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.6,
  }, client);

  assert.equal(result.category, 'conflict');
  assert.equal(result.fieldDiffs.length > 0, true);
  const nameDiff = result.fieldDiffs.find((d) => d.field_name === 'name');
  assert.equal(nameDiff.type, 'conflict');
  // Conflicts should have low confidence — needs manual review
  assert.equal(result.confidence, 0.3);
});

test('compareDiscovery returns conflict when slug conflicts', async () => {
  const client = createMockClient();
  const existing = makeRecord({ slug: 'maasai-mara' });
  const discoveredData = { ...existing, slug: 'serengeti' };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.5,
  }, client);

  assert.equal(result.category, 'conflict');
});

test('compareDiscovery returns conflict when location_name conflicts', async () => {
  const client = createMockClient();
  const existing = makeRecord({ location_name: 'Kenya' });
  const discoveredData = { ...existing, location_name: 'Tanzania' };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.5,
  }, client);

  assert.equal(result.category, 'conflict');
});

// ── Category priority ──────────────────────────────────────────────────────

test('compareDiscovery conflict takes priority over update', async () => {
  const client = createMockClient();
  const existing = makeRecord({
    name: 'Old Name',
    listing_summary: 'Old summary.',
  });
  // Both a conflict (name changed) and updates (summary changed)
  const discoveredData = {
    ...existing,
    name: 'Different Name',
    listing_summary: 'New summary.',
  };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.5,
  }, client);

  assert.equal(result.category, 'conflict');
});

// ── Edge cases ───────────────────────────────────────────────────────────────

test('compareDiscovery returns duplicate when no changes at all', async () => {
  const client = createMockClient();
  const existing = makeRecord();
  // discoveredData is an exact match — no diffs
  const result = await compareDiscovery({
    discoveredData: { ...existing },
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.5,
  }, client);

  // With no diffs and similarity < 0.95, it should be 'duplicate' (fallback)
  assert.equal(result.category, 'duplicate');
  assert.equal(result.confidence, 0.9);
});

test('compareDiscovery handles null discovered values gracefully', async () => {
  const client = createMockClient();
  const existing = makeRecord({ detail_intro: 'Some intro' });
  const discoveredData = { ...existing, detail_intro: null };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.5,
  }, client);

  // null discovered with non-null existing = not an update (skip)
  // no other diffs = duplicate fallback
  assert.ok(['duplicate', 'enrichment'].includes(result.category));
});

test('compareDiscovery handles empty extracted fields', async () => {
  const client = createMockClient();
  const existing = makeRecord();
  const discoveredData = { slug: 'maasai-mara', name: 'Maasai Mara National Reserve' };

  const result = await compareDiscovery({
    discoveredData,
    existingRecord: existing,
    entityType: 'attraction',
    matchSimilarity: 0.5,
  }, client);

  // Only slug and name match — everything else in existing is non-null but
  // in discovered is undefined. Those should be skipped (discovered is empty).
  // So no diffs → duplicate
  assert.equal(result.category, 'duplicate');
});

test('compareDiscovery throws INVALID_REQUEST for unknown entity type', async () => {
  const client = createMockClient();

  let threw = false;
  try {
    await compareDiscovery({
      discoveredData: { name: 'Test' },
      existingRecord: null,
      entityType: 'nonexistent',
      matchSimilarity: 0,
    }, client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});
