// Phase 3b: remaining Cairo photos, slow sequential fetch (429 avoidance)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(repo, 'public/images/editorial/cairo-local-destination');
fs.mkdirSync(outDir, { recursive: true });
const UA = 'TrekAfricaGuideEditorialBot/1.0 (editorial content research; contact via trekafricaguide.com)';
const picks = [
  ['khan-el-khalili-street-lamps-2010.jpg', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Flickr_-_HuTect_ShOts_-_Lighting_Unit_-_Qahwa_-_khan_el_khalili_Street_-_Cairo_-_Egypt_-_09_04_2010.jpg/1920px-Flickr_-_HuTect_ShOts_-_Lighting_Unit_-_Qahwa_-_khan_el_khalili_Street_-_Cairo_-_Egypt_-_09_04_2010.jpg'],
  ['hanging-church-courtyard-mayer-2008.jpg', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Cairo_-_Coptic_area_-_Hanging_Church_from_courtyard.JPG/1920px-Cairo_-_Coptic_area_-_Hanging_Church_from_courtyard.JPG'],
  ['talaat-harb-street-argenberg-2007.jpg', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Cairo%2C_Talaat_Harb_Street%2C_Egypt.jpg/1920px-Cairo%2C_Talaat_Harb_Street%2C_Egypt.jpg'],
  ['egyptian-museum-tahrir-facade-delso-2011.jpg', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Facade_of_the_Egyptian_Museum%2C_Tahrir_Square%2C_Cairo%2C_Egypt1.jpg/1920px-Facade_of_the_Egyptian_Museum%2C_Tahrir_Square%2C_Cairo%2C_Egypt1.jpg'],
];
for (const [out, thumb] of picks) {
  const r = await fetch(thumb, { headers: { 'User-Agent': UA } });
  if (!r.ok) { console.log('FAIL', out, 'HTTP', r.status); await new Promise(res => setTimeout(res, 45000)); continue; }
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(path.join(outDir, out), buf);
  console.log('OK', out, buf.length, 'sha256=' + createHash('sha256').update(buf).digest('hex'));
  await new Promise(res => setTimeout(res, 25000));
}
