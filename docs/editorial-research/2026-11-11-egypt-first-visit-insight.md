# Egypt First-Visit Planning Insight — Research Ledger

**Date:** 2026-11-11
**Category:** travel_insights
**Rotation:** accommodations → travel_insights (per editorial-progress.json rotation.next_category)
**Evidenced gap:** Live travel-insights archive (HTTP 200, 11 Nov 2026) holds 13 stories; zero Egypt coverage. Live Egypt cluster (all HTTP 206 200): Egypt country guide, Cairo destination, Cairo & Giza attraction, Giza pyramids guided day tour activity, Marriott Mena House stay. The Cairo destination page explicitly frames the base decision: "Plan the stay around one grouping decision before anything else: a Giza-side base for a monument-focused visit, or a central-city base for a museum-and-neighbourhoods visit" — with no insight behind it. Northern Africa has only two insights (Tunis first night, Marrakech riad vs Gueliz); Egypt has none.

---

## Official Sources (claim-level URLs, checked 2026-11-11)

### 1. UK FCDO Egypt Entry Requirements
**URL:** https://www.gov.uk/foreign-travel-advice/egypt/entry-requirements
**Check date:** 2026-11-11
**Key facts:**
- Passport must have expiry date at least 6 months after arrival date + at least one blank page
- British passport holders normally need a visa
- **Sharm El Sheikh exception:** Arriving by air, staying <15 days at resorts in Sharm El Sheikh, Dahab, Nuweiba, Taba → free entry permission stamp on arrival (no visa)
- **E-visa:** Online in advance, tourist e-visas valid up to 3 months
- **Visa on arrival (traditional):** Approved airports have kiosks before immigration, USD 30 cash only, valid up to 30 days
- **NEW from 1 August 2026:** Cairo International Airport digital visa on arrival via self-service machines or Visa on Arrival portal, USD 36 (incl. USD 6 digital service fee), card payment only
- **Visa extensions:** At Egyptian Passport and Immigration Offices; fine if expired >14 days
- **Taba Border Crossing (from Israel):** Complex cash-only fees: border tax USD 20 (Sinai only, 15 days), USD 120 (beyond Sinai), plus USD 30 visa + USD 20 "letter of guarantee" for mainland travel; USD 100 car fee; ATMs unreliable
- **Aqaba-Nuweiba/Taba Heights ferry:** Contact operators directly; visa USD 35 (Taba Heights) or USD 30 (Nuweiba) if staying >15 days or travelling beyond Sinai
- **Yellow fever certificate:** Required if coming from transmission-risk country
- **Currency:** Up to 5,000 EGP in/out; declare foreign currency >USD 10,000
- **Electronics:** Declare high-value devices; satellite phones/radio equipment likely confiscated without Ministry of Telecommunications clearance

### 2. Experience Egypt — Official Egyptian Tourism Authority
**URL:** https://www.experienceegypt.eg/en
**Check date:** 2026-11-11
**Key facts (from homepage and accessible sections):**
- Four main travel regions presented: **The Nile**, **The Red Sea**, **The Med**, **Deserts & Oases**
- "Where to Go" section structures the country by these four corridors
- Key museums highlighted: Grand Egyptian Museum (GEM), National Museum of Egyptian Civilization (NMEC), Museum of Islamic Art, The Egyptian Museum (Tahrir Square)
- "Plan Your Trip" section includes: Visa guide, Practical Info, Travel Safe, Getting Around, How to Get There, Useful Numbers
- Deep links (/en/plan-your-trip/visa-guide, /en/plan-your-trip/practical-info, /en/where-to-go) redirect to homepage in this environment — core navigation structure and region/museum taxonomy captured from landing page
- Contact: 19654 inside Egypt, info@mota.gov.eg
- Official promotional website of Egyptian Tourism Authority, Ministry of Tourism and Antiquities, Arab Republic of Egypt

