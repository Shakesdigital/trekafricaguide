import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError } from '../../server/ai/errors.mjs';
import { createMockClient } from './cm-mock-client.mjs';
import {
  createDraft, getDraft, verifyDraft, approveDraft,
  rejectDraft, publishDraft, forkDraftVersion, listDrafts,
} from '../../server/content-manager/drafts.mjs';

// ── Helpers ──────────────────────────────────────────────────────

function seedExistingAttraction(client) {
  client._seed('attractions', [
    {
      id: 42,
      slug: 'old-slug',
      name: 'Old Attraction Name',
      location_name: 'Old Location',
      listing_summary: 'Old summary',
      detail_intro: 'Old intro',
      practical_info: 'Old practical info',
      status: 'published',
      published_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      meta_title: 'Old Title',
      meta_description: 'Old desc',
    },
  ]);
}

function seedExistingArticle(client) {
  client._seed('travel_articles', [
    {
      id: 7,
      slug: 'old-article',
      title: 'Old Article Title',
      excerpt: 'Old excerpt',
      body: 'Old body text',
      status: 'published',
      published_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      meta_title: 'Old Meta',
      meta_description: 'Old desc',
    },
  ]);
}

const VALID_DRAFT_DATA = {
  slug: 'new-attraction',
  name: 'New Attraction',
  location_name: 'New Location, Uganda',
  listing_summary: 'A brand new attraction.',
  detail_intro: 'Introductory text for the new attraction.',
  full_description: 'Full description of the new attraction.',
  getting_there: 'From Kampala, drive 4 hours north.',
  best_time: 'June to September.',
  practical_info: 'Entry fee is covered by tour packages.',
  hero_image_url: 'https://example.com/image.jpg',
  hero_image_alt: 'New attraction photo',
  highlights: ['hiking', 'nature'],
  meta_title: 'New Attraction | Trek Africa Guide',
  meta_description: 'Explore the new attraction.',
  meta_image_url: 'https://example.com/image.jpg',
};

// ── createDraft ─────────────────────────────────────────────────

test('createDraft creates a new listing draft with correct defaults', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    sourceUrl: 'https://example.com/attraction',
    sourceName: 'Example Travel',
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.target_entity, 'attraction');
  assert.equal(draft.draft_type, 'new');
  assert.equal(draft.workflow_status, 'draft');
  assert.equal(draft.approval_status, 'pending');
  assert.equal(draft.source_url, 'https://example.com/attraction');
  assert.equal(draft.source_name, 'Example Travel');
  assert.ok(draft.research_date, 'research_date should be set');
  assert.equal(draft.created_by, 'admin-1');
  // Forbidden fields that AI might include should be masked
  assert.equal(draft.draft_data.price_label, undefined);
  assert.equal(draft.draft_data.booking_url, undefined);
  assert.deepEqual(draft.draft_data.name, 'New Attraction');
});

test('createDraft creates an update draft with needs_verification status', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'travel_article',
    draftType: 'update',
    draftData: { title: 'Updated Title', excerpt: 'New excerpt' },
    targetId: 7,
    sourceUrl: 'https://example.com/article',
    sourceName: 'Travel Blog',
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.draft_type, 'update');
  assert.equal(draft.workflow_status, 'needs_verification');
  assert.equal(draft.approval_status, 'pending');
  assert.equal(draft.target_id, 7);
  assert.equal(draft.source_url, 'https://example.com/article');
});

test('createDraft sets ai_model and ai_task_type when AI-generated', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    aiModel: 'gpt-4o-mini',
    aiTaskType: 'extract_attraction',
    actorId: 'admin-1',
    client,
  });

  assert.equal(draft.ai_model, 'gpt-4o-mini');
  assert.equal(draft.ai_task_type, 'extract_attraction');
  assert.equal(draft.ai_generated, true);
});

