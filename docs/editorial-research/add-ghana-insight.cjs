// Add travel insight: Plan a first Ghana trip (Accra arrival and the Cape Coast–Elmina castle circuit).
// Run: node docs/editorial-research/add-ghana-insight.cjs
const fs = require('fs');

const SLUG = 'plan-first-ghana-trip-accra-and-the-castle-coast';
const overridesPath = 'content/editorial-overrides.json';
const o = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));

if (o.travel_articles.some((t) => t.slug === SLUG)) {
  console.error('DUPLICATE: slug already exists in travel_articles — aborting.');
  process.exit(1);
}

const DIR = '/images/editorial/plan-first-ghana-trip';

const figure = (file, alt, creator, license, year, captionExtra = '') => (
  `<figure><img src="${DIR}/${file}" alt="${alt}" /><figcaption>${alt.replace(/\.$/, '')}, photographed in ${year}. Photo: <a href="${srcPage(file)}">${creator}</a> · ${licenseLink(file, license)}. Resized for display.${captionExtra}</figcaption></figure>`
);

function srcPage(file) {
  const map = {
    'cape-coast-castle-2011.jpg': 'https://commons.wikimedia.org/wiki/File:Cape_Coast_Castle,_Cape_Coast,_Ghana.JPG',
    'kakum-canopy-walkway-2022.jpg': 'https://commons.wikimedia.org/wiki/File:Canopy_walkway_in_Kakum_National_Park_2.jpg',
    'elmina-castle-2023.jpg': 'https://commons.wikimedia.org/wiki/File:Castle,_Elmina_(P1100187).jpg',
    'kwame-nkrumah-memorial-park-2008.jpg': 'https://commons.wikimedia.org/wiki/File:Kwame_Nkrumah_Memorial_Park.jpg',
    'jamestown-lighthouse-2017.jpg': 'https://commons.wikimedia.org/wiki/File:Jamestown_Lighthouse_20170122.jpg'
  };
  return map[file];
}
function licenseLink(file, license) {
  const urls = {
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/'
  };
  return `<a href="${urls[license]}">${license}</a>`;
}

