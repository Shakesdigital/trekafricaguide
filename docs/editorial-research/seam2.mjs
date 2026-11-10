import fs from 'node:fs';
const t = fs.readFileSync('C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/src/lib/photo-library.js', 'utf8');
console.log('idx of first cairo-local-destination:', t.indexOf('cairo-local-destination'));
console.log(JSON.stringify(t.slice(t.indexOf('cairo-local-destination') - 300, t.indexOf('cairo-local-destination') + 500)));
