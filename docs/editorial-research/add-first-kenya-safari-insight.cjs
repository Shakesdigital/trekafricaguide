const fs = require('fs');
const crypto = require('crypto');

const root = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site';
const SLUG = 'plan-first-kenya-safari-mara-reserve-or-conservancy';
const IMG_DIR = `/images/editorial/plan-first-kenya-safari-mara`;
const IMG_FS = `${root}/public${IMG_DIR}`;

// ---- photo provenance (licenses verified on Commons 9 November 2026) ----
const photos = [
  {
    file: 'mara-river-wildebeest-jump-2020.jpg',
    slug: 'mara-river-wildebeest-jump-2020-danijel-mihajlovic',
    source_page: 'https://commons.wikimedia.org/wiki/File:Wildebeest_Jumping_Into_the_Mara_River.jpg',
    creator: 'Danijel Mihajlovic',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2020-09-14',
    subject: 'Wildebeest lining up to jump into the Mara River during a crossing gathering',
    alt: 'A herd of wildebeest jumps into the Mara River during a river-crossing gathering.',
    caption: 'Wildebeest jump into the Mara River in this archival photograph taken 14 September 2020 (CC BY-SA 4.0, Danijel Mihajlovic via Wikimedia Commons). It is evidence that crossings happen, not a promise of one on your travel dates.',
    evidence: 'Commons file page names the subject "Part of the Great Migration, a herd of wildebeest line up to cross the Mara river in the Masai Mara national reserve"; DateTimeOriginal 2020-09-14; cc-by-sa-4.0.',
  },
  {
    file: 'mara-cheetah-tour-vehicle-2018.jpg',
    slug: 'mara-cheetah-tour-vehicle-2018-michelle-juma',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cheetah,_Maasai_Mara.jpg',
    creator: 'Michelle Juma',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2018-12-10',
    subject: 'A cheetah walking past a tour van in the Maasai Mara National Reserve',
    alt: 'A cheetah walks past a tour van in the Maasai Mara National Reserve.',
    caption: 'A cheetah walks past a tour van in the Maasai Mara in this 10 December 2018 photograph (CC BY-SA 4.0, Michelle Juma via Wikimedia Commons). Even a prized sighting draws vehicles; the wildlife keeps the space rules, not the plates.',
    evidence: 'Commons description "Image of cheetah walking passed a tour van at the Maasai Mara, Kenya"; DateTimeOriginal 2018-12-10; cc-by-sa-4.0.',
  },
  {
    file: 'mara-safari-vehicle-acacia-2025.jpg',
    slug: 'mara-safari-vehicle-acacia-2025-daniel-case',
    source_page: 'https://commons.wikimedia.org/wiki/File:Safari_vehicle_parked_under_acacia_tree_on_savanna,_Maasai_Mara,_Kenya.jpg',
    creator: 'Daniel Case',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2025-08-21',
    subject: 'A safari vehicle parked under an acacia tree on Maasai Mara savanna',
    alt: 'A safari vehicle parks under an acacia tree on open savanna in the Maasai Mara.',
    caption: 'A safari vehicle parked under an acacia on Maasai Mara savanna, 21 August 2025 (CC BY-SA 4.0, Daniel Case via Wikimedia Commons). This is the classic road-safari day: vehicle, shade and long waits between movements.',
    evidence: 'Commons filename subject confirmed; DateTimeOriginal 2025-08-21; cc-by-sa-4.0.',
  },
  {
    file: 'olare-motorogi-hyena-2019.jpg',
    slug: 'olare-motorogi-hyena-2019-regina-hart',
    source_page: 'https://commons.wikimedia.org/wiki/File:Spotted_hyena_-_Olare_Motorogi_Conservancy_(49549231647).jpg',
    creator: 'Regina Hart',
    license: 'CC BY-SA 2.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/2.0',
    captured_at: '2019-12-19',
    subject: 'A spotted hyena in the Olare Motorogi Conservancy, in the wider Mara ecosystem',
    alt: 'A spotted hyena stands among grass in the Olare Motorogi Conservancy.',
    caption: 'A spotted hyena in the Olare Motorogi Conservancy, 19 December 2019 (CC BY-SA 2.0, Regina Hart via Wikimedia Commons). Conservancies sit inside the wider ecosystem; this file names one of them directly.',
    evidence: 'Commons file name and category "Crocuta crocuta in Olare Motorogi Conservancy"; DateTimeOriginal 2019-12-19; cc-by-sa-2.0.',
  },
  {
    file: 'mara-airstrip-lapas-2022.jpg',
    slug: 'mara-airstrip-lapas-2022-ninara',
    source_page: 'https://commons.wikimedia.org/wiki/File:Masai_Mara_National_Reserve_-_52496971647.jpg',
    creator: 'Ninara',
    license: 'CC BY 2.0',
    license_url: 'https://creativecommons.org/licenses/by/2.0',
    captured_at: '2022-09-29',
    subject: 'An airstrip with lapa-roofed buildings in the Maasai Mara National Reserve',
    alt: 'Lapa-roofed buildings stand beside a Maasai Mara airstrip.',
    caption: 'An airstrip with lapa-roofed buildings in the Maasai Mara, 29 September 2022 (CC BY 2.0, Ninara via Wikimedia Commons). Fly-in trips end here, not at the gate: the camp-to-airstrip match decides the day.',
    evidence: 'Commons description "Airstrip in Maasai Mara."; Taken on 29 September 2022; cc-by-2.0.',
  },
  {
    file: 'mara-wildebeest-hillside-sand-river-2025.jpg',
    slug: 'mara-wildebeest-hillside-sand-river-2025-daniel-case',
    source_page: 'https://commons.wikimedia.org/wiki/File:Wildebeest_herd_on_hillside,_Maasai_Mara,_Kenya.jpg',
    creator: 'Daniel Case',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2025-08-21',
    subject: 'A wildebeest herd on a hillside near the Sand River Gate area of the Maasai Mara',
    alt: 'A wildebeest herd stands on a hillside of Maasai Mara grassland.',
    caption: 'A wildebeest herd on a hillside photographed 21 August 2025 near the Tanzanian-border side of the Maasai Mara (CC BY-SA 4.0, Daniel Case via Wikimedia Commons). Herd positions change week by week; the ecosystem, not a map pin, follows.',
    evidence: 'Commons description "Per filename. Taken very close to the Tanzanian border."; GPS -1.6478, 35.22482; DateTimeOriginal 2025-08-21; cc-by-sa-4.0.',
  },
];

