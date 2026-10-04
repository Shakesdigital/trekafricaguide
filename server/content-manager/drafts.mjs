import { randomUUID } from 'node:crypto';
import { AIError } from '../ai/errors.mjs';
import { getTableName, filterToTableColumns, validateDraftData, ENTITY_TYPES } from './validate.mjs';

/**
 * Create a new draft (manual creation from admin UI or from research extraction).
 *
 * @param {object} params
 * @param {string} params.targetEntity - entity type
 * @param {string} params.draftType - 'new' or 'update'
 * @param {object} params.draftData - structured field values
 * @param {bigint|undefined} params.targetId - for update drafts
 * @param {string|undefined} params.sourceUrl - source URL for attribution
 * @param {string|undefined} params.sourceName - human-readable source name
 * @param {string|undefined} params.aiModel - AI model used (if AI-generated)
 * @param {string|undefined} params.aiTaskType - AI task type (if AI-generated)
 * @param {boolean} [params.aiGenerated=true]
 * @param {string} params.actorId - user creating the draft
 * @param {object} params.client - Supabase server client
 * @returns {Promise<object>} created draft record
 */
export async function createDraft({
  targetEntity, draftType, draftData, targetId, sourceUrl, sourceName,
  aiModel, aiTaskType, aiGenerated = true, actorId, client,
}) {
  if (!ENTITY_TYPES.has(targetEntity)) {
    throw new AIError('INVALID_REQUEST', { message: `Unknown entity type: ${targetEntity}` });
  }

  if (!['new', 'update'].includes(draftType)) {
    throw new AIError('INVALID_REQUEST', { message: 'draft_type must be "new" or "update"' });
  }

  if (!draftData || typeof draftData !== 'object') {
    throw new AIError('INVALID_REQUEST', { message: 'draft_data must be an object' });
  }

  // Validate: no forbidden fields with values
  const validatedData = validateDraftData(targetEntity, { ...draftData });

  const insertPayload = {
    id: randomUUID(),
    target_entity: targetEntity,
    draft_type: draftType,
    draft_data: validatedData,
    target_id: targetId || null,
    workflow_status: draftType === 'update' ? 'needs_verification' : 'draft',
    approval_status: 'pending',
    source_url: sourceUrl || null,
    source_name: sourceName || null,
    research_date: new Date().toISOString(),
    ai_model: aiModel || null,
    ai_task_type: aiTaskType || null,
    ai_generated: aiGenerated,
    created_by: actorId,
    version: 1,
  };

  const { data, error } = await client
    .from('cm_drafts')
    .insert(insertPayload)
    .select()
    .single();

  if (error) throw new AIError('STORAGE_ERROR');

  return data;
}

/**
 * Get a single draft by ID, including its field-level changes (if any).
 *
 * @param {string} draftId - UUID of the draft
 * @param {object} client - Supabase server client
 * @returns {Promise<object>} draft record with changes array
 */
export async function getDraft(draftId, client) {
  const { data: draft, error } = await client
    .from('cm_drafts')
    .select('*')
    .eq('id', draftId)
    .single();

  if (error) throw new AIError('STORAGE_ERROR');
  if (!draft) throw new AIError('INVALID_REQUEST', { message: 'Draft not found' });

  // Fetch field changes if this is an update draft
  const { data: changes, error: changesError } = await client
    .from('cm_draft_changes')
    .select('*')
    .eq('draft_id', draftId)
    .order('field_name');

  if (changesError) throw new AIError('STORAGE_ERROR');

  return { ...draft, changes: changes || [] };
}

/**
 * Compute before/after diff for an update draft.
 * Compares the current content record against the AI-extracted draft_data.
 *
 * @param {string} targetEntity - entity type
 * @param {bigint} targetId - ID of the existing content record
 * @param {object} draftData - AI-extracted field values
 * @param {object} client - Supabase server client
 * @returns {Promise<{changes: Array, currentRecord: object}>}
 */
export async function computeDraftChanges(targetEntity, targetId, draftData, client) {
  const table = getTableName(targetEntity);

  const { data: currentRecord, error } = await client
    .from(table)
    .select('*')
    .eq('id', targetId)
    .single();

  if (error) throw new AIError('STORAGE_ERROR');
  if (!currentRecord) {
    throw new AIError('INVALID_REQUEST', { message: `Record not found in ${table}: ${targetId}` });
  }

  const changes = [];

  for (const [field, newValue] of Object.entries(draftData)) {
    const oldValue = currentRecord[field];

    // Skip fields that haven't changed
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) continue;

    changes.push({
      field_name: field,
      old_value: oldValue,
      new_value: newValue,
    });
  }

  return { changes, currentRecord };
}

