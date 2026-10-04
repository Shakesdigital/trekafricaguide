// Server-only: do not import anything in server/ from Astro pages or public/.
const messages = {
  INVALID_REQUEST: 'Invalid AI request.', DISABLED: 'AI is disabled for this task.',
  CONFIGURATION: 'AI configuration is unavailable.', UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Administrator access required.', CONFLICT: 'Configuration changed; reload and retry.',
  TIMEOUT: 'AI request exceeded its time limit.', CANCELLED: 'AI request was cancelled.',
  RATE_LIMITED: 'Provider rate limit reached.', PROVIDER_ERROR: 'AI provider request failed.',
  PROVIDER_AUTH: 'AI provider authentication failed.', INVALID_RESPONSE: 'Invalid AI provider response.',
  STORAGE_ERROR: 'AI audit storage is unavailable.', INTERNAL_ERROR: 'AI operation failed.',
};
export class AIError extends Error {
  constructor(code, { retryable = false, httpStatus = null } = {}) {
    super(messages[code] || messages.INTERNAL_ERROR);
    this.name = 'AIError'; this.code = messages[code] ? code : 'INTERNAL_ERROR';
    this.retryable = retryable; this.httpStatus = httpStatus;
  }
}
export const safeError = (error) => error instanceof AIError ? error : new AIError('INTERNAL_ERROR');

export async function bounded(work, milliseconds, parentSignal) {
  if (parentSignal?.aborted) throw new AIError('CANCELLED');
  const controller = new AbortController();
  let timer;
  let abort;
  const deadline = new Promise((_, reject) => {
    abort = () => { controller.abort(); reject(new AIError('CANCELLED')); };
    parentSignal?.addEventListener('abort', abort, { once: true });
    timer = setTimeout(() => { controller.abort(); reject(new AIError('TIMEOUT')); }, Math.max(1, milliseconds));
  });
  try {
    return await Promise.race([Promise.resolve().then(() => work(controller.signal)), deadline]);
  } finally {
    clearTimeout(timer);
    if (abort) parentSignal?.removeEventListener('abort', abort);
  }
}
