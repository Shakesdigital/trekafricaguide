const fs = require('fs');
const t = fs.readFileSync('C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/src/lib/photo-library.js', 'utf8');
// top-level keys of photoLibrary object at 2-space indent
const lines = t.split('\n');
lines.forEach((l, i) => { if (/^  [A-Za-z_"]/.test(l)) console.log(i + 1, JSON.stringify(l.slice(0, 60))); });
console.log('LAST LINES:');
console.log(lines.slice(-12).join('\n'));
