// Netlify Function: AI generate endpoint.
// Accepts a POST with { task_type, listing_type, listing_slug } and returns
// generated text from the configured AI provider. All auth/RLS is handled
// server-side via SUPABASE_SERVICE_ROLE_KEY — never exposed to the browser.
//
// Environment: requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AI_ENABLED=true,
// AI_PROVIDERS_JSON, and the appropriate AI_*_KEY environment variables.

import { createAIService } from '../../server/ai/service.mjs';
import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';

const MAX_BODY_BYTES = 8192;

async function readJSON(request, maxBytes = MAX_BODY_BYTES) {
  const reader = request.body?.getReader();
  if (!reader) throw new AIError('INVALID_REQUEST');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) throw new AIError('INVALID_REQUEST');
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new AIError('INVALID_REQUEST');
  } finally {
    await reader.cancel().catch(() => {});
  }
}

export default async (request) => {
  try {
    if (request.method !== 'POST') {
      return Response.json({ error: 'METHOD_NOT_ALLOWED' }, { status: 405, headers: { 'Cache-Control': 'no-store' } });
    }

    const service = createAIService();
    const input = await readJSON(request);

    const result = await bounded(() => service.run(input), 25000, request.signal);

    return Response.json({
      job_id: result.id,
      text: result.text,
      cached: result.cached,
      provider: result.provider,
      model: result.model,
      usage: result.usage,
    }, { status: 200, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) {
    const safe = safeError(error);
    const status = {
      INVALID_REQUEST: 400,
      DISABLED: 503,
      CONFIGURATION: 503,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      TIMEOUT: 504,
      CANCELLED: 499,
      RATE_LIMITED: 429,
      PROVIDER_ERROR: 502,
      PROVIDER_AUTH: 503,
      INVALID_RESPONSE: 502,
      STORAGE_ERROR: 500,
      INTERNAL_ERROR: 500,
    }[safe.code] || 503;

    return Response.json(
      { error: safe.code, message: safe.message },
      { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }
    );
  }
};
