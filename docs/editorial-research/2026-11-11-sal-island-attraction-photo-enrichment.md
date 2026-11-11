# Sal Island attraction photo enrichment — 2026-11-11

Run: image-enrichment heartbeat, collection `/attractions/sal-island/` (attraction, target 7–12).

## Page and scope

- Live page before edit: https://trekafricaguide.com/attractions/sal-island/ — HTTP 200, published, 5 dedicated photos in gallery ("See all 5 images"): 2 stock + 3 editorial (Rob Mowe, Pexels License — Santa Maria beach, Pedra Lume fishing boats, Santa Maria building at dusk).
- Picked as the live site's least-photographed attraction page (5 photos against 7–12 target).
- Guide's attraction facts: Sal Island, Cabo Verde — Santa Maria beach town, Pedra de Lume salt crater, Buracona Blue Eye, Espargos main town, Palmeira port, north coast sites. All photos checked for exact Sal Island location.

## Rights standard applied

Owner decision 2026-11-07: free stock incl. credit-bearing CC allowed; NC/ND excluded; exact subject only; no OTA/social thumbnails; no AI-fabricated subjects.

## Source review

Wikimedia Commons MediaSearch "Sal Island Cabo Verde" returned extensive results by Cayambe (CC BY-SA 3.0, captured 13 January 2011, Nikon D700). Selected 4 distinct-subject files not previously used:

| file | creator | licence | captured | subject | evidence |
|---|---|---|---|---|---|
| Cape Verde Sal Buracona 2011.jpg | Cayambe | CC BY-SA 3.0 | 2011-01-13 | Buracona Blue Eye | title, DateTimeOriginal, location Sal |
| Cape Verde Sal Espargos school 2011.jpg | Cayambe | CC BY-SA 3.0 | 2011-01-13 | Espargos school | title, DateTimeOriginal, location Espargos |
| Cape Verde Sal Espargos street 2011.jpg | Cayambe | CC BY-SA 3.0 | 2011-01-13 | Espargos street | title, DateTimeOriginal, location Espargos |
| Cape Verde Sal Palmeira.jpg | Cayambe | CC BY-SA 3.0 | 2011-01-13 | Palmeira port | title, DateTimeOriginal, location Palmeira |

All downloaded from Wikimedia Commons originals (largest available), resized to 1,280 px wide, aspect preserved, no edits. SHA-256 recorded.

Excluded: Cayambe's Santa Maria hotel/restaurant (scenery-as-property risk), Phoenix canariensis Riu (vegetation, not attraction subject), duplicate/near-duplicate frames.

## Result

- Gallery extended 5 → 9 dedicated photos (2 stock + 3 Pexels + 4 new Commons).
- 4 new library entries added to src/lib/photo-library.js; gallery array extended in listings.attractions.sal-island; updated_at already current.
- public/photo-library.js regenerated via scripts/sync-photo-library.mjs; npm run check:build-inputs passed.
- Factual copy untouched; stock hero/starter images retained.

## Missing subjects recorded (future runs)

Santa Maria town market, kite-surfing/wind-sports action, north coast cliffs (Rabo de Junco, Cave of Love), Pedra de Lume salt crater interior, Shark Bay (if distinct from Buracona), night sky/astro over desert — reopen when new rights-clean exact-subject leads appear.

## Files

- public/images/editorial/sal-island-attraction/sal-buracona-2011-cayambe.jpg (new)
- public/images/editorial/sal-island-attraction/sal-espargos-school-2011-cayambe.jpg (new)
- public/images/editorial/sal-island-attraction/sal-espargos-street-2011-cayambe.jpg (new)
- public/images/editorial/sal-island-attraction/sal-palmeira-2011-cayambe.jpg (new)
- src/lib/photo-library.js (4 new image entries; gallery append)
- public/photo-library.js (mirror regenerated)
- docs/editorial-research/2026-11-11-sal-island-attraction-photo-enrichment.md
- docs/image-enrichment-progress.json