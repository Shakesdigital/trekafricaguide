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
 * When a table is provided in `tables`, it replaces the defaults for that table —
 * tests get full control over their own data while defaults remain available
 * when no override is given.
 */
function createMockClient(tables = {}) {
  const client = createCMSMockClient(tables);

  // Seed knowledge tables
  if (tables.cm_knowledge !== undefined) {
    client._seed('cm_knowledge', tables.cm_knowledge);
  } else {
    client._seed('cm_knowledge', DEFAULT_KNOWLEDGE);
  }

  if (tables.cm_discovery_sources !== undefined) {
    client._seed('cm_discovery_sources', tables.cm_discovery_sources);
  } else {
    client._seed('cm_discovery_sources', DEFAULT_DISCOVERY_SOURCES);
  }

  // Seed content tables — replace defaults when caller provides their own
  if (tables.attractions !== undefined) {
    client._seed('attractions', tables.attractions);
  } else {
    client._seed('attractions', DEFAULT_ATTRACTIONS);
  }

  if (tables.countries !== undefined) {
    client._seed('countries', tables.countries);
  } else {
    client._seed('countries', DEFAULT_COUNTRIES);
  }

  if (tables.accommodations !== undefined) {
    client._seed('accommodations', tables.accommodations);
  } else {
    client._seed('accommodations', DEFAULT_ACCOMMODATIONS);
  }

  if (tables.activities !== undefined) {
    client._seed('activities', tables.activities);
  } else {
    client._seed('activities', DEFAULT_ACTIVITIES);
  }

  // Seed new tables for opportunity engine tests
  client._seed('cm_content_opportunities', tables.cm_content_opportunities || []);
  client._seed('media_assets', tables.media_assets || []);

  // Seed autonomous operations tables
  client._seed('cm_agent_operations', tables.cm_agent_operations || []);
  client._seed('cm_agent_log', tables.cm_agent_log || []);
  client._seed('cm_agent_approval_queue', tables.cm_agent_approval_queue || []);

  // Seed site_settings with deploy hook (for build-trigger tests)
  client._seed('site_settings', tables.site_settings || [
    { group_name: 'deployment', key: 'netlify_deploy_hook', value: 'https://api.netlify.com/build_hooks/test-hook' },
  ]);

  // Seed AI task config for autonomous ops
  client._seed('ai_task_config', tables.ai_task_config || [
    { task_type: 'autonomous_cycle', enabled: false, provider: 'primary', model: 'gpt-4', timeout_ms: 25000, max_retries: 1, max_output_tokens: 8192, cache_ttl_seconds: 0 },
    { task_type: 'classify_entity', enabled: true, provider: 'primary', model: 'gpt-4', timeout_ms: 15000, max_retries: 1, max_output_tokens: 1024, cache_ttl_seconds: 3600 },
    { task_type: 'extract_attraction', enabled: true, provider: 'primary', model: 'gpt-4', timeout_ms: 20000, max_retries: 1, max_output_tokens: 2048, cache_ttl_seconds: 3600 },
    { task_type: 'extract_destination', enabled: true, provider: 'primary', model: 'gpt-4', timeout_ms: 20000, max_retries: 1, max_output_tokens: 2048, cache_ttl_seconds: 3600 },
    { task_type: 'extract_accommodation', enabled: true, provider: 'primary', model: 'gpt-4', timeout_ms: 20000, max_retries: 1, max_output_tokens: 2048, cache_ttl_seconds: 3600 },
    { task_type: 'extract_activity', enabled: true, provider: 'primary', model: 'gpt-4', timeout_ms: 20000, max_retries: 1, max_output_tokens: 2048, cache_ttl_seconds: 3600 },
    { task_type: 'extract_travel_insight', enabled: true, provider: 'primary', model: 'gpt-4', timeout_ms: 20000, max_retries: 1, max_output_tokens: 2048, cache_ttl_seconds: 3600 },
  ]);

  return client;
}

export { createMockClient };
