import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildLocalDestinations } from '../../src/lib/local-destinations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');

const now = new Date('2026-11-26T12:00:00Z');

const country = {
  id: 1,
  slug: 'zambia',
  name: 'Zambia',
  status: 'published',
  published_at: null,
  region: { slug: 'southern-africa', name: 'Southern Africa' },
};

function destination(overrides = {}) {
  return {
    slug: 'south-luangwa',
    country_slug: 'zambia',
    name: 'South Luangwa',
    category: 'Park gateway',
    listing_summary: 'A walking-safari gateway.',
    overview: 'Overview.',
    access_summary: 'Access.',
    best_time: 'Dry season.',
    planning_tips: 'Plan ahead.',
    status: 'published',
    published_at: null,
    attraction_slugs: [],
    accommodation_slugs: [],
    activity_slugs: [],
    travel_insight_slugs: [],
    ...overrides,
  };
}

function collections(overrides = {}) {
  return {
    countries: [country],
    attractions: [],
    accommodations: [],
    activities: [],
    travelArticles: [],
    ...overrides,
  };
}

test('skips a missing activity instead of failing the build', () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(message);
  try {
    const [result] = buildLocalDestinations(
      [destination({ activity_slugs: ['missing-activity'] })],
      collections(),
      now
    );
    assert.deepEqual(result.activities, []);
    assert.match(warnings.join('\n'), /missing or unpublished activity_slugs: missing-activity/);
  } finally {
    console.warn = originalWarn;
  }
});

test('skips an unpublished activity but keeps published relationships', () => {
  const published = {
    id: 10,
    slug: 'south-luangwa-walking-safari',
    name: 'South Luangwa walking safari',
    status: 'published',
    published_at: null,
    country: { slug: 'zambia' },
  };
  const draft = {
    id: 11,
    slug: 'draft-walk',
    name: 'Draft walk',
    status: 'draft',
    published_at: null,
    country: { slug: 'zambia' },
  };
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const [result] = buildLocalDestinations(
      [destination({ activity_slugs: ['south-luangwa-walking-safari', 'draft-walk'] })],
      collections({ activities: [published, draft] }),
      now
    );
    assert.deepEqual(result.activities.map((item) => item.slug), ['south-luangwa-walking-safari']);
  } finally {
    console.warn = originalWarn;
  }
});

test('still rejects a related record from another country', () => {
  const activity = {
    id: 12,
    slug: 'kenyan-walk',
    name: 'Kenyan walk',
    status: 'published',
    published_at: null,
    country: { slug: 'kenya' },
  };
  assert.throws(
    () => buildLocalDestinations(
      [destination({ activity_slugs: ['kenyan-walk'] })],
      collections({ activities: [activity] }),
      now
    ),
    /references activity_slugs in another country: kenyan-walk/
  );
});

// --- Nanyuki draft (content/nanyuki-destination-2026-11-26) ---

const rawDestinations = JSON.parse(
  readFileSync(join(repoRoot, 'content', 'local-destinations.json'), 'utf8'),
);

// Minimal published Kenya country so the Nanyuki draft can be validated.
const nanyukiCountries = [
  { slug: 'kenya', name: 'Kenya', status: 'published', published_at: null, region: { slug: 'east-africa', name: 'East Africa' }, id: 'ke' },
];

// Only the Nanyuki draft, validated against a published Kenya country.
const nanyukiOnly = rawDestinations.filter((r) => r.slug === 'nanyuki');

const nanyukiCollections = {
  countries: nanyukiCountries,
  attractions: [],
  accommodations: [],
  activities: [],
  travelArticles: [],
};

test('local-destinations.json contains a well-formed Nanyuki draft', () => {
  const nanyuki = rawDestinations.find((r) => r.slug === 'nanyuki');
  assert.ok(nanyuki, 'Nanyuki entry present');
  assert.equal(nanyuki.country_slug, 'kenya');
  assert.equal(nanyuki.status, 'draft');
  assert.equal(nanyuki.last_researched, '2026-11-26');
  assert.ok(Array.isArray(nanyuki.research_sources) && nanyuki.research_sources.length >= 3);
  for (const source of nanyuki.research_sources) {
    assert.match(source.url, /^https:\/\//);
    assert.equal(source.checked_at, '2026-11-26');
  }
});

test('draft local destinations are excluded from the published model', () => {
  const built = buildLocalDestinations(nanyukiOnly, nanyukiCollections, now);
  assert.ok(!built.some((d) => d.slug === 'nanyuki'), 'draft Nanyuki not published');
  assert.equal(built.length, 0);
});

test('the Nanyuki draft becomes visible once published', () => {
  const published = nanyukiOnly.map((r) => ({ ...r, status: 'published', published_at: null }));
  const built = buildLocalDestinations(published, nanyukiCollections, now);
  assert.equal(built.length, 1);
  assert.equal(built[0].slug, 'nanyuki');
  assert.equal(built[0].internalUrl, '/countries/kenya/nanyuki');
});