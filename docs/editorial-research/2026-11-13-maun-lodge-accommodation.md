# Maun Lodge accommodation guide — research ledger

**Deliverable**: `accommodation_maun_lodge` (accommodations rotation)

**Evidenced Gap**:
Live `/countries/botswana/maun/` (HTTP 200, 13 Nov 2026) explicitly describes Maun as "the country's tourism capital, still carrying the feel of a dusty frontier town despite new malls, shops, **hotels and guesthouses**." The destination's Where-to-stay section renders only **Camp Okavango** — a fly-in Delta island camp on Nxaragha Island — with no Maun town hotel listed. Maun Lodge is a 140-room lodge on the Thamalakane River, 2.5 km from Maun town centre and 4 km from Maun International Airport, squarely in the Maun town area. No Maun town accommodation guide exists on the site.

**Sources (all checked 2026-11-13 unless noted)**:
- Maun Lodge official site (maunlodge.com): About Us page — location on Thamalakane River, 2.5 km from Maun town centre, 4 km from airport, 140 rooms, five room categories (riverfront rooms incl. two presidential, executive suites, executive rooms, standard rooms, chalets), all rooms air-conditioned with tea/coffee, Wi-Fi, en-suite bathroom, satellite TV; Boma restaurant; conference facilities up to 500 delegates; contact +267 686 3939, bookings@maunlodge.co.bw
- Maun Lodge official site (maunlodge.com/rooms): Room types listed — Standard, Executive, Suite, Ex Suite, Chalet (via our-rooms archive)
- Botswana Tourism Organisation Maun page (botswanatourism.co.bw/explore/maun, checked 9 Nov 2026): Maun as tourism capital, "new malls, shops, hotels and guesthouses", gateway to Okavango Delta
- Live Trek Africa Guide pages (checked 13 Nov 2026): Botswana country page (names Chobe and Okavango as co-equal pillars), Maun destination page (describes "hotels and guesthouses" but Where-to-stay shows only Camp Okavango), Okavango Delta attraction, Camp Okavango stay guide
- Booking.com search for "Maun Lodge Botswana" — exact property detail page located at https://www.booking.com/hotel/bw/maun-lodge.en-gb.html (search-verified 13 Nov 2026; direct platform fetch automation-blocked per Ridge Royal standard)

**Booking CTA**: Exact Booking.com detail https://www.booking.com/hotel/bw/maun-lodge.en-gb.html (search-verified 13 Nov 2026). Stay22-wrapped in built page (campaign `accommodations_maun_lodge`). No rate, availability, numerical rating or review-count claims; direct platform fetch automation-blocked (Ridge Royal standard).

**Internal Links**:
- Maun destination (`/countries/botswana/maun/`)
- Okavango Delta attraction (`/attractions/okavango-delta/`)
- Okavango mokoro safari activity (`/activities/okavango-mokoro-safari/`)
- Camp Okavango stay (`/accommodations/camp-okavango/`) — Delta camp contrast
- Chobe Safari Lodge (`/accommodations/chobe-safari-lodge/`) — Kasane/Chobe contrast

**Photo Backlog** (six distinct licensed exact-property subjects, not reusable from Camp Okavango or other collections):
1. Maun Lodge main entrance/signage from Thamalakane River road
2. Riverfront room with Thamalakane River view
3. Executive suite interior
4. Boma restaurant and dining area
5. Conference facilities / pool area
6. Chalets on the riverbank

Licensed-reuse review only; official site imagery is operator-copyrighted; no substitutes.

**Quality Bar**: Match formatting/layout of Volcanoes golden monkey trekking activity page — scannable short paragraphs (2–4 sentences each), honest no-photo state, proper Stay22 wrapper, all seven h2 sections (Why stay here, Key amenities, Stay style and budget, What travelers say, Booking option, Other Nearby Accommodations, Nearby Attractions).

**Cross-links**:
- Add `maun-lodge` to Maun destination `accommodation_slugs` in `content/local-destinations.json`
- Maun destination Where-to-stay section will render Maun Lodge card
- Okavango Delta attraction Nearby stays already renders Camp Okavango; Maun Lodge adds a town-base option
- Botswana country page and accommodations archive will list the guide

**No Duplicates Check**: No existing `maun-lodge` slug in editorial-overrides.json accommodations or local-destinations.json. No duplicate slugs in booking-destinations.json.