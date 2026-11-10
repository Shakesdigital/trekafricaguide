const titles = encodeURIComponent(['File:Dead Vlei, Sossusvlei, Namibia, 2018-08-06, DD 085.jpg','File:RK 1910 P1770358 Big Daddy Dune.jpg','File:Oryx in front of Big Daddy Dune, Sossusvlei, Namibia.jpg','File:SunriseDune45 flip666.jpg','File:Cañón Sesriem, Sossusvlei, Namibia, 2018-08-06, DD 186.jpg','File:Sossusvlei - View from Big Daddy - (greg-willis.com) - panoramio.jpg'].join('|'));
const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&iiextmetadatafilter=Artist|LicenseShortName|DateTimeOriginal|ImageDescription|LicenseUrl&titles=${titles}`;
const j = await (await fetch(url, { headers: { 'user-agent': 'EditorialBot/1.0' } })).json();
for (const p of Object.values(j.query.pages)) {
  const ii = p.imageinfo && p.imageinfo[0];
  if (!ii) { console.log('MISSING', p.title); continue; }
  const em = ii.extmetadata || {};
  const s = v => (v && (v.value || '')).replace(/<[^>]*>/g, '').slice(0, 300);
  console.log('####', p.title);
  console.log('Artist:', s(em.Artist));
  console.log('License:', s(em.LicenseShortName), s(em.LicenseUrl));
  console.log('Date:', s(em.DateTimeOriginal));
  console.log('Desc:', s(em.ImageDescription));
  console.log('URL:', ii.url);
}
