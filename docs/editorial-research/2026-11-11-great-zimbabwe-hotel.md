# Great Zimbabwe Hotel accommodation guide — research ledger

**Date:** 2026-11-11
**Category:** accommodations
**Slug:** great-zimbabwe-hotel
**Status:** Research complete, ready to draft

## Evidenced gap

- Live `/attractions/great-zimbabwe-national-monument/` (HTTP 200, 11 Nov 2026) renders **no Nearby stays section** — the page ends at "Booking option" with no stays carousel.
- Live activity `/activities/great-zimbabwe-guided-monument-visit/` explicitly references "Great Zimbabwe Hotel's listed 2–3 hour tour" and "the hotel's advertised tour" with lobby departure.
- No accommodation guide for Great Zimbabwe Hotel exists in `content/editorial-overrides.json` (grep confirmed).
- No Masvingo local destination page exists to host a Where-to-stay rail.
- This is a clear, evidenced accommodation gap in the Southern Africa / Zimbabwe cluster.

## Sources (all checked 2026-11-11)

| Source | URL | Checked | Notes |
|--------|-----|---------|-------|
| Official hotel website (home) | https://greatzimbabwehotels.com/ | 2026-11-11 | History, location (700m from monument), room categories, facilities, activities, contact |
| Official hotel rooms page | https://greatzimbabwehotels.com/rooms/ | 2026-11-11 | Three room categories with descriptions: Standard, Executive, Deluxe Twin |
| Official hotel tour page | https://greatzimbabwehotels.com/great-zimbabwe-tour/ | 2026-11-11 | Monument Tour product details: 2-3 hours, lobby departure, multiple daily departures |
| Existing activity guide | `/activities/great-zimbabwe-guided-monument-visit/` | 2026-11-11 | References hotel tour, confirms hotel exists and operates tours |
| Existing attraction guide | `/attractions/great-zimbabwe-national-monument/` | 2026-11-11 | Confirms no Nearby stays section; monument 27 km from Masvingo |
| Booking.com search | `https://www.booking.com/searchresults.html?ss=Great+Zimbabwe+Hotel` | 2026-11-11 | **No exact property listing found** — results show Mineheart Great Zimbabwe Lodge (different property, 2.8 km away) and other Masvingo properties |
| UNESCO Great Zimbabwe | https://whc.unesco.org/en/list/364/ | 2026-11-11 (prior) | Historical context, not current visitor logistics |

## Key facts verified

- **Location:** 700m from Great Zimbabwe National Monument, Masvingo Province, Zimbabwe
- **History:** Established early 20th century for tourists/archaeologists visiting the monument; architecture blends with ruins (stonework themes)
- **Room categories (operator-stated):**
  - Standard Room: king-sized bed, en-suite bathroom with high-pressure shower, 12-hour room service, complimentary Wi-Fi, daily housekeeping, work desk, hairdryer, in-room safe, iron
  - Executive Room: separate bedroom and lounge area, high-speed internet, 12-hour room service, modern amenities
  - Deluxe Twin Room: two double beds, walk-in shower, complimentary high-speed Wi-Fi, 12-hour room service, dedicated work desk
- **Facilities:** Swimming pool, restaurant, curio shop, bar, campsite (exclusive, within hotel grounds), conference/event facilities (multiple rooms, boardrooms to auditoriums, AV tech)
- **Activities (operator-offered):** Great Zimbabwe Monument Tours (2-3 hours, lobby departure, multiple daily), Lake Mutirikwi Adventures, Kyle Game Park Safari, Cultural Evenings
- **Contact:** +263 772 132 153-5, +263 772 132 171-3, VoIP +263 8677 007 458, reservations@greatzimbabwehotels.com
- **Booking.com:** No exact property detail page found (search-verified 2026-11-11). Mineheart Great Zimbabwe Lodge is a different property 2.8 km from the monument.
- **Distance to monument:** 700m (operator-stated) vs NMMZ 27 km from Masvingo town — hotel is at the monument site.

## Canonical relationships

- **Attraction:** `repo:attractions:great-zimbabwe-national-monument` (repo-managed, no Supabase row)
- **Activity:** `great-zimbabwe-guided-monument-visit` (already published)
- **Country:** Zimbabwe (country_id 55, region_id 15 Southern Africa)
- **Local destination:** None yet (Masvingo not published)

## Photo backlog (six distinct licensed subjects required)

1. Hotel exterior with stonework themes blending with ruins
2. Standard Room interior (king bed, en-suite)
3. Executive Room lounge/bedroom separation
4. Deluxe Twin Room (two double beds)
5. Swimming pool and restaurant/curio shop area
6. Campsite within hotel grounds with monument proximity

*No licensed property photographs available at research time. Official site imagery is operator-copyrighted. Licensed-reuse review only; no substitutes.*

## Booking CTA

**None.** No verified exact OTA product. Booking.com search for "Great Zimbabwe Hotel" returns Mineheart Great Zimbabwe Lodge (different property) and other Masvingo listings. The official site takes direct reservations via email/phone. Per Ridge Royal standard: no rate, availability, rating, or review-count claims.

## Drafting notes

- Use explicit `<p>` tags in `detail_intro`, `practical_info`, and other rich-text fields (per Lemon Beach Resort format fix: `renderEditorialText` skips paragraph wrapping when HTML anchors detected).
- Structure: location → rooms → facilities → activities → monument proximity → contact/booking honesty.
- `attraction_id`: `repo:attractions:great-zimbabwe-national-monument` (enables Nearby Attractions carousel on accommodation page).
- `nearby_stays`: none (first Masvingo-area stay).
- Honest `traveler_feedback`: "No attributable dated guest reviews verified for Great Zimbabwe Hotel at time of publication."
- Zero-image honest publish; six-subject photo backlog logged above.

## Files to create/update

1. `content/editorial-overrides.json` — add accommodation record
2. `content/booking-destinations.json` — no entry (no verified Booking.com URL)
3. `docs/editorial-progress.json` — add deliverable key with status, commit, live verification
4. Research ledger: this file