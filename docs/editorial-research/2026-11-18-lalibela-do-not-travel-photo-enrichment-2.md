# Lalibela do-not-travel insight — photo enrichment, second batch (2026-11-18)

**Page:** https://trekafricaguide.com/travel-insights/decide-lalibela-under-do-not-travel-advice/ (travel_insight)
**Status:** published_live_confirmed
**Previous photo count:** 2 → **new:** 2 → **total:** 4 (toward 10–17 target)
**Commit/push:** b2eed67 (main), live-confirmed on production.

## Selection method
Rotated within travel_insights to continue the Lalibela do-not-travel insight, which still has a large documented image gap. Prioritised live pages with zero to two dedicated images; this page had 2 dedicated photos before this run. Exact-subject rights search for Lalibela, Ethiopia via Pexels browser (no-attribution Pexels License pool).

## Sources checked
- Pexels search "Lalibela": exact-subject frames found under the Pexels License (commercial reuse, no public attribution) — used.
- Wikimedia Commons Lalibela results: all CC BY / CC BY-SA (attribution required) — excluded for new publish.
- ChatGPT built-in image generation: blocked (provider credits unavailable); no synthetic frame added.

## Selected images (rights evidence kept internally in src/lib/photo-library.js)

| File | Subject | Creator | Pexels ID | Licence |
|---|---|---|---|---|
| lalibela-priest-cross-interior-turban.jpg | Priest in a turban holding a cross inside a rock-hewn church | Ludo Van den Nouweland | 12344936 | Pexels License |
| lalibela-rock-hewn-church-aerial-aldo-bordoni.jpg | Aerial view of the rock-hewn Church of Saint George, Lalibela | Aldo Bordoni | 39129274 | Pexels License |

Both downloaded from the Pexels CDN, resized to 1600 px wide, SHA-256 recorded, added to the insight body as figures with natural descriptive alt text. Neither frame is already used on the Lalibela attraction or local-destination pages.

## Rights notes
- No CC BY, CC BY-SA or other attribution-required photo newly published.
- No public credits, citations, or AI labels added, per owner preference.
- Not an accommodation page, so no imagined-room/facility risk applies.
- Both are real photographs with descriptive alt text; no synthetic scene is asserted as documentary.

## Live verification (production)
- Page: https://trekafricaguide.com/travel-insights/decide-lalibela-under-do-not-travel-advice/ HTTP 200; all four image filenames present in rendered markup.
- lalibela-priest-cross-interior-turban.jpg: HTTP 200, image/jpeg, 643,640 bytes.
- lalibela-rock-hewn-church-aerial-aldo-bordoni.jpg: HTTP 200, image/jpeg, 525,558 bytes.

## Gaps / next steps
- Continue toward 10–17 distinct images on this page over successive runs (6–13 more needed).
- Rotate to another zero-photo page across destinations, attractions, activities, travel insights and accommodations.
- Owner email: NOT SENT — Gmail requires an interactive owner sign-in; takeover barred for this run. Recorded as non-send.

## Mandatory checks
- node scripts/sync-photo-library.mjs: passed
- npm run check:build-inputs: passed
