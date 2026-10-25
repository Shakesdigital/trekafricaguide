// Server/build only. Never import this module from a browser script.
import { createClient } from '@supabase/supabase-js';
import { execFileSync } from 'node:child_process';
import { applyPhotoDefaults } from '../../src/lib/photo-defaults.mjs';

export const MIRROR_ENTITIES = ['countries', 'attractions', 'activities', 'accommodations', 'travel_articles', 'local_destinations'];

export function createEditorialClient(env = process.env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (typeof window !== 'undefined' || !key || !env.SUPABASE_URL?.startsWith('https://')) {
    throw new Error('Editorial synchronization requires server-only Supabase credentials.');
  }
  return createClient(env.SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export async function reconcileEditorialMirror(tables, client) {
  if (process.env.CONTEXT && process.env.CONTEXT !== 'production') {
    throw new Error('Editorial CMS synchronization is restricted to production builds. Disable it for branch/preview deployments.');
  }
  // Commit date, rather than build start time, prevents a queued old commit
  // from reverting a newer import. Missing provenance fails closed.
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const sourceTime = execFileSync('git', ['show', '-s', '--format=%cI', 'HEAD'], { encoding: 'utf8' }).trim();
  const documents = MIRROR_ENTITIES.flatMap((entity) => (tables[entity] || []).map((row) => ({
    entity, content: applyPhotoDefaults(entity, row),
  })));
  const { data, error } = await client.rpc('sync_editorial_documents', {
    p_documents: documents, p_commit: commit, p_source_time: sourceTime,
  });
  if (error || !Array.isArray(data)) {
    throw new Error(`Editorial CMS synchronization failed; publication stopped. ${error?.code || 'Invalid response'}`);
  }
  for (const entity of MIRROR_ENTITIES) {
    tables[entity] = data.filter((row) => row.entity === entity).map((row) => ({ ...row.content, __cms_mirrored: true }));
  }
  const conflictCount = data.filter((row) => Object.keys(row.conflicts || {}).length).length;
  console.info(`CMS mirror: ${data.length} documents; ${conflictCount} documents retain manual edits needing review.`);
  return tables;
}
