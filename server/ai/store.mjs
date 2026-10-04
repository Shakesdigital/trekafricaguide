import { createClient } from '@supabase/supabase-js';
import { AIError } from './errors.mjs';

export function createServerClient(env = process.env) {
  if (typeof window !== 'undefined' || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new AIError('CONFIGURATION');
  const url = new URL(env.SUPABASE_URL);
  if (url.protocol !== 'https:') throw new AIError('CONFIGURATION');
  return createClient(url.href, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init = {}) => fetch(input, { ...init,
      signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(3000)]) : AbortSignal.timeout(3000) }) },
  });
}

export function createStore(client) {
  const checked = async (query) => {
    try { const { data, error } = await query; if (error) throw error; return data; }
    catch { throw new AIError('STORAGE_ERROR'); }
  };
  return {
    start: (row) => checked(client.from('ai_jobs').insert(row)),
    finish: (id, row) => checked(client.from('ai_jobs').update(row).eq('id', id)),
    attempt: (row) => checked(client.from('ai_request_attempts').insert(row)),
    finishAttempt: (jobId, attempt, row) => checked(client.from('ai_request_attempts').update(row).eq('job_id', jobId).eq('attempt', attempt)),
    getConfig: async (task) => {
      const row = await checked(client.from('ai_task_config').select('task_type,enabled,provider,model,timeout_ms,max_retries,max_output_tokens,cache_ttl_seconds').eq('task_type', task).maybeSingle());
      return row;
    },
    getCache: async (key) => checked(client.from('ai_cache').select('result_text').eq('cache_key', key).gt('expires_at', new Date().toISOString()).maybeSingle()),
    putCache: (row) => checked(client.from('ai_cache').upsert(row, { onConflict: 'cache_key' })),
    cleanup: () => checked(client.rpc('cleanup_ai_infrastructure')),
  };
}
