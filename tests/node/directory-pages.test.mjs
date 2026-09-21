import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('fixture build renders homepage and directories with internal listing CTAs', async () => {
  const result = spawnSync(process.execPath, ['scripts/build-fixture.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  for (const file of ['dist/index.html', 'dist/regions/index.html', 'dist/countries/index.html', 'dist/attractions/index.html', 'dist/accommodations/index.html']) {
    assert.equal(existsSync(file), true, `${file} exists`);
  }

  const home = await readFile('dist/index.html', 'utf8');
  assert.match(home, /Featured Regions/);
  assert.match(home, /Featured Attractions/);
  assert.match(home, /Featured Stays/);
  assert.match(home, /Bwindi Impenetrable National Park · Southwestern Uganda, Uganda/);
  assert.match(home, /View attraction detail/);
  assert.match(home, /View stay/);
  assert.doesNotMatch(home, /GetYourGuide|Booking\.com|Tripadvisor|Restaurants/i);
  assert.match(home, /href="\/attractions\/bwindi-impenetrable-national-park"/);
  assert.match(home, /href="\/accommodations\/sanctuary-gorilla-forest-camp"/);

  const attractions = await readFile('dist/attractions/index.html', 'utf8');
  assert.match(attractions, /value="uganda"/);
  assert.doesNotMatch(attractions, /Compare tours|Check live price|Restaurants/i);
});
