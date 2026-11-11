// Add Musanze local destination record (Rwanda) — 2026-11-11 run
const fs = require('fs');
const path = 'content/local-destinations.json';
const arr = JSON.parse(fs.readFileSync(path, 'utf8'));
if (arr.some(x => x.slug === 'musanze')) { console.log('musanze already present; aborting'); process.exit(1); }

const record = {
  slug: 'musanze',
  country_slug: 'rwanda',
  name: 'Musanze',
  category: 'City',
  hero_title: 'Musanze: the town that sleeps beside the Volcanoes trailheads',
  listing_summary:
    'Rwanda\'s northern tourism town sits at 1,850 m in the foothills of the Virunga Massif, about 13 km from the Kinigi park headquarters — the base that turns a 4 a.m. Kigali alarm into a short morning drive to the 7 a.m. briefing.',
  overview:
    'Musanze is the working town of Rwanda\'s gorilla country. Rwanda\'s tourism authority describes a city "poised to become one of Rwanda\'s major cities", set at an altitude of 1,850 m in the foothills of the Virunga Massif, where notably fertile land feeds a busy agricultural trade around the tourism economy.\n\nIts practical claim on travellers is simple: the Kinigi headquarters where every gorilla and golden monkey morning begins is about 13 km away, and the authority calls the city a convenient base for gorilla tracking for exactly that reason. For those who want to stay closer to the park edge, it points to boutique lodges along the Volcanoes National Park fringes with spectacular views and a more rural setting — a stay character the town itself does not attempt to imitate.\n\nMusanze is not a quiet stopover, and that is part of its use. The authority describes a hassle-free, buzzing city with plenty of choice for eating out, ATMs for cash, vibrant nightlife, markets and artisanal trades — the services that make several consecutive early mornings, muddy boots and permit paperwork easy to manage.\n\nThe non-trekking days fill quickly. Guided tours run into the underground Musanze Caves, which the authority dates to formation about 62 million years ago after the last estimated volcanic eruption; bicycle tours and a chance to meet the Rwandan cycling team at the Africa Rising Cycling Centre sit alongside the Buhanga Eco-Park, an ancient forest holding what the authority calls Rwanda\'s most intriguing folklore, and the little-known lakes of Karago, Burera and Ruhondo.',
  access_summary:
    'Musanze sits on the Kigali–Musanze corridor in Rwanda\'s far northwest. The published Volcanoes and Kigali guides carry an operator-advertised transfer of roughly two and a half hours from Kigali toward the Kinigi reporting area — treat that as a planning estimate and confirm the exact meeting point, the drive from your Musanze-side lodging and the next morning\'s timing with your provider, since the 7 a.m. Kinigi gathering is the fixed spine of every trek day. Within the town, markets, restaurants, ATMs and artisanal trades are the authority\'s own picture of what is reachable on foot or by short arranged rides; the lakes, caves and cycling centre excursions need arranged transport. Confirm current road conditions on the corridor in the rainy seasons before committing to a same-day Kigali arrival and next-morning trek.',
  best_time:
    'Musanze works to the trek calendar rather than its own. Match the visit to the confirmed permit date: June to mid-September is generally drier, with rainy spells mid-February to May and mid-September to mid-December, and the Volcanoes guides note forest trails can be muddy in any season. The official Volcanoes National Park what-to-wear guidance — sturdy clothing, solid walking shoes, gaiters and a lightweight waterproof for rain — applies to the town evenings as much as the trail, and the caves and lake excursions are the natural rainy-day alternatives.',
  planning_tips:
    'Choose between a Musanze-side stay and a Kigali base on the published transfer-morning reasoning, not on price alone: sleeping near the trailheads shortens the pre-briefing drive, while Kigali suits arrival days and post-trek evenings. Book permits through Irembo or a licensed operator first and build the nights around them, and confirm which excursions — caves, Buhanga, the lakes, the cycling centre — run on your dates and what each costs with the provider rather than trusting a static list. Carry cash from the town\'s ATMs before heading to Kinigi, and keep one flexible day so a muddy trail or a delayed return does not break the journey.',
  attraction_slugs: ['volcanoes-national-park'],
  activity_slugs: ['volcanoes-gorilla-trek', 'volcanoes-golden-monkey-trekking'],
  accommodation_slugs: ['sabyinyo-silverback-lodge'],
  travel_insight_slugs: ['plan-kigali-volcanoes-transfer-morning'],
  highlights: [
    'About 13 km from the Kinigi headquarters where every Volcanoes trek morning begins',
    'Buzzing service town: eating out, ATMs, markets and artisanal trades between trek mornings',
    'Musanze Caves, Buhanga Eco-Park, the Burera/Ruhondo lakes and the Africa Rising Cycling Centre for non-trekking days',
    'Boutique lodges along the park fringes with views and a rural setting the town itself does not imitate'
  ],
  sort_order: 2,
  status: 'published',
  last_researched: '2026-11-11',
  research_sources: [
    {
      label: 'Visit Rwanda (RDB): Musanze town page — foothills of the Virunga Massif, 1,850 m altitude, Kinigi HQ 13 km, boutique lodges along the park fringes, buzzing city with eating out/ATMs/nightlife/markets/artisanal trades, excursions (Musanze Caves, bicycle tours, Africa Rising Cycling Centre, Buhanga Eco-Park, lakes of Karago/Burera/Ruhondo); checked 11 November 2026',
      url: 'https://www.visitrwanda.com/destinations/musanze/',
      checked_at: '2026-11-11'
    },
    {
      label: 'Visit Rwanda (RDB): Volcanoes National Park page — Buhanga Eco-Park ancient forest with folklore, Musanze Caves formed about 62 million years ago after the last estimated volcanic eruption, Virunga chain (Karisimbi 4,507 m, Bisoke, Sabinyo, Gahinga, Muhabura), official what-to-wear guidance; checked 11 November 2026',
      url: 'https://www.visitrwanda.com/national-parks/volcanoes-national-park/',
      checked_at: '2026-11-11'
    },
    {
      label: 'Published on-site guides re-read 11 November 2026 for continuity: live Volcanoes National Park attraction guide (three-day outline built on nights near Musanze or Kinigi, Kinigi briefing mornings), the live Kigali destination guide (transfer framing), and the live Kigali–Volcanoes transfer-morning insight (Kigali vs Musanze/Kinigi base decision, 7 a.m. Kinigi spine)',
      url: 'https://trekafricaguide.com/attractions/volcanoes-national-park/',
      checked_at: '2026-11-11'
    }
  ]
};

arr.push(record);
fs.writeFileSync(path, JSON.stringify(arr, null, 2) + '\n');
console.log('added musanze; total records:', arr.length);
