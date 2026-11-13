// Add Sal Island circuit excursion activity record + booking destination. One-off run script (13 Nov 2026).
const fs = require('fs');

// 1) editorial-overrides.json — activity record
const opath = 'content/editorial-overrides.json';
const oraw = fs.readFileSync(opath, 'utf8');
const o = JSON.parse(oraw);
if (o.activities.some(x => x.slug === 'sal-island-circuit-excursion')) { console.log('sal-island-circuit-excursion already present; abort'); process.exit(1); }

const rec = {
  region_id: 15,
  country_id: 42,
  attraction_id: 64,
  slug: "sal-island-circuit-excursion",
  name: "Sal Island circuit excursion",
  location_name: "Sal Island, Cabo Verde (Santa Maria, Espargos, Murdeira and Palmeira pickups)",
  listing_summary: "A full-day guided road circuit around Sal linking Santa Maria, Murdeira Bay, Palmeira, the Pedra de Lume salt crater and the Buracona Blue Eye; confirm stops, entrance fees and sea conditions before you go.",
  detail_intro: "A Sal Island circuit turns the separate stops the attraction guide describes — Santa Maria, Murdeira Bay, Palmeira, the Pedra de Lume salt crater and the Buracona Blue Eye — into one guided road day. Sal is flat and compact, but the stops are distinct sites with their own access rules and sea or sun conditions, so a circuit saves navigation while limiting time at each stop.\n\nThe verified listing behind this guide is GetYourGuide product 268017, \"Sal: Island Experience Tour with a Certified Native Guide\" by Sal Experiences: 4.8/5 from 4,514 reviews, from €35 per person, about 7 hours, pickup included from four locations (Sal, Espargos, Murdeira, Santa Maria), free cancellation up to 24 hours — all checked 13 November 2026. The same product sits behind the Sal Island attraction page's booking panel, so guide and attraction share one verified listing.",
  full_description: "<p>Sal rewards a single well-planned road day more than repeated short drives. The island is open and low, and its sights are spread between the southern resort coast and the northern lava shore. A guided circuit sequences them for you; a self-driven day trades that for control over timing. Either way, treat the stops as separate visits rather than one continuous attraction, as our <a href=\"/attractions/sal-island\">Sal Island guide</a> frames them.</p><h3>The stops that each need their own check</h3><p><strong>Pedra de Lume salt crater.</strong> Salt works occupy a volcanic crater on the island's northeastern side, protected as national heritage by Cabo Verde's cultural heritage institute. Floating in the brine is offered as part of the visit, not guaranteed: bathing runs only when site conditions allow, so confirm access at the gate, follow site rules, and protect eyes and skin from the concentrated salt water. The verified listing shows about 40 minutes at the stop and lists a €6 entrance fee as extra (operator-listed; reconfirm at the site).</p><p><strong>Buracona Blue Eye.</strong> The Blue Eye is a light effect inside a coastal lava cave, not a permanent spectacle: its appearance depends on sun angle, swell and conditions, and visitors commonly aim around midday. Walk only on marked viewing areas — the exposed lava shore is not a swimming platform, and a 11 November 2026 reviewer on the verified product reported swimming was not possible that day because of sea conditions. The listing allows about 50 minutes and lists a €5 entrance fee (operator-listed; reconfirm).</p><p><strong>Shark Bay and Kite Beach.</strong> Shark Bay, an optional stop on the circuit, offers shallow-water viewing of lemon sharks; stay at the depth and distance your guide sets and treat sightings as wildlife viewing, not an interaction. Kite Beach features on the itinerary only during the kitesurfing season, which the operator dates October to March.</p><h3>How the day is sequenced</h3><p>The verified listing publishes a reference itinerary — Murdeira Bay, Santa Maria, Kite Beach (in season), the fishing village of Palmeira with its arts and crafts market, the Miragem lunar landscape, a lunch break, then Shark Bay, Pedra de Lume and Buracona before Espargos — and states plainly that it is for reference only and subject to change with tides, weather and daylight. Ask which stops are fixed for your date, how long each lasts and whether entrance fees and the optional lunch (€11 adult / €6 child per the listing) are settled before or during the day. One 2025 island-circuit reviewer wanted more time at Buracona; building that question into your booking conversation is the useful takeaway.</p><h3>Who the circuit suits</h3><p>The operator marks the tour not suitable for people with mobility impairments or wheelchair users, and the day involves uneven volcanic ground, heat and wind exposure. Strong swimmers may prefer a day with more water time; travelers who want independent pacing may prefer renting a car, as one November 2026 reviewer who praised the circuit noted it removed the need to. Families should note baby strollers and large bags are not allowed (a baby seat is available free on request per the listing). Guides work in English, French, Spanish, Portuguese and Dutch.</p>",
  highlights: [
    "Cover Santa Maria, Murdeira Bay, Palmeira, Espargos and the northern coast in one guided day",
    "Float in the Pedra de Lume salt crater when bathing is offered on the day",
    "See the Buracona Blue Eye with realistic expectations about light and sea conditions",
    "Optionally watch lemon sharks in the shallows of Shark Bay at guide-set distance"
  ],
  best_time: "<p>Cabo Verde's official tourism guidance describes November to July as the dry season, generally favourable for beach-focused travel, and August to October as hotter, more humid and occasionally rainy — broad national guidance rather than a Sal-specific forecast. The circuit itself runs on road conditions and daylight rather than seasons, but two parts move with the calendar: the Kite Beach stop operates October to March, and the Blue Eye's light effect needs sun angle and calm sea. Confirm current sea state and site access close to your date; no month guarantees a particular stop condition.</p>",
  practical_info: "<h3>Before you book</h3><p>Confirm from the operator or listing: your pickup location (the verified product collects from Sal, Espargos, Murdeira and Santa Maria), departure time, total duration (about 7 hours on the listing), which stops are fixed, time at each stop, what the entrance fees cover (operator lists €5 Blue Eye, €6 Salinas), the optional lunch price and menu, guide language, and the cancellation terms (free cancellation up to 24 hours on the verified listing). Ask what happens if sea conditions close the Blue Eye swim or a stop is crowded.</p><h3>On the day</h3><p>Bring sun protection, a hat, water, footwear suited to rough volcanic surfaces, swimwear and a towel for Pedra de Lume when bathing is offered, and a light wind layer. Follow marked paths at Buracona and the heritage site's instructions at the salt crater; do not touch or remove material. At Shark Bay, keep to the guide's depth and distance. Ask before photographing residents, workers or their boats.</p><h3>Getting there and around</h3><p>Amílcar Cabral International Airport serves Sal, and the circuit's four pickup points cover the island's main settlements, so most stays in Santa Maria, Espargos or Murdeira are covered without a separate transfer. If you are based elsewhere on the island, confirm your nearest pickup and its time before booking. For a self-arranged day, our attraction guide's caution stands: distances are short but the northern route needs a planned vehicle, and a 2025 reviewer found the Buracona turnoff from Palmeira hard to find.</p>",
  hero_image_url: null,
  hero_image_alt: "",
  gallery: [],
  booking_url: null,
  source_url: "https://www.getyourguide.com/santa-maria-cape-verde-l141321/cape-verde-6-hour-sal-experience-t268017/",
  status: "published",
  published_at: "2026-11-13",
  sort_order: 99,
  last_researched: "2026-11-13",
  traveler_feedback: "GetYourGuide aggregate, browser-verified 13 November 2026: 4.8/5 from 4,514 reviews (guide 4.9, transportation 4.7, value for money 4.8). Dated verified-booking reviews: Ana Monte (Germany), 11 November 2026 — wonderful day with guide Christian, but wished for more time with the sharks and the Blue Eye swim was not possible that day due to sea conditions; Sissi (Cape Verde), 9 November 2026 — many small places explored, recommends it over renting a car, professional and humorous guide, never pushy about purchases. Individual experiences, not guarantees; ratings can change.",
  research_sources: [
    {
      label: "GetYourGuide product t268017 'Sal: Island Experience Tour with a Certified Native Guide' (Sal Experiences), opened and read live in a browser session 13 November 2026: 4.8/5 from 4,514 reviews, from €35, about 7 hours, 4 pickup locations, free cancellation 24 h, reference itinerary with Pedra de Lume (€6) and Buracona (€5) extra fees, optional lunch €11/€6, Kite Beach October–March, not suitable for mobility impairments/wheelchair users, Product ID 268017",
      url: "https://www.getyourguide.com/santa-maria-cape-verde-l141321/cape-verde-6-hour-sal-experience-t268017/",
      checked_at: "2026-11-13"
    },
    {
      label: "Cabo Verde tourism authority (turismo.cv): Sal Island page — island character, named sights, dry Nov–Jul / hot Aug–Oct national season guidance; checked 12 November 2026 in the Sal destination ledger",
      url: "https://turismo.cv/page/sal",
      checked_at: "2026-11-12"
    },
    {
      label: "Instituto do Patrimônio Cultural: Salinas de Pedra de Lume, national heritage (historic industrial settlement, salt trade); carried from the attraction guide's source list, checked 27 October 2026",
      url: "https://ipc.cv/en/monumento-e-sitio/salinas-de-pedra-de-lume-patrimonio-nacional/",
      checked_at: "2026-10-27"
    },
    {
      label: "Trek Africa Guide — Sal Island attraction guide (live HTTP 200, 13 November 2026): distinct-stops framing, Blue Eye light-dependence caution, sea-access caution, 2025 Tripadvisor reviewer accounts",
      url: "https://trekafricaguide.com/attractions/sal-island/",
      checked_at: "2026-11-13"
    },
    {
      label: "Trek Africa Guide — Sal destination guide (live HTTP 200, 13 November 2026): Pedra de Lume protected national landscape, Espargos capital, Santa Maria base, named north-coast sights",
      url: "https://trekafricaguide.com/countries/cabo-verde/sal/",
      checked_at: "2026-11-13"
    }
  ],
  meta_description: "Plan a full-day guided Sal Island circuit: Santa Maria, Murdeira Bay, Palmeira, the Pedra de Lume salt crater and the Buracona Blue Eye, with stops, fees and season checks."
};
o.activities.push(rec);
fs.writeFileSync(opath, JSON.stringify(o, null, 2) + '\n');
console.log('added sal-island-circuit-excursion; activities now', o.activities.length);

