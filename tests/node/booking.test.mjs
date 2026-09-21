import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildStay22Url,
  isOfferFresh,
  offerPresentation,
  safeExternalUrl,
} from '../../src/lib/booking.mjs';

test('provider URLs reject javascript and data schemes', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('data:text/html,test'), null);
  assert.equal(safeExternalUrl('https://www.booking.com/hotel/test'), 'https://www.booking.com/hotel/test');
});

test('supported booking offer is wrapped through Stay22', () => {
  const url = buildStay22Url({
    listing: { slug: 'test-stay', name: 'Test Stay', property_type: 'Lodge' },
    offer: { affiliate_supported: true, stay22_provider: 'booking', source_url: 'https://booking.com/test' },
    search: { checkin: '2026-11-10', checkout: '2026-11-12', adults: 2 },
    affiliateId: 'aid-test',
  });
  assert.match(url, /^https:\/\/www\.stay22\.com\/allez\/booking\?/);
  assert.match(url, /campaign=accommodation_test-stay/);
  assert.match(url, /link=https%3A%2F%2Fbooking\.com%2Ftest/);
});

test('unsupported affiliate provider falls back only to safe direct URL', () => {
  assert.equal(
    buildStay22Url({
      listing: { slug: 'test' },
      offer: { affiliate_supported: true, stay22_provider: 'unknown', source_url: 'https://example.com/deal' },
    }),
    'https://example.com/deal',
  );
  assert.equal(
    buildStay22Url({
      listing: { slug: 'test' },
      offer: { affiliate_supported: true, stay22_provider: 'unknown', source_url: 'javascript:alert(1)' },
    }),
    null,
  );
});

test('offerPresentation exposes fresh price, rel attributes, and safe URL', () => {
  const now = new Date('2026-09-21T12:00:00Z');
  const offer = {
    label: 'View stay',
    affiliate_supported: true,
    stay22_provider: 'booking',
    source_url: 'https://booking.example/stay',
    price_amount: 450,
    price_currency: 'USD',
    price_unit: 'night',
    price_basis: '2 adults',
    price_checked_at: '2026-09-01T00:00:00Z',
  };
  assert.equal(isOfferFresh(offer, now), true);
  const view = offerPresentation({
    listing: { slug: 'bwindi-lodge', name: 'Bwindi Lodge', property_type: 'Lodge' },
    offer,
    affiliateId: 'aid-test',
    now,
  });
  assert.equal(view.priceLabel, 'From $450 per night');
  assert.equal(view.rel, 'nofollow sponsored noopener');
  assert.equal(view.disclosure, 'Trek Africa Guide does not take payment on this page. Check current details on the provider site.');
  assert.match(view.href, /^https:\/\/www\.stay22\.com\/allez\/booking\?/);
});
