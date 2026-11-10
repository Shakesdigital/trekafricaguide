// Search Commons for exact Marrakech stay-decision subjects (2026-11-10 run)
import fs from 'node:fs';

const queries = [
  ['riad', 'Riad courtyard Marrakech pool'],
  ['riad2', 'riad Maroc patio'],
  ['koutoubia', 'Koutoubia mosque Marrakech'],
  ['bahia', 'Bahia Palace courtyard'],
  ['souk', 'souk Marrakech lantern'],
  ['medina-square', 'Jemaa el-Fna square'],
  ['gueliz', 'Gueliz Marrakech'],
  ['menara', 'Menara gardens Marrakech'],
];

const API = 'https://commons.wikimedia.org/w/api.php';
const out = [];
for (const [tag, q] of queries) {
  const url = `${API}?action=query&format=json&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=8&origin=*`;
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'trek-editorial-bot/1.0 (research)' } });
    const j = await res.json();
    const hits = (j.query?.search || []).map(s => s.title);
    out.push([tag, q, hits]);
    console.log('\n##', tag, q);
    for (const h of hits) console.log(' -', h);
  } catch (e) {
    console.log(tag, 'ERROR', e.message);
  }
}
fs.writeFileSync('docs/editorial-research/marrakech-commons-search.json', JSON.stringify(out, null, 2));
