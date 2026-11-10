import fs from 'fs';
const ng = fs.readFileSync('dist/activities/sossusvlei-guided-dune-excursion/index.html', 'utf8');
let i = ng.indexOf('How the outing usually runs');
console.log(ng.slice(i - 400, i + 700));
console.log('---- img tag census:', (ng.match(/<img/g) || []).length);
console.log('---- spaced dash context:');
const j = ng.indexOf(' — ');
console.log(ng.slice(j - 120, j + 60).replace(/\s+/g, ' '));
