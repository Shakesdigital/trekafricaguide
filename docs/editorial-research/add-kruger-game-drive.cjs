const fs = require('fs');

// ---- 1. Activity record into editorial-overrides.json ----
const p = 'content/editorial-overrides.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));
if (o.activities.some(a => a.slug === 'kruger-national-park-game-drive')) throw new Error('activity exists');
const maxSort = Math.max(...o.activities.map(a => a.sort_order || 0));
const rec = {
  slug: 'kruger-national-park-game-drive',
  attraction_id: 55,
  name: 'Kruger National Park game drive',
  location_name: 'Kruger National Park, South Africa',
  listing_summary: 'Explore Kruger from your own vehicle or on an organised game drive: SANParks presents self-drive as the core of the flagship park, with gate hours, day-visitor limits and rest-camp rules that decide how a drive day actually runs.',
  detail_intro: "The game drive is Kruger's core experience, and SANParks \u2014 the park's own management authority \u2014 describes a park where visitors explore in their own vehicles or stay at public rest camps, alongside exclusive private lodges. That makes Kruger unusual among big-name safari destinations: the same park supports a self-drive day in a hired car, a SANParks or private-operator open-vehicle drive, and multi-day lodge-based trips. Which one fits depends on the base you choose, the gate you enter and the day-visitor limits that can apply at peak times.\n\nThis guide covers how SANParks frames the options, what the gate-hours table and day-visit rules mean for your day, and what to confirm before you commit. It complements the published Kruger attraction guide, which covers the wider park picture; here the focus is the driving itself.",
  full_description: "<p>SANParks calls Kruger \u201ctruly the flagship\u201d of the South African national parks: nearly two million hectares established in 1898, with 12 main rest camps, 5 bushveld camps, 2 bush lodges and 4 satellite camps, and visitors who can explore the park in their own vehicles. The authority's own summary counts 147 mammal and 507 bird species, alongside cultural sites such as Masorini and Thulamela. That combination \u2014 scale, self-drive access and fixed infrastructure \u2014 is what a Kruger game drive day is built on.</p><h3>Self-drive: the park's own model</h3><p>Two things separate a Kruger self-drive day from other parks. First, the road network is the product: sightings happen along it, and the pace is yours \u2014 SANParks' material and the park's published <a href=\"/attractions/kruger-national-park\">Kruger attraction guide</a> both stress choosing a manageable area rather than a long cross-park route. Second, the rules are enforced at the gate: SANParks requires a completed Gate Registration and Indemnity Form handed to the gate official with identification for South African, SADC and international visitors, and every gate has seasonal closing hours that no sighting earns an exemption from.</p><h3>Guided drives: SANParks and private operators</h3><p>Guided open-vehicle drives are the alternative for travellers without a suitable car or self-drive confidence. SANParks' game-drive activities run from camp areas \u2014 its game-drive page describes morning drives leaving about half an hour before official gate opening, running three to three and a half hours \u2014 and private operators sell full-day guided drives that collect guests at lodges or park gates. A guided drive moves the navigation, timing and animal-spotting work to a local guide; it does not remove the park rules, conservation fees or gate logistics.</p><h3>Gates, hours and the day-visitor cap</h3><p>SANParks' day-visit rules shape every non-resident's drive day. Day visitors are welcome, but the authority caps daily entries, and once that threshold is reached only guests with pre-booked overnight accommodation get in \u2014 a situation SANParks says arises mainly on public holidays and long weekends. Advance online bookings for day visits must be paid before the deposit due date, and one-day bookings pay when the booking is made. Gate hours themselves change by month: entrance opens at 05:30 in November, runs 05:30\u201306:00 across the year, and all gates close between 17:30 and 18:30 depending on the month. A current operational note matters this month: SANParks says the Skukuza Rest Camp Main Gate will be temporarily closed from 2 November to 4 December 2026 for maintenance.</p><h3>Where to base the day</h3><p>Days work best from a camp inside the park. Main rest camps have dedicated day-visitor areas, and SANParks distributes picnic sites and get-out points through the reserve \u2014 Skukuza's riverfront viewing above the Sabie and the Lake Panic area near it are the classic examples. Guests without an overnight booking plan their route from an entrance gate instead. The published <a href=\"/accommodations/kruger-shalati\">Kruger Shalati stay guide</a> covers one way to sleep on the Selati Bridge at Skukuza; camp pricing and availability go through SANParks reservations.</p><h3>Who a game drive suits</h3><p>SANParks frames the search around its own lists: the Big Five \u2014 buffalo, elephant, leopard, lion and rhino \u2014 plus the Little Five, a Birding Big Six and five characteristic trees. Self-drive rewards patience and route discipline; guided drives suit travellers who want the spotting done for them and who are comfortable paying for it. Both end at the same boundary: gate closing time, camp rules and the reality that a public-entry park shares its roads with everyone else who booked that day.</p>",
  highlights: [
    'SANParks presents Kruger as a public-entry park where visitors explore in their own vehicles \u2014 self-drive is the core product, not an add-on',
    'Twelve main rest camps, five bushveld camps, two bush lodges and four satellite camps sit inside the park, so base choice decides the drive day',
    'Every day runs inside seasonal gate hours: entrance opens 05:30\u201306:00 by month and all gates close between 17:30 and 18:30',
    'SANParks\u2019 own Big Five list \u2014 buffalo, elephant, leopard, lion, rhino \u2014 frames the search, with day-visitor caps at peak times'
  ],
  best_time: "<p>SANParks publishes a month-by-month gate table rather than promising a season: entrance opens at 05:30 in November and the summer months, shifts to 06:00 between April and September, and gate closing moves between 17:30 and 18:30. Peak windows \u2014 public holidays and long weekends \u2014 are when the daily visitor threshold can exclude non-resident day guests, so the authority's advance-booking advice matters most then. Kruger sits in a malaria-endemic area, and SANParks asks visitors to consult a travel doctor before their trip. Confirm gate hours, day-visit booking rules and any notices such as the Skukuza Main Gate maintenance closure (2 November to 4 December 2026) close to your travel date.</p>",
  practical_info: '<h3>Confirm before you go</h3><ul><li>Entry: SANParks requires the Gate Registration and Indemnity Form, completed before arrival, handed to the gate official with identification (ID or passport) for South African, SADC and international visitors.</li><li>Day-visit booking: reserve online in advance; pre-booked day visits must be paid on or before the deposit due date, and guests booking one day ahead pay when booking. When the daily threshold is reached, only pre-booked overnight guests get in.</li><li>Gate hours: check the seasonal table \u2014 entrance opens 05:30 or 06:00 by month, and all gates close between 17:30 and 18:30. Do not plan a route that assumes late arrivals.</li><li>Rules: remain in your vehicle except at designated get-out points and day-visitor areas, and respect camp times \u2014 the park\u2019s published Kruger attraction guide carries the same SANParks summary.</li><li>Guided drives: SANParks\u2019 morning drives leave about half an hour before official gate opening and run roughly three to three and a half hours; private operators set their own pickup points and durations \u2014 confirm both before paying.</li><li>Health: Kruger is a malaria-endemic area; SANParks advises consulting a travel doctor, and notes that resident doctors are based at Skukuza (phone +27 13 735 5638) for visitors who fall ill in the park.</li><li>Current notices: the Skukuza Rest Camp Main Gate is temporarily closed 2 November to 4 December 2026 for maintenance \u2014 check SANParks\u2019 notifications page for your dates.</li></ul><p>Conservation fees, Wild Card annual passes and any operator pricing change: confirm current rates with SANParks or your operator before the day. No price is quoted on this page.</p>',
  hero_image_url: null,
  hero_image_alt: '',
  gallery: [],
  booking_url: null,
  source_url: 'https://www.sanparks.org/parks/kruger/',
  status: 'published',
  published_at: '2026-11-09',
  featured: false,
  sort_order: maxSort + 1,
  last_researched: '2026-11-09',
  research_sources: [
    {
      label: 'SANParks Kruger National Park overview \u2014 flagship park, nearly two million hectares, established 1898, visitors explore in own vehicles, 12 main rest camps / 5 bushveld camps / 2 bush lodges / 4 satellite camps, 147 mammals and 507 birds, malaria-endemic-area alert with Skukuza resident doctors and phone, Skukuza Main Gate temporary closure 2 Nov\u20134 Dec 2026; checked 9 November 2026',
      url: 'https://www.sanparks.org/parks/kruger/',
      checked_at: '2026-11-09'
    },
    {
      label: 'SANParks Kruger day-visits page \u2014 day visitors welcome, day-visitor areas at main rest camps, daily visitor threshold with overnight-guest priority at peak times, advance bookings and payment rules, Wild Card, month-by-month gate-hours table, Gate Registration and Indemnity Form requirement with ID/passport, Skukuza and Letaba day-visitor pools, Big Five / Little Five / Birding Big Six / Five Trees lists; checked 9 November 2026',
      url: 'https://www.sanparks.org/parks/kruger/what-to-do/day-visits',
      checked_at: '2026-11-09'
    },
    {
      label: 'SANParks Kruger game-drives page \u2014 morning drives leave about half an hour before official gate opening and run 3\u20133.5 hours; direct fetch returned HTTP 403, so the framework was retrieved via the search-index snippet of the official SANParks URL; checked 9 November 2026',
      url: 'https://www.sanparks.org/parks/kruger/what-to-do/activities/game-drives',
      checked_at: '2026-11-09'
    },
    {
      label: 'GetYourGuide exact product verification \u2014 "Kruger National Park: Full-Day Game Drive with Pick-up" (Inn Africa Camp & Tours), confirmed live in the search index with matching title and Big-5 open-vehicle description on 9 November 2026; rating and review count kept from the 11 October 2026 record',
      url: 'https://www.getyourguide.com/en-gb/skukuza-l192363/kruger-national-park-full-day-game-drive-with-pickup-t433574/',
      checked_at: '2026-11-09'
    },
    {
      label: 'Trek Africa Guide published Kruger attraction guide \u2014 rule summary (remain in vehicles except at designated places, respect camp times) and gate/route framing; checked on the live page this run',
      url: 'https://trekafricaguide.com/attractions/kruger-national-park/',
      checked_at: '2026-11-09'
    }
  ],
  meta_description: 'Plan a Kruger National Park game drive: SANParks\u2019 self-drive-first park model, gate hours and day-visitor caps, guided-drive options and what to confirm before the day.'
};
o.activities.push(rec);
fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('activity added, total', o.activities.length);

