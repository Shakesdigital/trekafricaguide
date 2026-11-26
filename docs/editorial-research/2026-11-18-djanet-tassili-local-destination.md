# Djanet / Tassili n'Ajjer Local Destination — Research Ledger

**Date:** 2026-11-18  
**Category:** destinations (rotation after activities)  
**Gap:** Live `/countries/algeria/` (HTTP 200, 18 Nov 2026) has no "Destinations in Algeria" rail despite having live attraction `/attractions/djanet-and-tassili/` and stay `/accommodations/terres-touareg-guest-house/`. Country page frames Tassili as "major Saharan and archaeological rewards" but no local destination anchor exists.

---

## Evidenced Gap

- **Country page:** https://trekafricaguide.com/countries/algeria/ (HTTP 200, checked 18 Nov 2026) — explicitly describes "Algeria's Tassili n'Ajjer offers a distinctive reason to travel" and "major Saharan and archaeological rewards" but renders **zero Destinations rail**.
- **Attraction:** https://trekafricaguide.com/attractions/djanet-and-tassili/ (HTTP 200, checked 18 Nov 2026) — UNESCO prehistoric rock art, desert geology, expedition planning.
- **Stay:** https://trekafricaguide.com/accommodations/terres-touareg-guest-house/ (HTTP 200, checked 18 Nov 2026) — traditional Tuareg guesthouse in Djanet, pre/post desert itinerary base.
- **Reader impact:** A traveler reading the Algeria country page sees Tassili framed as a primary reason to visit but cannot click through to a local destination guide for practical planning (access, advisory context, seasonal conditions, base logistics).

---

## Research Sources (all checked 18 November 2026)

| Source | Key Facts | URL |
|--------|-----------|-----|
| Wikipedia: Tassili n'Ajjer | UNESCO World Heritage 1982; >72,000 km²; 15,000+ rock art engravings/paintings (12,000 BP to Camel period); five artistic traditions (Archaic, Round Head, Bovidian/Pastoral, Horse, Camel); Saharan cypress/myrtle; West African crocodile (historical); Biosphere Reserve; IBA for sandgrouse, eagle-owls, larks | https://en.wikipedia.org/wiki/Tassili_n%27Ajjer |
| Wikipedia: Djanet | Oasis city, capital of Djanet Province, SE Algeria; 412 km south of Illizi; pop. 14,655 (2008); inhabited by Kel Ajjer Tuareg | https://en.wikipedia.org/wiki/Djanet |
| Smartraveller (Australia) | **Do not travel** within 100 km of borders with Tunisia, Libya, Mauritania; **within 450 km of Mali and Niger borders**; high kidnapping threat in Illizi and Tamanrasset provinces; terrorism threat (high); road travel very dangerous in Tamanrasset/Illizi; visa required in advance; yellow fever cert required; medical facilities limited in remote areas; same-sex relations illegal; alcohol only licensed venues; conservative dress; DZD illegal to import/export; IDP required | https://www.smartraveller.gov.au/destinations/africa/algeria |
| UK FCDO | Advises against **all travel** within 30 km of borders with Libya, Mauritania, Mali, Niger, and Tunisia (Illizi/Ouargla provinces, Chaambi mountains); against **all but essential travel** within 30 km of rest of Tunisia border; updated 25 Sep 2026, govuk updated 12 Nov 2026 | https://www.gov.uk/foreign-travel-advice/algeria |
| Live Trek: Algeria country | HTTP 200, 18 Nov 2026; frames Tassili as "expedition-style journey", "specialist route proposal", "protected landscape" | https://trekafricaguide.com/countries/algeria/ |
| Live Trek: Djanet And Tassili attraction | HTTP 200, 18 Nov 2026; UNESCO prehistoric art, desert geology, specialist guided expedition planning, GetYourGuide 4-day desert adventure (Cozy Vibes Travel) | https://trekafricaguide.com/attractions/djanet-and-tassili/ |
| Live Trek: Terres Touareg Guest House | HTTP 200, 18 Nov 2026; traditional Tuareg guesthouse, rooms 1-4 people, showers, Algerian cooking, established 2024, pre/post desert base | https://trekafricaguide.com/accommodations/terres-touareg-guest-house/ |
| GetYourGuide | Djanet: 4-Day Desert Adventure in Tassili N'Ajjer (Cozy Vibes Travel Algeria) — no published reviews yet; confirm permissions, transport, flights directly | https://www.getyourguide.com/ (via attraction page Stay22 link) |

---

## Advisory Context (Critical)

**Both Smartraveller and FCDO place Tassili n'Ajjer / Djanet in do-not-travel or high-risk zones:**
- Smartraveller: Do not travel within 450 km of Mali/Niger borders (Illizi and Tamanrasset provinces). Djanet is in Illizi Province.
- FCDO: Advises against all travel within 30 km of borders with Libya, Mauritania, Mali, Niger, and Tunisia — specifically naming Illizi and Ouargla provinces.
- **Implication:** This guide exists for cultural understanding and future heritage planning. Current official advice is against travel to the region. A provider's willingness to accept a reservation does not establish that the route is appropriate, that transport will remain available, or that consular assistance can be obtained. The availability of a bookable flight/hotel is not evidence that leisure travel is advisable.

---

## Guide Structure (matching Lalibela quality bar)

- **Hero:** "Djanet and Tassili n'Ajjer: Saharan rock art, desert geology, and the expedition frontier"
- **Category:** Desert expedition base
- **Overview:** UNESCO 1982, 15,000+ rock art pieces, five artistic periods, geological history, living Tuareg culture
- **Advisory framing:** Current do-not-travel guidance (Smartraveller, FCDO) — explicit quotes
- **Access:** Djanet airport (DJG), domestic flights from Algiers; permissions required; road travel not recommended
- **Best time:** Operator-matched to seasonal conditions (heat, wind, overnight temps); avoid broad "year-round" claims
- **Planning tips:** Specialist operator selection, permissions, guiding language, water/camping/comms/evacuation, physical demands, rock art ethics, insurance vs advisory
- **Cross-links:** Attraction (djanet-and-tassili), Stay (terres-touareg-guest-house), Country (algeria)
- **Photo backlog:** Six-subject exact/licensed (UNESCO archival rock art, Djanet oasis, sandstone formations, Tuareg camp, Saharan cypress, guided expedition)
- **Booking:** GetYourGuide 4-day desert adventure (Cozy Vibes) — Stay22 transformed; no verified reviews yet; confirm directly

---

## Zero-Image Honest Publish

No photographs will be fabricated or cross-reused. Six-subject exact/licensed photo backlog recorded:
1. UNESCO archival rock art panel (Tassili n'Ajjer)
2. Djanet oasis aerial/view
3. Eroded sandstone towers/canyon landscape
4. Tuareg desert camp / guided expedition
5. Saharan cypress (Tarout) in situ
6. Terres Touareg Guest House exterior/interior (operator-provided, licensed)

Credits and licenses to be retained when sourced.

---

## Next Steps

1. Write local destination JSON entry (following Lalibela schema)
2. Add to `content/local-destinations.json` (create if missing)
3. Run `node scripts/check-build-inputs.mjs`
4. Full build with Supabase credentials
5. Commit, push, Netlify deploy
6. Live verification (HTTP 200, distinctive copy, cross-links)
7. Update `docs/editorial-progress.json` and `run-log.md`
8. Stage memory