// Phase 2: metadata for Cairo candidate files
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const UA = 'TrekAfricaGuideEditorialBot/1.0 (editorial content research; contact via trekafricaguide.com)';
const titles = [
  'File:Cairo Skyline (2020).jpg',
  'File:Cairo Tower at sunset 2015.JPG',
  'File:Cairo Tower, al-Qāhirah, CG, EGY (40942425723).jpg',
  'File:The Best View Of Cairo Tower Nile (200005243).jpeg',
  'File:Cairo Citadel (14795773755).jpg',
  'File:منظر علوي للقاهرة من أعلي قلعة صلاح الدين العلوي - Top view of Cairo from the highest citadel of Saladin.jpg',
  'File:Flickr - HuTect ShOts - Lighting Unit - Qahwa - khan el khalili Street - Cairo - Egypt - 09 04 2010.jpg',
  'File:Oriental Lamps - panoramio.jpg',
  'File:Kairo Hanging Church BW 1.jpg',
  'File:Cairo, Old Cairo, Hanging Church, Egypt, Oct 2004 edit.jpg',
  'File:Cairo - Coptic area - Hanging Church from courtyard.JPG',
  'File:Cairo, Talaat Harb Street, Egypt.jpg',
  'File:Kairo Midan Talaat Harb BW 1.jpg',
  'File:Facade of the Egyptian Museum, Tahrir Square, Cairo, Egypt1.jpg',
  'File:Flickr - Gaspa - Cairo, Il Nilo.jpg',
  'File:Late evening in Cairo.jpg',
  'File:Cairo - panorama from the Citadel - left half LCCN2004707269.jpg',
];
const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1800&titles=' + encodeURIComponent(titles.join('|'));
const d = await (await fetch(api, { headers: { 'User-Agent': UA } })).json();
const out = {};
for (const p of Object.values(d.query.pages)) {
  const ii = p.imageinfo && p.imageinfo[0];
  if (!ii) { continue; }
  const em = ii.extmetadata || {};
  out[p.title] = {
    thumb: ii.thumburl, full: ii.url, w: ii.width, h: ii.height,
    license: em.LicenseShortName && em.LicenseShortName.value,
    licenseUrl: em.LicenseUrl && em.LicenseUrl.value,
    artist: em.Artist && em.Artist.value.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ') || '',
    credit: em.Credit && em.Credit.value.replace(/<[^>]+>/g, '').slice(0, 80) || '',
    date: em.DateTimeOriginal && em.DateTimeOriginal.value || '',
    desc: em.ImageDescription && em.ImageDescription.value.replace(/<[^>]+>/g, '').slice(0, 220) || '',
  };
}
fs.writeFileSync(path.join(dir, 'cairo-commons-meta.json'), JSON.stringify(out, null, 1));
for (const [t, m] of Object.entries(out)) console.log('\n' + t + '\n  ' + m.license + ' | ' + m.artist.trim().slice(0, 60) + ' | ' + String(m.date).slice(0, 20) + ' | ' + m.w + 'x' + m.h + '\n  desc: ' + m.desc.replace(/\s+/g, ' ').slice(0, 150) + '\n  thumb: ' + m.thumb);
