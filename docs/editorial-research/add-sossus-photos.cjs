const fs = require('fs');
const crypto = require('crypto');

const root = 'C:/Users/FOSCOD/OpenBot/Agents/agent-7e66c7d5-768a-4689-89ab-be30d19745b6/trek-photo-site';
const SLUG = 'sossusvlei-guided-dune-excursion';
const IMG_DIR = '/images/editorial/sossusvlei-deadvlei-walk';
const IMG_FS = `${root}/public${IMG_DIR}`;
const CHECKED = '2026-11-10';

const photos = [
  {
    file: 'dead-vlei-camelthorn-2018-delso-dd-085.jpg',
    slug: 'dead-vlei-camelthorn-2018-delso-dd-085',
    source_page: 'https://commons.wikimedia.org/wiki/File:Dead_Vlei,_Sossusvlei,_Namibia,_2018-08-06,_DD_085.jpg',
    creator: 'Diego Delso',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2018-08-06',
    subject: 'A dead camelthorn tree on the white clay pan of Deadvlei before the red dunes',
    alt: 'A dead camelthorn tree stands on Deadvlei\'s white pan beneath a deep blue sky and a red dune.',
    caption: 'A dead camelthorn on the Deadvlei pan, 6 August 2018 (CC BY-SA 4.0, Diego Delso via Wikimedia Commons). The dead trees are what a first walk out here comes to see, and their scale sits opposite the dune wall behind them.',
    evidence: 'Commons description "Dead camel thorn (Vachellia erioloba), Deadvlei, Namib-Naukluft Park, Namibia."; DateTimeOriginal 2018-08-06 10:50; cc-by-sa-4.0.',
  },
  {
    file: 'big-daddy-aerial-2019-kraasch.jpg',
    slug: 'big-daddy-aerial-2019-kraasch',
    source_page: 'https://commons.wikimedia.org/wiki/File:RK_1910_P1770358_Big_Daddy_Dune.jpg',
    creator: 'Reinhard Kraasch',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2019-10-22',
    subject: 'An aerial view of the Big Daddy dune in the Sossusvlei sand sea',
    alt: 'Aerial view of the Big Daddy dune ridge beside pale salt-and-clay pans.',
    caption: 'Big Daddy from the air, 22 October 2019 (CC BY-SA 4.0, Reinhard Kraasch via Wikimedia Commons). From above the dune the choice on the ground reads clearly: climb the crest, or walk around it toward the vleis.',
    evidence: 'Commons description "Big Daddy Dune (aerial)"; DateTimeOriginal 2019-10-22; cc-by-sa-4.0.',
  },
  {
    file: 'oryx-big-daddy-2021-strassler.jpg',
    slug: 'oryx-big-daddy-2021-strassler',
    source_page: 'https://commons.wikimedia.org/wiki/File:Oryx_in_front_of_Big_Daddy_Dune,_Sossusvlei,_Namibia.jpg',
    creator: 'Christoph Strässler',
    license: 'CC BY-SA 2.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/2.0',
    captured_at: '2021-09-20',
    subject: 'An oryx standing in scrub in front of the Big Daddy dune at Sossusvlei',
    alt: 'An oryx stands in low scrub on pale ground in front of the red Big Daddy dune.',
    caption: 'An oryx in front of Big Daddy Dune, 20 September 2021 (CC BY-SA 2.0, Christoph Strässler via Wikimedia Commons). Desert wildlife keeps its distance here; watch from the path and give the animal room.',
    evidence: 'Commons description "Big Daddy Dune"; Taken on 20 September 2021; cc-by-sa-2.0.',
  },
  {
    file: 'dune-45-sunrise-2006-schaufele.jpg',
    slug: 'dune-45-sunrise-2006-schaufele',
    source_page: 'https://commons.wikimedia.org/wiki/File:SunriseDune45_flip666.jpg',
    creator: 'Philipp Schäufele (WT-shared Flip666)',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2006-11',
    subject: 'Sunrise seen from Dune 45 looking east over the Tsauchab valley',
    alt: 'Sunrise from Dune 45 overlooks shadowed dunes and the dry Tsauchab valley.',
    caption: 'Sunrise from Dune 45, November 2006 (CC BY-SA 3.0, Philipp Schäufele via Wikimedia Commons). The gateway dune rewards an early start with the morning shadow line moving along the valley floor.',
    evidence: 'Commons description "Sunrise seen from Dune 45. Looking eastward over the valley of the Tsauchab River (most of the time dry), Namib-Naukluft National Park."; 2006-11; cc-by-sa-3.0.',
  },
  {
    file: 'sesriem-canyon-2018-delso-dd-186.jpg',
    slug: 'sesriem-canyon-2018-delso-dd-186',
    source_page: 'https://commons.wikimedia.org/wiki/File:Ca%C3%B1%C3%B3n_Sesriem,_Sossusvlei,_Namibia,_2018-08-06,_DD_186.jpg',
    creator: 'Diego Delso',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2018-08-06',
    subject: 'Inside Sesriem Canyon with shaded rock walls and gravel floor',
    alt: 'Sesriem Canyon walls rise above a gravel arriving floor in shade.',
    caption: 'Sesriem Canyon interior, 6 August 2018 (CC BY-SA 4.0, Diego Delso via Wikimedia Commons). The canyon closes the outing loop at walking distance from the gate, a fitting quieter second stop.',
    evidence: 'Commons description "Sesriem Canyon, Sossusvlei, Namibia"; DateTimeOriginal 2018-08-06 13:49; cc-by-sa-4.0.',
  },
  {
    file: 'view-from-big-daddy-2006-willis.jpg',
    slug: 'view-from-big-daddy-2006-willis',
    source_page: 'https://commons.wikimedia.org/wiki/File:Sossusvlei_-_View_from_Big_Daddy_-_(greg-willis.com)_-_panoramio.jpg',
    creator: 'Greg Willis',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2006-10-02',
    subject: 'The view west from the top of Big Daddy over the Sossusvlei dune field',
    alt: 'View west from Big Daddy\'s crest across layered dunes toward Sossusvlei.',
    caption: 'The view west from Big Daddy, 2 October 2006 (CC BY-SA 3.0, Greg Willis via Wikimedia Commons). Crest walkers get this wide easy angle, then descend toward Deadvlei through soft sand.',
    evidence: 'Commons description "Sossusvlei - View from Big Daddy"; Taken on 2 October 2006; cc-by-sa-3.0.',
  },
];