/**
 * Generate before/after diff for an update draft and persist changes.
 * This moves the draft to 'ready_for_review' state.
 *
 * @param {string} draftId - UUID of the draft (must be draft_type='update')
 * @param {object} client - Supabase server client
 */
export async function verifyDraft(draftId, client) {
  const draft = await getDraft(draftId, client);

  if (draft.draft_type !== 'update') {
    throw new AIError('INVALID_REQUEST', { message: 'Draft must be type "update" for verification' });
  }

  if (draft.workflow_status !== 'needs_verification') {
    throw new AIError('CONFLICT', { message: `Draft is not in needs_verification state (currently: ${draft.workflow_status})` });
  }

  if (!draft.target_id) {
    throw new AIError('INVALID_REQUEST', { message: 'Update draft must have a target_id' });
  }

  // Compute before/after diff
  const { changes, currentRecord } = await computeDraftChanges(
    draft.target_entity, BigInt(draft.target_id), draft.draft_data, client
  );

  // Persist each change as a cm_draft_changes row
  if (changes.length > 0) {
    const changesToInsert = changes.map((c) => ({
      id: randomUUID(),
      draft_id: draftId,
      field_name: c.field_name,
      old_value: c.old_value,
      new_value: c.new_value,
      created_by: draft.created_by,
    }));

    const insertResult = await client.from('cm_draft_changes').insert(changesToInsert);
    if (insertResult.error) throw new AIError('STORAGE_ERROR');
  }

  // Update draft status
  const updateResult = await client
    .from('cm_drafts')
    .update({
      workflow_status: 'ready_for_review',
      verification_date: new Date().toISOString(),
    })
    .eq('id', draftId)
    .select()
    .single();

  if (updateResult.error) throw new AIError('STORAGE_ERROR');

  return { draft: updateResult.data, changes, current_record: currentRecord };
}

/**
 * List drafts with optional filtering.
 *
 * @param {object} params
 * @param {string} params.workflowStatus - filter by workflow_status
 * @param {string} params.targetEntity - filter by entity type
 * @param {string} [params.approvalStatus] - filter by approval_status
 * @param {object} client - Supabase server client
 */
