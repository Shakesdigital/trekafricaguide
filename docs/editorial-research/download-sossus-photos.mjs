import fs from 'fs';
import crypto from 'crypto';
const files = [
  ['dead-vlei-camelthorn-2018-delso-dd-085', 'Dead Vlei, Sossusvlei, Namibia, 2018-08-06, DD 085.jpg'],
  ['big-daddy-aerial-2019-kraasch', 'RK 1910 P1770358 Big Daddy Dune.jpg'],
  ['oryx-big-daddy-2021-strassler', 'Oryx in front of Big Daddy Dune, Sossusvlei, Namibia.jpg'],
  ['dune-45-sunrise-2006-schaufele', 'SunriseDune45 flip666.jpg'],
  ['sesriem-canyon-2018-delso-dd-186', 'Cañón Sesriem, Sossusvlei, Namibia, 2018-08-06, DD 186.jpg'],
  ['view-from-big-daddy-2006-willis', 'Sossusvlei - View from Big Daddy - (greg-willis.com) - panoramio.jpg'],
];
const outDir = 'public/images/editorial/sossusvlei-deadvlei-walk';
fs.mkdirSync(outDir, { recursive: true });
const report = [];
for (const [slug, title] of files) {
  const url = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(title)}&width=1800`;
  const r = await fetch(url, { headers: { 'user-agent': 'EditorialBot/1.0' }, redirect: 'follow' });
  if (!r.ok) { report.push({ slug, ok: false, status: r.status }); continue; }
  const buf = Buffer.from(await r.arrayBuffer());
  const path = `${outDir}/${slug}.jpg`;
  fs.writeFileSync(path, buf);
  report.push({ slug, ok: true, bytes: buf.length, finalUrl: r.url.replace('?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original','') });
  await new Promise(res => setTimeout(res, 3000));
}
for (const [slug] of files) {
  try { const b = fs.readFileSync(`${outDir}/${slug}.jpg`); console.log(slug, 'sha256', crypto.createHash('sha256').update(b).digest('hex').slice(0, 16), b.length); } catch {}
}
console.log(JSON.stringify(report, null, 1));