// ---- 2. Booking destination ----
const bp = 'content/booking-destinations.json';
const b = JSON.parse(fs.readFileSync(bp, 'utf8'));
if (b.activities['kruger-national-park-game-drive']) throw new Error('booking entry exists');
b.activities['kruger-national-park-game-drive'] = {
  url: 'https://www.getyourguide.com/en-gb/skukuza-l192363/kruger-national-park-full-day-game-drive-with-pickup-t433574/',
  provider: 'getyourguide',
  title: 'Kruger National Park: Full-Day Game Drive with Pickup',
  operator: 'Inn Africa Camp & Tours- Game drives',
  rating: 4.5,
  review_count: 166,
  notes: 'Full-day open-vehicle game drive. Confirm the pickup area; food and park conservation fees are extra.',
  checked_at: '2026-10-11',
  status: 'active',
  verification_note: 'Exact product re-verified live in search index 2026-11-09 (title and Big-5 open-vehicle description match); direct platform fetch automation-blocked, so no rate or availability claim is made.'
};
fs.writeFileSync(bp, JSON.stringify(b, null, 2) + '\n');
console.log('booking destination added');

// ---- 3. photo-library.js: image entries + activities page map ----
const plp = 'src/lib/photo-library.js';
let src = fs.readFileSync(plp, 'utf8');

