// Add Tunis local destination under Tunisia. Run from repo root.
const fs = require("fs");
const path = "content/local-destinations.json";
const raw = fs.readFileSync(path, "utf8");
const data = JSON.parse(raw);
const arr = Array.isArray(data) ? data : data.local_destinations || data.destinations;
if (!Array.isArray(arr)) throw new Error("unknown local-destinations shape");
if (arr.some((x) => x.slug === "tunis")) throw new Error("tunis already present");

const record = {
  slug: "tunis",
  country_slug: "tunisia",
  name: "Tunis",
  category: "City",
  hero_title: "Tunis: the capital that plans the medina, Carthage and Sidi Bou Said days",
  listing_summary:
    "Tunisia's capital on the Mediterranean side of a fertile plain: a World Heritage medina of some 700 monuments, a TGM rail corridor to Carthage and the hillside village of Sidi Bou Said, and the first-night decision our published planning insight answers.",
  overview:
    "Tunis is the capital of Tunisia, sitting in a fertile plain of the country's north-east a few kilometres from the sea. UNESCO's Urban Heritage Atlas describes it as a large city of over one million inhabitants expanding over a metropolitan area of 212 square kilometres, once a small Berber town linked to the ancient Punic capital of Carthage that grew significantly after the destruction of Carthage in the 8th century.\n\nThe city's historic heart is the Medina of Tunis, one of the first Arabo-Muslim towns of the Maghreb (founded 698 A.D. per the World Heritage record) and inscribed on the World Heritage List in 1979 under criteria (ii)(iii)(v). UNESCO describes a property of 296.41 hectares composed of the central medina of the 8th century and suburbs to the north and south of the 13th century, and quotes the 12th- to 16th-century period when, under the Almohads and the Hafsids, Tunis was considered one of the greatest and wealthiest cities in the Islamic world, with some 700 monuments — palaces, mosques, mausoleums, madrasas and fountains — testifying to that past. The most remarkable named in the record include the Zitouna Mosque, the Kasbah Mosque, the Bab Jedid and Bab Bhar gates, the Souq el-Attarine, the Dar el-Bey palace and noble houses such as Dar Hussein and Dar Lasram. The medina benefits from national listing for 88 historic monuments and its protection runs through Law 35-1994 and the development plan of the Medina, with a safeguarding structure under the National Heritage Institute and a Safeguarding Association under the Municipality of Tunis.\n\nTunis is a capital that plans a coast as much as a city. Its Tunis Marine station is the terminus for the TGM suburban railway along the coastal corridor towards Carthage and La Marsa — the structure our Tunisia country guide builds its touring day on, and the arrangement the live attraction guide separates into a central Tunis day and a Carthage-and-Sidi Bou Said day. UNESCO's own links also note the city as a Creative City of Crafts and Folk Art since 2017, and the medina's palaces and cultural centres open their doors for concerts and shows during Ramadan, a festival season documented in the World Heritage Centre's site-manager contribution.",
  access_summary:
    "Arrive through Tunis-Carthage airport; the short ride into the city is the first planning step, and our published first-night insight covers the medina-versus-coast base decision before you book. Within the city, the TGM suburban railway runs from Tunis Marine towards Carthage and La Marsa: TRANSTU names Tunis Marine and La Marsa as the line's principal stations, with a daily ticket product and a published winter timetable — figures carried from the live insight's 8 November 2026 check, because the operator's site did not resolve during our own fetch; verify current service before relying on it. A taxi or arranged vehicle can connect the dispersed Carthage sites, with the route and price agreed beforehand. Entry rules: the UK Foreign Office states (British-citizen scope, checked 11 November 2026) that passports should be valid for the duration of the stay, that no visa is needed for up to 90 days, and that border officials stamp passports and fine overstays; Tunisia's authorities set and enforce entry rules, so confirm the rules for your own passport before booking.",
  best_time:
    "The medina's narrow streets and shaded courtyards are walkable year-round, and UNESCO's atlas notes they stay cool during the summer heat; exposed Carthage sites and the hillside lanes of Sidi Bou Said feel very different on the same day, so give each block its own start time. Check the opening arrangements of individual monuments and museums before setting out — the heritage agency's seasonal listings put the Antonine Baths at 08:30-17:00 in winter, 08:00-18:00 in summer and 08:00-17:00 during Ramadan on a grouped ticket, per our live insight's 8 November 2026 check. Ramadan also reshapes the city in a pleasant way: the medina's palaces and cultural centres open for concerts and recitals, per the World Heritage Centre's site-manager contribution — but confirm how the season affects opening hours and transport on your dates.",
  planning_tips:
    "Plan Tunis as separate blocks rather than one rapid circuit, exactly as the country guide recommends: a central medina day, a Carthage day and a Sidi Bou Said afternoon. Choose a base according to where you want to spend most of your time — a central-city stay and a coast stay create different daily routines — and read our published first-night insight before booking, since the medina-versus-Sidi Bou Said choice reshapes the arrival day and the Carthage outing. Inside the medina, streets are narrow and twisting with vehicle access limited, so ask any medina property exactly where a vehicle can meet you and how luggage is handled; the same historic-house access questions apply to stairs and pavements. Compare accommodation by neighbourhood and practical access rather than a broad city label, keep the coast outing flexible if weather is poor, and avoid booking a tight onward connection after a multi-stop sightseeing day.",
  attraction_slugs: ["tunis-and-sidi-bou-said"],
  activity_slugs: [],
  accommodation_slugs: ["dar-said"],
  travel_insight_slugs: ["choose-first-night-tunis-medina-or-coast"],
  highlights: [
    "The Medina of Tunis: a World Heritage site since 1979 (criteria ii, iii, v), 296.41 hectares with some 700 historic monuments",
    "The TGM corridor from Tunis Marine to Carthage and La Marsa, the spine of the touring day our country and attraction guides plan",
    "Zitouna Mosque, the souqs, Bab Bhar and noble houses such as Dar Hussein and Dar Lasram inside an intact Arabo-Muslim urban fabric",
    "The first-night decision between a medina base and a Sidi Bou Said coast base, answered in our published planning insight"
  ],
  sort_order: 3,
  status: "published",
  last_researched: "2026-11-11",
  research_sources: [
    {
      label:
        "UNESCO World Heritage Centre: Medina of Tunis (ref 36) — inscribed 1979, criteria (ii)(iii)(v), property 296.41 ha, buffer 190.19 ha, minor boundary modification 2010; founded 698 A.D., central medina 8th century with north/south suburbs 13th century; Almohads and Hafsids 12th-16th century 'greatest and wealthiest cities in the Islamic world', some 700 monuments; named monuments (Zitouna Mosque, Kasbah Mosque, Youssef Dey Mosque, Bab Jedid, Bab Bhar, Souq el-Attarine, Dar el-Bey, Souqs ech-Chaouachia, Tourbet el Bey, Dar Hussein, Dar Ben Abdallah, Dar Lasram, Medrasa Es-Slimanya, Zaouia of Sidi Mehrez); national listing 88 historic monuments; Law 35-1994; safeguarding structures; checked 11 November 2026",
      url: "https://whc.unesco.org/en/list/36/",
      checked_at: "2026-11-11"
    },
    {
      label:
        "UNESCO Urban Heritage Atlas: Medina of Tunis (Tunisia) — large city of over one million inhabitants, metropolitan area 212 km2, fertile plain of north-eastern Tunisia a few kilometres from the sea; small Berber town linked to Punic Carthage, development after the destruction of Carthage in the 8th century; medina typology (walls, gates, courtyard buildings, sabats, minarets); Tunis a UNESCO Creative City of Crafts and Folk Art (2017) in the page's links; Ramadan medina festival contribution by the site manager; checked 11 November 2026",
      url: "https://whc.unesco.org/en/urban-heritage-atlas/tunis",
      checked_at: "2026-11-11"
    },
    {
      label:
        "UK Foreign, Commonwealth & Development Office: Tunisia entry requirements — full British-citizen passport scope; passport valid for duration of stay; no visa up to 90 days (Crown Dependency passport holders may need a visa on arrival); passport stamped on arrival; overstay fine; damaged-passport warning; FCDO advises against all travel to parts of Tunisia; checked 11 November 2026",
      url: "https://www.gov.uk/foreign-travel-advice/tunisia/entry-requirements",
      checked_at: "2026-11-11"
    },
    {
      label:
        "Published on-site guides re-read 11 November 2026 for continuity: live Tunisia country guide (Tunis Marine TGM start, base-choosing structure), live Tunis And Sidi Bou Said attraction guide (two-stop Carthage plan, separate entrances), live Dar Saïd stay guide and the live 'Where to spend your first night in Tunis' insight (medina vs coast decision; TRANSTU TGM principal stations + daily ticket + winter timetable and AMVPPC seasonal hours/grouped ticket carried with that insight's 8 November 2026 check dates because the operator and heritage-agency hosts did not resolve during this run)",
      url: "https://trekafricaguide.com/countries/tunisia/",
      checked_at: "2026-11-11"
    }
  ]
};

arr.push(record);
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("added tunis; total", arr.length);
