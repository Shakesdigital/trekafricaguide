const fs = require('fs');
const h = fs.readFileSync('dist/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/index.html', 'utf8');
const h2s = [...h.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, ''));
console.log('H2s:\n' + h2s.join('\n'));
console.log('imgs:\n' + [...h.matchAll(/<img[^>]*src="([^"]*)"/g)].map(m => m[1]).join('\n'));
console.log('leak-ish check:', /editorial-overrides|photoLibrary =/.test(h));
const dir = 'dist/images/editorial/plan-first-ghana-trip';
console.log('dist images:', fs.readdirSync(dir).join(', '));
