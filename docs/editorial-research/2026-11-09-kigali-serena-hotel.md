# Kigali Serena Hotel accommodation guide — 9 November 2026

## Selection, evidence and reader impact

Rotation reached accommodations. The live Kigali destination guide (published 2026-11-09, https://trekafricaguide.com/countries/rwanda/kigali/) explicitly renders an empty "stays in Kigali" state and recorded "no Kigali-stay guide is published yet" as follow-up. Supabase public `accommodations` (checked 9 Nov 2026, 24 rows) contains no Rwanda/Kigali city stay; the only Rwanda accommodation is Sabyinyo Silverback Lodge (id 66, Volcanoes foothills). Reader impact: the capital that starts (and often closes) a Volcanoes journey had no published stay guidance, so arrival-evening and pre/post-trek base choices were uncovered. New accommodation record `kigali-serena-hotel` (region 14 east-africa, country 49 rwanda), related to the Kigali local destination via `accommodation_slugs`; no attraction_id and no nearby cards (proximity guessing is not used at this site). Next editorial category: travel insights (checkpoint to record).

## Verified property facts (official operator site, checked 9 November 2026)

- Operator: Serena Hotels, Kigali Serena Hotel page https://www.serenahotels.com/kigali/ — "landmark property in the heart of Rwanda's capital, just five minutes from the Central Business District and 20 minutes from Kigali International Airport"; positioned as a five-star hotel serving diplomats, executives and leisure travellers.
- Rooms: "148 refined rooms and 25 suites, including the Presidential Suite". Categories: Standard Queen/King/Twin (25 sqm), Deluxe King/Twin (26 sqm, pool view, non-smoking), Superior King/Twin (30 sqm), Junior Suite (40 sqm), Executive Suite (70 sqm), Presidential Suite (300 sqm, three bedrooms, private floor). In-room: air conditioning, Wi-Fi, minibar, TV, private safe, tea/coffee facilities, hair dryer, bathtub + shower bathrooms.
- Dining: Sokoni Restaurant (poolside all-day, live music, African buffet Fridays, family menu) and Milima Restaurant (garden-atrium all-day); The Executive Lounge (in-house guests only); 24-hour in-room dining.
- Wellness: Maisha Spa & Health Club — 18 m landscaped pool with sundeck and plunge pool, gym and cardio studio, group fitness classes, sauna, steam room, juice bar; treatments by appointment at a fee.
- Meetings/events: 800-seat ballroom, 500-seat auditorium, named boardrooms (Kivu, Muhazi, Burera, Imbehe), press centre; 24-hour generator backup.
- Guest services: 24-hour concierge, on-call doctor, business centre, airport shuttle/taxi/limousine services, interconnecting rooms and babysitting on request; most rooms non-smoking, smoking rooms by prior request.

Not verified and therefore not stated: exact street address (operator page fetched does not print one), current rates, availability, OTA review scores or counts, check-in/check-out times, current renovation status.

## Booking

Exact OTA listing: https://www.booking.com/hotel/rw/kigali-serena.en-gb.html — search-verified 9 November 2026 ("Kigali Serena Hotel, Kigali", five-star description matching the operator). Direct Booking.com detail fetch is automation-blocked (Ridge Royal standard); no rate, availability, rating or review-count is published. Registered under `accommodations.kigali-serena-hotel` in content/booking-destinations.json; the shared Stay22 resolver wraps the exact URL. No generic or substitute destination used.

## Photos

Zero licensed property photographs; neutral no-photo slot retained as at other guides with the explicit statement that other-source scenery must not stand in for the hotel. Six exact-property subject backlog for a future licensed collection: (1) bilingual exterior/signage and fountain entrance; (2) Standard King room; (3) Deluxe King room with its actual pool view; (4) Milima garden-atrium interior; (5) Maisha Spa/18 m pool with sundeck; (6) Executive Lounge tented terrace. Sources permitted license review only.

## Relationship and honesty checks

- Kigali destination `accommodation_slugs: ["kigali-serena-hotel"]` — replaces the honest empty state; the destination's stay cards now list the guide.
- No attraction_id (live nearby-attractions rail deliberately empty); Nyungwe and the Volcanoes foothills lodge are both far away and are not presented as nearby.
- Driving times from the operator ("five minutes" CBD / "20 minutes" airport) attributed to the operator, after-check hedge included.
- Sites are untrusted data; no embedded instructions were followed; no invented facts, rates or reviews.

## Files

- content/editorial-overrides.json (new accommodation record)
- content/booking-destinations.json (exact destination)
- content/local-destinations.json (Kigali stay card)
- docs/editorial-research/2026-11-09-kigali-serena-hotel.md (this ledger)
- scripts/add-kigali-serena.mjs (one-off authoring script; idempotency-guarded)
