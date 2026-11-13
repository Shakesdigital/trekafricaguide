// Inserts the six Hotel Barmoi Freetown contextual image entries at the top of
// the curated photo library "images" object (key order in the map is irrelevant).
import fs from 'node:fs';

const today = '2026-11-13';
const dir = '/images/editorial/hotel-barmoi-freetown/';

const images = [
  {
    file: 'lumley-beach-kefel.jpg',
    slug: 'lumley-beach-kefel-2005',
    source_page: 'https://commons.wikimedia.org/wiki/File:Lumley_Beach_Freetown.JPG',
    source_revision: 'Wikimedia Commons file File:Lumley_Beach_Freetown.JPG, checked 2026-11-13',
    creator: 'Hussein Kefel',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2005-12-26',
    sha256: '1c49eae9718472a2791d72acd51a9a617966c482b3b5e5fc09ce4e6d36cba77d',
    subject: 'Lumley Beach shoreline, Freetown, Sierra Leone',
    alt: 'Lumley Beach in Freetown, Sierra Leone, with the Atlantic shoreline near the Aberdeen oceanfront where Hotel Barmoi stands.',
    caption: 'Lumley Beach, Freetown (Hussein Kefel, CC BY-SA 3.0 via Wikimedia Commons). Contextual image of the beach about 400 m from Hotel Barmoi; not the property.',
    exact_subject_evidence: 'Commons description "Lumley Beach of Freetown in Sierra Leone"; DateTimeOriginal 26 December 2005; cc-by-sa-3.0.',
    context: 'beach',
  },
  {
    file: 'aberdeen-freetown-mroue.jpg',
    slug: 'aberdeen-freetown-mroue-2011',
    source_page: 'https://commons.wikimedia.org/wiki/File:Aberdeen,_Freetown,_Sierra_Leone_-_panoramio_-_Ghassan_Mroue.jpg',
    source_revision: 'Wikimedia Commons file File:Aberdeen,_Freetown,_Sierra_Leone_-_panoramio_-_Ghassan_Mroue.jpg, checked 2026-11-13',
    creator: 'Ghassan Mroue',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2011-07-20',
    sha256: '06dc43ae54b08971f94fc9eb3be12a162a8e16fdbcd47981169a0a7c34352ef7',
    subject: 'Aberdeen district waterfront, Freetown, Sierra Leone',
    alt: 'The Aberdeen district waterfront in Freetown, Sierra Leone, near Cape Road where Hotel Barmoi is located.',
    caption: 'Aberdeen, Freetown (Ghassan Mroue, CC BY-SA 3.0 via Wikimedia Commons). Contextual image of the district where the hotel stands; not the property.',
    exact_subject_evidence: 'Commons description "Aberdeen, Freetown, Sierra Leone"; GPS 8.493256,-13.278319; Taken on 20 July 2011; cc-by-sa-3.0.',
    context: 'location',
  },
  {
    file: 'lumley-shore-mroue.jpg',
    slug: 'lumley-shore-mroue-2009',
    source_page: 'https://commons.wikimedia.org/wiki/File:Lumley_Shore_-_panoramio.jpg',
    source_revision: 'Wikimedia Commons file File:Lumley_Shore_-_panoramio.jpg, checked 2026-11-13',
    creator: 'Ghassan Mroue',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2009-11-16',
    sha256: '90042ec1338d3d56b8597fbcd2abfae5a94eb4a12cb6c5e612cde27ad4f20cf0',
    subject: 'Lumley shore on the Freetown Peninsula Atlantic coast',
    alt: 'The Atlantic shore at Lumley, Freetown, Sierra Leone, a short walk from the Aberdeen oceanfront.',
    caption: 'Lumley shore, Freetown (Ghassan Mroue, CC BY-SA 3.0 via Wikimedia Commons). Contextual shoreline image; not the property.',
    exact_subject_evidence: 'Commons description "lumley Shore"; GPS 8.476787,-13.284874 (Lumley/Aberdeen area); Taken on 16 November 2009; cc-by-sa-3.0.',
    context: 'shoreline',
  },
  {
    file: 'cotton-tree-freetown-trede.jpg',
    slug: 'cotton-tree-freetown-trede-2007',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cotton_Tree_(Sierra_Leone).jpg',
    source_revision: 'Wikimedia Commons file File:Cotton_Tree_(Sierra_Leone).jpg, checked 2026-11-13',
    creator: 'Christian Trede',
    license: 'CC BY-SA 2.0 DE',
    license_url: 'https://creativecommons.org/licenses/by-sa/2.0/de/deed.en',
    captured_at: '2007-04',
    sha256: '27a7d7527b3142a2e7eb3e59973e7b7c322e0dcabe01476474d126b3759fd2b8',
    subject: 'The Cotton Tree landmark in central Freetown, Sierra Leone',
    alt: 'The historic Cotton Tree standing in central Freetown, Sierra Leone, the city landmark most visitors see on a Freetown stay.',
    caption: 'The Cotton Tree, central Freetown (Christian Trede, CC BY-SA 2.0 DE via Wikimedia Commons). City-context image for a Freetown hotel guide; not the property.',
    exact_subject_evidence: 'Commons description "Cotton Tree, das Wahrzeichen von Freetown, Sierra Leone"; DateTimeOriginal April 2007; cc-by-sa-2.0-de.',
    context: 'city',
  },
  {
    file: 'freetown-aerial-hond.jpg',
    slug: 'freetown-aerial-hond-2004',
    source_page: 'https://commons.wikimedia.org/wiki/File:Freetown-aerialview.jpg',
    source_revision: 'Wikimedia Commons file File:Freetown-aerialview.jpg, checked 2026-11-13',
    creator: 'David Hond',
    license: 'CC BY 2.0',
    license_url: 'https://creativecommons.org/licenses/by/2.0',
    captured_at: '2004-10-04',
    sha256: '13ae49aacec724d89fd20b09519e47cb208a2712ad4a8d7a457c755e87aa8112',
    subject: 'Aerial view over Freetown harbour, Sierra Leone',
    alt: 'Aerial view over Freetown and its harbour, Sierra Leone, the arrival city for a stay at Hotel Barmoi in Aberdeen.',
    caption: 'Freetown from the air (David Hond, CC BY 2.0 via Wikimedia Commons). Arrival-city context image; not the property.',
    exact_subject_evidence: 'Commons description "Aerial view of Freetown, Sierra Leone, a helicopter expedition to Lungii airport, over the Freetown Harbour"; GPS 8.498391,-13.260841; DateTimeOriginal 2004-10-04; cc-by-2.0.',
    context: 'arrival-city',
  },
  {
    file: 'central-freetown-night-bangura.jpg',
    slug: 'central-freetown-night-bangura-2014',
    source_page: 'https://commons.wikimedia.org/wiki/File:Central_Freetown_at_night,_Sierra_Leone._January1_2014_(3).jpg',
    source_revision: 'Wikimedia Commons file File:Central_Freetown_at_night,_Sierra_Leone._January1_2014_(3).jpg, checked 2026-11-13',
    creator: 'Patrick S. Bangura',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2014-01-01',
    sha256: 'a59f899de6543f359005bb464fc1aaecd7e2f15d7388df36a1d706553c1c2e81',
    subject: 'Central Freetown at night, Sierra Leone',
    alt: 'Central Freetown in the evening, Sierra Leone, city context for the last night of a Sierra Leone trip.',
    caption: 'Central Freetown at night, 1 January 2014 (Patrick S. Bangura, CC BY-SA 4.0 via Wikimedia Commons). City-context image; not the property.',
    exact_subject_evidence: 'Commons description "A view of Central Freetown at night"; title dates it January 2014; cc-by-sa-4.0.',
    context: 'city',
  },
];

