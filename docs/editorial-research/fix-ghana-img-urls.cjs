const fs = require('fs');
const o = JSON.parse(fs.readFileSync('content/editorial-overrides.json', 'utf8'));
const a = o.travel_articles.find(t => t.slug === 'plan-first-ghana-trip-accra-and-the-castle-coast');
const before = a.body;
a.body = a.body.replace(/src="\/images\/editorial\/plan-first-ghana-trip\//g, 'src="https://trekafricaguide.com/images/editorial/plan-first-ghana-trip/');
fs.writeFileSync('content/editorial-overrides.json', JSON.stringify(o, null, 1) + '\n');
console.log('replaced:', (before.match(/src="\/images\/editorial\/plan-first-ghana-trip\//g) || []).length);
