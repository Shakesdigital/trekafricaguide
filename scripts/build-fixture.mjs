import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const fixturePath = resolve('tests/fixtures/site-data.json');
const astroBin = resolve('node_modules/astro/astro.js');

const result = spawnSync(process.execPath, [astroBin, 'build'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    CONTENT_FIXTURE_PATH: fixturePath,
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_key',
    STAY22_AFFILIATE_ID: 'aid-test',
    SITE_URL: 'https://trekafricaguide.com',
  },
});

process.exit(result.status || 0);
