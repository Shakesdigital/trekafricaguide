# Kampala local destination photography — 30 October 2026

## Page and selection

Added a four-image partial gallery to the newly published Git-managed Kampala local destination at `/countries/uganda/kampala/`. The full guide was read before sourcing. Its exact subjects call for a city streetscape, Kasubi Royal Tombs context, a permitted religious-site exterior, a respectful public-market scene, local food and a public arts/craft venue. Searches found exact-site Kasubi and Baha'i temple photos, but both Commons licenses require public attribution; they were excluded under the owner's standing preference. No unlicensed official gallery or social-media photo was reused.

The selected Pexels photos are varied Kampala-specific context: elevated city buildings, a Kampala market street, a street vendor preparing Ugandan rolex, and a banana seller moving through Kampala traffic. Each Pexels source page gives Kampala location/context; the files were visually inspected. Pexels' current license permits website use without required attribution. Images do not imply the publisher visited, participated, endorses a person/business, or recommends a specific stall, market, restaurant, or service.

One additional Pexels Kampala street-scene photo (ID 35603022) was visually reviewed but excluded because a large KFC billboard dominates the frame, making it a poor fit for this guide and creating avoidable brand-placement ambiguity. It was removed and is not assigned.

## New image records

| Asset | Exact source and evidence | Creator / date | Alt text / limitations | SHA-256 |
|---|---|---|---|---|
| `public/images/editorial/kampala/kampala-city-view-pexels-39554460.jpeg` | https://www.pexels.com/fr-fr/photo/vue-aerienne-de-la-ville-de-kampala-en-ouganda-39554460/ — source identifies Kampala, Uganda; elevated urban skyline. | Phinley Sperrer; captured 30 July 2026, published 16 September 2026. | “An elevated view across Kampala’s dense central buildings and skyline.” Broad city context, not a named viewpoint. | `f03afc8d80fdcd47e1e3938912407651fbb3739572d93ece6646f81fd204dc82` |
| `public/images/editorial/kampala/market-scene-pexels-35890028.jpeg` | https://www.pexels.com/photo/vibrant-kampala-market-scene-with-tuk-tuk-35890028/ — source identifies Kampala, Central Region, and describes a market street with vendors, pedestrians and a tuk-tuk. | josh_ dago__; captured 10 May 2025, published 29 January 2026. | “Pedestrians, market stalls and a tuk-tuk on a Kampala market street.” Not identified as Owino or another named market. | `07164ff5266fa493bc763f68b12ebe4c52761419b239d3fa830c954d50846163` |
| `public/images/editorial/kampala/kampala-rolex-vendor-pexels-10411247.jpeg` | https://www.pexels.com/photo/man-in-black-suit-selling-ugandanrolex-10411247/ — source identifies Kampala and a vendor making/serving a Ugandan rolex. | Prince Beguin; captured 16 December 2020, published 1 December 2021. | “A street vendor prepares a Ugandan rolex at a roadside stall in Kampala.” Does not identify a particular restaurant or imply endorsement. | `916064ea0bd94a1d750452af550e63d34aea4620bfe57dcad32401859a5bfd14` |
| `public/images/editorial/kampala/banana-vendor-kampala-pexels-31121005.jpeg` | https://www.pexels.com/photo/street-vendor-carrying-bananas-in-kampala-31121005/ — source title and location metadata identify Kampala, Central Region. | Frostee Lens Ug; exact capture/publication date unavailable from the source page. | “A banana seller carries a basket through traffic in Kampala, Uganda.” Back-facing vendor; not a planned visitor encounter. | `4ddc9e84c9867248534521ed7fbfbe5f72b6ef851e882674b12f50293c4279de` |

All four use the Pexels License, https://www.pexels.com/license/ (checked 30 October 2026); public attribution is not required. CDN downloads are 1600 pixels wide with aspect ratio preserved; no other edits. Full source revision, subject, evidence and reuse notes are in `src/lib/photo-library.js`. Source URLs and hashes were checked against the complete existing photo library and all 671 files under `public/images`; no duplicates were found. The mirrored `public/photo-library.js` was synced.

## Remaining exact-subject gaps

The collection remains partial. A Kasubi Tombs image and the exact Baha'i Temple photo located during this pass carry CC BY-SA attribution obligations and were left unused. No eligible no-attribution photo was verified for a religious-site exterior, the requested named-restaurant food context, or a public arts/craft venue. Reopen those gaps only for a new credible no-attribution lead or owner-provided licensed originals. No factual guide text, relationships or protected page/site behavior was changed.

## Publication and receipt

Published in commit `fec4bd21a2454dae2406089e03731c57acdbca3f`; the matching Netlify production deploy `6ae49a2ba55faa460121ee41` is ready. On 30 October 2026 at 16:23 Kampala, the live route returned HTTP 200 and displayed “See all 4 images.” All four image assets returned HTTP 200 with `image/jpeg`: `kampala-city-view-pexels-39554460.jpeg` (628111 bytes), `market-scene-pexels-35890028.jpeg` (603199 bytes), `kampala-rolex-vendor-pexels-10411247.jpeg` (432050 bytes), and `banana-vendor-kampala-pexels-31121005.jpeg` (248447 bytes). Owner progress email sent at 16:24 Kampala, Gmail message ID `1a18cfbae99fda1c`.
