const get = async u => await (await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
const strip = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/\s+/g, ' ');
for (const u of ['https://trekafricaguide.com/attractions/namib-desert/', 'https://trekafricaguide.com/countries/namibia/sesriem-sossusvlei/', 'https://trekafricaguide.com/countries/namibia/']) {
  const t = strip(await get(u));
  console.log('=====', u);
  for (const kw of ['sunrise', 'gate', 'shuttle', '4x4', '4WD', 'two-wheel', '2WD', 'kilometre', 'Deadvlei', 'Big Daddy', 'Sossusvlei', 'sunrise', 'Dune 45', 'professional']) {
    let i = t.toLowerCase().indexOf(kw.toLowerCase());
    if (i >= 0) console.log('[' + kw + ']', t.slice(Math.max(0, i - 160), i + 260));
  }
}