const body = `<p><em>Research checked 13 November 2026. Visa processing, health screening and seasonal conditions change — confirm each with the official sources shortly before you commit. Photographs show the named places in earlier years; they are not live condition reports.</em></p>

<p>Ghana is published on this guide as a connected cluster — the <a href="/countries/ghana">Ghana country guide</a>, the <a href="/countries/ghana/elmina">Elmina destination</a>, the <a href="/attractions/cape-coast-kakum">Cape Coast Kakum</a>, <a href="/attractions/elmina-castle">Elmina Castle</a> and <a href="/attractions/kwame-nkrumah-memorial-park">Kwame Nkrumah Memorial Park</a> attraction guides, and three stay guides — while the travel-insights shelf had no dedicated Ghana planning story. The country guide sets the promise: "Ghana is one of West Africa's easiest entry points, combining strong hospitality, heritage travel, Atlantic coast sites, and a vibrant contemporary cultural scene." The decision this story answers is what a first trip actually requires: the entry paperwork that starts weeks out, the first-night base in Accra, and how to pace the castle coast without compressing its two heaviest experiences into one rushed day.</p>

<h2>The entry paperwork starts weeks before the flight</h2>
<p>A visa is required for most non-residents except ECOWAS nationals, according to the Ghana Tourism Authority's official travel information. The UK Foreign, Commonwealth &amp; Development Office (FCDO) entry guidance confirms a visa is required and describes the application route: an online form with a 10 to 15 day processing time, with an express in-person service of around three days available at Ghana's premium application centre in London for those who can use it. Start the application before you book non-refundable hotels — the visa timeline, not the flight schedule, is the critical path for a first visit.</p>
<figure><img src="${DIR}/accra-independence-arch-sunset-2023.jpg" alt="The Independence Arch in Accra photographed at sunset." /><figcaption>The Independence Arch at Black Star Square, Accra (Kwameghana / Bright Kwame Ayisi, CC0 via Wikimedia Commons). Resized for display.</figcaption></figure>
<p>Three health and entry requirements belong on the same checklist. A yellow fever vaccination certificate is required to enter Ghana, per the FCDO. Travellers must also complete Ghana's online health declaration before travel, and additional screening is in place at border entry points (FCDO entry-requirements page, updated 4 November 2026). Passport validity is checked against arrival: your passport should have an expiry date at least six months after the date you arrive. On arrival, FCDO guidance says all hard currency must be declared using the form provided, and carrying foreign cash worth 10,000 US dollars or more risks confiscation of the entire amount — a reason to bring cards plus a moderate cash float rather than a full trip budget in notes.</p>

<h2>Arrival: the first night in Accra</h2>
<p>Most first visits land at Kotoka International Airport in Accra. Two FCDO arrival notes are worth knowing before you queue. First, confirm the identity of any driver collecting you — FCDO reports British nationals have been robbed by impostors approaching arrivals areas pretending to be their driver, so agree the pickup in advance and check ID. Second, keep your passport secure and bags attended; there are reports of thefts of luggage and travel documents at the airport.</p>
<p>Accra rewards a first-night base chosen for what you will actually do. If your first full day is the memorial-park-and-square pairing, downtown is the practical side: <a href="/accommodations/accra-city-hotel/">Accra City Hotel</a> sits on Barnes Road within walking reach of the <a href="/attractions/kwame-nkrumah-memorial-park">Kwame Nkrumah Memorial Park</a> — a museum, mausoleum and landscaped memorial to Ghana's first president on the city's High Street — and the Independence Arch and Black Star Square beyond it. The park needs no half-day commitment: pair it with the square and an evening meal and you have a complete arrival day that leaves the heavier history for the coast.</p>
<figure><img src="${DIR}/kwame-nkrumah-memorial-park-2008.jpg" alt="The fountains and mausoleum of the Kwame Nkrumah Memorial Park in Accra." /><figcaption>The fountains and mausoleum of the Kwame Nkrumah Memorial Park, Accra (Erik B. Anderson · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> via Wikimedia Commons). Resized for display.</figcaption></figure>
<figure><img src="${DIR}/jamestown-lighthouse-2017.jpg" alt="The red-and-white Jamestown Lighthouse in Accra’s old fishing quarter." /><figcaption>The Jamestown Lighthouse in Accra's old fishing quarter (Gereon K. · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> via Wikimedia Commons). Resized for display.</figcaption></figure>
<p>If you have a second Accra morning, the old quarter of Jamestown — the whitewashed lighthouse, working fishing beach and colonial-era streets — is the contrast piece to the memorial district. Treat the fishing beach as a working waterfront rather than a swimming beach; FCDO is blunt that swimming is dangerous on Ghana's southern coast due to rip tides and undertows, with occasional deaths reported, and that theft is the main problem at beaches. Enjoy the shore from land.</p>

<h2>The castle coast: Cape Coast, Elmina and Kakum</h2>
<p>The Central Region is the emotional core of a first Ghana trip: Cape Coast Castle and Elmina Castle, two major sites in the history of the transatlantic trade in enslaved people, and Kakum National Park's rainforest canopy walkway between them. The site's <a href="/attractions/cape-coast-kakum">Cape Coast Kakum guide</a> carries the pacing decision: "Our suggested pacing is a Cape Coast Castle visit on one day and Kakum on another, with a night in the Cape Coast area between them." The history at the castles is guided, emotionally demanding work — leave space afterward rather than scheduling another heavy stop immediately — and Kakum's suspended bridges are a genuine opt-out for anyone uneasy with heights; the park's ground-level guided walks are the alternative.</p>
<figure><img src="${DIR}/cape-coast-castle-2011.jpg" alt="The white exterior walls of Cape Coast Castle seen from the sea side." /><figcaption>The sea-side walls of Cape Coast Castle, Cape Coast (Rjruiziii · <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> via Wikimedia Commons). Resized for display.</figcaption></figure>
<figure><img src="${DIR}/kakum-canopy-walkway-2022.jpg" alt="The suspended canopy walkway at Kakum National Park crossing above the rainforest." /><figcaption>The canopy walkway above Kakum National Park's rainforest (daSupremo · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> via Wikimedia Commons). Resized for display.</figcaption></figure>
<figure><img src="${DIR}/elmina-castle-2023.jpg" alt="The whitewashed walls and bastions of Elmina Castle, Ghana." /><figcaption>The walls and bastions of Elmina Castle, Elmina (Matti Blume · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> via Wikimedia Commons). Resized for display.</figcaption></figure>
<p>Choose one base per night cluster and let the transfers work for you. A Cape Coast city base — for example <a href="/accommodations/ridge-royal-hotel/">Ridge Royal Hotel</a> — puts the castle in town and Kakum and <a href="/attractions/elmina-castle">Elmina Castle</a> as separate road outings; a beachfront Elmina base such as <a href="/accommodations/lemon-beach-resort-elmina/">Lemon Beach Resort</a> trades a longer Kakum drive for evenings on the shore. Do not stack all three sites into one long day-trip from Accra: the site's attraction guide notes Visit Ghana gives an indicative drive of about four hours from Accra to Kakum, and traffic, departure time and stops can lengthen it. A compressed circuit compresses the history, and the history is the point.</p>

<h2>Season and roads: when to go and how to drive</h2>
<p>Southern Ghana's planning pattern, as carried in the country guide from Ghana's tourism seasonal guidance, is wetter around April to June and September to mid-November, with relatively drier periods around November to March and July to August. These are patterns, not forecasts: rain affects Kakum's trail conditions and comfort on the bridges, and heavy rainfall can disrupt road travel and services in and around Accra (FCDO safety guidance). Whichever month you choose, build flexibility for outdoor walks and carry rain protection.</p>
<p>On the road itself, FCDO's advice is to avoid road travel outside main towns after dark, when accident and vehicle-attack risks rise, and for longer trips to travel during daylight hours. Practically, that means a morning departure from Accra to the coast and a Cape Coast-area overnight — which is also the pacing the castle itinerary wants anyway. The Ghana Tourism Authority's official information describes the tropical climate and light cotton clothing as the packing default; add sunglasses, comfortable walking shoes for the Kakum forest approach, and rain protection.</p>

<h2>Money, cards and daily practicalities</h2>
<p>Ghana's currency is the cedi; foreign currency can be freely exchanged at banks and forex bureaus (Ghana Tourism Authority). Card acceptance is the nuance worth planning around: the tourism authority lists Visa and Mastercard as accepted in major hotels, restaurants and businesses, while FCDO notes Mastercard in particular is not widely accepted and advises carrying back-up funds and notifying your issuer before travel. Treat a Visa card plus a cash reserve as the working setup, and keep your card in sight at payment to limit skimming risk (FCDO).</p>
<p>Everyday logistics are simple. Power is 220–240 volts with British- or European-type outlets; with a valid passport you can buy a SIM from any of Ghana's mobile operators for data during the trip; and tipping in hotels and restaurants is permitted and rarely added to the bill (Ghana Tourism Authority). Modern private and public hospitals and clinics operate in cities and large towns — carry travel medical insurance that covers treatment in Ghana.</p>

<h2>A calm safety posture</h2>
<p>Ghana's visitor routes are not blanket-advised against: as of 13 November 2026, FCDO's area advice covers Bawku Municipality in the Upper East region — away from the Accra-to-Cape-Coast corridor most first visits use — and advises against all but essential travel there. The relevant urban guidance is ordinary city caution, not alarm: street crime such as pickpocketing and bag-snatching is increasing in Accra, so avoid carrying large sums, use the hotel safe for passports and valuables, be alert at ATMs, and take particular care after nightfall. Demonstrations in Accra are normally well policed but can occur at short notice — leave any demonstration or disturbance quickly rather than watching or photographing it (FCDO). Dress modestly in public in a conservative, religious country, and remember carrying ID is advisable: a passport photocopy is acceptable, with the original in the hotel safe.</p>

<h2>Confirm before you book</h2>
<ul>
<li><strong>Visa processing time before non-refundable commitments</strong>: 10–15 days standard, an express in-person service of around three days where available; confirm your own route with Ghana's mission or embassy for your nationality.</li>
<li><strong>Yellow fever certificate and health declaration at booking stage</strong>: both are entry requirements; the online health declaration is completed before travel and screening operates at border points.</li>
<li><strong>Current castle hours and fees directly</strong>: the site's attraction guide notes the published fee table was last marked reviewed in July 2023 — confirm hours, admission and guided-tour arrangements before travel rather than relying on any printed price.</li>
<li><strong>Kakum walkway operation on your date</strong>: confirm the canopy walkway is operating and ask about ground-level alternatives if your group has anyone uneasy with heights.</li>
<li><strong>Transfers as booked services</strong>: pre-arrange the Accra pickup (confirm driver ID) and the coast-road transfers as daylight journeys; confirm return pickups rather than assuming taxis or tour seats are always available.</li>
<li><strong>Season against your dates</strong>: check conditions with the park and your accommodation shortly before travel — the wet/dry pattern is a planning tool, not a forecast.</li>
</ul>

<h2>Three questions travelers actually ask</h2>
<p><strong>Is Ghana a good first West Africa trip?</strong> The country guide's framing is the honest answer: an accessible entry point with strong hospitality and heritage travel — with the planning work in the visa, certificates and paced road logistics rather than in surprises on arrival. Start with Accra plus the castle coast and you have a complete first arc.</p>
<p><strong>Can Kakum and the castles be done as one Accra day trip?</strong> A combined excursion is possible, but the site's attraction guide is clear about the trade-off: the four-hour indicative drive each way plus several scheduled visits compresses the time at each place. The recommended shape is the overnight: castle day, night in the area, Kakum early the next morning.</p>
<p><strong>Do I need malaria medication and vaccinations beyond yellow fever?</strong> Yellow fever is the entry requirement; for recommended vaccinations and malaria prophylaxis, use a travel-health professional — FCDO points to TravelHealthPro's Ghana guide for full health-entry details. This story does not give medical advice; confirm your personal plan before travel.</p>

<h2>Continue planning</h2>
<ul>
<li><a href="/countries/ghana/">Ghana country guide</a> — the destination overview, attractions and stays rail.</li>
<li><a href="/countries/ghana/elmina/">Elmina destination guide</a> — the coastal base behind Elmina Castle.</li>
<li><a href="/attractions/cape-coast-kakum/">Cape Coast Kakum attraction guide</a> — the two-day castle-plus-canopy pacing in detail.</li>
<li><a href="/attractions/elmina-castle/">Elmina Castle attraction guide</a> — guided interpretation and visitor perspectives.</li>
<li><a href="/attractions/kwame-nkrumah-memorial-park/">Kwame Nkrumah Memorial Park attraction guide</a> — the Accra arrival pairing.</li>
<li><a href="/accommodations/accra-city-hotel/">Accra City Hotel</a>, <a href="/accommodations/ridge-royal-hotel/">Ridge Royal Hotel</a> and <a href="/accommodations/lemon-beach-resort-elmina/">Lemon Beach Resort</a> — the three stay guides with verified booking options.</li>
</ul>

<h2>Sources and scope</h2>
<p>Entry, health and safety facts come from the UK FCDO Ghana travel advice (entry requirements, safety and security; advice page updated 4 November 2026, still current 13 November 2026). Currency, electricity, SIM, tipping and card-acceptance basics come from the Ghana Tourism Authority's official travel information and getting-around pages. Seasonal patterns, the four-hour Accra–Kakum indicative drive and the castle pacing quotes are carried from this guide's own Ghana country and Cape Coast Kakum attraction pages, which source Ghana's tourism seasonal guidance. No rates, tour prices, schedules or safety guarantees are printed here; every confirmable item is hedged to its source. This guide links three stay pages that each carry a verified booking option; no new booking links were created for this story.</p>`;

