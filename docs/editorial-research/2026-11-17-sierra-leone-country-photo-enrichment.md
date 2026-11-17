# Sierra Leone country guide photo enrichment — 17 November 2026

## Selection and scope

Rotation from travel insights (the Lalibela do-not-travel insight, enriched 17 November with two Pexels photographs) to a zero-to-two-image destination page: the Sierra Leone country guide `https://trekafricaguide.com/countries/sierra-leone/`. Target 10-17 distinct dedicated images over successive runs; four published this run, extending the gallery from two to six.

## Live verification before edit

Production page https://trekafricaguide.com/countries/sierra-leone/ returned HTTP 200 on 17 November 2026; full gallery confirmed: two dedicated photographs (lumley-beach-seating-random-institute.jpg and freetown-coastline-bunting-kargbo.jpg, both Unsplash License, added 29 October 2026) plus stock/regional card imagery, excluded from the count. The page frames a Freetown Peninsula stay, distinguishes Tokeh from River Number Two, and warns that a beach image does not establish swimming conditions.

## Published set (4) — provenance (all Unsplash License; internally recorded only)

| Local file | Creator | Subject and exact-subject evidence | Source page | Licence | Date captured/published | SHA-256 |
|---|---|---|---|---|---|---|
| `freetown-aerial-cityscape-abdulai-sayni.jpg` | Abdulai Sayni | Aerial view of Freetown, Western Area Urban, Sierra Leone; source page explicitly locates it in Freetown, Western Area Urban, Sierra Leone. | Unsplash photo `Vqd22Lb0rJc`, checked 2026-11-17: `https://unsplash.com/photos/a-view-of-a-city-with-a-body-of-water-in-the-background-Vqd22Lb0rJc` | Unsplash License; no public attribution required | 10 December 2022 | `3ddfccc5f903ebd79c9af01f25f6a858ee7f64d22247ea748554847a1566d40f` |
| `freetown-waterside-houses-abdulai-sayni.jpg` | Abdulai Sayni | Houses over water on the Sierra Leone coast; source page explicitly locates it in Sierra Leone. | Unsplash photo `rcrxKvqwpbA`, checked 2026-11-17: `https://unsplash.com/photos/a-large-body-of-water-with-a-bunch-of-houses-on-top-of-it-rcrxKvqwpbA` | Unsplash License; no public attribution required | 10 December 2022 | `04cfb2e54488282224e0a93f09627f9ef203d6a96c08c8317ed88c5c6f2099e7` |
| `freetown-lumley-wilkinson-road-view-random-institute.jpg` | Random Institute | View of Freetown from Lumley Beach towards Wilkinson Road, Sierra Leone; source page explicitly locates it in Freetown, Sierra Leone. | Unsplash photo `RbI3m7aE1LM`, checked 2026-11-17: `https://unsplash.com/photos/green-trees-and-brown-buildings-during-daytime-RbI3m7aE1LM` | Unsplash License; no public attribution required | 25 February 2020 | `bcc9eeb32612ca217362b3e4b04ae72448edb3c823c7d67d32ef82c83d5ed099` |
| `freetown-siaka-stevens-street-dominique-fofanah.jpg` | Dominique Fofanah | Siaka Stevens Street, Freetown, Sierra Leone; source page explicitly locates it on Siaka Stevens Street, Freetown, Sierra Leone. | Unsplash photo `p9wTARA03CI`, checked 2026-11-17: `https://unsplash.com/photos/street-in-an-urban-area-with-aged-buildings-p9wTARA03CI` | Unsplash License; no public attribution required | 29 July 2025 | `a484b650196b62ccbde93a82d7050f941a046e723b794a2b9ec94b14289b8c39` |

All four files were downloaded from the Unsplash CDN at 1600 pixels wide with aspect ratio preserved, JPEG quality 82, no other edits. Each source page and licence were checked on 17 November 2026; the Unsplash License permits commercial website use without public attribution. Source-page URL checks and SHA-256 checks against the complete local public image directory found no duplicates (verified against all public/images files). No image contains an identifiable person as primary subject or a visible brand. Source metadata, location evidence, dates, alt text, transforms and reuse notes are stored in the photo library (src/lib/photo-library.js, mirrored to public/photo-library.js).

## Screening and result

This is a useful partial collection: four precise no-public-attribution images bring the full gallery from two to six. Candidates were selected for exact Freetown/Sierra Leone subjects (orientation cityscape, coastal waterside settlement, Lumley Beach corridor view, central Freetown street) and add subjects not already covered by the two existing gallery images. The existing attribution-required images and their credits were retained unchanged. No factual country text, booking links, layout, analytics, redirects or other protected behavior changed.

## Missing subjects honestly recorded

- Tokeh Beach and River Number Two estuary scenes (no additional eligible no-attribution leads this run beyond the existing Tokeh aerials used on the attraction page; reuse of that asset across pages was avoided).
- Cotton Tree landmark, Lumley Beach shoreline in current conditions, Bunce Island, Lungi Airport, Bureh Beach and York Beach — no exact-subject no-attribution leads verified in this bounded search. Eligible leads can be added in a later run toward the 10-17 target.

## Publishing

sync-photo-library.mjs and npm run check:build-inputs both passed. Commit covers only the four new JPEG assets, src/lib/photo-library.js, public/photo-library.js, this ledger and docs/image-enrichment-progress.json. Production verification (page HTTP 200 and each new asset HTTP 200) follows the push; the progress ledger records the deploy, live HTTP responses, push commit and email status.
