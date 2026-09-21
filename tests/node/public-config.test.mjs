import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writePublicConfig } from '../../scripts/write-public-config.mjs';

test('generated browser config contains only public Supabase and Stay22 values', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'trek-config-'));
  const file = join(dir, 'runtime-config.js');
  await writePublicConfig({
    outputPath: file,
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_public',
      STAY22_AFFILIATE_ID: 'aid-public',
      SUPABASE_SERVICE_ROLE_KEY: 'secret-service-role',
    },
  });
  const js = await readFile(file, 'utf8');
  assert.match(js, /window\.TREK_SUPABASE/);
  assert.match(js, /publishableKey/);
  assert.match(js, /stay22AffiliateId/);
  assert.doesNotMatch(js, /service|secret-service-role|SERVICE_ROLE/i);
  assert.doesNotMatch(js, /<\/script>/i);
  await rm(dir, { recursive: true, force: true });
});

test('missing browser config writes a disabled object with a clear message', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'trek-config-'));
  const file = join(dir, 'runtime-config.js');
  await writePublicConfig({ outputPath: file, env: {} });
  const js = await readFile(file, 'utf8');
  assert.match(js, /"configured":\s*false/);
  assert.match(js, /Supabase public configuration is missing/);
  await rm(dir, { recursive: true, force: true });
});
