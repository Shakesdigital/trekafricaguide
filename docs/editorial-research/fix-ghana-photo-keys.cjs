const fs = require('fs');
let s = fs.readFileSync('src/lib/photo-library.js', 'utf8');
const before = s.length;
s = s.replace(/\n    \{"slug":"([^"]+)",/g, (m, slug) => '\n    "/images/editorial/plan-first-ghana-trip/' + slug + '.jpg": {"slug":"' + slug + '",');
fs.writeFileSync('src/lib/photo-library.js', s);
console.log('fixed, bytes', before, '->', s.length);
