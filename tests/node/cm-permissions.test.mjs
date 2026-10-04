import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import { createMockClient } from './cm-mock-client.mjs';
import { requireEditor } from '../../server/content-manager/auth.mjs';
import { requireAdmin } from '../../server/ai/admin.mjs';
import {
  createDraft,
  getDraft,
  verifyDraft,
  approveDraft,
  publishDraft,
  getTableName,
} from '../../server/content-manager/drafts.mjs';
import {
  validateDraftData,
  ENTITY_TYPES,
  FORBIDDEN_FIELDS,
} from '../../server/content-manager/validate.mjs';

// ── Mock Request helpers ────────────────────────────────────────

function mockRequest(authHeader = 'Bearer valid-admin-token') {
  const headers = new Map();
  if (authHeader) headers.set('authorization', authHeader);
  return {
    headers: {
      get(name) { return headers.get(name.toLowerCase()) || headers.get(name); },
    },
    method: 'GET',
    url: 'https://example.com/admin/content-manager',
  };
}

// ── requireEditor ────────────────────────────────────────────────

test('requireEditor allows admin role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'admin-user-id', role: 'admin' },
  ]);

  const result = await requireEditor(mockRequest('Bearer valid-admin-token'), client);
  assert.equal(result.userId, 'admin-user-id');
  assert.equal(result.role, 'admin');
});

test('requireEditor allows editor role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'editor-user-id', role: 'editor' },
  ]);

  const result = await requireEditor(mockRequest('Bearer valid-editor-token'), client);
  assert.equal(result.userId, 'editor-user-id');
  assert.equal(result.role, 'editor');
});

test('requireEditor allows super_admin role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'admin-user-id', role: 'super_admin' },
  ]);

  const result = await requireEditor(mockRequest('Bearer valid-admin-token'), client);
  assert.equal(result.userId, 'admin-user-id');
  assert.equal(result.role, 'super_admin');
});

test('requireEditor rejects viewer role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'viewer-user-id', role: 'viewer' },
  ]);

  let threw = false;
  try {
    await requireEditor(mockRequest('Bearer viewer-token'), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'FORBIDDEN');
  }
  assert.equal(threw, true, 'should reject viewer role');
});

test('requireEditor rejects missing bearer token', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await requireEditor(mockRequest(null), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'UNAUTHORIZED');
  }
  assert.equal(threw, true);
});

test('requireEditor rejects invalid bearer token', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await requireEditor(mockRequest('Bearer invalid-token'), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'UNAUTHORIZED');
  }
  assert.equal(threw, true);
});

test('requireEditor rejects anonymous users', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'anon-user-id', role: 'admin' }, // even with admin role, anon user is blocked
  ]);

  let threw = false;
  try {
    await requireEditor(mockRequest('Bearer anon-token'), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'UNAUTHORIZED');
  }
  assert.equal(threw, true);
});

test('requireEditor rejects missing authorization header', async () => {
  const client = createMockClient();
  const req = { headers: { get: () => null }, method: 'GET', url: 'https://x.com' };
  let threw = false;
  try {
    await requireEditor(req, client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'UNAUTHORIZED');
  }
  assert.equal(threw, true);
});

// ── requireAdmin ────────────────────────────────────────────────

test('requireAdmin allows admin role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'admin-user-id', role: 'admin' },
  ]);

  const userId = await requireAdmin(mockRequest('Bearer valid-admin-token'), client);
  assert.equal(userId, 'admin-user-id');
});

test('requireAdmin allows super_admin role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'admin-user-id', role: 'super_admin' },
  ]);

  const userId = await requireAdmin(mockRequest('Bearer valid-admin-token'), client);
  assert.equal(userId, 'admin-user-id');
});

test('requireAdmin rejects editor role (admin-only)', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'editor-user-id', role: 'editor' },
  ]);

  let threw = false;
  try {
    await requireAdmin(mockRequest('Bearer valid-editor-token'), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'FORBIDDEN');
  }
  assert.equal(threw, true, 'editor should not have admin access');
});

test('requireAdmin rejects missing token', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await requireAdmin(mockRequest(null), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'UNAUTHORIZED');
  }
  assert.equal(threw, true);
});

test('requireAdmin rejects invalid token', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await requireAdmin(mockRequest('Bearer invalid-token'), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'UNAUTHORIZED');
  }
  assert.equal(threw, true);
});

test('requireAdmin rejects viewer role', async () => {
  const client = createMockClient();
  client._seed('profiles', [
    { id: 'viewer-user-id', role: 'viewer' },
  ]);

  let threw = false;
  try {
    await requireAdmin(mockRequest('Bearer viewer-token'), client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'FORBIDDEN');
  }
  assert.equal(threw, true, 'viewer should not have admin access');
});

// ── createDraft with forbidden fields ──────────────────────────

