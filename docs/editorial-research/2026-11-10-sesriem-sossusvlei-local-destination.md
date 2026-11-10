# Sesriem & Sossusvlei local destination: research and claim notes

Checked 10 November 2026. New published local destination under Namibia (`sesriem-sossusvlei`, `/countries/namibia/sesriem-sossusvlei/`), destinations rotation category.

## Selection evidence (2026-11-10)

- Live `/countries/namibia/` HTTP 200 (35,290 B): h2 flow includes "Attractions in Namibia" and "Nearby stays" but **no Destinations rail**; page copy carries 14 "Sesriem" and 27 "Sossusvlei" mentions.
- Live `/attractions/namib-desert/` HTTP 200 (33,869 B): planning text tells readers to "Use Sesriem as the planning reference for the Sossusvlei area" but no destination guide exists behind it; 15 "Sesriem" and 35 "Sossusvlei" mentions.
- Namibia is the only published country whose attraction + two published stays (sossusvlei-lodge, desert-quiver-camp) + a published travel insight (plan-sossusvlei-sunrise-from-sesriem) all point at one area with no local destination anchor. (Local-destination inventory 2026-11-10: Buhoma, Cape Town, Unguja, Elmina, Sine-Saloum, Livingstone, Kampala, Fort Portal, Kigali, Maun, Nairobi, Marrakech, Cairo.)

## Sources fetched this run (claim level)

- Namibia Wildlife Resorts — Sesriem Campsite, https://www.nwr.com.na/resorts/sesriem-campsite/ — fetched HTTP 200, 10 November 2026:
  - Sesriem Canyon: erosion-carved narrow gorge "about 1 km in length", 30–40 m deep, with pools replenished after good rains; name origin: six rawhide thongs ("ses riem") tied together to draw water.
  - Distance table: Windhoek 334 km; Sossusvlei 60 km; Etosha National Park 750 km.
  - Attractions/activities listed by NWR at Sesriem: Sesriem Canyon, Sossusvlei, Elim Dune (incl. a bookable Sunset Drive to Elim Dune).
  - On-site facilities: filling station and shop at the campsite; 44 campsites (max 8 pax) + 6 overflow.
  - Tariff table November 2026 – June 2027 (NAD): campsite per person 670; Canyon Drive 200; Shuttle (2×4 to Deadvlei) 180; guided morning drives 600/700 incl. breakfast distinctions. **These rates are operator tariffs, not park entry fees — deliberately NOT printed in the guide copy; travelers are directed to confirm with NWR.** The Deadvlei shuttle listing verifies the transfer's existence as a listed arrangement.
  - NWR framing: Sesriem "marks the gateway to the globally renowned Sossusvlei inside the world's oldest desert — the Namib" (attributed wording only).
- MEFT hosts (meft.gov.na) returned transport errors on direct fetch this run (both the Namib-Naukluft park page and the permit FAQ). Permit facts therefore carry their earlier in-repo check dates: MEFT permit FAQ (checked 2026-10-20) — park permits issued at gates; the Sesriem office issues Namib-Naukluft permits only; NWR does not issue permits. Park/season context from MEFT's Namib-Naukluft management plan (checked 2026-10-20): arid, low/variable rainfall, most rain January–March. The 2026 shuttle-concession rule changes were already handled in the published insight with a confirm-current posture; the destination repeats no version of the rule and points readers to confirm with MEFT/NWR/operator.
- UNESCO Namib Sand Sea (list/1430, checked 2026-10-20): coastal desert, dune fields influenced by fog — general context only.
- Site continuity from live pages this run: two-night reduce-the-pressure pacing (attraction guide), arrival-then-full-morning structure (published insight), Sossusvlei Lodge "beside the Sesriem entrance" and Desert Quiver Camp "roughly five kilometres" (stay guides).

## Image decision

Zero-image publish under the standing honest-neutral standard; six-subject photo backlog, none reusable from the Namib Desert attraction, Sossusvlei Lodge or Desert Quiver Camp collections:
1. Sesriem outer gate/entry sign; 2. Sesriem Canyon gorge interior; 3. Dune 45 in early light; 4. Deadvlei pan with camelthorn skeletons; 5. Big Daddy climb route from below; 6. Elim Dune at sunset.

## Booking

No booking-destination change: destination pages carry no hotel-booking surrogate by design. Booking texture flows through the two linked stay guides' existing verified Booking.com destinations and the insight's cross-links.

## Build and publish receipt

- check-build-inputs passed; production build with production env (EDITORIAL_CMS_SYNC=false): 146 pages, readability guard passed on 151 pages (added-30 over build). Dist verified before push.
- Content commit `467fa05` rebased over the Okavango-run receipt commits (progress.json conflict resolved in favour of upstream + fresh key) and pushed to main as `f44371a..467fa05`.
- Live verification (2026-11-10, minutes after push): detail `https://trekafricaguide.com/countries/namibia/sesriem-sossusvlei/` HTTP 200 (32,682 B) with title "Sesriem & Sossusvlei, Namibia | Trek Africa Guide" and the standard 8-section h2 flow (Explore / Highlights / Getting there and around / Best time to visit / Planning your stay / Attractions to explore / Where to stay / Travel insights); distinctive copy renders (rawhide name origin, 334 km Windhoek distance); all cross-links present (attraction x5, both stays x3, insight x3); no exposed markup.
- `/countries/namibia/` now renders the "Destinations in Namibia" rail (3 card refs); homepage lists the guide (3 refs); countries archive lists it (5 refs).
- Zero-image publish; six-subject backlog in the ledger. CMS mirror: imported at source_commit `467fa05`; owner-side CMS check pending (RLS standard).
