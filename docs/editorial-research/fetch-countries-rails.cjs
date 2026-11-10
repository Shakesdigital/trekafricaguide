(async () => {
  for (const c of ['zimbabwe', 'ethiopia', 'egypt', 'namibia', 'kenya']) {
    const r = await fetch('https://trekafricaguide.com/countries/' + c + '/');
    const t = await r.text();
    const rails = (t.match(/<h2[^>]*>(?:<[^>]+>)*([\s\S]{0,70}?)<\/h2>/g) || []).map(x => x.replace(/<[^>]+>/g, '').trim());
    const bytes = t.length;
    console.log('==', c, 'HTTP', r.status, 'bytes', bytes);
    console.log('h2s:', JSON.stringify(rails));
    const acc = (t.match(/accommodations\/([a-z0-9-]+)\//g) || []).filter((v, i, a) => a.indexOf(v) === i);
    console.log('accommodation links:', acc.slice(0, 12).join(' '));
  }
})();
