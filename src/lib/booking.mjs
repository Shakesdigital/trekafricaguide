import destinations from '../../content/booking-destinations.json';
import { DEFAULT_AFFILIATE_ID } from '../config/site.mjs';
const DEFAULT_MAX_AGE_DAYS = 90;
const SUPPORTED_PROVIDERS = new Set([
  'booking',
  'expedia',
  'hotelscom',
  'vrbo',
  'agoda',
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

const PROVIDER_NAMES = { booking: 'Booking.com', expedia: 'Expedia', hotelscom: 'Hotels.com', agoda: 'Agoda', vrbo: 'Vrbo', kayak: 'Kayak', getyourguide: 'GetYourGuide' };

function listingFamily(listing) {
  return listing?.routeFamily || (listing?.property_type ? 'accommodations' : null)
    || Object.keys(destinations).find((family) => Object.hasOwn(destinations[family], listing?.slug || ''))
    || (listing?.attraction_id ? 'activities' : 'attractions');
}

export function bookingDestination(listing) {
  return destinations[listingFamily(listing)]?.[listing?.slug] || null;
}

function directProvider(value) {
  const safe = safeExternalUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  const host = url.hostname.toLowerCase();
  const isHost = (domain) => host === domain || host.endsWith('.' + domain);
  if (isHost('booking.com') && /^\/hotel\//.test(url.pathname)) return 'booking';
  if (isHost('getyourguide.com') && /-t\d+\/?$/.test(url.pathname)) return 'getyourguide';
  if (isHost('expedia.com') && /\.h\d+\.(?:Hotel-Information|Informacion-Hotel)/.test(url.pathname)) return 'expedia';
  if (isHost('hotels.com') && /\/ho\d+\//.test(url.pathname)) return 'hotelscom';
  if (isHost('agoda.com') && /\/hotel\//.test(url.pathname)) return 'agoda';
  if (isHost('vrbo.com') && /\d/.test(url.pathname)) return 'vrbo';
  return null;
}

export function affiliateExternalUrl(value) {
  const source = safeExternalUrl(value);
  if (!directProvider(source)) return source;
  return buildStay22Url({ offer: { source_url: source } });
}

export function buildStay22Url({ listing, offer, search = {}, affiliateId } = {}) {
  const selected = bookingDestination(listing);
  if (selected?.status === 'unavailable' || selected?.status === 'hold') return null;
  const source = safeExternalUrl(selected?.url || offer?.source_url || listing?.booking_url);
  const provider = directProvider(source);
  // Never disguise a destination search or an official supplier site as a bookable OTA product.
  if (!provider) return null;
  const family = listingFamily(listing);
  const params = new URLSearchParams({
    aid: affiliateId || DEFAULT_AFFILIATE_ID,
    link: source,
    roam: 'false',
    campaign: (family + '_' + (listing?.slug || 'listing')).replace(/-/g, '_'),
  });
  for (const key of ['checkin', 'checkout', 'adults', 'children', 'childrenAges']) {
    if (search[key] !== undefined && search[key] !== null && search[key] !== '' && search[key] !== 0) params.set(key, String(search[key]));
  }
  return 'https://www.stay22.com/allez/' + provider + '?' + params.toString();
}

export function offerPresentation({ listing, offer, search = {}, affiliateId, now = new Date() } = {}) {
  const href = buildStay22Url({ listing, offer, search, affiliateId });
  if (!href) return null;
  const selected = bookingDestination(listing);
  const provider = new URL(href).pathname.split('/').pop();
  const stay = listingFamily(listing) === 'accommodations';
  return {
    href,
    label: (stay ? 'Book a stay via ' : 'Book this activity via ') + PROVIDER_NAMES[provider],
    provider,
    providerDisplay: PROVIDER_NAMES[provider],
    title: selected?.title || listing?.name,
    operator: selected?.operator || null,
    notes: selected?.notes || null,
    reviewLabel: selected?.rating && selected?.review_count && Date.parse(selected.checked_at) <= Number(now) && Number(now) - Date.parse(selected.checked_at) < 90 * 86400000
      ? selected.rating + '/5 from ' + selected.review_count + ' reviews on ' + PROVIDER_NAMES[provider] + ' (checked ' + selected.checked_at + '). Ratings can change.'
      : null,
    priceLabel: selected ? 'Check live availability and prices' : priceLabel(offer, now),
    rel: 'nofollow sponsored noopener noreferrer',
    target: '_blank',
    disclosure: 'Affiliate link: Trek Africa Guide may earn a commission if you book through this link. Booking and payment take place on the provider site.',
    affiliateSupported: true,
  };
}

export function bookingPresentations(listing, offers = [], options = {}) {
  const selected = bookingDestination(listing);
  const candidates = selected ? [null] : (offers.length ? offers : [null]);
  const seen = new Set();
  return candidates.map((offer) => offerPresentation({ listing, offer, ...options })).filter((view) => {
    if (!view || seen.has(view.href)) return false;
    seen.add(view.href);
    return true;
  });
}

function priceLabel(offer, now) {
  if (!isOfferFresh(offer, now)) return 'Check current details on the provider site';
  const symbol = PRICE_SYMBOLS[offer.price_currency] || `${offer.price_currency} `;
  return `From ${symbol}${Number(offer.price_amount).toLocaleString()} per ${offer.price_unit}`;
}

export { DEFAULT_AFFILIATE_ID, DEFAULT_MAX_AGE_DAYS, SUPPORTED_PROVIDERS };