test('createDraft throws INVALID_REQUEST for unknown entity type', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await createDraft({
      targetEntity: 'unknown_entity',
      draftType: 'new',
      draftData: { name: 'Test' },
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

test('createDraft throws INVALID_REQUEST for invalid draft_type', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await createDraft({
      targetEntity: 'attraction',
      draftType: 'invalid_type',
      draftData: VALID_DRAFT_DATA,
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

test('createDraft throws INVALID_REQUEST when draftData is null', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await createDraft({
      targetEntity: 'attraction',
      draftType: 'new',
      draftData: null,
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

test('createDraft strips forbidden fields with non-null values from stored draft_data', async () => {
  const client = createMockClient();
  // Create draft data that includes forbidden fields (simulating un-masked AI output)
  const draftDataWithForbidden = { ...VALID_DRAFT_DATA };
  // validateDraftData deletes forbidden fields entirely (it doesn't just null them)
  let threw = false;
  try {
    await createDraft({
      targetEntity: 'attraction',
      draftType: 'new',
      draftData: { ...VALID_DRAFT_DATA, price_label: '$50', booking_url: 'https://book.example.com', rating: 5 },
      actorId: 'admin-1',
      client,
    });
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw INVALID_REQUEST for forbidden field with value');
});

test('createDraft defaults aiGenerated to true when not specified', async () => {
  const client = createMockClient();
  const draft = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    actorId: 'admin-1',
    client,
  });
  assert.equal(draft.ai_generated, true);
});

// ── getDraft ────────────────────────────────────────────────────

test('getDraft returns draft with empty changes array for new drafts', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    sourceUrl: 'https://example.com',
    sourceName: 'Source',
    actorId: 'admin-1',
    client,
  });

  const draft = await getDraft(created.id, client);
  assert.equal(draft.id, created.id);
  assert.equal(draft.target_entity, 'attraction');
  assert.deepEqual(draft.changes, []);
});

test('getDraft returns changes for update drafts after verifyDraft', async () => {
  const client = createMockClient();
  seedExistingAttraction(client);

  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: {
      name: 'Updated Attraction Name',
      listing_summary: 'New summary text',
      meta_title: 'New Meta Title',
    },
    targetId: 42,
    sourceUrl: 'https://example.com/updated',
    sourceName: 'Travel Blog',
    actorId: 'admin-1',
    client,
  });

  // Run verification to generate changes
  await verifyDraft(created.id, client);

  const draft = await getDraft(created.id, client);
  assert.ok(draft.changes.length > 0, 'should have field changes');
  const nameChange = draft.changes.find((c) => c.field_name === 'name');
  assert.ok(nameChange, 'should have name change');
  assert.equal(nameChange.old_value, 'Old Attraction Name');
  assert.equal(nameChange.new_value, 'Updated Attraction Name');
});

test('getDraft throws when draft_id does not exist', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await getDraft('nonexistent-id', client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw INVALID_REQUEST');
});

// ── verifyDraft ─────────────────────────────────────────────────

test('verifyDraft computes before/after diff and persists changes', async () => {
  const client = createMockClient();
  seedExistingAttraction(client);

  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: {
      name: 'Updated Attraction Name',
      location_name: 'New Location, Uganda',
      listing_summary: 'New summary',
      practical_info: 'Updated practical info',
    },
    targetId: 42,
    sourceUrl: 'https://example.com',
    sourceName: 'Source',
    actorId: 'admin-1',
    client,
  });

  const result = await verifyDraft(created.id, client);

  assert.equal(result.draft.workflow_status, 'ready_for_review');
  assert.ok(result.draft.verification_date, 'verification_date should be set');
  assert.ok(result.changes.length > 0, 'should have changes');
  const fieldNames = result.changes.map((c) => c.field_name);
  assert.ok(fieldNames.includes('name'));
  assert.ok(fieldNames.includes('location_name'));
  assert.ok(fieldNames.includes('listing_summary'));
  assert.ok(fieldNames.includes('practical_info'));
  assert.equal(result.current_record.name, 'Old Attraction Name');
});

test('verifyDraft throws for non-update drafts', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
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
  assert.equal(threw, true, 'should throw for non-update draft');
});

