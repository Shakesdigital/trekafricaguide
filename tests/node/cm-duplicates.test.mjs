import test from 'node:test';
import assert from 'node:assert/strict';
import { findDuplicates, findCrossTableDuplicates } from '../../server/content-manager/match.mjs';
import { createMockClient } from './cm-mock-client.mjs';

// ── Helpers ──────────────────────────────────────────────────────

function seedAttractions(client) {
  client._seed('attractions', [
    { id: 1, slug: 'gorilla-trek-bwindi', name: 'Gorilla Trek Bwindi', location_name: 'Bwindi, Uganda', listing_summary: 'Track mountain gorillas in Bwindi Impenetrable National Park', updated_at: '2024-01-15T10:00:00Z' },
    { id: 2, slug: 'serengeti-safari-north', name: 'Serengeti Safari North', location_name: 'Serengeti, Tanzania', listing_summary: 'Wildebeest migration safari', updated_at: '2024-02-20T14:00:00Z' },
    { id: 3, slug: 'mount-fuji-hike', name: 'Mount Fuji Hike', location_name: 'Japan', listing_summary: 'Climb Mount Fuji', updated_at: '2024-03-10T08:00:00Z' },
  ]);
}

function seedMultipleTables(client) {
  seedAttractions(client);
  client._seed('restaurants', [
    { id: 1, slug: 'gorilla-trek-cafe', name: 'Gorilla Trek Cafe', location_name: 'Kigali, Rwanda', listing_summary: 'Local cuisine near Volcanoes NP', updated_at: '2024-01-10T10:00:00Z' },
  ]);
  client._seed('activities', [
    { id: 10, slug: 'mount-fuji-cycling', name: 'Mount Fuji Cycling', location_name: 'Japan', listing_summary: 'Bike around Mount Fuji', updated_at: '2024-03-05T08:00:00Z' },
  ]);
}

// ── findDuplicates ───────────────────────────────────────────────

test('findDuplicates returns exact name match with similarity 1.0', async () => {
  const client = createMockClient();
  seedAttractions(client);

  const results = await findDuplicates('Gorilla Trek Bwindi', 'attraction', client);

  assert.ok(results.length > 0, 'should find at least one match');
  const match = results.find((r) => r.id === 1);
  assert.equal(match.similarity, 1, 'exact match should have similarity 1.0');
  assert.equal(match.match_field, 'name');
  assert.equal(match.slug, 'gorilla-trek-bwindi');
});

test('findDuplicates returns partial matches above threshold', async () => {
  const client = createMockClient();
  seedAttractions(client);

  const results = await findDuplicates('gorilla trek', 'attraction', client);

  assert.ok(results.length > 0, 'should find gorilla trek match');
  const match = results.find((r) => r.name === 'Gorilla Trek Bwindi');
  assert.ok(match, 'should match Gorilla Trek Bwindi');
  assert.ok(match.similarity >= 0.5, `similarity should be >= 0.5, got ${match.similarity}`);
});

test('findDuplicates returns substring matches with similarity 0.8', async () => {
  const client = createMockClient();
  seedAttractions(client);

  // "gorilla" is a substring of "Gorilla Trek Bwindi" → 0.8
  const results = await findDuplicates('gorilla', 'attraction', client);

  const match = results.find((r) => r.id === 1);
  assert.ok(match, 'should find the gorilla trek attraction');
  assert.equal(match.similarity, 0.8, `substring match should be 0.8, got ${match.similarity}`);
});

test('findDuplicates excludes matches below threshold', async () => {
  const client = createMockClient();
  seedAttractions(client);

  // "xyz" won't match anything with similarity >= 0.5
  const results = await findDuplicates('xyz', 'attraction', client, { threshold: 0.5 });
  assert.equal(results.length, 0, 'should find no matches below threshold');
});

test('findDuplicates respects custom threshold', async () => {
  const client = createMockClient();
  seedAttractions(client);

  // "gorilla" matches "Gorilla Trek Bwindi" as substring → similarity 0.8
  const highThreshold = await findDuplicates('gorilla', 'attraction', client, { threshold: 0.9 });
  assert.equal(highThreshold.length, 0, 'with threshold 0.9, 0.8-similarity match should be excluded');

  const lowThreshold = await findDuplicates('gorilla', 'attraction', client, { threshold: 0 });
  assert.ok(lowThreshold.length > 0, 'with threshold 0, substring matches should appear');
  assert.equal(lowThreshold[0].similarity, 0.8, 'substring match should have 0.8 similarity');
});

test('findDuplicates respects limit', async () => {
  const client = createMockClient();
  // Seed many similar records
  const rows = [];
  for (let i = 0; i < 20; i++) {
    rows.push({
      id: i + 1,
      slug: `test-attraction-${i}`,
      name: `Test Attraction ${i}`,
      location_name: 'Test Location',
      listing_summary: 'test',
      updated_at: '2024-01-01T00:00:00Z',
    });
  }
  client._seed('attractions', rows);

  const results = await findDuplicates('test attraction', 'attraction', client, { limit: 5, threshold: 0.5 });
  assert.equal(results.length, 5, 'should limit to 5 results');
});

