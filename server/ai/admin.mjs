import { AIError, safeError } from './errors.mjs';
import { readServerConfig, validateTask } from './config.mjs';
import { createServerClient } from './store.mjs';

export async function requireAdmin(request, client) {
  const match = request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/);
  if (!match) throw new AIError('UNAUTHORIZED');
  const { data, error } = await client.auth.getUser(match[1]);
  if (error || !data?.user || data.user.is_anonymous) throw new AIError('UNAUTHORIZED');
  const profile = await client.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  if (profile.error) throw new AIError('STORAGE_ERROR');
  if (!['admin', 'super_admin'].includes(profile.data?.role)) throw new AIError('FORBIDDEN');
  return data.user.id;
}

const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});
async function bodyJSON(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new AIError('INVALID_REQUEST');
  const reader = request.body?.getReader();
  if (!reader) throw new AIError('INVALID_REQUEST');
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length; if (size > 8192) throw new AIError('INVALID_REQUEST'); chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { throw new AIError('INVALID_REQUEST'); }
  finally { await reader.cancel().catch(() => {}); }
}

export function createAdminHandler({ getClient = createServerClient, getConfig = readServerConfig } = {}) {
  return async (request) => {
    if (!['GET', 'PUT'].includes(request.method)) return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
    if (!request.headers.get('authorization')) return json({ error: 'UNAUTHORIZED' }, 401);
    try {
      const client = getClient(); const actor = await requireAdmin(request, client); const server = getConfig();
      if (request.method === 'GET') {
        if (new URL(request.url).searchParams.get('view') === 'usage') {
          const { data, error } = await client.rpc('ai_usage_summary');
          if (error) throw new AIError('STORAGE_ERROR');
          return json({ window_days: 30, usage: data });
        }
        const { data, error } = await client.from('ai_task_config').select('*').order('task_type');
        if (error) throw new AIError('STORAGE_ERROR');
        return json({ enabled: server.enabled, tasks: data, providers: Object.entries(server.providers).map(([id, p]) =>
          ({ id, adapter: p.adapter, models: p.models, configured: !!p.apiKey })) });
      }
      const body = await bodyJSON(request);
      const { expected_updated_at, ...values } = body;
      if (expected_updated_at !== null && (typeof expected_updated_at !== 'string' || !Number.isFinite(Date.parse(expected_updated_at)))) throw new AIError('INVALID_REQUEST');
      const task = validateTask(values, server);
      const row = { ...task, updated_by: actor };
      // null explicitly creates a task; an existing version is required for updates.
      const result = expected_updated_at === null
        ? await client.from('ai_task_config').insert(row).select().single()
        : await client.from('ai_task_config').update(row).eq('task_type', task.task_type).eq('updated_at', expected_updated_at).select().maybeSingle();
      if (result.error?.code === '23505' || (!result.error && !result.data)) throw new AIError('CONFLICT');
      if (result.error) throw new AIError('STORAGE_ERROR');
      return json({ task: result.data });
    } catch (error) {
      const safe = safeError(error);
      const status = { UNAUTHORIZED: 401, FORBIDDEN: 403, INVALID_REQUEST: 400, CONFLICT: 409 }[safe.code] || 503;
      return json({ error: safe.code, message: safe.message }, status);
    }
  };
}
