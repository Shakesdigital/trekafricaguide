import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('package exposes an Astro-only production build', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(pkg.scripts.build, 'astro build');
  assert.match(pkg.dependencies.astro, /^\d/);
  assert.equal('laravel-vite-plugin' in (pkg.devDependencies || {}), false);
});

test('Astro is configured for static dist output', async () => {
  const source = await readFile('astro.config.mjs', 'utf8');
  assert.match(source, /output:\s*['"]static['"]/);
  assert.match(source, /outDir:\s*['"]\.\/dist['"]/);
});
