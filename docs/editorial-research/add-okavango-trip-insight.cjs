const fs = require('fs');
const crypto = require('crypto');

const root = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site';
const SLUG = 'plan-okavango-trip-water-and-land-camps';
const IMG_DIR = '/images/editorial/okavango-trip-planning';
const IMG_FS = `${root}/public${IMG_DIR}`;
const CHECKED = '2026-11-10';

const photos = [
  {
    file: 'okavango-zebra-aerial-helicopter-2018.jpg',
    slug: 'okavango-zebra-aerial-helicopter-2018-diego-delso',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cebras_de_Burchell_(Equus_quagga_burchellii),_vista_a%C3%A9rea_del_delta_del_Okavango,_Botsuana,_2018-08-01,_DD_30.jpg',
    creator: 'Diego Delso',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2018-08-01',
    subject: 'A breeding herd of Burchell\'s zebras in a flooded Okavango Delta channel seen from the air',
    alt: 'A breeding herd of zebras wades through a flooded channel in the Okavango Delta seen from the air.',
    caption: 'A zebra breeding herd wades a flooded channel seen from the air, 1 August 2018 (CC BY-SA 4.0, Diego Delso via Wikimedia Commons). From the sky the Delta reads as one place; on the ground each camp sits on a different piece of it.',
    evidence: 'Commons description "Aerial view from a helicopter of a group of Burchell\'s zebras (Equus quagga burchellii), Okavango Delta, Botswana."; DateTimeOriginal 2018-08-01; cc-by-sa-4.0.',
  },
  {
    file: 'okavango-delta-aerial-cessna-1200ft-2001.jpg',
    slug: 'okavango-delta-aerial-cessna-1200ft-2001-andrew-balet',
    source_page: 'https://commons.wikimedia.org/wiki/File:The_Okavango_Delta_from_1,200_ft.jpg',
    creator: 'Andrew Balet',
    license: 'CC BY 2.5',
    license_url: 'https://creativecommons.org/licenses/by/2.5',
    captured_at: '2001-05',
    subject: 'The Okavango Delta photographed from a Cessna at 1,200 feet',
    alt: 'The Okavango Delta seen from a light aircraft: winding channels crossing grassland toward scattered water.',
    caption: 'The Okavango Delta from a Cessna at 1,200 ft, May 2001 (CC BY 2.5, Andrew Balet via Wikimedia Commons). Fly-in planning starts in exactly this view: the channels show why map distance is not drivable distance.',
    evidence: 'Commons description "The Okavango Delta as viewed from a Cessna at 1,200 ft."; May 2001; cc-by-2.5.',
  },
  {
    file: 'okavango-mokoro-poler-2003.jpg',
    slug: 'okavango-mokoro-poler-2003-ddd',
    source_page: 'https://commons.wikimedia.org/wiki/File:Mokoro_Polers_in_the_Okavango.jpg',
    creator: 'DDD DDD (assumed based on copyright claims)',
    license: 'Public domain',
    license_url: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
    captured_at: '2003-08-16',
    subject: 'A Mokoro Poler Trust guide sitting in a dugout mokoro beside reeds in the Okavango',
    alt: 'A guide holding poling poles sits in a dugout mokoro among reeds in the Okavango.',
    caption: 'A Mokoro Poler Trust guide sits ready beside dugout mokoros in the Okavango, August 2003 (public domain, Wikimedia Commons). Every water day runs on the poler\'s route choice, which is why launch area and conditions belong in the booking call.',
    evidence: 'Commons description "I took this photo of this wonderful Mokoro Poler Trust guide in the Okavango, Botswana, in August 2003."; August 2003 Exif; public domain status on file page.',
  },
  {
    file: 'okavango-water-lilies-2011.jpg',
    slug: 'okavango-water-lilies-2011-diego-cue',
    source_page: 'https://commons.wikimedia.org/wiki/File:Water_lilies_in_the_Okavango_Delta_-_Botswana_-_panoramio.jpg',
    creator: 'diego_cue',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2011-11-08',
    subject: 'White water lilies blooming in an Okavango Delta channel',
    alt: 'White water lilies stand over open blue water in an Okavango Delta channel.',
    caption: 'Water lilies in an Okavango channel, 8 November 2011 (CC BY-SA 3.0, diego_cue via Wikimedia Commons). The quiet water life is the point of a water camp — and it exists exactly where the channels stay open.',
    evidence: 'Commons title "Water lilies in the Okavango Delta - Botswana"; Taken on 8 November 2011; cc-by-sa-3.0.',
  },
  {
    file: 'okavango-red-lechwe-savanna-2019.jpg',
    slug: 'okavango-red-lechwe-savanna-2019-cosal',
    source_page: 'https://commons.wikimedia.org/wiki/File:Okavango_savanna_with_a_Red_Lechwe_buck.jpg',
    creator: 'Cosal',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2019-03-08',
    subject: 'A red lechwe buck standing in floodplain grassland in the Okavango Delta',
    alt: 'A red lechwe buck stands chest-deep in tall floodplain grass under a soft sky.',
    caption: 'A red lechwe buck in Okavango floodplain grassland, 8 March 2019 (CC BY-SA 4.0, Cosal via Wikimedia Commons). The lechwe lives on the flood pulse itself: where the water spreads this month decides the wildlife stage.',
    evidence: 'Commons description "Grassland savanna in the Okavango Delta with a Red Lechwe buck"; DateTimeOriginal 2019-03-08; cc-by-sa-4.0.',
  },
  {
    file: 'okavango-delta-sunset-2011.jpg',
    slug: 'okavango-delta-sunset-2011-markrosenrosen',
    source_page: 'https://commons.wikimedia.org/wiki/File:Sunset_in_the_Okavango_Delta,_Botswana.jpg',
    creator: 'Markrosenrosen',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2011-09-08',
    subject: 'A red sun setting behind palm islands over Okavango marsh',
    alt: 'A red sun sets behind tall palms over the darkened Okavango marsh.',
    caption: 'Sunset in the Okavango Delta, 8 September 2011 (CC BY-SA 3.0, Markrosenrosen via Wikimedia Commons). Camp days end early on the water; the rhythm of a water camp is the slow one this picture implies.',
    evidence: 'Commons title "Sunset in the Okavango Delta, Botswana"; date 2011-09-08; cc-by-sa-3.0.',
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
    reuse_note: p.license === 'Public domain'
      ? 'Public domain: no attribution required; the on-page caption still names the source file for provenance.'
      : `Attribution required: credit ${p.creator}, ${p.license}, source file page. Attribution appears on-page in the figure caption.`,
  };
  imagesUpdated++;
}
lib.updated_at = CHECKED;
fs.writeFileSync(libPath, '// Curated source. Run node scripts/sync-photo-library.mjs after editing.\n// Curated free photography; source and licence metadata travel with each image.\nexport const photoLibrary = ' + JSON.stringify(lib, null, 2) + ';\n');
console.log('photo-library entries added:', imagesUpdated);

