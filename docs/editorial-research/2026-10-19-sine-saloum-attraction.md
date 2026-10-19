# Sine-Saloum Delta attraction guide — 19 October 2026

## Scope and visitor need

Expanded the existing Senegal attraction record into a practical guide to the Saloum Delta's cultural landscape, waterways, local livelihoods and route planning. This is a useful category-rotation deliverable outside recent Uganda coverage. The guide distinguishes the wide World Heritage property from a single park entrance or one standard boat route, and helps visitors choose a base before arranging an excursion.

The existing Senegal country relationship remains canonical (`country_id: 50`; attraction `id: 66`). The existing Les Palétuviers Boutique Hotel record remains linked through `attraction_id: 66`; its Toubacouta location is described as one base in the wider delta. No activities were linked because no matching published activity record was verified. The exact GetYourGuide Saloum excursion already present in the shared booking registry was reopened and confirmed on 19 October; the attraction template's shared resolver builds its tracked URL from that exact product entry.

## Claim-level research checked 19 October 2026

| Claim or editorial use | Source and evidence | Limits applied |
| --- | --- | --- |
| The Saloum Delta World Heritage property is formed by the arms of three rivers, with brackish channels, more than 200 islands and islets, mangrove, Atlantic and dry-forest environments, 218 shellfish mounds and burial sites on some mounds. | UNESCO World Heritage Centre, https://whc.unesco.org/en/list/1359/ | Used as cultural and environmental context. A World Heritage listing does not mean every island, mound or burial place is open to visitors. The guide directs visitors to follow local access guidance. |
| Women's shellfish-harvesting knowledge is a living heritage of the delta. | UNESCO, https://www.unesco.org/en/articles/ancestral-shellfish-harvesting-living-heritage-women-saloum-delta | Used to frame harvesting as contemporary knowledge and livelihood; no visitor participation or access is implied. |
| Senegal has dry and rainy seasons, and rainfall varies regionally; the tourism agency presents November–May as the broad dry-season window. | Senegal Ministry of Tourism, https://mcat.gouv.sn/climate/ ; Agence Sénégalaise de Promotion Touristique, https://www.visitezlesenegal.com/en/destinations/sine-saloum/ | Broad national guidance only. No delta-specific weather forecast, bird season guarantee, road condition or water level was asserted. |
| Toubacouta and Ndangane are recognized place names within the Sine-Saloum destination area; local canoe outings are among the experiences promoted by the national tourism agency. | Agence Sénégalaise de Promotion Touristique, https://www.visitezlesenegal.com/en/destinations/sine-saloum/ | The guide uses place names only to explain that start points differ. It does not copy wildlife counts, fixed route lengths or schedules from promotional copy. |
| Visitor written 22 April 2025 praised the scenery, birds and lunch stop; visitor written 15 November 2024 said boat noise hindered birdwatching and the route between stops felt repetitive. | Tripadvisor, Saloum Delta visitor reviews, https://www.tripadvisor.co.uk/Attraction_Review-g1439769-d479357-Reviews-Parc_National_du_Delta_du_Saloum-Ndangane_Fatick_Region.html | Reported as individual, dated views and converted into questions about route, motor noise and quiet viewing. No rating, count, operator endorsement or typical experience inferred. |
| GetYourGuide product 1243074 remains the exact "Dakar: Saloum Islands Full-Day Tour with Lunch & Drinks" excursion, from Dakar or Petite Côte; its current product page listed one verified review and operator Travel with ziggy. | GetYourGuide, https://www.getyourguide.com/dakar-l32481/dakar-saloum-islands-full-day-tour-with-lunch-drinks-t1243074/ ; shared registry entry in `content/booking-destinations.json` | Existing registry's October 11 check was refreshed from the current product page on October 19. Itinerary, pickup coverage and inclusions are product-specific and can change; one review is limited evidence. The resolver converts this exact GYG listing through the site's shared Stay22 path. No rate, availability or endorsement is asserted. |
| Les Palétuviers Boutique Hotel's existing record identifies Toubacouta as its location and links it canonically to attraction 66. | Existing accommodation record in `content/editorial-overrides.json` | The relationship predates this guide. No current price, room availability, amenities or inclusion in a particular boat excursion is claimed. |

## Image follow-up — 1/6 dedicated photos

The guide retains its verified, location-specific Commons image as a single-photo hero; the existing photo library records source, creator, license and subject. Five further distinct images remain for the separate image workflow:

1. Mangrove-lined bolong and pirogue, with the departure area verified.
2. Delta island or shoreline landscape with a precise location caption.
3. Shell mound landscape only from a visitor-accessible viewpoint and with respectful context.
4. Birdlife in the delta, photographed at a distance that avoids disturbance.
5. Community or shellfish-harvesting image only with informed consent and photographer/source/license confirmed.

Do not reuse Les Palétuviers property photos as attraction images, depict a generic Senegal coastline as the delta, or photograph residents at work without permission.

Existing hero credit: Issathiome, “A nesting site in the Sine-Saloum Delta, Senegal,” Wikimedia Commons, CC BY-SA 4.0. File and credit record: `src/lib/photo-library.js`.

## Owner input

Helpful future input: a recommended local guide or community-run outing with a verifiable public source, including whether it supports quieter wildlife viewing and what the hosted visit includes. This is an optional enhancement, not a blocker to the current guide.

## Publication checkpoint

Edited only the Sine-Saloum record in `content/editorial-overrides.json` and added this research ledger. The nearby stay and exact OTA relationships were already canonical. One exact-location photo is retained, with five additional images outstanding. Live state is not yet confirmed.