for (const p of photos) {
  const buf = fs.readFileSync(`${IMG_FS}/${p.file}`);
  p.sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  console.log(p.file, p.sha256.slice(0, 16), buf.length);
}

// ---- 1. photo-library entries (src, then synced to public) ----
const libPath = `${root}/src/lib/photo-library.js`;
const libSrc = fs.readFileSync(libPath, 'utf8');
let lib;
const m = libSrc.match(/export const photoLibrary = ([\s\S]*);\s*$/);
if (!m) throw new Error('cannot parse photo-library');
lib = JSON.parse(m[1]);
if (!lib.images) throw new Error('no images object');
let imagesUpdated = 0;
for (const p of photos) {
  const key = `${IMG_DIR}/${p.file}`;
  if (lib.images[key]) { console.log('already present', key); continue; }
  lib.images[key] = {
    slug: p.slug,
    local_path: key,
    source_page: p.source_page,
    source_revision: `Wikimedia Commons file ${p.source_page.split('/wiki/')[1]}, checked ${CHECKED}`,
    creator: p.creator,
    license: p.license,
    license_url: p.license_url,
    source_published_at: null,
    captured_at: p.captured_at,
    sha256: p.sha256,
    exact_subject: true,
    subject: p.subject,
    alt: p.alt,
    caption: p.caption,
    property: false,
    kind: 'photograph',
    requires_attribution: p.license !== 'Public domain',
    changes: 'Downloaded from the Wikimedia Commons thumb CDN at 1,800 pixels wide, aspect ratio preserved; no other edits.',
    checked_at: CHECKED,
    exact_subject_evidence: p.evidence,
    reuse_note: `Attribution required: credit ${p.creator}, ${p.license}, source file page. Attribution appears on-page in the figure caption.`,
  };
  imagesUpdated++;
}
lib.updated_at = CHECKED;
fs.writeFileSync(libPath, '// Curated source. Run node scripts/sync-photo-library.mjs after editing.\n// Curated free photography; source and licence metadata travel with each image.\nexport const photoLibrary = ' + JSON.stringify(lib, null, 2) + ';\n');
console.log('photo-library entries added:', imagesUpdated);

return { imagesUpdated };