for (const p of photos) {
  const buf = fs.readFileSync(`${IMG_FS}/${p.file}`);
  p.sha256 = crypto.createHash('sha256').update(buf).digest('hex');
}

// ---- 1. photo-library entries (src, then synced to public) ----
const libPath = `${root}/src/lib/photo-library.js`;
const libSrc = fs.readFileSync(libPath, 'utf8');
let lib;
const m = libSrc.match(/export const photoLibrary = ([\s\S]*);\s*$/);
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
    source_revision: `Wikimedia Commons file ${p.source_page.split('/wiki/')[1]}, checked 2026-11-09`,
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
    requires_attribution: true,
    changes: 'Downloaded from the Wikimedia Commons thumb CDN at 1,800 pixels wide, aspect ratio preserved; no other edits.',
    checked_at: '2026-11-09',
    exact_subject_evidence: p.evidence,
    reuse_note: `Attribution required: credit ${p.creator}, ${p.license}, source file page. Attribution appears on-page in the figure caption.`,
  };
  imagesUpdated++;
}
lib.updated_at = '2026-11-09';
fs.writeFileSync(libPath, '// Curated source. Run node scripts/sync-photo-library.mjs after editing.\n// Curated free photography; source and licence metadata travel with each image.\nexport const photoLibrary = ' + JSON.stringify(lib, null, 2) + ';\n');
console.log('photo-library entries added:', imagesUpdated);

// ---- 2. travel article record ----
const ovPath = `${root}/content/editorial-overrides.json`;
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
if (ov.travel_articles.some(t => t.slug === SLUG)) throw new Error('insight exists');

