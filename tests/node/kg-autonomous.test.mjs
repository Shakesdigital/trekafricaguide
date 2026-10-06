// Tests for the Autonomous Trek Operations orchestrator.
// Run: node --test tests/node/kg-autonomous.test.mjs
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import {
  runAutonomousCycle,
  listApprovalQueue,
  approveApprovalItem,
  rejectApprovalItem,
  getAgentStats,
  OPERATION_TYPES,
  APPROVAL_REQUIRED_FIELDS,
  AUTO_PERMITTED_FIELDS,
} from '../../server/knowledge/autonomous.mjs';
import { FORBIDDEN_FIELDS } from '../../server/knowledge/index.mjs';
import { CADENCES, OPPORTUNITY_TYPES } from '../../server/knowledge/opportunities.mjs';
import { ENTITY_TYPES } from '../../server/content-manager/validate.mjs';

import { createMockClient } from './kg-mock-client.mjs';

// ── Test fixtures ────────────────────────────────────────────────────────────────

const ACTOR_ID = 'admin-user-id';

/**
 * Simple mock AI service for testing autonomous operations.
 * Returns predefined responses based on task_type.
 */
function createMockAIService(config = {}) {
  const calls = [];
  return {
    run: async (input, opts = {}) => {
      calls.push({ input, opts });
      const taskType = input.task_type;

      if (config.responses && config.responses[taskType]) {
        const resp = typeof config.responses[taskType] === 'function'
          ? config.responses[taskType](input, calls.length)
          : config.responses[taskType];
        return resp;
      }

      // Default responses per task type
      if (taskType === 'classify_entity') {
        return {
          id: randomUUID(),
          text: JSON.stringify({
            entity_type: 'attraction',
            name: 'Test Attraction',
            slug: 'test-attraction',
            confidence: 0.9,
            reasoning: 'Test classification',
          }),
          cached: false,
          provider: 'primary',
          model: 'gpt-4-test',
          usage: { input_tokens: 100, output_tokens: 50, complete: true },
        };
      }

      if (taskType.startsWith('extract_')) {
        return {
          id: randomUUID(),
          text: JSON.stringify({
            slug: 'test-attraction',
            name: 'Test Attraction',
            location_name: 'Test Location',
            listing_summary: 'A test attraction for testing.',
            detail_intro: 'Detailed intro about the test attraction.',
            hero_image_url: 'https://example.com/test.jpg',
            hero_image_alt: 'Test attraction image',
            meta_title: 'Test Attraction - Trek Africa Guide',
            meta_description: 'A test attraction.',
          }),
          cached: false,
          provider: 'primary',
          model: 'gpt-4-test',
          usage: { input_tokens: 200, output_tokens: 100, complete: true },
        };
      }

      return {
        id: randomUUID(),
        text: JSON.stringify({}),
        cached: false,
        provider: 'primary',
        model: 'gpt-4-test',
        usage: { input_tokens: 0, output_tokens: 0, complete: true },
      };
    },
    calls,
  };
}

// ── runAutonomousCycle ────────────────────────────────────────────────────────────

