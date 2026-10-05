// Media Engine: find free-licensed images and videos via Wikimedia Commons
// and Unsplash APIs. Stores full attribution metadata in media_assets.
// Only auto-stores media with permissive licenses (cc0, cc_by, cc_by_sa,
// royalty_free); restrictive licenses return reference-only.
import { AIError } from '../ai/errors.mjs';

// ── License definitions ────────────────────────────────────────────────────────

// Licenses that allow automatic local storage (copying media asset records).
export const STORABLE_LICENSES = new Set(['cc0', 'cc_by', 'cc_by_sa', 'royalty_free']);

// All valid license types (matches DB check constraint).
export const ALL_LICENSES = [
  'cc0', 'cc_by', 'cc_by_sa', 'cc_by_nd', 'cc_by_nc',
  'cc_by_nc_sa', 'cc_by_nc_nd', 'proprietary', 'royalty_free', 'rights_managed',
];

// Map Wikimedia license templates to our license types.
const WIKIMEDIA_LICENSE_MAP = {
  'cc0': 'cc0',
  'CC0': 'cc0',
  'Public domain': 'cc0',
  'PD': 'cc0',
  'CC BY 4.0': 'cc_by',
  'CC BY 3.0': 'cc_by',
  'CC BY-SA 4.0': 'cc_by_sa',
  'CC BY-SA 3.0': 'cc_by_sa',
  'CC BY 2.0': 'cc_by',
  'CC BY-SA 2.0': 'cc_by_sa',
  'CC BY-ND 4.0': 'cc_by_nd',
  'CC BY-ND 3.0': 'cc_by_nd',
  'CC BY-NC 4.0': 'cc_by_nc',
  'CC BY-NC 3.0': 'cc_by_nc',
  'CC BY-NC-SA 4.0': 'cc_by_nc_sa',
  'CC BY-NC-SA 3.0': 'cc_by_nc_sa',
  'CC BY-NC-ND 4.0': 'cc_by_nc_nd',
  'CC BY-NC-ND 3.0': 'cc_by_nc_nd',
};

// ── Wikimedia Commons search ──────────────────────────────────────────────────

const WIKIMEDIA_API_BASE = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'TrekAfricaGuide/1.0 (https://trekafricaguide.com; contact@trekafricaguide.com) - content opportunity engine';

/**
 * Search Wikimedia Commons for images/videos by keyword.
 *
 * @param {string} query - search term
 * @param {object} [options]
 * @param {number} [options.limit=20] - max results
 * @param {AbortSignal} [options.signal]
 * @param {Function} [options.fetchImpl=fetch] - for testing
 * @returns {Promise<Array>} array of media record objects (without entity association)
 */
export async function searchWikimediaCommons(query, { limit = 20, signal, fetchImpl = globalThis.fetch } = {}) {
  if (!query || !query.trim()) return [];

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: query + '',
    srnamespace: '6', // File namespace
    srlimit: String(limit),
    srinfo: 'url',
    srprop: 'timestamp',
  });

  const url = `${WIKIMEDIA_API_BASE}?${params.toString()}`;

  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw new AIError('CANCELLED');
    throw new AIError('PROVIDER_ERROR', { provider: 'wikimedia_commons', message: error.message });
  }

  if (!response.ok) {
    throw new AIError('PROVIDER_ERROR', {
      provider: 'wikimedia_commons',
      status: response.status,
      message: `Wikimedia API returned ${response.status}`,
    });
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new AIError('INVALID_RESPONSE', { provider: 'wikimedia_commons' });
  }

  const searchResults = data?.query?.search || [];
  const results = [];

  // Process search results — each is a page in the File namespace
  for (const item of searchResults) {
    if (signal?.aborted) throw new AIError('CANCELLED');

    // Extract filename from page title (e.g., "File:Example.jpg")
    const title = item.title;
    const filenameMatch = title.match(/^File:(.+)$/);
    if (!filenameMatch) continue;

    const filename = filenameMatch[1];

    // Parse license from page text (snippet/suggestion)
    // We need to fetch imageinfo for structured metadata
    const mediaRecord = await fetchWikimediaFileDetails(filename, { signal, fetchImpl });
    if (mediaRecord) results.push(mediaRecord);

    // Respect rate limits — small delay between requests
    if (results.length > 0) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  return results;
}

