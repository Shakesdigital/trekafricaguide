// Netlify Function: Autonomous Trek Operations endpoint.
// GET  /netlify/functions/cm-autonomous — list agent operations, approval queue, stats
// POST /netlify/functions/cm-autonomous — trigger an autonomous cycle
// PATCH /netlify/functions/cm-autonomous — approve or reject an approval queue item
// Requires admin authentication (Bearer token verified server-side).

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import { getAIService } from '../../server/ai/service.mjs';
import {
  runAutonomousCycle,
  listApprovalQueue,
  approveApprovalItem,
  rejectApprovalItem,
  getAgentStats,
  OPERATION_TYPES,
} from '../../server/knowledge/autonomous.mjs';
import { CADENCES } from '../../server/knowledge/opportunities.mjs';

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

const VALID_CADENCES = new Set(Object.values(CADENCES));
const VALID_ACTION_STATUSES = new Set(['pending', 'approved', 'rejected', 'applied']);

export default async (request) => {
  const client = createServerClient(process.env);

  try {
    const actorId = await requireAdmin(request, client);

    // ── GET: list operations, approval queue, and stats ──────────────────────
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const resource = url.searchParams.get('resource');

      // Sub-resource: approval queue
      if (resource === 'approvals') {
        const status = url.searchParams.get('status') || 'pending';
        const entityType = url.searchParams.get('entity_type');
        const fieldName = url.searchParams.get('field_name');
        const minPriority = url.searchParams.get('min_priority');
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 50;

        const items = await listApprovalQueue({
          status,
          entityType,
          fieldName,
          minPriority: minPriority ? parseFloat(minPriority) : undefined,
          limit,
        }, client);

        return json({ items, count: items.length });
      }

      // Sub-resource: agent stats
      if (resource === 'stats') {
        const stats = await getAgentStats(client);
        return json(stats);
      }

      // Default: list recent operations
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 20;
      const status = url.searchParams.get('status');

      let query = client
        .from('cm_agent_operations')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);

      if (status) query = query.eq('status', status);

      const { data: operations, error } = await query;
      if (error) throw new AIError('STORAGE_ERROR');

      return json({ operations: operations || [], count: operations?.length || 0 });
    }

    // ── POST: trigger an autonomous cycle ────────────────────────────────────
    if (request.method === 'POST') {
      const body = await readJSON(request);
      const cadence = body.cadence || CADENCES.DAILY;

      if (!VALID_CADENCES.has(cadence)) {
        throw new AIError('INVALID_REQUEST', { message: `Invalid cadence: ${cadence}` });
      }

      const aiService = getAIService(process.env);

      const result = await bounded(
        () => runAutonomousCycle({
          actorId,
          client,
          env: process.env,
          aiService,
          cadence,
          signal: request.signal,
          options: {
            skipContentGapScan: body.skip_content_gap_scan || false,
            skipDiscovery: body.skip_discovery || false,
            skipMediaEnrichment: body.skip_media_enrichment || false,
            skipOpportunityProcessing: body.skip_opportunity_processing || false,
          },
        }),
        180000, // 3 minute timeout for full autonomous cycle
        request.signal
      );

      return json({
        operation_id: result.operationId,
        stats: result.stats,
      });
    }

    // ── PATCH: approve or reject an approval queue item ──────────────────────
    if (request.method === 'PATCH') {
      const url = new URL(request.url);
      const body = await readJSON(request);

      const approvalId = body.approval_id || url.searchParams.get('id');
      const action = body.action;

      if (!approvalId) {
        throw new AIError('INVALID_REQUEST', { message: 'approval_id is required' });
      }

      if (action === 'approve') {
        const updated = await approveApprovalItem(
          approvalId, actorId, client, body.notes || null
        );
        return json({ item: updated });
      }

      if (action === 'reject') {
        const updated = await rejectApprovalItem(
          approvalId, actorId, body.notes || null, client
        );
        return json({ item: updated });
      }

      throw new AIError('INVALID_REQUEST', { message: `Invalid action: ${action}. Use "approve" or "reject".` });
    }

    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
