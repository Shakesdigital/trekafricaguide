// Tests for booking-options.mjs — external booking provider resolution.
// Run: node --test tests/node/booking-options.test.mjs
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveBookingOptions,
  hasBookingOptions,
  getPrimaryBookingOption,
  buildBookingLink,
  buildSearchbarUrl,
  PROVIDER_DISPLAY,
  SUPPORTED_PROVIDERS,
} from '../../src/lib/booking-options.mjs';

// ── Fixtures ────────────────────────────────────────────────────────────────────

const STAY22_ENTITY = {
  slug: 'governors-camp',
  name: 'Governors Camp',
  location_name: 'Queen Elizabeth National Park, Uganda',
  bookingOffers: [
    {
      provider: 'stay22',
      label: 'Governors Camp on Booking.com',
      source_url: 'https://www.booking.com/hotel/ug/governors-camp.html',
      stay22_provider: 'booking',
      affiliate_supported: true,
      price_amount: null,
      price_currency: null,
      price_unit: null,
      price_basis: null,
      price_checked_at: null,
    },
  ],
};

const DIRECT_ENTITY = {
  slug: 'sanctuary-gorilla-forest-camp',
  name: 'Sanctuary Gorilla Forest Camp',
  location_name: 'Bwindi, Uganda',
  bookingOffers: [
    {
      provider: 'booking',
      label: 'Sanctuary Gorilla Forest Camp',
      source_url: 'https://www.booking.com/hotel/ug/sanctuary-gorilla-forest-camp.html',
      stay22_provider: null,
      affiliate_supported: false,
      price_amount: null,
      price_currency: null,
      price_unit: null,
      price_basis: null,
      price_checked_at: '2026-09-15T00:00:00Z',
    },
  ],
};

const MULTI_ENTITY = {
  slug: 'bwindi-impenetrable-national-park',
  name: 'Bwindi Impenetrable National Park',
  location_name: 'Southwest Uganda',
  type: 'attraction',
  bookingOffers: [
    {
      provider: 'stay22',
      label: 'Hotels near Bwindi',
      source_url: null,
      stay22_provider: 'booking',
      affiliate_supported: true,
      price_amount: null,
      price_currency: null,
      price_unit: null,
      price_basis: null,
      price_checked_at: '2026-10-01T00:00:00Z',
    },
    {
      provider: 'getyourguide',
      label: 'Bwindi Gorilla Trekking Tour',
      source_url: 'https://www.getyourguide.com/bwindi-l2-gorilla-trekking-tour',
      stay22_provider: null,
      affiliate_supported: false,
      price_amount: 500,
      price_currency: 'USD',
      price_unit: 'person',
      price_basis: 'per person',
      price_checked_at: '2026-10-01T00:00:00Z',
    },
  ],
};

const NO_OFFERS_ENTITY = {
  slug: 'ol-tukai-lodge-amboseli',
  name: 'Ol Tukai Lodge',
  location_name: 'Amboseli, Kenya',
  bookingOffers: [],
};

const NULL_OFFERS_ENTITY = {
  slug: 'riad-rosemary',
  name: 'Riad Rosemary',
  location_name: 'Marrakech, Morocco',
  bookingOffers: null,
};

// ── resolveBookingOptions ───────────────────────────────────────────────────────

describe('resolveBookingOptions', () => {
  test('returns array from entity with booking offers', () => {
    const opts = resolveBookingOptions(STAY22_ENTITY);
    assert.ok(Array.isArray(opts));
    assert.ok(opts.length > 0);
  });

  test('returns empty array for entity without booking offers', () => {
    assert.equal(resolveBookingOptions(NO_OFFERS_ENTITY).length, 0);
  });

  test('returns empty array for entity with null booking offers', () => {
    assert.equal(resolveBookingOptions(NULL_OFFERS_ENTITY).length, 0);
  });

  test('returns empty array for null/undefined entity', () => {
    assert.equal(resolveBookingOptions(null).length, 0);
    assert.equal(resolveBookingOptions(undefined).length, 0);
  });

  test('returns empty array for empty object entity', () => {
    assert.equal(resolveBookingOptions({}).length, 0);
  });

  test('maps Stay22 offers to offerPresentation output with booking provider', () => {
    const opts = resolveBookingOptions(STAY22_ENTITY);
    // Stay22 offers resolve provider from stay22_provider field (e.g., 'booking')
    const stay22Opt = opts.find((o) => o.provider === 'booking');
    assert.ok(stay22Opt, 'expected an option with provider booking');
    assert.ok(stay22Opt.href);
    assert.ok(stay22Opt.rel.includes('nofollow'));
    assert.ok(stay22Opt.rel.includes('sponsored'));
    assert.ok(stay22Opt.rel.includes('noopener'));
    assert.equal(stay22Opt.disclosure, 'Trek Africa Guide does not take payment on this page. Check current details on the provider site.');
  });

  test('maps direct provider offers to direct source_url', () => {
    const opts = resolveBookingOptions(DIRECT_ENTITY);
    const directOpt = opts.find((o) => o.provider === 'booking');
    assert.ok(directOpt);
    assert.ok(directOpt.href);
    assert.ok(directOpt.href.startsWith('https://www.booking.com'));
    assert.equal(directOpt.label, 'Sanctuary Gorilla Forest Camp');
  });

  test('handles multiple booking offers', () => {
    const opts = resolveBookingOptions(MULTI_ENTITY);
    assert.equal(opts.length, 2);
  });

  test('includes price labels when price data present', () => {
    const opts = resolveBookingOptions(MULTI_ENTITY);
    const gygOpt = opts.find((o) => o.provider === 'getyourguide');
    assert.ok(gygOpt);
    // priceLabel formats as "From $X per unit"
    assert.ok(gygOpt.priceLabel);
    assert.ok(gygOpt.priceLabel.includes('500'));
    assert.ok(gygOpt.priceLabel.includes('per person'));
  });
});

