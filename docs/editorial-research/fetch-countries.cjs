(async () => {
  const r = await fetch('https://trekafricaguide.com/countries/');
  const t = await r.text();
  const links = [...new Set([...t.matchAll(/href="([^"]*\/countries\/[^"]*)"/g)].map(m => m[1]))];
  console.log('status', r.status, 'bytes', t.length);
  console.log(links.join('\n'));
})();
