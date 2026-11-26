const titles = [
  ['bantry-bay-coastline', 'File:Bantry Bay Cape Town.jpg'],
  ['sea-point-promenade-coast', 'File:Cape Town (ZA), Sea Point Promenade, Küste -- 2024 -- 3632.jpg'],
  ['sea-point-promenade-sunset', 'File:Cape Town (ZA), Sea Point Promenade, Sonnenuntergang -- 2024 -- 1835.jpg'],
  ['green-point-lighthouse', 'File:Cape Town (ZA), Green Point Lighthouse -- 2024 -- 3566.jpg'],
  ['sea-point-view', 'File:Sea Point, Cape Town, South Africa (Unsplash).jpg'],
  ['sea-point-aerial', 'File:Aerial View of Sea Point, Cape Town South Africa.jpg'],
];
(async () => {
  const d = await (await fetch('https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=sha1|user|timestamp|extmetadata&iiextmetadatafilter=LicenseShortName|ArtistRealName|Artist|DateTimeOriginal|ImageDescription&titles=' + encodeURIComponent(titles.map(t => t[1]).join('|')) + '&format=json')).json();
  for (const p of Object.values(d.query.pages)) {
    const ii = p.imageinfo[0];
    const md = ii.extmetadata || {};
    const strip = (v) => (v && v.value ? String(v.value).replace(/<[^>]+>/g, '').trim() : '');
    console.log(JSON.stringify({ title: p.title, sha1: ii.sha1, user: ii.user, timestamp: ii.timestamp, license: md.LicenseShortName && md.LicenseShortName.value, creator: strip(md.ArtistRealName) || strip(md.Artist), date: strip(md.DateTimeOriginal), desc: strip(md.ImageDescription).slice(0, 200) }, null, 1));
  }
})();