export async function listDrafts({ workflowStatus, targetEntity, approvalStatus, limit = 50 }, client) {
  let query = client
    .from('cm_drafts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (workflowStatus) query = query.eq('workflow_status', workflowStatus);
  if (targetEntity) query = query.eq('target_entity', targetEntity);
  if (approvalStatus) query = query.eq('approval_status', approvalStatus);

  const { data, error } = await query;
  if (error) throw new AIError('STORAGE_ERROR');

  return data || [];
}

/**
 * Approve a draft. For update drafts, only fields with reviewer_decision='approved'
 * are applied to the target record.
 *
 * @param {string} draftId - UUID of the draft
 * @param {string} approverId - admin user ID
 * @param {object} client - Supabase server client
 * @param {object} [options]
 * @param {string} [options.approvalNotes] - optional notes from the reviewer
 * @param {boolean} [options.publishImmediately=false] - if true, also publishes
 * @returns {Promise<{draft, appliedFields}>}
 */
export async function approveDraft(draftId, approverId, client, options = {}) {
  const { approvalNotes, publishImmediately = false } = options;

  const draft = await getDraft(draftId, client);

  if (draft.approval_status !== 'pending') {
    throw new AIError('CONFLICT', { message: `Draft already ${draft.approval_status}` });
  }

  const appliedFields = [];

  if (draft.draft_type === 'update') {
    // For updates: only apply fields with reviewer_decision='approved'
    // If no changes have been reviewed yet, approve all by default
    const approvedChanges = draft.changes
      .filter((c) => c.reviewer_decision === 'approved')
      .map((c) => ({ field_name: c.field_name, new_value: c.new_value }));

    if (approvedChanges.length === 0 && draft.changes.length > 0) {
      // No individual field approvals — apply all changes (backward-compatible default)
      const { changes } = await computeDraftChanges(
        draft.target_entity, BigInt(draft.target_id), draft.draft_data, client
      );
      for (const { field_name, new_value } of changes) {
        appliedFields.push(field_name);
      }
    } else {
      for (const { field_name } of approvedChanges) {
        appliedFields.push(field_name);
      }
    }
  } else {
    // For new listings: apply all fields from draft_data
    for (const field of Object.keys(draft.draft_data)) {
      appliedFields.push(field);
    }
  }

  // Mark draft as approved
  const updateResult = await client
    .from('cm_drafts')
    .update({
      workflow_status: 'approved',
      approval_status: 'approved',
      approver_id: approverId,
      approved_at: new Date().toISOString(),
      approval_notes: approvalNotes || null,
    })
    .eq('id', draftId)
    .select()
    .single();

  if (updateResult.error) throw new AIError('STORAGE_ERROR');

  let published = null;

  if (publishImmediately) {
    published = await publishDraft(draftId, approverId, client);
  }

  return { draft: updateResult.data, appliedFields, published };
}

/**
 * Reject a draft with a reason.
 *
 * @param {string} draftId - UUID of the draft
 * @param {string} reviewerId - admin user ID
 * @param {string} reason - why the draft was rejected
 * @param {object} client - Supabase server client
 */
export async function rejectDraft(draftId, reviewerId, reason, client) {
  const draft = await getDraft(draftId, client);

  if (draft.approval_status !== 'pending') {
    throw new AIError('CONFLICT', { message: `Draft already ${draft.approval_status}` });
  }

  const updateResult = await client
    .from('cm_drafts')
    .update({
      workflow_status: 'rejected',
      approval_status: 'rejected',
      approver_id: reviewerId,
      approved_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq('id', draftId)
    .select()
    .single();

  if (updateResult.error) throw new AIError('STORAGE_ERROR');

  return { draft: updateResult.data };
}

/**
 * Publish an approved draft to the target content table.
 *
 * For new listings: inserts a new row with status='draft'
 * For updates: updates the existing row
 *
 * @param {string} draftId - UUID of an approved draft
 * @param {string} publisherId - admin user ID
 * @param {object} client - Supabase server client
 * @returns {Promise<{targetId, targetEntity, version}>}
 */
export async function publishDraft(draftId, publisherId, client) {
  const draft = await getDraft(draftId, client);

  if (draft.approval_status !== 'approved') {
    throw new AIError('CONFLICT', { message: 'Cannot publish unapproved draft' });
  }

  const table = getTableName(draft.target_entity);
  const fieldData = filterToTableColumns(draft.target_entity, draft.draft_data);

  // Add publication metadata
  fieldData.status = 'published';
  fieldData.published_at = new Date().toISOString();
  fieldData.updated_at = new Date().toISOString();

  let targetId;

  if (draft.draft_type === 'new') {
    // Insert a new content record
    const insertResult = await client
      .from(table)
      .insert(fieldData)
      .select('id')
      .single();

    if (insertResult.error) throw new AIError('STORAGE_ERROR');
    targetId = insertResult.data?.id;
  } else {
    // Update existing content record
    if (!draft.target_id) {
      throw new AIError('INVALID_REQUEST', { message: 'Update draft must have target_id' });
    }

    const updateResult = await client
      .from(table)
      .update(fieldData)
      .eq('id', draft.target_id)
      .select('id')
      .single();

    if (updateResult.error) throw new AIError('STORAGE_ERROR');
    targetId = updateResult.data?.id || draft.target_id;
  }

  if (!targetId) throw new AIError('STORAGE_ERROR');

  // Update draft as published
  const draftUpdate = await client
    .from('cm_drafts')
    .update({
      workflow_status: 'published',
      published_at: new Date().toISOString(),
      published_by: publisherId,
      target_id: targetId,
    })
    .eq('id', draftId)
    .select()
    .single();

  if (draftUpdate.error) throw new AIError('STORAGE_ERROR');

  return { targetId, targetEntity: draft.target_entity, version: draftUpdate.data.version };
}

/**
 * Create a new draft version from an existing draft.
 * Used when rolling back and re-proposing changes.
 *
 * @param {string} originalDraftId - UUID of the source draft
 * @param {string} actorId - user creating the new version
 * @param {object} client - Supabase server client
 * @param {object} [overrides] - partial draft_data overrides
 * @returns {Promise<{draftId, version}>}
 */
export async function forkDraftVersion(originalDraftId, actorId, client, overrides = {}) {
  const original = await getDraft(originalDraftId, client);

  const newVersion = await client
    .from('cm_drafts')
    .insert({
      target_entity: original.target_entity,
      draft_type: original.draft_type,
      target_id: original.target_id,
      draft_data: { ...original.draft_data, ...overrides },
      workflow_status: 'needs_verification',
      approval_status: 'pending',
      approver_id: null,
      approved_at: null,
      rejection_reason: null,
      source_url: original.source_url,
      source_name: original.source_name,
      research_date: original.research_date,
      ai_model: original.ai_model,
      ai_task_type: original.ai_task_type,
      ai_job_id: original.ai_job_id,
      ai_generated: true,
      version: original.version + 1,
      created_by: actorId,
    })
    .select('id, version')
    .single();

  if (newVersion.error) throw new AIError('STORAGE_ERROR');

  return { draftId: newVersion.data.id, version: newVersion.data.version };
}

// Re-export imported names for downstream consumers.
// computeDraftChanges is already exported above via `export async function`.
export { ENTITY_TYPES, getTableName };
