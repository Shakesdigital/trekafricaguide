const urls = ['https://trekafricaguide.com/destinations/', 'https://trekafricaguide.com/local-destinations/'];
(async () => {
  for (const u of urls) {
    try {
      const r = await fetch(u);
      const t = await r.text();
      const links = [...new Set([...t.matchAll(/href="([^"]*(local-destinations|countries|destinations)[^"]*)"/g)].map(m => m[1]))];
      const h1 = (t.match(/<h1[^>]*>(?:<[^>]+>)*([\s\S]{0,80}?)<\/h1>/) || ['', '?'])[1];
      console.log('==', u, 'status', r.status, 'bytes', t.length, 'h1:', h1.replace(/<[^>]+>/g, ' '));
      console.log(links.join('\n'));
    } catch (e) { console.log('ERR', u, e.message); }
  }
})();