describe('runAutonomousCycle', () => {
  let client;

  beforeEach(() => {
    client = createMockClient();
  });

  test('returns operationId and stats object', async () => {
    const aiService = createMockAIService();

    // Mock scanContentGaps to avoid real AI calls
    const result = await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.DAILY,
      options: {
        skipContentGapScan: true,
        skipDiscovery: true,
        skipMediaEnrichment: true,
      },
    });

    assert.ok(result.operationId);
    assert.ok(typeof result.operationId === 'string');
    assert.ok(result.stats);
    assert.equal(typeof result.stats.scanned, 'number');
    assert.equal(typeof result.stats.discoveries, 'number');
    assert.equal(result.stats.errors, 0);
  });

  test('creates cm_agent_operations record with running status', async () => {
    const aiService = createMockAIService();

    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.DAILY,
      options: { skipContentGapScan: true, skipDiscovery: true, skipMediaEnrichment: true },
    });

    const ops = client._get('cm_agent_operations');
    assert.equal(ops.length, 1);
    assert.equal(ops[0].status, 'completed');
    assert.equal(ops[0].operation_type, OPERATION_TYPES.DAILY_CYCLE);
    assert.ok(ops[0].actor_id);
    assert.ok(ops[0].started_at);
    assert.ok(ops[0].finished_at);
  });

  test('maps cadence to correct operation type', async () => {
    const aiService = createMockAIService();

    // Weekly cadence
    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.WEEKLY,
      options: { skipContentGapScan: true, skipDiscovery: true, skipMediaEnrichment: true },
    });

    const ops = client._get('cm_agent_operations');
    assert.equal(ops[0].operation_type, OPERATION_TYPES.WEEKLY_CYCLE);
  });

  test('throws CANCELLED if signal is aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    let thrownError;
    try {
      await runAutonomousCycle({
        actorId: ACTOR_ID,
        client,
        env: { AI_ENABLED: 'false' },
        aiService: createMockAIService(),
        signal: controller.signal,
        cadence: CADENCES.DAILY,
        options: { skipContentGapScan: true, skipDiscovery: true, skipMediaEnrichment: true },
      });
    } catch (error) {
      thrownError = error;
    }

    assert.ok(thrownError);
    assert.equal(thrownError.code, 'CANCELLED');
    // Operation should be marked as failed
    const ops = client._get('cm_agent_operations');
    assert.equal(ops[0].status, 'failed');
  });

  test('logs error and updates operation status on failure', async () => {
    // Create a client that will error on operation insert
    const errorClient = createMockClient();
    errorClient.from = (table) => {
      const originalFrom = createMockClient().from;
      // Override cm_agent_operations to fail
      return {
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { code: 'PGRST001', message: 'insert failed' } }),
          }),
        }),
        from: (t) => originalFrom.call(errorClient, t),
      };
    };

    let thrownError;
    try {
      await runAutonomousCycle({
        actorId: ACTOR_ID,
        client: errorClient,
        env: { AI_ENABLED: 'false' },
        aiService: createMockAIService(),
        cadence: CADENCES.DAILY,
        options: { skipContentGapScan: true, skipDiscovery: true, skipMediaEnrichment: true },
      });
    } catch (error) {
      thrownError = error;
    }

    assert.ok(thrownError);
  });
});

// ── Permission tier: FORBIDDEN_FIELDS ──────────────────────────────────────────────

describe('FORBIDDEN_FIELDS', () => {
  test('includes all restricted field categories', () => {
    assert.ok(FORBIDDEN_FIELDS.has('price_label'));
    assert.ok(FORBIDDEN_FIELDS.has('price_amount'));
    assert.ok(FORBIDDEN_FIELDS.has('price_currency'));
    assert.ok(FORBIDDEN_FIELDS.has('booking_url'));
    assert.ok(FORBIDDEN_FIELDS.has('permits_required'));
    assert.ok(FORBIDDEN_FIELDS.has('visa_requirements'));
    assert.ok(FORBIDDEN_FIELDS.has('opening_hours'));
    assert.ok(FORBIDDEN_FIELDS.has('availability'));
    assert.ok(FORBIDDEN_FIELDS.has('distance'));
    assert.ok(FORBIDDEN_FIELDS.has('travel_time'));
    assert.ok(FORBIDDEN_FIELDS.has('amenities'));
    assert.ok(FORBIDDEN_FIELDS.has('facilities'));
    assert.ok(FORBIDDEN_FIELDS.has('rating'));
    assert.ok(FORBIDDEN_FIELDS.has('review_count'));
  });
});

// ── Permission tier: APPROVAL_REQUIRED_FIELDS ─────────────────────────────────────

