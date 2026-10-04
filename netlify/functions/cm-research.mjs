// Netlify Function: Content Manager research endpoint.
// POST /netlify/functions/cm-research — start an AI research task for a source URL.
// Requires admin authentication (Bearer token verified server-side).
//
// Environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AI_* config.
// The service-role key is never sent to the browser; it stays in this
// server-side function only.

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import { startResearch } from '../../server/content-manager/research.mjs';

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

export default async (request, context) => {
  const client = createServerClient(process.env);

  if (request.method === 'GET') {
    try {
      const actorId = await requireAdmin(request, client);
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      const targetEntity = url.searchParams.get('target_entity');

      let query = client
        .from('cm_research_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (status) query = query.eq('status', status);
      if (targetEntity) query = query.eq('target_entity', targetEntity);

      const { data, error } = await query;
      if (error) throw new AIError('STORAGE_ERROR');
      return json({ queue: data || [] });
    } catch (error) {
      const safe = safeError(error);
      return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
    }
  }

  if (request.method !== 'POST') {
    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  try {
    const actorId = await requireAdmin(request, client);
    const body = await readJSON(request);

    if (!body.source_url || !body.target_entity) {
      throw new AIError('INVALID_REQUEST', { message: 'source_url and target_entity are required' });
    }

    const result = await bounded(
      () => startResearch({
        sourceUrl: body.source_url,
        targetEntity: body.target_entity,
        searchQuery: body.search_query,
        actorId,
        client,
        env: process.env,
      }),
      25000,
      request.signal
    );

    return json({
      queue_id: result.queueId,
      draft_id: result.draftId,
      job_id: result.jobId,
      duplicates: result.duplicates,
      usage: result.usage,
      cached: result.cached,
      error: result.error || null,
    });
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
