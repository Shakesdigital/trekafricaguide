# Jozani Forest guided walk — activity research ledger

Date: 2026-11-10 (scheduled 07:13Z run)
Category: activities. Deliverable: NEW activity page `activities/jozani-forest-guided-visit` under the repo-managed attraction `repo:attractions:jozani-forest`.

## Gap evidence

- Live activities archive holds 20 published guides; none cover Jozani (crawl refresh performed this run: home + five directories all HTTP 200, no pagination pages).
- Live Jozani attraction page (https://trekafricaguide.com/attractions/jozani-forest/, HTTP 200, rechecked 10 Nov 2026) leads with a nature-walk reading in "What draws people here" (forest and mangrove habitat interpretation; responsible observation of Zanzibar red colobus; contrast to Stone Town and coastal stays; route planned around the accommodation base), and carries a verified GetYourGuide booking product on the attraction itself — while no dedicated activity page exists.
- The attraction's "What travelers say" section records a demand pattern: visitors praise guides/mangroves but report visits feeling too brief for their cost — a dedicated planning guide resolves how the standard route splits between forest and mangrove and what "included" means.
- Cluster fit: published Unguja destination guide, Zanzibar attraction guide, Stone Town walking-tour activity, two Stone Town/Coast stay guides (Emerson Spice, Dar Said), and the 2026-11-10 Tanzania-pairing insight — none of which covers the island's national park walk.

## Sources (claim-level, checked dates)

1. **Tanzania Tourism (national tourism board), Jozani Chwaka Bay National Park page** — https://www.tanzaniatourism.com/safari/jozani-chwaka-bay-national-park — fetched HTTP 200 (73 kB) 10 Nov 2026. Claims used: largest area of nature forest on Zanzibar Island; south of Chwaka Bay, about 40 km from Stone Town; low-lying land prone to flooding nurturing swamp-like environment; protected as Jozani-Chwaka National Park; Zanzibar red colobus an endangered species found only on Zanzibar; other species (Sykes' monkey, bushbaby, duiker, butterflies, forest flora incl. mangroves); "can be done en route to Paje and southeastern places on Zanzibar." (The page also carries a tour-booking panel — "94% of travelers recommend this experience", free cancellation — which is operator marketing and is NOT used as fact or feedback.)
2. **GetYourGuide exact product t968921 "Zanzibar: Jozani Forest, Nature Walk and Wildlife Tour"** — https://www.getyourguide.com/jozani-l239369/zanzibar-jozani-forest-nature-walk-and-wildlife-tour-t968921/ — direct fetch 403 (bot wall, Ridge Royal standard). Verification: (a) browser session retrieval by the parallel image-automation run 8 Nov 2026 (product 968921, Zanzibar blessing tours and safari, 5/5 from 2 reviews, entrance fee + guided forest and mangrove walk, meeting point Jozani Forest itself, private group up to 40); (b) GYG category listing pages surfaced in a public search 10 Nov 2026 show the same product live: "JOZANI · 2–5 HOURS — Jozani Forest, Nature Walk and Wildlife Tour — Private group • Pickup available — 5 (2) — From $45". Registered as booking-destinations activity entry with both fragments recorded.
3. **Tripadvisor park reviews cited in the Jozani attraction record** (retrieved 16 Oct 2026): angeliki achillles, posted 4 May 2026 (April visit), praised the guide and mangroves; Michela P, 30 June 2026, felt the visit too brief for its cost. Dated, attributable, with meaningful drawback. Reused on the activity page with the same retrieval-date context.
4. **On-site continuity (all live-checked 10 Nov 2026)**: unguja + zanzibar content edges, park description split in the attraction record, Honest-fee posture.
5. **Tanzania Immigration Service Department** — https://www.immigration.go.tz/ — HTTP 200 (title "Home | Immigration Service Department") 10 Nov 2026. Used only as the official entry-guidance pointer; the separate e-Visa application portal (visa.immigration.go.tz) was unreachable from this environment during the check, so no visa rules or fees are reprinted.

Unreachable 10 Nov 2026 (no facts drawn): ZCT (zanzibartourism.go.tz, failed again — carried seasonal claims keep their in-repo 2026-10-16 ZCT verification date), Zanzibar Dept of Forestry host (maliasilismz.go.tz, fetch failed — the reason no official park-entry fee table is printed; the attraction's own honest-fee posture is preserved).

## Deliberate omissions / honesty

- No park-entry or guide-fee figures: (a) authority site unreachable, (b) the attraction record already advises treating discrepancy-prone historic figures as questions to resolve. The verified product's "From $45" is carried as a listing line with a reconfirm hedge, not as a park price.
- No guaranteed-wildlife phrases anywhere; the product's tiny review sample (2) is flagged.
- Zero-image publish honest state; six-subject backlog below.

## Photo backlog (six distinct licensed subjects, never reused)

1. Red colobus in canopy under forest shade, safe distance.
2. Forest path interior between tall trees.
3. Mangrove boardwalk footbridge with roots and water.
4. Guide pointing out something in canopy.
5. Park gate / entrance sign at Jozani.
6. Red mangrove prop-roots close-up along the walkway.

## Booking registration

booking-destinations.activities["jozani-forest-guided-visit"]: product t968921 URL; provider getyourguide; title "Zanzibar: Jozani Forest, Nature Walk and Wildlife Tour"; operator Zanzibar blessing tours and safari; rating 5/5 from 2; both verification fragments (browser 8 Nov 2026; search/category-confirmed 10 Nov 2026) recorded. Stay22 transforms at build; transformed link verified in the built page before push.
