import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildSiteModel } from '../../src/lib/site-model.mjs';
import { auditContentParity } from '../../scripts/audit-content-parity.mjs';

const fixture = JSON.parse(await readFile('tests/fixtures/site-data.json', 'utf8'));
const model = buildSiteModel(fixture, new Date('2026-09-21T12:00:00Z'));

test('content parity reports zero missing slugs for the fixture manifest', () => {
  const manifest = {
    regions: model.regions.map((item) => item.slug),
    countries: model.countries.map((item) => item.slug),
    attractions: model.attractions.map((item) => item.slug),
    accommodations: model.accommodations.map((item) => item.slug),
  };
  const report = auditContentParity(manifest, model);
  assert.deepEqual(report.missing, { regions: [], countries: [], attractions: [], accommodations: [] });
  assert.equal(report.ok, true);
});

test('content parity identifies missing required slugs', () => {
  const report = auditContentParity({ regions: ['missing-region'], countries: [], attractions: [], accommodations: [] }, model);
  assert.equal(report.ok, false);
  assert.deepEqual(report.missing.regions, ['missing-region']);
});
