import test from 'node:test';
import assert from 'node:assert/strict';
import { readBuildEnv } from '../../src/lib/env.mjs';
import { visibleAt, visibleRecords, loadContent } from '../../src/lib/content-repository.mjs';

test('build environment rejects missing public Supabase configuration', () => {
  assert.throws(() => readBuildEnv({}), /SUPABASE_URL/);
});

test('visibleAt excludes drafts and future publication', () => {
  const now = new Date('2026-09-21T12:00:00Z');
  assert.equal(visibleAt({ status: 'draft' }, now), false);
  assert.equal(visibleAt({ status: 'published', published_at: '2026-09-22T00:00:00Z' }, now), false);
  assert.equal(visibleAt({ status: 'published', published_at: null }, now), true);
});

test('visibleAt accepts past published_at', () => {
  const now = new Date('2026-09-21T12:00:00Z');
  assert.equal(visibleAt({ status: 'published', published_at: '2026-09-20T00:00:00Z' }, now), true);
});

test('visibleRecords filters to only visible entries', () => {
  const now = new Date('2026-09-21T12:00:00Z');
  const records = [
    { status: 'published', published_at: null },
    { status: 'draft', published_at: null },
    { status: 'published', published_at: '2020-01-01T00:00:00Z' },
    { status: 'published', published_at: '2999-01-01T00:00:00Z' },
  ];
  const visible = visibleRecords(records, now);
  assert.equal(visible.length, 2);
});

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturePath = join(__dirname, '..', '..', 'tests', 'fixtures', 'site-data.json');

test('loadContent from fixture loads without network access', async () => {
  const tables = await loadContent({
    env: readBuildEnv({
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example_key',
      STAY22_AFFILIATE_ID: 'aid-test',
      SITE_URL: 'https://trekafricaguide.com',
    }),
    now: new Date('2026-09-21T12:00:00Z'),
    fixturePath,
  });

  assert.ok(tables.regions.length > 0, 'regions should be loaded');
  assert.ok(tables.countries.length > 0, 'countries should be loaded');
  assert.ok(tables.attractions.length > 0, 'attractions should be loaded');
  assert.ok(tables.accommodations.length > 0, 'accommodations should be loaded');
  assert.ok(tables.booking_offers.length > 0, 'booking_offers should be loaded');
  assert.ok(tables.site_settings.length > 0, 'site_settings should be loaded');
  assert.ok(tables.page_sections.length > 0, 'page_sections should be loaded');
});

test('loadContent fixture excludes drafts and future-dated records', async () => {
  const tables = await loadContent({
    env: readBuildEnv({
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example_key',
      STAY22_AFFILIATE_ID: 'aid-test',
      SITE_URL: 'https://trekafricaguide.com',
    }),
    now: new Date('2026-09-21T12:00:00Z'),
    fixturePath,
  });

  // Northern Africa region is a draft in the fixture — should not appear
  const northernAfrica = tables.regions.find((r) => r.slug === 'northern-africa');
  assert.equal(northernAfrica, undefined, 'draft region should be excluded');

  // featured_regions section is published_at 2026-09-20 — should appear
  const featuredRegions = tables.page_sections.find((s) => s.section_key === 'featured_regions');
  assert.ok(featuredRegions, 'future-published page section should appear');
});

test('loadContent from a fake client reports table name on failure', async () => {
  const fakeClient = {
    from(table) {
      return {
        select() {
          return Promise.resolve({
            data: null,
            error: new Error(`Failed to load ${table}: connection refused`),
          });
        },
      };
    },
  };

  await assert.rejects(
    () => loadContent({
      env: readBuildEnv({
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example_key',
        STAY22_AFFILIATE_ID: 'aid-test',
        SITE_URL: 'https://trekafricaguide.com',
      }),
      client: fakeClient,
    }),
    /Failed to load regions/
  );
});

test('loadContent rejects empty regions after filtering', async () => {
  const fakeClient = {
    from(table) {
      return {
        select() {
          return Promise.resolve({
            data: table === 'regions' ? [{ status: 'draft' }] : [],
            error: null,
          });
        },
      };
    },
  };

  await assert.rejects(
    () => loadContent({
      env: readBuildEnv({
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example_key',
        STAY22_AFFILIATE_ID: 'aid-test',
        SITE_URL: 'https://trekafricaguide.com',
      }),
      client: fakeClient,
    }),
    /regions.*empty/i
  );
});

test('CONTENT_FIXTURE_PATH is rejected outside test mode', async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  process.env.CONTENT_FIXTURE_PATH = '/some/path.json';

  try {
    await assert.rejects(
      () => loadContent({
        env: {
          supabaseUrl: 'https://example.supabase.co',
          supabasePublishableKey: 'sb_publishable_example_key',
          stay22AffiliateId: 'aid-test',
          siteUrl: 'https://trekafricaguide.com',
        },
        fixturePath: '/some/path.json',
      }),
      /NODE_ENV.*test/i
    );
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
    delete process.env.CONTENT_FIXTURE_PATH;
  }
});
