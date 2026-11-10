# Plan an Okavango trip — insight research (2026-11-10)

Deliverable: travel insight `plan-okavango-trip-water-and-land-camps` (travel-insights rotation).

## Gap evidence (live 10 November 2026)

- Live insight archive lists 10 published stories: Uganda 3 (two Bwindi, one Kibale), South Africa 2 (Cape Town ×2), plus Tanzania, Zambia/Zimbabwe, Namibia, Tunisia, Kenya. Zero Botswana stories.
- Live Botswana cluster has 5 published pages — country page, Maun destination, Okavango Delta attraction, Okavango mokoro activity, Camp Okavango accommodation — all demanding planning decisions ("Choose the experience first, then check the camp's location and current conditions"; Camp Okavango operator "explicitly states that game drives are not offered here"; Maun framed against "tourists all too often treat Maun merely as transit") with no planning story to answer them.
- No draft or existing insight with this slug (checked content/editorial-overrides.json; grep across travel_articles). Nigeria/Egypt withdrawn insight untouched.

## Decision order the insight carries

1. Water decides the camp: flood-pulse timing, camp position over destination name.
2. Water camp, land camp or a complementary pair (Camp Okavango as the worked water example).
3. Getting there: Maun gateway then light aircraft; transfer chain and baggage limits as one sequence.
4. Timing: May–August dry season vs the flood that arrives in it; ask camps about local levels.
5. Pre-payment checklist: inclusions, water-dependent activities, nights per pace, mobility.

## Key facts verified

- UNESCO WHS record whc.unesco.org/en/list/1432 (fetched 10 Nov 2026): inscribed 2014 as the Convention's 1000th site, criteria (vii)(ix)(x); annual flooding occurs during the dry season, flood-tide pulsing through the wetland at its peak in June/July ("critical life-force during the peak of Botswana's dry season"); about 40% of the protected property lies within Moremi Game Reserve; "Tourism to the inner Delta is limited to small, temporary tented camps with access by air"; endorheic delta draining into the Kalahari Basin; ~130,000 elephants (world's largest national population) with the Delta as core area.
- Internal pages (live 10 Nov 2026, verbatim quotes carried with link backs): /countries/botswana ("a property's position can be more important than the broad destination name", "spend enough nights in each place to settle into its rhythm", May–August "dry, clear weather and cold early mornings and nights", greener season birding, baggage/delay checks, road-advice caveat), /attractions/okavango-delta ("Choose the experience first...", transfer-chain language, small-aircraft baggage margins and delay responsibility, "different camps offer genuinely different experiences"), /countries/botswana/maun (gateway, direct flights from Johannesburg and Gaborone, Thamalakane River, transit-vs-stay framing credited to Botswana's tourism organisation), /accommodations/camp-okavango (game drives not offered, match with a land-based property, transfer arrangement before booking onward travel, age-six children, satellite Wi-Fi caveat), /activities/okavango-mokoro-safari (road transfer + poler-guided mokoro + walk; day trip vs overnight camp are "different products").
- botswanatourism.co.bw (Okavango page) repeatedly timed out from this machine; BTO-attributed facts remain only as quoted inside the internal Maun/Botswana pages, marked as such. Ramsar RSIS record returned HTTP 418. No fees, prices or schedules claimed.

## Photos (six distinct Wikimedia Commons files, checked 10 Nov 2026)

| File (local) | Source | Creator | Licence | Captured | Subject evidence |
|---|---|---|---|---|---|
| okavango-zebra-aerial-helicopter-2018.jpg | commons.wikimedia.org/wiki/File:Cebras_de_Burchell_(Equus_quagga_burchellii),_vista_aérea_del_delta_del_Okavango,_Botsuana,_2018-08-01,_DD_30.jpg | Diego Delso | CC BY-SA 4.0 | 2018-08-01 | "Aerial view from a helicopter of a group of Burchell's zebras..., Okavango Delta, Botswana" (visual: zebra breeding herd in flooded channel) |
| okavango-delta-aerial-cessna-1200ft-2001.jpg | commons.wikimedia.org/wiki/File:The_Okavango_Delta_from_1,200_ft.jpg | Andrew Balet | CC BY 2.5 | 2001-05 | "The Okavango Delta as viewed from a Cessna at 1,200 ft" (visual: channel mosaic from light aircraft) |
| okavango-mokoro-poler-2003.jpg | commons.wikimedia.org/wiki/File:Mokoro_Polers_in_the_Okavango.jpg | DDD DDD (assumed, no machine-readable author) | Public domain | 2003-08-16 | "this wonderful Mokoro Poler Trust guide in the Okavango, Botswana, in August 2003" (visual: poler with poles beside dugout mokoros in reeds) |
| okavango-water-lilies-2011.jpg | commons.wikimedia.org/wiki/File:Water_lilies_in_the_Okavango_Delta_-_Botswana_-_panoramio.jpg | diego_cue (via Panoramio) | CC BY-SA 3.0 | 2011-11-08 | "Water lilies in the Okavango Delta - Botswana" (visual: white lilies in open channel) |
| okavango-red-lechwe-savanna-2019.jpg | commons.wikimedia.org/wiki/File:Okavango_savanna_with_a_Red_Lechwe_buck.jpg | Cosal | CC BY-SA 4.0 | 2019-03-08 | "Grassland savanna in the Okavango Delta with a Red Lechwe buck" (visual: lone lechwe in floodplain grass, dawn/dusk light) |
| okavango-delta-sunset-2011.jpg | commons.wikimedia.org/wiki/File:Sunset_in_the_Okavango_Delta,_Botswana.jpg | Markrosenrosen | CC BY-SA 3.0 | 2011-09-08 | "Sunset in the Okavango Delta, Botswana" (visual: red sun behind palm-lined channel silhouette) |

All downloaded at 1,800 px wide (thumb CDN/API thumburls), SHA-256 recorded, each visually inspected against its documented subject. None reused from any existing collection (checked src/lib/photo-library.js: existing Botswana/Oka­vango library images are the country-page photos, delta-attraction Unsplash wildlife set, starter mokoro file and stock delta — all distinct files).

## Booking CTA

None by design: no exact verified OTA product attached in this run. Transfer chains are camp/oper­ator-arranged (Camp Okavango transfer is operator-direct via Desert & Delta Safaris; the mokoro day is an operator product on its own page). The insight carries internal links only, matching the Kenya and Marrakech planning-page pattern.

## Copy sources carried as research_sources

UNESCO WHS 1432 record; six Commons file pages; internal pages listed above with their shown attribution lines.
