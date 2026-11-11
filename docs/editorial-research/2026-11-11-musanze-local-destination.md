# Musanze local destination guide — 11 November 2026

## Selection and scope

Rotation reached destinations (last completed deliverable: travel insight "Plan a first Egypt visit", c180e9f/abe48e8). Rwanda has one published local destination (Kigali) while the live `/countries/rwanda/musanze/` URL returns HTTP 404 (checked 11 November 2026) and the Rwanda country page renders only the Kigali destination card. The live Volcanoes National Park attraction guide builds its suggested three-day outline on "a night near Musanze or Kinigi" with no destination guide behind the town name, and the live transfer-morning insight frames the "sleep in Kigali or sleep near Kinigi?" decision that this guide answers from the town side. Duplicate check: Kigali covers the arrival-city/rested-day half; no overlap with any published destination slug.

## Relationship decisions (geography-checked)

- `attraction_slugs: ["volcanoes-national-park"]` — the park's Kinigi HQ is 13 km from Musanze per Visit Rwanda; no other attraction is proximate (Nyungwe/Kigali excluded by distance).
- `activity_slugs: ["volcanoes-gorilla-trek", "volcanoes-golden-monkey-trekking"]` — both run from Kinigi and the destination page pairs them with the HQ distance claim.
- `accommodation_slugs: ["sabyinyo-silverback-lodge"]` — the published Rwanda stay sits in the Virunga foothills/Kinigi area, matching Visit Rwanda's "boutique lodges along its fringes with spectacular views and a more rural setting". Kigali Serena excluded (city-side, already on the Kigali page).
- `travel_insight_slugs: ["plan-kigali-volcanoes-transfer-morning"]` — the insight's base decision is the destination page's stay decision, read from the Musanze side.

## Official evidence (checked 11 November 2026)

1. Visit Rwanda (RDB), Musanze town page (https://www.visitrwanda.com/destinations/musanze/): "poised to become one of Rwanda's major cities"; strategic location in the foothills of the Virunga Massif attractive to tourism, business and agriculture, notably fertile land; altitude 1,850 m; convenient base for gorilla tracking with Kinigi HQ 13 km away; boutique lodges along park fringes with spectacular views and rural setting; hassle-free buzzing city with eating out, ATMs, vibrant nightlife, markets, artisanal trades; excursions: guided underground-caves tour, bicycle tours, meet the Rwandan cycling team at the Africa Rising Cycling Centre, Buhanga Eco-Park, lakes of Karago, Burera and Ruhondo.
2. Visit Rwanda (RDB), Volcanoes NP page (https://www.visitrwanda.com/national-parks/volcanoes-national-park/): Buhanga Eco-Park "ancient forest holding Rwanda's most intriguing folklore"; Musanze Caves "formed 62 million years ago after the last estimated volcanic eruption"; Virunga chain Karisimbi 4,507 m (highest), Bisoke crater lake, Sabinyo, Gahinga, Muhabura; official what-to-wear: sturdy clothing, solid walking shoes, gaiters and lightweight waterproof for rain.
3. On-site continuity (live HTTP 200, 11 November 2026): Volcanoes attraction guide (three-day outline: drive north from Kigali, night near Musanze or Kinigi, gorilla and golden-morning Kinigi mornings); Kigali destination page; plan-kigali-volcanoes-transfer-morning insight (7 a.m. Kinigi spine, operator-advertised ~2.5 h Kigali transfer estimate).

Not claimed: cave-tour prices/schedules, cycling-centre visiting terms, lakes excursion logistics, current road conditions — all deferred to "confirm with provider" hedges in copy.

## Editorial notes

- Plain-text multi-paragraph fields per docs/local-destinations.md; sentence punctuation, no spaced hyphens (2026-11-10 style fix rule).
- Zero-image honest publish; six-subject backlog (not reusable from Volcanoes attraction/activity/canopy collections): 1 Musanze town market streets, 2 Musanze Caves lava-tube interior, 3 Buhanga Eco-Park forest, 4 Burera or Ruhondo lake with volcano backdrop, 5 Africa Rising Cycling Centre, 6 potato/field farmland with Virunga skyline (distinct from attraction's Kinigi potato-sacks photo).
- No booking CTA (destination pages carry no hotel-booking surrogate by design); no rates or review counts published.

## Publication record

- Content commit: this run's commit, pushed to main; Netlify deploy follows; live verification recorded in the receipt commit.
- CMS mirror: production deploy imports at source_commit; publishable-key read of editorial_documents/local_destinations remains RLS-blocked — owner-side CMS check recommended.
