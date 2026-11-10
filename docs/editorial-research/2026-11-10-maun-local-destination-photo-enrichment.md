# Maun local-destination photo enrichment | 10 November 2026

Target: https://trekafricaguide.com/countries/botswana/maun/

## Initial live verification

Production page HTTP 200, read in full at the start of this run (15:07 UTC / 18:07 Africa/Kampala): zero dedicated Maun photographs. The detail gallery renders empty ("gallery__empty" placeholder). Only excluded images are present: the regional /images/stock/destinations/okavango-delta.jpg scenery card (Okavango Delta attraction listing) and the /images/editorial/okavango-mokoro-safari/guided-canoe.webp activity card (mokoro safari listing) — neither is a Maun subject and both are excluded from the destination count. content/local-destinations.json confirms hero_image_url and gallery are both empty for the maun entry. Outstanding subjects: town/riverscape, aerial town view, street scene, airport/gateway, staple food, crocodile farm, markets/lodges/boat station.

## Rights review (owner standard 2026-11-07: credit-bearing CC acceptable; NC/ND and scenery-as-property excluded)

This is a local-department page: exact-place scenes of Maun are on-topic (the "scenery as property" exclusion applies to accommodation pages, not destination pages).

- Wikimedia Commons full-text "Maun Botswana": multiple exact-subject files. Licence-checked via Commons imageinfo (extmetadata):
  - File:Maun - Botswana.jpg — Thamalakane river, Maun, Botswana — Monamodi74 — CC BY-SA 4.0 — 2021-03-14 — 2048x1536 → USED (river).
  - File:Maun_Botswana2.jpg — aerial view of Maun — jonrawlinson (Flickr import) — CC BY 2.0 — 21 December 2005 — 3456x2304 → USED (aerial).
  - File:020522030Botswana.JPG — Stadt Maun (city view) — Graf-flugplatz — CC BY-SA 3.0 — 2002-05-22 — 2400x1800 → USED (street/town).
  - File:Staple food from Maun, Botswana, Maize.jpg — maize meal (mmidi), Maun — Kentsem — CC0 — 2026-04-05 — 2448x3264 → USED (food).
  - File:Botswana maun airport.jpg — Maun Airport terminal — Passportguy — CC BY 2.0 — 2009-12-22 — 509x732 → USED (airport; largest listed size stored unchanged).
  - File:On final approach into Maun Airport.jpg — light aircraft on final approach — Benjamin Hollis — CC BY 2.0 — 2012-08-22 → USED (approach).
  - File:Granja de cocodrilos, Maun, Botsuana, 2018-08-01, DD 49.jpg — crocodile farm, Maun — Diego Delso — CC BY-SA 4.0 — 2018-08-01 → USED (crocodile farm).
  - Not used: File:Maunbyplane.jpg (public domain, but near-duplicate aerial subject of Maun Botswana2.jpg); File:Maun Anflug1.jpg (CC BY-SA 3.0, near-duplicate Thamalakane river subject).
- Openverse API: 504 on first request, retried once, then empty result set for "Maun Botswana" — no additional leads; Commons pool was sufficient, so no gap.
- Flickr CC browser search (BY/BY-SA only): JS-rendered results page, no parseable exact-property leads; Commons pool sufficient.
- Unsplash/Pexels/StockSnap: not separately searched after the Commons pool yielded seven distinct exact-subject photographs (destination target is 7–12; this is a verified partial collection at the target's low end).

No NC/ND, no OTA, no social thumbnails, no AI imagery. All seven show the named place, Maun, not another property or generic scenery.

## Applied

Seven exact-property/destination photographs, stored locally at 1,280–1,600 px wide (Pexels-style downscaling from Commons originals; JPEG quality 85), aspect ratio preserved, nothing else changed:

| local file | Commons file | creator | licence | date | SHA-256 (stored file) |
|---|---|---|---|---|---|
| /images/editorial/maun-local-destination/maun-thamalakane-river-2021.jpg | Maun - Botswana.jpg | Monamodi74 | CC BY-SA 4.0 | 2021-03-14 | 43fedf39eba4234eb0b93605c1f56774c8e89171d33fecb0bd7e999d9e617bcf |
| /images/editorial/maun-local-destination/maun-aerial-view-2005.jpg | Maun_Botswana2.jpg | jonrawlinson | CC BY 2.0 | 2005-12-21 | b979c062636f6f220a6900f6821c0da244081bf2cf6a5d3c73d018e7d3303012 |
| /images/editorial/maun-local-destination/maun-city-street-2002.jpg | 020522030Botswana.JPG | Graf-flugplatz | CC BY-SA 3.0 | 2002-05-22 | ecacec19128f70d1633c18c2a73c6a6b2a3115ef5b66e86fade2dd0cec684697 |
| /images/editorial/maun-local-destination/maun-landing-approach-2007.jpg | On final approach into Maun Airport.jpg | Benjamin Hollis | CC BY 2.0 | 2012-08-22 | 5eea55e375994c75a5059e61163fc2a105a953e8a121179667d590f4ed53215c |
| /images/editorial/maun-local-destination/maun-airport-terminal-2009.jpg | Botswana maun airport.jpg | Passportguy | CC BY 2.0 | 2009-12-22 | 37b6d00565bba5b2b2f39c38caf63b8d17f15e0ad53653d2bd33ae0ab83a52d1 |
| /images/editorial/maun-local-destination/maun-maize-staple-food-2026.jpg | Staple food from Maun, Botswana, Maize.jpg | Kentsem | CC0 | 2026-04-05 | 33d8e46d80b8cd76c7dff5e3d1697c3e5384e0922904fed98fe61210c9a61f48 |
| /images/editorial/maun-local-destination/maun-crocodile-farm-2018.jpg | Granja de cocodrilos, Maun, Botsuana, 2018-08-01, DD 49.jpg | Diego Delso | CC BY-SA 4.0 | 2018-08-01 | 1b580770c7b0ec5845158a3a3ec7e666a16693a4177cb064d5e3f337f89a29ae |

Content: `content/local-destinations.json` maun entry — hero set to the Thamalakane river image; gallery lists all seven images in the order above.
Repo files: `src/lib/photo-library.js` (seven image entries), `public/photo-library.js` (regenerated by sync), `public/images/editorial/maun-local-destination/` (seven JPEGs), `content/local-destinations.json`, this ledger.

## Remaining subjects (verified partial collection, 7 of 7–12)

Done: river/riverscape, aerial town, street scene, airport terminal, landing approach, staple food, crocodile farm.
Still missing (no rights-clean leads identified): central market stalls, safari outfitter offices, boat/station launch area, lodges/gateways, river-sunset views. Reopen only for a rights-clean set (owner originals, operator permission, or newly CC-licensed uploads).

## Mandatory input check

Passed `node scripts/sync-photo-library.mjs` and `npm run check:build-inputs` on 2026-11-10. Photo-library mirror check requires src/lib/photo-library.js and public/photo-library.js to be identical — sync run before commit.
