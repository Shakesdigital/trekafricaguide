import { sanitizeRichText } from './content-html.mjs';

export const escapeEditorialText = (value) => String(value || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

const attractionAliases = {
  'bwindi-impenetrable-national-park': ['Bwindi', 'Bwindi Impenetrable Forest'],
  'murchison-falls-national-park': ['Murchison Falls'],
  'amboseli-national-park': ['Amboseli'],
  'serengeti-national-park': ['Serengeti'],
  'cape-coast-kakum': ['Cape Coast and Kakum', 'Cape Coast Castle', 'Kakum National Park'],
  'cairo-and-giza': ['Cairo and Giza', 'Giza Pyramids'],
};

// Link published attraction names once per passage, preserving existing anchors.
export function linkAttractionMentions(value, attractions = []) {
  const html = sanitizeRichText(value);
  const names = new Map();
  for (const attraction of attractions) {
    if (!attraction.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(attraction.slug)) continue;
    names.set(escapeEditorialText(attraction.name).toLowerCase(), `/attractions/${attraction.slug}`);
    for (const alias of attractionAliases[attraction.slug] || []) names.set(escapeEditorialText(alias).toLowerCase(), `/attractions/${attraction.slug}`);
  }
  if (!names.size) return html;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${[...names.keys()].sort((a, b) => b.length - a.length).map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  let inAnchor = false;
  const linked = new Set();
  return html.split(/(<[^>]+>)/g).map((part) => {
    if (part.startsWith('<')) {
      if (/^<a\b/i.test(part)) inAnchor = true;
      if (/^<\/a\s*>/i.test(part)) inAnchor = false;
      return part;
    }
    if (inAnchor) return part;
    return part.replace(pattern, (name) => {
      const href = names.get(name.toLowerCase());
      if (linked.has(href)) return name;
      linked.add(href);
      return `<a href="${href}">${name}</a>`;
    });
  }).join('');
}
