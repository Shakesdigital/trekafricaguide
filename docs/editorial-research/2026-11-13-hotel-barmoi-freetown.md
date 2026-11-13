# 2026-11-13 — Hotel Barmoi, Freetown (accommodations rotation)

## Selection evidence
- Live Sierra Leone country page (HTTP 200, 13 Nov 2026) lists exactly one stay on the whole site for the country: The Place Resort, Tokeh. The destination guide shipped 12 Nov (tokeh-river-number-two), the Tokeh attraction guide and The Place Resort stay guide all route travelers through Freetown, but no Freetown accommodation guide exists anywhere on the site (checked via accommodations index, country pages, search and cross-links).
- Booking.com Freetown city page (13 Nov 2026): 71 properties in Freetown, Hotel Barmoi among the most-booked (8.4 "Very good", 118 reviews). Freetown is the arrival hub (Lungi International Airport across the harbour).

## Deliverable
- New accommodation guide: Hotel Barmoi, 75C Cape Road, Aberdeen, Freetown (country_id 51, region_id 15, attraction_id 68 → tokeh-and-river-no2 cluster).
- Booking CTA: exact Booking.com detail page https://www.booking.com/hotel/sl/barmoi.en-gb.html browser-verified 13 Nov 2026; Stay22-wrapped test URL opens the exact property page (not searchresults). No live rates or availability copied; review score quoted with checked date.
- Honest-image standard: the property's own photography is operator-copyrighted, so six distinct Wikimedia Commons contextual Freetown subjects were used with full metadata and on-site attribution via /photo-credits:
  1. lumley-beach-kefel.jpg — Lumley Beach, 26 Dec 2005, Hussein Kefel, CC BY-SA 3.0
  2. aberdeen-freetown-mroue.jpg — Aberdeen waterfront, 20 Jul 2011, Ghassan Mroue, CC BY-SA 3.0
  3. lumley-shore-mroue.jpg — Lumley shore, 16 Nov 2009, Ghassan Mroue, CC BY-SA 3.0
  4. cotton-tree-freetown-trede.jpg — Cotton Tree landmark, Apr 2007, Christian Trede, CC BY-SA 2.0 DE
  5. freetown-aerial-hond.jpg — Freetown harbour aerial, 4 Oct 2004, David Hond, CC BY 2.0
  6. central-freetown-night-bangura.jpg — Central Freetown at night, Jan 2014, Patrick S. Bangura, CC BY-SA 4.0
  Six exact-property subjects tracked as photo backlog: hotel exterior on Cape Road, ocean-view room interior, suite with balcony, pool terrace, restaurant, Penthouse Suite patio.

## Key facts checked (13 Nov 2026)
- Official site hotelbarmoi.com: oceanfront on the Aberdeen coast, 75C Cape Road, sea-view rooms and suites, restaurant (Sierra Leonean + modern), pool, gym, meetings/events; amenities list: free shuttle, housekeeping, free Wi-Fi, laundry, room service, swimming pool, complimentary breakfast, gym.
- Booking.com detail (browser): 8.4 Very good / 118 reviews; sub-scores Staff 9.2, WiFi 9.0, Comfort 8.8, Cleanliness 8.6, Location 8.5, Facilities 8.2; rooms Standard Double 25 m2, Superior Double 30 m2 (balcony), Superior Suite 45 m2, Penthouse Suite 60 m2; all accommodations sea views, terrace; free private parking; continental breakfast; Lumbley Beach 400 m; Lungi airport 35 km; check-in 15:00, check-out 12:00; cash listed among payment methods; pets not allowed; restaurant African/International, vegetarian/vegan.
- Booking.com city page: Hotel Barmoi listed, "most booked in Freetown" rail, from-price rendered (not copied).

## Corrective fix in same run
- Jozani Forest attraction (Tanzania) practical_info still said "No verified nearby property has yet been added to this attraction's stay list" while the nearby-stays rail has rendered Zanzibar White Sand Luxury Villas & Spa since commit 9bed0ff. Stale sentence replaced with accurate copy (live page reproduced the contradiction; local build verified fixed).

## Build and publish
- Build: 172 pages, readability guard 177 passed; check-build-inputs passed (JSON + photo-library mirror).
- Commits: content commit (this file's run) — see progress ledger for hash; dist churn left uncommitted per repo rule.
- Live receipt: see docs/editorial-progress.json latest_run_checkpoint.
