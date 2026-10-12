import { affiliateExternalUrl } from './booking.mjs';
import sanitizeHtml from 'sanitize-html';

export function safeExternalUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'blockquote',
  'a',
];

export function sanitizeRichText(value, { allowImages = false } = {}) {
  if (!value) return '';

  let imageCount = 0;
  return sanitizeHtml(String(value), {
    allowedTags: allowImages ? [...ALLOWED_TAGS, 'img', 'figure', 'figcaption'] : ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'loading', 'decoding'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    exclusiveFilter: (frame) => frame.tag === 'img' && (!safeExternalUrl(frame.attribs.src) || ++imageCount > 6),
    transformTags: {
      img: (tagName, attribs) => ({ tagName, attribs: { src: safeExternalUrl(attribs.src), alt: attribs.alt || '', loading: 'lazy', decoding: 'async' } }),
      a: (tagName, attribs) => {
        if (!isAllowedHref(attribs.href)) return { tagName, attribs: {} };
        const href = affiliateExternalUrl(attribs.href) || attribs.href;
        const sponsored = href.includes('https://www.stay22.com/allez/');
        return {
          tagName,
          attribs: {
            href,
            target: '_blank',
            rel: sponsored ? 'nofollow sponsored noopener noreferrer' : 'noopener noreferrer',
          },
        };
      },
    },
  });
}

export function plainText(value) {
  return sanitizeHtml(String(value || ''), {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: (text) => text.replace(/\s+/g, ' '),
  }).trim();
}

function isAllowedHref(value) {
  try {
    const url = new URL(String(value), 'https://trekafricaguide.com');
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}
