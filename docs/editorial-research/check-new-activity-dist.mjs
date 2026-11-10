import fs from 'fs';
const ng = fs.readFileSync('dist/activities/sossusvlei-guided-dune-excursion/index.html', 'utf8');
const ref = fs.readFileSync('dist/activities/volcanoes-golden-monkey-trekking/index.html', 'utf8');
const heads = h => [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
console.log('NEW h2:', heads(ng).join(' | '));
console.log('REF h2:', heads(ref).join(' | '));
console.log('NEW figures:', (ng.match(/<figure>/g) || []).length, '| REF figures:', (ref.match(/<figure>/g) || []).length);
const cta = ng.match(/href="https:\/\/www\.stay22\.com\/allez\/getyourguide[^"]*"/);
console.log('CTA:', cta && decodeURIComponent(cta[0].slice(cta[0].indexOf('link=') + 5, cta[0].indexOf('&roam'))));
console.log('campaign:', cta && (cta[0].match(/campaign=([^&"]+)/) || [])[1]);
console.log('About this option present:', ng.includes('About this option'));
console.log('operator:', /Operated by ([^<]+)/.exec(ng)[1]);
console.log('review label:', /5\/5 from 2 reviews[^<]*/.exec(ng) && /[\d.]+\/5 from 2 reviews[^<]*/.exec(ng)[0]);
console.log('nearby stays cards:', (ng.match(/Nearby stays/g) || []).length, 'sossusvlei-lodge link:', ng.includes('/accommodations/sossusvlei-lodge'), 'desert-quiver link:', ng.includes('/accommodations/desert-quiver-camp'));
console.log('you-may-like:', ng.includes('You may also like'), '| breadcrumb attraction link:', ng.includes('/attractions/namib-desert'));
console.log('markup leak <h3> outside rich-text:', (ng.match(/<h3/g) || []).length);
console.log('image paths:', new Set([...ng.matchAll(/images\/editorial\/sossusvlei-deadvlei-walk\/[^"]+/g)].map(m => m[0])).size);
// all 6 assets exist in dist
for (const p of [...ng.matchAll(/(\/images\/editorial\/sossusvlei-deadvlei-walk\/[^"]+\.jpg)/g)].map(m => m[1])) {
  if (!fs.existsSync('dist' + p)) console.log('MISSING asset', p);
}
console.log('assets all present');
console.log('activities index lists new page:', fs.readFileSync('dist/activities/index.html', 'utf8').includes('/activities/sossusvlei-guided-dune-excursion'));
console.log('destination links insights only:', fs.readFileSync('dist/countries/namibia/sesriem-sossusvlei/index.html', 'utf8').indexOf('/activities/sossusvlei-guided-dune-excursion') >= 0);
const spaced = ng.match(/ [\u2013\u2014-] /);
console.log('spaced-dash flags:', spaced && spaced[0].trim());
console.log('bytes:', ng.length);
