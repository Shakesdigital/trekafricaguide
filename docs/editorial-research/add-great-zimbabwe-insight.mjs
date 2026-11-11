// Add travel insight: plan-great-zimbabwe-monument-days-from-masvingo (2026-11-11 run)
import fs from 'node:fs';
import crypto from 'node:crypto';

const overridesPath = 'content/editorial-overrides.json';
const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));

const IMG = 'https://trekafricaguide.com/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo';

function figure(file, alt, caption) {
  return `<figure><img src="${IMG}/${file}" alt="${alt}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
}

const body = `<p><em>Research checked 11 November 2026. Fees, opening hours and road conditions at Great Zimbabwe are set by NMMZ and ZimParks at the gate, and published figures age fast — re-confirm shortly before travel; the sources below state what was current at check.</em></p>

<p>Zimbabwe is the only country on this site whose story archive had nothing in it — until now. That gap sits oddly behind one of the richest clusters we have published: the <a href="/countries/zimbabwe">Zimbabwe country guide</a>, the <a href="/attractions/great-zimbabwe-national-monument">Great Zimbabwe National Monument attraction guide</a>, the <a href="/activities/great-zimbabwe-guided-monument-visit">guided monument visit</a>, the <a href="/accommodations/great-zimbabwe-hotel">Great Zimbabwe Hotel stay guide</a> and the <a href="/countries/zimbabwe/masvingo">Masvingo destination guide</a> all plan around one site, and the monument's own instructions — "Plan the visit from Masvingo and allow time for uneven paths, a steep hill section" — leave the pacing and road questions open. This story answers them.</p>

<h2>The decision the trip turns on: one Masvingo night or two</h2>
<p><strong>One night</strong> fits if Masvingo is a corridor stop on a Harare–Beitbridge run: arrive, sleep, take the monument early, drive on. It works because the monument is walkable in a focused visit and the hotel side of the cluster is close — the Great Zimbabwe Hotel guide places the property within walking distance of the ruins (the travel guide's own routing has visitors walk past the hotel to the site, about 2 km from the informal minibus drop). The trade is that you compress the Hill Complex climb into a hot afternoon or a rushed morning.</p>
<p><strong>Two nights</strong> is the shape this story argues for. The travel guide recommends dedicating about four hours to the monument rather than the couple of hours a fast walker needs, and the Masvingo guide's own add-ons — Lake Mutirikwi, the Kyle Recreational Park, Chesvingo Karanga Village — only fit a second day. A two-night shape gives you a monument morning, a lake-and-park afternoon or full day, and slack for the road: the same guide treats the A4 through Masvingo as tarred and fairly busy because it carries main international freight traffic, and those are not the roads to end a day against a deadline.</p>
${figure('site-aerial-looking-west-2015-bell.jpg', 'Aerial view across the Great Zimbabwe ruins looking west, with the enclosures and hill in their landscape.', 'Looking west over the Great Zimbabwe site from the air, July 2015 (CC BY-SA 4.0, Janice Bell via Wikimedia Commons). UNESCO records a 722-hectare property — the aerial view shows why the walk between complexes is part of the visit.')}

<h2>The road plan: the A4, the turn-off, and what runs when</h2>
<p>The travel guide puts the monument roughly a 4-hour drive from Harare and from Bulawayo, and around 8 hours from Victoria Falls — planning figures to confirm with your provider, not timetable facts. Its routing advice is concrete: drive through Masvingo on the A4 Beitbridge road, then turn left following the signs to Great Zimbabwe. The same guide's practical cautions carry: don't pull off the road in remote stretches between Harare and Masvingo, and expect the main corridors to carry freight traffic.</p>
<p>Public transport is the weak link. The guide is explicit that there is no scheduled reliable public transport from Masvingo to the monument: the dependable options are a private shuttle arranged through your hotel or lodge, or driving. Backpacker-grade informal minibuses run to Masvingo from Harare's Road Port or Mbare terminals, but the last 25 km or so to the ruins is then a walk-past-the-hotel situation or another negotiation. Masvingo's airport handles charter flights only, so most visitors arrive by road — which is exactly why the base decision above matters.</p>
${figure('masvingo-city-centre-2020-realtino.jpg', 'Masvingo city centre street scene with traffic and low-rise buildings.', 'Masvingo city centre, August 2020 (CC BY-SA 4.0, Realtino via Wikimedia Commons). The provincial capital is the practical base and cash-stop for the monument day — the travel guide notes ATMs are in town, 25 km from the ruins.')}

<h2>Pacing the monument day</h2>
<p><strong>Start early.</strong> The travel guide gives opening "usually 8am" and closing "usually 5pm", and recommends arriving around 9am — before the lowveld heat and the tour groups. Hours are gate-set by NMMZ, so treat them as typical rather than fixed.</p>
<p><strong>Give it four hours.</strong> The guide's pacing recommendation is the one our Masvingo guide repeats: a fast walker can cover the site in a couple of hours, but about four hours lets you climb the Hill Complex, cross to the Great Enclosure, take in the Valley Ruins and the on-site museum, and eat. The fee — the guide quotes US$15 for non-residents, dated to its March 2024 update — includes the museum; ZimParks-style fee discipline applies here too: confirm the current figure at the ticket office.</p>
<p><strong>Respect the Hill Complex.</strong> The paths are sandy and bumpy, and the Hill Complex section is single file and steep in places — the guide flags it as less suitable for younger children who are not used to hiking. UNESCO's record and our attraction guide both frame the site as a living sacred heritage place still used by contemporary communities; follow staff guidance on where to walk.</p>
<p><strong>Guide or no guide.</strong> The travel guide's honest answer: a guide isn't necessary — there are signs and booklets — and a government guide can be hired at the gate, while lodges and tour operators book private guides. Booklets and signs carry the visit; choose a guide for depth, not access.</p>
${figure('western-entrance-2019-moore.jpg', 'The western entrance passage into the Great Enclosure at Great Zimbabwe.', 'The western entrance to the Great Enclosure, March 2019 (CC BY-SA 2.0, Andrew Moore via Wikimedia Commons). Entering through the narrow passage is the moment the scale of the walls lands.')}

<h2>The second day: the lake, the drive, the villages</h2>
<p>The Great Zimbabwe World Heritage site's own guide describes the <strong>Murray McDougall Drive</strong> — a scenic circular route connecting Masvingo, the Lake Mutirikwi shoreline and the dam wall — calling it "Zimbabwe's garden route": good tar for the first sixty kilometres, some twenty-five kilometres of dirt road, then tar again on the A9, and a full day's journey. It is the natural second-day spine out of Masvingo.</p>
<p>The lake itself is ZimParks' <strong>Lake Kyle Recreational Park</strong>: 169 square kilometres about 30 km east of Masvingo, with the Great Zimbabwe ruins to its south, more than 25 mammal species including white rhino and leopard, and over 35 bird species. Boating, bass fishing and game viewing by boat run on the water — book directly with operators, and remember ZimParks publishes no fees online. The dirt sections need high clearance and 4WD in the rainy season.</p>
${figure('lake-kyle-2011-maitynoe.jpg', 'Lake Kyle (Lake Mutirikwi) with open water and distant shoreline hills.', 'Lake Kyle — Lake Mutirikwi — July 2011 (CC BY-SA 4.0, MaiTynoe via Wikimedia Commons). The lake and the ruins sit inside one planning day: the recreational park runs east of Masvingo with the monument to its south.')}
<p>Add the <strong>Chesvingo Karanga Village</strong> community project about 40 km along Great Zimbabwe Road toward the Kyle dam wall — music, dances, foods, granaries, caves and rock paintings, per the Masvingo Publicity Association — and the two-night shape earns its keep: one day for the monument, one for the lake circuit and the village.</p>
${figure('great-enclosure-wall-2015-schertzer.jpg', 'The curved granite outer wall of the Great Enclosure rising above grass and trees.', 'The Great Enclosure outer wall, September 2015 (CC BY 3.0, Fanny Schertzer via Wikimedia Commons). UNESCO records the enclosure as the largest ancient structure south of the Sahara — the wall reads as architecture, not just archaeology.')}

<h2>When to go</h2>
<p>The travel guide's window is <strong>April to September</strong>, when rain is rare; Zimbabwe's rains fall mainly November to March. Our Masvingo guide carries the same seasonality with the operational caveat: ZimParks warns that roads inside the Kyle Recreational Park need high clearance and 4WD in the rainy season. The site's altitude keeps even hot months workable — the guide's caution is the sun, not the heat — so a dry-season start at opening time is the comfortable version; a green-season visit trades mud and 4WD for emptier paths.</p>
${figure('sacred-enclosure-2015-schertzer.jpg', 'Enclosure walls on the sacred hill section at Great Zimbabwe.', 'The sacred enclosure, September 2015 (CC BY 3.0, Fanny Schertzer via Wikimedia Commons). Parts of the hill remain an active sacred site for local communities — walk where staff direct.')}

<h2>Confirm before you book</h2>
<p>Three checks belong in your booking email, not your itinerary spreadsheet. First, the monument fee: the travel guide's US$15 non-resident figure is dated March 2024 — confirm the current gate price, and that it still includes the museum. Second, transport: there is no scheduled public service to the ruins, so confirm whether your hotel or lodge runs or books a shuttle, at what price, and at what time. Third, park access: ZimParks publishes no Kyle Recreational Park fees online — confirm entry terms, boat-activity availability and road conditions with ZimParks or your operator for your dates. Large groups can contact NMMZ directly through its published reservations lines.</p>

<h2>Three questions travelers actually ask</h2>
<p><strong>Can I visit Great Zimbabwe as a day trip without sleeping in Masvingo?</strong> Yes, from Harare or Bulawayo it is roughly a 4-hour drive each way — but that makes a very long day on roads the guide describes as busy freight corridors. An overnight in Masvingo, or two, buys the early start and the second day.</p>
<p><strong>Do I need to book anything in advance?</strong> Nothing is formally bookable online for a standard monument visit: entry fees are paid at the ticket office, government guides are hired at the gate. What you should arrange ahead is transport (hotel shuttle or self-drive) and, in the rainy season, a high-clearance vehicle for the park roads.</p>
<p><strong>Is the site suitable for children?</strong> The Valley Ruins, Great Enclosure and museum are walkable for families; the Hill Complex is steep and single file in places, which the travel guide flags for younger children who do not hike. Take water and sun protection regardless of season.</p>

<h2>Continue planning</h2>
<p>The cluster carries the rest: the <a href="/countries/zimbabwe/masvingo">Masvingo destination guide</a> for the base town and its highlights, the <a href="/attractions/great-zimbabwe-national-monument">monument attraction guide</a> for the site's history and layout, the <a href="/activities/great-zimbabwe-guided-monument-visit">guided monument visit</a> for the booked version of the walk, and the <a href="/accommodations/great-zimbabwe-hotel">Great Zimbabwe Hotel guide</a> for the monument-side stay. If your Zimbabwe trip continues to the falls, our <a href="/travel-insights/plan-your-victoria-falls-visit">Victoria Falls first-visit insight</a> plans the other end of the country.</p>

<h2>Sources and scope</h2>
<p>Monument facts, access, pacing and dated fee figures: the Great Zimbabwe Monument travel guide (greatzimbabweguide.com, last updated March 2024, fetched 11 November 2026). Lake Mutirikwi, Murray McDougall Drive and Masvingo area attractions: the Great Zimbabwe World Heritage Site project's local-attractions guide (fetched 11 November 2026) and the Masvingo Publicity Association. Park area, wildlife and road-season warnings: ZimParks' Lake Kyle Recreational Park page (fetched 11 November 2026). UNESCO property facts (inscribed 1986, criteria i/iii/vi, 722 ha, ~30 km from Masvingo) are carried from our Masvingo destination guide's record checked 11 November 2026; whc.unesco.org returned 403 to this environment on re-fetch. No accommodation rates, review scores or gate fees are reprinted beyond the dated, hedged figures above.</p>`;

const slug = 'plan-great-zimbabwe-monument-days-from-masvingo';

const record = {
  slug,
  title: 'Plan Great Zimbabwe monument days: pacing the site, the road, and the lake',
  category: 'Practical travel',
  region: 'Southern Africa',
  country: 'Zimbabwe',
  excerpt: 'One Masvingo night or two? The road plan onto the A4, a four-hour monument morning, the Murray McDougall lake circuit and the season that decides it — a pacing guide for Zimbabwe\'s name-giving site.',
  read_time: '7 min read',
  hero_image_url: `${IMG}/great-enclosure-wall-2015-schertzer.jpg`,
  hero_image_alt: 'The curved granite outer wall of the Great Enclosure rising above grass and trees at Great Zimbabwe.',
  source_url: 'https://www.greatzimbabweguide.com/great-zimbabwe-monument-travel-guide/',
  research_sources: [
    {
      label: 'Great Zimbabwe Monument & Ruins travel guide (greatzimbabweguide.com, last updated March 2024; fetched 11 November 2026) — 25 km south-east of Masvingo, ~4 h by road from Harare/Bulawayo and ~8 h from Victoria Falls, A4 freight-corridor routing with left turn following signs, no scheduled reliable public transport (hotel shuttles/minibuses; walk past the hotel ~2 km), charter-only Masvingo Airport, entry US$5 residents/US$15 non-residents incl. museum (dated March 2024), gates usually 08:00–17:00 with 09:00 arrival recommended, ~4 h recommended visit, sandy bumpy paths, Hill Complex single-file and steep, guide optional (government at gate / private via lodges), toilets only at gate and museum, ATMs in Masvingo 25 km away, best April–September with rains November–March',
      url: 'https://www.greatzimbabweguide.com/great-zimbabwe-monument-travel-guide/',
      checked_at: '2026-11-11',
    },
    {
      label: 'Great Zimbabwe World Heritage Site project, Local Attractions guide (greatzimbabwewhs.com; fetched 11 November 2026) — Murray McDougall Drive called "Zimbabwe\'s garden route", scenic circular route connecting Masvingo, the Lake Mutirikwi shoreline and the dam wall, good tar first sixty kilometres then some twenty-five kilometres of dirt before rejoining tar on the A9, a full day\'s journey; Lake Mutirikwi built 1961, second-largest inland lake after Kariba claim; Masvingo founded 1890, name sequence Fort Victoria/Victoria 1929/Nyanda 1982/Masvingo meaning "fortifications"',
      url: 'https://www.greatzimbabwewhs.com/local-attractions/',
      checked_at: '2026-11-11',
    },
    {
      label: 'Zimbabwe Parks and Wildlife Management Authority (ZimParks), Lake Kyle Recreational Park page (fetched 11 November 2026) — 169 sq km park about 30 km east of Masvingo, Great Zimbabwe Ruins to its south, 25+ wild mammal species including white rhino/buffalo/leopard, 35+ bird species; no fees published online (confirm-at-operator posture)',
      url: 'https://www.zimparks.org.zw/lake-kyle-recreational-park/',
      checked_at: '2026-11-11',
    },
    {
      label: 'Masvingo Publicity Association attractions pages (carried from our Masvingo destination record, checked 11 November 2026) — Great Zimbabwe 27 km from Masvingo, Lake Mutirikwi ~25 km with bass fishing/boating/game viewing, Chesvingo Karanga Village community project 40 km along Great Zimbabwe Road toward the Kyle dam wall (music, dances, foods, granaries, caves, rock paintings)',
      url: 'https://www.masvingopublicity.com/attractions/',
      checked_at: '2026-11-11',
    },
    {
      label: 'UNESCO World Heritage Centre, Great Zimbabwe National Monument (ID 364) facts carried from our Masvingo destination record checked 11 November 2026 — inscribed 1986, criteria (i)(iii)(vi), property 722 ha, ~30 km from Masvingo, living sacred site; whc.unesco.org re-fetch returned HTTP 403 to this environment on 11 November 2026',
      url: 'https://whc.unesco.org/en/list/364/',
      checked_at: '2026-11-11',
    },
    {
      label: 'Trek Africa Guide internal cluster (live HTTP 200, 11 November 2026) — /countries/zimbabwe, /countries/zimbabwe/masvingo, /attractions/great-zimbabwe-national-monument, /activities/great-zimbabwe-guided-monument-visit, /accommodations/great-zimbabwe-hotel, /travel-insights/plan-your-victoria-falls-visit; duplicate check: 14 published insights carried zero Zimbabwe coverage before this story',
      url: 'https://trekafricaguide.com/countries/zimbabwe/masvingo/',
      checked_at: '2026-11-11',
    },
  ],
  last_researched: '2026-11-11',
  status: 'published',
  published_at: '2026-11-11',
  sort_order: 65,
  featured: false,
  meta_title: 'Plan Great Zimbabwe monument days: pacing the site, the road, and the lake',
  meta_description: 'Decide one Masvingo night or two, plan the A4 road approach, pace a four-hour Great Zimbabwe monument morning, and add the Murray McDougall lake circuit. Zimbabwe\'s name-giving site, planned.',
  body,
};

if (!overrides.travel_articles.some((a) => a.slug === slug)) {
  overrides.travel_articles.push(record);
  fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2) + '\n');
  console.log('travel article appended:', slug);
} else {
  console.log('slug already present — no change');
}