test('findDuplicates returns empty array for no matches', async () => {
  const client = createMockClient();
  seedAttractions(client);

  const results = await findDuplicates('nonexistent place nowhere', 'attraction', client);
  assert.equal(results.length, 0);
});

test('findDuplicates handles empty text columns gracefully', async () => {
  const client = createMockClient();
  client._seed('attractions', [
    { id: 1, slug: '', name: 'Place', location_name: '', listing_summary: '', updated_at: '2024-01-01' },
  ]);

  const results = await findDuplicates('place', 'attraction', client, { threshold: 0 });
  assert.ok(results.length > 0, 'should match on name even with empty other columns');
  assert.equal(results[0].name, 'Place');
});

test('findDuplicates throws on unknown entity type', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await findDuplicates('test', 'nonexistent_entity', client);
  } catch (err) {
    threw = true;
    assert.equal(err.message, 'Unknown entity type for matching: nonexistent_entity');
  }
  assert.equal(threw, true, 'should throw for unknown entity type');
});

test('findDuplicates matches across multiple text columns', async () => {
  const client = createMockClient();
  client._seed('attractions', [
    { id: 1, slug: 'trek', name: 'Mountain Trail', location_name: 'Bwindi Impenetrable National Park', listing_summary: '', updated_at: '2024-01-01' },
  ]);

  // "impenetrable" matches location_name, not name or slug
  const results = await findDuplicates('Impenetrable', 'attraction', client, { threshold: 0.5 });
  assert.ok(results.length > 0, 'should match via location_name column');
  const match = results[0];
  assert.equal(match.match_field, 'location_name');
});

// ── findCrossTableDuplicates ─────────────────────────────────────

test('findCrossTableDuplicates finds same name in different entity tables', async () => {
  const client = createMockClient();
  seedMultipleTables(client);

  // Search for "gorilla" — substring of both attraction and restaurant names
  const results = await findCrossTableDuplicates('gorilla', client, { threshold: 0.5 });

  // Should find "Gorilla Trek Bwindi" in attractions (substring match = 0.8)
  const attractionMatch = results.find((r) => r.entity_type === 'attraction');
  assert.ok(attractionMatch, 'should find attraction match');
  assert.equal(attractionMatch.similarity, 0.8, 'substring match should be 0.8');

  // Should find "Gorilla Trek Cafe" in restaurants (substring match = 0.8)
  const restaurantMatch = results.find((r) => r.entity_type === 'restaurant');
  assert.ok(restaurantMatch, 'should find restaurant match with substring');
  assert.equal(restaurantMatch.similarity, 0.8);
});

test('findCrossTableDuplicates returns results sorted by similarity', async () => {
  const client = createMockClient();
  seedMultipleTables(client);

  const results = await findCrossTableDuplicates('Mount Fuji', client, { threshold: 0.5 });

  assert.ok(results.length > 0);
  // Results should be sorted descending by similarity
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i - 1].similarity >= results[i].similarity,
      'results should be sorted by similarity descending');
  }
});

test('findCrossTableDuplicates respects limitPerTable', async () => {
  const client = createMockClient();
  // Seed multiple restaurants with similar names
  const restaurants = [];
  for (let i = 0; i < 10; i++) {
    restaurants.push({
      id: i + 1,
      slug: `cafe-${i}`,
      name: `Gorilla Cafe ${i}`,
      location_name: 'Test',
      listing_summary: '',
      updated_at: '2024-01-01',
    });
  }
  client._seed('restaurants', restaurants);
  seedAttractions(client);

  const results = await findCrossTableDuplicates('Gorilla', client, {
    threshold: 0.5,
    limitPerTable: 3,
  });

  const restaurantResults = results.filter((r) => r.entity_type === 'restaurant');
  assert.ok(restaurantResults.length <= 3, 'should respect limitPerTable for restaurants');
});

test('findCrossTableDuplicates does not throw when a table is empty', async () => {
  const client = createMockClient();
  client._seed('attractions', [
    { id: 1, slug: 'gorilla-trek', name: 'Gorilla Trek', location_name: 'Bwindi', listing_summary: '', updated_at: '2024-01-01' },
  ]);
  // restaurants, activities, etc. are empty

  const results = await findCrossTableDuplicates('gorilla', client, { threshold: 0.7 });

  assert.ok(results.length > 0, 'should still find matches from non-empty tables');
});

// ── Similarity function (indirectly tested) ───────────────────

test('similarity: exact match returns 1.0 (via findDuplicates)', async () => {
  const client = createMockClient();
  client._seed('attractions', [
    { id: 1, slug: 'test', name: 'Exact Match', location_name: 'test', listing_summary: '', updated_at: '2024-01-01' },
  ]);
  const results = await findDuplicates('Exact Match', 'attraction', client);
  assert.equal(results[0].similarity, 1);
});

test('similarity: substring returns 0.8 (via findDuplicates)', async () => {
  const client = createMockClient();
  client._seed('attractions', [
    { id: 1, slug: 'test', name: 'The Great Gorilla Trek', location_name: 'test', listing_summary: '', updated_at: '2024-01-01' },
  ]);
  const results = await findDuplicates('gorilla', 'attraction', client);
  assert.equal(results[0].similarity, 0.8);
});
