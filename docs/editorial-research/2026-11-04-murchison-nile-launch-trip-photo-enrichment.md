# Murchison Falls Nile launch trip photo enrichment — 4 November 2026

## Page and initial image count

Reviewed the full published guide, [Murchison Falls Nile launch trip](https://trekafricaguide.com/activities/murchison-falls-nile-launch-trip/), covering the upstream Victoria Nile trip from Paraa toward Fajao Gorge, the separate optional climb, wildlife variability, boarding and operator arrangements. Before editing, production returned HTTP 200. The guide had zero gallery images, no inline article photographs and no image-library activity default. Three `<img>` tags were unrelated site chrome and nearby listing cards (Bwindi and Paraa Safari Lodge), so they were excluded from the guide count. The existing six-photo Murchison attraction and Paraa property collections remain separate and were not reused.

## Selected images and provenance

All five selected photos have licenses that do not require public attribution. Their source-page locations, creator identities, license evidence, available capture/publication dates, alt text, limitations, transformations and SHA-256 hashes are also stored in `src/lib/photo-library.js`.

| File | Subject and location evidence | Creator, date and rights | Use limits |
|---|---|---|---|
| `murchison-falls-cruise-ssemmanda-will.jpg` | Passenger launch on the Nile near Murchison Falls; Commons title and description identify the national park and cruise; visually reviewed. | Ssemmanda will; captured 2 June 2023, uploaded 5 August 2024; CC0 1.0. SHA-256 `f1f275ab171a532f6dc86a53f1318ff04e352a4679a476d37b95b790b4b34b0f`. [Source page](https://commons.wikimedia.org/wiki/File:Murchison_falls_National_Park.2.jpg) | Passengers are from the source scene, not Trek Africa Guide guests. Boat is not presented as a current operator or endorsement. |
| `murchison-nile-hippo-ivan-sabayuki.jpg` | Hippo in the Nile in Murchison Falls National Park; photographer says it was captured on a three-hour boat ride to the bottom of the falls. | Ivan Sabayuki; published 30 August 2022; Unsplash License. SHA-256 `16093d486e2f4b47f63eb9270ea68e3d92e1918af39e460d1b9be1007adacf41`. [Source page](https://unsplash.com/photos/a-hippopotamus-in-the-water-JoVQg68vhiA) | A possible wildlife encounter, not a promise of a sighting or a claim of our participation. |
| `murchison-falls-river-view-ivan-sabayuki.jpg` | Fast water on the Nile at Murchison Falls in northern Uganda; source does not identify a boat or operator. | Ivan Sabayuki; published 18 September 2022; Unsplash License. SHA-256 `177413787abb92ac263dde8edb68b2c6b7364011a1b4a0eb4e979cddc5b344ca`. [Source page](https://unsplash.com/photos/a-river-with-a-waterfall-8WZRp0H75ao) | Location view only; not represented as a view from a particular launch boat or as current conditions. |
| `murchison-nile-boat-sunset-omoniyi-david.jpg` | Motorboat on broad water at sunset; the source tags Nile and locates it in Murchison Falls National Park. Exact reach and operator are unstated. | Omoniyi David; published 19 July 2024; Unsplash License. SHA-256 `ba104a284bb8624119c70c5378c4d9f095463e3f5713cb2a039a76b39af51b15`. [Source page](https://unsplash.com/es/fotos/un-par-de-botes-flotando-en-la-cima-de-un-lago-fSGAaN_EBDw) | Park and Nile context only; not a stated Paraa departure, upstream route, schedule or current operator. |
| `murchison-riverbank-from-boat-bmkme.jpg` | Riverbank and water photographed from a moving boat in Murchison Falls National Park; source says river or lake but does not name the waterway or exact route. | BMKME; captured 23 December 2024, uploaded 7 July 2025; CC0 1.0. SHA-256 `039857fc6944d37f9731f946670dff68834597e61b0617a0c3fcd31d3ff17f1c`. [Source page](https://commons.wikimedia.org/wiki/File:Riverbank_Landscape_at_Murchison_Falls_National_Park_01.jpg) | Labeled as park-from-boat scenery, not the exact upstream falls stretch. |

The Unsplash images were downloaded as JPEG at 1200 pixels wide without cropping. Commons files were downloaded from their original JPEGs unchanged. Visual review confirmed the cruise boat, hippo, falls water, sunset boat and boat-level bank view. SHA-256 comparison against all 670 existing files under `public/images` found no duplicate. Source-page URLs are absent from the curated library. No selected item requires public attribution; no old credited photos or credits changed.

## Bounded exclusions

- A Murchison park elephant-track Unsplash photo was excluded because its source and scene establish a park-wide land-safari context, not the Nile launch activity.
- Other launch and wildlife Commons results with CC BY-SA terms were excluded because public attribution is required.
- The exact-site 1936 motor-launch archive image was not used: its historical vessel is not useful evidence of current visitor boats, and the five-photo set already provides contemporary launch/river context.
- No operator, guest, reviewer, availability, departure schedule or current river condition is inferred from a photograph.

## Local change and remaining gap

The five distinct files are assigned to the new activity through `photoLibrary.listings.activities.murchison-falls-nile-launch-trip`. Hero and gallery use the same five-photo assignment; there are no inline images. The guide copy, canonical relationships, booking status, protected layout and analytics are unchanged. This is a useful verified partial collection: a separate wildlife species such as a river crocodile or waterbird photographed from the actual upstream falls trip remains unfilled unless a new eligible no-public-attribution source appears.

## Publication checkpoint

Initial live page review: HTTP 200, zero guide gallery photos. The local photo-library assignment and five assets await push and automatic production deployment confirmation. No tests, full build or browser QA are part of this run. Owner report will contain the public guide URL and count, without source URLs or quotations.
