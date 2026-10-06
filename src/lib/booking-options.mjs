// Booking Options — resolve external booking links for Trek Africa Guide entities.
// Preserves the existing Stay22 affiliate integration. All external links are
// validated through safeExternalUrl (rejects non-http(s) schemes).

import { buildStay22Url, offerPresentation, safeExternalUrl, isOfferFresh, SUPPORTED_PROVIDERS } from './booking.mjs';

// ── Provider display names ──────────────────────────────────────────────────────

const PROVIDER_DISPLAY = {
  booking: 'Booking.com',
  expedia: 'Expedia',
  hotelscom: 'Hotels.com',
  vrbo: 'VRBO',
  agoda: 'Agoda',
  tripadvisor: 'TripAdvisor',
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
  const offers = entity.bookingOffers || [];
  if (!Array.isArray(offers) || offers.length === 0) {
    return [];
  }

  const { affiliateId, search = {}, now } = options;
  const result = [];

  for (const offer of offers) {
    // Use offerPresentation which handles Stay22 wrapping + safe URLs
    const presentation = offerPresentation({
      listing: toListing(entity),
      offer,
      search,
      affiliateId,
      now,
    });

    if (!presentation) continue;

    const provider = String(offer.stay22_provider || offer.provider || 'roam').toLowerCase();
    const isDirect = offer.affiliate_supported !== true;

    // If the offer is not affiliate-supported, use the direct source_url (if safe)
    let href = presentation.href;
    if (isDirect) {
      const directUrl = safeExternalUrl(offer.source_url);
      if (directUrl) {
        href = directUrl;
      }
    }

    result.push({
      href,
      label: presentation.label || offer.label || `View on ${PROVIDER_DISPLAY[provider] || provider}`,
      provider,
      providerDisplay: PROVIDER_DISPLAY[provider] || provider,
      priceLabel: presentation.priceLabel || null,
      isExternal: true,
      rel: presentation.rel || 'nofollow noopener',
      disclosure: presentation.disclosure,
      affiliateSupported: !!offer.affiliate_supported,
    });
  }

  return result;
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
 * Falls back to a Stay22 searchbar if no specific offer exists.
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

  // Fallback: Stay22 searchbar based on location_name
  const fallbackUrl = buildSearchbarUrl(entity, options);
  if (fallbackUrl) {
    return {
      href: fallbackUrl,
      label: 'Search on Stay22',
      isExternal: true,
      disclosure: 'Trek Africa Guide links to Stay22 for accommodation searches. You are leaving Trek Africa Guide.',
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
    aid: options.affiliateId || process.env.STAY22_AFFILIATE_ID || '',
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

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Convert a site-model entity to the shape expected by booking.mjs offerPresentation.
 */
function toListing(entity) {
  // Determine property_type from entity shape
  let propertyType = 'accommodation';
  if (entity.bookingOffers) propertyType = 'accommodation';
  // Could extend to detect 'attraction' or 'activity' but booking.mjs handles it

  return {
    slug: entity.slug || '',
    name: entity.name || entity.title || '',
    property_type: propertyType,
    location_name: entity.location_name || '',
    booking_url: entity.booking_url || null,
  };
}

export { PROVIDER_DISPLAY, SUPPORTED_PROVIDERS };
