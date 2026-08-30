/**
 * cms-core.js — Pure runtime rules shared between hosted CMS rendering and first-party Laravel views.
 *
 * No DOM or network access. Each function is a pure rule that both the static
 * site generator (cms-sync.js) and the server-rendered Blade views can mirror.
 * Loaded by <script type="module"> in cms.html and by a server-side harness.
 */
(function (globalThis) {
  'use strict';

  // ── Publication timing ──────────────────────────────────────────
  // A listing is publicly visible only when status is "published" and
  // (published_at is null OR published_at <= now). Mirrors HasPublicationState::scopePubliclyVisible.

  /** @param {{status:string, published_at:string|null}|null|undefined} record */
  function isVisible(record, now = Date.now()) {
    if (!record) return false;
    if (record.status !== 'published') return false;
    if (record.published_at == null) return true;
    return new Date(record.published_at).getTime() <= now;
  }

  /** @param {Array} records */
  function visibleRecords(records, now = Date.now()) {
    return (records || []).filter((r) => isVisible(r, now));
  }

  // ── Stock image fallback ────────────────────────────────────────
  // Maps image-slot keys and slug fallbacks to a deterministic stock path.
  // Mirrors the slotImages map in cms-sync.js and the seed mapping.

  var STOCK_FALLBACK_PREFIX = '/images/stock/destinations/';

  // Canonical slot → slug map (must match cms-sync.js slotImages).
  var SLOT_MAP = {
    'home-hero-east-africa': 'maasai-mara',
    'home-hero-west-africa': 'cape-coast-kakum',
    'home-hero-southern-africa': 'namib-desert',
    'home-hero-northern-africa': 'marrakech-and-atlas',
    'regions-index-hero': 'serengeti-national-park',
    'destinations-index-hero': 'cape-town',
    'attractions-index-hero': 'maasai-mara',
    'accommodations-index-hero': 'maasai-mara',
    'restaurants-index-hero': 'zanzibar',
    'region-east-africa': 'serengeti-national-park',
    'region-west-africa': 'sine-saloum-delta',
    'region-southern-africa': 'namib-desert',
    'region-northern-africa': 'marrakech-and-atlas',
    'region-central-africa': 'virunga-massif',
    'country-uganda': 'bwindi-impenetrable-national-park',
    'country-kenya': 'maasai-mara',
    'country-tanzania': 'serengeti-national-park',
    'country-rwanda': 'volcanoes-national-park',
    'country-ethiopia': 'lalibela',
    'country-ghana': 'cape-coast-kakum',
    'country-senegal': 'sine-saloum-delta',
    'country-benin': 'ouidah-and-ganvie',
    'country-sierra-leone': 'tokeh-and-river-no2',
    'country-cabo-verde': 'sal-island',
    'country-south-africa': 'cape-town',
    'country-botswana': 'okavango-delta',
    'country-namibia': 'namib-desert',
    'country-zimbabwe': 'victoria-falls',
    'country-zambia': 'south-luangwa',
    'country-morocco': 'marrakech-and-atlas',
    'country-egypt': 'cairo-and-giza',
    'country-tunisia': 'tunis-and-sidi-bou-said',
    'country-algeria': 'djanet-and-tassili',
  };

  var TYPE_PREFIXES = {
    attractions: 'attraction-',
    stays: 'stay-',
    restaurants: 'restaurant-',
  };

  /**
   * Resolve an image value into a concrete URL.
   * - "image-slot:KEY" → maps via SLOT_MAP to a stock path
   * - Otherwise returns the value unchanged (a real URL).
   */
  function resolveImage(image) {
    if (!image || !image.startsWith('image-slot:')) return image;
    var key = image.replace('image-slot:', '');
    var slug = SLOT_MAP[key];
    if (!slug) {
      slug = key.replace(/^(attraction|stay|restaurant)-/, '');
    }
    return STOCK_FALLBACK_PREFIX + slug + '.jpg';
  }

  /**
   * Pick the hero image for a listing:
   *  1. hero_image_url (CMS or uploaded)
   *  2. image-slot:KEY resolution (stock)
   *  3. null (no fallback)
   */
  function pickHero(listing) {
    if (!listing) return null;
    if (listing.hero_image_url) return listing.hero_image_url;
    if (listing.image_slot) return resolveImage(listing.image_slot);
    if (listing.gallery && listing.gallery.length) return listing.gallery[0];
    return null;
  }

  /**
   * Build a gallery list from a listing.
   *  1. gallery array
   *  2. fallback hero image
   */
  function pickGallery(listing) {
    if (!listing) return [];
    var items = normalizeList(listing.gallery);
    if (!items.length && listing.hero_image_url) items = [listing.hero_image_url];
    if (!items.length && listing.image_slot) items = [resolveImage(listing.image_slot)];
    return items;
  }

  // ── Offer freshness ─────────────────────────────────────────────
  // An offer is "fresh" when all price fields are present and price_checked_at
  // is within the max age (default 90 days). Mirrors the Blade freshness check.

  var DEFAULT_MAX_AGE_DAYS = 90;

  /** @param {{price_amount, price_currency, price_unit, price_checked_at, price_basis}|null} offer */
  function isOfferFresh(offer, now = Date.now(), maxAgeDays = DEFAULT_MAX_AGE_DAYS) {
    if (!offer) return false;
    if (offer.price_amount == null) return false;
    if (!offer.price_currency) return false;
    if (!offer.price_unit) return false;
    if (!offer.price_basis) return false;
    if (!offer.price_checked_at) return false;
    var checked = new Date(offer.price_checked_at).getTime();
    if (isNaN(checked)) return false;
    var ageMs = now - checked;
    return ageMs >= 0 && ageMs <= maxAgeDays * 86400000;
  }

  /** @returns {string|null} formatted price label or null when stale */
  function offerPriceLabel(offer, entityType) {
    var priceMap = { USD: '$', EUR: '€', GBP: '£', ZAR: 'R', UGX: 'UGX ' };
    if (isOfferFresh(offer)) {
      var symbol = priceMap[offer.price_currency] || offer.price_currency + ' ';
      return 'From ' + symbol + Number(offer.price_amount).toLocaleString() + ' per ' + offer.price_unit;
    }
    if (entityType === 'restaurant') return 'Check menu and reservation details';
    return 'Check live price';
  }

  // ── Stay22 link building ────────────────────────────────────────
  // Mirrors Stay22LinkBuilder::forOffer and ::searchbar.

  var SUPPORTED_PROVIDERS = ['booking', 'expedia', 'hotelscom', 'vrbo', 'agoda', 'tripadvisor', 'kayak', 'getyourguide', 'roam', 'searchbar'];

  function buildStay22Link(listing, offer, search, affiliateId) {
    var fallback = (offer && offer.source_url) || (listing && listing.booking_url) || '#';

    // Non-affiliate offers pass through directly.
    if (!offer || !offer.affiliate_supported) return fallback;

    var provider = (offer.stay22_provider || 'roam').toLowerCase();
    if (SUPPORTED_PROVIDERS.indexOf(provider) === -1) return fallback;

    var params = {
      aid: affiliateId || '6a809892f76b8b75f2a2e6a4',
      hotelname: (listing && listing.name) || '',
      campaign: (listing && listing.property_type ? 'accommodation' : 'attraction') + '_' + (listing && listing.slug ? listing.slug : ''),
    };
    if (listing && listing.location_name) params.address = listing.location_name;

    if (offer.source_url) {
      params.link = offer.source_url;
      delete params.address;
      delete params.hotelname;
    }

    // Rooms are never sent to Stay22. Children=0 and adults=0 are also omitted.
    var sentKeys = ['checkin', 'checkout', 'adults', 'children'];
    sentKeys.forEach(function (key) {
      if (search && search[key] !== undefined && search[key] !== null && search[key] !== '' && search[key] !== 0) {
        params[key] = String(search[key]);
      }
    });

    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');

    return 'https://www.stay22.com/allez/' + encodeURIComponent(provider) + '?' + qs;
  }

  function buildSearchbarLink(address, search, affiliateId) {
    var params = {
      aid: affiliateId || '6a809892f76b8b75f2a2e6a4',
      address: address,
      campaign: 'searchbar',
    };
    ['checkin', 'checkout', 'adults', 'children'].forEach(function (key) {
      if (search && search[key] !== undefined && search[key] !== null && search[key] !== '' && search[key] !== 0) params[key] = String(search[key]);
    });
    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    return 'https://www.stay22.com/allez/searchbar?' + qs;
  }

  // ── Disclosure rules ────────────────────────────────────────────
  // Affiliate offers get "nofollow sponsored noopener"; direct offers get "nofollow noopener".
  // Non-affiliate offers render an external-provider disclosure line.

  function offerRel(offer) {
    return offer && offer.affiliate_supported
      ? 'nofollow sponsored noopener'
      : 'nofollow noopener';
  }

  function offerDisclosure(offer) {
    if (!offer || offer.affiliate_supported) return '';
    return '<small>External provider link; Trek Africa Guide does not process this booking.</small>';
  }

  function offerTrustBadge(offer) {
    if (!offer || !offer.affiliate_supported) return 'External provider link; Trek Africa Guide does not process this booking.';
    return '';
  }

  // ── Internal detail URLs ────────────────────────────────────────
  // Mirrors the route() roots in cms-sync.js.

  var INTERNAL_ROUTES = {
    regions: '/regions',
    countries: '/countries',
    attractions: '/attractions',
    accommodations: '/accommodations',
    restaurants: '/restaurants',
  };

  function internalUrl(resourceName, slug) {
    var root = INTERNAL_ROUTES[resourceName];
    if (!root) return null;
    return slug ? root + '/' + slug : root;
  }

  // ── SEO metadata construction ───────────────────────────────────
  // Builds the og:title / og:description / og:image / canonical payload
  // with the same fallback chain as SiteController.

  function buildSeoMeta(listing, routeFn) {
    var title = (listing && (listing.meta_title || listing.name)) || '';
    var description = (listing && (listing.meta_description || listing.listing_summary)) || '';
    var image = (listing && (listing.meta_image_url || (listing.heroMedia && listing.heroMedia.url))) || null;
    var canonical = (listing && routeFn ? routeFn(listing) : '');

    return {
      canonical: canonical,
      og_title: title,
      og_description: description,
      meta_image: image,
    };
  }

  // ── Media attribution ───────────────────────────────────────────
  // Mirrors the media-credit block in detail Blade views.

  function mediaAttribution(heroMedia) {
    if (!heroMedia) return null;
    return {
      creator: heroMedia.creator || '',
      license: heroMedia.license || '',
      license_url: heroMedia.license_url || '',
      source_page: heroMedia.source_page || '',
    };
  }

  function hasValidAttribution(heroMedia) {
    var a = mediaAttribution(heroMedia);
    return !!(a && a.creator && a.license && a.source_page);
  }

  // ── Relationship normalization ──────────────────────────────────
  // Normalizes gallery / highlights / amenities / specialties from
  // either JSON strings or arrays into a plain string[].

  function normalizeList(value) {
    return lines(value);
  }

  function lines(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
      try {
        var parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        return [];
      } catch (e) {
        return value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      }
    }
    return [];
  }

  function relationshipKey(record, rel) {
    if (!record) return null;
    var r = record[rel];
    if (r == null) return null;
    if (typeof r === 'number') return r;
    if (typeof r === 'string') return r;
    if (typeof r === 'object' && r.id != null) return r.id;
    return null;
  }

  // ── Export ──────────────────────────────────────────────────────

  var CmsCore = {
    // Publication
    isVisible: isVisible,
    visibleRecords: visibleRecords,
    // Stock
    resolveImage: resolveImage,
    pickHero: pickHero,
    pickGallery: pickGallery,
    STOCK_FALLBACK_PREFIX: STOCK_FALLBACK_PREFIX,
    SLOT_MAP: SLOT_MAP,
    // Offers
    isOfferFresh: isOfferFresh,
    offerPriceLabel: offerPriceLabel,
    DEFAULT_MAX_AGE_DAYS: DEFAULT_MAX_AGE_DAYS,
    // Stay22
    buildStay22Link: buildStay22Link,
    buildSearchbarLink: buildSearchbarLink,
    SUPPORTED_PROVIDERS: SUPPORTED_PROVIDERS,
    // Disclosures
    offerRel: offerRel,
    offerDisclosure: offerDisclosure,
    offerTrustBadge: offerTrustBadge,
    // Internal URLs
    internalUrl: internalUrl,
    INTERNAL_ROUTES: INTERNAL_ROUTES,
    // SEO
    buildSeoMeta: buildSeoMeta,
    // Media
    mediaAttribution: mediaAttribution,
    hasValidAttribution: hasValidAttribution,
    // Relationship normalization
    normalizeList: normalizeList,
    lines: lines,
    relationshipKey: relationshipKey,
  };

  if (typeof globalThis !== 'undefined') {
    globalThis.CmsCore = CmsCore;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CmsCore;
  }

  if (typeof define === 'function' && define.amd) {
    define(CmsCore);
  }
})((typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this));