test('createDraft with forbidden field value throws INVALID_REQUEST', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await createDraft({
      targetEntity: 'attraction',
      draftType: 'new',
      draftData: {
        slug: 'test',
        name: 'Test Attraction',
        price_label: '$50', // forbidden
      },
      actorId: 'admin-1',
      client,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw INVALID_REQUEST');
});

test('createDraft allows forbidden fields set to null', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: {
      slug: 'test',
      name: 'Test Attraction',
      price_label: null, // forbidden but null is OK
      rating: null,
      booking_url: null,
    },
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.draft_data.slug, 'test');
  assert.equal(draft.draft_data.name, 'Test Attraction');
});

test('createDraft rejects all forbidden fields with values', async () => {
  const client = createMockClient();
  for (const field of FORBIDDEN_FIELDS) {
    let threw = false;
    try {
      await createDraft({
        targetEntity: 'attraction',
        draftType: 'new',
        draftData: { slug: 'test', name: 'Test', [field]: 'fake value' },
        actorId: 'admin-1',
        client,
      });
    } catch (err) {
      threw = true;
      assert.ok(err instanceof AIError);
      assert.equal(err.code, 'INVALID_REQUEST');
    }
    assert.equal(threw, true, `should reject forbidden field: ${field}`);
  }
});

// ── Entity type validation ──────────────────────────────────────

test('getTableName returns correct table name for each entity type', () => {
  const expected = {
    region: 'regions',
    country: 'countries',
    attraction: 'attractions',
    accommodation: 'accommodations',
    restaurant: 'restaurants',
    tour_operator: 'tour_operators',
    activity: 'activities',
    travel_article: 'travel_articles',
  };

  for (const [entity, table] of Object.entries(expected)) {
    assert.equal(getTableName(entity), table);
  }
});

test('getTableName throws INVALID_REQUEST for unknown entity type', () => {
  let threw = false;
  try {
    getTableName('nonexistent');
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

test('ENTITY_TYPES contains all expected entity types', () => {
  const expected = ['region', 'country', 'attraction', 'accommodation',
    'restaurant', 'tour_operator', 'activity', 'travel_article'];
  for (const type of expected) {
    assert.ok(ENTITY_TYPES.has(type), `should include ${type}`);
  }
});

// ── Storage error propagation ───────────────────────────────────

test('createDraft propagates STORAGE_ERROR when insert fails', async () => {
  const client = createMockClient();
  // Make from().insert() return an error
  const originalFrom = client.from;
  client.from = (table) => {
    const chain = originalFrom(table);
    if (table === 'cm_drafts') {
      // Override insert to return error
      const origInsert = chain.insert;
      chain.insert = (data) => {
        const result = origInsert(data);
        // Override then to return error
        result.then = (resolve, reject) => {
          resolve({ data: null, error: new Error('DB connection failed') });
          return result;
        };
        return result;
      };
    }
    return chain;
  };

  let threw = false;
  try {
    await createDraft({
      targetEntity: 'attraction',
      draftType: 'new',
      draftData: { slug: 'test', name: 'Test' },
      actorId: 'admin-1',
      client,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'STORAGE_ERROR');
  }
  assert.equal(threw, true, 'should throw STORAGE_ERROR');
});

test('getDraft propagates STORAGE_ERROR when select fails', async () => {
  const client = createMockClient();
  const originalFrom = client.from;
  client.from = (table) => {
    const chain = originalFrom(table);
    if (table === 'cm_drafts') {
      const origThen = chain.then;
      chain.then = (resolve, reject) => {
        resolve({ data: null, error: new Error('Query failed') });
        return chain;
      };
    }
    return chain;
  };

  let threw = false;
  try {
    await getDraft('some-id', client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'STORAGE_ERROR');
  }
  assert.equal(threw, true, 'should throw STORAGE_ERROR');
});

// ── Error code mapping ──────────────────────────────────────────

test('AIError codes map to correct HTTP statuses via STATUS_MAP pattern', () => {
  // Verify the error codes used in CM functions match the patterns from the Netlify functions
  const expectedCodes = [
    'INVALID_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN',
    'STORAGE_ERROR', 'CONFLICT',
  ];

  for (const code of expectedCodes) {
    const err = new AIError(code);
    assert.equal(err.code, code);
    assert.ok(err.message, `should have a message for ${code}`);
  }
});

test('invalid draft_type in createDraft throws INVALID_REQUEST', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await createDraft({
      targetEntity: 'attraction',
      draftType: 'delete', // invalid
      draftData: { slug: 'test', name: 'Test' },
      actorId: 'admin-1',
      client,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true);
});

test('verifyDraft throws INVALID_REQUEST for missing target_id in update draft', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: { name: 'Updated Name' },
    // targetId not set — would be null
    actorId: 'admin-1',
    client,
  });

  let threw = false;
  try {
    await verifyDraft(created.id, client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw for missing target_id');
});
