// Adds the Maun local-destination record (Botswana's first) to content/local-destinations.json.
const fs = require('fs');
const file = 'content/local-destinations.json';
const records = JSON.parse(fs.readFileSync(file, 'utf8'));

if (records.some(r => r.slug === 'maun')) {
  console.error('maun record already exists; aborting');
  process.exit(1);
}

const record = {
  slug: 'maun',
  country_slug: 'botswana',
  name: 'Maun',
  category: 'Town',
  hero_title: "Maun: Botswana's safari capital on the Delta's doorstep",
  listing_summary: "The northern town most Delta journeys start from: safari outfitters, a busy airport and the Thamalakane River, where a deliberate day or two before the camps beats treating the place as a corridor.",
  overview: "Maun sits on the southern fringes of the Okavango Delta, and Botswana's national tourism organisation is blunt about its character: the country's tourism capital, still carrying the feel of a dusty frontier town despite new malls, shops, hotels and guesthouses. It is the administrative centre of Ngamiland District, and safari companies and air-charter operators keep their offices here — their signposts dot the sandy parking lots on the road to the airport. The Thamalakane River meanders through town, the first hint of the water systems that make this part of Botswana different.\n\nThe town's history runs through the Batawana people, whose capital was set at their final resting point here in 1915 after earlier moves through Lake Ngami, Toteng and Tsao. The district's mix is wide — Hambukushu, Basubiya, Bayei and Banoka (the River Bushmen, the Delta's original inhabitants), Bakgalagadi and Baherero families — and the tourism organisation credits these communities with centuries of expert use of the Okavango's resources. Its own commentary makes a point worth planning around: tourists all too often treat Maun merely as transit, while the villages along the western fringes of the Delta and into the panhandle reward travellers who allow them time.\n\nPractically, Maun is where a Delta trip converges. The airport receives direct flights from Johannesburg and Gaborone, and our published guides carry the town reality: the mokoro activity guide describes a Maun-based full-day outing — a road transfer, a poler-guided mokoro journey and a walk — while the Delta attraction guide explains that the inner delta is reached largely by light aircraft, with camp experiences differing by location and month. Give the town a worked-in pace: supplies are easy to buy and repack for camp, and a quiet afternoon by the river does the itinerary more good than another rushed transfer.",
  highlights: [
    "Gateway town for Okavango Delta journeys and often the traveller's first stop in Botswana",
    "Direct scheduled flights from Johannesburg and Gaborone, with light-aircraft links onward to the camps",
    "A genuine town with safari outfitters, riverside setting and supplied malls for pre-camp stocking",
    "The 'people side' of the Delta: Batawana seat of power since 1915 and a wide cultural mix in the district"
  ],
  access_summary: "Arrive by air: the Government of Botswana lists Maun among the country's principal airports, and Botswana Tourism notes the busy airport receives direct flights from Johannesburg and Gaborone. From town, two onward patterns apply, and the published Delta guides describe both: light-aircraft transfers into the inner delta — where tourism is limited to small, temporary tented camps with air access — and road-based day trips, such as the Maun-based mokoro outing our activity guide covers, which begins with a road transfer to a launch area. Confirm luggage limits for small aircraft, who meets you at the airstrip, and whether your next morning's transfer departs from town or the airport edge. Within Maun, the town and its supplied malls are compact enough to handle on foot or by taxi.",
  best_time: "Botswana's climate is semi-arid, and the national tourism organisation frames the year simply: winter, May to August, is the dry season with sunny cool-to-warm days and cold nights; rains fall in the summer months, peaking around January and February. The Okavango adds its own twist — UNESCO notes the annual flood arrives during the dry season, its pulse at its height around June and July, so the Delta is at its most concentrated while the country itself is driest. The tourism organisation's own take on the two alternatives: the green season turns the bush lush and is a haven for birders as migrants arrive, while the dry peak concentrates game as the rivers fill from the Okavango floods. Delta-side conditions still differ from launch point to launch point, so confirm water access for your dates.",
  planning_tips: "Plan Maun as a town with its own value rather than a corridor, because the tourism organisation says that transit treatment is exactly what most visitors get wrong. Build a rested first night around the river and the shopping centre before any early airstrip departure, and confirm separately: the camp's own transfer arrangements, small-aircraft baggage limits, any community or park charges included in a day trip, and the sequence from arrival flight to the next morning's onward move. If you want the district's cultural side, plan the villages along the western Delta fringes and the panhandle as their own time blocks, booked with organisers who can explain who leads the visit — do not crowd them into the margins of a transfer day.",
  attraction_slugs: ['okavango-delta'],
  activity_slugs: ['okavango-mokoro-safari'],
  accommodation_slugs: ['camp-okavango'],
  travel_insight_slugs: [],
  sort_order: 1,
  status: 'published',
  hero_image_url: '',
  hero_image_alt: '',
  gallery: [],
  last_researched: '2026-11-09',
  research_sources: [
    {
      label: "Botswana Tourism Organisation: Maun town page — tourism capital on the southern fringes of the Okavango Delta, dusty frontier-town character, gateway into the Delta and often into Botswana, direct flights from Johannesburg and Gaborone at the busy airport, Ngamiland administrative centre, Batawana seat of power (capital Lake Ngami, Toteng, Tsao, then Maun in 1915), Hambukushu/Basubiya/Bayei/Banoka River Bushmen/Bakgalagadi/Baherero district mix, 'people side' of the Okavango overlooked by transit-minded visitors, safari companies and modern malls/shops/hotels, Thamalakane River through town; checked 9 November 2026",
      url: 'https://www.botswanatourism.co.bw/explore/maun',
      checked_at: '2026-11-09'
    },
    {
      label: "UNESCO World Heritage Centre: Okavango Delta (inscribed 2014) — permanent marshlands and seasonally flooded plains, one of very few major interior delta systems that do not flow into a sea or ocean, annual flooding occurs during the dry season with the flood pulse at its height around June/July, Moremi Game Reserve protects about 40% of the property, inner-delta tourism limited to small temporary tented camps with air access, near-pristine wetland; checked 9 November 2026",
      url: 'https://whc.unesco.org/en/list/1432/',
      checked_at: '2026-11-09'
    },
    {
      label: "Botswana Tourism Organisation: Climate page — semi-arid climate, rainy season in the summer months with January and February generally the peak, winter May to August the dry season with virtually no rainfall and sunny cool-to-warm days but nights that can fall rapidly, transitional April/early May and September/October still dry; checked 9 November 2026",
      url: 'https://www.botswanatourism.co.bw/climate',
      checked_at: '2026-11-09'
    },
    {
      label: "Botswana Tourism Organisation: Time to Visit page — green season (wet, lush, game birthing, haven for birders as migratory birds arrive), peak season (winter dry colours, pools dry but rivers fill from the Okavango floods concentrating game); checked 9 November 2026",
      url: 'https://www.botswanatourism.co.bw/travel-info/time-visit',      checked_at: '2026-11-09'
    },
    {
      label: "Government of Botswana: About our country — airports in Gaborone, Francistown, Kasane and Maun; four-season/dry-winter seasonal framing; checked 9 November 2026",
      url: 'https://www.gov.bw/about-our-country',
      checked_at: '2026-11-09'
    },
    {
      label: "Published on-site guides re-read 9 November 2026 for continuity: Okavango Delta attraction guide (gateway/airstrip transfer framing, baggage restrictions for small aircraft, camp-activities differ by location and month) and the Okavango mokoro activity guide (Maun-based full-day outing: road transfer, poler-guided mokoro, walk; confirm launch area and conditions); Camp Okavango stay guide (island retreat in the permanent delta) for the stays relationship",
      url: 'https://trekafricaguide.com/attractions/okavango-delta/',
      checked_at: '2026-11-09'
    }
  ]
};

records.push(record);
fs.writeFileSync(file, JSON.stringify(records, null, 1) + '\n');
console.log('added maun; total records:', records.length);
