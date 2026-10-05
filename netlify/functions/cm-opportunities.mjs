// Netlify Function: Content Opportunity Engine endpoint.
// GET  /netlify/functions/cm-opportunities — list opportunities
// POST /netlify/functions/cm-opportunities — run a content gap scan
// PATCH /netlify/functions/cm-opportunities — update opportunity status
// Requires admin authentication (Bearer token verified server-side).

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import { getAIService } from '../../server/ai/service.mjs';
import {
  scanContentGaps,
  listOpportunities,
  updateOpportunityStatus,
  CADENCES,
  STATUSES,
  OPPORTUNITY_TYPES,
} from '../../server/knowledge/opportunities.mjs';

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

const VALID_OPPORTUNITY_TYPES = new Set(Object.values(OPPORTUNITY_TYPES));
const VALID_STATUSES = new Set(Object.values(STATUSES));
const VALID_CADENCES = new Set(Object.values(CADENCES));

export default async (request) => {
  const client = createServerClient(process.env);

  try {
    const actorId = await requireAdmin(request, client);
    const url = new URL(request.url);

    if (request.method === 'GET') {
      // List opportunities
      const status = url.searchParams.get('status');
      const cadence = url.searchParams.get('cadence');
      const opportunityType = url.searchParams.get('opportunity_type');
      const entityType = url.searchParams.get('entity_type');
      const minScore = url.searchParams.get('min_score');
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 50;

      const opportunities = await listOpportunities({
        status,
        cadence,
        opportunityType,
        entityType,
        minScore: minScore ? parseFloat(minScore) : undefined,
        limit,
      }, client);

      return json({ opportunities, count: opportunities.length });
    }

    if (request.method === 'POST') {
      // Run a content gap scan
      const body = await readJSON(request);
      const cadence = body.cadence || CADENCES.WEEKLY;

      if (!VALID_CADENCES.has(cadence)) {
        throw new AIError('INVALID_REQUEST', { message: `Invalid cadence: ${cadence}` });
      }

      const aiService = getAIService(process.env);

      const result = await bounded(
        () => scanContentGaps({
          cadence,
          actorId,
          client,
          aiService,
          signal: request.signal,
        }),
        60000,
        request.signal
      );

      return json({
        scanned: result.scanned,
        new_opportunities: result.newOpportunities,
        opportunities: result.opportunities,
        results: result.results,
      });
    }

    if (request.method === 'PATCH') {
      // Update opportunity status
      const body = await readJSON(request);
      const opportunityId = body.opportunity_id || url.searchParams.get('id');

      if (!opportunityId) {
        throw new AIError('INVALID_REQUEST', { message: 'opportunity_id is required' });
      }

      const status = body.status;
      if (!status || !VALID_STATUSES.has(status)) {
        throw new AIError('INVALID_REQUEST', { message: `Invalid status: ${status}` });
      }

      const updates = {
        resolution_notes: body.resolution_notes || null,
        resolved_by: actorId,
      };

      const updated = await updateOpportunityStatus(opportunityId, status, updates, client);

      return json({ opportunity: updated });
    }

    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
