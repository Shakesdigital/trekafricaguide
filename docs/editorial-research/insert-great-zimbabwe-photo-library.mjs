// Insert six Great Zimbabwe insight photo entries into photo-library (src + public)
import fs from 'node:fs';

const meta = JSON.parse(fs.readFileSync('docs/editorial-research/great-zimbabwe-insight-photo-metadata.json', 'utf8'));
const renames = {
  'File:Great inclosure - Great Zimbabwe (14).jpg': 'great-enclosure-wall-2015-schertzer.jpg',
  'File:Sacred enclosure – Great Zimbabwe.jpg': 'sacred-enclosure-2015-schertzer.jpg',
  'File:Great-zim-aerial-looking-West.JPG': 'site-aerial-looking-west-2015-bell.jpg',
  'File:Western Entrance to the Great Enclosure - Great Zimbabwe II (46698655045).jpg': 'western-entrance-2019-moore.jpg',
  'File:Masvingo City centre.jpg': 'masvingo-city-centre-2020-realtino.jpg',
  'File:Lake Kyle.jpg': 'lake-kyle-2011-maitynoe.jpg',
};
const subjects = {
  'great-enclosure-wall-2015-schertzer.jpg': 'The curved granite outer wall of the Great Enclosure at Great Zimbabwe',
  'sacred-enclosure-2015-schertzer.jpg': 'Enclosure walls on the sacred hill section at Great Zimbabwe',
  'site-aerial-looking-west-2015-bell.jpg': 'Aerial view across the Great Zimbabwe ruins looking west',
  'western-entrance-2019-moore.jpg': 'The western entrance passage into the Great Enclosure',
  'masvingo-city-centre-2020-realtino.jpg': 'Masvingo city centre street scene',
  'lake-kyle-2011-maitynoe.jpg': 'Lake Kyle (Lake Mutirikwi) open water and shoreline hills',
};
const alts = {
  'great-enclosure-wall-2015-schertzer.jpg': 'The curved granite outer wall of the Great Enclosure rising above grass and trees at Great Zimbabwe.',
  'sacred-enclosure-2015-schertzer.jpg': 'Enclosure walls on the sacred hill section at Great Zimbabwe.',
  'site-aerial-looking-west-2015-bell.jpg': 'Aerial view across the Great Zimbabwe ruins looking west, with the enclosures and hill in their landscape.',
  'western-entrance-2019-moore.jpg': 'The western entrance passage into the Great Enclosure at Great Zimbabwe.',
  'masvingo-city-centre-2020-realtino.jpg': 'Masvingo city centre street scene with traffic and low-rise buildings.',
  'lake-kyle-2011-maitynoe.jpg': 'Lake Kyle (Lake Mutirikwi) with open water and distant shoreline hills.',
};
const captions = {
  'great-enclosure-wall-2015-schertzer.jpg': 'The Great Enclosure outer wall, September 2015 (CC BY 3.0, Fanny Schertzer via Wikimedia Commons). UNESCO records the enclosure as the largest ancient structure south of the Sahara — the wall reads as architecture, not just archaeology.',
  'sacred-enclosure-2015-schertzer.jpg': 'The sacred enclosure, September 2015 (CC BY 3.0, Fanny Schertzer via Wikimedia Commons). Parts of the hill remain an active sacred site for local communities — walk where staff direct.',
  'site-aerial-looking-west-2015-bell.jpg': 'Looking west over the Great Zimbabwe site from the air, July 2015 (CC BY-SA 4.0, Janice Bell via Wikimedia Commons). UNESCO records a 722-hectare property — the aerial view shows why the walk between complexes is part of the visit.',
  'western-entrance-2019-moore.jpg': 'The western entrance to the Great Enclosure, March 2019 (CC BY-SA 2.0, Andrew Moore via Wikimedia Commons). Entering through the narrow passage is the moment the scale of the walls lands.',
  'masvingo-city-centre-2020-realtino.jpg': 'Masvingo city centre, August 2020 (CC BY-SA 4.0, Realtino via Wikimedia Commons). The provincial capital is the practical base and cash-stop for the monument day — the travel guide notes ATMs are in town, 25 km from the ruins.',
  'lake-kyle-2011-maitynoe.jpg': 'Lake Kyle — Lake Mutirikwi — July 2011 (CC BY-SA 4.0, MaiTynoe via Wikimedia Commons). The lake and the ruins sit inside one planning day: the recreational park runs east of Masvingo with the monument to its south.',
};

const entries = [];
for (const m of meta) {
  const file = renames[m.title];
  if (!file) throw new Error('no rename for ' + m.title);
  const creatorKey = (m.creator.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') || 'commons');
  const slugId = file.replace(/\.jpg$/, '').replace(/[^a-z0-9]+/gi, '-') + '-' + creatorKey;
  const local = `/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo/${file}`;
  entries.push({
    slug: slugId,
    local_path: local,
    source_page: m.desc_url,
    source_revision: `Wikimedia Commons file ${m.title}, checked 2026-11-11`,
    creator: m.creator,
    license: m.license,
    license_url: m.license_url,
    source_published_at: null,
    captured_at: (m.date || '').slice(0, 10) || null,
    sha256: m.sha256,
    exact_subject: true,
    subject: subjects[file],
    alt: alts[file],
    caption: captions[file],
    property: false,
    kind: 'photograph',
    requires_attribution: true,
    changes: 'Downloaded from the Wikimedia Commons 1920px rendition; no other edits.',
    checked_at: '2026-11-11',
    exact_subject_evidence: `Commons file ${m.title}; DateTimeOriginal ${m.date}; ${m.license}.`,
    reuse_note: `Attribution required: credit ${m.creator}, ${m.license}, source file page; share-alike terms continue to apply where applicable. Attribution appears on-page in the figure caption. No business named in this story.`,
  });
}

for (const p of ['src/lib/photo-library.js', 'public/photo-library.js']) {
  let t = fs.readFileSync(p, 'utf8');
  const libStart = t.indexOf('const photoLibrary');
  const anchor = t.indexOf('"images": {', libStart);
  if (anchor === -1) throw new Error('no anchor in ' + p);
  // Skip if any of our paths already present
  if (t.includes('plan-great-zimbabwe-monument-days-from-masvingo')) { console.log('already present in', p); continue; }
  const insertAt = anchor + '"images": {'.length;
  const block = entries.map((e) => '\n    ' + JSON.stringify(e.local_path) + ': ' + JSON.stringify(e, null, 4).replace(/\n/g, '\n  ') + ',').join('');
  t = t.slice(0, insertAt) + block + t.slice(insertAt);
  fs.writeFileSync(p, t);
  console.log('inserted', entries.length, 'entries into', p);
}
