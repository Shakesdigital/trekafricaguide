
## 2026-11-13 07:13 UTC scheduled run — Accommodations: Maun Lodge (Botswana) published to Git
- Gap: live /countries/botswana/maun/ (HTTP 200, 13 Nov 2026) explicitly describes Maun as "the country's tourism capital, still carrying the feel of a dusty frontier town despite new malls, shops, hotels and guesthouses." The destination's Where-to-stay section renders only Camp Okavango — a fly-in Delta island camp on Nxaragha Island — with no Maun town hotel listed. Maun Lodge is a 140-room riverfront lodge on the Thamalakane River, 2.5 km from Maun town centre and 4 km from Maun International Airport, squarely in the Maun town area. No Maun town accommodation guide exists on the site.
- Research: Maun Lodge official site (About Us, Our Rooms) — Thamalakane River location, 2.5 km from town centre, 4 km from airport, 140 rooms, five room categories (riverfront incl. two presidential, executive suites, executive rooms, standard rooms, chalets), all rooms air-conditioned with tea/coffee/Wi-Fi/en-suite/satellite TV, Boma restaurant, conference facilities up to 500 delegates, contact +267 686 3939 / bookings@maunlodge.co.bw — checked 13 Nov 2026. Botswana Tourism Maun page — tourism capital, new hotels/guesthouses, Delta gateway — checked 9 Nov 2026. Live Trek pages (Maun destination, Botswana country, Okavango Delta attraction, Camp Okavango stay) — checked 13 Nov 2026. Booking.com search-verified 13 Nov 2026.
- Gates: check-build-inputs passed; local build validation passed; full build requires Supabase key (Netlify has it).
- Publish: content commit 7a18af7 pushed to origin/main (rebased over a668963). Netlify auto-deploy triggered; commit status pending.
- Live verification: PENDING — Netlify build not yet deployed (page returns 404, commit status pending). Will verify on next check.
- Next category: travel_insights.


---

## 2026-11-13 22:19 UTC — Scheduled 2h routine run

**Category:** activities  
**Deliverable:** Kwame Nkrumah Memorial Park guided visit  
**Status:** published_live_confirmed

**Evidence Gap:** Live /attractions/kwame-nkrumah-memorial-park/ (HTTP 200, 13 Nov 2026) explicitly describes guided tours as a key experience and states "The site offers a museum, library and guided tours; contact the park if you need to confirm a tour, an exhibit or accessibility arrangements" but renders NO Related activities section. The activities archive (26 published activities) held zero Ghana activities covering the Memorial Park.

**Research (all checked 13 Nov 2026):**
- Park official visitor page (address Prof. Atta Mills High Street, GPS GA-184-8219, transport options, adjacent sites)
- Park hours-and-rates page (Mon–Sat 9:00–19:00, Sun 10:00–19:00; GHS 100 non-Ghanaians, GHS 25 Ghanaians)
- Ghana Museums and Monuments Board listing
- TripAdvisor review (Jun 2025 visit, published 23 Feb 2026)
- GetYourGuide t642241 browser-verified: "Accra: Makola Market, Kwame Nkrumah Mausoleum & Jamestown" (Guide Kophi Tours), 5.0/5 from 1 review, From €60, 6 hours, English host, free cancellation 24h
- Trek Africa Guide attraction page (live) checked 13 Nov 2026

**Build & Deploy:**
- check-build-inputs passed
- Full build 176 pages, readability guard passed on 181 pages
- Content commit: 786ee25
- Progress receipt commit: e3f6075
- Push: success (rebased over 33b2c68)

**Live Verification:**
- Activity detail: HTTP 200, title correct, full activity h2 flow, distinctive copy renders (GHS 100/25 fees, Prof. Atta Mills High Street, GPS GA-184-8219, museum/mausoleum/Freedom Wall sequence, Independence Square/Arts Centre adjacency), honest zero-image state, no exposed markup
- Booking: Exact Stay22-wrapped GetYourGuide t642241 confirmed in production HTML
- Cards: You may also like (Cape Coast activity), Nearby stays (Accra City Hotel), attraction page now renders Related activities
- Archive: Activities archive lists 27 activities including new guide; homepage search lists the guide
- Attraction: Live Kwame Nkrumah Memorial Park page now renders Related activities with the new guide
- Internal links: All cross-link targets live HTTP 200

**CMS:** Imported at source_commit 786ee25; publishable-key read of editorial_documents remains RLS-blocked — owner-side CMS check pending

**Next Category:** destinations

**Blockers:** Owner Gmail signed out (draft email pending); CMS mirror reconciliation pending
