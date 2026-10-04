import { createAdminHandler } from '../../server/ai/admin.mjs';
import { bounded, safeError } from '../../server/ai/errors.mjs';

const handler = createAdminHandler();
export default async (request) => {
  try { return await bounded(() => handler(request), 10000, request.signal); }
  catch (error) {
    const safe = safeError(error);
    return Response.json({ error: safe.code, message: safe.message }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