/**
 * Fetch structured file details (license, creator, URL) from Wikimedia API.
 * Returns null if the media has a non-permissive license.
 */
async function fetchWikimediaFileDetails(filename, { signal, fetchImpl = globalThis.fetch }) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: `File:${filename}`,
    prop: 'imageinfo',
    iiprop: 'url|metadata|extmetadata|canonicaltitle',
    iiurlwidth: '1200',
  });

  const url = `${WIKIMEDIA_API_BASE}?${params.toString()}`;

  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw new AIError('CANCELLED');
    return null;
  }

  if (!response.ok) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    return null;
  }

  const pages = data?.query?.pages || {};
  const pageId = Object.keys(pages)[0];
  if (!pageId || pageId === '-1') return null; // page not found

  const page = pages[pageId];
  const imageInfo = page?.imageinfo?.[0];
  if (!imageInfo) return null;

  const ext = imageInfo.extmetadata || {};
  const metadata = imageInfo.metadata || [];

  // Extract license info from metadata
  let licenseType = determineLicenseType(metadata, ext);
  const licenseUrl = ext.LicenseUrl?.value || imageInfo.descriptionurl || '';
  const creator = ext.Artist?.value || 'Unknown';
  const attributionText = ext.Attribution?.value || buildAttribution(creator, licenseType);

  // Determine media type
  const mediaType = page.mime?.includes('video') ? 'video' : 'image';

  // Source URL — prefer original if available, fall back to thumbnail
  const sourceUrl = imageInfo.url || imageInfo.thumburl || '';

  if (!sourceUrl) return null;

  // Determine if license is permissive
  const isStorable = STORABLE_LICENSES.has(licenseType);

  // Alt text from image description
  const altText = ext.ObjectName?.value || ext.OriginalDescription?.value || '';

  return {
    source_url: sourceUrl,
    thumbnail_url: imageInfo.thumburl || sourceUrl,
    license_type: licenseType,
    license_url: licenseUrl,
    license: licenseType, // keep for backward compatibility with existing column
    creator: cleanHtml(creator),
    attribution_text: attributionText || `Photo by ${cleanHtml(creator)} on Wikimedia Commons`,
    alt_text: altText ? cleanHtml(altText) : '',
    alt: altText ? cleanHtml(altText) : '', // keep for backward compatibility
    source_page: imageInfo.descriptionurl || '',
    media_type: mediaType,
    source_type: 'wikimedia_commons',
    usage_terms: isStorable
      ? `Licensed under ${licenseType}. Full attribution required.`
      : licenseType && !STORABLE_LICENSES.has(licenseType)
        ? `Non-permissive license (${licenseType}). Reference-only — do not store locally.`
        : 'No clear license — reference-only.',
    storable: isStorable,
    width: imageInfo.width || ext.Widthpixels ? parseInt(ext.Widthpixels) : null,
    height: imageInfo.height || null,
  };
}

/**
 * Determine license type from Wikimedia metadata.
 */
function determineLicenseType(metadata, ext) {
  // Check LicenseShortName first (most reliable)
  const shortName = ext.LicenseShortName?.value || '';
  if (shortName) {
    const mapped = WIKIMEDIA_LICENSE_MAP[shortName];
    if (mapped) return mapped;
  }

  // Check License column in metadata
  const licenseMeta = metadata?.find((m) => m.name === 'License');
  if (licenseMeta) {
    const mapped = WIKIMEDIA_LICENSE_MAP[licenseMeta.value];
    if (mapped) return mapped;
  }

  // Check for Public Domain markers
  const licenseShortName = ext.LicenseShortName?.value || '';
  if (licenseShortName.includes('PD') || licenseShortName.includes('Public domain')) {
    return 'cc0';
  }

  // Default: if we can't determine, assume non-permissive to be safe
  return 'proprietary';
}

