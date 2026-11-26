// Build the allowlisted sitemap plan from the same published content that renders the site.
// Hubs and editorial pages only: no 404, admin, CMS, utility or query routes.

const HUB_PATHS = [
  '/',
  '/countries',
  '/attractions',
  '/activities',
  '/accommodations',
  '/travel-insights',
];

function normalizedPath(path) {
  if (path === '/') return '/';
  return `/${String(path).replace(/^\/+|\/+$/g, '')}`;
}

function validLastmod(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * @param {Object} content published content tables
 * @returns {{urls:Set<string>, lastmods:Map<string,string>}}
 */
export function buildSitemapPlan(content = {}) {
  const urls = new Set(HUB_PATHS);
  const lastmods = new Map();

  const add = (path, record) => {
    const normalized = normalizedPath(path);
    if (normalized === '/404' || normalized.startsWith('/admin') || normalized.startsWith('/cms')) return;
    urls.add(normalized);
    const lastmod = validLastmod(record?.updated_at);
    if (lastmod) lastmods.set(normalized, lastmod);
  };

  const countrySlugs = new Set((content.countries || []).map((country) => country.slug));

  for (const region of content.regions || []) add(`/regions/${region.slug}`, region);
  for (const country of content.countries || []) add(`/countries/${country.slug}`, country);
  for (const destination of content.local_destinations || []) {
    if (!countrySlugs.has(destination.country_slug)) continue;
    add(`/countries/${destination.country_slug}/${destination.slug}`, destination);
  }
  for (const attraction of content.attractions || []) add(`/attractions/${attraction.slug}`, attraction);
  for (const activity of content.activities || []) add(`/activities/${activity.slug}`, activity);
  for (const accommodation of content.accommodations || []) add(`/accommodations/${accommodation.slug}`, accommodation);
  for (const article of content.travel_articles || []) add(`/travel-insights/${article.slug}`, article);

  return { urls, lastmods };
}

export function isSitemapPath(page, plan) {
  try {
    const path = normalizedPath(new URL(page).pathname);
    return plan.urls.has(path);
  } catch {
    return false;
  }
}

export function lastmodForPath(page, plan) {
  try {
    return plan.lastmods.get(normalizedPath(new URL(page).pathname));
  } catch {
    return undefined;
  }
}

// The live site serves the trailing-slash form as 200 and 301-redirects the
// non-slash form to it. Sitemap, canonical and RSS must emit that 200 form.
export function toTrailingSlashUrl(value) {
  const url = new URL(value);
  if (url.pathname !== '/' && !url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  return url.toString();
}

// @astrojs/sitemap serialize hook: emit the trailing-slash (200) URL and keep
// the real lastmod. The non-slash form 301-redirects and must never appear.
export function serializeSitemapItem(item, plan) {
  const url = toTrailingSlashUrl(item.url);
  const lastmod = lastmodForPath(url, plan);
  return { ...item, url, ...(lastmod ? { lastmod } : {}) };
}