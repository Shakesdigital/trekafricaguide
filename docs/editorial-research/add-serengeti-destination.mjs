// Add the Serengeti local destination record + photo-library entries. Run: node docs/editorial-research/add-serengeti-destination.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const root = process.cwd();
const record = {
  slug: 'serengeti',
  country_slug: 'tanzania',
  name: 'Serengeti',
  category: 'Park and plains',
  hero_title: 'Serengeti: choosing your time in the endless plains',
  listing_summary: 'Plan a Serengeti stay around one region, the season you actually need, and the transfers that make the distances workable.',
  overview: 'Serengeti National Park is a large, changing wildlife landscape rather than a single viewpoint, and UNESCO describes its 1.5 million hectares of savannah as the stage for the largest remaining unaltered animal migration on earth. Grasslands, river corridors, woodlands and rocky outcrops (kopjes) give different parts of the park their own character, so the real planning decision is which region, in which month, for how long.\n\nThe published Serengeti National Park attraction guide explains the park as a whole and its visitor activities. This guide helps you organize a stay inside or beside it: matching your base to the season you need, keeping the distances realistic, and separating what your camp charges from what the park, the airstrip and optional activities charge.\n\nA visit does not need to chase the migration to succeed. Resident wildlife in the Seronera valley and the kopjes rewards a slower stay in any month, and UNESCO lists the park\u2019s predator and ungulate populations among the highest concentrations in the world. Treat the movement of the herds as one interest among several, not the only measure of a good trip.',
  highlights: [
    'Wildlife viewing across plains, river country and kopjes in one park',
    'Seasonal migration and calving interest, verified against your dates',
    'Optional balloon excursions with verified operators',
    'A published in-park stay with its own full property guide'
  ],
  access_summary: 'The park sits in northern Tanzania, and UNESCO records its property area as 1,476,300 hectares with Mara, Arusha and Shinyanga provinces around it. TANAPA identifies Arusha and Kilimanjaro as the principal planning gateways; from there, road itineraries and light-aircraft itineraries trade cost, time and baggage limits. The published attraction guide carries the transfer detail; confirm your final airstrip against your camp and book the last leg as its own step.\n\nThe Serengeti Serena Safari Lodge guide records an Arusha distance of 335 km by road and a Seronera airstrip 27 km from that lodge, with published check-in and check-out times. Use those figures as an example of why airstrip-to-camp distance matters, then confirm the numbers for your own dates. The published Serengeti balloon safari guide covers the launch-side logistics for an added excursion.',
  best_time: 'TANAPA highlights June to October for dry-season migration travel and January to February for calving interest, while location matters as much as the month: the herds move, and the same camp can be far from the action a brochure shows. UNESCO notes that only the Mara River flows perennially through the park, which shapes where wildlife concentrates in dry months. Ask your chosen camp about recent conditions and seasonal openings, and carry the same patience with river crossings as with the rest of the plan.',
  planning_tips: 'A workable first structure is several nights in one chosen area, adding a second only when the season or your interests justify the transfer. In your quotation, keep accommodation charges separate from park, concession, transport and optional activity charges, and check baggage limits for any light-aircraft sector.\n\nSerengeti Serena Safari Lodge has its own full property guide on this site and is the published in-park stay; compare its room categories, published from-rates and what sits inside and outside the room rate directly with the operator. No verified booking link exists for that property yet, so treat any third-party booking route you find as unverified until the owner publishes one. The paired Tanzania insight explains how a Serengeti itinerary combines with Zanzibar without stealing days from the park.',
  attraction_slugs: ['serengeti-national-park'],
  activity_slugs: ['serengeti-balloon-safari'],
  accommodation_slugs: ['serengeti-serena-safari-lodge'],
  travel_insight_slugs: ['pair-tanzania-safari-with-zanzibar-coast'],
  hero_image_url: '/images/editorial/serengeti-local-destination/plaines-du-serengeti.jpg',
  hero_image_alt: 'Open short-grass Serengeti plains under a broad sky, with small scattered trees at the horizon',
  gallery: [
    '/images/editorial/serengeti-local-destination/plaines-du-serengeti.jpg',
    '/images/editorial/serengeti-local-destination/great-migration-kogatende.jpg',
    '/images/editorial/serengeti-local-destination/zebras-among-acacias.jpg',
    '/images/editorial/serengeti-local-destination/cheetah-shade-solitary-tree.jpg',
    '/images/editorial/serengeti-local-destination/lioness-atop-kopje.jpg',
    '/images/editorial/serengeti-local-destination/masai-giraffe-serengeti.jpg'
  ],
  last_researched: '2026-11-16',
  research_sources: [
    {
      label: 'UNESCO World Heritage: Serengeti National Park (property 156, inscribed 1981, criteria vii and x)',
      url: 'https://whc.unesco.org/en/list/156/'
    },
    {
      label: 'TANAPA: Serengeti visitor overview and habitats (carried from the published attraction record, last verified in repo 2026-10-11)',
      url: 'https://tanzaniaparks.go.tz/serengeti'
    },
    {
      label: 'Serena Hotels: Serengeti Serena Safari Lodge operator page',
      url: 'https://www.serenahotels.com/serengeti'
    }
  ],
  sort_order: 24,
  status: 'published',
  published_at: '2026-11-16T00:00:00Z'
};

