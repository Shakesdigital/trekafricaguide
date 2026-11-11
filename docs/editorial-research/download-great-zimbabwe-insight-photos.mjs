// Download the six chosen Great Zimbabwe insight photos from Wikimedia Commons (2026-11-11 run)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dir = 'public/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo';
fs.mkdirSync(dir, { recursive: true });

const titles = [
  'File:Great inclosure - Great Zimbabwe (14).jpg',
  'File:Sacred enclosure – Great Zimbabwe.jpg',
  'File:Great-zim-aerial-looking-West.JPG',
  'File:Western Entrance to the Great Enclosure - Great Zimbabwe II (46698655045).jpg',
  'File:Masvingo City centre.jpg',
  'File:Lake Kyle.jpg',
];

const out = [];
for (const title of titles) {
  const q = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1920&titles=' + encodeURIComponent(title);
  const r = await fetch(q, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (editorial research)' } });
  const j = await r.json();
  const page = Object.values(j.query.pages)[0];
  const ii = page.imageinfo[0];
  const em = ii.extmetadata || {};
  const rec = {
    title,
    thumburl: ii.thumburl,
    width: ii.width, height: ii.height,
    license: (em.LicenseShortName || {}).value,
    license_url: (em.LicenseUrl || {}).value,
    creator: ((em.Artist || {}).value || '').replace(/<[^>]+>/g, '').trim(),
    date: (em.DateTimeOriginal || {}).value,
    desc_url: ii.descriptionurl,
  };
  const safe = title.replace('File:', '').replace(/[^\w\-.()]+/g, '-').slice(0, 60) + '.jpg';
  const dest = path.join(dir, safe);
  const res = await fetch(rec.thumburl, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (editorial research)' } });
  if (!res.ok) { console.log('HTTP', res.status, title); out.push({ ...rec, safe, error: res.status }); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  rec.sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  rec.bytes = buf.length;
  console.log(safe, buf.length, rec.license, rec.creator, rec.date, rec.sha256);
  out.push({ ...rec, safe });
}
fs.writeFileSync('docs/editorial-research/great-zimbabwe-insight-photo-metadata.json', JSON.stringify(out, null, 1));
console.log('metadata saved');
