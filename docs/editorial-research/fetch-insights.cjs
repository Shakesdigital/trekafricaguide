(async () => {
  const r = await fetch('https://trekafricaguide.com/travel-insights/');
  const t = await r.text();
  console.log(r.status);
  console.log([...new Set([...t.matchAll(/href="([^"]*travel-insights\/[^"]*)"/g)].map(m => m[1]))].join('\n'));
})();
