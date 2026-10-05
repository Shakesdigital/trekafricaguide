// Netlify Function: Ask Trek AI Assistant endpoint.
// GET  /netlify/functions/cm-ask-trek — list suggested prompts (public)
// POST /netlify/functions/cm-ask-trek — process an Ask Trek request (admin)
// Requires admin authentication for POST (Bearer token verified server-side).

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import {
  processAskTrekRequest,
  getSuggestedPrompts,
  INTENT_TYPES,
} from '../../server/knowledge/trek-assistant.mjs';

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
      'X-Content-Type': 'nosniff' },
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
    const url = new URL(request.url);

    if (request.method === 'GET') {
      // Public endpoint — list suggested prompts, optionally filtered
      const category = url.searchParams.get('category');
      const entityType = url.searchParams.get('entity_type');

      const prompts = await getSuggestedPrompts({ category, entityType, client });

      // Build context-aware suggestions based on the referring pathname if provided
      const referrerPath = url.searchParams.get('pathname');
      let context = null;
      if (referrerPath) {
        const segments = referrerPath.split('/').filter(Boolean);
        if (segments.length >= 2) {
          context = {
            entity_type: segments[0],
            entity_slug: segments[1],
          };
        }
      }

      return json({ prompts, context });
    }

    if (request.method === 'POST') {
      // Requires admin auth
      const actorId = await requireAdmin(request, client);
      const body = await readJSON(request);

      if (!body.query || typeof body.query !== 'string') {
        throw new AIError('INVALID_REQUEST', { message: 'query is required' });
      }

      const result = await bounded(
        () => processAskTrekRequest({
          query: body.query,
          context: {
            pathname: body.context?.pathname,
            session_token: body.context?.session_token,
          },
          client,
          env: process.env,
          signal: request.signal,
        }),
        30000,
        request.signal
      );

      return json(result);
    }

    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