### 3. UNESCO World Heritage — Memphis and its Necropolis (ID 86)
**URL:** https://whc.unesco.org/en/list/86/
**Check date:** 2026-11-11
**Key facts:**
- Inscribed: 1979 | Criteria: (i)(iii)(vi)
- Covers Pyramid Fields from Giza to Dahshur (16,358.52 ha)
- **Great Pyramid of Khufu:** Only surviving wonder of the ancient world
- **Step Pyramid of Djoser (Saqqara):** Oldest pyramid, first monumental stone building
- 38+ pyramids total (Giza three, Abusir, Saqqara, Dahshur)
- Great Sphinx at Giza
- 9,000+ rock-cut tombs (1st–30th Dynasty + Graeco-Roman)
- Protection: Antiquities Law No. 117 of 1983, amended by Law No. 3 of 2010
- Giza Plateau Master Plan underway; no buffer zone yet (work ongoing)
- Management challenge: five major archaeological sites need unified governance

---

## On-Site Cluster Continuity (all checked live 2026-11-11)

| Page | URL | Key Planning Framing |
|------|-----|---------------------|
| Egypt country | /countries/egypt/ | "Cairo and Giza are an important starting point, but their scale makes careful daily grouping essential... Heat, traffic and timed access should shape the plan as much as the attraction list." |
| Cairo destination | /countries/egypt/cairo/ | **"Plan the stay around one grouping decision before anything else: a Giza-side base for a monument-focused visit, or a central-city base for a museum-and-neighbourhoods visit"** — our Marriott Mena House guide demonstrates the trade |
| Cairo & Giza attraction | /attractions/cairo-and-giza/ | "A well-designed stay groups nearby experiences together, gives major sites time, and allows pauses" |
| Giza pyramids day tour | /activities/giza-pyramids-guided-tour/ | "Combine time on the Giza plateau with a carefully paced museum visit, or give the pyramids a day of their own. Separate outdoor guiding, pyramid interiors, museum tickets and transfers when comparing tours" |
| Marriott Mena House stay | /accommodations/marriott-mena-house-cairo/ | Explicit: "weighing its Giza address ... against the time needed for activities elsewhere across the wider Cairo area" |

**Cross-links all live:** Cairo destination → Cairo & Giza attraction, Giza day tour, Marriott Mena House; Egypt country → Cairo destination card; all internal links HTTP 200.

---

## Proposed Insight Structure (matching Tunis/Marrakech decision-order pattern)

**Slug:** `plan-first-egypt-visit-cairo-giza-nile-red-sea`
**Title:** Plan a first Egypt visit: Cairo/Giza base, Nile journey, or Red Sea coast
**Category:** Practical travel (matching Tunis, Marrakech, Kigali-Volcanoes, Kenya first safari)

### Decision-order sections (h3 flow)

1. **The first choice that shapes everything: where you sleep on night one**
   - Giza plateau base (Marriott Mena House model) — monument mornings, museum afternoons, traffic allowance real
   - Central Cairo base (Downtown/Tahrir/Islamic Cairo) — museum-first, neighbourhoods, Nile corniche evenings, plateau day trip with early start
   - *Verbatim anchor from Cairo destination:* "Plan the stay around one grouping decision before anything else"

2. **The second choice: how far the journey goes**
   - Cairo/Giza only (3–4 days): pyramids day, museum day, Islamic/Coptic Cairo day
   - Add the Nile (Luxor/Aswan, 4–5 more days): flight vs sleeper train vs cruise; Luxor temples, Valley of Kings, Aswan High Dam/Philae
   - Add Red Sea (Hurghada/Sharm El Sheikh, 3–5 days): dive/snorkel, resort logic, Sharm 15-day visa-free window
   - Desert/Oases (Siwa, Bahariya, White Desert): separate corridor, 4WD required

3. **The visa rule that changes the map**
   - Standard: e-visa (3 months) or visa on arrival USD 30 cash (most airports)
   - **New Aug 2026:** Cairo Airport digital visa on arrival USD 36 card only
   - **Sharm El Sheikh 15-day free stamp** — only for resort stays in South Sinai, not transferable to Cairo/Nile
   - Taba/ferry crossings: cash-only, complex fees, not for first-timers
   - *Source: UK FCDO 2026-11-11*

4. **Museum tickets and pyramid interiors: separate decisions, separate queues**
   - Grand Egyptian Museum (GEM) — new flagship, timed entry, reserve officially
   - National Museum of Egyptian Civilization (NMEC) — Royal Mummies Hall, separate ticket
   - The Egyptian Museum (Tahrir) — historic collection, different focus
   - Pyramid interiors (Khufu, Khafre, Menkaure) — separate tickets, limited daily slots, book with guide
   - *Source: Cairo destination + Giza activity guidance + Experience Egypt museum list*

