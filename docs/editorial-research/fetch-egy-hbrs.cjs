(async () => {
  for (const c of ['egypt', 'ethiopia']) {
    const r = await fetch('https://trekafricaguide.com/countries/' + c + '/');
    const t = await r.text();
    console.log('==', c, 'HTTP', r.status, t.length);
    for (const probe of ['mena', 'giza', 'cairo', 'maribela', 'Destinations in']) {
      console.log(probe, (t.match(new RegExp(probe, 'gi')) || []).length);
    }
    const hrefs = [...new Set([...t.matchAll(/href="([^"]+)"/g)].map(x => x[1]))].filter(h => /attractions|accommodations|countries\/[a-z-]+\/[a-z-]/.test(h));
    console.log(hrefs.join('\n'));
  }
})();
