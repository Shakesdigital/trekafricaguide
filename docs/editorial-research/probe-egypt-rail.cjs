(async () => {
  const t = await (await fetch('https://trekafricaguide.com/countries/egypt/')).text();
  console.log([...new Set([...t.matchAll(/href="[^"]*cairo[^"]*"/gi)].map(m => m[0]))].join('\n'));
  const idx = t.indexOf('Destinations in Egypt');
  console.log(t.slice(idx - 200, idx + 500).replace(/\s+/g, ' ').slice(0, 700));
})();
