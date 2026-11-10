import fs from 'fs';
const ng = fs.readFileSync('dist/activities/sossusvlei-guided-dune-excursion/index.html', 'utf8');
let i = ng.indexOf('At the live check on 10 November 2026');
console.log('guided-cost para at', i);
console.log(ng.slice(i - 600, i + 300).replace(/\s+/g, ' '));
console.log('=== figure tags:', (ng.match(/<figure\b/g) || []).length);
console.log('=== 60 km strip after hinge para:');
const j = ng.indexOf('2x4 parking and');
console.log(ng.slice(j, j + 400).replace(/\s+/g, ' '));