/**
 * Build a standard attribution text string.
 */
function buildAttribution(creator, licenseType) {
  return `Photo by ${creator || 'Wikimedia Commons contributor'} licensed under ${licenseType}`;
}

/**
 * Strip HTML tags from a string (Wikimedia sometimes wraps values in HTML).
 */
function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').trim();
}

// ── Unsplash search ────────────────────────────────────────────────────────────

const UNSPLASH_SOURCE_BASE = 'https://source.unsplash.com';

/**
 * Search Unsplash Source for royalty-free images by keyword.
 * Returns image source URLs with royalty_free license.
 *
 * @param {string} query - search term
 * @param {object} [options]
 * @param {number} [options.count=10] - number of images
 * @param {AbortSignal} [options.signal]
 * @param {Function} [options.fetchImpl=fetch] - for testing
 * @returns {Promise<Array>}
 */
export async function searchUnsplash(query, { count = 10, signal, fetchImpl = globalThis.fetch } = {}) {
  if (!query || !query.trim()) return [];

  const results = [];

  // Unsplash Source API: https://source.unsplash.com/300x300/?{keyword}
  // Each request returns a redirect to a random image matching the keyword.
  // We can't list multiple images in one call, so we make parallel requests.
  const dimensions = '300x300';
  const sanitizedQuery = query.replace(/\s+/g, '-').toLowerCase();

  // Make parallel requests for distinct images
  const requests = Array.from({ length: count }, (_, i) =>
    fetchUnsplashImage(sanitizedQuery, dimensions, signal, fetchImpl)
      .catch(() => null)
  );

  const responses = await Promise.all(requests);

  for (const sourceUrl of responses) {
    if (sourceUrl && signal?.aborted === false) {
      results.push({
        source_url: sourceUrl,
        thumbnail_url: sourceUrl.replace(/300x300/, '150x150'),
        license_type: 'royalty_free',
        license: 'royalty_free',
        license_url: 'https://unsplash.com/license',
        creator: 'Unsplash contributor',
        creator_url: '',
        attribution_text: `Photo by Unsplash contributor on Unsplash.com`,
        alt_text: '',
        alt: '',
        source_page: `https://unsplash.com/s/photos/${sanitizedQuery}`,
        media_type: 'image',
        source_type: 'unsplash_source',
        usage_terms: 'Royalty-free license via Unsplash Source. Attribution recommended.',
        storable: true,
      });
    }
  }

  return results;
}

/**
 * Fetch a single Unsplash image (follows redirect to get final URL).
 */
async function fetchUnsplashImage(query, dimensions, signal, fetchImpl = globalThis.fetch) {
  const url = `${UNSPLASH_SOURCE_BASE}/${dimensions}/?${query}`;

  try {
    // Use manual redirect handling to capture the final URL
    const response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'manual',
      signal,
    });

    // Unsplash redirects to the actual image URL
    const redirectUrl = response.headers?.get('location');
    if (redirectUrl) return redirectUrl;

    // If no redirect (unlikely), use the original URL
    return url;
  } catch (error) {
    if (error.name === 'AbortError') throw new AIError('CANCELLED');
    return null;
  }
}

// ── Composite media finder ────────────────────────────────────────────────────

/**
 * Find media for a specific entity by combining Wikimedia and Unsplash results.
 * Only stores media with permissive licenses; returns reference-only suggestions
 * for restrictive licenses.
 *
 * @param {object} params
 * @param {string} params.entityType - e.g., 'attraction', 'accommodation'
 * @param {string} params.entityName - e.g., "Maasai Mara National Reserve"
 * @param {string} params.entitySlug - e.g., "maasai-mara"
 * @param {object} params.client - Supabase client
 * @param {AbortSignal} [params.signal]
 * @param {Function} [params.fetchImpl] - for testing
 * @returns {Promise<{suggestions: Array, stored: Array}>}
 */
