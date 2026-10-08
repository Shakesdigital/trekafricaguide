// Tests for the Netlify rebuild trigger (build-trigger.mjs).
// Run: node --test tests/node/kg-build-trigger.test.mjs
import { test, describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';

import { triggerNetlifyRebuild } from '../../server/knowledge/build-trigger.mjs';
import { createMockClient } from './kg-mock-client.mjs';

describe('triggerNetlifyRebuild', () => {
  let mockFetch;
  let client;

  beforeEach(() => {
    client = createMockClient({});
    // Seed site_settings with a deploy hook
    client._seed('site_settings', [
      { key: 'netlify_deploy_hook', value: 'https://api.netlify.com/build_hooks/test-hook-id' },
      { key: 'site_name', value: 'Trek Africa Guide' },
    ]);

    mockFetch = mock.fn(async (url, opts) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      };
    });

    // Replace global fetch
    global.fetch = mockFetch;
  });

  test('sends POST to deploy hook URL from site_settings', async () => {
    const result = await triggerNetlifyRebuild(client, {
      entityType: 'attractions',
      entityId: 42,
    });

    assert.equal(mockFetch.mock.calls.length, 1);
    const [url, opts] = mockFetch.mock.calls[0].arguments;
    assert.equal(url, 'https://api.netlify.com/build_hooks/test-hook-id');
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers['Content-Type'], 'application/json');

    const body = JSON.parse(opts.body);
    assert.equal(body.triggered_by, 'cms_content_change');
    assert.equal(body.entity_type, 'attractions');
    assert.equal(body.entity_id, 42);
    assert.ok(body.timestamp);

    assert.equal(result, true);
  });

  test('returns false and does not fetch when deploy hook is not configured', async () => {
    client._seed('site_settings', [
      { key: 'site_name', value: 'Trek Africa Guide' },
    ]);

    const result = await triggerNetlifyRebuild(client);

    assert.equal(mockFetch.mock.calls.length, 0);
    assert.equal(result, false);
  });

  test('returns false and does not fetch when deploy hook value is null', async () => {
    client._seed('site_settings', [
      { key: 'netlify_deploy_hook', value: null },
    ]);

    const result = await triggerNetlifyRebuild(client);

    assert.equal(mockFetch.mock.calls.length, 0);
    assert.equal(result, false);
  });

  test('returns false when fetch fails (network error)', async () => {
    mockFetch.mock.mockImplementationOnce(async () => {
      throw new Error('Network error');
    });

    const result = await triggerNetlifyRebuild(client);

    assert.equal(result, false);
  });

  test('returns false when fetch response is not ok', async () => {
    mockFetch.mock.mockImplementationOnce(async () => {
      return { ok: false, status: 500 };
    });

    const result = await triggerNetlifyRebuild(client);

    assert.equal(result, false);
  });

  test('handles missing optional parameters', async () => {
    const result = await triggerNetlifyRebuild(client);

    assert.equal(mockFetch.mock.calls.length, 1);
    const body = JSON.parse(mockFetch.mock.calls[0].arguments[1].body);
    assert.equal(body.triggered_by, 'cms_content_change');
    assert.equal(body.entity_type, null);
    assert.equal(body.entity_id, null);
    assert.equal(result, true);
  });

  test('respects AbortSignal if provided', async () => {
    const controller = new AbortController();

    const resultPromise = triggerNetlifyRebuild(client, { signal: controller.signal });
    controller.abort();

    const result = await resultPromise;
    // Should complete (return false) without throwing
    assert.equal(result, false);
  });
});