// ---- 2. travel article record ----
const ovPath = `${root}/content/editorial-overrides.json`;
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
if (ov.travel_articles.some(t => t.slug === SLUG)) throw new Error('insight exists');

const H = (n) => photos[n];
const fig = (n) => `<figure><img src="https://trekafricaguide.com${IMG_DIR}/${photos[n].file}" alt="${photos[n].alt}" loading="lazy"><figcaption>${photos[n].caption}</figcaption></figure>`;

const body = `
<p><em>Research checked 10 November 2026. This is an editorial planning story, not a booking channel: water levels, transfer chains and camp rules all move, so confirm every detail with your operator and the camp sources before you pay.</em></p>
<p>Botswana is published on this guide as a five-page cluster — the country guide, the <a href="/countries/botswana/maun">Maun gateway guide</a>, the <a href="/attractions/okavango-delta">Okavango Delta attraction guide</a>, the <a href="/activities/okavango-mokoro-safari">mokoro day activity</a> and the <a href="/accommodations/camp-okavango">Camp Okavango stay</a> — yet its travel-insights shelf sat empty while Uganda carried three planning stories and Kenya its first. That is the gap this run closes, and the decisions the cluster demands are worth holding in order before any camp brand gets chosen: what the water will actually allow, whether you stay on it, how you get there, and when. Hold those first and the rest of a Delta trip prices itself.</p>
<h3>Ask what the water will allow</h3>
<p>The Delta is not one landscape. UNESCO, which inscribed it in 2014 as the Convention's 1,000th World Heritage site, describes a mosaic of permanent marsh and seasonally flooded plains whose annual flood arrives <em>during</em> the dry season — its record speaks of the flood pulse as a "critical life-force during the peak of Botswana's dry season (June/July)". Our country guide makes the consequence blunt: "a property's position can be more important than the broad destination name", and <a href="/attractions/okavango-delta">the Delta guide</a> warns that camps offer "genuinely different experiences" because different settings flood and drain at different times. So start at the water, not at the camp name: ask which of your desired activities depend on water levels on your travel dates, not on the Delta's reputation in your travel month.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/${photos[3].file}" alt="${photos[3].alt}" loading="lazy"><figcaption>${photos[3].caption}</figcaption></figure>
<h3>Water camp, land camp, or a complementary pair</h3>
<p>Once the water question is open, the stay decision writes itself. A water camp is its own product: <a href="/accommodations/camp-okavango">our Camp Okavango guide</a> shows one on Nxaragha Island — motorboat journeys in the deeper channels, mokoro outings in the shallows, guided island walks — and states plainly that its operator "explicitly states that game drives are not offered here". If vehicle game viewing matters to your trip, the same guide carries the fix: "Match the camp with a land-based property if vehicle game viewing is an important part of your itinerary." And if you do take two camps, the Delta attraction guide has the pairing rule worth obeying: choose "complementary settings rather than two similar products". Two water camps two channels apart are not a safari strategy; water plus dryland is.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/${photos[2].file}" alt="${photos[2].alt}" loading="lazy"><figcaption>${photos[2].caption}</figcaption></figure>
<h3>Getting there: Maun, then the planes</h3>
<p>Most Delta trips converge on <a href="/countries/botswana/maun">Maun</a>, which Botswana's tourism organisation — as quoted in our gateway guide — calls the country's tourism capital and asks visitors not to treat "merely as transit". From there the trip changes vehicles: the Delta attraction guide explains that the inner Delta is reached largely by light aircraft, and UNESCO's integrity record confirms the pattern ("Tourism to the inner Delta is limited to small, temporary tented camps with access by air"). Plan the movement as one sequence — the attraction guide's own rule is to confirm "the gateway, onward flight or road connection, arrival airstrip and final camp transfer as a single sequence" — because camps such as Camp Okavango ask you to arrange the complete island transfer with the operator before booking onward travel. Small aircraft carry small allowances: the camp guide asks for "the current aircraft luggage allowance and all flight, conservation and transfer charges in writing", and the attraction guide says to check "baggage restrictions and connection margins for small aircraft" and to ask publicly who pays when a delayed leg breaks the chain.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/${photos[1].file}" alt="${photos[1].alt}" loading="lazy"><figcaption>${photos[1].caption}</figcaption></figure>
<p>If the flight-to-camp investment is not ready for your budget, the <a href="/activities/okavango-mokoro-safari">Maun-based mokoro day</a> is the honest middle road: a road transfer, a poler-guided journey and a walk — but book it as what the activity guide says it is, a distinct product rather than a taste of an overnight stay. "They are different products and should not be conflated."</p>
<h3>Timing: read the flood, not just the calendar</h3>
<p>The country guide's season line stands as written: May–August generally brings "dry, clear weather and cold early mornings and nights" while "the greener season offers a different birding and landscape experience". The twist that surprises first-timers is UNESCO's own: the flood arrives late, as dry-season bonus water, which is why a July trip can find channels fuller than a February one. Wildlife follows the same pulse — the lechwe you meet on the floodplain lives on whatever water spread that month — and the country guide carries the honest caveat: "regional rainfall and flooding do not follow a simple, identical timetable." The instruction that matters most is the one our Delta guide repeats: ask the camp about <em>local</em> water levels and available activities on your dates, not about the Delta in general.</p>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/${photos[4].file}" alt="${photos[4].alt}" loading="lazy"><figcaption>${photos[4].caption}</figcaption></figure>
<p>Road self-planning deserves its own caution. The country guide: "obtain current route and vehicle advice rather than assuming every lodge can be reached independently." Most of the Delta is not a road destination at all, and pretending otherwise is how map-distance errors happen.</p>
<h3>Build the pace, then ask before you pay</h3>
<p>The country guide's rhythm rule decides your itinerary skeleton: "spend enough nights in each place to settle into its rhythm, rather than moving frequently between camps with similar experiences and lengthy transfer arrangements." Water camps are slow days by design; a shorter stay "with clear expectations can be more satisfying than a costly itinerary built around an activity that is only seasonally possible", as the Delta guide puts it. Then interrogate the quote, in order:</p>
<ul>
<li>Which activities are included at this camp, and which depend on water levels on my dates?</li>
<li>If I take two camps, are the settings complementary — water plus dryland, not water twice?</li>
<li>The full transfer chain in writing: gateway, flight or road leg, arrival airstrip, camp transfer, luggage allowance.</li>
<li>Participation limits on water and walking excursions — the country guide asks you to check them — and any mobility needs raised before choosing a suite.</li>
<li>Nights in each place, sized to the pace the water actually allows.</li>
</ul>
<figure><img src="https://trekafricaguide.com${IMG_DIR}/${photos[5].file}" alt="${photos[5].alt}" loading="lazy"><figcaption>${photos[5].caption}</figcaption></figure>
<p>Where this leaves you: let the water choose the camp before the camp's name chooses you, pair water with dryland instead of water with more water, count the transfer chain as a single booked product from Maun inward, and hold the flood as a season that rewards checking — not a box the calendar already ticked. Then the itinerary, whether it holds an overnight island stay like the lily-covered channels shown here or a single unhurried mokoro day, flexes to the water the year actually sent instead of the one the brochure promised.</p>
<p>Field context lives in the published pages this story is built on: the <a href="/countries/botswana">Botswana country guide</a>, the <a href="/attractions/okavango-delta">Okavango Delta guide</a>, the <a href="/countries/botswana/maun">Maun gateway guide</a>, the <a href="/activities/okavango-mokoro-safari">mokoro day</a> and the <a href="/accommodations/camp-okavango">Camp Okavango stay</a>.</p>
`.trim();