const maxSort = Math.max(...o.travel_articles.map((t) => Number(t.sort_order) || 0));

const entry = {
  slug: SLUG,
  title: 'Plan a first Ghana trip: Accra arrival and the Cape Coast–Elmina castle circuit',
  category: 'Practical travel',
  region: 'West Africa',
  country: 'Ghana',
  excerpt: 'Build a first Ghana trip around the visa timeline, a first-night Accra base, and a paced Cape Coast–Elmina castle circuit with Kakum on its own morning — the decisions that shape the whole journey.',
  read_time: '8 min read',
  hero_image_url: `${DIR}/accra-independence-arch-sunset-2023.jpg`,
  hero_image_alt: 'The Independence Arch in Accra photographed at sunset.',
  status: 'published',
  published_at: '2026-11-13',
  featured: false,
  sort_order: maxSort + 1,
  last_researched: '2026-11-13',
  source_url: 'https://www.gov.uk/foreign-travel-advice/ghana',
  research_sources: [
    {
      label: 'UK FCDO Foreign Travel Advice, Ghana — warnings and insurance: advises against all but essential travel to Bawku Municipal area (Upper East region) only; advice updated 4 November 2026, still current 13 November 2026; checked 13 November 2026',
      url: 'https://www.gov.uk/foreign-travel-advice/ghana',
      checked_at: '2026-11-13'
    },
    {
      label: 'UK FCDO Ghana entry requirements — visa required; online application 10–15 days processing, express ~3-day in-person premium centre; passport expiry at least 6 months after arrival; yellow fever certificate required to enter; online Ghana Health Declaration before travel plus border screening; declare hard currency on arrival, do not carry foreign cash of 10,000 USD value or more; checked 13 November 2026',
      url: 'https://www.gov.uk/foreign-travel-advice/ghana/entry-requirements',
      checked_at: '2026-11-13'
    },
    {
      label: 'UK FCDO Ghana safety and security — street crime increasing in Accra, confirm airport driver identity, avoid road travel outside main towns after dark and prefer daylight for longer trips, beaches dangerous to swim due to rip tides, demonstrations leave the area, keep cards in sight, Mastercard not widely accepted with back-up funds advised; checked 13 November 2026',
      url: 'https://www.gov.uk/foreign-travel-advice/ghana/safety-and-security',
      checked_at: '2026-11-13'
    },
    {
      label: 'Ghana Tourism Authority official travel information — visas required by most non-residents except ECOWAS nationals, Visa and Mastercard accepted in major establishments, cedi currency and forex bureaus, 220/240V British/European outlets, SIM with valid passport, tipping permitted, medical facilities in cities and big towns; checked 13 November 2026',
      url: 'https://visitghana.com/travel-information/',
      checked_at: '2026-11-13'
    },
    {
      label: 'Ghana Tourism Authority official getting-around-ghana page — international airlines serving Ghana, cedi denominations, tropical climate description, packing light cotton clothing and comfortable walking shoes; checked 13 November 2026',
      url: 'https://visitghana.com/getting-around-ghana/',
      checked_at: '2026-11-13'
    },
    {
      label: 'Trek Africa Guide internal cluster (live HTTP 200, 13 November 2026) — /countries/ghana/ ("Ghana is one of West Africa\'s easiest entry points…", wetter April–June and September–mid-November pattern), /attractions/cape-coast-kakum/ ("Our suggested pacing is a Cape Coast Castle visit on one day and Kakum on another…", Visit Ghana indicative ~4h Accra–Kakum drive), /countries/ghana/elmina/, /attractions/elmina-castle/, /attractions/kwame-nkrumah-memorial-park/, /accommodations/accra-city-hotel/, /accommodations/ridge-royal-hotel/, /accommodations/lemon-beach-resort-elmina/; verbatim quotes carried with backlinks',
      url: 'https://trekafricaguide.com/countries/ghana/',
      checked_at: '2026-11-13'
    }
  ],
  meta_title: 'Plan a first Ghana trip: Accra arrival and the Cape Coast–Elmina castle circuit',
  meta_description: 'Build a first Ghana trip around the visa timeline, a first-night Accra base, and a paced Cape Coast–Elmina castle circuit with Kakum on its own morning.',
  body
};