5. **Heat, traffic, and the daily rhythm**
   - Plateau mornings (early, before 10:00), museum midday, neighbourhoods late afternoon
   - Cairo traffic real: Giza ↔ Downtown 45–90 min depending on hour; build daily allowance, not map estimate
   - Summer (Jun–Aug) extreme heat on plateau; shoulder (Oct–Apr) most comfortable
   - *Source: Egypt country guide + Cairo destination "Heat, traffic and timed access should shape the plan"*

6. **Confirm before you book**
   - Exact museum/park opening arrangements close to travel (GEM phased opening, pyramid interior rotations)
   - Named airport pickup + transfer (per attraction guide instruction)
   - Guide names included sites/museums, not vague packages; separate admission, guiding, transport
   - Walking surfaces/accessibility at each site (plateau sand, pyramid interior climbs, museum stairs)
   - Current official entry/travel advice (FCDO regional warnings: all travel advised against in parts, essential-only in others)
   - Photography/conduct rules per site (not uniform)

7. **Packing from official recommendations**
   - Sun protection (wide brim, high SPF), lightweight long sleeves for plateau/mosques
   - Comfortable closed shoes for uneven stone/sand; pyramid interior climbs need fitness
   - Power bank, cash (USD for visa on arrival, small EGP for tips), declared electronics
   - Modest dress for Islamic/Coptic sites; scarf for mosque entry

8. **Three questions travelers actually ask**
   - *Can I do Cairo and Luxor in 5 days?* Only by flying; sleeper train eats a day each way; cruise is 4+ nights
   - *Is the Sharm 15-day stamp useful if I want to see Cairo too?* No — it's Sinai-only; you'd need a full visa for mainland
   - *Do I need a guide for the pyramids?* Not mandatory for exterior, but interior tickets and site context strongly favour licensed guide; touts aggressive at plateau entrance

9. **Continue planning**
   - Internal links: Egypt country, Cairo destination, Cairo & Giza attraction, Giza pyramids day tour, Marriott Mena House stay
   - Cross-region: When ready for Nile, see Luxor/Aswan (not yet published); Red Sea resorts (not yet published)

10. **Sources and scope**
    - UK FCDO Egypt entry requirements (2026-11-11)
    - Experience Egypt (Egyptian Tourism Authority) — regions, museums, visa guide structure (2026-11-11)
    - UNESCO Memphis and its Necropolis (ID 86, inscribed 1979) — Outstanding Universal Value, protection framework (2026-11-11)
    - On-site Trek Africa Guide cluster (Cairo destination, Cairo & Giza attraction, Giza day tour, Marriott Mena House) — all live HTTP 200 2026-11-11
    - *No rates, star counts, review scores, or availability claims published. All fees/visa rules carried with check date and "confirm with operator/authority" hedges.*

---

## Photo Backlog (six distinct licensed subjects, not reusable from Cairo destination/Marriott Mena House collections)

1. Giza plateau at dawn with Great Pyramid silhouette (CC-licensed)
2. Grand Egyptian Museum exterior or atrium (CC-licensed)
3. Nile felucca at Cairo corniche sunset (CC-licensed)
4. Islamic Cairo market street (Khan el-Khalili or Muizz) (CC-licensed)
5. Red Sea coral/beach scene (Hurghada or Sharm) (CC-licensed)
6. Luxor Temple or Karnak at night (CC-licensed) — for the Nile chapter
*Licensed-reuse review only; no substitutes. Official-site imagery is authority-copyrighted.*

---

## Booking CTA
**None by design** — insight pages carry no product CTA (house pattern). Revenue surface goes to the published Giza day tour (GetYourGuide via Stay22) and Marriott Mena House (Booking.com via Stay22) cross-links. No booking-destinations.json entry added.

---

## Next Steps
1. Write editorial override entry in content/editorial-overrides.json
2. Update docs/editorial-progress.json with deliverable key
3. Run check-build-inputs.mjs and full production build
4. Commit, push, verify live HTTP 200
5. Append run-log.md entry and refresh memory