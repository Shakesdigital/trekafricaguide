# Kigali local destination guide — 9 November 2026

## Selection and scope

Rotation reached destinations. Rwanda is the only primate-showcase country with no local-destination guide: Uganda has three (Buhoma, Kampala, Fort Portal), Zambia/South Africa/Tanzania/Ghana/Senegal one each — while the Rwanda country page names Kigali "one of Africa's easiest arrival cities" and promises "confirm the transfer from Kigali to the chosen Volcanoes-area property" without any guide holding that planning decision. New local destination `kigali` under Rwanda, authored per docs/local-destinations.md. No changes to country/attraction/activity records; relationship arrays deliberately narrow (see below).

## Relationship decisions (geography-checked)

- `attraction_slugs: ["volcanoes-national-park"]` — Kigali is Volcanoes' working gateway (country page transfer framing; operator Kigali-morning products in the published activity guides). **Nyungwe is excluded**: it is a five-hour southwest journey, not a Kigali-side day trip; linking it would mislead.
- `activity_slugs: ["volcanoes-gorilla-trek", "volcanoes-golden-monkey-trekking"]` — both are Kinigi/Volcanoes-based and describe Kigali-morning logistics.
- `accommodation_slugs: []` — the published Rwanda stay (Sabyinyo Silverback Lodge area) is in the Virunga foothills, not Kigali; no Kigali-stay guide exists, so the honest empty state applies rather than a proximity inference.
- `travel_insight_slugs: []` — no Rwanda-specific insight is published.

## Official evidence (checked 9 November 2026)

- Visit Rwanda (RDB), [Kigali](https://visitrwanda.com/kigali/): central position with good road links; founded 1907, capital at independence 1962; Nyarugenge (CBD) and Kacyiru (government quarter) hills; Nyarutarama/Lover's Lake flat urban walk with birds; Kigali Cultural Village for artisans and food vendors; Kigali Genocide Memorial (over one million victims of 1994, three permanent exhibitions, burial gardens).
- Visit Rwanda (RDB), [Volcanoes National Park](https://www.visitrwanda.com/national-parks/volcanoes-national-park/): far-northwest park; Virunga chain (Karisimbi 4,507 m, Bisoke, Sabinyo, Gahinga, Muhabura); Buhanga Eco-Park and Musanze Caves within the park; gorilla and golden monkey tracking.
- On-site continuity, re-read 9 November: Rwanda country guide ("Kigali as one of Africa's easiest arrival cities", transfer confirmation promise, season/rainy-spell framing) and both primate activity guides (Kigali-morning logistics; operator Kigali products advertising roughly two and a half hours driving each way — kept as a clearly labelled provider estimate, per house rule).

## Editorial notes

- Plain-text multi-paragraph fields per the authoring doc; the memorial is framed with conduct guidance ("follow the on-site guidance"), no second-hand etiquette claims.
- Zero-image publication with the neutral missing-image slot; six-subject backlog recorded: Kigali skyline hillside, Nyarutarama lake track, Kigali Cultural Village stalls, a medina-style city boulevard view (CBD), memorial exterior (respecting on-site photography rules), museum/gallery interior.
- No rates, flight schedules or transfer minutes beyond the attributed operator estimate; no traveler feedback field (nothing new verified).

## Build and rendered checks (local, production data)

- check-build-inputs passed; full production build: **130 pages**, readability guard passed on **135 pages**.
- Rendered inspection: correct title/meta; overview, Highlights, Getting there and around, Best time to visit, Planning your stay sections render; Volcanoes attraction link + both activity cards present; Nyungwe correctly NOT linked; no invented rates; Rwanda country page now renders the "Destinations in Rwanda" carousel containing the Kigali card; homepage search includes Kigali.

## Publication record

- Content commit: this run's commit, pushed to main; Netlify deploy follows; live verification recorded in the receipt commit to docs/editorial-progress.json.
- CMS mirror: production deploy imports at source_commit; `editorial_documents` read remains RLS-blocked for the publishable key — owner-side CMS check of local_destinations/kigali recommended.
