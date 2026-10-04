// Re-exports admin auth helpers and adds Content Manager-specific role checks.
// Uses the same requirementAdmin pattern as the AI infrastructure:
// Bearer token → auth.getUser() → profiles.role.
import { AIError } from '../ai/errors.mjs';
import { createServerClient } from '../ai/store.mjs';

// Re-export the AI infrastructure's admin check — same auth flow, same security.
export { requireAdmin } from '../ai/admin.mjs';

/**
 * Require the user to be an editor or above (admin, super_admin, editor).
 * Editors can view Content Manager drafts but cannot approve/publish.
 *
 * @param {Request} request - the HTTP request (must have Authorization: Bearer <token>)
 * @param {object} client - Supabase client from createServerClient()
 * @returns {Promise<{userId: string, role: string}>}
 * @throws {AIError} UNAUTHORIZED or FORBIDDEN
 */
export async function requireEditor(request, client) {
  const match = request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/);
  if (!match) throw new AIError('UNAUTHORIZED');
  const { data, error } = await client.auth.getUser(match[1]);
  if (error || !data?.user || data.user.is_anonymous) throw new AIError('UNAUTHORIZED');
  const profile = await client.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  if (profile.error) throw new AIError('STORAGE_ERROR');
  const role = profile.data?.role;
  if (!['editor', 'admin', 'super_admin'].includes(role)) throw new AIError('FORBIDDEN');
  return { userId: data.user.id, role };
}

/**
 * Convenience: create a server client if one isn't provided.
 */
export function getClient(env = process.env) {
  return createServerClient(env);
}
