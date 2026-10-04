import { z } from 'zod';
import { AIError } from './errors.mjs';

export const taskType = z.string().regex(/^[a-z][a-z0-9_]{0,63}$/);
export const taskConfig = z.object({
  task_type: taskType,
  enabled: z.boolean().default(false),
  provider: z.string().regex(/^[a-z][a-z0-9_-]{0,39}$/),
  model: z.string().min(1).max(160).regex(/^[a-zA-Z0-9._:/-]+$/),
  timeout_ms: z.number().int().min(1000).max(25000).default(15000),
  max_retries: z.number().int().min(0).max(2).default(0),
  max_output_tokens: z.number().int().min(1).max(8192).default(1024),
  cache_ttl_seconds: z.number().int().min(0).max(3600).default(0),
}).strict();

const providerSchema = z.object({
  adapter: z.enum(['openai-compatible', 'anthropic']),
  endpoint: z.string().url(),
  apiKeyEnv: z.string().regex(/^AI_[A-Z0-9_]+_KEY$/),
  models: z.array(z.string().min(1).max(160)).min(1).max(50),
}).strict();

export function readServerConfig(env = process.env) {
  if (typeof window !== 'undefined') throw new AIError('CONFIGURATION');
  let providers;
  try { providers = z.record(z.string().regex(/^[a-z][a-z0-9_-]{0,39}$/), providerSchema).parse(JSON.parse(env.AI_PROVIDERS_JSON || '{}')); }
  catch { throw new AIError('CONFIGURATION'); }
  for (const provider of Object.values(providers)) {
    const url = new URL(provider.endpoint);
    // Endpoints are deployment-admin configuration, never request/DB controlled.
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
        !url.hostname.includes('.') || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/.test(url.hostname) ||
        /\.(local|internal)$/.test(url.hostname)) throw new AIError('CONFIGURATION');
    provider.apiKey = env[provider.apiKeyEnv] || '';
  }
  return { enabled: env.AI_ENABLED === 'true', providers, cacheSecret: env.AI_CACHE_HMAC_KEY || '' };
}

export function validateTask(value, server) {
  const parsed = taskConfig.safeParse(value);
  if (!parsed.success) throw new AIError('INVALID_REQUEST');
  const provider = server.providers[parsed.data.provider];
  if (!provider || !provider.models.includes(parsed.data.model)) throw new AIError('CONFIGURATION');
  if (parsed.data.enabled && !provider.apiKey) throw new AIError('CONFIGURATION');
  return parsed.data;
}
