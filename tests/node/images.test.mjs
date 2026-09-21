import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveImage } from '../../src/lib/images.mjs';

test('resolveImage returns non-slot values unchanged', () => {
  assert.equal(resolveImage('https://example.com/img.jpg'), 'https://example.com/img.jpg');
  assert.equal(resolveImage(null), null);
  assert.equal(resolveImage(undefined), undefined);
});

test('resolveImage resolves known slot keys to stock paths', () => {
  assert.equal(resolveImage('image-slot:home-hero-east-africa'), '/images/stock/destinations/maasai-mara.jpg');
  assert.equal(resolveImage('image-slot:home-intro-africa-map'), '/images/stock/destinations/okavango-delta.jpg');
  assert.equal(resolveImage('image-slot:country-kenya'), '/images/stock/destinations/maasai-mara.jpg');
  assert.equal(resolveImage('image-slot:country-uganda'), '/images/stock/destinations/bwindi-impenetrable-national-park.jpg');
  assert.equal(resolveImage('image-slot:destinations-index-hero'), '/images/stock/destinations/cape-town.jpg');
});

test('resolveImage falls back to slug for unknown slot keys', () => {
  assert.equal(resolveImage('image-slot:attraction-foo-bar'), '/images/stock/destinations/foo-bar.jpg');
  assert.equal(resolveImage('image-slot:custom-key'), '/images/stock/destinations/custom-key.jpg');
});

test('resolveImage handles region slots', () => {
  assert.equal(resolveImage('image-slot:region-east-africa'), '/images/stock/destinations/serengeti-national-park.jpg');
  assert.equal(resolveImage('image-slot:region-west-africa'), '/images/stock/destinations/sine-saloum-delta.jpg');
  assert.equal(resolveImage('image-slot:region-southern-africa'), '/images/stock/destinations/namib-desert.jpg');
  assert.equal(resolveImage('image-slot:region-northern-africa'), '/images/stock/destinations/marrakech-and-atlas.jpg');
});