export async function findMediaForEntity({ entityType, entityName, entitySlug, client, signal, fetchImpl }) {
  // Build search keywords from entity name
  const keywords = buildSearchKeywords(entityName, entityType);
  const suggestions = [];

  // Search Wikimedia Commons
  try {
    const wikiResults = await searchWikimediaCommons(keywords, { signal, fetchImpl });
    suggestions.push(...wikiResults);
  } catch (error) {
    if (error instanceof AIError && error.code === 'CANCELLED') throw error;
    // Non-fatal — continue with Unsplash results
  }

  // Search Unsplash
  try {
    const unsplashResults = await searchUnsplash(keywords, { signal, fetchImpl });
    suggestions.push(...unsplashResults);
  } catch (error) {
    if (error instanceof AIError && error.code === 'CANCELLED') throw error;
    // Non-fatal
  }

  // Filter and categorize
  const storable = suggestions.filter((s) => s.storable);
  const referenceOnly = suggestions.filter((s) => !s.storable);

  // Auto-store storable media with the best score
  const stored = [];
  for (const item of storable.slice(0, 5)) {
    if (signal?.aborted) throw new AIError('CANCELLED');
    const recorded = await recordMediaAsset({
      sourceUrl: item.source_url,
      mediaType: item.media_type,
      licenseType: item.license_type,
      licenseUrl: item.license_url,
      attributionText: item.attribution_text,
      creator: item.creator,
      altText: item.alt_text,
      usageTerms: item.usage_terms,
      caption: item.alt_text || entityName,
      entityType,
      entityName,
      entitySlug,
      client,
    });
    if (recorded) stored.push(recorded);
  }

  // Merge stored items into suggestions for the return
  return {
    suggestions: [...storable.slice(0, 10), ...referenceOnly.slice(0, 5)],
    stored,
  };
}

/**
 * Build search keywords from entity name and type.
 */
function buildSearchKeywords(entityName, entityType) {
  if (!entityName) return entityType || 'africa';

  // Expand entity name into more specific search terms
  // e.g., "Maasai Mara" → "maasai mara wildlife africa"
  const base = entityName.trim();
  const typeKeywords = {
    attraction: 'wildlife nature landscape',
    accommodation: 'hotel lodge resort',
    restaurant: 'restaurant food dining',
    activity: 'adventure activity outdoor',
    tour_operator: 'safari tour guide',
    travel_article: 'travel destination',
    country: 'landscape nature',
    region: 'region landscape',
  };

  const typeKw = typeKeywords[entityType] || 'africa travel';
  return `${base}, ${typeKw}`;
}

// ── Media recording ─────────────────────────────────────────────────────────────

/**
 * Record a discovered media asset in the media_assets table with full attribution.
 * Never overwrites existing media; always creates a new record.
 *
 * @param {object} params
 * @param {string} params.sourceUrl - direct URL to the source media file
 * @param {string} params.mediaType - 'image' or 'video'
 * @param {string} params.licenseType - license identifier
 * @param {string} [params.licenseUrl] - URL to the license text
 * @param {string} [params.attributionText] - full attribution string
 * @param {string} [params.creator] - media creator/author
 * @param {string} [params.altText] - descriptive alt text
 * @param {string} [params.usageTerms] - usage requirements summary
 * @param {string} [params.caption] - optional caption
 * @param {string} params.entityType - which content table
 * @param {string} [params.entityName]
 * @param {string} [params.entitySlug]
 * @param {object} params.client - Supabase client
 * @returns {Promise<object|null>} created record
 */
