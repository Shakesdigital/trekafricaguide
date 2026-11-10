(async () => {
  const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' };
  for (const u of ['https://www.cairo.gov.eg/en/governorate-services/transportation-services/metro/', 'https://www.cairo-airport.com/', 'https://sis.gov.eg/en/', 'https://www.egypt.travel/']) {
    try {
      const r = await fetch(u, { headers: UA });
      const t = await r.text();
      const text = t.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      console.log('==', u, r.status, t.length);
      console.log(text.slice(0, 900));
      console.log('---');
    } catch (e) { console.log('ERR', u, e.message); }
  }
})();
