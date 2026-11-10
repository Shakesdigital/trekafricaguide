// Append the Cairo local-destination record to content/local-destinations.json
import fs from 'node:fs';
const file = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/content/local-destinations.json';
const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
if (arr.find(x => x.slug === 'cairo')) { console.log('cairo already present'); process.exit(0); }
const entry = {
  "slug": "cairo",
  "country_slug": "egypt",
  "name": "Cairo",
  "category": "City",
  "hero_title": "Cairo: the city that gives Giza's monuments a place to stay",
  "listing_summary": "Egypt's capital is where the Giza plateau, the Grand Egyptian Museum, the Nile and a dense working city meet — and it is also where a first Egypt stay is actually built. Our published Egypt guides give the monuments their days; this is the guide to the city that arranges them.",
  "overview": "Cairo is the practical anchor of a first Egypt itinerary, and our published guides already treat it that way: the Egypt country guide opens with the warning that \"Cairo and Giza are an important starting point, but their scale makes careful daily grouping essential\", and the Cairo and Giza attraction guide echoes that \"a well-designed stay groups nearby experiences together, gives major sites time, and allows pauses.\" What the site has not had until now is the city guide those prompts assume — someone landing on the attraction guide, the Giza day-tour or the Marriott Mena House hotel page has stayed, eaten and travelled somewhere, and that somewhere is this city.\n\nSo read Cairo as several distinct areas sharing one name. The Giza side of the Nile is a world of its own — our Mena House guide is explicit that a stay there means weighing \"its Giza address ... against the time needed for activities elsewhere across the wider Cairo area\". Downtown Cairo around Talaat Harb street carries its early-20th-century grid and its own atmosphere, while Old Cairo keeps the Coptic quarter and the Hanging Church, and Islamic Cairo holds the market streets where museum-hopping ends among live commerce. The Egyptian Museum's Tahrir Square facade sits in the middle of it. Egypt's tourism authority presents Cairo and Giza as \"a connected urban region rather than a collection of isolated monuments\", and the city rewards exactly that reading: the distance between a river corniche and the plateau is a planning decision, not a footnote.",
  "highlights": [
    "A city guide for the site's published Egypt cluster — the Giza attraction, the pyramids-and-museum day tour and the Marriott Mena House hotel page now have the city anchor they all assume",
    "Giza's plateau and the Grand Egyptian Museum on one side of the Nile; downtown, Tahrir and Old Cairo on the other — grouping, not a single loop",
    "The Marriott Mena House stay, a historic garden hotel at the foot of the pyramids, as the published example of choosing a Giza-side base",
    "Nile-side evenings and landmark подъезд views from the Qasr al-Nil bridge toward the Cairo Tower — the softer half of a monumental region"
  ].map(x => x.replace('подъезд ', '')),
  "access_summary": "Arrival and departure are the planning anchor: our attraction guide's instruction at Cairo is to \"arrive through the airport serving your booking and arrange a named pickup point and transfer\", and our Mena House guide asks travellers to request airport transfers separately from the stay. The cross-city rule the hotel page states is the honest one — hotel proximity to the plateau does not mean proximity to downtown, so traffic should be given a real daily allowance rather than estimated from the map. Cairo's governorate runs an electronic portal listing its transportation services, including the metro, as a current city-transport reference; verify routes close to travel. Within the itinerary, keep the sequencing our guides already publish: a dedicated Giza day, a museum visit with a clearly chosen focus, and the city's own districts as a separate day.",
  "best_time": "The country guide's timing rule carries into the city: \"Plan outdoor monuments during more comfortable hours and use indoor visits or rest to balance the day.\" Cairo's heat makes early starts on the plateau and shaded midday museum visits the sensible split, and that pattern is exactly what our Giza day-tour guide suggests — an outdoor morning followed by museum hours, with the entry time reserved against the official ticket system. City sightseeing has no fixed season the guides could promise; check current opening arrangements for the exact museum or site close to travel rather than assuming them from this guide.",
  "planning_tips": "Plan the stay around one grouping decision before anything else: a Giza-side base for a monument-focused visit, or a central-city base for a museum-and-neighbourhoods visit — our Mena House guide exists precisely to demonstrate the trade. Ask the departure questions our activity guide publishes: kilometres keep itemised what the transfer covers, whether guiding continues inside the museum, and where the driver waits afterward; treat a pyramid interior as a separate ticket decision. Keep the onward-day rule from the country guide — do not place a major ticketed visit immediately before a flight or a Nile-valley transfer. Confirm current travel and entry requirements directly with official Egyptian sources rather than from this guide.",
  "attraction_slugs": ["cairo-and-giza"],
  "activity_slugs": ["giza-pyramids-guided-tour"],
  "accommodation_slugs": ["marriott-mena-house-cairo"],
  "travel_insight_slugs": [],
  "sort_order": 1,
  "status": "published",
  "hero_image_url": "/images/editorial/cairo-local-destination/late-evening-qasr-al-nil-tower-2012.jpg",
  "hero_image_alt": "Evening falls over the Nile in central Cairo: the Qasr al-Nil bridge carries traffic toward Gezira island and the lit Cairo Tower.",
  "gallery": [
    "/images/editorial/cairo-local-destination/late-evening-qasr-al-nil-tower-2012.jpg",
    "/images/editorial/cairo-local-destination/cairo-tower-daytime-lemay-2019.jpg",
    "/images/editorial/cairo-local-destination/saladin-citadel-lascar-2012.jpg",
    "/images/editorial/cairo-local-destination/muizz-street-market-argenberg-2007.jpg",
    "/images/editorial/cairo-local-destination/talaat-harb-street-argenberg-2007.jpg",
    "/images/editorial/cairo-local-destination/hanging-church-courtyard-mayer-2008.jpg",
    "/images/editorial/cairo-local-destination/egyptian-museum-tahrir-facade-delso-2011.jpg"
  ],
  "last_researched": "2026-11-10",
  "research_sources": [
    {
      "label": "Published on-site guides re-read 10 November 2026 for continuity (quotations marked in the page copy): Egypt country guide ('Cairo and Giza are an important starting point, but their scale makes careful daily grouping essential'); Cairo and Giza attraction guide ('a connected urban region rather than a collection of isolated monuments', 'a well-designed stay groups nearby experiences together'); Giza pyramids and Grand Egyptian Museum activity guide (itemised inclusions and reserved museum entry time); Marriott Mena House hotel guide ('foot of the Giza Pyramids', 'weighed against the time needed for activities elsewhere across the wider Cairo area')",
      "url": "https://trekafricaguide.com/countries/egypt/",
      "checked_at": "2026-11-10"
    },
    {
      "label": "Egyptian tourism authority (experienceegypt.eg), as cited on the Egypt country guide for Cairo and Giza; direct fetch returned 403 to automated access this run, so no new quotation was taken from it — the destination page reuses only the wording already credited to it on our published guides and instructs readers to confirm directly",
      "url": "https://www.experienceegypt.eg/en/search/city",
      "checked_at": "2026-11-10"
    },
    {
      "label": "Cairo Governorate electronic portal, transportation services incl. the metro — fetched HTTP 200 on 10 November 2026 (metro details render behind scripts; cited as a reference link, no figures reprinted)",
      "url": "https://www.cairo.gov.eg/en/governorate-services/transportation-services/metro/",
      "checked_at": "2026-11-10"
    }
  ]
};
arr.push(entry);
arr.sort((a, b) => 0);
fs.writeFileSync(file, JSON.stringify(arr, null, 1).replace(/\n/g, '\n'));
console.log('appended cairo, total entries', arr.length);
