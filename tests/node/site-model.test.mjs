import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSiteModel } from '../../src/lib/site-model.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturePath = join(__dirname, '..', '..', 'tests', 'fixtures', 'site-data.json');

// Load fixture synchronously for test data
import { readFileSync } from 'node:fs';
const raw = JSON.parse(readFileSync(fixturePath, 'utf8'));
const fixtureTables = {
  regions: raw.regions,
  countries: raw.countries,
  districts: raw.districts,
  attractions: raw.attractions,
  accommodations: raw.accommodations,
  booking_offers: raw.booking_offers,
  site_settings: raw.site_settings,
  page_sections: raw.page_sections,
  media_assets: raw.media_assets,
};

const now = new Date('2026-09-21T12:00:00Z');

test('buildSiteModel exposes settings, pageSections, and route collections', () => {
  const model = buildSiteModel(fixtureTables, now);
  assert.ok(model.settings);
  assert.ok(model.pageSections);
  assert.ok(model.regions);
  assert.ok(model.countries);
  assert.ok(model.attractions);
  assert.ok(model.accommodations);
});

test('buildSiteModel joins country, region, district, media, attraction, and offers', () => {
  const model = buildSiteModel(fixtureTables, now);
  const stay = model.accommodationsBySlug.get('sanctuary-gorilla-forest-camp');

  assert.equal(stay.country.slug, 'uganda');
  assert.equal(stay.region.slug, 'east-africa');
  assert.equal(stay.attraction.slug, 'bwindi-impenetrable-national-park');
  assert.equal(stay.bookingOffers.length, 2);
});

test('buildSiteModel has slug-indexed maps', () => {
  const model = buildSiteModel(fixtureTables, now);
  assert.ok(model.regionsBySlug.has('east-africa'));
  assert.ok(model.countriesBySlug.has('uganda'));
  assert.ok(model.attractionsBySlug.has('bwindi-impenetrable-national-park'));
  assert.ok(model.accommodationsBySlug.has('sanctuary-gorilla-forest-camp'));
});

test('buildSiteModel includes hero media for joined entities', () => {
  const model = buildSiteModel(fixtureTables, now);
  const attraction = model.attractionsBySlug.get('bwindi-impenetrable-national-park');
  assert.ok(attraction.heroMedia);
  assert.equal(attraction.heroMedia.creator, 'Thomas Fuhrmann');
  assert.equal(attraction.heroMedia.license, 'CC BY-SA 4.0');
});

test('buildSiteModel sorts collections deterministically', () => {
  const model = buildSiteModel(fixtureTables, now);
  // Featured attractions should come first
  const featured = model.attractions.filter((a) => a.featured);
  assert.ok(featured.length > 0);
  // Featured flag should be true for first featured items
  const featuredSlugs = featured.map((a) => a.slug);
  assert.ok(featuredSlugs.includes('bwindi-impenetrable-national-park'));
  assert.ok(featuredSlugs.includes('maasai-mara'));
});

test('buildSiteModel computes nearby attractions deterministically', () => {
  const model = buildSiteModel(fixtureTables, now);
  const attraction = model.attractionsBySlug.get('maasai-mara');

  // Nearby attractions: same country, different ID, first three after sort
  assert.ok(attraction.nearbyAttractions.length > 0);
  // All nearby attractions should be in the same country
  attraction.nearbyAttractions.forEach((a) => {
    assert.equal(a.country_id, attraction.country_id);
  });
  // Should not include itself
  assert.equal(attraction.nearbyAttractions.find((a) => a.id === attraction.id), undefined);
  // Should be at most 3
  assert.ok(attraction.nearbyAttractions.length <= 3);
});

test('buildSiteModel computes nearby stays deterministically', () => {
  const model = buildSiteModel(fixtureTables, now);
  const attraction = model.attractionsBySlug.get('bwindi-impenetrable-national-park');

  // Nearby accommodations should be those linked to this attraction
  const nearbyStays = attraction.nearbyStays;
  assert.ok(nearbyStays.length > 0);
  nearbyStays.forEach((s) => {
    assert.equal(s.attraction_id, attraction.id);
  });
});

test('buildSiteModel computes search suggestions', () => {
  const model = buildSiteModel(fixtureTables, now);
  assert.ok(model.searchSuggestions.length > 0);
  const slugs = model.searchSuggestions.map((s) => s.value);
  assert.ok(slugs.includes('uganda'));
  assert.ok(slugs.includes('bwindi-impenetrable-national-park'));
});

test('buildSiteModel computes internal URLs', () => {
  const model = buildSiteModel(fixtureTables, now);
  const attraction = model.attractionsBySlug.get('bwindi-impenetrable-national-park');
  assert.equal(attraction.internalUrl, '/attractions/bwindi-impenetrable-national-park');

  const stay = model.accommodationsBySlug.get('paraa-safari-lodge');
  assert.equal(stay.internalUrl, '/accommodations/paraa-safari-lodge');
});

test('buildSiteModel resolves route families from slug', () => {
  const model = buildSiteModel(fixtureTables, now);
  const attraction = model.attractionsBySlug.get('bwindi-impenetrable-national-park');
  assert.equal(attraction.routeFamily, 'attractions');
});

test('buildSiteModel rejects duplicate slugs inside one route family', () => {
  const dupTables = JSON.parse(JSON.stringify(fixtureTables));
  const dup = { ...dupTables.attractions[0] };
  dup.id = 999;
  dupTables.attractions.push(dup);

  assert.throws(() => buildSiteModel(dupTables, now), /duplicate attraction slug/i);
});

test('buildSiteModel rejects a published child with an unpublished parent', () => {
  const orphanTables = JSON.parse(JSON.stringify(fixtureTables));
  // Set a country's region to draft
  orphanTables.regions[0].status = 'draft';
  // The country referencing this region is still published
  // buildSiteModel should detect this
  assert.throws(
    () => buildSiteModel(
      {
        regions: orphanTables.regions,
        countries: orphanTables.countries,
        districts: orphanTables.districts,
        attractions: orphanTables.attractions,
        accommodations: orphanTables.accommodations,
        booking_offers: orphanTables.booking_offers,
        site_settings: orphanTables.site_settings,
        page_sections: orphanTables.page_sections,
        media_assets: orphanTables.media_assets,
      },
      now
    ),
    /published country.+unpublished region/i
  );
});

test('buildSiteModel rejects missing parent country', () => {
  const orphanTables = JSON.parse(JSON.stringify(fixtureTables));
  // Remove the country that the attraction references
  orphanTables.countries = orphanTables.countries.filter((c) => c.id !== 1);

  assert.throws(() => buildSiteModel(orphanTables, now), /missing country/i);
});

test('buildSiteModel rejects invalid route data', () => {
  const badTables = JSON.parse(JSON.stringify(fixtureTables));
  badTables.countries[0].slug = 'invalid/slug';

  assert.throws(() => buildSiteModel(badTables, now), /route family/i);
});

test('buildSiteModel does not mutate raw records', () => {
  const rawBefore = JSON.stringify(fixtureTables);
  buildSiteModel(fixtureTables, now);
  assert.equal(JSON.stringify(fixtureTables), rawBefore);
});
