# 2026-11-10 — Cairo local destination (destinations rotation)

## Gap decision

Rotation direction (ledger): destinations. Whole-site inventory 2026-11-10: live /countries/ lists 19 countries; only 10 country pages carry any "Destinations in ..." rail (12 local-destination entries). Strongest rendered cluster with zero destination coverage: **Egypt/Cairo** — the country page and attraction guide are built around Cairo/Giza, and three owner-published pages live with no city anchor:

- /countries/egypt/ (HTTP 200 2026-11-10) — overview says "Cairo and Giza are an important starting point, but their scale makes careful daily grouping essential"; no "Destinations in Egypt" rail.
- /attractions/cairo-and-giza/ (HTTP 200) — "connected urban region rather than a collection of isolated monuments"; recommends grouping.
- /activities/giza-pyramids-guided-tour/ (HTTP 200) — the published Giza day tour (+ Grand Egyptian Museum).
- /accommodations/marriott-mena-house-cairo/ (HTTP 200) — "at the foot of the Giza Pyramids"; weighs "its Giza address ... against the time needed for activities elsewhere across the wider Cairo area".

**Rejected / excluded:** the "cairo-giza-without-burning-out" travel insight is owner-withdrawn (withdrawn_do_not_restore, 2026-10-31, `travel_insight_slugs: []` in a Cairo entry) — never referenced, restored, or reused. No legacy draft under any Cairo-ish slug in editorial-overrides / local-destinations / booking-destinations (grep 2026-11-10: only attraction/hotel/activity keys).

Reader impact: first-time visitors arriving at the Giza pages or Mena House get the city decision the site keeps describing — Giza-side vs central-city base, cross-city traffic allowance, one grouping per day — answered by a real destination page whose Where-to-stay rail carries the hotel.

## Photos — 7 distinct licensed Commons files (hero + 6), all new to the library

| file | subject | creator | licence |
|---|---|---|---|
| late-evening-qasr-al-nil-tower-2012.jpg | Qasr al-Nil bridge + Cairo Tower at dusk (hero) | Frank Schulenburg | CC BY-SA 3.0 |
| cairo-tower-daytime-lemay-2019.jpg | Cairo Tower over Gezira | Warren LeMay | CC0 1.0 |
| saladin-citadel-lascar-2012.jpg | Saladin Citadel walls, Mokattam hill | Jorge Láscar | CC BY 2.0 |
| muizz-street-market-argenberg-2007.jpg | Muizz Street market, Islamic Cairo | Vyacheslav Argenberg | CC BY 4.0 |
| talaat-harb-street-argenberg-2007.jpg | Talaat Harb street, downtown | Vyacheslav Argenberg | CC BY 4.0 |
| hanging-church-courtyard-mayer-2008.jpg | Hanging Church, Old Cairo | Daniel Mayer | CC BY-SA 4.0 |
| egyptian-museum-tahrir-facade-delso-2011.jpg | Egyptian Museum facade, Tahrir | Diego Delso | CC BY-SA 3.0 |

Sequential downloads (rate-limit respected after an early 429), resizes to 1800 px wide q85, SHA-256 in photo-library entries. Rejected photo: "منظر علوي للقاهرة..." (AKA top view from Saladin citadel, Ashour CC BY-SA 4.0) — downloaded and discarded, a wooden balustrade dominates the frame; replaced with the Jorge Láscar citadel exterior. Also rejected: "Lighting Unit – Qahwa – khan el khalili Street" (single lamp close-up, too abstract for a destination gallery).

## Copy sources

- The four on-site guides above (quotations marked in the page text; re-read live 2026-11-10).
- experienceegypt.eg (Egyptian tourism authority) — 403 to automated fetch this run; no new quotation taken, only the crediting wording already used on our published guides.
- Cairo Governorate electronic portal, transportation services incl. metro (HTTP 200 2026-11-10; metro details behind scripted rendering — reference link only, no figures reprinted).

No booking CTA for the destination itself: booking-destinations.json has no destinations section by design; the page gains its booking texture only through the Mena House hotel card.