export async function recordMediaAsset({
  sourceUrl, mediaType, licenseType, licenseUrl,
  attributionText, creator, altText, usageTerms, caption,
  entityType, entityName, entitySlug, client,
}) {
  // Validate license — only store if it's in our allowed list
  if (!ALL_LICENSES.includes(licenseType || '')) {
    return null;
  }

  // Check if this source URL is already stored (idempotent)
  const { data: existing, error: checkError } = await client
    .from('media_assets')
    .select('id')
    .eq('url', sourceUrl)
    .maybeSingle();

  if (existing) return existing;

  const result = await client
    .from('media_assets')
    .insert({
      source_type: 'external_url',
      source_page: sourceUrl.split('/').slice(0, 3).join('/'),
      source_url: sourceUrl,
      url: sourceUrl,
      thumbnail_url: sourceUrl,
      media_type: mediaType || 'image',
      license_type: licenseType,
      license: licenseType,
      license_url: licenseUrl || '',
      creator: creator || '',
      creator_url: '',
      attribution_text: attributionText || `Media by ${creator || 'unknown'} under ${licenseType}`,
      alt_text: altText || '',
      alt: altText || '',
      caption: caption || '',
      usage_terms: usageTerms || '',
      associated_entity_type: entityType,
      associated_entity_id: null, // set by caller if available
      associated_entity_slug: entitySlug || null,
    })
    .select()
    .single();

  if (result.error) return null;
  return result.data;
}

// ── License utilities ──────────────────────────────────────────────────────────

/**
 * Check if a license type permits automatic storage.
 */
export function isLicensePermissive(licenseType) {
  return STORABLE_LICENSES.has(licenseType);
}

/**
 * Check if a license type permits local storage (copying the media).
 */
export function isLicenseStorable(licenseType) {
  return STORABLE_LICENSES.has(licenseType);
}

// ── Photo library integration ─────────────────────────────────────────────────

/**
 * Find curated free-licensure photos from the local photoLibrary.
 * Returns suggestions (no API calls needed).
 *
 * @param {string} entityName - search term matched against photoLibrary entries
 * @returns {Array}
 */
export function findCuratedPhotos(entityName) {
  // Import the local photo library
  // This is synchronous — no API calls needed
  try {
    const photoLibrary = getPhotoLibrary();
    const results = [];
    const searchTerm = (entityName || '').toLowerCase();

    for (const photo of photoLibrary.photos || photoLibrary) {
      const subject = photo.subject?.toLowerCase() || '';
      const exactSubject = photo.exact_subject?.toLowerCase() || '';

      if (subject.includes(searchTerm) || exactSubject.includes(searchTerm) ||
          searchTerm.includes(subject) || searchTerm.includes(exactSubject)) {
        results.push({
          source_url: photo.url || photo.source_page || '',
          thumbnail_url: photo.url || photo.source_page || '',
          license_type: photo.license,
          license: photo.license,
          license_url: photo.license_url,
          creator: photo.creator,
          attribution_text: photo.attribution || `Photo by ${photo.creator} — ${photo.exact_subject || photo.subject}`,
          alt_text: photo.alt,
          alt: photo.alt,
          source_page: photo.source_page,
          media_type: 'image',
          source_type: 'curated_photo_library',
          usage_terms: photo.usage_terms || 'Curated free-licensure photo. Attribution required.',
          storable: STORABLE_LICENSES.has(photo.license),
          ...photo,
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

/**
 * Lazy-load the photo library to avoid import cycles.
 */
function getPhotoLibrary() {
  // The photo library is a frontend module — we import it dynamically
  // In a Node environment, we'd use a different path. For tests we mock it.
  try {
    // Try the Astro frontend photo library
    // eslint-disable-next-line no-undef
    if (process.env?.NODE_ENV !== 'test') {
      // In production, the photo library may be a static JSON
      // For now, return empty — curated photos are optional
      return [];
    }
    return [];
  } catch {
    return [];
  }
}

