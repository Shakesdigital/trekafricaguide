const fs = require('fs');
const h = fs.readFileSync('dist/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/index.html', 'utf8');
const figs = [...h.matchAll(/<figure>[\s\S]*?<\/figure>/g)].map(m => (m[0].match(/src="([^"]*)"/) || [])[1]);
console.log('figure imgs:\n' + figs.join('\n'));
console.log('h2 count:', (h.match(/<h2/g) || []).length);
// compare with reference activity page h2 flow
const ref = fs.readFileSync('dist/activities/volcanoes-golden-monkey-trekking/index.html', 'utf8');
console.log('ref h2s:', [...ref.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '')).join(' | '));