// Link into Masvingo destination travel_insight_slugs
const destPath = 'content/local-destinations.json';
const dest = JSON.parse(fs.readFileSync(destPath, 'utf8'));
const arr = Array.isArray(dest) ? dest : dest.destinations || Object.values(dest);
const masvingo = arr.find((d) => d.slug === 'masvingo');
if (masvingo && !masvingo.travel_insight_slugs.includes(slug)) {
  masvingo.travel_insight_slugs.push(slug);
  fs.writeFileSync(destPath, JSON.stringify(dest, null, 2) + '\n');
  console.log('masvingo travel_insight_slugs updated');
} else {
  console.log('masvingo link already present or record not found:', !!masvingo);
}

// Photo-library entries
const metaPath = 'docs/editorial-research/great-zimbabwe-insight-photo-metadata.json';
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
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
const captions = {
  'great-enclosure-wall-2015-schertzer.jpg': 'The Great Enclosure outer wall, September 2015 (CC BY 3.0, Fanny Schertzer via Wikimedia Commons). UNESCO records the enclosure as the largest ancient structure south of the Sahara — the wall reads as architecture, not just archaeology.',
  'sacred-enclosure-2015-schertzer.jpg': 'The sacred enclosure, September 2015 (CC BY 3.0, Fanny Schertzer via Wikimedia Commons). Parts of the hill remain an active sacred site for local communities — walk where staff direct.',
  'site-aerial-looking-west-2015-bell.jpg': 'Looking west over the Great Zimbabwe site from the air, July 2015 (CC BY-SA 4.0, Janice Bell via Wikimedia Commons). UNESCO records a 722-hectare property — the aerial view shows why the walk between complexes is part of the visit.',
  'western-entrance-2019-moore.jpg': 'The western entrance to the Great Enclosure, March 2019 (CC BY-SA 2.0, Andrew Moore via Wikimedia Commons). Entering through the narrow passage is the moment the scale of the walls lands.',
  'masvingo-city-centre-2020-realtino.jpg': 'Masvingo city centre, August 2020 (CC BY-SA 4.0, Realtino via Wikimedia Commons). The provincial capital is the practical base and cash-stop for the monument day — the travel guide notes ATMs are in town, 25 km from the ruins.',
  'lake-kyle-2011-maitynoe.jpg': 'Lake Kyle — Lake Mutirikwi — July 2011 (CC BY-SA 4.0, MaiTynoe via Wikimedia Commons). The lake and the ruins sit inside one planning day: the recreational park runs east of Masvingo with the monument to its south.',
};
const alts = {
  'great-enclosure-wall-2015-schertzer.jpg': 'The curved granite outer wall of the Great Enclosure rising above grass and trees at Great Zimbabwe.',
  'sacred-enclosure-2015-schertzer.jpg': 'Enclosure walls on the sacred hill section at Great Zimbabwe.',
  'site-aerial-looking-west-2015-bell.jpg': 'Aerial view across the Great Zimbabwe ruins looking west, with the enclosures and hill in their landscape.',
  'western-entrance-2019-moore.jpg': 'The western entrance passage into the Great Enclosure at Great Zimbabwe.',
  'masvingo-city-centre-2020-realtino.jpg': 'Masvingo city centre street scene with traffic and low-rise buildings.',
  'lake-kyle-2011-maitynoe.jpg': 'Lake Kyle (Lake Mutirikwi) with open water and distant shoreline hills.',
};

const libPath = 'src/lib/photo-library.js';
let libText = fs.readFileSync(libPath, 'utf8');
let count = 0;
for (const m of meta) {
  const file = renames[m.title] || null;
  if (!file) { console.log('no rename for', m.title); continue; }
  const slugId = file.replace('.jpg', '').replace(/\./g, '-') + '-' + (m.creator.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') || 'commons');
  const local = `/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo/${file}`;
  if (libText.includes(`"${local}"`)) { console.log('already in library:', local); continue; }
  const entry = {
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
  };
  const marker = 'const photoLibrary = {';
  const insertion = marker + `\n  updated_at: '2026-11-11T13:00:00Z',`;
  if (!libText.includes("updated_at: '2026-11-11")) {
    libText = libText.replace(marker, insertion);
  }
  const imagesAnchor = libText.indexOf('images: [');
  libText = libText.slice(0, imagesAnchor) + 'images: [' + '\n    ' + JSON.stringify(entry, null, 4).replace(/\n/g, '\n    ') + ',' + libText.slice(imagesAnchor + 'images: ['.length);
  count++;
}
fs.writeFileSync(libPath, libText);
console.log('photo-library entries added:', count);
