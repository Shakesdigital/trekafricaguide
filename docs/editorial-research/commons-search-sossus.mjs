const Q = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=12&srsearch=';
const qs = [
  'Sossusvlei Big Daddy dune',
  'Deadvlei dead trees Sossusvlei',
  'Dune 45 Namib sunrise',
  'Sossusvlei oryx dune',
  'Sesriem Canyon Namibia',
  'Sossusvlei salt pan camelthorn',
];
for (const q of qs) {
  const j = await (await fetch(Q + encodeURIComponent(q), { headers: { 'user-agent': 'EditorialBot/1.0 (contact via site)' } })).json();
  console.log('== ' + q);
  for (const it of j.query.search) console.log('  ' + it.title);
  await new Promise(r => setTimeout(r, 800));
}
