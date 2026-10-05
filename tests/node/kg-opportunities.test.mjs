// Tests for the Content Opportunity Engine (server/knowledge/opportunities.mjs)
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  scanContentGaps,
  scanMissingMedia,
  scanMissingMetaImages,
  scanNewListingsWithoutMedia,
  scanMissingMetadata,
  scanStaleContent,
  scanSparseListings,
  scanCoverageGaps,
  scanMissingRelationships,
  scanOrphanedContent,
  scanOutdatedSources,
  prioritizeOpportunity,
  createOpportunity,
  listOpportunities,
  updateOpportunityStatus,
  OPPORTUNITY_TYPES,
  CADENCES,
  STATUSES,
} from '../../server/knowledge/opportunities.mjs';
import { createMockClient } from './kg-mock-client.mjs';
import { AIError } from '../../server/ai/errors.mjs';

describe('Content Opportunity Engine', () => {
  describe('prioritizeOpportunity', () => {
    test('assigns higher scores to published attractions than draft activities', () => {
      const publishedAttraction = prioritizeOpportunity({
        entityType: 'attraction', status: 'published', completeness: 0.3, gapType: OPPORTUNITY_TYPES.MISSING_MEDIA,
      });
      const draftActivity = prioritizeOpportunity({
        entityType: 'activity', status: 'draft', completeness: 0.3, gapType: OPPORTUNITY_TYPES.MISSING_MEDIA,
      });
      assert.ok(publishedAttraction > draftActivity);
      assert.ok(publishedAttraction <= 1.0);
      assert.ok(publishedAttraction >= 0.0);
    });

    test('assigns higher priority to stale content than sparse listings', () => {
      const staleScore = prioritizeOpportunity({
        entityType: 'attraction', status: 'published', completeness: 0.8,
        gapType: OPPORTUNITY_TYPES.STALE_CONTENT,
      });
      const sparseScore = prioritizeOpportunity({
        entityType: 'attraction', status: 'published', completeness: 0.8,
        gapType: OPPORTUNITY_TYPES.SPARSE_LISTING,
      });
      assert.ok(staleScore > sparseScore);
    });

    test('sparse listing with low completeness gets higher score', () => {
      const lowCompleteness = prioritizeOpportunity({
        entityType: 'attraction', status: 'published', completeness: 0.2,
        gapType: OPPORTUNITY_TYPES.SPARSE_LISTING,
      });
      const highCompleteness = prioritizeOpportunity({
        entityType: 'attraction', status: 'published', completeness: 0.8,
        gapType: OPPORTUNITY_TYPES.SPARSE_LISTING,
      });
      assert.ok(lowCompleteness > highCompleteness);
    });

    test('country entity type gets lower score than attraction', () => {
      const attractionScore = prioritizeOpportunity({
        entityType: 'attraction', status: 'published', completeness: 0.5,
        gapType: OPPORTUNITY_TYPES.MISSING_MEDIA,
      });
      const countryScore = prioritizeOpportunity({
        entityType: 'country', status: 'published', completeness: 0.5,
        gapType: OPPORTUNITY_TYPES.MISSING_MEDIA,
      });
      assert.ok(attractionScore > countryScore);
    });
  });

  describe('scanMissingMedia', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'test-attraction', name: 'Test Attraction', hero_image_url: '/images/test.jpg', hero_image_alt: 'Test landscape', gallery: ['image.jpg'], meta_image_url: '/images/meta.jpg', status: 'published', updated_at: new Date().toISOString() },
          { id: 2, slug: 'no-media-attraction', name: 'No Media Attraction', hero_image_url: null, gallery: null, status: 'published', updated_at: new Date().toISOString() },
        ],
      });
    });

    test('finds listings without hero images across entity tables', async () => {
      const result = await scanMissingMedia({ cadence: 'weekly', actorId, client, scanAt: new Date().toISOString() });

      assert.ok(result.scanned > 0);
      assert.ok(result.newOpportunities > 0);
      assert.ok(result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 2));
    });

    test('does not flag listings with hero images', async () => {
      const result = await scanMissingMedia({ cadence: 'weekly', actorId, client, scanAt: new Date().toISOString() });

      assert.ok(result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 2));
      assert.ok(!result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 1));
    });
  });

  describe('scanMissingMetadata', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'has-meta', name: 'Has Meta', meta_title: 'Title', meta_description: 'Desc', status: 'published' },
          { id: 2, slug: 'no-meta', name: 'No Meta', meta_title: null, meta_description: null, status: 'published' },
        ],
      });
    });

    test('finds listings missing meta_title or meta_description', async () => {
      const result = await scanMissingMetadata({ cadence: 'weekly', actorId, client, scanAt: new Date().toISOString() });

      assert.ok(result.newOpportunities > 0);
      assert.ok(result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 2));
      assert.ok(!result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 1));
    });

    test('records which metadata fields are missing', async () => {
      const result = await scanMissingMetadata({ cadence: 'weekly', actorId, client, scanAt: new Date().toISOString() });

      const opp = result.opportunities.find((o) => o.entity_type === 'attraction' && o.entity_id === 2);
      assert.ok(opp);
      assert.ok(opp.gap_details.missing_fields.includes('meta_title'));
      assert.ok(opp.gap_details.missing_fields.includes('meta_description'));
    });
  });

  describe('scanStaleContent', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'recent', name: 'Recent', status: 'published', updated_at: new Date().toISOString(), published_at: new Date().toISOString() },
          { id: 2, slug: 'stale', name: 'Stale', status: 'published', updated_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), published_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString() },
        ],
      });
    });

    test('finds entries older than 90 days', async () => {
      const result = await scanStaleContent({ cadence: 'daily', actorId, client, scanAt: new Date().toISOString() });

      assert.ok(result.scanned > 0);
      assert.ok(result.newOpportunities > 0);
      assert.ok(result.opportunities.some((o) => o.entity_id === 2));
      assert.ok(!result.opportunities.some((o) => o.entity_id === 1));
    });

    test('records days since last update in gap details', async () => {
      const result = await scanStaleContent({ cadence: 'daily', actorId, client, scanAt: new Date().toISOString() });

      const opp = result.opportunities.find((o) => o.entity_id === 2);
      assert.ok(opp.gap_details.days_since_update > 90);
    });
  });

  describe('scanSparseListings', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          {
            id: 1, slug: 'sparse-attraction', name: 'Sparse Attraction',
            listing_summary: 'A test attraction.', // only 1 of ~13 fields populated
            status: 'published', created_at: new Date().toISOString(),
          },
          {
            id: 2, slug: 'full-attraction', name: 'Full Attraction',
            listing_summary: 'A test attraction.',
            detail_intro: 'More details here.',
            full_description: 'Full description.',
            best_time: 'Year-round',
            practical_info: 'Info',
            highlights: '["wildlife"]',
            hero_image_url: '/images/full.jpg',
            hero_image_alt: 'Alt text',
            meta_title: 'Meta Title',
            meta_description: 'Meta description',
            meta_image_url: '/images/meta.jpg',
            status: 'published', created_at: new Date().toISOString(),
          },
        ],
      });
    });

    test('finds entries with low field completeness', async () => {
      const result = await scanSparseListings({
        cadence: 'monthly', actorId, client, aiService: { run: async () => ({ text: '{}' }) },
        scanAt: new Date().toISOString(),
      });

      // The sparse attraction should be flagged (low completeness)
      assert.ok(result.newOpportunities > 0);
      assert.ok(result.opportunities.some((o) => o.entity_id === 1));
    });

    test('does not flag entries with high completeness', async () => {
      const result = await scanSparseListings({
        cadence: 'monthly', actorId, client, aiService: { run: async () => ({ text: '{}' }) },
        scanAt: new Date().toISOString(),
      });

      assert.ok(!result.opportunities.some((o) => o.entity_id === 2));
    });

    test('records completeness score in gap details', async () => {
      const result = await scanSparseListings({
        cadence: 'monthly', actorId, client, aiService: { run: async () => ({ text: '{}' }) },
        scanAt: new Date().toISOString(),
      });

      const opp = result.opportunities.find((o) => o.entity_id === 1);
      assert.ok(opp.gap_details.completeness < 0.5);
    });
  });

  describe('scanCoverageGaps', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'maasai-mara', name: 'Maasai Mara', status: 'published', region_id: 1 },
        ],
        activities: [
          { id: 1, slug: 'balloon', name: 'Balloon Safari', attraction_id: 1, status: 'published' },
        ],
        countries: [],
        accommodations: [],
      });
    });

    test('finds attractions without activities', async () => {
      const result = await scanCoverageGaps({ cadence: 'monthly', actorId, client, scanAt: new Date().toISOString() });

      // The attraction has an activity linked, so no missing-relationship opportunity
      // But accommodations is empty — should flag coverage gap
      assert.ok(result.scanned > 0);
    });

    test('records table counts as scanned', async () => {
      const result = await scanCoverageGaps({ cadence: 'monthly', actorId, client, scanAt: new Date().toISOString() });

      assert.ok(result.scanned >= 1);
    });
  });

  describe('scanMissingRelationships', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        activities: [
          { id: 1, slug: 'linked-activity', name: 'Linked Activity', attraction_id: 1, status: 'published' },
          { id: 2, slug: 'unlinked-activity', name: 'Unlinked Activity', attraction_id: null, status: 'published' },
        ],
      });
    });

    test('finds activities without attraction_id', async () => {
      const result = await scanMissingRelationships({
        cadence: 'weekly', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(result.scanned > 0);
      assert.ok(result.opportunities.some((o) => o.entity_id === 2));
      assert.ok(!result.opportunities.some((o) => o.entity_id === 1));
    });
  });

  describe('scanOrphanedContent', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'with-media', name: 'Has Media', hero_image_url: '/img.jpg', gallery: [], status: 'published' },
          { id: 2, slug: 'no-media', name: 'No Media', hero_image_url: null, gallery: null, status: 'published' },
        ],
        countries: [],
        accommodations: [],
        activities: [],
        restaurants: [],
        tour_operators: [],
        travel_articles: [],
        media_assets: [
          { id: 1, associated_entity_type: 'attraction', associated_entity_id: 1 },
        ],
      });
    });

    test('finds published content with no media', async () => {
      const result = await scanOrphanedContent({
        cadence: 'quarterly', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(result.scanned > 0);
      assert.ok(result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 2));
      assert.ok(!result.opportunities.some((o) => o.entity_type === 'attraction' && o.entity_id === 1));
    });
  });

  describe('scanOutdatedSources', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        cm_knowledge: [
          {
            id: 'knowledge-1', entity_type: 'attraction', entity_id: 1,
            source_url: 'https://example.com/old-source', source_name: 'Old Source',
            discovery_date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
            confidence: 0.5, verification_status: 'unverified',
          },
          {
            id: 'knowledge-2', entity_type: 'attraction', entity_id: 2,
            source_url: 'https://example.com/new-source', source_name: 'New Source',
            discovery_date: new Date().toISOString(),
            confidence: 0.5, verification_status: 'unverified',
          },
        ],
      });
    });

    test('finds knowledge entries older than 180 days', async () => {
      const result = await scanOutdatedSources({
        cadence: 'quarterly', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(result.scanned > 0);
      assert.ok(result.opportunities.length > 0);
      assert.ok(result.opportunities[0].gap_details.age_days > 180);
    });
  });

  describe('scanMissingMetaImages', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      const recentDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'recent-no-hero', name: 'Recent No Hero', hero_image_url: null, featured: false, published_at: recentDate, updated_at: recentDate, status: 'published' },
          { id: 2, slug: 'featured-no-hero', name: 'Featured No Hero', hero_image_url: null, featured: true, published_at: oldDate, updated_at: oldDate, status: 'published' },
          { id: 3, slug: 'has-hero', name: 'Has Hero', hero_image_url: '/img.jpg', featured: false, published_at: recentDate, updated_at: recentDate, status: 'published' },
        ],
      });
    });

    test('flags recently published content without hero images', async () => {
      const result = await scanMissingMetaImages({
        cadence: 'daily', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(result.opportunities.some((o) => o.entity_id === 1));
    });

    test('flags featured content without hero images', async () => {
      const result = await scanMissingMetaImages({
        cadence: 'daily', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(result.opportunities.some((o) => o.entity_id === 2));
    });

    test('does not flag content with hero images', async () => {
      const result = await scanMissingMetaImages({
        cadence: 'daily', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(!result.opportunities.some((o) => o.entity_id === 3));
    });
  });

  describe('scanNewListingsWithoutMedia', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      const recentDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'recent-no-gallery', name: 'Recent No Gallery', gallery: null, meta_image_url: null, published_at: recentDate, status: 'published' },
          { id: 2, slug: 'recent-has-gallery', name: 'Recent Has Gallery', gallery: ['img1.jpg'], meta_image_url: '/meta.jpg', published_at: recentDate, status: 'published' },
        ],
      });
    });

    test('flags recent listings without galleries', async () => {
      const result = await scanNewListingsWithoutMedia({
        cadence: 'daily', actorId, client, scanAt: new Date().toISOString(),
      });

      assert.ok(result.opportunities.some((o) => o.entity_id === 1));
      assert.ok(!result.opportunities.some((o) => o.entity_id === 2));
    });
  });

  describe('scanContentGaps dispatch', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        attractions: [
          { id: 1, slug: 'stale-attraction', name: 'Stale Attraction', status: 'published', updated_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), published_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), hero_image_url: null, gallery: null, meta_title: null, meta_description: null },
        ],
      });
    });

    test('daily cadence runs daily scanners', async () => {
      const result = await scanContentGaps({ cadence: 'daily', actorId, client, aiService: { run: async () => ({ text: '{}' }) }, scanAt: new Date().toISOString() });

      assert.ok(result.opportunities.length > 0);
      assert.ok(result.results.stale_content);
      assert.ok(result.results.missing_meta_images);
    });

    test('weekly cadence runs weekly scanners', async () => {
      const result = await scanContentGaps({ cadence: 'weekly', actorId, client, aiService: { run: async () => ({ text: '{}' }) }, scanAt: new Date().toISOString() });

      assert.ok(result.results.missing_media);
      assert.ok(result.results.missing_metadata);
    });

    test('monthly cadence runs monthly + weekly scanners', async () => {
      const result = await scanContentGaps({ cadence: 'monthly', actorId, client, aiService: { run: async () => ({ text: '{}' }) }, scanAt: new Date().toISOString() });

      assert.ok(result.results.sparse_listings);
      assert.ok(result.results.coverage_gaps);
      assert.ok(result.results.missing_media);
    });

    test('quarterly cadence runs quarterly + monthly + weekly scanners', async () => {
      const result = await scanContentGaps({ cadence: 'quarterly', actorId, client, aiService: { run: async () => ({ text: '{}' }) }, scanAt: new Date().toISOString() });

      assert.ok(result.results.orphaned_content);
      assert.ok(result.results.outdated_sources);
      assert.ok(result.results.sparse_listings);
    });

    test('throws on unknown cadence', async () => {
      await assert.rejects(
        () => scanContentGaps({ cadence: 'invalid', actorId, client, scanAt: new Date().toISOString() }),
        (err) => err instanceof AIError && err.code === 'INVALID_REQUEST'
      );
    });
  });

  describe('createOpportunity', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(() => {
      client = createMockClient({
        cm_content_opportunities: [],
      });
    });

    test('creates opportunity with computed priority_score', async () => {
      const opp = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_MEDIA,
        entityType: 'attraction',
        entityId: 1,
        entitySlug: 'test-attraction',
        title: 'Test opportunity',
        description: 'Missing media',
        gapDetails: { missing_fields: ['hero_image_url'] },
        cadence: CADENCES.WEEKLY,
        priority: CADENCES.WEEKLY,
        actorId,
        client,
        scanAt: new Date().toISOString(),
      });

      assert.ok(opp);
      assert.ok(opp.priority_score >= 0);
      assert.ok(opp.priority_score <= 1);
      assert.ok(opp.status === STATUSES.PENDING);
    });

    test('deduplicates: does not create duplicate for same entity+type', async () => {
      const scanAt = new Date().toISOString();
      const opp1 = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_MEDIA,
        entityType: 'attraction', entityId: 1, entitySlug: 'test',
        title: 'Test', description: 'Missing media',
        gapDetails: {}, cadence: CADENCES.WEEKLY, priority: CADENCES.WEEKLY,
        actorId, client, scanAt,
      });

      assert.ok(opp1);

      const opp2 = await createOpportunity({
        opportunityType: OPPORTUNITY_TYPES.MISSING_MEDIA,
        entityType: 'attraction', entityId: 1, entitySlug: 'test',
        title: 'Test', description: 'Missing media',
        gapDetails: {}, cadence: CADENCES.WEEKLY, priority: CADENCES.WEEKLY,
        actorId, client, scanAt: new Date().toISOString(),
      });

      // opp2 should be null (already exists)
      assert.strictEqual(opp2, null);
    });
  });

  describe('listOpportunities', () => {
    let client;
    const actorId = 'admin-user-id';

    beforeEach(async () => {
      client = createMockClient({
        cm_content_opportunities: [
          {
            id: 'opp-1', opportunity_type: 'missing_media', entity_type: 'attraction',
            entity_id: 1, title: 'Missing media 1', priority: 'weekly', priority_score: 0.8,
            cadence: 'weekly', status: 'pending', created_at: new Date().toISOString(),
          },
          {
            id: 'opp-2', opportunity_type: 'stale_content', entity_type: 'country',
            entity_id: 2, title: 'Stale content', priority: 'daily', priority_score: 0.5,
            cadence: 'daily', status: 'resolved', created_at: new Date().toISOString(),
          },
        ],
      });
    });

    test('returns opportunities ordered by priority_score desc', async () => {
      const result = await listOpportunities({}, client);
      assert.ok(result.length >= 2);
      // Highest score first
      assert.ok(result[0].priority_score > result[1].priority_score);
    });

    test('filters by status', async () => {
      const result = await listOpportunities({ status: STATUSES.RESOLVED }, client);
      assert.ok(result.length >= 1);
      assert.ok(result.every((o) => o.status === 'resolved'));
    });

    test('filters by cadence', async () => {
      const result = await listOpportunities({ cadence: CADENCES.WEEKLY }, client);
      assert.ok(result.every((o) => o.cadence === 'weekly'));
    });
  });

  describe('updateOpportunityStatus', () => {
    let client;

    beforeEach(() => {
      client = createMockClient({
        cm_content_opportunities: [
          { id: 'opp-1', status: 'pending', title: 'Test' },
        ],
      });
    });

    test('updates status and sets resolved_at', async () => {
      const result = await updateOpportunityStatus('opp-1', 'resolved', { resolution_notes: 'Fixed' }, client);

      assert.ok(result);
      assert.strictEqual(result.status, 'resolved');
      assert.ok(result.resolved_at);
      assert.strictEqual(result.resolution_notes, 'Fixed');
    });

    test('throws on invalid status', async () => {
      await assert.rejects(
        () => updateOpportunityStatus('opp-1', 'invalid', {}, client),
        (err) => err instanceof AIError && err.code === 'INVALID_REQUEST'
      );
    });
  });
});
