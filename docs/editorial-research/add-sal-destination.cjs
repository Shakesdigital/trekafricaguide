// Add Sal (Cabo Verde) local destination record. One-off run script.
const fs = require('fs');
const path = 'content/local-destinations.json';
const arr = JSON.parse(fs.readFileSync(path, 'utf8'));
if (arr.some(x => x.slug === 'sal')) { console.log('sal already present; abort'); process.exit(1); }
const rec = {
  slug: 'sal',
  country_slug: 'cabo-verde',
  name: 'Sal',
  category: 'Island',
  hero_title: "Sal: the island of sun and sea where a Cabo Verde trip starts",
  listing_summary: "Cabo Verde's main tourist island — more than half the country's overnight stays — built around Santa Maria's white-sand beach, the Pedra de Lume salt crater and a north-coast outing to Buracona, with the island's stay guide already published.",
  overview: "Sal is the island that carries most of Cabo Verde's tourism: the national tourism institute states the island is responsible for more than 50% of the whole archipelago's overnight stays. The name itself is the island's history — the institute traces it to the salt industry that thrived here from the eighteenth to the mid-twentieth century, and the Pedra de Lume salt works whose exploitation began in 1804 still shape the island's story: since 2003 the salines have been a protected national landscape, and from 2014 a natural, historical and cultural heritage site where guided tours let visitors float in the saline waters.\n\nGeographically the institute's island page keeps it simple: a flat volcanic island of 215 square kilometres that 'resembling the lunar surface' rises only to Monte Grande at 406 metres, home to roughly 35,000 people, with the administrative capital at Espargos beside Amílcar Cabral International Airport. The south is the sandy side — dunes stretching to the horizon and the white-sand beaches of Santa Maria and Ponta Preta — while the north holds the Terra Boa marshlands and the named coastal sights the tourism institute lists as must-visits: Murdeira Bay, Rabo de Junco, Buracona with its 'Blue Eye' light effect in a coastal lava cave, Ponta Preta and the Cave of Love (Gruta do Amor).\n\nThe town of Santa Maria is where a first stay almost always begins. The institute's page describes it as 'caressed by an 8 km stretch of pristine white sandy beach' running from the pier to Ponta Preta through Ponta do Sinó, and the municipality celebrates the Santa Maria Beach Festival there over two days each September. Our published Sal Island attraction guide builds its whole first-visit plan on this arrangement: settle into Santa Maria for arrival and beach time, take one dedicated island outing north and/or to Pedra de Lume, then keep a flexible final day for wind, sea conditions and the water-sport briefing that deserves its own time.",
  highlights: [
    "Cabo Verde's main tourist island, credited by the national tourism institute with more than 50% of the country's overnight stays",
    "Santa Maria: the pier-to-Ponta-Preta white-sand beach the institute describes as an 8 km stretch, with bars, restaurants and water activities",
    "The Pedra de Lume salt flats inside a volcanic crater — protected since 2003, national heritage since 2014, floatable on guided tours",
    "A north-coast outing to named sights: Murdeira Bay, Rabo de Junco, Buracona's Blue Eye, Ponta Preta and the Cave of Love"
  ],
  access_summary: "Arrive through Amílcar Cabral International Airport, which sits close to Espargos, the island's capital, and arrange the onward transfer to your named accommodation — our published attraction guide notes the transfer to resorts outside Santa Maria is the first thing to confirm. For island sightseeing, the attraction guide's advice applies: ask the driver or operator which stops are included, how long you can remain at each, whether pickup and return are door-to-door, and what happens if sea or wind conditions change. Sal is flat but the distances between the southern resort area, Espargos and the north coast still make a planned vehicle useful for a multi-stop outing. If continuing to another island, compare current ferry and flight schedules before buying connecting transport or booking consecutive nights.",
  best_time: "The national tourism institute describes a warm tropical dry climate that 'allows the tourist to enjoy the paradisiacal beaches or the famous salt flats for 365 days a year', and the official seasonal guidance carried in our attraction guide splits it practically: November to July as the dry season, generally favourable for beach-focused travel, and August to October as hotter, more humid and occasionally rainy. Sal is exposed to Atlantic wind, so wind sports may appeal in breezier conditions while swimming and boat plans need a same-day local assessment. The Blue Eye's appearance is light-dependent — visitors commonly aim around midday, but weather, crowding and the sun's position alter the experience. Check current sea state and site access locally instead of treating any month or hour as a guarantee.",
  planning_tips: "Plan Sal in three unhurried blocks, as our published attraction guide suggests: settle into Santa Maria and the beach first, take a dedicated half- or full-day road outing for selected north-coast stops and/or Pedra de Lume, then keep a flexible final day for wind sports, a boat outing or more town time. Treat a Pedra de Lume visit as a cultural and geological site rather than a novelty float — confirm bathing access and conditions locally and protect eyes and skin from concentrated salt water. Walk only on marked or permitted viewing areas at Buracona and the north coast, and do not approach exposed surf ledges or assume natural pools are safe for swimming. A guided island circuit reduces navigation but limits time at each stop; a private or self-arranged route offers more control only if transport, road conditions and site access are confirmed. Compare accommodation by actual location relative to your plans — beach frontage does not necessarily mean an easy walk to town — and our published island stay guide covers the property in detail.",
  attraction_slugs: ["sal-island"],
  activity_slugs: [],
  accommodation_slugs: ["hilton-cabo-verde-sal-resort"],
  travel_insight_slugs: [],
  sort_order: 1,
  status: "published",
  hero_image_url: "",
  hero_image_alt: "",
  gallery: [],
  last_researched: "2026-11-12",
  research_sources: [
    { label: "Instituto do Turismo de Cabo Verde (turismo.cv): Sal island page — salt-industry name origin, flat lunar-like terrain, dry climate 365 days, more than 50% of archipelago overnight stays, Murdeira/Rabo de Junco/Buracona/Ponta Preta/Cave of Love highlights, international airport; checked 12 November 2026", url: "https://www.turismo.cv/page/sal", checked_at: "2026-11-12" },
    { label: "Instituto do Turismo de Cabo Verde (visit-caboverde.com): Sal island page — 215 km², Monte Grande 406 m, ~35,000 inhabitants, Espargos capital beside Amílcar Cabral airport, sighted 3 December 1460, Pedra de Lume salt works from 1804 protected 2003/heritage 2014, Santa Maria 8 km beach stretch, Seven Wonders claim, September music festival; checked 12 November 2026", url: "https://www.visit-caboverde.com/en/islands/sal-island", checked_at: "2026-11-12" },
    { label: "Câmara Municipal do Sal: Sal turístico — four population points, the island's tourism-based offer, Santa Maria Beach Festival 15 September over two days; checked 12 November 2026", url: "https://www.camaramunicipaldosal.com/sal-turistico?lang=en", checked_at: "2026-11-12" },
    { label: "Live Trek Africa Guide: Sal Island attraction guide — Santa Maria-first plan, Blue Eye light-dependence, Pedra de Lume heritage framing, three-block first stay, Nov–July vs Aug–Oct national season guidance; checked 12 November 2026", url: "https://trekafricaguide.com/attractions/sal-island/", checked_at: "2026-11-12" },
    { label: "Live Trek Africa Guide: Cabo Verde country page — HTTP 200 rendering no Destinations rail; checked 12 November 2026", url: "https://trekafricaguide.com/countries/cabo-verde/", checked_at: "2026-11-12" },
    { label: "Live Trek Africa Guide: Hilton Cabo Verde Sal Resort stay guide — the island's published accommodation page; checked 12 November 2026", url: "https://trekafricaguide.com/accommodations/hilton-cabo-verde-sal-resort/", checked_at: "2026-11-12" }
  ]
};
arr.push(rec);
fs.writeFileSync(path, JSON.stringify(arr, null, 2) + '\n');
console.log('added sal; records now', arr.length);
