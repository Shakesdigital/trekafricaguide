import test from 'node:test';
import assert from 'node:assert/strict';
import { createProviderTransport, adapters } from '../../server/ai/providers.mjs';
import { AIError } from '../../server/ai/errors.mjs';

const OPENAI_CONFIG = {
  adapter: 'openai-compatible',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: 'sk-test-key',
  model: 'gpt-4o-mini',
  max_output_tokens: 1024,
};

const ANTHROPIC_CONFIG = {
  adapter: 'anthropic',
  endpoint: 'https://api.anthropic.com/v1/messages',
  apiKey: 'sk-test-anthropic',
  model: 'claude-3-5-sonnet-20241022',
  max_output_tokens: 1024,
};

test('adapters has openai-compatible and anthropic', () => {
  assert.ok(adapters['openai-compatible']);
  assert.ok(adapters.anthropic);
});

test('openai-compatible adapter builds correct request', () => {
  const messages = [{ role: 'user', content: 'Hello' }];
  const request = adapters['openai-compatible'].request(OPENAI_CONFIG, messages);
  assert.equal(request.headers.Authorization, 'Bearer sk-test-key');
  assert.equal(request.body.model, 'gpt-4o-mini');
  assert.deepEqual(request.body.messages, messages);
  assert.equal(request.body.stream, false);
  assert.equal(request.body.max_completion_tokens, 1024);
  assert.equal(request.body.store, false);
});

test('anthropic adapter separates system and user messages', () => {
  const messages = [
    { role: 'system', content: 'You are helpful.' },
    { role: 'user', content: 'Hello' },
  ];
  const request = adapters.anthropic.request(ANTHROPIC_CONFIG, messages);
  assert.equal(request.headers['x-api-key'], 'sk-test-anthropic');
  assert.equal(request.headers['anthropic-version'], '2023-06-01');
  assert.equal(request.body.model, 'claude-3-5-sonnet-20241022');
  assert.equal(request.body.max_tokens, 1024);
  assert.equal(request.body.stream, false);
  assert.equal(request.body.system, 'You are helpful.');
  assert.deepEqual(request.body.messages, [{ role: 'user', content: 'Hello' }]);
});

test('openai-compatible response parser extracts text and token usage', () => {
  const data = {
    choices: [{ message: { content: 'Hello there!' } }],
    usage: { prompt_tokens: 10, completion_tokens: 5 },
  };
  const result = adapters['openai-compatible'].response(data);
  assert.equal(result.text, 'Hello there!');
  assert.equal(result.input_tokens, 10);
  assert.equal(result.output_tokens, 5);
});

test('anthropic response parser extracts text from blocks', () => {
  const data = {
    content: [
      { type: 'text', text: 'Hello ' },
      { type: 'text', text: 'world!' },
      { type: 'thinking', content: 'reasoning' },
    ],
    usage: { input_tokens: 15, output_tokens: 8 },
  };
  const result = adapters.anthropic.response(data);
  assert.equal(result.text, 'Hello world!');
  assert.equal(result.input_tokens, 15);
  assert.equal(result.output_tokens, 8);
});

test('transport throws CONFIGURATION for unknown adapter', async () => {
  const transport = createProviderTransport();
  const badConfig = { adapter: 'unknown', endpoint: 'https://api.example.com', model: 'test', apiKey: 'key', max_output_tokens: 100 };
  let caughtError;
  try {
    await transport(badConfig, [], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'CONFIGURATION');
});

test('transport maps 429 to RATE_LIMITED', async () => {
  const fetchImpl = (url, init) => Promise.resolve({
    ok: false,
    status: 429,
    body: { cancel: () => Promise.resolve() },
  });
  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'RATE_LIMITED');
  assert.equal(caughtError.retryable, true);
});

test('transport maps 401 to PROVIDER_AUTH', async () => {
  const fetchImpl = (url, init) => Promise.resolve({
    ok: false,
    status: 401,
    body: { cancel: () => Promise.resolve() },
  });
  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'PROVIDER_AUTH');
});

test('transport maps 500 to PROVIDER_ERROR with non-retryable flag', async () => {
  const fetchImpl = (url, init) => Promise.resolve({
    ok: false,
    status: 500,
    body: { cancel: () => Promise.resolve() },
  });
  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'PROVIDER_ERROR');
  assert.equal(caughtError.retryable, false, '500 should not be retryable per spec');
});

test('transport maps abort to TIMEOUT', async () => {
  const fetchImpl = (url, init) => {
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    return Promise.reject(error);
  };
  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
});

test('transport rejects responses exceeding 512KB body', async () => {
  const bodyStream = {
    getReader: () => ({
      read: async () => {
        const chunk = new Uint8Array(520000); // > 512KB, triggers INVALID_RESPONSE
        return { done: true, value: chunk };
      },
      cancel: () => Promise.resolve(),
    }),
  };

  const fetchImpl = (url, init) => Promise.resolve({
    ok: true,
    body: bodyStream,
  });

  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'INVALID_RESPONSE');
});

test('transport rejects empty response text', async () => {
  const bodyStream = {
    getReader: () => ({
      read: async () => ({ done: true, value: new Uint8Array(Buffer.from(JSON.stringify({ choices: [{ message: { content: '' } }], usage: {} }))) }),
      cancel: () => Promise.resolve(),
    }),
  };
  const fetchImpl = (url, init) => Promise.resolve({ ok: true, body: bodyStream });
  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'INVALID_RESPONSE');
});

test('transport rejects response text exceeding 128000 chars', async () => {
  const hugeText = 'x'.repeat(128001);
  const responseBody = JSON.stringify({
    choices: [{ message: { content: hugeText } }],
    usage: { prompt_tokens: 10, completion_tokens: 5 },
  });

  const bodyStream = {
    getReader: () => ({
      read: async () => ({ done: true, value: new Uint8Array(Buffer.from(responseBody)) }),
      cancel: () => Promise.resolve(),
    }),
  };
  const fetchImpl = (url, init) => Promise.resolve({ ok: true, body: bodyStream });
  const transport = createProviderTransport(fetchImpl);
  let caughtError;
  try {
    await transport(OPENAI_CONFIG, [{ role: 'user', content: 'hi' }], undefined);
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError instanceof AIError);
  assert.equal(caughtError.code, 'INVALID_RESPONSE');
});
