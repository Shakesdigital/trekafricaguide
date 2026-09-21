import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function writePublicConfig({ outputPath = 'public/runtime-config.js', env = process.env } = {}) {
  const configured = Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY);
  const payload = configured
    ? {
        url: env.SUPABASE_URL,
        publishableKey: env.SUPABASE_PUBLISHABLE_KEY,
        stay22AffiliateId: env.STAY22_AFFILIATE_ID || null,
        configured: true,
      }
    : {
        url: null,
        publishableKey: null,
        stay22AffiliateId: env.STAY22_AFFILIATE_ID || null,
        configured: false,
        message: 'Supabase public configuration is missing. Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Netlify.',
      };

  const json = JSON.stringify(payload, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  const js = `window.TREK_SUPABASE = Object.freeze(${json});\n`;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, js, 'utf8');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await writePublicConfig();
}
