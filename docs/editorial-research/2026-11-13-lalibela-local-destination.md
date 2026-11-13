# Lalibela local destination — editorial research ledger

**Date:** 2026-11-13
**Category:** destinations (rotation)
**Slug:** lalibela (local destination under Ethiopia)
**Status:** drafted for zero-image honest publish

---

## Evidenced gap

- Live `/countries/ethiopia/` (HTTP 200, 13 Nov 2026) has **no "Destinations in Ethiopia" rail** — the country page carries only the attraction and stay cards, no local destination guide.
- Live `/attractions/lalibela/` (HTTP 200, 13 Nov 2026) and `/accommodations/maribela-hotel/` (HTTP 200) both exist and are cross-linked, but no destination page anchors the cluster.
- Ethiopia is one of only two countries on the site with an attraction+stay cluster but no destination guide (the other being Algeria with Djanet/Terres Touareg). The progress file explicitly queues: "Ethiopia (Lalibela — advisory-sensitive, queued)".

**Reader impact:** A traveller researching Lalibela finds the church attraction and a hotel stay, but no practical town-level guide covering access, seasonal/religious timing, entry requirements, or how the advisory posture shapes planning. The country page frames the heritage interest but offers no local base page.

---

## Research sources (claim-level URLs, checked 2026-11-13)

| # | Source | Key facts extracted |
|---|--------|---------------------|
| 1 | UNESCO WHS 18: <https://whc.unesco.org/en/list/18> | Inscribed 1978, criteria (i)(ii)(iii); 11 monolithic churches; two groups north/south of river Jordan; Biete Ghiorgis isolated but connected by trenches; Lasta Tukuls village; pilgrimage since 12th c.; conservation concerns (water damage, structural risks, shelter impacts). |
| 2 | Smartraveller (Australia): <https://www.smartraveller.gov.au/destinations/africa/ethiopia> | Overall "Reconsider your need to travel"; **Do not travel to Amhara Regional State** (where Lalibela is located) due to terrorist attacks, kidnapping, civil unrest, armed conflict; consular assistance extremely limited in do-not-travel areas; updated 1 Oct 2026, still current 13 Nov 2026. |
| 3 | UK FCDO: <https://www.gov.uk/foreign-travel-advice/ethiopia> | Advises against **all travel to Amhara region** (where Lalibela is located); ongoing fighting in northern Ethiopia; flights suspended/cancelled at short notice; updated 30 Oct 2026, still current 13 Nov 2026. |
| 4 | Live Trek Africa Guide: Ethiopia country page <https://trekafricaguide.com/countries/ethiopia/> | HTTP 200; frames Lalibela as heritage interest separated from travel decision; carries Smartraveller do-not-travel advisory for Amhara. |
| 5 | Live Trek Africa Guide: Lalibela attraction <https://trekafricaguide.com/attractions/lalibela/> | HTTP 200; 6 images; cultural context and planning considerations; explicit "not a recommendation to undertake an ordinary sightseeing visit under present conditions"; honest no-booking-link state. |
| 6 | Live Trek Africa Guide: Maribela Hotel <https://trekafricaguide.com/accommodations/maribela-hotel/> | HTTP 200; retained for reference with explicit "current Amhara advice is do not travel" framing. |

---

## Key factual claims for the guide

