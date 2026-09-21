import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const nodePath = process.execPath;

test('fixture build renders the public shell without restaurants', async () => {
  const result = spawnSync(nodePath, ['scripts/build-fixture.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(existsSync('dist/contact/index.html'), true);

  const html = await readFile('dist/contact/index.html', 'utf8');
  assert.match(html, /Regions/);
  assert.match(html, /Destinations/);
  assert.match(html, /Attractions/);
  assert.match(html, /Accommodations/);
  assert.doesNotMatch(html, /Restaurants/i);
  assert.match(html, /verify live availability, rates, inclusions, permits, and final terms/i);
  assert.match(html, /--brand-primary:\s*#284932/);
  assert.match(html, /\/_astro\/.+\.css/);
});