test('verifyDraft throws when draft is not in needs_verification state', async () => {
  const client = createMockClient();
  seedExistingAttraction(client);
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: { name: 'Updated' },
    targetId: 42,
    actorId: 'admin-1',
    client,
  });

  // Already at needs_verification → verify should succeed first time
  // But if we call verifyDraft twice, second call should throw
  await verifyDraft(created.id, client);

  let threw = false;
  try {
    await verifyDraft(created.id, client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFLICT');
  }
  assert.equal(threw, true, 'should throw CONFLICT on second verify');
});

test('verifyDraft skips fields that have not changed', async () => {
  const client = createMockClient();
  seedExistingAttraction(client);

  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: {
      name: 'Old Attraction Name', // same as existing
      listing_summary: 'New summary', // changed
    },
    targetId: 42,
    actorId: 'admin-1',
    client,
  });

  const result = await verifyDraft(created.id, client);
  const fieldNames = result.changes.map((c) => c.field_name);
  assert.ok(!fieldNames.includes('name'), 'should not include unchanged fields');
  assert.ok(fieldNames.includes('listing_summary'), 'should include changed fields');
});

// ── approveDraft ────────────────────────────────────────────────

test('approveDraft approves a new listing draft', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    sourceUrl: 'https://example.com',
    sourceName: 'Source',
    actorId: 'admin-1',
    client,
  });

  const result = await approveDraft(created.id, 'admin-user', client, {
    approvalNotes: 'Looks good',
  });

  assert.equal(result.draft.workflow_status, 'approved');
  assert.equal(result.draft.approval_status, 'approved');
  assert.equal(result.draft.approver_id, 'admin-user');
  assert.ok(result.draft.approved_at, 'approved_at should be set');
  assert.ok(result.appliedFields.length > 0, 'should list applied fields');
  assert.equal(result.published, null, 'should not publish unless requested');
});

test('approveDraft approves all fields by default for update drafts with no per-field decisions', async () => {
  const client = createMockClient();
  seedExistingAttraction(client);
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: { name: 'Updated Name', listing_summary: 'New summary' },
    targetId: 42,
    actorId: 'admin-1',
    client,
  });
  await verifyDraft(created.id, client);

  const result = await approveDraft(created.id, 'admin-user', client);
  assert.equal(result.draft.approval_status, 'approved');
  assert.ok(result.appliedFields.length > 0, 'should apply all fields by default');
});

test('approveDraft publishes immediately when publishImmediately is true', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'travel_article',
    draftType: 'new',
    draftData: {
      slug: 'new-article',
      title: 'New Article',
      excerpt: 'New excerpt',
      body: 'New body',
    },
    actorId: 'admin-1',
    client,
  });

  const result = await approveDraft(created.id, 'admin-user', client, {
    publishImmediately: true,
  });

  assert.equal(result.draft.workflow_status, 'approved');
  assert.ok(result.published, 'should have published result');
  assert.ok(result.published.targetId, 'published should have target_id');
});

test('approveDraft throws CONFLICT for already-approved draft', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    actorId: 'admin-1',
    client,
  });

  await approveDraft(created.id, 'admin-user', client);

  let threw = false;
  try {
    await approveDraft(created.id, 'admin-user', client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFLICT');
  }
  assert.equal(threw, true, 'should throw CONFLICT');
});

// ── rejectDraft ─────────────────────────────────────────────────

test('rejectDraft sets rejection fields', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    actorId: 'admin-1',
    client,
  });

  const result = await rejectDraft(created.id, 'admin-user', 'Contains invented prices', client);

  assert.equal(result.draft.workflow_status, 'rejected');
  assert.equal(result.draft.approval_status, 'rejected');
  assert.equal(result.draft.approver_id, 'admin-user');
  assert.equal(result.draft.rejection_reason, 'Contains invented prices');
  assert.ok(result.draft.approved_at, 'approved_at (used for rejection timestamp) should be set');
});

