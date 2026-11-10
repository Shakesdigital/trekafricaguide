# Dar Saïd photo enrichment | 10 November 2026

Target: https://trekafricaguide.com/accommodations/dar-said/

## Initial live verification

Production page HTTP 200, read in full at the start of the 06:07 UTC (09:07 Africa/Kampala)
run: zero dedicated property photos; no "See all images" gallery and no editorial image
paths in the markup. Only the regional Tunis And Sidi Bou Said attraction imagery is
present, which is excluded from the property count. Outstanding subjects recorded in the
2026-11-06 arrival ledger: entrance approach, courtyard, named room, breakfast area,
hammam, grounds.

Live-page reads during this run confirmed the site's publish path: content pages are
CMS-served (Supabase) but production `/photo-library.js` carries the repo library,
so repo photo-library changes do reach production on deploy.

## Rights review (owner standard 2026-11-07: credit-bearing CC acceptable; NC/ND and scenery-as-property excluded)

- Wikimedia Commons full-text "Dar Said" / "Dar Si Said": every hit is Dar Si Said, the
  Marrakech museum (Morocco), or other unrelated files (one "Dar Mohsen, Sidi bou Said" —
  a different property, Sidi Bou Saïd). No Hotel Dar Said files.
- Openverse API: exact-property hits are two Flickr images of the hotel's rooms
  ("A05a our room Hotel Dar Said", "A05b bathroom Hotel Dar Said") — both CC BY-NC-ND,
  excluded (non-commercial + no-derivatives). All other hits are sibling properties
  (Dar Zarrouk, Dar Ennabi, Dar Dalleji, Dar Al Annabi) or generic Sidi Bou Saïd scenery
  (excluded as scenery-as-property).
- Unsplash (browser-checked): exact-name search returns 7 photos, but all sit in the
  "dar si said / marrakech / bahia palace" related cluster with generic Marrakech
  architecture descriptions ("people walking inside concrete building", "ornate metal
  grate..."). None identified as the Sidi Bou Saïd hotel.
- Pexels (browser-checked): 5.7k loose-phrase results are dominated by Marrakech/Morocco
  scenery and sibling properties. Two confirmed exact-property photos of the hotel's
  entrance sign, both by photographer "nomino":
  - Photo 38051443, "Pigeon on Lantern by Hotel Dar Said Sign" — pigeon perched on the
    lamp above the oval HOTEL DAR SAID / SIDI BOU SAÏD sign. Pexels License, no
    attribution required. Full-resolution visual inspection confirms the sign text
    ("HOTEL DAR SAID", Arabic lettering, "DAR SAID SIDI BOU SAÏD"). → USED.
  - Photo 38051444, "Flying bird near charming hotel sign in daylight" — same sign,
    pigeon in flight. Pexels License. → USED.
- Pexels courtyard candidates 32969450/32969451 ("charming Mediterranean courtyard…")
  are by a different photographer (Yassir Draka) with no property tie — excluded as
  scenery-as-property. Dar Al Annabi photos (27635481/83/84/85/87) are a different
  property. Marrakech/Fes result photos are different places.

No upload/capture date is shown on the Pexels photo pages; recorded as unknown.

## Applied

Two exact-property photographs covering the "entrance approach" subject, stored locally
at 1,280 px wide (Pexels CDN originals 3448×4592, downscaled, nothing else changed):

| local file | Pexels | SHA-256 (stored file) |
|---|---|---|
| /images/editorial/dar-said/dar-said-entrance-sign-pigeon.jpg | 38051443 | 2122207f72b811b8bb601d26958854024dce394250f76fca4fd05120c2f9f3b3 |
| /images/editorial/dar-said/dar-said-entrance-sign-bird.jpg | 38051444 | d0c3bb9b8f17922f4f30f4a2e7fea3b509c49812754052d7edb17a2b6ce8020c |

Repo files: `src/lib/photo-library.js` (two image entries + `listings.accommodations["dar-said"]`
hero/gallery), `public/images/editorial/dar-said/`, `public/photo-library.js` (generated),
this ledger.

## Remaining subjects (partial collection, 2 of 10–15)

entrance approach — DONE (sign/bracket on the street facade).
Still missing: courtyard, named room, breakfast area, hammam, terrace/grounds. The only
known exact-property pool for interiors is the Flickr A05a/A05b pair (CC BY-NC-ND,
excluded). Reopen only for a rights-clean set (owner originals, operator permission, or
newly CC-licensed uploads).
