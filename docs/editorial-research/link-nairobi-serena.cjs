// Surgical 1-space-format patch: link nairobi destination to nairobi-serena-hotel.
const fs = require('fs');
const p = 'content/local-destinations.json';
let s = fs.readFileSync(p, 'utf8');
const i = s.indexOf('"slug": "nairobi"');
if (i < 0) throw new Error('nairobi not found');
const needle = '"accommodation_slugs": [],';
let j = s.indexOf(needle, i);
if (j < 0) throw new Error('empty accommodation_slugs not found after nairobi');
s = s.slice(0, j) + '"accommodation_slugs": [\n   "nairobi-serena-hotel"\n  ],' + s.slice(j + needle.length);
fs.writeFileSync(p, s);
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
console.log('nairobi acc:', JSON.stringify(d.find(x => x.slug === 'nairobi').accommodation_slugs));
console.log('records:', d.length);
