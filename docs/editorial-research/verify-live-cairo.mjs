// Live verification of the Cairo destination page
const URL = 'https://trekafricaguide.com/countries/egypt/cairo/';
(async () => {
  const r = await fetch(URL);
  const t = await r.text();
  const h2s = [...t.matchAll(/<h2[^>]*>([\s\S]{0,90}?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const gallery = [...new Set([...t.matchAll(/src="(\/images\/editorial\/cairo-local-destination\/[^"]*)"/g)].map(m => m[1]))];
  console.log('detail HTTP', r.status, 'bytes', t.length);
  console.log('h2:', JSON.stringify(h2s));
  console.log('hero text:', t.includes('city that gives Giza'));
  console.log('quotes:', t.includes('careful daily grouping'), t.includes('foot of the Giza'));
  console.log('gallery imgs:', gallery.length);
  console.log('where-to-stay card:', t.includes('marriott-mena-house-cairo'));
  console.log('no withdrawn insight:', !t.includes('cairo-giza-without-burning-out'));
  let okJpg = 0;
  for (const g of gallery) {
    const rr = await fetch('https://trekafricaguide.com' + g, { method: 'GET' });
    const ct = rr.headers.get('content-type');
    if (rr.ok && /image/.test(ct)) okJpg++;
    console.log(g, rr.status, ct);
  }
  console.log('jpg-ok', okJpg, '/', gallery.length);
  const home = await fetch('https://trekafricaguide.com/countries/egypt/');
  const ho = await home.text();
  console.log('country page HTTP', home.status, '| Destinations rail:', ho.includes('Destinations in Egypt'), '| cairo link:', ho.includes('/countries/egypt/cairo/'));
})();
