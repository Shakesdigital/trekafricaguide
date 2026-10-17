// src/config/site.mjs — Immutable route and default-brand configuration.
// This module provides the canonical site URL, route family list, and
// default brand tokens that are shared across all Astro pages.

export const SITE_URL = 'https://trekafricaguide.com';

export const ROUTES = {
  home: '/',
  regions: '/regions',
  countries: '/countries',
  attractions: '/attractions',
  accommodations: '/accommodations',
  activities: '/activities',
  travelInsights: '/travel-insights',
};

export const INTERNAL_ROUTE_FAMILIES = ['regions', 'countries', 'attractions', 'accommodations', 'activities', 'travel-insights'];

export const DEFAULT_BRAND = Object.freeze({
  name: 'Trek Africa Guide',
  tagline: 'Africa travel listings, destination insight, attractions, stays, and practical planning guidance in one place.',
  primary: '#284932',
  secondary: '#c56b3d',
  accent: '#c5b580',
  logo: '/logo to edit.png',
});

// Feature flag: restaurants are disabled in the Astro migration.
export const RESTAURANTS_ENABLED = false;

// Distinct public IDs verified from the active Stay22 script configuration.
export const DEFAULT_AFFILIATE_ID = 'trekafricaguide';
export const STAY22_SCRIPT_ID = '6a809892f76b8b75f2a2e6a4';
