(async () => {
  for (const u of ['https://trekafricaguide.com/attractions/cairo-and-giza/', 'https://trekafricaguide.com/accommodations/marriott-mena-house-cairo/', 'https://trekafricaguide.com/activities/giza-pyramids-guided-tour/']) {
    const r = await fetch(u);
    const t = await r.text();
    const text = t.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('==', u, r.status, t.length);
    // paragraph-ish body snippets
    const h2s = [...t.matchAll(/<h2[^>]*>([\s\S]{0,80}?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('h2:', JSON.stringify(h2s));
    console.log(text.slice(0, 2500));
    console.log('---');
  }
})();