const images = [
  {
    slug: 'kruger-game-drive-gravel-road-eason-2017',
    file: 'kruger-gravel-road-eason-2017.jpg',
    sha256: '7d785e59260e8bcdc22d1bc5a617e3eb5c93f07f1a765b8a09104448fae88319',
    commons: 'https://commons.wikimedia.org/wiki/File:Road_view_(393904639).jpg',
    rev: '64797621',
    creator: 'Chris Eason',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    inlineLicenseUrl: true,
    date: '2017-12-13',
    subject: 'A straight tarred road through Kruger National Park bushveld',
    alt: 'A long, straight tarred road runs through Kruger National Park bushveld under a partly cloudy sky.',
    caption: 'Park roads are the core of a self-drive day; this source photograph shows a tarred road in Kruger National Park, not current road conditions.',
    evidence: 'Commons file "Road view" is categorised under Roads in Kruger National Park; visual inspection confirms a tarred park road with Lowveld bushveld and no buildings.',
    capture: '2017-12-13 upload on Commons; capture date not stated.'
  },
  {
    slug: 'kruger-game-drive-evening-drive-eason-2017',
    file: 'kruger-evening-drive-skukuza-eason-2017.jpg',
    sha256: 'ede695f5b8dc422ff2bf21eeacc6ba3752138fc93c6e76b3b89641b691c72249',
    commons: 'https://commons.wikimedia.org/wiki/File:Evening_drive_from_Skukuza_(196142707).jpg',
    rev: '64798201',
    creator: 'Chris Eason',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    inlineLicenseUrl: true,
    date: '2017-12-13',
    subject: 'Passengers in an open-sided game-drive vehicle on a Kruger gravel track',
    alt: 'Passengers ride an open-sided game-drive vehicle along a gravel track between green bush in Kruger National Park.',
    caption: 'A guided drive from the Skukuza side; the source photograph shows an organised game-drive vehicle in Kruger National Park.',
    evidence: 'Commons file title names an evening drive from Skukuza, Kruger National Park; visual inspection confirms an open-sided safari vehicle with passengers on a gravel track.',
    capture: '2017-12-13 upload on Commons; capture date not stated.'
  },
  {
    slug: 'kruger-game-drive-road-home-eason-2017',
    file: 'kruger-road-home-eason-2017.jpg',
    sha256: '18cb7428b1aa707fcfcc55a21529ec9050428776fc5cd95fcdf4cff66e3c3436',
    commons: 'https://commons.wikimedia.org/wiki/File:The_Road_Home_(3692687229).jpg',
    rev: '64796489',
    creator: 'Chris Eason',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    inlineLicenseUrl: true,
    date: '2017-12-13',
    subject: 'A curving Kruger park road past a posted 50 speed-limit sign',
    alt: 'A tarred road curves past a round posted 50 speed-limit sign through dry golden grass in Kruger National Park.',
    caption: 'Speed limits are posted along Kruger\u2019s roads; this source photograph shows a signed winding section, not current conditions.',
    evidence: 'Commons file categorised under Roads in Kruger National Park; visual inspection confirms a winding tarred road with a posted 50 sign \u2014 the figure shown is the sign in the photograph, not a claimed park-wide limit.',
    capture: '2017-12-13 upload on Commons; capture date not stated.'
  },
  {
    slug: 'kruger-game-drive-skukuza-lunch-eason-2017',
    file: 'kruger-skukuza-lunch-eason-2017.jpg',
    sha256: '1374ecac844b93a8289ec4b79c8f7e4bca59864972406e7b4dc883ea254b7bfe',
    commons: 'https://commons.wikimedia.org/wiki/File:Lunch_at_Skukuza_(208372820).jpg',
    rev: '64798066',
    creator: 'Chris Eason',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    inlineLicenseUrl: true,
    date: '2017-12-13',
    subject: 'Vervet monkeys along a fence at the Skukuza day-visitor area beside the Sabie',
    alt: 'Vervet monkeys sit along a wooden fence rail at the Skukuza day-visitor area beside the Sabie River in Kruger National Park.',
    caption: 'A midday stop at a designated get-out point; the source photograph shows the Skukuza day-visitor terraces and their resident vervet monkeys.',
    evidence: 'Commons file title names Lunch at Skukuza; visual inspection confirms a thatched day-visitor area, riverfront and monkeys at a fenced terrace inside Kruger National Park.',
    capture: '2017-12-13 upload on Commons; capture date not stated.'
  },
  {
    slug: 'kruger-game-drive-skukuza-camp-flowcomm-2017',
    file: 'kruger-skukuza-camp-flowcomm-2017.jpg',
    sha256: '3f5ebdf05efd908711f00a7224bfc100cff35d668ff20aee8ece6461e755f5e2',
    commons: 'https://commons.wikimedia.org/wiki/File:Skukuza_camp,_Kruger_National_Park_(10900778066).jpg',
    rev: '64794088',
    creator: 'flowcomm',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    inlineLicenseUrl: true,
    date: '2017-12-13',
    subject: 'Visitors watching the Sabie River from Skukuza rest camp with the old railway bridge',
    alt: 'Visitors watch the Sabie River from a fenced viewing point at Skukuza rest camp, with the old steel railway bridge crossing the river.',
    caption: 'A rest-camp riverfront stop between drives; the source photograph shows the Sabie River, the historic Skukuza rail bridge and camp visitors.',
    evidence: 'Commons file title names Skukuza camp, Kruger National Park; visual inspection confirms a fenced river viewing point and a steel truss rail bridge recognizable at Skukuza.',
    capture: '2017-12-13 upload on Commons; capture date not stated.'
  },
  {
    slug: 'kruger-game-drive-lake-panic-dupont-2021',
    file: 'kruger-lake-panic-dupont-2021.jpg',
    sha256: 'bc93703183107aa5314ea19e5109911430bc26b59c4c5c761de1a5683a0bce9b',
    commons: 'https://commons.wikimedia.org/wiki/File:Lake_Panic_(33565241945).jpg',
    rev: '112560566',
    creator: 'Bernard DUPONT',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    inlineLicenseUrl: true,
    date: '2021-11-16',
    subject: 'Water lilies spread across Lake Panic in Kruger National Park',
    alt: 'Water lilies spread across Lake Panic beside reeds and a leafless tree in Kruger National Park.',
    caption: 'A slower get-out point between drives; the source photograph shows Lake Panic as a waterline landscape, not a wildlife sighting.',
    evidence: 'Commons file title names Lake Panic; visual inspection confirms lily-covered water, reeds and bushveld; the file sits in the Bernard DUPONT Kruger image set.',
    capture: '2021-11-16 upload on Commons; capture date not stated.'
  }
];

