// Booking Options — resolve external booking links for Trek Africa Guide entities.
// Preserves the existing Stay22 affiliate integration. All external links are
// validated through safeExternalUrl (rejects non-http(s) schemes).

import { bookingPresentations, DEFAULT_AFFILIATE_ID, SUPPORTED_PROVIDERS } from './booking.mjs';

// ── Provider display names ──────────────────────────────────────────────────────

const PROVIDER_DISPLAY = {
  booking: 'Booking.com',
  expedia: 'Expedia',
  hotelscom: 'Hotels.com',
  vrbo: 'VRBO',
  agoda: 'Agoda',
  kayak: 'Kayak',
  getyourguide: 'GetYourGuide',
  roam: 'Roam',
  searchbar: 'Search',
};

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Resolve all available booking options for an entity (accommodation, attraction, activity).
 *
 * @param {object} entity - the CMS entity with bookingOffers array
 * @param {object} [options]
 * @param {string} [options.affiliateId] - Stay22 affiliate ID
 * @param {object} [options.search] - search params { checkin, checkout, adults, children }
 * @param {Date} [options.now] - for freshness check
 * @returns {Array<{href: string, label: string, provider: string, providerDisplay: string, priceLabel: string|null, isExternal: boolean, rel: string, disclosure: string}>}
 */
export function resolveBookingOptions(entity, options = {}) {
  if (!entity) return [];
  return bookingPresentations(entity, entity.bookingOffers || [], options).map((view) => ({
    ...view, isExternal: true,
  }));
}

/**
 * Check if an entity has any valid booking offers.
 */
export function hasBookingOptions(entity) {
  const options = resolveBookingOptions(entity);
  return options.length > 0;
}

/**
 * Get the best (first) booking option for an entity.
 */
export function getPrimaryBookingOption(entity, options = {}) {
  const opts = resolveBookingOptions(entity, options);
  return opts.length > 0 ? opts[0] : null;
}

/**
 * Build a "Book Now" link object suitable for rendering in the Trip Board.
 * Exact listings never fall back to a destination search.
 *
 * @param {object} entity
 * @param {object} [options]
 */
export function buildBookingLink(entity, options = {}) {
  const existing = getPrimaryBookingOption(entity, options);
  if (existing) {
    return {
      href: existing.href,
      label: existing.label,
      isExternal: true,
      disclosure: existing.disclosure,
      rel: existing.rel,
      priceLabel: existing.priceLabel,
    };
  }

  if (entity?.slug && (entity?.property_type || ['activities', 'attractions', 'accommodations'].includes(entity?.routeFamily))) return null;

  // Destination searches remain explicitly labelled as searches.
  const fallbackUrl = buildSearchbarUrl(entity, options);
  if (fallbackUrl) {
    return {
      href: fallbackUrl,
      label: 'Search on Stay22',
      isExternal: true,
      rel: 'nofollow sponsored noopener',
      priceLabel: null,
    };
  }

  return null;
}

/**
 * Build a Stay22 searchbar URL for an entity based on its location.
 */
export function buildSearchbarUrl(entity, options = {}) {
  if (!entity) return null;

  const address = entity.location_name || entity.name;
  if (!address) return null;

  // We need to replicate the searchbar logic from booking.mjs but that function
  // requires a listing model; instead we build the URL directly
  // Using the same pattern as Stay22LinkBuilder::searchbar
  const params = new URLSearchParams({
    aid: options.affiliateId || DEFAULT_AFFILIATE_ID,
    address,
    campaign: 'searchbar',
  });

  const search = options.search || {};
  for (const key of ['checkin', 'checkout', 'adults', 'children']) {
    if (search[key] !== undefined && search[key] !== null && search[key] !== '' && search[key] !== 0) {
      params.set(key, String(search[key]));
    }
  }

  return `https://www.stay22.com/allez/searchbar?${params.toString()}`;
}

export { PROVIDER_DISPLAY, SUPPORTED_PROVIDERS };
