// Netlify Function: Knowledge Engine knowledge endpoint.
// GET  /netlify/functions/cm-knowledge — query the knowledge graph
// POST /netlify/functions/cm-knowledge — start a discovery task on a URL
// Requires admin authentication (Bearer token verified server-side).

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import { runDiscovery } from '../../server/knowledge/discover.mjs';

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

    if (request.method === 'GET') {
      const entityType = url.searchParams.get('entity_type');
      const discoveryType = url.searchParams.get('discovery_type');
      const verificationStatus = url.searchParams.get('verification_status');
      const reviewStatus = url.searchParams.get('review_status');
      const minConfidence = url.searchParams.get('min_confidence');
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 50;

      let query = client
        .from('cm_knowledge')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (entityType) query = query.eq('entity_type', entityType);
      if (discoveryType) query = query.eq('discovery_type', discoveryType);
      if (verificationStatus) query = query.eq('verification_status', verificationStatus);
      if (reviewStatus) query = query.eq('review_status', reviewStatus);
      if (minConfidence) {
        const conf = parseFloat(minConfidence);
        if (!isNaN(conf)) {
          query = query.gte('confidence', conf);
        }
      }

      const { data, error } = await query;
      if (error) throw new AIError('STORAGE_ERROR');

      return json({ knowledge: data || [] });
    }

    if (request.method === 'POST') {
      const body = await readJSON(request);

      if (!body.source_url) {
        throw new AIError('INVALID_REQUEST', { message: 'source_url is required' });
      }

      const result = await bounded(
        () => runDiscovery({
          sourceUrl: body.source_url,
          sourceName: body.source_name || null,
          entityType: body.target_entity || null,
          actorId,
          client,
          env: process.env,
        }),
        25000,
        request.signal
      );

      return json({
        knowledge_id: result.knowledgeId,
        draft_id: result.draftId,
        category: result.category,
        confidence: result.confidence,
        duplicates: result.duplicates,
        extracted_data: result.extractedData,
        usage: result.usage,
        cached: result.cached,
        draft_created: result.draftCreated,
        error: result.error || null,
      });
    }

    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
