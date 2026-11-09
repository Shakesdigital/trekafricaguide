# Maun local destination (Botswana) — research ledger, 9 November 2026

## Selection

- **Rotation category:** destinations (all four categories shipped in the previous 12-hour cycle: Kigali destination, Bwindi-vs-Volcanoes insight, Kigali Serena accommodation, South Luangwa activity).
- **Evidence (live site, 9 November 2026):**
  - `https://trekafricaguide.com/attractions/okavango-delta/` (HTTP 200) references Maun three times: a gallery caption shot "near Maun", and the booking activity described as "Departs from Maun" (GetYourGuide product `t604726`, destination page `maun-l116302`).
  - `https://trekafricaguide.com/activities/okavango-mokoro-safari/`: "A Maun-based full-day outing…" — the published activity's departure point has no town guide behind it.
  - `https://trekafricaguide.com/countries/botswana/` (HTTP 200) contains **zero** mentions of Maun and no "Destinations in Botswana" section — Botswana is the only showcase delta country without a gateway-city guide; same gap shape as Rwanda → Kigali (published 9 Nov 2026 02:17).
- **Reader impact:** travellers booking Maun-departing mokoro trips or light-aircraft delta transfers have no arrival/gateway planning page; the Botswana country page carries no destination carousel at all.
- **Category:** destinations (local destination `maun` under country `botswana`).

## Sources (claim-level URLs, checked 2026-11-09)

1. **Botswana Tourism Organisation — Maun** — https://www.botswanatourism.co.bw/explore/maun (HTTP 200, fetched directly): tourism capital on the southern fringes of the Delta; dusty frontier-town feel despite modernisations; gateway into the Delta for many tourists and often into Botswana; busy airport receives direct flights from Johannesburg and Gaborone; administrative centre of Ngamiland District; Batawana seat of power (capital moved Lake Ngami → Toteng → Tsao → Maun, 1915); district ethnic mix (Hambukushu, Basubiya, Bayei, Banoka "River Bushmen, the Okavango's original inhabitants", Bakgalagadi, Baherero); Herero women in Victorian-style dresses; tourists "merely using Maun as a transit point"; villages along the western fringes and panhandle worth the effort; safari companies abound; malls/shops/hotels/guesthouses; Thamalakane River through town.
2. **UNESCO World Heritage Centre — Okavango Delta (id 1432)** — https://whc.unesco.org/en/list/1432/ (fetched directly): inscribed 2014 (site reached 1,000 inscriptions); permanent marshlands + seasonally flooded plains; "one of the very few major interior delta systems that do not flow into a sea or ocean"; annual flooding occurs **during the dry season**, flood pulse "at the peak of the Botswana's dry season (June/July)"; Moremi Game Reserve covers ~40% of the property; inner-Delta tourism "limited to small, temporary tented camps with access by air"; near-pristine wetland; Botswana's ~130,000 elephants, Okavango core area.
3. **BTO Climate** — https://www.botswanatourism.co.bw/climate (HTTP 200): semi-arid; rainy season summer months, peak Jan–Feb; winter May–August = dry season, virtually no rainfall, sunny cool-to-warm days but nights falling rapidly (below zero in some areas); transitional April/early May and Sep/Oct still dry.
4. **BTO Time to Visit** — https://www.botswanatourism.co.bw/travel-info/time-visit (HTTP 200): green season (wet, lush, birthing, birders haven as migrants arrive) vs peak season (winter dry colours, pools dry, rivers fill from Okavango floods concentrating game).
5. **Government of Botswana — About our country** — https://www.gov.bw/about-our-country (HTTP 200): airports in Gaborone, Francistown, Kasane and **Maun**; official seasonal framing (summer Nov–Mar, winter May–Aug dry).
6. **On-site continuity re-read** (9 Nov 2026): Okavango Delta attraction guide, Okavango mokoro activity guide (Maun-based full-day: 4WD transfer + poler-guided mokoro + walk; confirm launch area/conditions — Kalahari Breeze Safaris product lineage), Camp Okavango accommodation guide (island retreat on Nxaragha Island in the permanent delta).

## Deliberately not claimed

- No population figures (sources conflict: 30k vs 85k; BTO page gives none).
- No road distances/drive times (Maun–Kasane, Maun–Moremi gate) — no official source verified in this environment.
- No "busiest airport in Southern Africa" ranking (tour-operator-sourced only); used BTO's own "busy airport".
- No specific airline timetables beyond BTO's "direct flights from Johannesburg and Gaborone".
- No malaria/health claims (no authoritative source fetched this run); no visa advice (country-level, not city-level).
- No traveler reviews quoted (none attributable fetched); no pricing.

## Records & files

- `content/local-destinations.json` — new record `maun` (country_slug `botswana`, category "Town", related: attraction `okavango-delta`, activity `okavango-mokoro-safari`, accommodation `camp-okavango`).
- `docs/editorial-research/add-maun-destination.cjs` — the insertion script (kept for reproducibility).
- Images: zero-image publish per house standard; six-subject backlog below.

## Editorial approach

Town-specific value over transit framing (mirrors BTO's own "people side" point): history through Batawana 1915 seat, district cultural mix, the mokoro day-trip reality, two onward patterns (light aircraft to inner-delta camps vs road day trips), supplied-mall stocking, honest confirm-before-you-book hedges. Season section ties national climate calendar to the UNESCO dry-season flood timing; conditions told as regional-variability (continuity with the activity guide's no-fixed-calendar promise).

## Image backlog (six subjects, distinct from all existing collections)

1. Thamalakane River riverside with reeds, town edge visible
2. Safari Land-Cruisers/light aircraft at Maun airport apron
3. Maun mall or supply shopfront interior (stocking scene, no brands implied)
4. Poler and mokoro at a Maun-side launch area (distinct from the activity page's five existing images)
5. Town-edge donkey/goat traffic on the sandy road (BTO's ordinary-life framing)
6. Rural village scene toward the Delta's western fringes (respectful, settled view; no restricted ceremony imagery)

Every candidate requires licensed-reuse review; no substitutes; never reuse the Okavango attraction, mokoro activity or Camp Okavango collections.

## Publication record

- Content commit: pending
- Receipt commit: pending
- Live URL: https://trekafricaguide.com/countries/botswana/maun/ (verification pending)
- CMS mirror: imported at source_commit; owner-side CMS check pending (`local_destinations/maun`)
