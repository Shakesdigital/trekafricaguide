# Marrakech local destination — research ledger (2026-11-09)

## Selection

- Category rotation: destinations (per `latest_run_checkpoint.next_category` in docs/editorial-progress.json).
- Live evidence (checked 9 Nov 2026):
  - The Morocco country page (HTTP 200, 35,767 bytes) renders **no "Destinations in Morocco" rail** while its copy plans Marrakech directly ("Marrakech rewards time among its streets, courtyards, gardens and architecture…", medina-access and dune-camp warnings).
  - The Marrakech And Atlas attraction page (HTTP 200) renders Related activities (Atlas Mountains guided day trip; Marrakech Medina street-food tour) and Nearby stays (Rosemary Marrakech) with no city guide behind them.
  - The site's homepage search lists **11 destination guides** (Uganda ×3, Kenya ×1, Tanzania ×1, Botswana ×1, Zambia ×1, Ghana ×1, Senegal ×1, South Africa ×1) — **zero from Northern Africa**.
  - `content/local-destinations.json`: 11 records before this run; no `marrakech` slug (duplicate check clean; no duplicate slugs in `editorial-overrides.json` after `git pull --rebase`, 19/30/33/21/20 across tables).
- Egypt was the alternative candidate (Cairo/Giza group) but was not chosen this run: the owner's 2026-10-31 withdrawal still shadows the Cairo content area; Morocco is unshadowed.

## Claim-level sources (all checked 2026-11-09)

1. **Moroccan National Tourism Office (MNTO)** — https://www.visitmorocco.com/en/travel/marrakesh
   - "Say hello to the Red city"; verbatim greeting: "Between tradition and modernity, Marrakech is the promise of unequalled sensations. Strolling the Jemaa El-Fna square and the souks with their shimmering colours and oriental smells, the red city offers you a complete change of scenery."
   - Riads: "small oriental palaces overlooking a beautiful patio". Menara: "a vast garden with an emblematic basin". Gueliz/Hivernage: modern infrastructure, luxury boutiques, international ready-to-wear, airy avenues.
   - Pacing: "Allow 3 days… medina, souks and Jemaa El-Fna square, then Majorelle Garden, El Badi Palace and the Koutoubia Mosque. Day trips: the Agafay desert is about 45 minutes away, the Ourika Valley about 1 hour and Essaouira about 2.5 hours."
   - Best time: "March to May and September to November. Summer is very hot; winter days are mild and evenings cool."
   - Top 5: Jamâa El-Fna Square, Majorelle Garden, El Badi Palace, El Koutoubia Mosque, The Menara basin. "The essentials of Marrakech" names tanjia as the city's mythical dish.
   - MNTO self-identified as the official tourism office. An older ONMT URL (/en/trip/town/marrakech) 404s — the current page is the /en/travel/marrakesh path used here.
2. **UNESCO Intangible Cultural Heritage** — https://ich.unesco.org/en/RL/jemaa-el-fna-square-and-traditional-cultural-performances-morocco-00014
   - "Cultural space of Jemaa el-Fna Square"; inscribed 2008 (3.COM) on the Representative List, originally proclaimed 2001.
   - "One of the main cultural spaces in Marrakesh… since its foundation in the eleventh century"; triangular square at the entrance of the Medina; storytellers, poets, snake-charmers, Berber musicians (mazighen), Gnaoua dancers, senthir players; services and food (dental care, traditional medicine, henna, water-carrying, fruit, traditional food).
   - Protected as part of Morocco's artistic heritage since 1922; serious threats named: urbanisation/real estate speculation/road development and acculturation via widespread tourism.
   - Cross-reference on the same record: Medina of Marrakesh World Heritage site (1985). (Note: whc.unesco.org /en/list/446 fetch returned 404 from this environment this run; the Medina-of-Marrakesh 1985 status is carried only via the ICH record's own cross-reference. Do not add WHS detail beyond that cross-reference until directly verified.)
3. **UK FCDO, Morocco entry requirements** — https://www.gov.uk/foreign-travel-advice/morocco/entry-requirements
   - Tourism without visa up to 90 days (extensions at a Moroccan police station); passport expiry ≥3 months after arrival; keep the border entry stamp (some travellers had difficulties leaving without it); dirham = closed 'non-convertible' currency; declare foreign currency ≥100,000 dirham; damaged passports have been refused entry. Guidance explicitly for full 'British citizen' passports — the page tells non-qualifying nationalities to check with the consulate; the destination page carries the nationality caveat verbatim.
4. **On-site records re-read 2026-11-09** — https://trekafricaguide.com/countries/morocco/ and https://trekafricaguide.com/attractions/marrakech-and-atlas/
   - Country guide: "Confirm the final access to medina accommodation and agree the luggage or pickup arrangement"; "avoid treating a distant dune camp as a simple evening extension of a city break"; spring/autumn inland comfort; "confirm route conditions before a mountain outing"; "Respect local photography expectations".
   - Attraction guide: riad courtyard form; "two unhurried city days and a separate day or overnight for the chosen mountain area"; "an itinerary naming only 'the Atlas' is too vague to compare meaningfully"; "a vehicle may not reach the door. Agree a recognizable meeting point with the hotel"; "Reserve major ticketed sites directly where appropriate"; "Compare stays by walking access, noise, stairs and room facilities"; "Ask permission before photographing people or private activities".

## Not claimed (deliberately)

- No Majorelle/Badi/Koutoubia entry fees, opening hours or booking-notes reprints (official pages not fetched this run; only MNTO's list-level mentions carried).
- No Koutoubia minaret height, medina dimensions, population or taxi/djemaa fee figures.
- No insider "experience" language of our own: no invented sensory prose beyond the attributed quotes.
- No booking CTA: destination pages carry no hotel-booking surrogate by collection rule; the stay surface is the existing Riad Rosemary guide, and the Atlas CTA already lives on the attraction page (GetYourGuide, 4.9/5 × 2,301, held since 2026-10-11).
- Numeral hedge kept: "about 45 minutes/1 hour/2.5 hours" are MNTO's own estimates, attributed inline.

## Publication record

- Slip: `content/local-destinations.json` (record `marrakech`, country `morocco`, sort_order 1, status published, relationships to marrakech-and-atlas / street-food tour + atlas day trip / riad-rosemary).
- Build: production build with EDITORIAL_CMS_SYNC=false per run instructions; check-build-inputs + readability gate.
- Zero-image publish (honest neutral state) per current pattern; six-subject backlog below.
- PR/push: main; commit message "Publish Marrakech destination guide".
- Image backlog (six subjects, licensed-reuse review only, no substitutes, no cross-collection reuse): Jemaa el-Fna square at dusk with food stalls, Koutoubia Mosque minaret against sky, riad courtyard interior, Majorelle Garden cobalt fountain/villa, souk lane with goods, Gueliz boulevard streetscape.
