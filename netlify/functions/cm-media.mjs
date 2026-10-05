// Netlify Function: Media Engine endpoint.
// GET  /netlify/functions/cm-media — list media assets
// POST /netlify/functions/cm-media — search for or record media assets
// Requires admin authentication (Bearer token verified server-side).

import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';
import { createServerClient } from '../../server/ai/store.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';
import {
  findMediaForEntity,
  recordMediaAsset,
  searchWikimediaCommons,
  searchUnsplash,
  isLicensePermissive,
  isLicenseStorable,
  STORABLE_LICENSES,
  ALL_LICENSES,
} from '../../server/knowledge/media.mjs';

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
      // List media assets, optionally filtered by entity
      const entityType = url.searchParams.get('entity_type');
      const entityId = url.searchParams.get('entity_id');
      const licenseType = url.searchParams.get('license_type');
      const sourceType = url.searchParams.get('source_type');
      const storableOnly = url.searchParams.get('storable_only') === 'true';
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 50;

      let query = client
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (entityType) query = query.eq('associated_entity_type', entityType);
      if (entityId) query = query.eq('associated_entity_id', parseInt(entityId, 10));
      if (licenseType) query = query.eq('license_type', licenseType);
      if (sourceType) query = query.eq('source_type', sourceType);

      const { data, error } = await query;
      if (error) throw new AIError('STORAGE_ERROR');

      let filtered = data || [];

      if (storableOnly) {
        filtered = filtered.filter((m) => isLicenseStorable(m.license_type));
      }

      return json({ media: filtered, count: filtered.length });
    }

    if (request.method === 'POST') {
      const body = await readJSON(request);
      const action = body.action;

      if (!action) {
        throw new AIError('INVALID_REQUEST', { message: 'action is required' });
      }

      if (action === 'search') {
        // Search for media for an entity
        const entityType = body.entity_type;
        const entityName = body.entity_name;
        const entitySlug = body.entity_slug;
        const query = body.query;

        if (!entityType || !entityName) {
          throw new AIError('INVALID_REQUEST', { message: 'entity_type and entity_name are required' });
        }

        const result = await bounded(
          () => findMediaForEntity({
            entityType,
            entityName,
            entitySlug,
            client,
            signal: request.signal,
          }),
          30000,
          request.signal
        );

        return json({
          suggestions: result.suggestions,
          stored: result.stored,
        });
      }

      if (action === 'search_wikimedia') {
        const query = body.query;
        if (!query) throw new AIError('INVALID_REQUEST', { message: 'query is required' });

        const results = await bounded(
          () => searchWikimediaCommons(query, { signal: request.signal }),
          15000,
          request.signal
        );

        return json({ results });
      }

      if (action === 'search_unsplash') {
        const query = body.query;
        if (!query) throw new AIError('INVALID_REQUEST', { message: 'query is required' });

        const results = await bounded(
          () => searchUnsplash(query, { count: body.count || 10, signal: request.signal }),
          15000,
          request.signal
        );

        return json({ results });
      }

      if (action === 'record') {
        // Record a discovered media asset with full attribution
        if (!body.source_url) {
          throw new AIError('INVALID_REQUEST', { message: 'source_url is required' });
        }

        if (!body.license_type || !ALL_LICENSES.includes(body.license_type)) {
          throw new AIError('INVALID_REQUEST', { message: `Invalid license_type: ${body.license_type}` });
        }

        const result = await recordMediaAsset({
          sourceUrl: body.source_url,
          mediaType: body.media_type || 'image',
          licenseType: body.license_type,
          licenseUrl: body.license_url,
          attributionText: body.attribution_text,
          creator: body.creator,
          altText: body.alt_text,
          usageTerms: body.usage_terms,
          caption: body.caption,
          entityType: body.associated_entity_type,
          entityName: body.entity_name,
          entitySlug: body.entity_slug,
          client,
        });

        if (!result) {
          throw new AIError('STORAGE_ERROR', { message: 'Failed to record media asset' });
        }

        return json({ media_asset: result });
      }

      throw new AIError('INVALID_REQUEST', { message: `Unknown action: ${action}` });
    }

    return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  } catch (error) {
    const safe = safeError(error);
    return json({ error: safe.code, message: safe.message }, STATUS_MAP[safe.code] || 503);
  }
};