// hero uses the zebra aerial (photos[0])
const bodyFixed = body;

const words = bodyFixed.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const maxSort = Math.max(...ov.travel_articles.map(t => t.sort_order || 0));

const rec = {
  slug: SLUG,
  title: 'Plan an Okavango trip: water camp, land camp, or a Maun day',
  category: 'Practical travel',
  region: 'Southern Africa',
  country: 'Botswana',
  excerpt: 'Plan an Okavango Delta trip around the decisions the water itself makes: what the flood allows, whether your stay sits on it, how the light-aircraft chain reaches it from Maun, and when the channels are actually full.',
  read_time: Math.max(1, Math.ceil(words / 200)) + ' min read',
  hero_image_url: `https://trekafricaguide.com${IMG_DIR}/${photos[0].file}`,
  hero_image_alt: photos[0].alt,
  source_url: 'https://whc.unesco.org/en/list/1432/',
  research_sources: [
    { label: 'UNESCO World Heritage record Okavango Delta (checked 10 November 2026) — inscribed 2014 as the 1000th World Heritage site, criteria (vii)(ix)(x); annual flooding occurs during the dry season with the flood pulse peaking June/July; about 40% of the protected property within Moremi Game Reserve; inner-Delta tourism "limited to small, temporary tented camps with access by air"; endorheic delta draining into the Kalahari Basin; around 130,000 elephants with the Delta as their core survival area', url: 'https://whc.unesco.org/en/list/1432/', checked_at: '2026-11-10' },
    { label: 'Trek Africa Guide internal pages (live 10 November 2026, verbatim quotes carried with backlinks) — /countries/botswana (position-over-name, complementary-camps and nights-per-place rules, May–August dry season, greener-season birding, baggage and delay checks, road-advice caveat), /attractions/okavango-delta (choose-the-experience-first rule, single transfer sequence, small-aircraft margins, seasonal-activity honesty), /countries/botswana/maun (via Botswana\'s tourism organisation: tourism-capital framing and transit warning, direct flights from Johannesburg and Gaborone), /accommodations/camp-okavango (game drives not offered, land-property match rule, transfer arranged before onward travel, luggage and charges in writing, age-six policy, satellite Wi-Fi caveat), /activities/okavango-mokoro-safari (road transfer + poler-guided mokoro + walk; day trip vs overnight camp as different products)', url: 'https://trekafricaguide.com/countries/botswana/', checked_at: '2026-11-10' },
    { label: 'botswanatourism.co.bw Okavango Delta page — unreachable from this machine (repeated timeouts, 10 November 2026); BTO-attributed facts therefore carried only as quoted within the live internal Maun and Botswana pages', url: 'https://www.botswanatourism.co.bw/explore/botswana/okavango-delta', checked_at: '2026-11-10' },
    { label: 'Wikimedia Commons file pages for all six photographs (checked 10 November 2026) — creators, capture dates and CC BY / CC BY-SA / public-domain status recorded in the photo-library entries and figure captions', url: 'https://commons.wikimedia.org/wiki/File:Cebras_de_Burchell_(Equus_quagga_burchellii),_vista_a%C3%A9rea_del_delta_del_Okavango,_Botsuana,_2018-08-01,_DD_30.jpg', checked_at: '2026-11-10' },
  ],
  last_researched: '2026-11-10',
  status: 'published',
  published_at: new Date().toISOString(),
  sort_order: maxSort + 1,
  featured: false,
  meta_title: 'Plan an Okavango trip: water camp, land camp, or a Maun day',
  meta_description: 'Hold the decisions the Delta water makes before any camp name: what the flood allows, water camp or complementary pair, the Maun-to-airstrip chain, and the season the flood actually peaks.',
  body: bodyFixed,
};
ov.travel_articles.push(rec);
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2).replace(/\[\n\s*\]/g, '[]'));
console.log('travel article added:', SLUG, '| sort_order', rec.sort_order, '| read_time', rec.read_time, '| body words', words);
