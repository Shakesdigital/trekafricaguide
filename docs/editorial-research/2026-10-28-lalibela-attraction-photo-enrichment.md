# Lalibela attraction photo enrichment — 28 October 2026

## Scope and baseline

Production `https://trekafricaguide.com/attractions/lalibela/` returned HTTP 200 before editing. Its rendered main content contained two gallery image assignments (the destination and starter defaults), no inline article photographs, and the existing credit panel for Bernard Gagnon and Thomas Fuhrmann. The full guide was reviewed. It explicitly frames Lalibela as a continuing sacred landscape, warns that Australia's Smartraveller advises against travel to Amhara as checked 11 October 2026, and says the page is cultural context rather than a current travel recommendation. No copy, travel advice, property, booking link, hero, or site behavior was changed.

## Selected photographs

All four images were visually inspected and downloaded from the Pexels CDN at 1800 px wide, preserving aspect ratio. Each source page was checked on 28 October 2026. Pexels states that images are free to use, require no attribution, and may be used on websites; it prohibits offensive depictions or implied endorsement. The chosen depictions are contextual heritage/religious photographs, not representations of a Trek Africa Guide itinerary or current access. Existing CC BY-SA gallery images and their visible credits remain unchanged.

| File | Creator | Subject and evidence | Source page / revision | License | SHA-256 |
|---|---|---|---|---|---|
| `st-george-church-aerial-ludo-van-den-nouweland.jpg` | Ludo Van den Nouweland | Aerial Bete Giyorgis / Church of Saint George, Lalibela; source identifies exact church and place; capture 14 Nov 2017, page published 1 Jun 2022 | Pexels photo 12344991, checked 2026-10-28 | Pexels License, no public attribution required | `33ab12cd5904f2fe3bdea2b0be5251d955e31ffbd9e9e3d933cb15f0e940e4dc` |
| `rock-hewn-church-visitors-estella.jpg` | Estella | Visitors approaching one of Lalibela's rock-hewn churches; source identifies Lalibela, Ethiopia; capture 27 May 2018, page published 8 Apr 2021 | Pexels photo 7438884, checked 2026-10-28 | Pexels License, no public attribution required | `61bcde332af22bf6305202f9fc4c510b60945f54902f7d63069dfc4bb56eb23f` |
| `lalibela-priest-cross-ludo-van-den-nouweland.jpg` | Ludo Van den Nouweland | Ethiopian Orthodox priest holding a Lalibela cross inside a Lalibela church; source page identifies location and subject | Pexels photo 12344936, checked 2026-10-28 | Pexels License, no public attribution required | `1eaba2c94a74d40f7e022b689e9d2ada0ce4b86bb759dcb9c695aee8a3d0a3b6` |
| `lalibela-church-stonework-ludo-van-den-nouweland.jpg` | Ludo Van den Nouweland | Person in traditional clothing beside carved stonework within Lalibela's rock-hewn church complex; source page identifies place and subject | Pexels photo 12344920, checked 2026-10-28 | Pexels License, no public attribution required | `a6f53117f04bd7b47aa53b8141e574db7d0607dd13d9a2691e50bc18dfe8e400` |

Full source URLs, license URL, page/capture dates where available, exact-location evidence, accessible alt text, transformations, restrictions, and local paths are stored in `src/lib/photo-library.js`. Global source-page URL and SHA-256 checks against photo metadata and all 644 existing public image files found no duplicate. The four new local JPEGs have unique SHA-256 values.

## Publishing

Pending. Commit, push, deployment readiness, production gallery count, and individual image responses will be recorded in `docs/image-enrichment-progress.json`. Send one private source-free progress report after confirming production; record the Gmail receipt there.