const body = `
<p><em>Research checked 9 November 2026. This is an editorial planning story, not a booking channel: fees, windows and schedules move, so confirm every number with your operator and the reserve sources before you pay.</em></p>
<p>Kenya is the country this guide keeps returning to as the clearest first-time safari gateway — its country page leans on strong guide networks, the Maasai Mara, private conservancies and smooth access from Nairobi. But the same pages quietly hand over two decisions before any camp name gets chosen: where your wildlife access is secured (reserve or conservancy) and how you arrive (road or fly-in). Hold those two decisions first and the whole trip gets easier to price, route and adapt when conditions change. Our <a href="/countries/kenya">Kenya destination guide</a> and <a href="/attractions/maasai-mara">Maasai Mara attraction guide</a> carry the field context; this story is the decision order behind them.</p>
<h3>Start from the gateway decision</h3>
<p>Use Nairobi as the planning gateway, as our <a href="/countries/kenya/nairobi">Nairobi city guide</a> explains, then choose road or air connections on the reality of your camp, not on a slogan. Road safaris commonly approach the reserve through the Narok area; the Kenya Airports Authority describes Wilson Airport, 5 km on Langata Road, as the domestic hub for safari routes into the Mara and Amboseli. A fly-in itinerary is decided by airstrip-to-camp transfer time, not by which airstrip names best: confirm the exact airstrip your camp guides will meet, and keep the final transfer inside the day's plan rather than counting it as a bonus game drive.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/mara-safari-vehicle-acacia-2025.jpg" alt="${photos[2].alt}" loading="lazy"><figcaption>${photos[2].caption}</figcaption></figure>
<p>Also budget the arrival day honestly. Whichever mode you choose, the first afternoon is travel, not viewing — a useful first itinerary is arrival, at least two full safari days and a departure morning, with the international side of Nairobi KIA-width checked against your booking buffer.</p>
<h3>Reserve or conservancy: what the two models trade</h3>
<p>The reserve and the neighboring conservancies are different management areas with different access arrangements — that single line in our Mara guide carries more trip-shaping weight than any camp style. Reserve access means broader inventory and the famous crossings geography; conservancies limit vehicle density and often allow off-track driving, night drives and walking with your operator's own rules. maasaimara.com, the reserve-ecosystem guide we use as an independent reference, separates reserve park fees from conservancy fees and states plainly that park fees are not included in the accommodation rates listed on its site. Ask every camp for the full daily math: night-game-drive costs, community or conservancy charges and reserve day-visit fees when a conservancy stay adds a reserve day.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/olare-motorogi-hyena-2019.jpg" alt="${photos[3].alt}" loading="lazy"><figcaption>${photos[3].caption}</figcaption></figure>
<p>Choose the base you actually travel from: our recommendation in both the Mara and country guides is one well-positioned base for several nights instead of transferring between similarly placed camps. The Mara holds top predators year-round — magicalkenya.com's reserve page keeps the Big Five Presence and maasaimara.com counts 450-plus bird species and a 1,510 km² protected area — so a resident-wildlife stay is not a consolation prize for missing a migration window; it is its own plan.</p>
<h3>Timing: a pattern, not an appointment</h3>
<p>maasaimara.com frames the classic visit window as July to October — dry weather, strong game viewing, and the months its own month-by-month chart marks as the best stretch (June through September) — with the long rains of March to May the low season. The Great Migration is the front-page reason, but the same site's live migration update of 15 October 2026 shows the complications plainly: large herds reported toward the western escarpment side while the reserve herds were scarce, with movements both north and south. Herd positions move week by week; no responsible itinerary should promise a river crossing on a fixed day, and you should treat "migration season" as a pattern to plan inside rather than a spectacle you book.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/mara-river-wildebeest-jump-2020.jpg" alt="${photos[0].alt}" loading="lazy"><figcaption>${photos[0].caption}</figcaption></figure>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/mara-wildebeest-hillside-sand-river-2025.jpg" alt="${photos[5].alt}" loading="lazy"><figcaption>${photos[5].caption}</figcaption></figure>
<p>Practical timing notes: photograph the landscape twice — once in the dry-season light you will likely travel in, and again in whatever green season you actually visit; the Mara ecosystem does not look the same year-round. Check recent road conditions before a scheduled rainy-season road trip, and read arrival dates as rainfall shape, not just carnival dates.</p>
<h3>What to ask before you pay</h3>
<p>Compare inclusions the way both our Kenya pages ask: park or conservancy access, shared versus private game drives, meals, vehicle occupancy, balloon adds and transfers. The checklist that matters, in order:</p>
<ul>
<li>The exact airstrip (or Narok road route) matched to your camp, with transfer time confirmed in writing.</li>
<li>Whether your rate covers conservancy charges, reserve day visits and community fees.</li>
<li>Shared against private drives, and vehicle occupancy if you photograph.</li>
<li>Wildlife space on game drives: our Mara guide asks guides to keep wildlife space rather than reposition for close-ups, and alerts you that crowded sightings can mean a line of vehicles.</li>
<li>Migration language: ask for a camp's honest seasonal pattern in its own area, not a promised crossing date.</li>
</ul>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/mara-cheetah-tour-vehicle-2018.jpg" alt="${photos[1].alt}" loading="lazy"><figcaption>${photos[1].caption}</figcaption></figure>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/mara-airstrip-lapas-2022.jpg" alt="${photos[4].alt}" loading="lazy"><figcaption>${photos[4].caption}</figcaption></figure>
<h3>Build the rest of the route around it</h3>
<p>Fewer bases with more complete days at each is this site's standing recommendation, and the Mara is the anchor that makes it easy to obey. Amboseli's elephants under Kilimanjaro trade well against the Mara's open country, and maasaimara.com itself pitches an "Elephants and Wildebeest" pairing of Amboseli National Park and the Maasai Mara as one of its sample safari ideas. Our <a href="/attractions/amboseli-national-park">Amboseli guide</a> and its Nairobi-departure game-drive activity carry that second leg if you travel by road and air together with a buffer day in the capital.</p>
<p>Where this leaves you: sharpen the two decisions — where access gets secured (reserve or conservancy) and how you reach it (road or fly-in) — price the daily fees separately from the camp headline, hold the migration as a season rather than a scene, and book the stay that matches the airstrip you are actually landing on. Then the itinerary, whether it includes a balloon sunrise over the Mara plains (our <a href="/activities/maasai-mara-balloon-safari">balloon safari guide</a> explains what that morning costs and protects) or an unhurried hillside afternoon, flexes to the year's real pattern instead of fighting it.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/mara-safari-vehicle-acacia-2025.jpg" alt="ignored placeholder" loading="lazy"><figcaption>placeholder</figcaption></figure>
`.trim();
// fix: we used the vehicle photo twice; replace the placeholder block by removing it
const bodyFixed = body.replace(/\n<figure><img src="https:\/\/trekafricaguide\.com[^"]*"[^>]*><figcaption>placeholder<\/figcaption><\/figure>\s*$/,'');

