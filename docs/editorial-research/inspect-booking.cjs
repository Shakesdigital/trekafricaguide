const fs = require('fs');
const d = fs.readFileSync('dist/countries/kenya/nairobi/index.html', 'utf8');
const m = d.match(/accommodations\/nairobi-serena-hotel/g);
console.log('dest card refs:', m ? m.length : 0);
const h = fs.readFileSync('dist/accommodations/nairobi-serena-hotel/index.html', 'utf8');
const b = [...new Set((h.match(/https?:\/\/[^"']*booking[^"']*/g) || []))];
console.log('booking hrefs:', b.slice(0, 4).join(' | '));
const s22 = [...new Set((h.match(/stay22[^"'\s]*/gi) || []))];
console.log('stay22 refs:', s22.length, s22.slice(0, 3).join(' | '));