o.travel_articles.push(entry);
fs.writeFileSync(overridesPath, JSON.stringify(o, null, 1) + '\n');
console.log('travel_articles entry added:', SLUG, 'total:', o.travel_articles.length);

// ---- photo-library entries ----
const photos = [
  {
    key: 'accra-independence-arch-sunset-2023.jpg',
    slug: 'accra-independence-arch-sunset-2023',
    source_page: 'https://commons.wikimedia.org/wiki/File:Independence_arch_at_sunset_2.jpg',
    creator: 'Kwameghana (Bright Kwame Ayisi)', license: 'CC0 1.0',
    license_url: 'https://commons.wikimedia.org/wiki/File:Independence_arch_at_sunset_2.jpg',
    captured_at: '2023-10-08',
    sha256: '2bcd120cde76dc22c8ae5c1db2da83b00d6cf2bd873f2fec76a2defae68a5bf7',
    subject: 'Independence Arch and Black Star Square, Accra, at sunset',
    alt: 'The Independence Arch in Accra photographed at sunset.',
    caption: 'The Independence Arch at sunset (Kwameghana / Bright Kwame Ayisi, CC0 via Wikimedia Commons).',
    requires_attribution: false,
    evidence: 'Commons file description identifies Independence Arch, Accra; public-domain (CC0) metadata and original file checked on 2026-11-13.'
  },
  {
    key: 'cape-coast-castle-2011.jpg',
    slug: 'cape-coast-castle-2011',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cape_Coast_Castle,_Cape_Coast,_Ghana.JPG',
    creator: 'Rjruiziii', license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0/',
    captured_at: '2011-06-26',
    sha256: '4d62e2c223fb19154dee8d7d9523894aa0c9e2eb6950031b891dd4b3094141b4',
    subject: 'Cape Coast Castle exterior, Cape Coast, Central Region, Ghana',
    alt: 'The white exterior walls of Cape Coast Castle seen from the sea side.',
    caption: 'The sea-side walls of Cape Coast Castle (Rjruiziii, CC BY-SA 3.0 via Wikimedia Commons).',
    requires_attribution: true,
    evidence: 'Commons file description identifies Cape Coast Castle, Ghana; CC BY-SA 3.0 metadata and original file checked on 2026-11-13.'
  },
  {
    key: 'kakum-canopy-walkway-2022.jpg',
    slug: 'kakum-canopy-walkway-2022',
    source_page: 'https://commons.wikimedia.org/wiki/File:Canopy_walkway_in_Kakum_National_Park_2.jpg',
    creator: 'daSupremo', license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    captured_at: '2022-11-23',
    sha256: 'b8d959aff2d4c99d61676735d769593a389c4d5a13a2eec05e9e2184b3d87330',
    subject: 'Kakum National Park canopy walkway above the rainforest, Central Region, Ghana',
    alt: 'The suspended canopy walkway at Kakum National Park crossing above the rainforest.',
    caption: 'The canopy walkway at Kakum National Park (daSupremo, CC BY-SA 4.0 via Wikimedia Commons).',
    requires_attribution: true,
    evidence: 'Commons file description identifies the canopy walkway in Kakum National Park; CC BY-SA 4.0 metadata and original file checked on 2026-11-13.'
  },
  {
    key: 'elmina-castle-2023.jpg',
    slug: 'elmina-castle-2023',
    source_page: 'https://commons.wikimedia.org/wiki/File:Castle,_Elmina_(P1100187).jpg',
    creator: 'Matti Blume', license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    captured_at: '2023-02-09',
    sha256: 'aa9d7bab0288fd58ecc52de88d89cf5ebdd37df026992d691473af7636e0dcc3',
    subject: "Elmina Castle (St George's Castle), Elmina, Central Region, Ghana",
    alt: 'The whitewashed walls and bastions of Elmina Castle, Ghana.',
    caption: "The walls and bastions of Elmina Castle (Matti Blume, CC BY-SA 4.0 via Wikimedia Commons).",
    requires_attribution: true,
    evidence: 'Commons file description identifies Elmina Castle, Ghana; CC BY-SA 4.0 metadata and original file checked on 2026-11-13.'
  },
  {
    key: 'kwame-nkrumah-memorial-park-2008.jpg',
    slug: 'kwame-nkrumah-memorial-park-2008',
    source_page: 'https://commons.wikimedia.org/wiki/File:Kwame_Nkrumah_Memorial_Park.jpg',
    creator: 'Erik B. Anderson', license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    captured_at: '2008-10-10',
    sha256: '291ac1edc482dacc50fed7b115f7691217cec7c4c118ac911669881adacd49f0',
    subject: 'Kwame Nkrumah Memorial Park and mausoleum, Accra, Ghana',
    alt: 'The fountains and mausoleum of the Kwame Nkrumah Memorial Park in Accra.',
    caption: 'The Kwame Nkrumah Memorial Park fountains and mausoleum (Erik B. Anderson, CC BY-SA 4.0 via Wikimedia Commons).',
    requires_attribution: true,
    evidence: 'Commons file description identifies Kwame Nkrumah Memorial Park, Accra; CC BY-SA 4.0 metadata and original file checked on 2026-11-13.'
  },
  {
    key: 'jamestown-lighthouse-2017.jpg',
    slug: 'jamestown-lighthouse-2017',
    source_page: 'https://commons.wikimedia.org/wiki/File:Jamestown_Lighthouse_20170122.jpg',
    creator: 'Gereon K.', license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    captured_at: '2017-01-22',
    sha256: 'da1649b79fb43b6db74c9e93ae3e13b8dab7e1a4cf48cd8bcec91afc6212807c',
    subject: 'Jamestown Lighthouse, Accra old town, Ghana',
    alt: 'The red-and-white Jamestown Lighthouse in Accra’s old fishing quarter.',
    caption: "The Jamestown Lighthouse in Accra's old quarter (Gereon K., CC BY-SA 4.0 via Wikimedia Commons).",
    requires_attribution: true,
    evidence: 'Commons file description identifies Jamestown Lighthouse, Accra; CC BY-SA 4.0 metadata and original file checked on 2026-11-13.'
  }
];

