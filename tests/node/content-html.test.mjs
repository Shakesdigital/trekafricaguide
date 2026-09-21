import test from 'node:test';
import assert from 'node:assert/strict';
import { plainText, sanitizeRichText } from '../../src/lib/content-html.mjs';

test('sanitizer removes executable markup but preserves approved editorial tags', () => {
  const html = sanitizeRichText('<p>Hello <strong>Africa</strong></p><script>alert(1)</script>');
  assert.equal(html, '<p>Hello <strong>Africa</strong></p>');
});

test('sanitizer keeps safe links external and removes unsafe schemes', () => {
  const html = sanitizeRichText('<p><a href="https://example.com">Safe</a> <a href="javascript:alert(1)">Bad</a></p>');
  assert.equal(
    html,
    '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Safe</a> <a>Bad</a></p>',
  );
});

test('plainText strips markup and normalizes whitespace', () => {
  assert.equal(plainText('<p>Hello <strong>Africa</strong></p><script>alert(1)</script>'), 'Hello Africa');
});
