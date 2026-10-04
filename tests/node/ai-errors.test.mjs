import test from 'node:test';
import assert from 'node:assert/strict';
import { AIError, bounded, safeError } from '../../server/ai/errors.mjs';

test('AIError maps codes to messages', () => {
  const e1 = new AIError('DISABLED');
  assert.equal(e1.code, 'DISABLED');
  assert.equal(e1.message, 'AI is disabled for this task.');
  assert.equal(e1.retryable, false);

  const e2 = new AIError('RATE_LIMITED', { retryable: true, httpStatus: 429 });
  assert.equal(e2.code, 'RATE_LIMITED');
  assert.equal(e2.retryable, true);
  assert.equal(e2.httpStatus, 429);

  const e3 = new AIError('UNKNOWN_CODE');
  assert.equal(e3.code, 'INTERNAL_ERROR');
});

test('safeError wraps non-AIError throws', () => {
  const wrapped = safeError(new Error('network down'));
  assert.equal(wrapped.code, 'INTERNAL_ERROR');
  assert.ok(wrapped instanceof AIError);

  const passthrough = safeError(new AIError('TIMEOUT'));
  assert.equal(passthrough.code, 'TIMEOUT');
  assert.equal(passthrough.message, 'AI request exceeded its time limit.');
  assert.ok(passthrough instanceof AIError);
});

test('bounded rejects immediately when parent signal is already aborted', async () => {
  const parentController = new AbortController();
  parentController.abort();

  let threw = false;
  try {
    await bounded(() => new Promise(() => {}), 5000, parentController.signal);
  } catch (err) {
    threw = true;
    assert.equal(err.code, 'CANCELLED');
  }
  assert.equal(threw, true, 'should throw CANCELLED error');
});

test('bounded times out a slow operation', async () => {
  const slowWork = () => new Promise(() => {});
  let threw = false;
  try {
    await bounded(slowWork, 50, undefined);
  } catch (err) {
    threw = true;
    assert.ok(err instanceof AIError);
    assert.equal(err.code, 'TIMEOUT');
  }
  assert.equal(threw, true, 'should throw TIMEOUT error');
});

test('bounded resolves when work completes within deadline', async () => {
  const fastWork = () => Promise.resolve('done');
  const result = await bounded(fastWork, 5000);
  assert.equal(result, 'done');
});

test('bounded surfaces abort when parent aborts during work', async () => {
  const controller = new AbortController();
  let aborted = false;
  controller.signal.addEventListener('abort', () => { aborted = true; });

  const hangingWork = (signal) => new Promise((_, __) => {
    signal.addEventListener('abort', () => {});
  });

  const race = bounded(hangingWork, 10000, controller.signal);
  setTimeout(() => controller.abort(), 10);
  let threw = false;
  try {
    await race;
  } catch (err) {
    threw = true;
    assert.equal(err.code, 'CANCELLED');
  }
  assert.equal(threw, true, 'should throw CANCELLED error');
  assert.equal(aborted, true, 'parent abort listener fired');
});