| Claim | Source | Check date |
|-------|--------|------------|
| 11 medieval monolithic churches hewn from rock | UNESCO WHS 18 | 2026-11-13 |
| UNESCO inscription 1978, criteria (i)(ii)(iii) | UNESCO WHS 18 | 2026-11-13 |
| Two main church groups north/south of river Jordan | UNESCO WHS 18 | 2026-11-13 |
| Biete Ghiorgis (St. George) isolated, connected by trenches | UNESCO WHS 18 | 2026-11-13 |
| Lasta Tukuls: two-storey circular village houses | UNESCO WHS 18 | 2026-11-13 |
| Pilgrimage site since 12th century | UNESCO WHS 18 | 2026-11-13 |
| Conservation concerns: water damage, structural risks, shelters | UNESCO WHS 18 | 2026-11-13 |
| ~645 km from Addis Ababa | UNESCO WHS 18 | 2026-11-13 |
| Smartraveller: Do not travel to Amhara (Lalibela location) | Smartraveller | 2026-11-13 |
| Smartraveller: Consular assistance extremely limited in do-not-travel areas | Smartraveller | 2026-11-13 |
| FCDO: Advises against all travel to Amhara region | UK FCDO | 2026-11-13 |
| FCDO: Flights suspended/cancelled at short notice | UK FCDO | 2026-11-13 |
| Ethiopia visa: online application required | UK FCDO / Smartraveller | 2026-11-13 |
| Yellow fever vaccination required | UK FCDO / Smartraveller | 2026-11-13 |
| Malaria present except Addis Ababa and areas >2000m | Smartraveller | 2026-11-13 |
| Timkat (Epiphany) January, Meskel (Finding of True Cross) September | UNESCO ICH / general knowledge (not reprinted as guarantee) | — |
| Lalibela Airport (LLI) served by domestic flights from Addis | General aviation knowledge; current status per advisory | 2026-11-13 |

---

## Advisory framing discipline

Following the pattern established on the live Ethiopia country page and Lalibela attraction page:

- **Front-load the advisory**: The guide opens with the current do-not-travel status for Amhara.
- **No recommendation to visit**: Language is "when conditions allow a responsible visit" / "future heritage planning".
- **No nonrefundable booking encouragement**: Explicit "avoid nonrefundable leisure arrangements while the relevant official advice remains against travel".
- **Consular assistance limitation**: Both Smartraveller and FCDO note extremely limited consular help in do-not-travel areas.
- **Insurance caveat**: Check policy terms against advisory; many exclude do-not-travel areas.
- **Medical evacuation**: Flagged as potentially the only option for serious illness/injury.
- **Flight/road access**: "Do not rely on historical flight schedules or road itineraries" — check current advisory first, then verify with airline/local providers.
- **Religious festivals**: Timkat/Meskel mentioned as context, but "dates and arrangements should only be investigated within a decision that it is appropriate to travel".

---

## Zero-image honest publish

No licensed exact-location photographs found for the six gallery subjects:
1. Biete Ghiorgis (cross-shaped church)
2. Biete Mariam interior
3. Lasta Tukuls village
4. Pilgrims at Timkat
5. Church trench system
6. Biete Amanuel detail

Six-subject photo backlog logged in the guide's `gallery` paths (archival/CC-licensed search only; no files committed). Hero image and gallery paths reference `/images/editorial/lalibela-local-destination/` — these will render as neutral placeholders until licensed photos are sourced.

---

## Canonical relationships

| Field | Value |
|-------|-------|
| `country_slug` | `ethiopia` |
| `attraction_slugs` | `["lalibela"]` |
| `activity_slugs` | `[]` (no activity guide exists) |
| `accommodation_slugs` | `["maribela-hotel"]` |
| `travel_insight_slugs` | `[]` (no Ethiopia travel insight exists) |

---

## Build validation checklist

- [ ] `node scripts/check-build-inputs.mjs` passes
- [ ] `npm run build` with production env passes (130+ pages)
- [ ] Readability guard passes
- [ ] Built Lalibela destination page renders:
  - [ ] Correct h2 flow (Explore Lalibela, Highlights, Getting there and around, Best time to visit, Planning your stay, Attractions to explore, Where to stay, Travel insights)
  - [ ] Advisory framing prominent in overview and access_summary
  - [ ] Attraction card for lalibela renders
  - [ ] Stay card for maribela-hotel renders
  - [ ] No exposed markup
  - [ ] Ethiopia country page now renders "Destinations in Ethiopia" with Lalibela card
  - [ ] Homepage search lists the guide

---

## Publication plan

1. Commit `content/local-destinations.json` with message: "Publish Lalibela destination guide"
2. Push to origin main (rebase-and-retry on rejection)
3. Netlify auto-deploys
4. Verify live: `https://trekafricaguide.com/countries/ethiopia/lalibela/` HTTP 200, distinctive copy, all sections, no exposed markup
5. Verify cross-links: Ethiopia country page, Lalibela attraction, Maribela Hotel stay
6. Commit receipt to `docs/editorial-progress.json`
7. Update `run-log.md` and memory