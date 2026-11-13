const fs = require('fs');
const p = 'content/local-destinations.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
if (d.some(x => x.slug === 'victoria-falls')) { console.log('EXISTS'); process.exit(1); }
d.push({
  slug: 'victoria-falls',
  country_slug: 'zimbabwe',
  name: 'Victoria Falls',
  category: 'Falls town',
  hero_title: 'Victoria Falls: the Zimbabwe-side base for the Smoke that Thunders',
  listing_summary: 'The Zimbabwe-side falls town — rainforest paths, river and gorge activities, and a KAZA Univisa gateway between the Zimbabwe and Zambia sides of Mosi-oa-Tunya.',
  overview: 'Victoria Falls town is the Zimbabwe-side base for Mosi-oa-Tunya, the falls the Zimbabwe Tourism Authority describes as the "Smoke that thunders" in the local Tonga language — the largest single curtain of falling water in the world, with 70% of the views seen from the Zimbabwe rain forest. That rain forest is kept green by the never-ending spray of the falls, giving it a unique ecosystem the authority calls a botanist\'s dream and bird lovers\' paradise, and the area, it notes, has not become over commercialized. Walking within the falls is a couple of kilometres and it does get very hot.\n\nThe town is also the practical hub. Victoria Falls International Airport and the A8 road approach serve the Zimbabwe side, and the published attraction guide and two activity guides (a guided cross-border falls walk and Zambezi white-water rafting) are organized from here. The Victoria Falls Hotel, an Edwardian landmark established in 1904 with gardens and views toward the Victoria Falls bridge, is the published stay. For travelers combining both sides of the river, the UK FCDO describes the KAZA Univisa — US$50, valid 30 days, obtainable at Victoria Falls airport and the Zimbabwe-Zambia border — as covering travel between Zimbabwe and Zambia and day trips into Botswana.\n\nThis destination guide organizes a stay in the town itself; the published attraction guide covers the waterfall and the rainforest walk in detail.',
  highlights: [
    'Zimbabwe-side base for the falls: 70% of the views are seen from the Zimbabwe rain forest (Zimbabwe Tourism Authority)',
    'KAZA Univisa gateway: US$50, 30 days, covers Zimbabwe-Zambia travel and Botswana day trips (UK FCDO)',
    'Two published activities organized from town: the guided cross-border falls walk and Zambezi white-water rafting',
    'The Victoria Falls Hotel, an Edwardian landmark established in 1904, is the published stay'
  ],
  access_summary: 'Victoria Falls International Airport and the A8 road approach serve the Zimbabwe side, and transfers to your named accommodation are arranged separately — the published attraction guide carries the park authority\'s access picture. For a cross-border itinerary, the UK FCDO entry requirements (checked 13 November 2026) require a passport with an expiry at least 6 months after arrival and 3 blank pages; Zimbabwe requires a visa for most visitors, usually granted for 30 days on arrival — take enough US dollars in small notes — with e-visa options at evisa.gov.zw. The KAZA Univisa, available at Victoria Falls airport and the Zimbabwe-Zambia land border, costs US$50 and is valid 30 days for travel between Zimbabwe and Zambia and Botswana day trips. A yellow fever certificate is required when arriving from a transmission-risk country. Treat river-flow and road conditions as things to confirm for your dates, not guarantees.',
  best_time: 'The falls are walkable year-round, but what you prioritize decides the dates: high flow, clearer views and specific activities do not always align, and the spray that keeps the rain forest alive can obscure a viewpoint on some days. The Zimbabwe Tourism Authority warns that walking within the falls is a couple of kilometres and does get very hot, so start early and carry water. Ask operators about current conditions for your travel period and keep the schedule flexible rather than trusting a static seasonal description.',
  planning_tips: 'Give the falls their own unhurried visit — the viewpoints and rainforest paths deserve more than a transfer stop — then pick one or two activities rather than trying to fit every advertised option into one day. Confirm entrance charges separately from guided touring and optional activities, keep behind the barriers on wet paths, and protect equipment from spray. If you are crossing to Livingstone or adding a Botswana day trip, check the KAZA Univisa and border arrangements for your nationality before buying transport or an activity on the other side, and do not schedule an excursion immediately before a flight or border connection. The Victoria Falls Hotel stay guide advises confirming room category, outlook and inclusions directly with the property, and arranging airport transport and excursions separately. Declare cash of US$10,000 or more on entry, and note it is illegal to leave Zimbabwe with cash worth more than US$2,000 (UK FCDO).',
  attraction_slugs: ['victoria-falls'],
  activity_slugs: ['victoria-falls-guided-walk', 'victoria-falls-zambezi-white-water-rafting'],
  accommodation_slugs: ['victoria-falls-hotel'],
  travel_insight_slugs: ['plan-your-victoria-falls-visit'],
  hero_image_url: '/images/editorial/victoria-falls/victoria-falls-zimbabwe-panorama.jpg',
  hero_image_alt: 'Panoramic view of Victoria Falls from the Zimbabwe side',
  gallery: [
    '/images/editorial/victoria-falls/victoria-falls-zimbabwe-panorama.jpg',
    '/images/editorial/victoria-falls/victoria-falls-devils-cataract.jpg',
    '/images/editorial/victoria-falls/victoria-falls-rainforest.jpg',
    '/images/editorial/victoria-falls/victoria-falls-bridge-zambezi.jpg',
    '/images/editorial/victoria-falls/victoria-falls-viewpoint.jpg',
    '/images/editorial/victoria-falls/victoria-falls-knife-edge-zambia.jpg'
  ],
  last_researched: '2026-11-13',
  research_sources: [
    {
      label: 'Zimbabwe Tourism Authority: Victoria Falls (Mosi-oa-Tunya) destination page — Smoke that thunders in Tonga, largest single curtain of falling water in the world, 70% of views from the Zimbabwe rain forest, spray-fed rainforest ecosystem, Livingstone 1855, walks a couple of kilometres and hot, activity range; checked 13 November 2026',
      url: 'https://zimbabwetourism.net/destinations/victoria-falls/',
      checked_at: '2026-11-13'
    },
    {
      label: 'UK FCDO Zimbabwe travel advice, entry requirements — passport 6 months + 3 blank pages, visa on arrival usually 30 days with USD small notes, evisa.gov.zw, KAZA Univisa US$50 / 30 days at Victoria Falls airport and land border covering Zimbabwe-Zambia and Botswana day trips, yellow fever certificate from risk countries, cash declaration US$10,000 in / US$2,000 out limit; checked 13 November 2026',
      url: 'https://www.gov.uk/foreign-travel-advice/zimbabwe/entry-requirements',
      checked_at: '2026-11-13'
    },
    {
      label: 'Live Trek Africa Guide pages re-read 13 November 2026: Zimbabwe country page, Victoria Falls attraction guide (airport + A8 access, spray-fed rainforest, activity terms), The Victoria Falls Hotel stay guide, guided-walk and rafting activity guides, plan-your-victoria-falls-visit insight',
      url: 'https://trekafricaguide.com/countries/zimbabwe/',
      checked_at: '2026-11-13'
    }
  ],
  sort_order: 1,
  status: 'published',
  published_at: '2026-11-13T00:00:00Z'
});
fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
console.log('added, total', d.length);
