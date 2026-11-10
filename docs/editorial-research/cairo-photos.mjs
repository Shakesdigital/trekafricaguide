// Cairo local destination photo sourcing (2026-11-10 run)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname2 = path.dirname(fileURLToPath(import.meta.url));
const UA = 'TrekAfricaGuideEditorialBot/1.0 (editorial content research; contact via trekafricaguide.com)';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function j(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
const queries = {
  skyline: 'Cairo skyline Nile towers',
  tower: 'Cairo Tower sunset',
  citadel: 'Citadel Cairo view city',
  bazaar: 'Khan el-Khalili street lamps',
  coptic: 'Hanging Church Cairo Coptic',
  nile: 'Nile corniche Cairo evening',
  street: 'Cairo downtown Talaat Harb street',
  museum: 'Egyptian Museum Cairo Tahrir facade',
};
const results = {};
for (const [slot, q] of Object.entries(queries)) {
  try {
    const d = await j('https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&srnamespace=6&srlimit=15&format=json');
    results[slot] = d.query.search.map(s => s.title);
    console.log('==', slot, results[slot].length, 'hits');
    console.log(results[slot].join(' | '));
    await sleep(1500);
  } catch (e) { console.log('==', slot, 'ERR', e.message); }
}
fs.writeFileSync(path.join(__dirname2, 'cairo-commons-search.json'), JSON.stringify(results, null, 1));
