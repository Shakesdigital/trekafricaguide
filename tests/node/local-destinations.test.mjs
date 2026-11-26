import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLocalDestinations } from '../../src/lib/local-destinations.mjs';

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
