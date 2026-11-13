const fs = require('fs');
const c = fs.readFileSync('dist/countries/zimbabwe/index.html', 'utf8');
console.log('href vf:', c.includes('href="/countries/zimbabwe/victoria-falls"'));
const i = c.indexOf('Destinations in Zimbabwe');
const seg = c.slice(i, i + 5000);
const hrefs = [...seg.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
console.log(JSON.stringify(hrefs));
