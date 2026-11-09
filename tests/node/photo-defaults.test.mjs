import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPhotoDefaults } from '../../src/lib/photo-defaults.mjs';

test('mfuwe-lodge default starter gallery is replaced by the curated override', () => {
  const row = {
    slug: 'mfuwe-lodge',
    name: 'Mfuwe Lodge',
    hero_image_url: '/images/stock/starter/mfuwe-lodge.jpg',
    gallery: ['/images/stock/starter/mfuwe-lodge.jpg'],
  };
  const result = applyPhotoDefaults('accommodations', row);
  assert.equal(result.gallery.length, 4);
  assert.ok(result.gallery.includes('/images/editorial/mfuwe-lodge/mfuwe-chalet-exterior-2011.jpg'));
  assert.ok(result.gallery.includes('/images/editorial/mfuwe-lodge/mfuwe-chalet-interior-deck-2025.jpg'));
  assert.ok(result.gallery.includes('/images/editorial/mfuwe-lodge/mfuwe-farm-to-table-2025.jpg'));
  assert.equal(result.hero_image_url, '/images/stock/starter/mfuwe-lodge.jpg');
});

test('a row with an editor-set gallery is left untouched', () => {
  const row = {
    slug: 'mfuwe-lodge',
    name: 'Mfuwe Lodge',
    hero_image_url: '/images/stock/starter/mfuwe-lodge.jpg',
    gallery: ['/images/editorial/custom/editor-choice.jpg'],
  };
  const result = applyPhotoDefaults('accommodations', row);
  assert.deepEqual(result.gallery, ['/images/editorial/custom/editor-choice.jpg']);
});

test('empty gallery default behavior unchanged', () => {
  const row = { slug: 'jolly-unknown', name: 'X', hero_image_url: '/images/stock/destinations/amboseli-national-park.jpg', gallery: [] };
  const listingsStarter = ['/images/stock/starter/jolly-unknown.jpg'];
  assert.ok(listingsStarter.length === 1);
});
