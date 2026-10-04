import { AIError } from './errors.mjs';

const count = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
export const adapters = Object.freeze({
  'openai-compatible': {
    request: (config, messages) => ({
      headers: { Authorization: `Bearer ${config.apiKey}` },
      body: { model: config.model, messages, max_completion_tokens: config.max_output_tokens, stream: false, store: false },
    }),
    response: (data) => ({
      text: data.choices?.[0]?.message?.content,
      input_tokens: count(data.usage?.prompt_tokens), output_tokens: count(data.usage?.completion_tokens),
    }),
  },
  anthropic: {
    request: (config, messages) => ({
      headers: { 'x-api-key': config.apiKey, 'anthropic-version': '2023-06-01' },
      body: { model: config.model, max_tokens: config.max_output_tokens,
        system: messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n'),
        messages: messages.filter((m) => m.role !== 'system'), stream: false },
    }),
    response: (data) => ({
      text: data.content?.filter((block) => block.type === 'text').map((block) => block.text).join(''),
      input_tokens: count(data.usage?.input_tokens), output_tokens: count(data.usage?.output_tokens),
    }),
  },
});

export function createProviderTransport(fetchImpl = fetch, registry = adapters) {
  return async (config, messages, signal) => {
    const adapter = registry[config.adapter];
    if (!adapter) throw new AIError('CONFIGURATION');
    const request = adapter.request(config, messages);
    let response;
    try {
      response = await fetchImpl(config.endpoint, { method: 'POST', redirect: 'error', signal,
        headers: { 'Content-Type': 'application/json', ...request.headers }, body: JSON.stringify(request.body) });
    } catch {
      // Ambiguous network failures/timeouts are not retried: provider may have billed them.
      throw new AIError(signal?.aborted ? 'TIMEOUT' : 'PROVIDER_ERROR');
    }
    if (!response.ok) {
      await response.body?.cancel();
      const status = response.status;
      throw new AIError(status === 429 ? 'RATE_LIMITED' : [401, 403].includes(status) ? 'PROVIDER_AUTH' : 'PROVIDER_ERROR',
        { httpStatus: status, retryable: status === 429 || [502, 503, 504].includes(status) });
    }
    // Bound body size, and retain neither raw provider errors nor entire responses.
    const reader = response.body.getReader(); let size = 0; const chunks = [];
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length; if (size > 512000) throw new AIError('INVALID_RESPONSE');
        chunks.push(value);
      }
      const result = adapter.response(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      if (typeof result.text !== 'string' || !result.text.trim() || result.text.length > 128000) throw new AIError('INVALID_RESPONSE');
      return result;
    } catch (error) { throw error instanceof AIError ? error : new AIError('INVALID_RESPONSE'); }
    finally { await reader.cancel().catch(() => {}); }
  };
}
