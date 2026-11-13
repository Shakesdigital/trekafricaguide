const fs = require('fs');
const h = fs.readFileSync('dist/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/index.html', 'utf8');
const m = h.match(/<figure>[\s\S]*?<\/figure>/);
console.log(JSON.stringify(m[0]));
