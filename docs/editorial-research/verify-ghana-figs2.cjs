const fs = require('fs');
const h = fs.readFileSync('dist/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/index.html', 'utf8');
const figs = [...h.matchAll(/<figure>[\s\S]*?<\/figure>/g)].map(m => {
  const src = (m[0].match(/src="([^"]*)"/) || [])[1];
  return src;
});
console.log(figs.join('\n'));