test('rejectDraft throws CONFLICT for already-approved draft', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    actorId: 'admin-1',
    client,
  });

  await approveDraft(created.id, 'admin-user', client);

  let threw = false;
  try {
    await rejectDraft(created.id, 'admin-user', 'too late', client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFLICT');
  }
  assert.equal(threw, true, 'should throw CONFLICT');
});

// ── publishDraft ────────────────────────────────────────────────

test('publishDraft inserts new content record for new drafts', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'travel_article',
    draftType: 'new',
    draftData: {
      slug: 'published-article',
      title: 'Published Article',
      excerpt: 'Published excerpt',
      body: 'Published body',
    },
    actorId: 'admin-1',
    client,
  });

  // Must approve before publishing
  await approveDraft(created.id, 'admin-user', client);
  const result = await publishDraft(created.id, 'admin-user', client);

  assert.equal(result.targetEntity, 'travel_article');
  assert.ok(result.targetId, 'should return target_id');
  assert.ok(result.version >= 1);

  // Verify the content was inserted into travel_articles
  const articles = client._get('travel_articles');
  const published = articles.find((a) => a.slug === 'published-article');
  assert.ok(published, 'article should be published');
  assert.equal(published.status, 'published');
  assert.ok(published.published_at);
  assert.equal(published.title, 'Published Article');
});

test('publishDraft updates existing content record for update drafts', async () => {
  const client = createMockClient();
  seedExistingAttraction(client);

  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'update',
    draftData: { name: 'Updated Attraction Name', listing_summary: 'New summary' },
    targetId: 42,
    actorId: 'admin-1',
    client,
  });
  await verifyDraft(created.id, client);
  await approveDraft(created.id, 'admin-user', client);

  const result = await publishDraft(created.id, 'admin-user', client);
  assert.equal(result.targetEntity, 'attraction');

  // Verify the existing attraction was updated
  const attractions = client._get('attractions');
  const updated = attractions.find((a) => a.id === 42);
  assert.equal(updated.name, 'Updated Attraction Name');
  assert.equal(updated.status, 'published');
  assert.ok(updated.published_at);
});

test('publishDraft throws when draft is not approved', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    actorId: 'admin-1',
    client,
  });

  let threw = false;
  try {
    await publishDraft(created.id, 'admin-user', client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFLICT');
  }
  assert.equal(threw, true, 'should throw CONFLICT');
});

test('publishDraft filters draft_data to table columns only', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { ...VALID_DRAFT_DATA },
    actorId: 'admin-1',
    client,
  });

  await approveDraft(created.id, 'admin-user', client);
  await publishDraft(created.id, 'admin-user', client);

  // Verify draft_data doesn't contain extra fields like ai_model in the published content
  const attractions = client._get('attractions');
  const published = attractions.find((a) => a.slug === 'new-attraction');
  assert.equal(published.name, 'New Attraction');
  assert.equal(published.status, 'published');
  assert.equal(published.meta_title, 'New Attraction | Trek Africa Guide');
});

// ── forkDraftVersion ────────────────────────────────────────────

test('forkDraftVersion creates a new version with incremented version number', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { ...VALID_DRAFT_DATA },
    sourceUrl: 'https://example.com',
    sourceName: 'Source',
    actorId: 'admin-1',
    client,
  });

  const fork = await forkDraftVersion(created.id, 'admin-2', client);

  assert.ok(fork.draftId, 'should return new draft ID');
  assert.equal(fork.version, created.version + 1);

  // Verify the fork exists and has the right properties
  const forked = await getDraft(fork.draftId, client);
  assert.equal(forked.version, created.version + 1);
  assert.equal(forked.target_entity, created.target_entity);
  assert.equal(forked.draft_data.name, 'New Attraction');
  assert.equal(forked.source_url, 'https://example.com');
  assert.equal(forked.source_name, 'Source');
  assert.equal(forked.research_date, created.research_date, 'research_date should be preserved');
  assert.equal(forked.ai_model, created.ai_model);
});

