import test from 'node:test';
import assert from 'node:assert/strict';
import { readServerConfig, validateTask, taskType } from '../../server/ai/config.mjs';
import { AIError } from '../../server/ai/errors.mjs';

const VALID_PROVIDERS = JSON.stringify({
  primary: {
    adapter: 'openai-compatible',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKeyEnv: 'AI_PRIMARY_KEY',
    models: ['gpt-4o-mini', 'gpt-4o'],
  },
  secondary: {
    adapter: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKeyEnv: 'AI_SECONDARY_KEY',
    models: ['claude-3-5-sonnet-20241022'],
  },
});

const AI_ENV = {
  AI_ENABLED: 'true',
  AI_PROVIDERS_JSON: VALID_PROVIDERS,
  AI_PRIMARY_KEY: 'sk-test-openai-key',
  AI_SECONDARY_KEY: 'sk-test-anthropic-key',
  AI_CACHE_HMAC_KEY: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service_role_test_key',
};

test('readServerConfig enables AI when AI_ENABLED=true', () => {
  const config = readServerConfig(AI_ENV);
  assert.equal(config.enabled, true);
  assert.ok(config.providers.primary, 'primary provider should be configured');
  assert.ok(config.providers.secondary, 'secondary provider should be configured');
  assert.ok(config.cacheSecret.length >= 32, 'cache secret must be at least 32 chars');
});

test('readServerConfig disables AI when AI_ENABLED is not set', () => {
  const env = { ...AI_ENV, AI_ENABLED: '' };
  const config = readServerConfig(env);
  assert.equal(config.enabled, false);
});

test('readServerConfig rejects non-HTTPS endpoints', () => {
  const env = {
    ...AI_ENV,
    AI_PROVIDERS_JSON: JSON.stringify({
      primary: {
        adapter: 'openai-compatible',
        endpoint: 'http://insecure.example.com/v1',
        apiKeyEnv: 'AI_PRIMARY_KEY',
        models: ['gpt-4o'],
      },
    }),
  };
  let threw = false;
  try {
    readServerConfig(env);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('readServerConfig rejects localhost endpoints', () => {
  const env = {
    ...AI_ENV,
    AI_PROVIDERS_JSON: JSON.stringify({
      primary: {
        adapter: 'openai-compatible',
        endpoint: 'https://localhost:8080/v1',
        apiKeyEnv: 'AI_PRIMARY_KEY',
        models: ['gpt-4o'],
      },
    }),
  };
  let threw = false;
  try {
    readServerConfig(env);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('readServerConfig rejects internal IP endpoints', () => {
  const env = {
    ...AI_ENV,
    AI_PROVIDERS_JSON: JSON.stringify({
      primary: {
        adapter: 'openai-compatible',
        endpoint: 'https://192.168.1.1/v1',
        apiKeyEnv: 'AI_PRIMARY_KEY',
        models: ['gpt-4o'],
      },
    }),
  };
  let threw = false;
  try {
    readServerConfig(env);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('readServerConfig rejects malformed JSON', () => {
  const env = { ...AI_ENV, AI_PROVIDERS_JSON: 'not json{' };
  let threw = false;
  try {
    readServerConfig(env);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('validateTask accepts a valid task config', () => {
  const server = readServerConfig(AI_ENV);
  const task = validateTask(
    {
      task_type: 'attraction_summary',
      enabled: true,
      provider: 'primary',
      model: 'gpt-4o-mini',
      timeout_ms: 15000,
      max_retries: 1,
      max_output_tokens: 1024,
      cache_ttl_seconds: 3600,
    },
    server
  );
  assert.equal(task.task_type, 'attraction_summary');
  assert.equal(task.enabled, true);
});

test('validateTask rejects invalid task_type', () => {
  const server = readServerConfig(AI_ENV);
  let threw = false;
  try {
    validateTask({ task_type: 'Invalid_Task!', provider: 'primary', model: 'gpt-4o' }, server);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'INVALID_REQUEST');
  }
  assert.equal(threw, true, 'should throw INVALID_REQUEST error');
});

test('validateTask rejects unknown provider', () => {
  const server = readServerConfig(AI_ENV);
  let threw = false;
  try {
    validateTask({ task_type: 'test', provider: 'nonexistent', model: 'gpt-4o' }, server);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('validateTask rejects model not in provider allow-list', () => {
  const server = readServerConfig(AI_ENV);
  let threw = false;
  try {
    validateTask({ task_type: 'test', provider: 'primary', model: 'gpt-9999' }, server);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('validateTask requires API key for enabled tasks', () => {
  const envNoKey = { ...AI_ENV, AI_PRIMARY_KEY: '' };
  const server = readServerConfig(envNoKey);
  let threw = false;
  try {
    validateTask({ task_type: 'test', enabled: true, provider: 'primary', model: 'gpt-4o' }, server);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'CONFIGURATION');
  }
  assert.equal(threw, true, 'should throw CONFIGURATION error');
});

test('taskType validation accepts valid names', () => {
  assert.ok(taskType.safeParse('attraction_summary').success);
  assert.ok(taskType.safeParse('meta_description').success);
  assert.ok(taskType.safeParse('travel_article_outline_v1').success);
});

test('taskType validation rejects invalid names', () => {
  assert.ok(!taskType.safeParse('Attraction_Summary').success); // uppercase
  assert.ok(!taskType.safeParse('test-type').success); // hyphen not allowed
  assert.ok(!taskType.safeParse('a'.repeat(65)).success); // too long
});
