const fs = require('fs');
const dist = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/dist/';
const d = fs.readFileSync(dist + 'travel-insights/plan-first-kenya-safari-mara-reserve-or-conservancy/index.html', 'utf8');
const count = (r) => (d.match(r) || []).length;
console.log('bytes', d.length);
console.log('title:', (d.match(/<title>(.*?)<\/title>/) || [])[1]);
console.log('figures', count(/<figure/g), 'imgs', count(/<img/g));
console.log('markup leak:', /"|story\.body|escape\(/.test(d.match(/<div class="article-body[\s\S]*?<\/div>/) && d.match(/<div class="article-body[\s\S]*?<\/div>/)[0].slice(-200) || ''));
for (const f of [...d.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m => m[1])) {
  if (!/images\/editorial\/plan-first-kenya-safari-mara/.test(f)) continue;
  const p = dist + f.replace('https://trekafricaguide.com/', '').replace(/^\//, '');
  console.log('asset', f.split('/').pop(), fs.existsSync(p) ? 'EXISTS' : 'MISSING', fs.existsSync(p) ? fs.statSync(p).size + 'B' : '');
}
console.log('imgs referenced in body:', count(/images\/editorial\/plan-first-kenya-safari-mara/g));
for (const u of ['/countries/kenya/', '/countries/kenya/nairobi/', '/attractions/maasai-mara/', '/attractions/amboseli-national-park/', '/activities/maasai-mara-balloon-safari/']) {
  console.log('link', u, count(new RegExp(u.replace(/\//g, '\\/') + '"', 'g')));
}
const idx = fs.readFileSync(dist + 'travel-insights/index.html', 'utf8');
console.log('archive lists new story:', idx.includes('plan-first-kenya-safari-mara-reserve-or-conservancy'));
const home = fs.readFileSync(dist + 'index.html', 'utf8');
console.log('homepage search insIncludes?', home.includes('plan-first-kenya-safari-mara'));
// credit lines
console.log('credit mentions:', ['Danijel Mihajlovic', 'Michelle Juma', 'Daniel Case', 'Regina Hart', 'Ninara'].map(c => c + ':' + count(new RegExp(c))).join(' '));
const seg = d.slice(d.indexOf('article-body'), d.indexOf('article-body') + 40000);
console.log('hrefs:', [...seg.matchAll(/href="([^"]+)"/g)].map(m => m[1]).join('\n'));
console.log('json-ish leak in body:', (seg.match(/\{\\\?"/g) || []).length);