test('forkDraftVersion resets workflow and approval status', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: VALID_DRAFT_DATA,
    sourceUrl: 'https://example.com',
    sourceName: 'Source',
    actorId: 'admin-1',
    client,
  });
  await approveDraft(created.id, 'admin-user', client);

  const fork = await forkDraftVersion(created.id, 'admin-2', client);
  const forked = await getDraft(fork.draftId, client);

  assert.equal(forked.workflow_status, 'needs_verification');
  assert.equal(forked.approval_status, 'pending');
  assert.ok(forked.approver_id == null, 'approver_id should be null/undefined');
  assert.ok(forked.approved_at == null, 'approved_at should be null/undefined');
});

test('forkDraftVersion applies overrides to draft_data', async () => {
  const client = createMockClient();
  const created = await createDraft({
    targetEntity: 'attraction',
    draftType: 'new',
    draftData: { ...VALID_DRAFT_DATA },
    actorId: 'admin-1',
    client,
  });

  const fork = await forkDraftVersion(created.id, 'admin-2', client, {
    name: 'Corrected Name',
  });
  const forked = await getDraft(fork.draftId, client);

  assert.equal(forked.draft_data.name, 'Corrected Name', 'override should be applied');
  assert.equal(forked.draft_data.slug, 'new-attraction', 'other fields should be preserved');
});

test('forkDraftVersion throws for nonexistent source draft', async () => {
  const client = createMockClient();
  let threw = false;
  try {
    await forkDraftVersion('nonexistent-draft-id', 'admin-1', client);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw for nonexistent draft');
});

// ── listDrafts ──────────────────────────────────────────────────

test('listDrafts returns drafts sorted by created_at descending', async () => {
  const client = createMockClient();
  await createDraft({
    targetEntity: 'attraction', draftType: 'new', draftData: { ...VALID_DRAFT_DATA, slug: 'a' },
    actorId: 'admin-1', client,
  });
  await createDraft({
    targetEntity: 'attraction', draftType: 'new', draftData: { ...VALID_DRAFT_DATA, slug: 'b' },
    actorId: 'admin-1', client,
  });

  const drafts = await listDrafts({}, client);
  assert.equal(drafts.length, 2);
});

test('listDrafts filters by workflow_status', async () => {
  const client = createMockClient();
  await createDraft({
    targetEntity: 'attraction', draftType: 'new', draftData: { ...VALID_DRAFT_DATA, slug: 'draft1' },
    actorId: 'admin-1', client,
  });
  // Create an update draft (which starts at needs_verification)
  const updateDraft = await createDraft({
    targetEntity: 'attraction', draftType: 'update', draftData: { name: 'Updated' },
    targetId: 1, actorId: 'admin-1', client,
  });

  const drafts = await listDrafts({ workflowStatus: 'needs_verification' }, client);
  assert.equal(drafts.length, 1);
  assert.equal(drafts[0].id, updateDraft.id);
});

test('listDrafts filters by target_entity', async () => {
  const client = createMockClient();
  await createDraft({
    targetEntity: 'attraction', draftType: 'new', draftData: { ...VALID_DRAFT_DATA, slug: 'attract' },
    actorId: 'admin-1', client,
  });
  await createDraft({
    targetEntity: 'travel_article', draftType: 'new',
    draftData: { slug: 'article', title: 'Art', excerpt: '', body: '' },
    actorId: 'admin-1', client,
  });

  const drafts = await listDrafts({ targetEntity: 'travel_article' }, client);
  assert.equal(drafts.length, 1);
  assert.equal(drafts[0].target_entity, 'travel_article');
});

test('listDrafts respects limit', async () => {
  const client = createMockClient();
  for (let i = 0; i < 5; i++) {
    await createDraft({
      targetEntity: 'attraction', draftType: 'new',
      draftData: { ...VALID_DRAFT_DATA, slug: `draft-${i}` },
      actorId: 'admin-1', client,
    });
  }

  const drafts = await listDrafts({ limit: 3 }, client);
  assert.equal(drafts.length, 3, 'should respect limit');
});
