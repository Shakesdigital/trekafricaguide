import { createServerClient, createStore } from '../../server/ai/store.mjs';

// Netlify scheduled functions are not exposed as ordinary public HTTP endpoints.
export const config = { schedule: '17 3 * * *' };
export default async () => {
  // No database calls until explicitly enabled in the function environment.
  if (process.env.AI_MAINTENANCE_ENABLED !== 'true') return;
  try { await createStore(createServerClient()).cleanup(); }
  catch { console.error(JSON.stringify({ event: 'ai_maintenance_failed', code: 'STORAGE_ERROR' })); throw new Error('AI maintenance failed'); }
};
