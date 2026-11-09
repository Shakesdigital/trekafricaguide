# Nairobi Serena Hotel — accommodation deliverable ledger

Run: 2026-11-09 (15:13 UTC routine, executed on time). Category rotation: **accommodations** (per docs/editorial-progress.json rotation).

## Why this, now (live evidence, checked 2026-11-09)

- Live Nairobi destination guide `https://trekafricaguide.com/countries/kenya/nairobi/` (HTTP 200, fetched this run) renders NO stays rail at all — its card system covers only the country guide, two attractions and one activity. The page's own copy already tells the traveler to "build a rested bednight in the city around dinner and the shopping and craft streets," but no Nairobi city stay exists to book.
- Accommodations archive `https://trekafricaguide.com/accommodations/` (HTTP 200, fetched this run): every Kenya property is in-park (Governors' Camp – Mara; Ol Tukai and Amboseli Serena – Amboseli). Zero Nairobi city-stay guides site-wide.
- Direct precedent: the same gap was filled for Kigali today with Kigali Serena (`accommodation_kigali_serena` in the progress ledger) — a Nairobi city-stay follows the identical destination-page stay-card pattern.
- Other related-item rule: no duplicate of any published property; no name slip.

## Selected record

- **Nairobi Serena Hotel** — `accommodations/nairobi-serena-hotel` (new repo record, region_id 14 east-africa, country_id 46 kenya).
- Booking destination key: `booking-destinations.accommodations.nairobi-serena-hotel` → exact Booking.com property detail `https://www.booking.com/hotel/ke/nairobi-serena.html` (search-verified 2026-11-09; direct OTA fetch automation-blocked per the Ridge Royal standard — no rate, availability, rating or review-count published; identity cross-checked against the official Serena site and its Kenyatta Avenue address).
- Destination relationship: `local-destinations.json` `nairobi.accommodation_slugs` += `nairobi-serena-hotel` (fills "Where to stay" on the live Nairobi page).

## Sources (claim-level, checked 2026-11-09)

1. **Official property site — https://www.serenahotels.com/nairobi/ (full page fetched this run)**
   - Positioning: "Best 5-Star Hotel in Nairobi" operator headline; "tucked beside Central Park," "near the Central Business District," "a short drive from Jomo Kenyatta International Airport"; design influences Ethiopia / Maghreb / West Africa / East Africa.
   - **196 remodeled rooms and suites** (operator count; a third-party site lists 183 rooms — the conflicting figure is NOT published).
   - Room categories with sizes/samples: Deluxe Room 26 sqm queen (city/Expressway/canopy views, complimentary soft-drink minibar, tea/coffee station, high-speed Wi-Fi, 24 h room service); Deluxe Twin; Accessible Deluxe; Executive Room (5th floor, Premier Lounge access, airport transfer visit-and-greet, 30-min Maisha Spa massage); Premium Room 26 sqm floors 6–7, Art Deco styling, espresso machine, lounge access; Superior Room 44 sqm king, private balcony, separate bathtub + walk-in shower; Executive Suite 51 sqm (5th–7th floors); Lamu Suite 115 sqm (kitchenette); Chale Presidential Suite 167 sqm (highest floor, private fitness studio).
   - Dining: Herbs & Spices (South-East Asian, daily 11:00–23:00); Mandhari Fine Dining (Tuscan-style terrace over pool, live piano, Captain's Table; Sunday closed); Café Maghreb (all-day buffet, table d'hôte, thematic dinner nights); Aksum Bar (Ethiopian-inspired interiors, from 08:00); Bambara Lounge (West-African styling); Pool Bar; 24-hour room service.
   - Facilities: Maisha Health Club & Spa (treatments at a fee), heated swimming pool, ballroom + named event rooms ("five minutes from the CBD").
2. **Booking.com exact property detail** — search-verified URL above; address "Kenyatta Avenue, 00100 Nairobi" matches official location. Scoring snippet seen (8.9/419) deliberately NOT published (OTA-score rule).
3. **On-site cross-links**: the new page's practical_info links `/countries/kenya/nairobi`; the destination guide gets the `Where to stay` card back through `accommodation_slugs`.

## Honest-gaps record

- No property photographs (site pattern for this and the Kigali Serena precedent): neutral no-photo state is deliberate; six-subject exact-property follow-up queued: exterior/beside Central Park, Deluxe room, Premium room with skyline, Superior room balcony, Mandhari or Aksum interior, pool terrace.
- No published rate, availability, star from OTA, review count or booking-date price. "Luxury (operator five-star positioning; not a live price comparison)."
- No third-party 183-room count published (conflicts with the official 196 figure).
- The OTA 8.9 "excellent" snippet remains unpublished per the same standing rule.

## Files touched

- `content/editorial-overrides.json` (new accommodations record, appended)
- `content/booking-destinations.json` (new booking destination entry)
- `content/local-destinations.json` (nairobi.accommodation_slugs linked)
- `docs/editorial-research/add-nairobi-serena-accommodation.cjs` (idempotent add-script, kept as evidence)
- `docs/editorial-progress.json` (deliverable key + rotation)