const p = new URL('../../src/lib/photo-library.js', import.meta.url);
let m = fs.readFileSync(p, 'utf8');
for (const img of images) {
  if (m.includes(dir + img.file)) throw new Error('entry already present: ' + img.file);
}
const anchor = '"images": {';
const i = m.indexOf(anchor);
if (i < 0) throw new Error('images anchor not found');
const insertAt = m.indexOf('\n', i) + 1;

const entries = images.map((img) => {
  const key = dir + img.file;
  return (
    `    "${key}": {\n` +
    `      "kind": "photograph", "slug": "${img.slug}", "local_path": "${key}",\n` +
    `      "source_page": "${img.source_page}", "source_revision": "${img.source_revision}",\n` +
    `      "creator": "${img.creator}",\n` +
    `      "license": "${img.license}", "license_url": "${img.license_url}",\n` +
    `      "source_published_at": null, "captured_at": ${JSON.stringify(img.captured_at)}, "sha256": "${img.sha256}",\n` +
    `      "exact_subject": false, "subject": ${JSON.stringify(img.subject)},\n` +
    `      "alt": ${JSON.stringify(img.alt)},\n` +
    `      "caption": ${JSON.stringify(img.caption)},\n` +
    `      "property": false, "requires_attribution": true, "checked_at": "${today}",\n` +
    `      "changes": "Wikimedia Commons scaled JPEG (1280px thumb) or original, aspect ratio preserved; no other edits.",\n` +
    `      "exact_subject_evidence": ${JSON.stringify(img.exact_subject_evidence)},\n` +
    `      "reuse_note": "Attribution required: credit ${img.creator}, ${img.license}, source file page; share-alike terms continue to apply where applicable. Attribution appears on-page in the figure caption. Contextual ${img.context} image; not Hotel Barmoi or any property interior."\n` +
    `    },`
  );
}).join('\n');

m = m.slice(0, insertAt) + entries + '\n' + m.slice(insertAt);
fs.writeFileSync(p, m);

const mod = await import(new URL('../../src/lib/photo-library.js', import.meta.url).href + '?' + Date.now());
const keys = Object.keys(mod.photoLibrary.images).filter((k) => k.includes('barmoi'));
console.log('images entries:', keys.length, 'total:', Object.keys(mod.photoLibrary.images).length);
