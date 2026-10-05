// Mock fetch helper for Media Engine tests.
// Provides utilities to mock global.fetch responses.

/**
 * Create a mock fetch implementation that returns a JSON response.
 * @param {object} jsonData - the data to return as JSON
 * @param {number} [status=200] - HTTP status
 * @param {object} [extra] - additional Response fields
 */
export function mockFetchJson(jsonData, status = 200, extra = {}) {
  return async (url, options = {}) => {
    if (options.signal?.aborted) {
      const err = new Error('The user aborted a request.');
      err.name = 'AbortError';
      throw err;
    }
    return buildMockResponse(jsonData, { status, ...extra });
  };
}

/**
 * Create a mock fetch that returns a pre-built response object.
 * @param {object} response - the response object to return
 */
export function mockFetch(response) {
  return async (url, options = {}) => {
    if (options.signal?.aborted) {
      const err = new Error('The user aborted a request.');
      err.name = 'AbortError';
      throw err;
    }
    // If response is a callable, call it with url
    if (typeof response === 'function') {
      return response(url, options);
    }
    return response;
  };
}

/**
 * Create a mock fetch that always errors.
 */
export function mockFetchError(error) {
  return async (url, options = {}) => {
    if (options.signal?.aborted) {
      const err = new Error('The user aborted a request.');
      err.name = 'AbortError';
      throw err;
    }
    throw error instanceof Error ? error : new Error(String(error));
  };
}

/**
 * Build a mock Response object compatible with the Fetch API interface.
 */
export function buildMockResponse(data, opts = {}) {
  const {
    status = 200,
    headers = {},
    ok = status >= 200 && status < 300,
  } = opts;

  const headersObj = {
    get: (name) => {
      const lower = name.toLowerCase();
      return headers[lower] || headers[name] || null;
    },
  };

  return {
    ok,
    status,
    headers: headersObj,
    redirected: false,
    redirect: 'manual',
    json: async () => typeof data === 'string' ? JSON.parse(data) : data,
    text: async () => typeof data === 'string' ? data : JSON.stringify(data),
    blob: async () => new Blob([typeof data === 'string' ? data : JSON.stringify(data)]),
  };
}

export default { mockFetchJson, mockFetch, mockFetchError, buildMockResponse };
