const fs = require('fs');
const h = fs.readFileSync('dist/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/index.html', 'utf8');
console.log('figure count:', (h.match(/<figure/g) || []).length);
console.log('has intro:', h.includes('castle coast'));
console.log('has visa para:', h.includes('10 to 15 day processing'));
const i = h.indexOf('The entry paperwork starts');
console.log('after h2 (400 chars):\n' + h.slice(i, i + 500));
