import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildSiteModel } from '../src/lib/site-model.mjs';
import { loadContent } from '../src/lib/content-repository.mjs';
import { readBuildEnv } from '../src/lib/env.mjs';

export function auditContentParity(manifest, model) {
  const families = ['regions', 'countries', 'attractions', 'accommodations'];
  const missing = {};
  for (const family of families) {
    const slugs = new Set(model[family].map((item) => item.slug));
    missing[family] = (manifest[family] || []).filter((slug) => !slugs.has(slug)).sort();
  }
  const ok = families.every((family) => missing[family].length === 0);
  return { ok, missing };
}

async function main() {
  const manifest = JSON.parse(await readFile('content/legacy-route-manifest.json', 'utf8'));
  const fixturePath = process.env.CONTENT_FIXTURE_PATH;
  const env = fixturePath && process.env.NODE_ENV === 'test'
    ? { supabaseUrl: 'https://example.supabase.co', supabasePublishableKey: 'sb_publishable_test_key', stay22AffiliateId: 'aid-test', siteUrl: 'https://trekafricaguide.com' }
    : readBuildEnv();
  const tables = await loadContent({ env, fixturePath });
  const report = auditContentParity(manifest, buildSiteModel(tables));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