let imgBlock = '';
for (const im of images) {
  imgBlock += '    "/images/editorial/kruger-game-drive/' + im.file + '": {\n';
  imgBlock += '      "slug": "' + im.slug + '",\n';
  imgBlock += '      "local_path": "/images/editorial/kruger-game-drive/' + im.file + '",\n';
  imgBlock += '      "source_page": "' + im.commons + '",\n';
  imgBlock += '      "source_revision": "' + im.rev + '",\n';
  imgBlock += '      "creator": "' + im.creator + '",\n';
  imgBlock += '      "license": "' + im.license + '",\n';
  imgBlock += '      "license_url": "' + im.licenseUrl + '",\n';
  imgBlock += '      "source_published_at": "' + im.date + '",\n';
  imgBlock += '      "captured_at": null,\n';
  imgBlock += '      "sha256": "' + im.sha256 + '",\n';
  imgBlock += '      "exact_subject": true,\n';
  imgBlock += '      "subject": ' + JSON.stringify(im.subject) + ',\n';
  imgBlock += '      "alt": ' + JSON.stringify(im.alt) + ',\n';
  imgBlock += '      "caption": ' + JSON.stringify(im.caption) + ',\n';
  imgBlock += '      "property": false,\n';
  imgBlock += '      "kind": "photograph",\n';
  imgBlock += '      "requires_attribution": true,\n';
  imgBlock += '      "attribution_notice": "' + im.creator + ' (' + im.license + ') via Wikimedia Commons; the page gallery credits the creator and licence.",\n';
  imgBlock += '      "changes": "Downloaded from Wikimedia Commons and resized to a maximum width of 1,800 pixels with aspect ratio preserved, then re-encoded as JPEG quality 85; no other edits.",\n';
  imgBlock += '      "checked_at": "2026-11-09",\n';
  imgBlock += '      "exact_subject_evidence": ' + JSON.stringify(im.evidence) + ',\n';
  imgBlock += '      "reuse_note": ' + JSON.stringify(im.license + ' permits reuse with attribution and' + (im.license.includes('SA') ? ', for this share-alike licence, licensing of derivative works under the same terms; ' : ' ') + 'the page gallery credits the creator and licence.') + '\n';
  imgBlock += '    },\n';
}
const imgAnchor = '  },\n  "listings": {';
if (!src.includes(imgAnchor)) throw new Error('images anchor not found');
src = src.replace(imgAnchor, imgBlock.slice(0, -2) + '\n  },\n  "listings": {');