// ── hasBookingOptions ───────────────────────────────────────────────────────────

describe('hasBookingOptions', () => {
  test('returns true for entity with offers', () => {
    assert.equal(hasBookingOptions(STAY22_ENTITY), true);
  });

  test('returns false for entity without offers', () => {
    assert.equal(hasBookingOptions(NO_OFFERS_ENTITY), false);
  });

  test('returns false for null/undefined entity', () => {
    assert.equal(hasBookingOptions(null), false);
    assert.equal(hasBookingOptions(undefined), false);
  });
});

// ── getPrimaryBookingOption ─────────────────────────────────────────────────────

describe('getPrimaryBookingOption', () => {
  test('returns first option for entity with offers', () => {
    const opt = getPrimaryBookingOption(STAY22_ENTITY);
    assert.ok(opt);
    assert.equal(opt.label, 'Governors Camp on Booking.com');
  });

  test('returns null for entity without offers', () => {
    assert.equal(getPrimaryBookingOption(NO_OFFERS_ENTITY), null);
  });

  test('returns null for null/undefined entity', () => {
    assert.equal(getPrimaryBookingOption(null), null);
    assert.equal(getPrimaryBookingOption(undefined), null);
  });
});

// ── buildBookingLink ────────────────────────────────────────────────────────────

describe('buildBookingLink', () => {
  test('builds link from primary Stay22 offer', () => {
    const link = buildBookingLink(STAY22_ENTITY);
    assert.ok(link);
    assert.ok(link.href);
    assert.equal(link.label, 'Governors Camp on Booking.com');
  });

  test('builds link from primary direct offer', () => {
    const link = buildBookingLink(DIRECT_ENTITY);
    assert.ok(link);
    assert.equal(link.isExternal, true);
  });

  test('returns null for entity without name or location', () => {
    const entity = { slug: 'test' };
    assert.equal(buildBookingLink(entity), null);
  });

  test('falls back to search when entity has no offers but has location', () => {
    const link = buildBookingLink(NO_OFFERS_ENTITY);
    assert.ok(link);
    assert.ok(link.href);
    assert.equal(link.label, 'Search on Stay22');
  });
});

// ── buildSearchbarUrl ──────────────────────────────────────────────────────────

describe('buildSearchbarUrl', () => {
  test('builds Stay22 searchbar URL from location_name', () => {
    const url = buildSearchbarUrl(STAY22_ENTITY);
    assert.ok(url);
    assert.ok(url.includes('stay22.com'));
    assert.ok(url.includes('searchbar'));
  });

  test('builds searchbar URL using name when location_name missing', () => {
    const entity = { name: 'Test Lodge', location_name: null };
    const url = buildSearchbarUrl(entity);
    assert.ok(url);
    assert.ok(url.includes('Test'));
  });

  test('returns null for entity without name or location_name', () => {
    const url = buildSearchbarUrl({ slug: 'test' });
    assert.equal(url, null);
  });

  test('includes search params when provided', () => {
    const url = buildSearchbarUrl(STAY22_ENTITY, {
      search: { checkin: '2026-12-01', adults: 2 },
    });
    assert.ok(url.includes('checkin=2026-12-01'));
    assert.ok(url.includes('adults=2'));
  });
});

// ── PROVIDER_DISPLAY ───────────────────────────────────────────────────────────

describe('PROVIDER_DISPLAY', () => {
  test('has display names for common providers', () => {
    assert.ok(PROVIDER_DISPLAY['booking']);
    assert.ok(PROVIDER_DISPLAY['expedia']);
    assert.ok(PROVIDER_DISPLAY['getyourguide']);
    assert.ok(PROVIDER_DISPLAY['tripadvisor']);
    assert.ok(PROVIDER_DISPLAY['kayak']);
  });

  test('display names are human-readable', () => {
    assert.equal(PROVIDER_DISPLAY['booking'], 'Booking.com');
    assert.equal(PROVIDER_DISPLAY['getyourguide'], 'GetYourGuide');
    assert.equal(PROVIDER_DISPLAY['expedia'], 'Expedia');
  });
});

// ── SUPPORTED_PROVIDERS ────────────────────────────────────────────────────────

describe('SUPPORTED_PROVIDERS', () => {
  test('is a Set of supported provider names', () => {
    assert.ok(typeof SUPPORTED_PROVIDERS.has === 'function');
    assert.ok(SUPPORTED_PROVIDERS.size > 0);
  });

  test('includes key providers', () => {
    assert.ok(SUPPORTED_PROVIDERS.has('booking'));
    assert.ok(SUPPORTED_PROVIDERS.has('getyourguide'));
    assert.ok(SUPPORTED_PROVIDERS.has('roam'));
    assert.ok(SUPPORTED_PROVIDERS.has('tripadvisor'));
  });
});
