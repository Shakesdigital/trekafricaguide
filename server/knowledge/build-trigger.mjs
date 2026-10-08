// Build trigger utility for static site rebuilds.
// Astro 5.x is a static site generator — content is fetched at build time
// and compiled into static HTML. When CMS data changes (via draft publishing
// or autonomous enrichment), the database is updated but the pre-built static
// files in dist/ still contain the old data.
//
// This module triggers a Netlify deploy hook to rebuild the site after
// content changes are applied, ensuring frontend reflects the latest CMS data.

const DEFAULT_TIMEOUT_MS = 10000; // 10s timeout for deploy hook call

/**
 * Fetch the Netlify deploy hook URL from site_settings.
 * Returns the hook URL or null if not configured.
 *
 * @param {object} client - Supabase server client
 * @returns {Promise<string|null>}
 */
async function getDeployHookUrl(client) {
  const { data, error } = await client
    .from('site_settings')
    .select('value')
    .eq('key', 'netlify_deploy_hook')
    .maybeSingle();

  if (error || !data) return null;
  return data.value || null;
}

/**
 * Trigger a Netlify site rebuild via the deploy hook.
 * Reads the hook URL from site_settings table.
 * Silently no-ops if the hook is not configured (e.g., local dev).
 *
 * @param {object} client - Supabase server client or mock client
 * @param {string} entityType - optional: the entity type that changed (for logging)
 * @param {string|number} entityId - optional: the entity ID that changed
 * @param {AbortSignal} [signal] - optional: abort signal for timeout
 * @returns {Promise<boolean>} - true if rebuild was triggered, false if skipped
 */
export async function triggerNetlifyRebuild(client, { entityType, entityId, signal } = {}) {
  if (typeof fetch !== 'function') {
    // No fetch available (edge runtime limitation) — skip silently
    return false;
  }

  const hookUrl = await getDeployHookUrl(client);
  if (!hookUrl) {
    // Deploy hook not configured — nothing to do
    return false;
  }

  try {
    const body = JSON.stringify({
      triggered_by: 'cms_content_change',
      entity_type: entityType || null,
      entity_id: entityId || null,
      timestamp: new Date().toISOString(),
    });

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), DEFAULT_TIMEOUT_MS);
    const combinedSignal = signal
      ? AbortSignal.any(signal, timeoutController.signal)
      : timeoutController.signal;

    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: combinedSignal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (!response || !response.ok) {
      // Deploy hook call failed — log but don't block the content operation
      // The content is saved in the database; the rebuild can be triggered manually
      return false;
    }

    return true;
  } catch {
    // Any error triggering rebuild should not block the content publish
    return false;
  }
}