// Word count → read_time
const words = bodyFixed.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

const maxSort = Math.max(...ov.travel_articles.map(t => t.sort_order || 0));
const rec = {
  slug: SLUG,
  title: 'Plan a first Kenya safari: reserve or conservancy, road or fly-in',
  category: 'Practical travel',
  region: 'East Africa',
  country: 'Kenya',
  excerpt: 'Plan a first Kenya safari around the two decisions that shape it: where wildlife access is secured (Maasai Mara reserve or conservancy), and how you arrive (road or fly-in) — with migration timing held as a pattern, not an appointment.',
  read_time: Math.max(1, Math.ceil(words / 200)) + ' min read',
  hero_image_url: `https://trekafricaguide.com${IMG_DIR}/mara-river-wildebeest-jump-2020.jpg`,
  hero_image_alt: photos[0].alt,
  source_url: 'https://www.maasaimara.com/',
  research_sources: [
    { label: 'maasaimara.com homepage (checked 9 November 2026) — 1,510 km² protected area, 450+ bird species, Big 5 year-round, month-by-month best-time chart (June–September best, July–October classic window, March–May low), live migration update dated 15 October 2026, park fees stated as not included in accommodation rates, reserve described as the northern extension of Tanzania\'s Serengeti', url: 'https://www.maasaimara.com/', checked_at: '2026-11-09' },
    { label: 'maasaimara.com Useful Info guide headlines (checked 9 November 2026) — "Should You Fly or Drive to the Maasai Mara?" and park-fee separation by area; JS-rendered body pages did not server-render, so headline-level facts only', url: 'https://www.maasaimara.com/useful-info', checked_at: '2026-11-09' },
    { label: 'Magical Kenya (KTB) Maasai Mara page (checked 9 November 2026) — reserve named for the Maasai people and the Mara River, Big Five list, experiences menu (balloon at sunrise, guided nature walks, night game drives, village visits)', url: 'https://magicalkenya.com/maasai-mara/', checked_at: '2026-11-09' },
    { label: 'Trek Africa Guide internal pages (live 9 November 2026) — /countries/kenya (gateway language, fewer-bases recommendation, inclusions checklist), /attractions/maasai-mara (reserve vs conservancy access models, airstrip match, migration-without-guarantee language), /countries/kenya/nairobi (Nairobi as planning gateway, Wilson Airport 5 km Langata Road via Kenya Airports Authority), /attractions/amboseli-national-park', url: 'https://trekafricaguide.com/countries/kenya/', checked_at: '2026-11-09' },
    { label: 'Wikimedia Commons file pages for all six photographs (checked 9 November 2026) — creators, capture dates and CC BY / CC BY-SA licenses recorded in the photo-library entries and figure captions', url: 'https://commons.wikimedia.org/wiki/File:Wildebeest_Jumping_Into_the_Mara_River.jpg', checked_at: '2026-11-09' },
  ],
  last_researched: '2026-11-09',
  status: 'published',
  published_at: new Date().toISOString(),
  sort_order: maxSort + 1,
  featured: false,
  meta_title: 'Plan a first Kenya safari: reserve or conservancy, road or fly-in',
  meta_description: 'Hold the two decisions that shape a first Kenya safari — Mara reserve or conservancy, road or fly-in — then price fees honestly and treat migration timing as a pattern, not a promise.',
  body: bodyFixed,
};
ov.travel_articles.push(rec);
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2).replace(/\[\n\s*\]/g, '[]'));
console.log('travel article added:', SLUG, '| sort_order', rec.sort_order, '| read_time', rec.read_time, '| body words', words);