function buildEntry(p) {
  const path = `/images/editorial/plan-first-ghana-trip/${p.key}`;
  return JSON.stringify({
    slug: p.slug, local_path: path,
    source_page: p.source_page, creator: p.creator, license: p.license, license_url: p.license_url,
    captured_at: p.captured_at, sha256: p.sha256,
    exact_subject: true, subject: p.subject, alt: p.alt, caption: p.caption,
    property: false, kind: 'photograph', requires_attribution: p.requires_attribution,
    changes: 'Original Commons JPEG; no edits.', checked_at: '2026-11-13',
    exact_subject_evidence: p.evidence
  }, null, 0).replace(/\n\s*/g, ' ');
}

const libPath = 'src/lib/photo-library.js';
let lib = fs.readFileSync(libPath, 'utf8');
const marker = '"images": {';
if (!lib.includes(marker)) { console.error('marker missing'); process.exit(1); }
const entries = photos.map((p) => `    ${buildEntry(p)},`).join('\n');
lib = lib.replace(/"updated_at": "(\d{4}-\d{2}-\d{2})"/, '"updated_at": "2026-11-13"');
lib = lib.replace(marker, marker + '\n' + entries);
fs.writeFileSync(libPath, lib);
console.log('photo-library entries inserted:', photos.length);

// validate both parse
const text = lib.replace('export const photoLibrary =', 'module.exports.photoLibrary =');
const mod = { exports: {} };
new Function('module', 'exports', text)(mod, mod.exports);
const count = Object.keys(mod.exports.photoLibrary.images).length;
console.log('parsed photo-library OK, images:', count);