const photos = {
  '/images/editorial/serengeti-local-destination/plaines-du-serengeti.jpg': {
    slug: 'serengeti-destination-plaines',
    local_path: '/images/editorial/serengeti-local-destination/plaines-du-serengeti.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Plaines_du_Serengeti.jpg',
    source_revision: 'Wikimedia Commons file Plaines du Serengeti.jpg',
    creator: 'EmelineSG',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    date: '2012-02-04',
    source_published_at: '2012-02-04',
    captured_at: '2012-02-04',
    sha256: '46af6e2977f60215b2043f7444361db9e6f4ab15c267779462c2c056b39e4a9d',
    exact_subject: true,
    subject: 'Open Serengeti plains panorama',
    alt: 'Open short-grass Serengeti plains under a broad sky, with small scattered trees at the horizon.',
    property: false,
    kind: 'photograph',
    requires_attribution: true,
    changes: 'Downloaded from the Wikimedia Commons original and resized to 1800 pixels wide with aspect ratio preserved; no other edits.',
    checked_at: '2026-11-16',
    exact_subject_evidence: 'The Commons file page title and category identify the Serengeti plains in Tanzania; the scene shows treeless short-grass savannah with kopje-country horizons consistent with the park.',
    reuse_note: 'CC BY-SA 4.0 permits reuse with attribution and share-alike; the photograph appears on the /photo-credits page with creator, source and licence. Resize and crop for display only.'
  },
  '/images/editorial/serengeti-local-destination/great-migration-kogatende.jpg': {
    slug: 'serengeti-destination-migration-kogatende',
    local_path: '/images/editorial/serengeti-local-destination/great-migration-kogatende.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Great_Migration_in_Kogatende,_Serengeti_by_Tanzania_GET_Safaris.jpg',
    source_revision: 'Wikimedia Commons file Great Migration in Kogatende, Serengeti by Tanzania GET Safaris.jpg',
    creator: 'Reginald Victor Runyoro',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    date: '2019-08-10',
    source_published_at: '2019-08-10',
    captured_at: '2019-08-10',
    sha256: 'df7f5bf64fbf1dbb337a367a44d4d5a13306bdc3202068948e6d0a10f53d0199',
    exact_subject: true,
    subject: 'Great migration herds in Kogatende, northern Serengeti',
    alt: 'Long lines of migrating wildebeest spread across dry grassland in Kogatende, northern Serengeti.',
    property: false,
    kind: 'photograph',
    requires_attribution: true,
    changes: 'Downloaded from the Wikimedia Commons original and resized to 1800 pixels wide with aspect ratio preserved; no other edits.',
    checked_at: '2026-11-16',
    exact_subject_evidence: 'The Commons file page title and description identify the Great Migration in Kogatende, Serengeti, in the dry-season northern range of the herds.',
    reuse_note: 'CC BY-SA 4.0 permits reuse with attribution and share-alike; the photograph appears on the /photo-credits page with creator, source and licence. Resize and crop for display only.'
  },
  '/images/editorial/serengeti-local-destination/zebras-among-acacias.jpg': {
    slug: 'serengeti-destination-zebras-acacias',
    local_path: '/images/editorial/serengeti-local-destination/zebras-among-acacias.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Zebras_grazing_among_acacia_trees,_Serengeti_National_Park.jpg',
    source_revision: 'Wikimedia Commons file Zebras grazing among acacia trees, Serengeti National Park.jpg',
    creator: 'Agness Abubakar Saidi',
    license: 'CC0 1.0',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    date: '2026-07-15',
    source_published_at: '2026-07-15',
    captured_at: '2026-07-15',
    sha256: '2f1b546113f167239609063c2268eb271e0c7826b1b95fb6ded5a76d23fedbb8',
    exact_subject: true,
    subject: 'Zebras grazing among acacia trees in Serengeti National Park',
    alt: 'A small group of zebras grazing among acacia trees on Serengeti grassland.',
    property: false,
    kind: 'photograph',
    requires_attribution: false,
    changes: 'Downloaded from the Wikimedia Commons original at native 1280-pixel width; no other edits.',
    checked_at: '2026-11-16',
    exact_subject_evidence: 'The Commons file page title identifies zebras grazing among acacia trees in Serengeti National Park, Tanzania.',
    reuse_note: 'CC0 1.0 places the photograph in the public domain; no attribution is required and no public credit entry is shown.'
  },
  '/images/editorial/serengeti-local-destination/cheetah-shade-solitary-tree.jpg': {
    slug: 'serengeti-destination-cheetah-shade',
    local_path: '/images/editorial/serengeti-local-destination/cheetah-shade-solitary-tree.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cheetah_resting_in_the_shade_of_a_solitary_tree,_Serengeti_National_Park.jpg',
    source_revision: 'Wikimedia Commons file Cheetah resting in the shade of a solitary tree, Serengeti National Park.jpg',
    creator: 'Agness Abubakar Saidi',
    license: 'CC0 1.0',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    date: '2026-07-15',
    source_published_at: '2026-07-15',
    captured_at: '2026-07-15',
    sha256: 'ac84d846c7ff8cbac8c0592d842c2d0b4b85e634ea045ce176bbbe7df51c8128',
    exact_subject: true,
    subject: 'Cheetah resting in the shade of a solitary Serengeti tree',
    alt: 'A cheetah lying in the thin shade of a solitary tree on open Serengeti grassland.',
    property: false,
    kind: 'photograph',
    requires_attribution: false,
    changes: 'Downloaded from the Wikimedia Commons original at native 640-pixel width; no other edits.',
    checked_at: '2026-11-16',
    exact_subject_evidence: 'The Commons file page title identifies a cheetah resting in the shade of a solitary tree in Serengeti National Park, Tanzania.',
    reuse_note: 'CC0 1.0 places the photograph in the public domain; no attribution is required and no public credit entry is shown.'
  },
  '/images/editorial/serengeti-local-destination/lioness-atop-kopje.jpg': {
    slug: 'serengeti-destination-lioness-kopje',
    local_path: '/images/editorial/serengeti-local-destination/lioness-atop-kopje.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:Lioness_atop_a_kopje,_Serengeti_(1)_(28625989105).jpg',
    source_revision: 'Wikimedia Commons file Lioness atop a kopje, Serengeti (1) (28625989105).jpg',
    creator: 'Richard Mortel',
    license: 'CC BY 2.0',
    license_url: 'https://creativecommons.org/licenses/by/2.0/',
    date: '2016-06-10',
    source_published_at: '2016-06-10',
    captured_at: '2016-06-10',
    sha256: '40b4871492b6eec1d18389231550c61b8b19a80d3829269ffff4413ce1906770',
    exact_subject: true,
    subject: 'Lioness on a Serengeti kopje',
    alt: 'A lioness resting on the granite boulders of a Serengeti kopje, looking out over the plains.',
    property: false,
    kind: 'photograph',
    requires_attribution: true,
    changes: 'Downloaded from the Wikimedia Commons original and resized to 1800 pixels wide with aspect ratio preserved; no other edits.',
    checked_at: '2026-11-16',
    exact_subject_evidence: 'The Commons file page title and Flickr source record identify a lioness atop a kopje in the Serengeti, photographed in June 2016.',
    reuse_note: 'CC BY 2.0 permits reuse with attribution; the photograph appears on the /photo-credits page with creator, source and licence. Resize and crop for display only.'
  },
  '/images/editorial/serengeti-local-destination/masai-giraffe-serengeti.jpg': {
    slug: 'serengeti-destination-masai-giraffe',
    local_path: '/images/editorial/serengeti-local-destination/masai-giraffe-serengeti.jpg',
    source_page: 'https://commons.wikimedia.org/wiki/File:042_Masai_giraffe_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg',
    source_revision: 'Wikimedia Commons file 042 Masai giraffe in the Serengeti National Park Photo by Giles Laurent.jpg',
    creator: 'Giles Laurent',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    date: '2024-07-11',
    source_published_at: '2024-07-11',
    captured_at: '2024-07-11',
    sha256: '1b799a0405af3065055eac3968c89d05922ec19d0e24406cc84ef19a35ce46c9',
    exact_subject: true,
    subject: 'Masai giraffe in the Serengeti National Park',
    alt: 'A Masai giraffe walking across Serengeti grassland with scattered trees behind.',
    property: false,
    kind: 'photograph',
    requires_attribution: true,
    changes: 'Downloaded from the Wikimedia Commons original and resized to 1800 pixels wide with aspect ratio preserved; no other edits.',
    checked_at: '2026-11-16',
    exact_subject_evidence: 'The Commons file page title and the creator\'s own-work statement identify a Masai giraffe in Serengeti National Park, photographed 11 July 2024.',
    reuse_note: 'CC BY-SA 4.0 permits reuse with attribution and share-alike; the photograph appears on the /photo-credits page with creator, source and licence. Resize and crop for display only.'
  }
};

