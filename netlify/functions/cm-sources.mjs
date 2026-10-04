// Netlify Function: Content Manager sources endpoint.
// GET /netlify/functions/cm-sources — list verified source domains.
// Requires admin authentication.

import { AIError, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';

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

export default async (request) => {
  const client = createServerClient(process.env);

  if (request.method !== 'GET') {
    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  try {
    const actorId = await requireAdmin(request, client);
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('q');
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 50;

    let query = client
      .from('cm_sources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (searchQuery) {
      // Search by domain or name
      query = query.or(`domain.ilike.*${searchQuery}*,name.ilike.*${searchQuery}*,url.ilike.*${searchQuery}*`);
    }

    const { data, error } = await query;
    if (error) throw new AIError('STORAGE_ERROR');

    return json({ sources: data || [] });
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
