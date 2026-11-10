// Phase 3: download and process selected Cairo photos
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(repo, 'public/images/editorial/cairo-local-destination');
fs.mkdirSync(outDir, { recursive: true });
const UA = 'TrekAfricaGuideEditorialBot/1.0 (editorial content research; contact via trekafricaguide.com)';
const picks = [
  ['late-evening-qasr-al-nil-tower-2012.jpg', 'https://commons.wikimedia.org/wiki/File:Late_evening_in_Cairo.jpg', 'Late evening in Cairo.jpg'],
  ['cairo-tower-daytime-lemay-2019.jpg', 'https://commons.wikimedia.org/wiki/File:Cairo_Tower,_al-Q%C4%81hirah,_CG,_EGY_(40942425723).jpg', 'Cairo Tower, al-Qāhirah, CG, EGY (40942425723).jpg'],
  ['cairo-view-from-saladin-citadel-ashour-2014.jpg', 'https://commons.wikimedia.org/wiki/File:%D9%85%D9%86%D8%B8%D8%B1_%D8%B9%D9%84%D9%88%D9%8A_%D9%84%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9_%D9%85%D9%86_%D8%A3%D8%B9%D9%84%D9%8A_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A_-_Top_view_of_Cairo_from_the_highest_citadel_of_Saladin.jpg', 'Top view of Cairo from Saladin citadel'],
  ['khan-el-khalili-street-lamps-2010.jpg', 'https://commons.wikimedia.org/wiki/File:Flickr_-_HuTect_ShOts_-_Lighting_Unit_-_Qahwa_-_khan_el_khalili_Street_-_Cairo_-_Egypt_-_09_04_2010.jpg', 'khan el khalili Street'],
  ['hanging-church-courtyard-mayer-2008.jpg', 'https://commons.wikimedia.org/wiki/File:Cairo_-_Coptic_area_-_Hanging_Church_from_courtyard.JPG', 'Hanging Church from courtyard'],
  ['talaat-harb-street-argenberg-2007.jpg', 'https://commons.wikimedia.org/wiki/File:Cairo,_Talaat_Harb_Street,_Egypt.jpg', 'Cairo, Talaat Harb Street'],
  ['egyptian-museum-tahrir-facade-delso-2011.jpg', 'https://commons.wikimedia.org/wiki/File:Facade_of_the_Egyptian_Museum,_Tahrir_Square,_Cairo,_Egypt1.jpg', 'Egyptian Museum facade'],
];
for (const [out, page, name] of picks) {
  const title = decodeURIComponent(page.split('/wiki/')[1]);
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=1800&titles=' + encodeURIComponent(title);
  const d = await (await fetch(api, { headers: { 'User-Agent': UA } })).json();
  const p = Object.values(d.query.pages || {})[0];
  if (!p || !p.imageinfo) { console.log('NOQUERYMETA', out, title); continue; }
  const thumb = p.imageinfo[0].thumburl.replace(/\?.*$/, '');
  const r = await fetch(thumb, { headers: { 'User-Agent': UA } });
  if (!r.ok) { console.log('FAIL', out, 'HTTP', r.status); continue; }
  const buf = Buffer.from(await r.arrayBuffer());
  const dest = path.join(outDir, out);
  fs.writeFileSync(dest, buf);
  const sha = createHash('sha256').update(buf).digest('hex');
  console.log('OK', out, buf.length, 'bytes sha256=' + sha, 'thumb=' + thumb);
  await new Promise(res => setTimeout(res, 2500));
}
