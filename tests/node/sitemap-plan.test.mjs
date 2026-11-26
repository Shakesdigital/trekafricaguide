import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemapPlan, isSitemapPath, lastmodForPath } from '../../scripts/sitemap-plan.mjs';

const content = {
  regions: [{ slug: 'east-africa', updated_at: '2026-11-01T00:00:00Z' }],
  countries: [{ slug: 'kenya', updated_at: '2026-11-20T10:00:00Z' }],
  local_destinations: [{ slug: 'nairobi', country_slug: 'kenya' }],
  attractions: [{ slug: 'maasai-mara', updated_at: 'not-a-date' }],
  activities: [{ slug: 'mara-balloon-safari' }],
  accommodations: [{ slug: 'nairobi-serena-hotel' }],
  travel_articles: [{ slug: 'plan-first-kenya-safari' }],
};

test('sitemap plan includes hubs and published editorial pages only', () => {
  const plan = buildSitemapPlan(content);
  assert.equal(plan.urls.size, 13);
  assert.ok(plan.urls.has('/'));
  assert.ok(plan.urls.has('/countries'));
  assert.ok(plan.urls.has('/regions/east-africa'));
  assert.ok(plan.urls.has('/countries/kenya'));
  assert.ok(plan.urls.has('/countries/kenya/nairobi'));
  assert.ok(plan.urls.has('/attractions/maasai-mara'));
  assert.ok(plan.urls.has('/activities/mara-balloon-safari'));
  assert.ok(plan.urls.has('/accommodations/nairobi-serena-hotel'));
  assert.ok(plan.urls.has('/travel-insights/plan-first-kenya-safari'));
});

test('sitemap filter excludes utility and missing routes', () => {
  const plan = buildSitemapPlan(content);
  assert.equal(isSitemapPath('https://trekafricaguide.com/404', plan), false);
  assert.equal(isSitemapPath('https://trekafricaguide.com/admin/auth', plan), false);
  assert.equal(isSitemapPath('https://trekafricaguide.com/cms-editorial.html', plan), false);
  assert.equal(isSitemapPath('https://trekafricaguide.com/countries/kenya', plan), true);
});

test('lastmod uses real updated_at and omits invalid or absent values', () => {
  const plan = buildSitemapPlan(content);
  assert.equal(lastmodForPath('https://trekafricaguide.com/countries/kenya', plan), '2026-11-20T10:00:00.000Z');
  assert.equal(lastmodForPath('https://trekafricaguide.com/attractions/maasai-mara', plan), undefined);
  assert.equal(lastmodForPath('https://trekafricaguide.com/travel-insights/plan-first-kenya-safari', plan), undefined);
});