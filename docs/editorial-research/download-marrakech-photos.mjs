// Download the six chosen Marrakech photos sequentially (2026-11 run)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dir = 'public/images/editorial/marrakech-riad-or-gueliz';
fs.mkdirSync(dir, { recursive: true });

const choices = [
  { file: 'jamaa-el-fna-dusk-2025.jpg', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Jamaa_El_Fna%2C_Marrakesh%2C_Morocco%2C_20250124_1804_7017.jpg/1920px-Jamaa_El_Fna%2C_Marrakesh%2C_Morocco%2C_20250124_1804_7017.jpg' },
  { file: 'riad-courtyard-pool-2007.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Riad_monceau.jpg' },
  { file: 'souk-haddadine-lanterns-2024.jpg', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Oriental_hanging_lanterns._Souk_Haddadine%2C_Marrakech_Medina%2C_Morocco.jpg/1920px-Oriental_hanging_lanterns._Souk_Haddadine%2C_Marrakech_Medina%2C_Morocco.jpg' },
  { file: 'bahia-palace-court-2016.jpg', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Bahia_Palace_large_court.jpg/1920px-Bahia_Palace_large_court.jpg' },
  { file: 'koutoubia-rooftops-2016.jpg', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Koutoubia_minaret_from_the_city.JPG/1920px-Koutoubia_minaret_from_the_city.JPG' },
  { file: 'gueliz-avenue-2006.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Gueliz_Marrakech_%282845727772%29.jpg' },
];

for (const c of choices) {
  const dest = path.join(dir, c.file);
  if (fs.existsSync(dest)) { console.log(c.file, 'exists'); continue; }
  const res = await fetch(c.url, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (research)' } });
  if (!res.ok) { console.log(c.file, 'HTTP', res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  console.log(c.file, buf.length, 'sha256:', sha);
}
