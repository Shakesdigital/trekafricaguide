const files = ['dead-vlei-camelthorn-2018-delso-dd-085.jpg','big-daddy-aerial-2019-kraasch.jpg','oryx-big-daddy-2021-strassler.jpg','dune-45-sunrise-2006-schaufele.jpg','sesriem-canyon-2018-delso-dd-186.jpg','view-from-big-daddy-2006-willis.jpg'];
for (const f of files) {
  const r = await fetch('https://trekafricaguide.com/images/editorial/sossusvlei-deadvlei-walk/' + f, { method: 'HEAD', headers: { 'user-agent': 'Mozilla/5.0' } });
  console.log(f.slice(0, 34), r.status, r.headers.get('content-type'));
  await new Promise(res => setTimeout(res, 800));
}
const arch = await (await fetch('https://trekafricaguide.com/activities/?v=2', { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
console.log('archive lists:', arch.includes('/activities/sossusvlei-guided-dune-excursion'));
const dest = await (await fetch('https://trekafricaguide.com/countries/namibia/sesriem-sossusvlei/?v=2', { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
console.log('destination links activity:', dest.includes('/activities/sossusvlei-guided-dune-excursion'));
