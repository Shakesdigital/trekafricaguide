# Sahara Dunes attraction photo enrichment — 28 October 2026

## Scope and baseline

Production `https://trekafricaguide.com/attractions/sahara-dunes/` returned HTTP 200. The full published guide was reviewed. It covers Morocco Sahara routes and specifically distinguishes Merzouga/Erg Chebbi from Erg Chigaga, with separate camp locations. Before editing, its curated photo-library gallery had two assignments (destination and starter defaults) and the article body had no inline photos; the remaining main-content image tags were repeated gallery rendering. Existing image credit panel lists Johannes K. Becker (CC BY-SA 3.0) and Thomas Fuhrmann (CC BY-SA 4.0). Those images and credits remain unchanged. No guide copy, bookings, Stay22 behavior, hero, or protected site feature changed.

## Selected photographs

Four exact Merzouga/Erg Chebbi photographs were visually inspected and downloaded from the Pexels image CDN at 1800px wide, preserving aspect ratio. Pexels license terms checked 28 October 2026 allow website use without public attribution and prohibit offensive depictions or implied endorsement. The people shown are not represented as Trek Africa Guide tour participants, staff, customers, or operators. The imagery depicts Merzouga/Erg Chebbi and does not purport to show Erg Chigaga or a particular camp/itinerary. Existing attribution-required images and public credits remain unchanged.

| File | Creator | Subject/location evidence | Source page / revision | License | SHA-256 |
|---|---|---|---|---|---|
| `erg-chebbi-dunes-kees-van-leeuwen.jpg` | Cornelis Johannes (Kees) van Leeuwen | Erg Chebbi dunes, Merzouga; source page identifies exact locality; published 5 May 2026 | Pexels photo 37441710, checked 2026-10-28 | Pexels License; no public attribution required | `36a12274c62441b7167a2e3365738d70f1b3ce8877eb26df972a1786442713ac` |
| `erg-chebbi-palm-yassine-oukhadjou.jpg` | Yassine Oukhadjou | Palm among Erg Chebbi dunes; published 19 Feb 2026 | Pexels photo 36218738, checked 2026-10-28 | Pexels License; no public attribution required | `01878a4a50584e9174c696d1fae2c2ec10d403990c4c4a5aea6034b167b97761` |
| `erg-chebbi-hiker-henrik-le-botos.jpg` | Henrik Le-Botos | Lone person crossing Erg Chebbi dunes, Merzouga; captured 11 Oct 2023, published 30 Nov 2023 | Pexels photo 19316985, checked 2026-10-28 | Pexels License; no public attribution required | `67c2bdf7c00aa8f123fd06238dea4afb57b70c2f531b442092e5890e1a38f7c0` |
| `merzouga-camel-sunset-mehdi-el-marouazi.jpg` | Mehdi El Marouazi | Person and camel silhouette at sunset, Merzouga; captured 4 Apr 2024, published 3 Aug 2024 | Pexels photo 27566893, checked 2026-10-28 | Pexels License; no public attribution required | `8e83dde1a0556c8bad01e852b06b0fa2696b893b834cdc0fdaffb7b0c6acc885` |

Full source URLs, license URL, dates, location evidence, descriptive alt text, page-specific limitations, transformations, and local paths are stored internally in `src/lib/photo-library.js`. Source-page URL comparison against all existing photo records found no duplicates; SHA-256 comparison against all 644 prior public images was clear. The four local files have unique hashes. No third-party contact or generated imagery was used.

## Publishing

Initial changes add four gallery images, taking the collection from two to six. After push, verify the exact deployment commit, live gallery filenames/count and all four JPEG response types/sizes. Record the resulting deployment, live state and single source-free owner report receipt here and in `docs/image-enrichment-progress.json`.

Production publication confirmed 28 October 2026 at 12:24 Africa/Kampala. Commit `95266d0e25905a9596afd1d262a8fa5634c28414` was pushed to `main`; Netlify production deploy `6ae1beddb5fdb2bf6c70e357` is `ready` for that exact commit. At verification, the page returned HTTP 200, contains all four added filenames, and gallery markup reports six photos (`See all 6 images`). The existing credit panel remains present in the page. All four new assets returned HTTP 200 and `image/jpeg`; response byte lengths match local files: 124116, 335340, 75683, 365738. Source-free owner email receipt is recorded in the progress ledger.
