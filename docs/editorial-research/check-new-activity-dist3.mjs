import fs from 'fs';
const ng = fs.readFileSync('dist/activities/sossusvlei-guided-dune-excursion/index.html', 'utf8');
for (const m of ng.matchAll(/<img[\s\S]{0,80}/g)) console.log('IMG:', m[0].replace(/\s+/g, ' ').slice(0, 140));
console.log('figure-ish:', (ng.match(/<figure[\s\S]{0,20}/g) || []).length);
const k = ng.indexOf('dead camelthorn on the Deadvlei pan');
console.log('caption present:', k >= 0);
if (k >= 0) console.log(ng.slice(k - 300, k + 60).replace(/\s+/g, ' '));
