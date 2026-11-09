// Adds the Nairobi local-destination record (Kenya's first) to content/local-destinations.json.
const fs = require('fs');
const file = 'content/local-destinations.json';
const records = JSON.parse(fs.readFileSync(file, 'utf8'));

if (records.some(r => r.slug === 'nairobi')) {
  console.error('nairobi record already exists; aborting');
  process.exit(1);
}

const record = {
  slug: 'nairobi',
  country_slug: 'kenya',
  name: 'Nairobi',
  category: 'City',
  hero_title: 'Nairobi: the safari gateway with a national park of its own',
  listing_summary: "Kenya's capital is where Mara and Amboseli journeys are accessed and planned — and it is also its own destination, a national park inside a city, humming food streets and a rested first night before an early airstrip departure.",
  overview: "Nairobi works as two things at once, and the site's own guides make both explicit: on the country page, Kenya is \"the clearest first-time safari gateway thanks to strong guide networks, the Maasai Mara, private conservancies, and smooth access from Nairobi\", and the Mara and Amboseli attraction guides both describe road and air access arranged from Nairobi. Yet the capital has no guide on the site — Kenya is the only major safari country here whose name city has no planning page. Kenya's national tourism organisation calls it \"a blend of natural beauty, cultural richness, and historical significance,\" and the name itself is Maasai for \"place of cool waters\".\n\nSo treat Nairobi as a destination with its own day, not a corridor. The most striking evidence comes from the tourism organisation's own attraction guidance: the 117 sq km Nairobi National Park sits at the edge of the city — it hosts what the organisation describes as the world's densest concentration of black rhinos, the big four of lions, buffalos, leopards and rhinos, and over 500 bird species including seasonal European migrants — with the Nairobi Animal Orphanage and the family-friendly Nairobi Safari Walk inside the park, and picnic areas kept secure from the resident monkeys. City evenings have their own texture in the tourism organisation's writing: matatus in graffiti art, benga music from local shops and the smell of nyama choma, Kenya's open-flame grilled meat.\n\nPractical sequencing is what Nairobi-first planning is for. Kenya Airports Authority primary international arrivals land at Jomo Kenyatta International Airport, and the light-aircraft safaris our guides describe rest at Wilson Airport for the parks; our Kenya guides make the underlying rule explicit — \"Use Nairobi as a common planning gateway, then choose road or air connections according to the actual lodge and region... Confirm the correct airstrip and transfer before booking a fly-in stay.\" Whether you fly in or arrive overland, the sensible move is the one the country guide's own estimate of a long Nairobi-to-Amboseli day underlines: a full site morning beats a rushed transfer, so build a rested night in the city around dinner and the shopping and craft streets, and keep the next day's airstrip departure out of reach of any morning's stock-taking.",
  highlights: [
    "The working gateway for Kenya's headline parks — road and light-aircraft access to the Mara and Amboseli is arranged from the capital",
    "Nairobi National Park: a 117 sq km park at the city's edge with the tourism board's commendation as hosting the world's densest black-rhino concentration, big-four game drives and more than 500 bird species",
    "Nairobi Animal Orphanage and the Nairobi Safari Walk inside the park, with family-friendly picnic areas screened from the monkeys",
    "A real capital's evening: matatus, benga music and nyama choma in the tourism board's own city portrait"
  ],
  access_summary: "International arrivals clear Jomo Kenyatta International Airport and connect across town to Wilson Airport — the Kenya Airports Authority calls Wilson Nairobi's hub for domestic, safari and charter flights, with routes to the Maasai Mara, Amboseli, the coast and beyond, and notes it sits on Langata Road about 5 km south of the city centre. The ground rule the country guide sets is the honest one: Nairobi is a common planning gateway, but the correct airstrip, gate and transfer must be confirmed against the actual lodge before booking — our Amboseli guide specifies Iremito, Kimana and Meshanani gates by road from Nairobi and the Mara guide has the road approach through Narok, while our published Nairobi-departure Amboseli day tour exists for travellers who want the park without an overnight. Within the city, traffic and distance are the planning facts — allow a real margin between international arrival and the Wilson hop, and build the rested first night rather than assuming a same-day connection.",
  best_time: "Wildlife timing in Kenya is seasonal and the site's own guides carry the caveats: great migrations and water-dependent game move with the rains, and no month or crossing can be promised as an appointment. The city itself is usable year-round at altitude; the national park's bird list peaks when seasonal European migrants arrive, a window the tourism board flags without fixing dates. For a Nairobi-first itinerary the real timing factors are logistics rather than weather — dry-season roads shorten the Mara drive, and the day-tour pattern our Amboseli guide documents (early departure, long road day, park time at the end) is materially better when the plains are dry. Confirm current park hours and conditions close to travel; do not treat any month as an automatic booking window.",
  planning_tips: "Plan Nairobi as a rested base with one site day, and keep park days park-sized. A useful first-evening shape: airport transfer, dinner (nyama choma everywhere — ask the staff what the day's meat is, this is the city's real meal) and a long night, then choose one: a half-day in Nairobi National Park with the Safari Walk if children are travelling, or the city museum and craft streets if the next morning is an airstrip flight. Confirm separately, in writing: the correct airstrip against your lodge, the gate for an Amboseli road day, luggage limits on the Wilson hop, and what your Moshi or Mara extension's transfers assume. Kenya Airports Authority publishes current airport and airline information; verify times close to travel rather than from this guide.",
  attraction_slugs: ['maasai-mara', 'amboseli-national-park'],
  activity_slugs: ['amboseli-game-drive-safari'],
  accommodation_slugs: [],
  travel_insight_slugs: [],
  sort_order: 1,
  status: 'published',
  hero_image_url: '',
  hero_image_alt: '',
  gallery: [],
  last_researched: '2026-11-09',
  research_sources: [
    {
      label: "Magical Kenya (Kenya Tourism Board): Nairobi city page — 'a blend of natural beauty, cultural richness, and historical significance'; Maasai name meaning 'place of cool waters'; Ngong Hills sunrise, matatus in graffiti art, benga, nyama choma city portrait; Westlands as a modern hotel district; checked 9 November 2026",
      url: 'https://magicalkenya.com/city/nairobi/',
      checked_at: '2026-11-09'
    },
    {
      label: "Magical Kenya (Kenya Tourism Board): Nairobi National Park experience page — 117 sq km park at the edge of Nairobi; hosts the world's densest concentration of black rhinos; big four (lions, buffalos, leopards, rhinos); over 500 bird species incl. seasonal European migrants; Nairobi Animal Orphanage (cheetahs, hyenas, parrots, cranes, ostriches) and family-friendly Nairobi Safari Walk inside the park; monkey-protected picnic areas; checked 9 November 2026",
      url: 'https://magicalkenya.com/experience/nairobi-national-park/',
      checked_at: '2026-11-09'
    },
    {
      label: "Published on-site guides re-read 9 November 2026 for continuity: Kenya country guide (hero 'smooth access from Nairobi', 'Use Nairobi as a common planning gateway... Confirm the correct airstrip and transfer before booking a fly-in stay'); Maasai Mara attraction guide (road approach from Nairobi through the Narok area, airstrip matched to the camp); Amboseli attraction + game-drive activity guides (KWS Iremito/Kimana/Meshanani gates with Nairobi routes, the Nairobi-departure day-tour product already listed with a Stay22 booking destination)",
      url: 'https://trekafricaguide.com/countries/kenya/',
      checked_at: '2026-11-09'
    },
    {
      label: "Kenya Airports Authority: Wilson Airport page — 'Nairobi's hub for domestic, safari and charter flights, with routes to the Maasai Mara, Amboseli, the coast, Kisumu and the wider region'; Wilson (WIL) listed as domestic, on Langata Road about 5 km south of the city centre; JKIA listed among KAA international airports; checked 9 November 2026 (KWS direct fetch errored this run, so Nairobi National Park figures come from the Kenya Tourism Board record above with the KWS fee/hours confirm-with-authority caveat applied in the page text)",
      url: 'https://www.kaa.go.ke/',
      checked_at: '2026-11-09'
    }
  ]
};

records.push(record);
fs.writeFileSync(file, JSON.stringify(records, null, 1) + '\n');
console.log('added nairobi; total records:', records.length);
