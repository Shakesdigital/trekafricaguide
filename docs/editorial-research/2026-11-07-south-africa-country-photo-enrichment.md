# South Africa country image enrichment — 7 November 2026

## Baseline and page review

- Live guide: https://trekafricaguide.com/countries/south-africa/
- Reviewed the complete published country page. Its copy covers Cape Town's mountain and coastal setting, wine regions and Kruger safari travel.
- Before the update the country guide used two dedicated images: Cape Town/Table Mountain from Company's Garden and Kruger National Park. The live inventory showed four additional images only in related cards; these are not counted as the guide's own gallery.
- Added five distinct, location-verified images. The South Africa gallery now contains seven distinct image paths. Existing image records and credits remain unchanged.

## New images and internal provenance

All five source pages state the Unsplash License, which permits use without public attribution. Each page's location evidence and image content were reviewed. The downloaded JPEGs are 1,800 px wide, quality 85, aspect ratio preserved. No capture date was stated by the source pages.

1. `boulders-beach-joshua-kettle.jpg` — `/images/editorial/south-africa-country/boulders-beach-joshua-kettle.jpg`; [source page](https://unsplash.com/photos/a-group-of-penguins-on-a-beach-5P9cq9RjqI8); Joshua Kettle; page identifies African penguins at Boulders Beach, Simon's Town, Cape Town; published 2022-09-18; SHA-256 `d015ab76bceccff9d34499bac88634ae0e2f649724714a312f7a684051e53bab`; alt: “African penguins gather on the sand at Boulders Beach near Simon's Town.” Visual review confirms penguins on a sandy beach; no sighting is guaranteed.
2. `mnweni-mountain-arthur-hickinbotham.jpg` — `/images/editorial/south-africa-country/mnweni-mountain-arthur-hickinbotham.jpg`; [source page](https://unsplash.com/photos/a-view-of-a-mountain-range-with-a-valley-in-the-foreground-jVzZTGu82_A); Arthur Hickinbotham; page identifies Mnweni, South Africa, and says the area is commonly referred to as Mnweni; published 2024-04-14; SHA-256 `00609a068d1cea20dd8d0abf22524e1f1950af46291386227b0f82eb559c6b30`; alt: “Mountain cliffs rise above a green valley in the Mnweni area of the Drakensberg.” Visual review confirms a mountain escarpment and valley; caption is regional context, not a specific trek or route.
3. `stellenbosch-vineyard-ben.jpg` — `/images/editorial/south-africa-country/stellenbosch-vineyard-ben.jpg`; [source page](https://unsplash.com/photos/a-view-of-a-field-with-a-mountain-in-the-background-IOjs8WutjtM); Ben; page describes a Stellenbosch vineyard and lists Stellenbosch, South Africa; published 2024-01-31; SHA-256 `c375375cafa8e5e273ff52060888c32476dc82f6e6c45e49fb7a657e649d5068`; alt: “Vineyard fields and a mountain on the outskirts of Stellenbosch.” Visual review confirms cultivated fields and mountain backdrop; not a named estate or current conditions claim.
4. `kruger-lion-jonathan-gensicke.jpg` — `/images/editorial/south-africa-country/kruger-lion-jonathan-gensicke.jpg`; [source page](https://unsplash.com/photos/a-lion-with-its-mouth-open-Bm1V6_KodHA); Jonathan Gensicke; page identifies Kruger National Park, South Africa; published 2022-08-27; SHA-256 `18da27368245be0517322888d3d2e814b83518b193b09bf866e714f9affc62a0`; alt: “A lion fills the frame in Kruger National Park.” Visual review confirms a close-up lion portrait; paired with the existing elephant image, this does not imply a guaranteed wildlife sighting.
5. `cape-point-coastline-martijn-vonk.jpg` — `/images/editorial/south-africa-country/cape-point-coastline-martijn-vonk.jpg`; [source page](https://unsplash.com/photos/a-scenic-view-of-the-ocean-and-mountains-mVj6YSWWpoU); Martijn Vonk; page identifies Cape Point, Cape Peninsula, Cape Town, South Africa; published 2024-10-29; SHA-256 `eac7ea5cd017e99deec9fe70c88726f712355eb59912b67f5dd870cbf29839f3`; alt: “Rugged cliffs and fynbos frame the ocean at Cape Point.” Visual review confirms coastal cliffs, ocean and fynbos; no current access conditions are implied.

Source photo IDs were searched across the library and research ledger; none had already been assigned. SHA-256 comparison against existing public image assets found no byte duplicates. Both original image records, including their existing credit details, remain unchanged. No factual copy, protected feature or layout was edited.

## Count and publication

The production page returned HTTP 200 after deploy `6aee4a7079cee9020f895a01` became ready for commit `2b58f65`. The page renders “See all 7 images” and contains each of the five new filenames. All five image assets returned HTTP 200 with `image/jpeg` content type and nonzero lengths: 410,716; 527,265; 291,075; 487,784; and 670,806 bytes. The previous required attribution is still present. The live guide now has seven distinct own-page images; four related-card images are not included in that count.

The first deploy attempt failed because the photo-library source and public mirror diverged during rebase. The post-rebase required input check caught this; the mirror was synced, the check passed, and the subsequent automatic deployment completed successfully.
