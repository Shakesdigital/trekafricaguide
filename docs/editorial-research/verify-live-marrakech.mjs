// Live verification for the Marrakech insight (post-push)
const base = 'https://trekafricaguide.com';
const slug = 'where-to-sleep-in-marrakech-riad-or-gueliz';

const res = await fetch(`${base}/travel-insights/${slug}/`, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (verify)' } });
const html = await res.text();
console.log('detail HTTP', res.status, html.length, 'bytes');
let fail = 0;
const ck = (n, ok) => { if (!ok) { console.log('FAIL', n); fail++; } };

ck('title', html.includes('Where to sleep in Marrakech: a medina riad or a Gueliz hotel'));
ck('distinctive copy', html.includes('one city with two nervous systems'));
ck('h3 access', html.includes('The access test that shapes the arrival day'));
ck('vehicle quote', html.includes('a vehicle may not reach the door'));
ck('no JSON leak', !html.includes('"sha256"') && !html.includes('"local_path"'));
ck('no stray escapes', !html.includes('\\u') && !html.includes('undefined'));
ck('internal links', ['riad-rosemary','countries/morocco/marrakech','marrakech-and-atlas','marrakech-medina-street-food-tour','atlas-mountains-day-trip','countries/morocco'].every(s => html.includes(s)));

const files = ['jamaa-el-fna-dusk-2025', 'riad-courtyard-pool-2007', 'souk-haddadine-lanterns-2024', 'bahia-palace-court-2016', 'koutoubia-rooftops-2016', 'gueliz-avenue-2006'];
for (const f of files) {
  const r = await fetch(`${base}/images/editorial/marrakech-riad-or-gueliz/${f}.jpg`, { method: 'HEAD', headers: { 'user-agent': 'trek-editorial-bot/1.0 (verify)' } });
  console.log('img', f, r.status, r.headers.get('content-type'));
  ck('img200 ' + f, r.status === 200 && (r.headers.get('content-type') || '').includes('image/jpeg'));
}

const arch = await fetch(`${base}/travel-insights/`, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (verify)' } });
const ah = await arch.text();
console.log('archive HTTP', arch.status);
ck('archive listing', ah.includes(slug));

console.log(fail === 0 ? 'ALL LIVE CHECKS PASSED' : `${fail} FAILURES`);