// 2) booking-destinations.json — exact product destination
const bpath = 'content/booking-destinations.json';
const braw = fs.readFileSync(bpath, 'utf8');
const b = JSON.parse(braw);
if (b.activities['sal-island-circuit-excursion']) { console.log('booking destination already present'); } else {
  b.activities['sal-island-circuit-excursion'] = {
    url: "https://www.getyourguide.com/santa-maria-cape-verde-l141321/cape-verde-6-hour-sal-experience-t268017/",
    provider: "getyourguide",
    title: "Sal: Island Experience Tour with a Certified Native Guide",
    operator: "Sal Experiences",
    rating: 4.8,
    review_count: 4514,
    notes: "Full-day road circuit with pickup from Sal, Espargos, Murdeira or Santa Maria. Entrance fees for the Blue Eye (EUR 5) and Pedra de Lume salt crater (EUR 6) and the optional lunch (EUR 11/6) are operator-listed extras. Not suitable for wheelchair users or people with mobility impairments.",
    checked_at: "2026-11-13",
    evidence: {
      review_check: "Exact product page opened and read live in a browser session 13 November 2026 (product ID 268017); 4.8/5 from 4,514 reviews; from EUR 35 per person; scores may change. The same product sits behind the Sal Island attraction page's booking CTA (booking-destinations.attractions['sal-island'])."
    }
  };
  fs.writeFileSync(bpath, JSON.stringify(b, null, 2) + '\n');
  console.log('booking destination added');
}
