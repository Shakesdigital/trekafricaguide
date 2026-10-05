// Netlify Function: Knowledge Engine discovery endpoint.
// GET  /netlify/functions/cm-discovery — list discovery sources and their status
// POST /netlify/functions/cm-discovery — run discovery on a URL, domain, or continuously
// Requires admin authentication (Bearer token verified server-side).

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import { runDiscovery, discoverFromSeed, runContinuousDiscovery } from '../../server/knowledge/discover.mjs';

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

    if (request.method === 'GET') {
      // List all discovery sources with their status
      const { data, error } = await client
        .from('cm_discovery_sources')
        .select('*')
        .order('category')
        .order('verified', { ascending: false });

      if (error) throw new AIError('STORAGE_ERROR');

      // Also include recent knowledge counts per source
      const sourceStats = {};
      for (const source of data || []) {
        const { count, error: countError } = await client
          .from('cm_knowledge')
          .select('id', { count: 'exact', head: true })
          .eq('source_url', source.seed_urls[0])
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (!countError) {
          sourceStats[source.domain] = {
            recent_findings: count,
            last_checked_at: source.last_checked_at,
            last_discovered_at: source.last_discovered_at,
            check_interval_hours: source.check_interval_hours,
          };
        }
      }

      return json({
        sources: data || [],
        stats: sourceStats,
      });
    }

    if (request.method === 'POST') {
      const body = await readJSON(request);
      const mode = body.mode || 'url';

      if (mode === 'continuous') {
        // Run discovery across all configured sources
        const result = await bounded(
          () => runContinuousDiscovery({
            actorId,
            client,
            env: process.env,
          }),
          120000, // 2 minute timeout for full sweep
          request.signal
        );

        return json({
          processed: result.processed,
          total: result.total,
          results: result.results,
        });
      }

      if (mode === 'domain' && body.domain) {
        // Run discovery from a specific seed source domain
        const result = await bounded(
          () => discoverFromSeed({
            domain: body.domain,
            actorId,
            client,
            env: process.env,
          }),
          60000, // 1 minute timeout
          request.signal
        );

        return json({
          domain: body.domain,
          results: result,
        });
      }

      // Default: single URL discovery
      if (!body.source_url) {
        throw new AIError('INVALID_REQUEST', { message: 'source_url is required (or use mode: "domain"/"continuous")' });
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
