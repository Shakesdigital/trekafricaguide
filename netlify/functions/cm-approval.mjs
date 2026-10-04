// Netlify Function: Content Manager approval endpoint.
// POST /netlify/functions/cm-approval — approve, reject, or publish a draft.
// Requires admin authentication.
//
// Body: { action: 'approve' | 'reject' | 'publish' | 'verify', draft_id, ...action-specific }

import { AIError, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import {
  verifyDraft, approveDraft, rejectDraft, publishDraft, getDraft,
} from '../../server/content-manager/drafts.mjs';

const STATUS_MAP = {
  INVALID_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403,
  TIMEOUT: 504, CANCELLED: 499, RATE_LIMITED: 429,
  PROVIDER_ERROR: 502, PROVIDER_AUTH: 503, INVALID_RESPONSE: 502,
  STORAGE_ERROR: 500, INTERNAL_ERROR: 500, CONFIGURATION: 503,
  DISABLED: 503, CONFLICT: 409,
};

const json = (value, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff' },
  });

const MAX_BODY_BYTES = 8192;

async function readJSON(request, maxBytes = MAX_BODY_BYTES) {
  const reader = request.body?.getReader();
  if (!reader) throw new AIError('INVALID_REQUEST');
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) throw new AIError('INVALID_REQUEST');
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { throw new AIError('INVALID_REQUEST'); }
  finally { await reader.cancel().catch(() => {}); }
}

export default async (request) => {
  const client = createServerClient(process.env);

  if (request.method !== 'POST') {
    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  try {
    const actorId = await requireAdmin(request, client);
    const body = await readJSON(request);
    const { action, draft_id } = body;

    if (!action || !draft_id) {
      throw new AIError('INVALID_REQUEST', { message: 'action and draft_id are required' });
    }

    let result;

    switch (action) {
      case 'verify': {
        // Run before/after diff and set draft to ready_for_review
        result = await verifyDraft(draft_id, client);
        return json({ draft: result.draft, changes: result.changes, current_record: result.currentRecord });
      }

      case 'approve': {
        result = await approveDraft(draft_id, actorId, client, {
          approvalNotes: body.notes,
          publishImmediately: body.publish_immediately === true,
        });
        // Refresh from DB to get latest state
        const draft = await getDraft(draft_id, client);
        return json({ draft, applied_fields: result.appliedFields, published: result.published });
      }

      case 'reject': {
        if (!body.reason) {
          throw new AIError('INVALID_REQUEST', { message: 'reason is required for rejection' });
        }
        result = await rejectDraft(draft_id, actorId, body.reason, client);
        return json({ draft: result.draft });
      }

      case 'publish': {
        result = await publishDraft(draft_id, actorId, client);
        return json({ target_id: result.targetId, target_entity: result.targetEntity, version: result.version });
      }

      case 'approve_field': {
        // Approve a specific field change in an update draft
        const { field_name } = body;
        if (!field_name) throw new AIError('INVALID_REQUEST', { message: 'field_name is required' });

        const { data, error } = await client
          .from('cm_draft_changes')
          .update({ reviewer_decision: 'approved', reviewer_notes: body.notes || null })
          .eq('draft_id', draft_id)
          .eq('field_name', field_name)
          .select()
          .single();

        if (error) throw new AIError('STORAGE_ERROR');
        return json({ change: data });
      }

      case 'reject_field': {
        const { field_name } = body;
        if (!field_name) throw new AIError('INVALID_REQUEST', { message: 'field_name is required' });
        if (!body.reason) throw new AIError('INVALID_REQUEST', { message: 'reason is required for field rejection' });

        const { data, error } = await client
          .from('cm_draft_changes')
          .update({ reviewer_decision: 'rejected', reviewer_notes: body.reason })
          .eq('draft_id', draft_id)
          .eq('field_name', field_name)
          .select()
          .single();

        if (error) throw new AIError('STORAGE_ERROR');
        return json({ change: data });
      }

      default:
        throw new AIError('INVALID_REQUEST', { message: `Unknown action: ${action}` });
    }
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
