const DEFAULT_AFFILIATE_ID = '6a809892f76b8b75f2a2e6a4';
const DEFAULT_MAX_AGE_DAYS = 90;
const SUPPORTED_PROVIDERS = new Set([
  'booking',
  'expedia',
  'hotelscom',
  'vrbo',
  'agoda',
  'tripadvisor',
  'kayak',
  'getyourguide',
  'roam',
  'searchbar',
]);

const PRICE_SYMBOLS = {
  USD: '$',
  EUR: 'EUR ',
  GBP: 'GBP ',
  ZAR: 'R',
  UGX: 'UGX ',
};

export function safeExternalUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(String(value));
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isOfferFresh(offer, now = new Date(), maxAgeDays = DEFAULT_MAX_AGE_DAYS) {
  if (!offer) return false;
  if (offer.price_amount == null || !offer.price_currency || !offer.price_unit || !offer.price_basis || !offer.price_checked_at) {
    return false;
  }
  const checked = Date.parse(offer.price_checked_at);
  if (!Number.isFinite(checked)) return false;
  const current = now instanceof Date ? now.getTime() : Number(now);
  const ageMs = current - checked;
  return ageMs >= 0 && ageMs <= maxAgeDays * 86400000;
}

export function buildStay22Url({ listing, offer, search = {}, affiliateId } = {}) {
  const sourceUrl = safeExternalUrl(offer?.source_url);
  const fallback = sourceUrl || safeExternalUrl(listing?.booking_url);
  if (!offer) return fallback;

  const provider = String(offer.stay22_provider || 'roam').toLowerCase();
  if (!SUPPORTED_PROVIDERS.has(provider)) return fallback;

  const params = {
    aid: affiliateId || DEFAULT_AFFILIATE_ID,
    hotelname: listing?.name || '',
    campaign: `${listing?.property_type ? 'accommodation' : 'attraction'}_${listing?.slug || ''}`,
  };

  if (listing?.location_name) params.address = listing.location_name;

  if (fallback) {
    params.link = fallback;
    delete params.address;
    delete params.hotelname;
  }

  for (const key of ['checkin', 'checkout', 'adults', 'children']) {
    if (search[key] !== undefined && search[key] !== null && search[key] !== '' && search[key] !== 0) {
      params[key] = String(search[key]);
    }
  }

  const qs = new URLSearchParams(params);
  return `https://www.stay22.com/allez/${encodeURIComponent(provider)}?${qs.toString()}`;
}

export function offerPresentation({ listing, offer, search = {}, affiliateId, now = new Date() } = {}) {
  const href = buildStay22Url({ listing, offer, search, affiliateId });
  if (!href) return null;

  return {
    href,
    label: offer?.label || 'View details',
    priceLabel: priceLabel(offer, now),
    rel: offer?.affiliate_supported ? 'nofollow sponsored noopener' : 'nofollow noopener',
    target: '_blank',
    disclosure: 'Trek Africa Guide does not take payment on this page. Check current details on the provider site.',
    affiliateSupported: !!offer?.affiliate_supported,
  };
}

function priceLabel(offer, now) {
  if (!isOfferFresh(offer, now)) return 'Check current details on the provider site';
  const symbol = PRICE_SYMBOLS[offer.price_currency] || `${offer.price_currency} `;
  return `From ${symbol}${Number(offer.price_amount).toLocaleString()} per ${offer.price_unit}`;
}

export { DEFAULT_AFFILIATE_ID, DEFAULT_MAX_AGE_DAYS, SUPPORTED_PROVIDERS };