// --- local-destinations.json ---
const destPath = `${root}/content/local-destinations.json`;
const destinations = JSON.parse(readFileSync(destPath, 'utf8'));
if (!destinations.some((d) => d.slug === 'serengeti' && d.country_slug === 'tanzania')) {
  destinations.push(record);
  writeFileSync(destPath, JSON.stringify(destinations, null, 2) + '\n');
}

// --- photo-library.js (src + public) ---
const libPath = `${root}/src/lib/photo-library.js`;
const pubPath = `${root}/public/photo-library.js`;
for (const libPathToEdit of [libPath, pubPath]) {
  let text = readFileSync(libPathToEdit, 'utf8');
  if (text.includes('serengeti-local-destination')) throw new Error(`photos already present in ${libPathToEdit}`);
  // Insert before the closing of the "images" object (immediately preceding "listings").
  const tailAnchor = text.indexOf('\n  },\n  "listings": {');
  if (tailAnchor === -1) throw new Error(`images closing structure not found in ${libPathToEdit}`);
  const entries = Object.entries(photos).map(([path, entry]) =>
    `    ${JSON.stringify(path)}: ${JSON.stringify(entry, null, 2).replace(/\n/g, '\n    ')},`
  ).join('\n');
  text = text.slice(0, tailAnchor) + '\n' + entries.slice(0, -1) + text.slice(tailAnchor);
  writeFileSync(libPathToEdit, text);
}
console.log('serengeti destination record + 6 photo entries written');
