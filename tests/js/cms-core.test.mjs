/**
 * cms-core.test.mjs — Unit tests for cms-core.js pure runtime rules.
 *
 * Run with:  node --test tests/js/cms-core.test.mjs
 *
 * Covers:
 *   - Publication timing (isVisible / visibleRecords)
 *   - Stock image fallback (resolveImage / pickHero / pickGallery)
 *   - Offer freshness (isOfferFresh / offerPriceLabel)
 *   - Stay22 link building (buildStay22Link / buildSearchbarLink)
 *   - Stay22 vs direct disclosures (offerRel / offerDisclosure)
 *   - Internal detail URLs (internalUrl)
 *   - SEO metadata construction (buildSeoMeta)
 *   - Media attribution (mediaAttribution / hasValidAttribution)
 *   - Relationship normalization (normalizeList / lines / relationshipKey)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

// cms-core.js sets globalThis.CmsCore via UMD wrapper; import as side-effect.
await import('../../public/cms-core.js');
await import('../../public/cms-schema.js');
const CmsCore = globalThis.CmsCore;

// ── Publication timing ───────────────────────────────────────────

test('isVisible returns false for null/undefined record', () => {
  assert.equal(CmsCore.isVisible(null), false);
  assert.equal(CmsCore.isVisible(undefined), false);
});

test('isVisible returns false for draft status', () => {
  const record = { status: 'draft', published_at: null };
  assert.equal(CmsCore.isVisible(record), false);
});

test('isVisible returns true for published with null published_at', () => {
  const record = { status: 'published', published_at: null };
  assert.equal(CmsCore.isVisible(record), true);
});

test('isVisible returns true for published with past published_at', () => {
  const record = { status: 'published', published_at: '2020-01-01T00:00:00Z' };
  assert.equal(CmsCore.isVisible(record), true);
});

test('isVisible returns false for published with future published_at', () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  const record = { status: 'published', published_at: future };
  assert.equal(CmsCore.isVisible(record), false);
});

test('isVisible respects a custom "now" parameter', () => {
  const record = { status: 'published', published_at: '2025-01-01T00:00:00Z' };
  assert.equal(CmsCore.isVisible(record, new Date('2025-06-01').getTime()), true);
  assert.equal(CmsCore.isVisible(record, new Date('2024-06-01').getTime()), false);
});

test('visibleRecords filters to only visible entries', () => {
  const records = [
    { status: 'published', published_at: null },
    { status: 'draft', published_at: null },
    { status: 'published', published_at: '2020-01-01T00:00:00Z' },
    { status: 'published', published_at: '2999-01-01T00:00:00Z' },
  ];
  const visible = CmsCore.visibleRecords(records);
  assert.equal(visible.length, 2);
});

// ── Stock image fallback ──────────────────────────────────────────

test('resolveImage returns non-slot values unchanged', () => {
  assert.equal(CmsCore.resolveImage('https://example.com/img.jpg'), 'https://example.com/img.jpg');
  assert.equal(CmsCore.resolveImage(null), null);
  assert.equal(CmsCore.resolveImage(undefined), undefined);
});

test('resolveImage resolves known slot keys to stock paths', () => {
  assert.equal(CmsCore.resolveImage('image-slot:home-hero-east-africa'), '/images/stock/destinations/maasai-mara.jpg');
  assert.equal(CmsCore.resolveImage('image-slot:home-intro-africa-map'), '/images/stock/destinations/okavango-delta.jpg');
  assert.equal(CmsCore.resolveImage('image-slot:country-kenya'), '/images/stock/destinations/maasai-mara.jpg');
  assert.equal(CmsCore.resolveImage('image-slot:country-uganda'), '/images/stock/destinations/bwindi-impenetrable-national-park.jpg');
  assert.equal(CmsCore.resolveImage('image-slot:destinations-index-hero'), '/images/stock/destinations/cape-town.jpg');
});

test('resolveImage falls back to slug for unknown slot keys', () => {
  // Unknown key: strip type prefix and use remainder
  assert.equal(CmsCore.resolveImage('image-slot:attraction-foo-bar'), '/images/stock/destinations/foo-bar.jpg');
  assert.equal(CmsCore.resolveImage('image-slot:custom-key'), '/images/stock/destinations/custom-key.jpg');
});

test('pickHero prefers hero_image_url', () => {
  const listing = {
    hero_image_url: 'https://example.com/hero.jpg',
    image_slot: 'image-slot:country-kenya',
    gallery: ['https://example.com/gallery-1.jpg'],
  };
  assert.equal(CmsCore.pickHero(listing), 'https://example.com/hero.jpg');
});

test('pickHero falls back to resolved image_slot', () => {
  const listing = {
    image_slot: 'image-slot:country-kenya',
  };
  assert.equal(CmsCore.pickHero(listing), '/images/stock/destinations/maasai-mara.jpg');
});

test('pickHero falls back to first gallery item', () => {
  const listing = {
    gallery: ['https://example.com/gallery-1.jpg', 'https://example.com/gallery-2.jpg'],
  };
  assert.equal(CmsCore.pickHero(listing), 'https://example.com/gallery-1.jpg');
});

test('pickHero returns null when no image is available', () => {
  assert.equal(CmsCore.pickHero({}), null);
  assert.equal(CmsCore.pickHero(null), null);
});

test('pickGallery returns gallery array when present', () => {
  const listing = { gallery: ['a.jpg', 'b.jpg', 'c.jpg'] };
  assert.deepEqual(CmsCore.pickGallery(listing), ['a.jpg', 'b.jpg', 'c.jpg']);
});

test('pickGallery falls back to hero_image_url', () => {
  const listing = { hero_image_url: 'hero.jpg' };
  assert.deepEqual(CmsCore.pickGallery(listing), ['hero.jpg']);
});

test('pickGallery returns empty array for empty listing', () => {
  assert.deepEqual(CmsCore.pickGallery({}), []);
  assert.deepEqual(CmsCore.pickGallery(null), []);
});

// ── Offer freshness ───────────────────────────────────────────────

test('isOfferFresh returns false for null offer', () => {
  assert.equal(CmsCore.isOfferFresh(null), false);
});

test('isOfferFresh returns false when price fields are missing', () => {
  const now = Date.now();
  assert.equal(CmsCore.isOfferFresh({ price_amount: 100, price_currency: 'USD', price_unit: 'night', price_checked_at: new Date().toISOString(), price_basis: 'per night' }, now), true);

  // Missing amount
  assert.equal(CmsCore.isOfferFresh({ price_currency: 'USD', price_unit: 'night', price_checked_at: new Date().toISOString(), price_basis: 'per night' }, now), false);
  // Missing currency
  assert.equal(CmsCore.isOfferFresh({ price_amount: 100, price_unit: 'night', price_checked_at: new Date().toISOString(), price_basis: 'per night' }, now), false);
  // Missing unit
  assert.equal(CmsCore.isOfferFresh({ price_amount: 100, price_currency: 'USD', price_checked_at: new Date().toISOString(), price_basis: 'per night' }, now), false);
  // Missing basis
  assert.equal(CmsCore.isOfferFresh({ price_amount: 100, price_currency: 'USD', price_unit: 'night', price_checked_at: new Date().toISOString() }, now), false);
  // Missing checked_at
  assert.equal(CmsCore.isOfferFresh({ price_amount: 100, price_currency: 'USD', price_unit: 'night', price_basis: 'per night' }, now), false);
});

test('isOfferFresh returns false for future checked_at', () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  const offer = {
    price_amount: 100, price_currency: 'USD', price_unit: 'night',
    price_checked_at: future, price_basis: 'per night',
  };
  assert.equal(CmsCore.isOfferFresh(offer), false);
});

test('isOfferFresh returns false for stale offers (> 90 days)', () => {
  const oldDate = new Date(Date.now() - 100 * 86400000).toISOString();
  const offer = {
    price_amount: 100, price_currency: 'USD', price_unit: 'night',
    price_checked_at: oldDate, price_basis: 'per night',
  };
  assert.equal(CmsCore.isOfferFresh(offer), false);
});

test('isOfferFresh returns true for offers within 90 days', () => {
  const recent = new Date(Date.now() - 30 * 86400000).toISOString();
  const offer = {
    price_amount: 250, price_currency: 'USD', price_unit: 'night',
    price_checked_at: recent, price_basis: 'per night',
  };
  assert.equal(CmsCore.isOfferFresh(offer), true);
});

test('isOfferFresh uses custom maxAgeDays', () => {
  const oldDate = new Date(Date.now() - 40 * 86400000).toISOString();
  const offer = {
    price_amount: 100, price_currency: 'USD', price_unit: 'night',
    price_checked_at: oldDate, price_basis: 'per night',
  };
  // With 30-day threshold, 40 days old is stale
  assert.equal(CmsCore.isOfferFresh(offer, Date.now(), 30), false);
  // With 60-day threshold, 40 days old is fresh
  assert.equal(CmsCore.isOfferFresh(offer, Date.now(), 60), true);
});

test('offerPriceLabel formats fresh offers', () => {
  const recent = new Date(Date.now() - 10 * 86400000).toISOString();
  const offer = {
    price_amount: 25000, price_currency: 'UGX', price_unit: 'night',
    price_checked_at: recent, price_basis: 'per night',
  };
  assert.equal(CmsCore.offerPriceLabel(offer, 'accommodation'), 'From UGX 25,000 per night');
});

test('offerPriceLabel returns currency symbol from map', () => {
  const recent = new Date(Date.now() - 1 * 86400000).toISOString();
  const offer = {
    price_amount: 150, price_currency: 'USD', price_unit: 'person',
    price_checked_at: recent, price_basis: 'per person',
  };
  assert.equal(CmsCore.offerPriceLabel(offer, 'attraction'), 'From $150 per person');
});

test('offerPriceLabel returns fallback for stale offers', () => {
  const oldDate = new Date(Date.now() - 100 * 86400000).toISOString();
  const offer = {
    price_amount: 100, price_currency: 'USD', price_unit: 'night',
    price_checked_at: oldDate, price_basis: 'per night',
  };
  assert.equal(CmsCore.offerPriceLabel(offer, 'accommodation'), 'Check live price');
  assert.equal(CmsCore.offerPriceLabel(offer, 'restaurant'), 'Check menu and reservation details');
});

test('offerPriceLabel returns fallback for null offer', () => {
  assert.equal(CmsCore.offerPriceLabel(null, 'accommodation'), 'Check live price');
  assert.equal(CmsCore.offerPriceLabel(null, 'restaurant'), 'Check menu and reservation details');
});

// ── Stay22 link building ─────────────────────────────────────────

test('buildStay22Link returns fallback for non-affiliate offer', () => {
  const listing = { name: 'Test Stay', slug: 'test-stay', location_name: 'Kampala' };
  const offer = { source_url: 'https://booking.example/offer', affiliate_supported: false };
  assert.equal(CmsCore.buildStay22Link(listing, offer, {}), 'https://booking.example/offer');
});

test('buildStay22Link falls back to listing.booking_url for non-affiliate offer without source_url', () => {
  const listing = { booking_url: 'https://example.com/book' };
  const offer = { affiliate_supported: false };
  assert.equal(CmsCore.buildStay22Link(listing, offer, {}), 'https://example.com/book');
});

test('buildStay22Link returns fallback for unsupported provider', () => {
  const listing = { name: 'Test', slug: 'test', location_name: 'Kampala' };
  const offer = { affiliate_supported: true, stay22_provider: 'mystery', source_url: 'https://example.com/deal' };
  assert.equal(CmsCore.buildStay22Link(listing, offer, {}), 'https://example.com/deal');
});

test('buildStay22Link builds affiliate URL for supported provider', () => {
  const listing = { name: 'Sanctuary Gorilla Forest Camp', slug: 'sanctuary', location_name: 'Bwindi', property_type: 'Safari lodge' };
  const offer = { affiliate_supported: true, stay22_provider: 'booking', source_url: 'https://booking.example/stay' };
  const search = { checkin: '2026-11-10', checkout: '2026-11-12', adults: 2, children: '', rooms: 2 };
  const url = CmsCore.buildStay22Link(listing, offer, search, 'aid-test');

  assert.ok(url.startsWith('https://www.stay22.com/allez/booking?'));
  assert.ok(url.includes('aid=aid-test'));
  assert.ok(url.includes('campaign=accommodation_sanctuary'));
  assert.ok(url.includes('link=https%3A%2F%2Fbooking.example%2Fstay'));
  assert.ok(url.includes('checkin=2026-11-10'));
  assert.ok(url.includes('checkout=2026-11-12'));
  assert.ok(url.includes('adults=2'));
  // Rooms should NOT be in the URL
  assert.equal(url.includes('rooms='), false);
});

test('buildStay22Link uses "roam" as default provider', () => {
  const listing = { slug: 'camp' };
  const offer = { affiliate_supported: true, stay22_provider: null, source_url: 'https://example.test/deal' };
  const url = CmsCore.buildStay22Link(listing, offer, {});
  assert.ok(url.includes('/allez/roam?'));
});

test('buildStay22Link uses default affiliate ID when none provided', () => {
  const listing = { name: 'Test', slug: 'test' };
  const offer = { affiliate_supported: true, stay22_provider: 'roam' };
  const url = CmsCore.buildStay22Link(listing, offer, {});
  assert.ok(url.includes('aid=6a809892f76b8b75f2a2e6a4'));
});

test('buildStay22Link uses "attraction" campaign when no property_type', () => {
  const listing = { name: 'Test Attraction', slug: 'test-attraction' };
  const offer = { affiliate_supported: true, stay22_provider: 'getyourguide', source_url: 'https://gyg.com/experience' };
  const url = CmsCore.buildStay22Link(listing, offer, {});
  assert.ok(url.includes('campaign=attraction_test-attraction'));
});

test('buildStay22Link omits address/hotelname when source_url present', () => {
  const listing = { name: 'Test', slug: 'test', location_name: 'Kampala' };
  const offer = { affiliate_supported: true, stay22_provider: 'booking', source_url: 'https://example.com/deal' };
  const url = CmsCore.buildStay22Link(listing, offer, {});
  assert.equal(url.includes('address='), false);
  assert.equal(url.includes('hotelname='), false);
  assert.ok(url.includes('link='));
});

test('buildStay22Link includes address when no source_url', () => {
  const listing = { name: 'Test', slug: 'test', location_name: 'Kampala, Uganda' };
  const offer = { affiliate_supported: true, stay22_provider: 'roam' };
  const url = CmsCore.buildStay22Link(listing, offer, {});
  assert.ok(url.includes('address=Kampala%2C%20Uganda'));
  assert.ok(url.includes('hotelname=Test'));
});

test('buildStay22Link returns # when all fallbacks fail', () => {
  const offer = { affiliate_supported: false };
  assert.equal(CmsCore.buildStay22Link({}, offer, {}), '#');
  assert.equal(CmsCore.buildStay22Link(null, offer, {}), '#');
  assert.equal(CmsCore.buildStay22Link(null, null, {}), '#');
});

test('buildSearchbarLink encodes address and omits empty params', () => {
  const url = CmsCore.buildSearchbarLink('Kigali, Rwanda', { adults: 2 }, 'aid-test');
  assert.ok(url.startsWith('https://www.stay22.com/allez/searchbar?'));
  assert.ok(url.includes('aid=aid-test'));
  assert.ok(url.includes('address=Kigali%2C%20Rwanda'));
  assert.ok(url.includes('campaign=searchbar'));
  assert.equal(url.includes('checkin='), false);
  assert.ok(url.includes('adults=2'));
});

// ── Stay22 vs direct disclosures ────────────────────────────────

test('offerRel includes sponsored for affiliate offers', () => {
  const offer = { affiliate_supported: true };
  assert.equal(CmsCore.offerRel(offer), 'nofollow sponsored noopener');
});

test('offerRel omits sponsored for direct offers', () => {
  const offer = { affiliate_supported: false };
  assert.equal(CmsCore.offerRel(offer), 'nofollow noopener');
});

test('offerDisclosure is empty for affiliate offers', () => {
  assert.equal(CmsCore.offerDisclosure({ affiliate_supported: true }), '');
});

test('offerDisclosure shows external-provider text for non-affiliate offers', () => {
  const result = CmsCore.offerDisclosure({ affiliate_supported: false });
  assert.ok(result.includes('External provider link'));
  assert.ok(result.includes('Trek Africa Guide does not process this booking'));
});

test('offerDisclosure handles null offer', () => {
  assert.equal(CmsCore.offerDisclosure(null), '');
});

// ── Internal detail URLs ─────────────────────────────────────────

test('internalUrl returns route root for known resources', () => {
  assert.equal(CmsCore.internalUrl('regions', null), '/regions');
  assert.equal(CmsCore.internalUrl('countries', null), '/countries');
  assert.equal(CmsCore.internalUrl('attractions', null), '/attractions');
  assert.equal(CmsCore.internalUrl('accommodations', null), '/accommodations');
  assert.equal(CmsCore.internalUrl('restaurants', null), '/restaurants');
});

test('internalUrl appends slug for known resources', () => {
  assert.equal(CmsCore.internalUrl('attractions', 'bwindi-park'), '/attractions/bwindi-park');
  assert.equal(CmsCore.internalUrl('restaurants', 'savannah-kitchen'), '/restaurants/savannah-kitchen');
});

test('internalUrl returns null for unknown resources', () => {
  assert.equal(CmsCore.internalUrl('unknown', null), null);
  assert.equal(CmsCore.internalUrl('page_sections', 'home'), null);
});

// ── SEO metadata construction ───────────────────────────────────

test('buildSeoMeta uses meta_title fallback to name', () => {
  const listing = { name: 'Test Attraction', listing_summary: 'A summary' };
  const meta = CmsCore.buildSeoMeta(listing, (l) => '/attractions/' + l.slug);
  assert.equal(meta.og_title, 'Test Attraction');
});

test('buildSeoMeta prefers meta_title over name', () => {
  const listing = { name: 'Test', meta_title: 'Custom SEO Title', listing_summary: 'A summary' };
  const meta = CmsCore.buildSeoMeta(listing, (l) => '/attractions/' + l.slug);
  assert.equal(meta.og_title, 'Custom SEO Title');
});

test('buildSeoMeta uses meta_description fallback to listing_summary', () => {
  const listing = { name: 'Test', listing_summary: 'Fallback summary' };
  const meta = CmsCore.buildSeoMeta(listing);
  assert.equal(meta.og_description, 'Fallback summary');
});

test('buildSeoMeta prefers meta_description over listing_summary', () => {
  const listing = { name: 'Test', listing_summary: 'Fallback', meta_description: 'Custom description' };
  const meta = CmsCore.buildSeoMeta(listing);
  assert.equal(meta.og_description, 'Custom description');
});

test('buildSeoMeta uses meta_image_url fallback to heroMedia.url', () => {
  const listing = {
    meta_image_url: null,
    heroMedia: { url: 'https://example.com/hero.jpg' },
  };
  const meta = CmsCore.buildSeoMeta(listing);
  assert.equal(meta.meta_image, 'https://example.com/hero.jpg');
});

test('buildSeoMeta returns null meta_image when neither available', () => {
  const listing = { name: 'Test' };
  const meta = CmsCore.buildSeoMeta(listing);
  assert.equal(meta.meta_image, null);
});

test('buildSeoMeta builds canonical via routeFn', () => {
  const listing = { slug: 'test-attraction', name: 'Test' };
  const meta = CmsCore.buildSeoMeta(listing, (l) => '/attractions/' + l.slug);
  assert.equal(meta.canonical, '/attractions/test-attraction');
});

// ── Media attribution ───────────────────────────────────────────

test('mediaAttribution returns null for null heroMedia', () => {
  assert.equal(CmsCore.mediaAttribution(null), null);
});

test('hasValidAttribution returns false when fields missing', () => {
  assert.equal(CmsCore.hasValidAttribution(null), false);
  assert.equal(CmsCore.hasValidAttribution({ creator: 'Test', license: 'CC BY' }), false);
  assert.equal(CmsCore.hasValidAttribution({ creator: '', license: '', source_page: '' }), false);
});

test('hasValidAttribution returns true when all fields present', () => {
  const media = {
    creator: 'Thomas Fuhrmann',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    source_page: 'https://commons.wikimedia.org/wiki/File:test.jpg',
  };
  assert.equal(CmsCore.hasValidAttribution(media), true);
});

test('mediaAttribution normalizes fields', () => {
  const media = {
    creator: 'Test Photographer',
    license: 'CC0 1.0',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source_page: 'https://example.com/test',
  };
  const a = CmsCore.mediaAttribution(media);
  assert.equal(a.creator, 'Test Photographer');
  assert.equal(a.license, 'CC0 1.0');
  assert.equal(a.source_page, 'https://example.com/test');
});

// ── Relationship normalization ────────────────────────────────────

test('normalizeList handles arrays', () => {
  assert.deepEqual(CmsCore.normalizeList(['a', 'b', null, 'c']), ['a', 'b', 'c']);
});

test('normalizeList handles JSON strings', () => {
  assert.deepEqual(CmsCore.normalizeList('["a","b","c"]'), ['a', 'b', 'c']);
});

test('normalizeList handles newline-delimited strings', () => {
  assert.deepEqual(CmsCore.normalizeList('a\nb\nc'), ['a', 'b', 'c']);
});

test('normalizeList handles null and undefined', () => {
  assert.deepEqual(CmsCore.normalizeList(null), []);
  assert.deepEqual(CmsCore.normalizeList(undefined), []);
  assert.deepEqual(CmsCore.normalizeList(''), []);
});

test('lines is an alias for normalizeList', () => {
  assert.deepEqual(CmsCore.lines('["x","y"]'), ['x', 'y']);
  assert.deepEqual(CmsCore.lines(''), []);
});

test('relationshipKey extracts id from number, string, or object', () => {
  assert.equal(CmsCore.relationshipKey({ attraction_id: 5 }, 'attraction_id'), 5);
  assert.equal(CmsCore.relationshipKey({ attraction_id: '5' }, 'attraction_id'), '5');
  assert.equal(CmsCore.relationshipKey({ attraction: { id: 7 } }, 'attraction'), 7);
  assert.equal(CmsCore.relationshipKey({ attraction: null }, 'attraction'), null);
  assert.equal(CmsCore.relationshipKey({}, 'attraction_id'), null);
  assert.equal(CmsCore.relationshipKey(null, 'attraction_id'), null);
});

// ── Search ribbon ───────────────────────────────────────────────────

test('searchRibbon returns mode and query with empty suggestions for no match', () => {
  const result = CmsCore.searchRibbon('attractions', { q: 'xyznomatch' }, {});
  assert.equal(result.mode, 'attractions');
  assert.equal(result.query, 'xyznomatch');
  assert.equal(result.suggestions.length, 0);
});

test('searchRibbon returns suggestions for matching records', () => {
  const tables = {
    countries: [
      { name: 'Kenya', slug: 'kenya' },
      { name: 'Tanzania', slug: 'tanzania' },
    ],
    attractions: [
      { name: 'Maasai Mara', slug: 'maasai-mara' },
    ],
  };
  const result = CmsCore.searchRibbon('attractions', { q: 'ken' }, tables);
  assert.equal(result.mode, 'attractions');
  assert.equal(result.query, 'ken');
  assert.ok(result.suggestions.length > 0);
  const labels = result.suggestions.map((s) => s.label);
  assert.ok(labels.includes('Kenya'));
});

test('searchRibbon handles null context gracefully', () => {
  const result = CmsCore.searchRibbon('countries', null, { countries: [{ name: 'Uganda', slug: 'uganda' }] });
  assert.equal(result.mode, 'countries');
  assert.equal(result.query, '');
});

// ── Integration: full listing card flow ───────────────────────────

test('full offer flow: affiliate offer produces fresh price and stay22 link', () => {
  const listing = {
    name: 'Bwindi Lodge',
    slug: 'bwindi-lodge',
    property_type: 'Lodge',
    location_name: 'Bwindi Impenetrable National Park',
  };
  const recent = new Date(Date.now() - 5 * 86400000).toISOString();
  const offer = {
    affiliate_supported: true,
    stay22_provider: 'booking',
    source_url: 'https://booking.example/lodge',
    price_amount: 450,
    price_currency: 'USD',
    price_unit: 'night',
    price_basis: 'per night',
    price_checked_at: recent,
    active: true,
  };

  assert.equal(CmsCore.isOfferFresh(offer), true);
  assert.equal(CmsCore.offerPriceLabel(offer, 'accommodation'), 'From $450 per night');
  assert.equal(CmsCore.offerRel(offer), 'nofollow sponsored noopener');
  assert.equal(CmsCore.offerDisclosure(offer), '');

  const url = CmsCore.buildStay22Link(listing, offer, { checkin: '2026-11-10', checkout: '2026-11-12', adults: 2 }, 'aid-test');
  assert.ok(url.includes('aid=aid-test'));
  assert.ok(url.includes('/allez/booking?'));
  assert.ok(url.includes('campaign=accommodation_bwindi-lodge'));
});

test('full offer flow: direct offer produces fallback price and direct URL', () => {
  const listing = { name: 'Local Restaurant', slug: 'local-restaurant', property_type: 'Restaurant' };
  const offer = {
    affiliate_supported: false,
    source_url: 'https://restaurant.example/reserve',
    price_amount: null,
    price_checked_at: null,
  };

  assert.equal(CmsCore.isOfferFresh(offer), false);
  assert.equal(CmsCore.offerPriceLabel(offer, 'restaurant'), 'Check menu and reservation details');
  assert.equal(CmsCore.offerRel(offer), 'nofollow noopener');
  assert.ok(CmsCore.offerDisclosure(offer).includes('External provider link'));
  assert.equal(CmsCore.buildStay22Link(listing, offer, {}), 'https://restaurant.example/reserve');
});
