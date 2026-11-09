# Nairobi local destination guide â€” 9 November 2026

## Selection and scope

Rotation reached destinations (accommodations inventory re-verified last run: all 32 ledger stays render live; Maun shipped earlier today by a parallel run). Kenya is the flagship safari country with no local-destination guide: Uganda has three (Buhoma, Kampala, Fort Portal), Zambia/South Africa/Tanzania/Ghana/Senegal/Rwanda/Botswana one each â€” while the Kenya country page heroes "smooth access from Nairobi" and instructs "Use Nairobi as a common planning gatewayâ€¦ Confirm the correct airstrip and transfer before booking a fly-in stay", yet no guide holds that planning decision. New local destination `nairobi` under Kenya, authored per docs/local-destinations.md. No changes to country/attraction/activity records; relationship arrays deliberately narrow (see below).

## Relationship decisions (geography-checked)

- `attraction_slugs: ["maasai-mara", "amboseli-national-park"]` â€” both are Nairobi-gateway parks in the site's own guides (Mara road approach from Nairobi through Narok; Amboseli KWS Iremito/Kimana/Meshanani gates with Nairobi routes).
- `activity_slugs: ["amboseli-game-drive-safari"]` â€” that guide's documented product is literally a Nairobi-departure day tour (already booking on site). **Maasai Mara balloon is excluded**: it departs pre-dawn inside the Mara camps, not a Nairobi-side outing.
- `accommodation_slugs: []` â€” the three published Kenya stays (Governors' Camp, both Amboseli lodges) are inside Amboseli/Mara park areas, not Nairobi; honest empty state, matching the Kigali precedent.
- `travel_insight_slugs: []` â€” no Kenya-specific insight is published.

## Official evidence (checked 9 November 2026)

- Magical Kenya (KTB) city page: Nairobi "a blend of natural beauty, cultural richness, and historical significance"; Maasai name "place of cool waters"; Ngong Hills sunrise, matatu graffiti art, benga music, nyama choma; Westlands hotel district.
- Magical Kenya (KTB) Nairobi National Park page: 117 sq km at the city's edge; "the world's densest concentration of black rhinos"; big four (lions, buffalos, leopards, rhinos); 500+ bird species incl. seasonal European migrants; Nairobi Animal Orphanage; family-friendly Nairobi Safari Walk; monkey-protected picnic areas.
- Kenya Airports Authority Wilson Airport page: "Nairobi's hub for domestic, safari and charter flights, with routes to the Maasai Mara, Amboseli, the coast, Kisumu and the wider region"; WIL on Langata Road ~5 km south of the centre. JKIA is KAA's listed international gateway. Traffic May 2026: 607,037 passengers.
- KWS direct fetch errored this run (transport errors on kws.go.ke), so no KWS figures/fees are reprinted; the page defers park fees/hours to current KWS confirmation.
- On-site continuity re-read 9 Nov: Kenya country guide, Mara + Amboseli attraction guides, Amboseli game-drive activity guide (Nairobi-departure product with existing Stay22 booking destination).

## Editorial notes

- Zero-image publication with the neutral missing-image slot; six-subject backlog: Nairobi skyline with hills, Nairobi National Park skyline-backdrop game view, Animal Orphanage or Safari Walk boardwalk, JKIA kerb/terminal, Wilson Airport Langata strip with aircraft, nyama choma grill court. Never reuse park-attraction or lodge collection photos.
- No rates, fees, flight schedules or transfer minutes beyond the KAA-attributed Langata distance; no traveler feedback field (nothing new verified).

## Build and rendered checks (local, production data)

- Full production build: **137 pages**, readability guard passed on **142 pages**.
- Rendered inspection: title correct; h2 flow Explore Nairobi / Highlights / Getting there and around / Best time to visit / Planning your stay / Attractions to explore / Things to do; Prohibited rail: no stay cards (honest); both attraction links + the Amboseli activity card render; Kenya country page now renders "Destinations in Kenya" with the Nairobi card; homepage search includes Nairobi; no exposed markup.

## Publication record

- Content commit pushed to main; Netlify deploy follows; live verification recorded in the receipt commit to docs/editorial-progress.json.
- CMS mirror: production deploy imports at source_commit; `editorial_documents` read remains RLS-blocked for the publishable key â€” owner-side CMS check of local_destinations/nairobi recommended.
