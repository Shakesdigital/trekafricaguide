// src/lib/images.mjs — Media resolution and accessible fallback selection.
// Maps image-slot keys and slug to deterministic stock paths,
// and resolves media assets for entities.

export const STOCK_FALLBACK_PREFIX = '/images/stock/destinations/';

// Canonical slot → slug map (must match Blade image-slot partial and cms-core.js).
export const SLOT_MAP = {
  'home-hero-east-africa': 'maasai-mara',
  'home-hero-west-africa': 'cape-coast-kakum',
  'home-hero-southern-africa': 'namib-desert',
  'home-hero-northern-africa': 'marrakech-and-atlas',
  'home-hero-central-africa': 'odzala-kokoua-national-park',
  'home-intro-africa-map': 'okavango-delta',
  'regions-index-hero': 'serengeti-national-park',
  'destinations-index-hero': 'cape-town',
  'attractions-index-hero': 'maasai-mara',
  'accommodations-index-hero': 'maasai-mara',
  'contact-hero': 'bwindi-impenetrable-national-park',
  'region-east-africa': 'serengeti-national-park',
  'region-west-africa': 'sine-saloum-delta',
  'region-southern-africa': 'namib-desert',
  'region-northern-africa': 'marrakech-and-atlas',
  'region-central-africa': 'odzala-kokoua-national-park',
};

// Country slug → stock destination slug
const COUNTRY_DESTINATIONS = {
  'uganda': 'bwindi-impenetrable-national-park',
  'kenya': 'maasai-mara',
  'tanzania': 'serengeti-national-park',
  'rwanda': 'volcanoes-national-park',
  'ethiopia': 'lalibela',
  'mauritius': 'black-river-gorges',
  'seychelles': 'vallee-de-mai',
  'ghana': 'cape-coast-kakum',
  'senegal': 'sine-saloum-delta',
  'benin': 'ouidah-and-ganvie',
  'sierra-leone': 'tokeh-and-river-no2',
  'cabo-verde': 'sal-island',
  'nigeria': 'lagos-and-lekki',
  'the-gambia': 'river-gambia-national-park',
  'cote-divoire': 'grand-bassam',
  'south-africa': 'cape-town',
  'botswana': 'okavango-delta',
  'namibia': 'namib-desert',
  'zimbabwe': 'victoria-falls',
  'zambia': 'south-luangwa',
  'mozambique': 'bazaruto-archipelago',
  'morocco': 'marrakech-and-atlas',
  'egypt': 'cairo-and-giza',
  'tunisia': 'tunis-and-sidi-bou-said',
  'algeria': 'djanet-and-tassili',
  'sao-tome-and-principe': 'obo-natural-park',
  'cameroon': 'mount-cameroon',
  'gabon': 'loango-national-park',
  'republic-of-the-congo': 'odzala-kokoua-national-park',
};

/**
 * Resolve an image value into a concrete URL.
 * - "image-slot:KEY" → maps via SLOT_MAP to a stock path
 * - Otherwise returns the value unchanged (a real URL).
 * @param {string|null|undefined} image
 * @returns {string|null|undefined}
 */
export function resolveImage(image) {
  if (!image || !image.startsWith('image-slot:')) return image;
  const key = image.replace('image-slot:', '');
  let slug = SLOT_MAP[key];

  if (!slug) {
    // Check country-* prefix using the country destination map
    if (key.startsWith('country-')) {
      const countrySlug = key.slice('country-'.length);
      slug = COUNTRY_DESTINATIONS[countrySlug];
    }
    // Check attraction- and stay- prefixes
    if (!slug && (key.startsWith('attraction-') || key.startsWith('stay-'))) {
      slug = key.replace(/^(attraction|stay)-/, '');
    }
    // Last resort: use key directly
    if (!slug) {
      slug = key;
    }
  }

  return STOCK_FALLBACK_PREFIX + slug + '.jpg';
}

/**
 * Pick the hero image for a listing following the priority:
 *   1. hero_image_url
 *   2. image-slot:KEY resolution
 *   3. first gallery image
 *   4. null (no fallback)
 * @param {Object|null} listing
 * @returns {string|null}
 */
export function pickHero(listing) {
  if (!listing) return null;
  if (listing.hero_image_url) return listing.hero_image_url;
  if (listing.image_slot) return resolveImage(listing.image_slot);
  if (listing.gallery && listing.gallery.length) return listing.gallery[0];
  return null;
}

/**
 * Build a gallery list from a listing.
 *   1. gallery array
 *   2. fallback to hero image
 * @param {Object|null} listing
 * @returns {Array<string>}
 */
export function pickGallery(listing) {
  if (!listing) return [];
  const items = normalizeList(listing.gallery);
  if (!items.length && listing.hero_image_url) items.push(listing.hero_image_url);
  if (!items.length && listing.image_slot) items.push(resolveImage(listing.image_slot));
  return items;
}

/**
 * Normalize a value into a string array.
 * @param {*} value
 * @returns {Array<string>}
 */
export function normalizeList(value) {
  return lines(value);
}

/**
 * Normalize a value into a string array.
 * @param {*} value
 * @returns {Array<string>}
 */
export function lines(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [];
    } catch (e) {
      return value.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/**
 * Resolve media asset metadata for an entity.
 * Returns the hero (role === 'hero') media asset if available, otherwise
 * derives attribution from any existing media asset.
 * @param {Array} mediaAssets - filtered media assets for this entity
 * @returns {Object|null}
 */
export function resolveHeroMedia(mediaAssets) {
  if (!mediaAssets || mediaAssets.length === 0) return null;
  const hero = mediaAssets.find((m) => m.role === 'hero' || !m.role);
  if (!hero) return null;

  return {
    creator: hero.creator || '',
    license: hero.license || '',
    license_url: hero.license_url || '',
    source_page: hero.source_page || '',
    alt_text: hero.alt_text || '',
  };
}
