import { createEditorialClient } from '../../server/content-manager/editorial-mirror.mjs';
import { requireAdmin } from '../../server/content-manager/auth.mjs';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!request.headers.get('authorization')) return json({ error: 'Sign in to the CMS first.' }, 401);
  try {
    const client = createEditorialClient();
    await requireAdmin(request, client);
    const mirror = await client.from('editorial_documents').select('slug').limit(1);
    if (mirror.error || !mirror.data?.length) return json({ error: 'CMS synchronization has not been activated yet.' }, 503);
    const hook = process.env.NETLIFY_DEPLOY_HOOK;
    if (!hook) return json({ error: 'Saved content is safe. Website publishing needs the server deploy hook configured.' }, 503);
    const url = new URL(hook);
    if (url.protocol !== 'https:' || url.hostname !== 'api.netlify.com' || !url.pathname.startsWith('/build_hooks/')) {
      return json({ error: 'Website publishing is not configured correctly.' }, 503);
    }
    const result = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(10000) });
    if (!result.ok) return json({ error: 'The hosting service did not accept the publishing request. Your saved content remains in the CMS.' }, 502);
    return json({ message: 'Publication requested. Changes become live after the deployment succeeds.' }, 202);
  } catch (error) {
    const code = error?.code;
    return json({ error: ['UNAUTHORIZED','FORBIDDEN'].includes(code) ? 'Administrator access is required.' : 'Publishing is unavailable. Your saved content remains in the CMS.' }, ['UNAUTHORIZED','FORBIDDEN'].includes(code) ? 403 : 503);
  }
};
