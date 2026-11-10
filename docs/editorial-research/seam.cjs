const fs = require('fs');
const t = fs.readFileSync('C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/src/lib/photo-library.js', 'utf8');
const i = t.indexOf('"listings"');
console.log(JSON.stringify(t.slice(i - 220, i + 20)));
