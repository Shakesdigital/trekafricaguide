// Netlify Function: Content Manager drafts endpoint.
// GET  /netlify/functions/cm-drafts — list drafts with optional filters
// POST /netlify/functions/cm-drafts — create a new draft
// PATCH /netlify/functions/cm-drafts/<id> — update draft metadata
// Requires admin authentication.

import { AIError, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import { listDrafts, getDraft, createDraft } from '../../server/content-manager/drafts.mjs';

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

  try {
    const actorId = await requireAdmin(request, client);
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // Netlify Functions strip the function name from the path;
    // remaining path segments may contain a draft ID
    const draftId = pathParts[pathParts.length - 1];

    if (request.method === 'GET') {
      const { workflow_status, target_entity, approval_status, limit, id } =
        (() => {
          const sp = url.searchParams;
          return {
            workflow_status: sp.get('workflow_status'),
            target_entity: sp.get('target_entity'),
            approval_status: sp.get('approval_status'),
            limit: sp.get('limit') ? parseInt(sp.get('limit'), 10) : 50,
            id: sp.get('id'),
          };
        })();

      if (id) {
        const draft = await getDraft(id, client);
        return json({ draft });
      }

      const drafts = await listDrafts(
        { workflowStatus: workflow_status, targetEntity: target_entity,
          approvalStatus: approval_status, limit }, client
      );
      return json({ drafts });
    }

    if (request.method === 'POST') {
      const body = await readJSON(request);
      const draft = await createDraft({
        targetEntity: body.target_entity,
        draftType: body.draft_type || 'new',
        draftData: body.draft_data,
        targetId: body.target_id,
        sourceUrl: body.source_url,
        sourceName: body.source_name,
        aiModel: body.ai_model,
        aiTaskType: body.ai_task_type,
        aiGenerated: body.ai_generated !== undefined ? body.ai_generated : true,
        actorId,
        client,
      });
      return json({ draft }, 201);
    }

    if (request.method === 'PATCH') {
      const body = await readJSON(request);
      const targetId = body.draft_id || draftId;
      if (!targetId) throw new AIError('INVALID_REQUEST', { message: 'draft_id is required' });

      // Allow updating workflow_status and metadata
      const updates = {};
      if (body.workflow_status) updates.workflow_status = body.workflow_status;
      if (body.approval_status) updates.approval_status = body.approval_status;
      if (body.notes) updates.approval_notes = body.notes;

      if (Object.keys(updates).length === 0) {
        throw new AIError('INVALID_REQUEST', { message: 'No update fields provided' });
      }

      const { data, error } = await client
        .from('cm_drafts')
        .update(updates)
        .eq('id', targetId)
        .select()
        .single();

      if (error) throw new AIError('STORAGE_ERROR');
      return json({ draft: data });
    }

    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