const galleryPaths = images.map(im => '"/images/editorial/kruger-game-drive/' + im.file + '"').join(',\n          ');
const pageBlock = '      "kruger-national-park-game-drive": {\n'
  + '        "hero_image_url": "/images/editorial/kruger-game-drive/kruger-evening-drive-skukuza-eason-2017.jpg",\n'
  + '        "hero_image_alt": "Passengers ride an open-sided game-drive vehicle along a gravel track in Kruger National Park.",\n'
  + '        "replaces": [],\n'
  + '        "gallery": [\n          ' + galleryPaths + '\n        ]\n'
  + '      }\n';
const pageAnchor = '      }\n    },\n    "accommodations": {';
if (!src.includes(pageAnchor)) throw new Error('activities page-map anchor not found');
src = src.replace(pageAnchor, '      },\n' + pageBlock + '    },\n    "accommodations": {');

fs.writeFileSync(plp, src);
console.log('photo-library updated');

// ---- 4. Ledger ----
fs.mkdirSync('docs/editorial-research', { recursive: true });
fs.writeFileSync('docs/editorial-research/2026-11-09-kruger-game-drive.md', `# 2026-11-09 — Kruger National Park game drive (activity)

## Content gap (evidence)
- Live URL: https://trekafricaguide.com/attractions/kruger-national-park/ — the page headlines "The public park supports self-drive visits, rest-camp stays and guided activities" but no /activities/ guide covers Kruger's core outing; its only booking attachment is a third-party full-day game-drive CTA, and its Related-activities rail is empty of any Kruger activity.
- None of the 19 published activities covers Kruger; nearest are Amboseli game drive and Maasai Mara balloon (different parks).
- Reader impact: a searcher landing on the Kruger attraction page or the activities archive cannot start here for the park's headline experience.
- Category: activities (rotation re-enters here after the Maun destination run; accommodations inventory was re-checked this run and all 32 published accommodations in the override ledger render live).

## Sources
- SANParks Kruger overview: https://www.sanparks.org/parks/kruger/ (fetched 2026-11-09)
- SANParks day visits: https://www.sanparks.org/parks/kruger/what-to-do/day-visits (fetched 2026-11-09)
- SANParks game drives: https://www.sanparks.org/parks/kruger/what-to-do/activities/game-drives direct fetch 403; framework (morning drives ~half an hour before gate opening, 3–3.5 h) taken from the search-index snippet of this official URL
- SANParks parks page for first-viewers of gate/conservation context: https://www.sanparks.org/parks/kruger/#What_To_Do
- GetYourGuide exact product: https://www.getyourguide.com/en-gb/skukuza-l192363/kruger-national-park-full-day-game-drive-with-pickup-t433574/ — search-verified live 2026-11-09; rating data from the site's 2026-10-11 record (4.5/5, 166 reviews)
- Published Kruger attraction guide: https://trekafricaguide.com/attractions/kruger-national-park/

## Photographs (6, all Wikimedia Commons, creator/licence recorded per image in photo-library)
1. kruger-gravel-road-eason-2017.jpg — Chris Eason, CC BY 2.0, Commons Road_view_(393904639).jpg
2. kruger-evening-drive-skukuza-eason-2017.jpg — Chris Eason, CC BY 2.0, Commons Evening_drive_from_Skukuza_(196142707).jpg (hero)
3. kruger-road-home-eason-2017.jpg — Chris Eason, CC BY 2.0, Commons The_Road_Home_(3692687229).jpg
4. kruger-skukuza-lunch-eason-2017.jpg — Chris Eason, CC BY 2.0, Commons Lunch_at_Skukuza_(208372820).jpg
5. kruger-skukuza-camp-flowcomm-2017.jpg — flowcomm, CC BY 2.0, Commons Skukuza_camp,_Kruger_National_Park_(10900778066).jpg
6. kruger-lake-panic-dupont-2021.jpg — Bernard DUPONT, CC BY-SA 2.0, Commons Lake_Panic_(33565241945).jpg
All six: downloaded from Commons 2026-11-09, resized to max 1,800 px wide (JPEG q85), SHA-256 recorded, subject-checked visually. Distinct from the attraction page's seven existing Kruger images. Candidate rejected: the Skukuza stone clock tower (flowcomm, 2020) as off-subject for a game-drive guide.

## Booking
- booking-destinations.activities['kruger-national-park-game-drive'] → exact GetYourGuide product t433574, status active, served via Stay22 resolver by the standard booking module.
`);
console.log('ledger written');
