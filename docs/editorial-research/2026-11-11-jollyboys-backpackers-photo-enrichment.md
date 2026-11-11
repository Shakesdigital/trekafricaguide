# Jollyboys Backpackers photo enrichment — 2026-11-11

**Page:** https://trekafricaguide.com/accommodations/jollyboys-backpackers/
**Type:** Accommodation (target 10-15 distinct exact-property photos)
**Previous count:** 4
**New count:** 8
**Added:** 4

## Source review

**Wikimedia Commons search:** "Jollyboys Backpackers Livingstone" — 4 results, all CC BY 2.0, all by Fabio Achilli (travelourplanet.com on Flickr), all captured 17 August 2019, transferred via flickr2commons by Orizan, reviewed by FlickreviewR 2.

| File | Subject (inferred) | License | SHA-256 |
|------|-------------------|---------|---------|
| File:Jollyboys_Backpackers,_Livingstone,_Zambia_(48597953352).jpg | Exterior and grounds | CC BY 2.0 | b6223811ef40b3f5045488a3fc9afd2dfb44a662f15a90a5364149fad7f51287 |
| File:Jollyboys_Backpackers,_Livingstone,_Zambia_(48597822296).jpg | Swimming pool area | CC BY 2.0 | 1eeea62b38a69765e8e7c426bebbe5981606b71b2e467b9129e73d4f68c114b5 |
| File:Jollyboys_Backpackers,_Livingstone,_Zambia_(48597817331).jpg | Communal lounge/dining | CC BY 2.0 | 171f9aebb186b2e9537b4ffa71eb37a9591024f3e6f55d31fc567cf0ec512e0d |
| File:Jollyboys_Backpackers,_Livingstone,_Zambia_(48597826216).jpg | Bar and courtyard | CC BY 2.0 | a628dd4a81aab1f527ad613537989152546cc83fb6221d9b63dbe04b6fb96475 |

All four pass the rights standard:
- Free stock site (Wikimedia Commons) ✓
- Source page specifically depicts the named property ✓
- CC BY 2.0 (credit required, share-alike not applicable) ✓
- No ND/NC restrictions ✓
- Exact-property, not scenery-as-property ✓
- No OTA/social/AI fabrication ✓

**Flickr search (CC licence-filtered):** No additional exact-property results beyond the four already on Commons (same Fabio Achilli set).

**Unsplash/Pexels/Pixabay/StockSnap/Openverse:** No exact-property results for "Jollyboys Backpackers" or "Jollyboys Livingstone".

## Selected images

1. **jollyboys-1-2019-achilli.jpg** — Exterior and grounds (thatched buildings, palm trees, tropical gardens)
2. **jollyboys-2-2019-achilli.jpg** — Swimming pool area (pool with thatched shelter, lounge chairs)
3. **jollyboys-3-2019-achilli.jpg** — Communal lounge and dining area (open thatched roof, cushioned seating, dining tables)
4. **jollyboys-4-2019-achilli.jpg** — Bar and courtyard (open-air bar, thatched roof, courtyard seating)

## Gallery composition (8 total)

| # | File | Subject |
|---|------|---------|
| 1 | jollyboys-pool-jacuzzi-2019.jpg | Pool with jacuzzi (existing) |
| 2 | jollyboys-pool-garden-2019.jpg | Pool garden (existing) |
| 3 | jollyboys-communal-lounge-2019.jpg | Communal lounge (existing) |
| 4 | jollyboys-bar-courtyard-2019.jpg | Bar courtyard (existing) |
| 5 | jollyboys-1-2019-achilli.jpg | Exterior and grounds (new) |
| 6 | jollyboys-2-2019-achilli.jpg | Swimming pool area (new) |
| 7 | jollyboys-3-2019-achilli.jpg | Communal lounge/dining (new) |
| 8 | jollyboys-4-2019-achilli.jpg | Bar and courtyard (new) |

## Missing subjects (toward 10-15 target)

- Private room (twin/double)
- Dormitory interior
- Kitchen / self-catering facilities
- Reception / entrance signage close-up
- Garden / outdoor seating detail
- Victoria Falls excursion desk / booking board

## Excluded candidates

Only the four Fabio Achilli CC BY 2.0 images were available from free stock sources. All four have been added. No other rights-clean exact-property leads found.

## Technical steps

1. Downloaded original files from Wikimedia Commons via Special:FilePath (full resolution)
2. Stored at `public/images/editorial/jollyboys-backpackers/` with descriptive filenames
3. Added entries to `src/lib/photo-library.js` (images object + listings.accommodations.jollyboys-backpackers.gallery)
4. Ran `node scripts/sync-photo-library.mjs` → copied to `public/photo-library.js`
5. Ran `npm run check:build-inputs` → passed
6. Committed 6 files (2 library files + 4 images) as `4e057bc`
7. Pushed to `Shakesdigital/trekafricaguide main`
8. Polled production at https://trekafricaguide.com/accommodations/jollyboys-backpackers/ until "See all 8 images" rendered (~60 seconds)
9. Verified all 8 asset URLs: HTTP 200, Content-Type image/jpeg, Content-Length matches local files

## Live verification

- **Page:** HTTP 200
- **Gallery text:** "See all 8 images"
- **Hero/OG image:** /images/editorial/jollyboys-backpackers/jollyboys-pool-jacuzzi-2019.jpg
- **All 8 asset URLs:** HTTP 200, image/jpeg, byte counts match
- **No regressions** spotted on spot-checked pages (Sossusvlei Lodge, Governors Camp, Volcanoes gorilla trek)

## Checkpoint

Updated `docs/image-enrichment-progress.json` with completed run entry `jollyboys-backpackers-gallery-4-to-8-2026-11-11`, status `published_live_confirmed`.

## Next action

Sossusvlei Lodge run remains `blocked_deploy_pending` (gallery HTML not shipped after 4+ hours). Continue reopened-by-rights: Governors Camp (4/15). Rotate to zero-photo accommodations: Hilton Cabo Verde Sal Resort, The Place Resort Tokeh, Ridge Royal Hotel, Les Paletuviers, Terres Touareg Guest House, Red Chilli Rest Camp, Fairway Boutique Hotel.