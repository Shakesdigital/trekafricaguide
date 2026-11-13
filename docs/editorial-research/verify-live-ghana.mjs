const url = 'https://trekafricaguide.com/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/';
const page = await fetch(url);
const text = await page.text();
const imgs = [...text.matchAll(/src="(https:\/\/trekafricaguide\.com\/images\/editorial\/plan-first-ghana-trip\/[^"]+)"/g)].map(m => m[1]);
const results = { page: page.status, bodyCopy: text.includes('10 to 15 day processing') && text.includes('castle coast'), leak: /editorial-overrides|photoLibrary =/.test(text), h2count: (text.match(/<h2/g) || []).length };
results.imgStatus = {};
const uniq = [...new Set(imgs)];
for (const u of uniq) {
  const r = await fetch(u, { method: 'HEAD' });
  results.imgStatus[u.split('/').pop()] = r.status + ' ' + (r.headers.get('content-type') || '');
}
results.imgCount = uniq.length;
console.log(JSON.stringify(results, null, 1));
