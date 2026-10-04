import { createHmac, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { AIError, bounded, safeError } from './errors.mjs';
import { taskType, validateTask, readServerConfig } from './config.mjs';
import { createProviderTransport } from './providers.mjs';
import { createServerClient, createStore } from './store.mjs';

const inputSchema = z.object({
  task_type: taskType,
  messages: z.array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().min(1).max(64000) }).strict()).min(1).max(40),
  // Trusted server callers only. Never forward browser cache flags here.
  public_cache_version: z.string().regex(/^[a-zA-Z0-9_.:-]{1,100}$/).optional(),
}).strict().refine((x) => x.messages.reduce((n, m) => n + m.content.length, 0) <= 64000 && x.messages.some((m) => m.role === 'user'));

export function createAIService({ store, server, transport = createProviderTransport(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  return {
    async run(input, { signal } = {}) {
      const id = randomUUID(); const started = Date.now();
      const parsed = inputSchema.safeParse(input);
      // Do not log arbitrary task labels or user content on invalid input.
      const task = taskType.safeParse(input?.task_type);
      await store.start({ id, task_type: task.success ? task.data : 'invalid_request', status: 'running', started_at: new Date(started).toISOString() });
      let attempts = 0; let inputTokens = null; let outputTokens = null; let usageComplete = true;
      let provider = null; let model = null;
      const finish = (status, extra = {}) => store.finish(id, { status, provider, model, attempts,
        input_tokens: inputTokens, output_tokens: outputTokens, usage_complete: usageComplete,
        finished_at: new Date().toISOString(), duration_ms: Date.now() - started, ...extra });
      try {
        if (!parsed.success) throw new AIError('INVALID_REQUEST');
        if (!server.enabled) throw new AIError('DISABLED');
        const raw = await store.getConfig(parsed.data.task_type);
        if (!raw || !raw.enabled) throw new AIError('DISABLED');
        const config = validateTask(raw, server);
        provider = config.provider; model = config.model;
        await store.finish(id, { provider, model });
        const request = { ...server.providers[provider], ...config };
        const deadline = started + config.timeout_ms;
        const remaining = () => { const ms = deadline - Date.now(); if (ms <= 0) throw new AIError('TIMEOUT'); return ms; };
        let cacheKey = null;
        if (parsed.data.public_cache_version && config.cache_ttl_seconds > 0) {
          if (server.cacheSecret.length < 32) throw new AIError('CONFIGURATION');
          cacheKey = createHmac('sha256', server.cacheSecret).update(JSON.stringify({ v: 1, config,
            adapter: request.adapter, endpoint: request.endpoint, version: parsed.data.public_cache_version, messages: parsed.data.messages })).digest('hex');
          const cached = await bounded(() => store.getCache(cacheKey), remaining(), signal);
          if (cached) { inputTokens = 0; outputTokens = 0; await finish('cached'); return { id, text: cached.result_text, cached: true, provider, model, usage: { input_tokens: 0, output_tokens: 0, complete: true } }; }
        }
        let result;
        for (let attempt = 1; attempt <= config.max_retries + 1; attempt++) {
          remaining(); if (signal?.aborted) throw new AIError('CANCELLED');
          attempts = attempt;
          await store.attempt({ job_id: id, attempt, task_type: parsed.data.task_type, provider, model, status: 'running', started_at: new Date().toISOString() });
          try {
            result = await bounded((abortSignal) => transport(request, parsed.data.messages, abortSignal), remaining(), signal);
          } catch (error) {
            const safe = safeError(error); usageComplete = false;
            await store.finishAttempt(id, attempt, { status: safe.code === 'TIMEOUT' ? 'timed_out' : 'failed', finished_at: new Date().toISOString(), error_code: safe.code, error_message: safe.message, http_status: safe.httpStatus });
            if (!safe.retryable || attempt > config.max_retries) throw safe;
            await bounded(() => sleep(Math.min(250 * 2 ** (attempt - 1), 1000)), remaining(), signal);
            continue;
          }
          inputTokens = result.input_tokens; outputTokens = result.output_tokens;
          usageComplete &&= inputTokens !== null && outputTokens !== null;
          await store.finishAttempt(id, attempt, { status: 'completed', finished_at: new Date().toISOString(), input_tokens: inputTokens, output_tokens: outputTokens });
          break;
        }
        // Persist audit before returning the result. Cache failure cannot erase a billed success.
        await finish('completed');
        if (cacheKey) {
          try { await store.putCache({ cache_key: cacheKey, result_text: result.text, expires_at: new Date(Date.now() + config.cache_ttl_seconds * 1000).toISOString() }); }
          catch { /* Cache is an optimization; audit has already succeeded. */ }
        }
        return { id, text: result.text, cached: false, provider, model, usage: { input_tokens: inputTokens, output_tokens: outputTokens, complete: usageComplete } };
      } catch (error) {
        const safe = safeError(error);
        try { await finish(safe.code === 'TIMEOUT' ? 'timed_out' : safe.code === 'CANCELLED' ? 'cancelled' : 'failed', { error_code: safe.code, error_message: safe.message }); }
        catch { console.error(JSON.stringify({ event: 'ai_audit_write_failed', job_id: id, code: 'STORAGE_ERROR' })); }
        safe.operationId = id; throw safe;
      }
    },
  };
}

// Internal entry point only: future authenticated features import this service.
export function getAIService(env = process.env) {
  return createAIService({ store: createStore(createServerClient(env)), server: readServerConfig(env) });
}
