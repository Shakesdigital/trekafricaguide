// Shared mock Supabase client for Knowledge Engine tests.
// Extends cm-mock-client with cm_knowledge and cm_discovery_sources tables.
// Reuses the same chainable in-memory query API as the parent mock.

import { createMockClient as createCMSMockClient } from './cm-mock-client.mjs';
import { randomUUID } from 'node:crypto';

// Re-export the base mock client for compatibility
export { createMockClient as createCMMockClient } from './cm-mock-client.mjs';

// Additional seed data for knowledge tables
const DEFAULT_KNOWLEDGE = [
  {
    id: randomUUID(),
    entity_type: 'attraction',
    entity_id: 1,
    discovery_type: 'new',
    confidence: 0.85,
    knowledge_data: { slug: 'test-attraction', name: 'Test Attraction', listing_summary: 'A test attraction.' },
    source_url: 'https://example.com/test-attraction',
    source_name: 'Test Source',
    discovery_date: new Date().toISOString(),
    verification_status: 'unverified',
    review_status: 'pending',
    created_by: 'admin-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_DISCOVERY_SOURCES = [
  {
    domain: 'www.ugandawildlife.org',
    name: 'Uganda Wildlife Authority',
    seed_urls: ['https://ugandawildlife.org/activities/gorilla-tracking/'],
    category: 'tourism_board',
    verified: true,
    last_discovered_at: new Date().toISOString(),
    last_checked_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    check_interval_hours: 168,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Content table seed data for comparison tests
const DEFAULT_ATTRACTIONS = [
  {
    id: 1,
    slug: 'maasai-mara',
    name: 'Maasai Mara National Reserve',
    location_name: 'Narok County, Kenya',
    listing_summary: 'Famous for the Great Wildebeest Migration.',
    detail_intro: 'The Maasai Mara is renowned for its wildlife.',
    hero_image_url: '/images/maasai-mara.jpg',
    hero_image_alt: 'Maasai Mara landscape',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    slug: 'bwindi-impenetrable-national-park',
    name: 'Bwindi Impenetrable National Park',
    location_name: 'Southwestern Uganda',
    listing_summary: 'Home to endangered mountain gorillas.',
    detail_intro: 'Bwindi is a UNESCO World Heritage site.',
    hero_image_url: '/images/bwindi.jpg',
    hero_image_alt: 'Bwindi rainforest',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_COUNTRIES = [
  {
    id: 1,
    slug: 'kenya',
    name: 'Kenya',
    region_id: 1,
    hero_title: 'Kenya',
    hero_text: 'The home of safari.',
    overview: 'Kenya is famous for its wildlife and safaris.',
    access_summary: 'Nairobi is the main entry point.',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_ACCOMMODATIONS = [
  {
    id: 1,
    slug: 'governors-camp',
    name: "Governor's Camp",
    location_name: 'Maasai Mara National Reserve, Kenya',
    listing_summary: 'Luxury tented camp in the Mara.',
    detail_intro: 'A classic safari camp.',
    property_type: 'tented camp',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    attraction_id: 1,
    slug: 'maasai-mara-balloon-safari',
    name: 'Sunrise hot-air balloon safari',
    location_name: 'Maasai Mara National Reserve',
    listing_summary: 'See the Mara from above at sunrise.',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Create a mock client that extends the CM mock client with knowledge tables.
 * Seeds default knowledge/discovery source data unless overridden.
 */
function createMockClient(tables = {}) {
  const client = createCMSMockClient(tables);

  // Seed knowledge tables with defaults + any user-provided data
  client._seed('cm_knowledge', [...DEFAULT_KNOWLEDGE, ...(tables.cm_knowledge || [])]);
  client._seed('cm_discovery_sources', [...DEFAULT_DISCOVERY_SOURCES, ...(tables.cm_discovery_sources || [])]);

  // Seed content tables for comparison tests
  client._seed('attractions', [...DEFAULT_ATTRACTIONS, ...(tables.attractions || [])]);
  client._seed('countries', [...DEFAULT_COUNTRIES, ...(tables.countries || [])]);
  client._seed('accommodations', [...DEFAULT_ACCOMMODATIONS, ...(tables.accommodations || [])]);
  client._seed('activities', [...DEFAULT_ACTIVITIES, ...(tables.activities || [])]);

  return client;
}

export { createMockClient };
