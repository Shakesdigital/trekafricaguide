// inspect photo-library structure
import fs from 'node:fs';
const t = fs.readFileSync('C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/src/lib/photo-library.js', 'utf8');
console.log('len', t.length);
// find our inserted block
const i = t.indexOf('cairo-local-destination');
console.log(t.slice(i - 1500, i + 300));
