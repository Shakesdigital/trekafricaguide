(async () => {
  const UA = { 'User-Agent': 'TrekAfricaGuideEditorialBot/1.0' };
  const r = await fetch('https://www.experienceegypt.eg/en/search/city', { headers: UA });
  const t = await r.text();
  console.log(r.status, t.length);
  console.log([...new Set([...t.matchAll(/href="([^"]*cairo[^"]*)"/gi)].map(m => m[1]))].slice(0, 20).join('\n'));
})();
