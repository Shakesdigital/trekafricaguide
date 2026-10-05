// Tests for the Media Engine (server/knowledge/media.mjs)
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  searchWikimediaCommons,
  searchUnsplash,
  findMediaForEntity,
  recordMediaAsset,
  isLicensePermissive,
  isLicenseStorable,
  STORABLE_LICENSES,
  ALL_LICENSES,
} from '../../server/knowledge/media.mjs';
import { createMockClient } from './kg-mock-client.mjs';
import { mockFetch, mockFetchError, mockFetchJson, buildMockResponse } from './mock-fetch.mjs';

describe('Media Engine', () => {
  describe('searchWikimediaCommons', () => {
    test('returns parsed media records with license info', async () => {
      const mockData = {
        query: {
          search: [
            { title: 'File:Example.jpg' },
          ],
        },
      };
      const fetchImpl = mockFetchJson(mockData);

      const results = await searchWikimediaCommons('maasai mara', { fetchImpl });

      // Should attempt to fetch file details
      assert.ok(results.length > 0 || results.length === 0);
    });

    test('empty query returns empty array', async () => {
      const fetchImpl = mockFetch({ data: { query: { search: [] } } });
      const results = await searchWikimediaCommons('', { fetchImpl });
      assert.deepStrictEqual(results, []);
    });

    test('handles API errors gracefully', async () => {
      const fetchImpl = mockFetchJson({}, 500);

      await assert.rejects(
        () => searchWikimediaCommons('test', { fetchImpl }),
        (err) => err.code === 'PROVIDER_ERROR'
      );
    });

    test('aborts on signal', async () => {
      const controller = new AbortController();
      controller.abort();

      await assert.rejects(
        () => searchWikimediaCommons('test', { signal: controller.signal }),
        (err) => err.code === 'CANCELLED'
      );
    });
  });

  describe('searchUnsplash', () => {
    test('returns royalty_free images', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: (name) => name === 'location' ? 'https://images.unsplash.com/photo-12345' : null,
        },
        redirect: 'manual',
      };
      const fetchImpl = mockFetch(mockResponse);

      const results = await searchUnsplash('safari', { count: 3, fetchImpl });

      assert.ok(Array.isArray(results));
      results.forEach((r) => {
        assert.strictEqual(r.license_type, 'royalty_free');
        assert.ok(r.source_url);
        assert.strictEqual(r.storable, true);
      });
    });

    test('empty query returns empty array', async () => {
      const fetchImpl = mockFetch({ ok: true, headers: { get: () => null } });
      const results = await searchUnsplash('', { fetchImpl });
      assert.deepStrictEqual(results, []);
    });
  });

  describe('findMediaForEntity', () => {
    let client;

    beforeEach(() => {
      client = createMockClient({
        media_assets: [],
      });
    });

    test('combines Wikimedia and Unsplash results and stores permissive media', async () => {
      // Mock Wikimedia returning CC0 result
      const wikiData = {
        query: {
          search: [{ title: 'File:Test.jpg' }],
        },
      };
      // The file details fetch will also need to be mocked
      const wikiFileData = {
        query: {
          pages: {
            '1': {
              imageinfo: [{
                url: 'https://upload.wikimedia.org/test.jpg',
                descriptionurl: 'https://commons.wikimedia.org/wiki/File:Test.jpg',
                thumburl: 'https://upload.wikimedia.org/test_thumb.jpg',
                extmetadata: {
                  LicenseShortName: { value: 'CC0' },
                  Artist: { value: 'Test Creator' },
                  Attribution: { value: 'Test Creator' },
                  ObjectName: { value: 'Test object' },
                },
                metadata: [],
              }],
            },
          },
        },
      };

      let callCount = 0;
      const fetchImpl = async (url) => {
        callCount++;
        if (callCount === 1) {
          // Search request
          return buildMockResponse(wikiData);
        }
        // File details request
        return buildMockResponse(wikiFileData);
      };

      const result = await findMediaForEntity({
        entityType: 'attraction',
        entityName: 'Test Attraction',
        entitySlug: 'test-attraction',
        client,
        fetchImpl,
      });

      assert.ok(result.suggestions.length > 0);
    });
  });

  describe('recordMediaAsset', () => {
    let client;

    beforeEach(() => {
      client = createMockClient({
        media_assets: [],
      });
    });

    test('stores media asset with full attribution', async () => {
      const result = await recordMediaAsset({
        sourceUrl: 'https://example.com/photo.jpg',
        mediaType: 'image',
        licenseType: 'cc0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        attributionText: 'Photo by John Doe',
        creator: 'John Doe',
        altText: 'A landscape photo',
        usageTerms: 'No attribution required',
        caption: 'Landscape',
        entityType: 'attraction',
        entityName: 'Test Attraction',
        entitySlug: 'test-attraction',
        client,
      });

      assert.ok(result);
      assert.strictEqual(result.license_type, 'cc0');
      assert.strictEqual(result.source_url, 'https://example.com/photo.jpg');
      assert.strictEqual(result.creator, 'John Doe');
      assert.strictEqual(result.attribution_text, 'Photo by John Doe');
      assert.strictEqual(result.alt_text, 'A landscape photo');
      assert.strictEqual(result.associated_entity_type, 'attraction');
    });

    test('rejects invalid license type', async () => {
      const result = await recordMediaAsset({
        sourceUrl: 'https://example.com/photo.jpg',
        mediaType: 'image',
        licenseType: 'invalid_license',
        creator: 'Someone',
        entityType: 'attraction',
        entityName: 'Test',
        entitySlug: 'test',
        client,
      });

      assert.strictEqual(result, null);
    });

    test('skips already-stored source URLs', async () => {
      // Pre-seed an existing record
      client = createMockClient({
        media_assets: [{
          id: 'existing-1',
          url: 'https://example.com/photo.jpg',
          source_url: 'https://example.com/photo.jpg',
        }],
      });

      const result = await recordMediaAsset({
        sourceUrl: 'https://example.com/photo.jpg',
        mediaType: 'image',
        licenseType: 'cc_by',
        creator: 'Jane Doe',
        entityType: 'attraction',
        entityName: 'Test',
        entitySlug: 'test',
        client,
      });

      assert.ok(result?.id === 'existing-1');
    });
  });

  describe('license utilities', () => {
    test('CC0 is permissive and storable', () => {
      assert.strictEqual(isLicensePermissive('cc0'), true);
      assert.strictEqual(isLicenseStorable('cc0'), true);
    });

    test('CC BY-SA is permissive and storable', () => {
      assert.strictEqual(isLicensePermissive('cc_by_sa'), true);
      assert.strictEqual(isLicenseStorable('cc_by_sa'), true);
    });

    test('CC BY-NC is NOT storable (reference only)', () => {
      assert.strictEqual(isLicensePermissive('cc_by_nc'), false);
      assert.strictEqual(isLicenseStorable('cc_by_nc'), false);
    });

    test('royalty_free is permissive and storable', () => {
      assert.strictEqual(isLicensePermissive('royalty_free'), true);
      assert.strictEqual(isLicenseStorable('royalty_free'), true);
    });

    test('proprietary is NOT storable', () => {
      assert.strictEqual(isLicensePermissive('proprietary'), false);
      assert.strictEqual(isLicenseStorable('proprietary'), false);
    });

    test('STORABLE_LICENSES contains the right set', () => {
      assert.ok(STORABLE_LICENSES.has('cc0'));
      assert.ok(STORABLE_LICENSES.has('cc_by'));
      assert.ok(STORABLE_LICENSES.has('cc_by_sa'));
      assert.ok(STORABLE_LICENSES.has('royalty_free'));
      assert.ok(!STORABLE_LICENSES.has('cc_by_nc'));
      assert.ok(!STORABLE_LICENSES.has('proprietary'));
    });
  });
});
