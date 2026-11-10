const pages = ['https://trekafricaguide.com/countries/namibia', 'https://trekafricaguide.com/countries/namibia/sesriem-sossusvlei/', 'https://trekafricaguide.com/attractions/namib-desert/'];
for (const u of pages) {
  const t = await (await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
  const acts = [...new Set([...t.matchAll(/href="(\/activities\/[^"#]+)"/g)].map(m => m[1]))];
  console.log('===', u, 'len', t.length);
  console.log('activities links:', acts.join(', ') || 'NONE');
  const duneMentions = (t.match(/[Ss]ossusvlei|Deadvlei|Dead Vlei|dune climb/g) || []).length;
  console.log('sossusvlei/deadvlei/dune-mentions:', duneMentions);
}
