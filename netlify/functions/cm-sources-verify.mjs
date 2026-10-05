// Netlify Function: Knowledge Engine source verification endpoint.
// POST /netlify/functions/cm-sources-verify — verify and register a new source domain
// Requires admin authentication (Bearer token verified server-side).

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

// Valid source categories
const VALID_CATEGORIES = ['tourism_board', 'travel_blog', 'magazine', 'safari_operator'];

export default async (request) => {
  const client = createServerClient(process.env);

  try {
    const actorId = await requireAdmin(request, client);

    if (request.method !== 'POST') {
      return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
    }

    const body = await readJSON(request);

    if (!body.source_url) {
      throw new AIError('INVALID_REQUEST', { message: 'source_url is required' });
    }

    // Extract the domain from the source URL
    let domain;
    try {
      const parsed = new URL(body.source_url);
      domain = parsed.hostname.replace(/^www\./, '');
    } catch {
      throw new AIError('INVALID_REQUEST', { message: 'Invalid source_url' });
    }

    // Verify the URL is fetchable
    let verified = false;
    let pageTitle = body.source_name || '';
    try {
      const response = await fetch(body.source_url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'TrekAfricaGuide-KnowledgeEngine/1.0' },
      });
      verified = response.ok;
      // For title, do a quick GET and extract
      if (!pageTitle) {
        const getResponse = await fetch(body.source_url, {
          headers: { 'User-Agent': 'TrekAfricaGuide-KnowledgeEngine/1.0' },
        });
        if (getResponse.ok) {
          const html = await getResponse.text();
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          pageTitle = titleMatch ? titleMatch[1].trim() : domain;
        }
      }
    } catch {
      verified = false;
    }

    if (!pageTitle) pageTitle = body.source_name || domain;

    const category = body.category || 'travel_blog';
    if (!VALID_CATEGORIES.includes(category)) {
      throw new AIError('INVALID_REQUEST', { message: `Invalid category: ${category}` });
    }

    // Check if the source already exists in cm_sources
    const existing = await client
      .from('cm_sources')
      .select('*')
      .eq('url', body.source_url)
      .maybeSingle();

    if (existing.error && existing.error.code !== 'PGRST116') {
      throw new AIError('STORAGE_ERROR');
    }

    if (!existing.data) {
      // Insert into cm_sources
      const sourceInsert = await client.from('cm_sources').insert({
        url: body.source_url,
        domain,
        name: pageTitle,
        verified,
        last_checked_at: new Date().toISOString(),
        added_by: actorId,
      }).select().single();

      if (sourceInsert.error) throw new AIError('STORAGE_ERROR');
    }

    // Upsert into cm_discovery_sources
    const seedUrls = body.seed_urls || [body.source_url];
    const { data, error } = await client
      .from('cm_discovery_sources')
      .upsert({
        domain,
        name: pageTitle,
        seed_urls: seedUrls,
        category,
        verified,
        last_checked_at: new Date().toISOString(),
        check_interval_hours: body.check_interval_hours || 24,
        created_by: actorId,
      }, { onConflict: 'domain' })
      .select()
      .single();

    if (error) throw new AIError('STORAGE_ERROR');

    return json({
      source: data,
      verified,
      already_existed: !!existing.data,
    });
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
