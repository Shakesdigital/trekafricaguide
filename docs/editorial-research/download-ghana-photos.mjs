// Download six licensed Wikimedia Commons photographs for the Ghana first-trip insight.
// Run: node docs/editorial-research/download-ghana-photos.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

const dir = 'public/images/editorial/plan-first-ghana-trip';
mkdirSync(dir, { recursive: true });

const photos = [
  {
    file: 'accra-independence-arch-sunset-2023.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Independence_arch_at_sunset_2.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Independence_arch_at_sunset_2.jpg',
    creator: 'Kwameghana (Bright Kwame Ayisi)',
    license: 'CC0 1.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Independence_arch_at_sunset_2.jpg',
    captured_at: '2023-10-08',
    subject: "Independence Arch and Black Star Square, Accra, at sunset",
    alt: 'The Independence Arch in Accra photographed at sunset.'
  },
  {
    file: 'cape-coast-castle-2011.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Cape_Coast_Castle%2C_Cape_Coast%2C_Ghana.JPG',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cape_Coast_Castle,_Cape_Coast,_Ghana.JPG',
    creator: 'Rjruiziii',
    license: 'CC BY-SA 3.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Cape_Coast_Castle,_Cape_Coast,_Ghana.JPG',
    captured_at: '2011-06-26',
    subject: 'Cape Coast Castle exterior, Cape Coast, Central Region, Ghana',
    alt: 'The white exterior walls of Cape Coast Castle seen from the sea side.'
  },
  {
    file: 'kakum-canopy-walkway-2022.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Canopy_walkway_in_Kakum_National_Park_2.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Canopy_walkway_in_Kakum_National_Park_2.jpg',
    creator: 'daSupremo',
    license: 'CC BY-SA 4.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Canopy_walkway_in_Kakum_National_Park_2.jpg',
    captured_at: '2022-11-23',
    subject: 'Kakum National Park canopy walkway above the rainforest, Central Region, Ghana',
    alt: 'The suspended canopy walkway at Kakum National Park crossing above the rainforest.'
  },
  {
    file: 'elmina-castle-2023.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Castle%2C_Elmina_%28P1100187%29.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Castle,_Elmina_(P1100187).jpg',
    creator: 'Matti Blume',
    license: 'CC BY-SA 4.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Castle,_Elmina_(P1100187).jpg',
    captured_at: '2023-02-09',
    subject: 'Elmina Castle (St George’s Castle), Elmina, Central Region, Ghana',
    alt: 'The whitewashed walls and bastions of Elmina Castle, Ghana.'
  },
  {
    file: 'kwame-nkrumah-memorial-park-2008.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Kwame_Nkrumah_Memorial_Park.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Kwame_Nkrumah_Memorial_Park.jpg',
    creator: 'Erik B. Anderson',
    license: 'CC BY-SA 4.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Kwame_Nkrumah_Memorial_Park.jpg',
    captured_at: '2008-10-10',
    subject: 'Kwame Nkrumah Memorial Park and mausoleum, Accra, Ghana',
    alt: 'The fountains and mausoleum of the Kwame Nkrumah Memorial Park in Accra.'
  },
  {
    file: 'jamestown-lighthouse-2017.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Jamestown_Lighthouse_20170122.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Jamestown_Lighthouse_20170122.jpg',
    creator: 'Gereon K.',
    license: 'CC BY-SA 4.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Jamestown_Lighthouse_20170122.jpg',
    captured_at: '2017-01-22',
    subject: 'Jamestown Lighthouse, Accra old town, Ghana',
    alt: 'The red-and-white Jamestown Lighthouse in Accra’s old fishing quarter.'
  }
];

for (const p of photos) {
  const res = await fetch(p.url, { headers: { 'User-Agent': 'TrekAfricaGuideEditorial/1.0 (contact via github.com/Shakesdigital/trekafricaguide)' } });
  if (!res.ok) { console.error('FAIL', p.file, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const path = `${dir}/${p.file}`;
  writeFileSync(path, buf);
  const sha = createHash('sha256').update(buf).digest('hex');
  console.log(JSON.stringify({ file: path, bytes: buf.length, sha256: sha, ...p }));
}
