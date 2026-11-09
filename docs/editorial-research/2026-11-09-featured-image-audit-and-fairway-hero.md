# Featured-image coverage audit + Fairway Boutique Hotel context hero — 9 November 2026

Checked date: 2026-11-09 (Africa/Kampala). Owner instruction: every published article/page missing a featured image gets at least one; fuller galleries continue during the normal rotation.

## Site-wide featured-image audit (live production, 2026-11-09)

Audited all 118 published detail pages from the 2026-11-06 live inventory (plus index pages spot-checked). Detection: non-card `<img>` whose src is `/images/…`, absolute `trekafricaguide.com/images/…`, Wikimedia thumb/upload URLs, Unsplash/Pexels CDN. Card-slot and logo images excluded.

Result: every live detail page except one has at least one featured image. `/travel-insights/cape-town-before-or-after-safari/` is owner-removed (404; per `owner_removed_articles`) and out of scope.

One-page gap: `/accommodations/fairway-boutique-hotel/` — no hero, no gallery.

## Fairway Boutique Hotel featured image

- Problem: no exact-property photo ever met the rights bar (official gallery and OTA images lack reuse permission; Pexels/Unsplash exact-name searches returned nothing — now rechecked including Flickr's CC search: no matches; the 2026-10-30 checkpoint had said the same under the stricter no-attribution rule).
- Resolution under the 2026-11-07 rights decision: the site's own gallery/listing components render a labeled destination-setting hero for stays (`photoContext`: "Destination setting: … This is not a photograph of the accommodation."). A NEW distinct Kampala street photograph was sourced as that context featured image.
- Image: `kampala-street-life-pexels-35603022.jpeg` — Pexels photo 35603022 "A vibrant and busy street in Kampala, Uganda" by Wings Panic, Pexels License (no attribution required, commercial OK), page dated 2026-01-10, location Kampala. Downloaded at 1,600 px wide, aspect preserved. SHA-256: 64c70f8c8cf4749afd0b2e7bff8663cfc2320bf587db7f82cbe02b020a75b5aa. Visually inspected: Kampala urban traffic, taxis, boda motorcycles, city commerce.
- Not a duplicate: none of the source photo IDs 39554460/35890028/10411247/31121005 (Kampala destination-page images) match this source.
- Never presented as the hotel itself: `property: false` keeps the neutral labeling on cards and the gallery caption.
- Files: public/images/editorial/fairway-boutique-hotel/kampala-street-life-pexels-35603022.jpeg, src/lib/photo-library.js (images entry + listings.accommodations.fairway-boutique-hotel), public/photo-library.js (mirror). Checks: sync-photo-library.mjs + check:build-inputs passed 2026-11-09.

## Notes for the next rotations (per owner instruction context)

Remaining open collections untouched and unchanged: Jollyboys missing subjects (exterior/dorm/private room/kitchen), Governors' Camp (only one eligible exact-camp Commons photo — needs more leads), all other reopened-by-rights accommodation collections, and gallery deepening on pages that now have featured images only.