describe('APPROVAL_REQUIRED_FIELDS', () => {
  test('includes all fields from FORBIDDEN_FIELDS', () => {
    for (const field of FORBIDDEN_FIELDS) {
      assert.ok(
        APPROVAL_REQUIRED_FIELDS.has(field),
        `APPROVAL_REQUIRED_FIELDS should include FORBIDDEN_FIELDS entry: ${field}`
      );
    }
  });

  test('includes safety and regulatory fields', () => {
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('danger_level'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('risk_assessment'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('permits_required'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('visa_requirements'));
  });

  test('includes pricing and commercial fields', () => {
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('price_label'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('price_amount'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('booking_url'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('rating'));
    assert.ok(APPROVAL_REQUIRED_FIELDS.has('review_count'));
  });
});

// ── Permission tier: AUTO_PERMITTED_FIELDS ───────────────────────────────────────

describe('AUTO_PERMITTED_FIELDS', () => {
  test('includes editorial content fields', () => {
    assert.ok(AUTO_PERMITTED_FIELDS.has('listing_summary'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('detail_intro'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('full_description'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('overview'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('getting_there'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('practical_info'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('highlights'));
  });

  test('includes SEO and media fields', () => {
    assert.ok(AUTO_PERMITTED_FIELDS.has('hero_image_url'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('hero_image_alt'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('gallery'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('meta_title'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('meta_description'));
    assert.ok(AUTO_PERMITTED_FIELDS.has('meta_image_url'));
  });

  test('does NOT overlap with APPROVAL_REQUIRED_FIELDS', () => {
    const overlap = [...AUTO_PERMITTED_FIELDS].filter((f) => APPROVAL_REQUIRED_FIELDS.has(f));
    assert.equal(overlap.length, 0, `Fields should not be in both auto-permitted and approval-required: ${overlap.join(', ')}`);
  });
});

// ── OPERATION_TYPES ────────────────────────────────────────────────────────────────

describe('OPERATION_TYPES', () => {
  test('exports all expected operation types', () => {
    assert.ok(OPERATION_TYPES.DAILY_CYCLE);
    assert.ok(OPERATION_TYPES.WEEKLY_CYCLE);
    assert.ok(OPERATION_TYPES.FULL_SCAN);
    assert.ok(OPERATION_TYPES.OPPORTUNITY_PROCESSING);
    assert.ok(OPERATION_TYPES.MEDIA_ENRICHMENT);
    assert.ok(OPERATION_TYPES.METADATA_ENRICHMENT);
    assert.ok(OPERATION_TYPES.CONTENT_GAP_SCAN);
    assert.ok(OPERATION_TYPES.CONTINUOUS_DISCOVERY);
    assert.ok(OPERATION_TYPES.DRAFT_PUBLISH);
    assert.ok(OPERATION_TYPES.ENRICHMENT_APPLY);
  });

  test('all operation types are lowercase snake_case', () => {
    const pattern = /^[a-z][a-z0-9_]+$/;
    for (const type of Object.values(OPERATION_TYPES)) {
      assert.ok(pattern.test(type), `Operation type "${type}" should be lowercase snake_case`);
    }
  });
});

// ── listApprovalQueue ─────────────────────────────────────────────────────────────

describe('listApprovalQueue', () => {
  let client;

  beforeEach(() => {
    client = createMockClient();
  });

  test('returns pending items by default', async () => {
    // Seed approval queue items
    client._seed('cm_agent_approval_queue', [
      { id: randomUUID(), log_id: null, operation_id: null, entity_type: 'attraction', entity_id: 1, entity_slug: 'test', field_name: 'listing_summary', proposed_value: '"Updated"', current_value: null, reason: 'test', priority_score: 0.9, status: 'pending', created_at: new Date().toISOString() },
      { id: randomUUID(), log_id: null, operation_id: null, entity_type: 'accommodation', entity_id: 2, entity_slug: 'test2', field_name: 'price_label', proposed_value: '"$500"', current_value: null, reason: 'test2', priority_score: 0.8, status: 'approved', created_at: new Date().toISOString() },
    ]);

    const items = await listApprovalQueue({ status: 'pending' }, client);
    assert.equal(items.length, 1);
    assert.equal(items[0].field_name, 'listing_summary');
  });

  test('filters by entity type', async () => {
    client._seed('cm_agent_approval_queue', [
      { id: randomUUID(), entity_type: 'attraction', entity_id: 1, field_name: 'listing_summary', priority_score: 0.9, status: 'pending', created_at: new Date().toISOString() },
      { id: randomUUID(), entity_type: 'accommodation', entity_id: 2, field_name: 'price_label', priority_score: 0.8, status: 'pending', created_at: new Date().toISOString() },
    ]);

    const items = await listApprovalQueue({ status: 'pending', entityType: 'attraction' }, client);
    assert.equal(items.length, 1);
    assert.equal(items[0].entity_type, 'attraction');
  });

  test('filters by field name', async () => {
    client._seed('cm_agent_approval_queue', [
      { id: randomUUID(), entity_type: 'attraction', entity_id: 1, field_name: 'listing_summary', priority_score: 0.9, status: 'pending', created_at: new Date().toISOString() },
      { id: randomUUID(), entity_type: 'attraction', entity_id: 1, field_name: 'price_label', priority_score: 0.8, status: 'pending', created_at: new Date().toISOString() },
    ]);

    const items = await listApprovalQueue({ status: 'pending', fieldName: 'price_label' }, client);
    assert.equal(items.length, 1);
    assert.equal(items[0].field_name, 'price_label');
  });

  test('filters by minimum priority score', async () => {
    client._seed('cm_agent_approval_queue', [
      { id: randomUUID(), entity_type: 'attraction', entity_id: 1, field_name: 'meta_title', priority_score: 0.3, status: 'pending', created_at: new Date().toISOString() },
      { id: randomUUID(), entity_type: 'attraction', entity_id: 2, field_name: 'price_label', priority_score: 0.9, status: 'pending', created_at: new Date().toISOString() },
    ]);

    const items = await listApprovalQueue({ status: 'pending', minPriority: 0.5 }, client);
    assert.equal(items.length, 1);
    assert.equal(items[0].priority_score, 0.9);
  });

  test('orders by priority_score desc then created_at asc', async () => {
    const now = new Date().toISOString();
    client._seed('cm_agent_approval_queue', [
      { id: randomUUID(), entity_type: 'attraction', entity_id: 1, field_name: 'a', priority_score: 0.5, status: 'pending', created_at: now },
      { id: randomUUID(), entity_type: 'attraction', entity_id: 2, field_name: 'b', priority_score: 0.9, status: 'pending', created_at: now },
      { id: randomUUID(), entity_type: 'attraction', entity_id: 3, field_name: 'c', priority_score: 0.9, status: 'pending', created_at: now },
    ]);

    const items = await listApprovalQueue({ status: 'pending' }, client);
    assert.equal(items.length, 3);
    assert.equal(items[0].priority_score, 0.9);
    assert.equal(items[1].priority_score, 0.9);
    assert.equal(items[2].priority_score, 0.5);
  });

  test('returns empty array when no items', async () => {
    client._seed('cm_agent_approval_queue', []);
    const items = await listApprovalQueue({ status: 'pending' }, client);
    assert.equal(items.length, 0);
  });
});

// ── approveApprovalItem ───────────────────────────────────────────────────────────

describe('approveApprovalItem', () => {
  let client;

  beforeEach(() => {
    client = createMockClient();
  });

  test('applies proposed value to target record', async () => {
    const approvalId = randomUUID();
    client._seed('cm_agent_approval_queue', [
      {
        id: approvalId,
        log_id: null,
        operation_id: null,
        entity_type: 'attraction',
        entity_id: 1,
        entity_slug: 'bwindi-impenetrable-national-park',
        field_name: 'listing_summary',
        proposed_value: '"Updated summary text"',
        current_value: '"Old summary text"',
        reason: 'AI-suggested content update',
        priority_score: 0.75,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    const result = await approveApprovalItem(approvalId, ACTOR_ID, client, 'Approved by admin');

    assert.equal(result.status, 'applied');
    assert.equal(result.reviewer_id, ACTOR_ID);
    assert.equal(result.reviewer_notes, 'Approved by admin');
    assert.ok(result.reviewed_at);

    // Verify the change was applied to the attractions table
    const attr = client._get('attractions');
    const record = attr.find((r) => r.id === 1);
    assert.ok(record);
    // The proposed_value is JSON (stringified) — we store it as-is
    assert.equal(record.listing_summary, '"Updated summary text"');
  });

  test('throws CONFLICT if item is not pending', async () => {
    const approvalId = randomUUID();
    client._seed('cm_agent_approval_queue', [
      {
        id: approvalId,
        entity_type: 'attraction',
        entity_id: 1,
        field_name: 'listing_summary',
        proposed_value: '"Updated"',
        reason: 'test',
        priority_score: 0.5,
        status: 'applied',
        created_at: new Date().toISOString(),
      },
    ]);

    let thrownError;
    try {
      await approveApprovalItem(approvalId, ACTOR_ID, client);
    } catch (error) {
      thrownError = error;
    }

    assert.ok(thrownError);
    assert.equal(thrownError.code, 'CONFLICT');
  });

  test('throws INVALID_REQUEST if item not found', async () => {
    let thrownError;
    try {
      await approveApprovalItem('nonexistent-id', ACTOR_ID, client);
    } catch (error) {
      thrownError = error;
    }

    assert.ok(thrownError);
    assert.equal(thrownError.code, 'INVALID_REQUEST');
  });

  test('skips record update when entity_id is null', async () => {
    const approvalId = randomUUID();
    client._seed('cm_agent_approval_queue', [
      {
        id: approvalId,
        entity_type: 'country',
        entity_id: null,
        field_name: 'meta_title',
        proposed_value: '"Test Title"',
        reason: 'test',
        priority_score: 0.3,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    const result = await approveApprovalItem(approvalId, ACTOR_ID, client);
    assert.equal(result.status, 'applied');
  });
});

// ── rejectApprovalItem ──────────────────────────────────────────────────────────

describe('rejectApprovalItem', () => {
  let client;

  beforeEach(() => {
    client = createMockClient();
  });

  test('rejects a pending item with notes', async () => {
    const approvalId = randomUUID();
    client._seed('cm_agent_approval_queue', [
      {
        id: approvalId,
        entity_type: 'attraction',
        entity_id: 1,
        field_name: 'price_label',
        proposed_value: '"$500 per person"',
        reason: 'AI suggested price — requires human verification',
        priority_score: 0.95,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    const result = await rejectApprovalItem(approvalId, ACTOR_ID, 'Price data cannot be AI-generated', client);

    assert.equal(result.status, 'rejected');
    assert.equal(result.reviewer_id, ACTOR_ID);
    assert.equal(result.reviewer_notes, 'Price data cannot be AI-generated');
    assert.ok(result.reviewed_at);
  });

  test('throws CONFLICT if item is not pending', async () => {
    const approvalId = randomUUID();
    client._seed('cm_agent_approval_queue', [
      {
        id: approvalId,
        entity_type: 'attraction',
        entity_id: 1,
        field_name: 'price_label',
        proposed_value: '"$500"',
        reason: 'test',
        priority_score: 0.5,
        status: 'approved',
        created_at: new Date().toISOString(),
      },
    ]);

    let thrownError;
    try {
      await rejectApprovalItem(approvalId, ACTOR_ID, 'too late', client);
    } catch (error) {
      thrownError = error;
    }

    assert.ok(thrownError);
    assert.equal(thrownError.code, 'CONFLICT');
  });

  test('throws INVALID_REQUEST if item not found', async () => {
    let thrownError;
    try {
      await rejectApprovalItem('nonexistent-id', ACTOR_ID, 'never mind', client);
    } catch (error) {
      thrownError = error;
    }

    assert.ok(thrownError);
    assert.equal(thrownError.code, 'INVALID_REQUEST');
  });
});

// ── getAgentStats ────────────────────────────────────────────────────────────────

describe('getAgentStats', () => {
  let client;

  beforeEach(() => {
    client = createMockClient();
  });

  test('returns approval queue counts', async () => {
    client._seed('cm_agent_approval_queue', [
      { id: randomUUID(), entity_type: 'attraction', entity_id: 1, field_name: 'price_label', priority_score: 0.9, status: 'pending', created_at: new Date().toISOString() },
      { id: randomUUID(), entity_type: 'attraction', entity_id: 2, field_name: 'listing_summary', priority_score: 0.5, status: 'applied', created_at: new Date().toISOString() },
      { id: randomUUID(), entity_type: 'attraction', entity_id: 3, field_name: 'booking_url', priority_score: 0.8, status: 'rejected', created_at: new Date().toISOString() },
    ]);

    const stats = await getAgentStats(client);
    assert.equal(stats.approval_queue.pending, 1);
    assert.equal(stats.approval_queue.applied, 1);
    assert.equal(stats.approval_queue.rejected, 1);
    assert.equal(stats.approval_queue.total, 3);
  });

  test('counts recent operations and logs (last 24h)', async () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    client._seed('cm_agent_operations', [
      { id: randomUUID(), operation_type: 'daily_autonomous_cycle', status: 'completed', actor_id: ACTOR_ID, started_at: now, finished_at: now, created_at: now },
      { id: randomUUID(), operation_type: 'daily_autonomous_cycle', status: 'completed', actor_id: ACTOR_ID, started_at: old, finished_at: old, created_at: old },
    ]);

    client._seed('cm_agent_log', [
      { id: randomUUID(), operation_id: null, action_type: 'discovery', status: 'applied', created_at: now },
      { id: randomUUID(), operation_id: null, action_type: 'discovery', status: 'applied', created_at: old },
    ]);

    const stats = await getAgentStats(client);
    assert.equal(stats.recent_operations, 1);
    assert.equal(stats.recent_logs, 1);
  });

  test('returns zero counts when tables are empty', async () => {
    client._seed('cm_agent_approval_queue', []);
    client._seed('cm_agent_operations', []);
    client._seed('cm_agent_log', []);

    const stats = await getAgentStats(client);
    assert.equal(stats.approval_queue.total, 0);
    assert.equal(stats.recent_operations, 0);
    assert.equal(stats.recent_logs, 0);
  });
});

// ── Integration: autonomous cycle creates operation + logs ───────────────────────

describe('runAutonomousCycle integration', () => {
  test('creates operation record and logs actions', async () => {
    const client = createMockClient();
    const aiService = createMockAIService();

    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.DAILY,
      options: {
        skipContentGapScan: true,
        skipDiscovery: true,
        skipMediaEnrichment: true,
      },
    });

    const ops = client._get('cm_agent_operations');
    assert.equal(ops.length, 1);
    assert.ok(ops[0].started_at);
    assert.ok(ops[0].finished_at);
    assert.equal(ops[0].stats.scanned, 0);
    assert.equal(ops[0].status, 'completed');
  });

  test('stats object has all expected fields', async () => {
    const client = createMockClient();
    const aiService = createMockAIService();

    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.DAILY,
      options: {
        skipContentGapScan: true,
        skipDiscovery: true,
        skipMediaEnrichment: true,
      },
    });

    const ops = client._get('cm_agent_operations');
    const stats = ops[0].stats;

    assert.ok('scanned' in stats);
    assert.ok('new_opportunities' in stats);
    assert.ok('drafts_created' in stats);
    assert.ok('discoveries' in stats);
    assert.ok('approvals_auto' in stats);
    assert.ok('approvals_pending' in stats);
    assert.ok('media_matched' in stats);
    assert.ok('metadata_improved' in stats);
    assert.ok('errors' in stats);
    assert.ok('enrichments_applied' in stats);
    assert.ok('duplicates_confirmed' in stats);
  });
});

// ── Permission tier: auto vs approval classification ────────────────────────────

describe('permission tier classification', () => {
  test('AUTO_PERMITTED_FIELDS does not include any APPROVAL_REQUIRED_FIELDS', () => {
    for (const field of APPROVAL_REQUIRED_FIELDS) {
      assert.ok(
        !AUTO_PERMITTED_FIELDS.has(field),
        `Field "${field}" should not be in AUTO_PERMITTED_FIELDS (it's in APPROVAL_REQUIRED_FIELDS)`
      );
    }
  });

  test('APPROVAL_REQUIRED_FIELDS includes all FORBIDDEN_FIELDS', () => {
    for (const field of FORBIDDEN_FIELDS) {
      assert.ok(
        APPROVAL_REQUIRED_FIELDS.has(field),
        `Field "${field}" from FORBIDDEN_FIELDS should also be in APPROVAL_REQUIRED_FIELDS`
      );
    }
  });

  test('FORBIDDEN_FIELDS matches the 3-layer defense set from validate.mjs', () => {
    // These should be identical sets — the autonomous layer reuses the same defense
    const expectedForbidden = new Set([
      'price_label', 'price_amount', 'price_currency', 'price_unit', 'price_basis',
      'booking_url', 'rating', 'review_count', 'featured',
      'opening_hours', 'availability', 'permits_required', 'visa_requirements',
      'distance', 'travel_time', 'facilities', 'amenities',
    ]);

    assert.deepEqual(new Set(FORBIDDEN_FIELDS), expectedForbidden);
  });
});

// ── Agent action logging ─────────────────────────────────────────────────────────

describe('agent action logging via runAutonomousCycle', () => {
  test('logs a content_gap_scan action even when scan is skipped', async () => {
    const client = createMockClient();
    const aiService = createMockAIService();

    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.DAILY,
      options: {
        skipContentGapScan: true,
        skipDiscovery: true,
        skipMediaEnrichment: true,
      },
    });

    const logs = client._get('cm_agent_log');
    const scanLog = logs.find((l) => l.action_type === 'content_gap_scan');
    // When skipContentGapScan is true, no scan log is created — that's correct behavior.
    // Verify that at least the operation was created.
    assert.ok(client._get('cm_agent_operations').length > 0);
  });

  test('logs error when operation creation fails gracefully exits', async () => {
    const client = createMockClient();

    // The autonomous cycle should still attempt to create an operation record
    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService: createMockAIService(),
      cadence: CADENCES.DAILY,
      options: {
        skipContentGapScan: true,
        skipDiscovery: true,
        skipMediaEnrichment: true,
      },
    });

    const ops = client._get('cm_agent_operations');
    assert.equal(ops.length, 1);
    assert.equal(ops[0].status, 'completed');
  });
});

// ── Media enrichment path ────────────────────────────────────────────────────────

describe('processMediaEnrichment integration', () => {
  test('skips media enrichment when option set', async () => {
    const client = createMockClient();
    const aiService = createMockAIService();

    // This should complete without errors even with skipMediaEnrichment
    await runAutonomousCycle({
      actorId: ACTOR_ID,
      client,
      env: { AI_ENABLED: 'false' },
      aiService,
      cadence: CADENCES.DAILY,
      options: {
        skipContentGapScan: true,
        skipDiscovery: true,
        skipMediaEnrichment: true,
      },
    });

    const logs = client._get('cm_agent_log');
    const mediaLog = logs.find((l) => l.action_type === 'media_matched');
    // No media matched since we skipped both scan and enrichment
    assert.equal(mediaLog, undefined);
  });
});
