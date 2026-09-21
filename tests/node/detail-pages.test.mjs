import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('fixture build renders detail pages and detail-only provider CTAs', async () => {
  const result = spawnSync(process.execPath, ['scripts/build-fixture.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  for (const file of [
    'dist/regions/east-africa/index.html',
    'dist/countries/uganda/index.html',
    'dist/attractions/bwindi-impenetrable-national-park/index.html',
    'dist/accommodations/sanctuary-gorilla-forest-camp/index.html',
  ]) {
    assert.equal(existsSync(file), true, `${file} exists`);
  }
  assert.equal(existsSync('dist/regions/draft/index.html'), false);

  const attraction = await readFile('dist/attractions/bwindi-impenetrable-national-park/index.html', 'utf8');
  assert.match(attraction, /East Africa/);
  assert.match(attraction, /Uganda/);
  assert.match(attraction, /Nearby stays/);
  assert.match(attraction, /Sanctuary Gorilla Forest Camp/);
  assert.match(attraction, /stay22\.com\/allez\/getyourguide/);
  assert.doesNotMatch(attraction, /javascript:/i);

  const stay = await readFile('dist/accommodations/sanctuary-gorilla-forest-camp/index.html', 'utf8');
  assert.match(stay, /Related attraction/);
  assert.match(stay, /Bwindi Impenetrable National Park/);
  assert.match(stay, /stay22\.com\/allez\/booking/);
  assert.match(stay, /Trek Africa Guide does not take payment/);

  const home = await readFile('dist/index.html', 'utf8');
  assert.doesNotMatch(home, /stay22\.com|Booking\.com|GetYourGuide/);
});
