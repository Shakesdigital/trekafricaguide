# Lalibela do-not-travel insight — photo enrichment (2026-11-17)

**Page:** https://trekafricaguide.com/travel-insights/decide-lalibela-under-do-not-travel-advice/ (travel_insight)
**Status:** published_live_confirmed
**Previous photo count:** 0 → **new:** 2 → **total:** 2 (toward 10–17 target)
**Commit/push:** 8991908 (main), live-confirmed on production.

## Selection method
Bounded exact-subject rights search for Lalibela, Ethiopia. Prioritised live pages with zero to two dedicated images; travel_insights category (next in rotation after the 2026-11-16 accommodations run on Kigali Serena Hotel).

## Sources checked
- Wikimedia Commons search "Lalibela": exact-subject church photos found but all CC BY-SA / CC BY (attribution required) — excluded for new publish per owner standard (no newly published attribution-required photos).
- Pexels search "Lalibela": exact-subject frames found under the Pexels License (commercial reuse, no public attribution) — used.
- ChatGPT built-in image generation: blocked (provider credits unavailable / connection errors); no synthetic frame added. Recorded as a gap.

## Selected images (rights evidence kept internally in src/lib/photo-library.js)

| File | Subject | Creator | Pexels ID | Date | Licence |
|---|---|---|---|---|---|
| lalibela-person-cultural-clothing-walls.jpg | Person in cultural clothing beside Lalibela's ancient stone walls | Ludo Van den Nouweland | 12344942 | 2022 | Pexels License |
| lalibela-rock-hewn-church-family-estella.jpg | Visitors at a rock-hewn church in Lalibela | Estella | 7438884 | 2021 | Pexels License |

Both downloaded from the Pexels CDN, resized to 1600 px wide, SHA-256 recorded, added to the insight body as figures with natural descriptive alt text. Neither frame is already used on the Lalibela attraction or destination pages.

## Rights notes
- No CC BY, CC BY-SA or other attribution-required photo newly published.
- No public credits, citations, or AI labels added, per owner preference.
- Not an accommodation page, so no imagined-room/facility risk applies.
- Neither image asserts a synthetic scene is a documentary photo of an exact place/person/event — both are real photographs with descriptive alt text.

## Live verification (production)
- Page: https://trekafricaguide.com/travel-insights/decide-lalibela-under-do-not-travel-advice/ HTTP 200; both new filenames present in rendered markup.
- lalibela-person-cultural-clothing-walls.jpg: HTTP 200, image/jpeg, 671,700 bytes.
- lalibela-rock-hewn-church-family-estella.jpg: HTTP 200, image/jpeg, 388,696 bytes.

## Gaps / next steps
- Continue toward 10–17 distinct images on this page over successive runs (8–15 more needed).
- Rotate to another zero-photo page across destinations, attractions, activities, travel insights and accommodations.
- Owner email: NOT SENT — Gmail requires an interactive sign-in with no owner session available; takeover barred for this run. Recorded as non-send.

## Mandatory checks
- node scripts/sync-photo-library.mjs: passed
- npm run check:build-inputs: passed
