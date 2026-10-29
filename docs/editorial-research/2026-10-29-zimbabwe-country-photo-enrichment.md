# Zimbabwe country photo enrichment — 29 October 2026

## Page and baseline

Selected the published Zimbabwe country guide after confirming the country-photo ledger had no prior enrichment run for it. Production `https://trekafricaguide.com/countries/zimbabwe` returned HTTP 200 before editing. The country gallery displayed two photos: the shared Victoria Falls destination default and the shared rainforest starter default. The full guide was reviewed. Its focus is the Zimbabwe-side Victoria Falls gateway, spray-fed rainforest, variable water and spray conditions, airport and A8 approach, activity pacing, and careful cross-border booking. There were no inline article photographs; both initial images came from the shared country defaults. The overview and access text were not changed.

## Added photos

| Local file | Source and creator | License and location evidence | Visual review, date, and file digest |
|---|---|---|---|
| `public/images/editorial/zimbabwe-country/victoria-falls-rainbow-k.jpg` | [Pexels photo 16241868](https://www.pexels.com/photo/rainbow-by-waterfall-16241868/), K | Pexels License; its photo page identifies Victoria Falls and Zimbabwe. The [Pexels license](https://www.pexels.com/license/) allows website use without public attribution. | Visually reviewed: rainbow beside the falls, framed by spray-fed foliage. Captured 27 March 2023; published 5 April 2023. SHA-256 `04591b400b9c60ff42b650059fedc38687cddd837fbd9d7f31eb378f7d696fea`. |
| `public/images/editorial/zimbabwe-country/victoria-falls-cascade-benjamin-schaeuffele.jpg` | [Pexels photo 23232512](https://www.pexels.com/photo/waterfall-cascade-with-foam-in-a-park-23232512/), Benjamin Olivier Schaeuffele | Pexels License; the page locates Victoria Falls in Matabeleland North Province, Zimbabwe. Capture and publication dates are not stated. | Visually reviewed: a broad section of the cascade and gorge from a distinct viewpoint. SHA-256 `43944dfe267108905359e86b8c763cb0d6bb872f1da8a79278565d9c810a6461`. |
| `public/images/editorial/zimbabwe-country/victoria-falls-flow-simon-berger.jpg` | [Pexels photo 757142](https://www.pexels.com/photo/waterfalls-757142/), Simon Berger | Pexels License; the page locates Victoria Falls in Matabeleland North Province, Zimbabwe. | Visually reviewed: long landscape view of the falls and high spray plume. Captured 7 November 2009; published 27 December 2017. SHA-256 `36b12785954f69c3444816a2c33ef2de502ff0c8469f7bb09e17c5002033e9bb`. |
| `public/images/editorial/zimbabwe-country/victoria-falls-gorge-plunge-caitlin-darck.jpg` | [Pexels photo 35271373](https://www.pexels.com/photo/majestic-victoria-falls-cascading-waterfall-view-35271373/), Caitlin Darck | Pexels License; the page identifies Victoria Falls and Zimbabwe. | Visually reviewed: a single large plunge into a shadowed gorge, distinct from the rainbow, broad cascade and long spray views. Published 18 December 2025; capture date not stated. SHA-256 `4a53f3eb1d1be00f5cdaca618f3eb2f4e8a17a415f804c6ce4e466bdb91712b5`. |

All four source pages were checked 29 October 2026. The images were downloaded from the Pexels CDN at 1800 pixels wide with aspect ratio preserved and no other edits. Source URLs and SHA-256 digests were checked against the global curated library before assignment; none were already used. Each is a photograph, exact to Victoria Falls in Zimbabwe, and has no public attribution requirement. These landscape photographs illustrate possible conditions and do not promise current river flow, spray, or weather.

## Change and verification

Added the four verified images to the shared library and Zimbabwe country's gallery, retaining both existing defaults. The live gallery target is six total images. Existing required-credit images elsewhere in the site were not changed. No factual guide copy, layout, analytics, Stay22, canonical URL, redirect, home, About, footer or affiliate disclosure was changed.

Before publication, run the repository's photo-library mirror sync and required `npm run check:build-inputs` only. Then confirm the pushed commit's automatic Netlify deployment, the live country gallery count, and each new image asset's HTTP status and JPEG content. Send the run's single source-free owner report only after live confirmation and record its receipt in the image progress checkpoint.
