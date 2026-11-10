// Verify metadata for candidate Marrakech photos
const files = [
  'File:Riad monceau.jpg',
  'File:Laksiba Courtyard.jpg',
  'File:Jamaa El Fna, Marrakesh, Morocco, 20250124 1804 7017.jpg',
  'File:Oriental hanging lanterns. Souk Haddadine, Marrakech Medina, Morocco.jpg',
  'File:Bahia Palace large court.jpg',
  'File:Koutoubia minaret from the city.JPG',
  'File:Gueliz Marrakech (2845727772).jpg',
  'File:Gueliz Marrakech (2845737562).jpg',
  'File:Gueliz Marrakech (2844898019).jpg',
];
const API = 'https://commons.wikimedia.org/w/api.php';
for (const f of files) {
  const url = `${API}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|user&iiurlwidth=1800&titles=${encodeURIComponent(f)}&origin=*`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (research)' } });
    const j = await res.json();
    const page = Object.values(j.query?.pages || {})[0];
    const ii = page?.imageinfo?.[0];
    if (!ii) { console.log(f, 'NOINFO'); continue; }
    const md = ii.extmetadata || {};
    console.log('\n==', f);
    console.log('user:', page.user, '| lic:', md.LicenseShortName?.value, '| date:', md.DateTimeOriginal?.value?.slice(0, 10));
    console.log('artist:', (md.Artist?.value || '').replace(/<[^>]+>/g, '').trim());
    console.log('desc:', (md.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 200));
    console.log('thumb1800:', ii.thumburl);
  } catch (e) {
    console.log(f, 'ERROR', e.message);
  }
}
