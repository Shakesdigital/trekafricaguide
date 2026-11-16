# Serengeti destination guide — research record (2026-11-16)

## Selection evidence
- Live destinations inventory (24 published local destinations as of 16 Nov 2026) had **no Tanzania mainland destination**: `/countries/tanzania/serengeti/` returned 404 while the Serengeti National Park attraction page, the Serengeti Serena Safari Lodge accommodation guide (enriched 16 Nov 2026), the Serengeti balloon safari activity and the "pair Tanzania safari with Zanzibar coast" insight were all live HTTP 200.
- Flagged in the ledger: run of 2026-11-15 noted "Tanzania mainland destination flagged as the next destinations candidate" (progress JSON line ~2553).
- Duplicate check: no overlap with any published destination slug; rotation is destinations per the previous checkpoint.

## Content basis
- **UNESCO WHC property 156 (Serengeti National Park)**, fetched 16 Nov 2026: inscribed 1981, criteria (vii)(x); property 1,476,300 ha; 1.5 million ha of savannah; largest remaining unaltered animal migration, over one million wildebeest on a 1,000-km annual circular trek spanning Kenya and Tanzania; kopjes; only the Mara River flows perennially through the park.
- **TANAPA** figures carried from the in-repo Serengeti attraction record (last_researched 2026-10-11; tanzaniaparks.go.tz unreachable again this run — carry attributed and dated, as prior runs did): Arusha/Kilimanjaro gateways; June–October dry-season migration window; January–February calving interest; charges separation; balloon excursions authorized.
- **Serengeti Serena Safari Lodge** facts from its published guide (operator page serenahotels.com/serengeti; verified 16 Nov 2026 run): Arusha 335 km, Seronera airstrip 27 km; no verified booking link exists — stated honestly, no booking CTA added.
- Copy written original; no invented prices, reviews, dates or quotes.

## Photos (six distinct licensed exact-subject photographs, Wikimedia Commons, downloaded 16 Nov 2026)
| File | Subject | Creator | Licence | sha256 |
|---|---|---|---|---|
| plaines-du-serengeti.jpg | Open Serengeti plains panorama | EmelineSG | CC BY-SA 4.0 | 46af6e29…0fea0be |
| great-migration-kogatende.jpg | Great Migration herds, Kogatende | Reginald Victor Runyoro | CC BY-SA 4.0 | df7f5bf6…f53d0199 |
| zebras-among-acacias.jpg | Zebras grazing among acacias | Agness Abubakar Saidi | CC0 1.0 | 2f1b5461…23fedbb8 |
| cheetah-shade-solitary-tree.jpg | Cheetah resting in shade | Agness Abubakar Saidi | CC0 1.0 | ac84d846…f51c8128 |
| lioness-atop-kopje.jpg | Lioness atop a kopje | Richard Mortel | CC BY 2.0 | 40b48714…ce1906770 |
| masai-giraffe-serengeti.jpg | Masai giraffe | Giles Laurent | CC BY-SA 4.0 | 1b799a04…a35ce46c9 |

All downloaded from the Commons originals (some resized to 1800 px wide, aspect preserved; records note the edit). Attribution-required (CC BY / CC BY-SA) photos appear automatically on `/photo-credits` with creator, source and licence; CC0 photos carry no credit entry. No reuse from the Serengeti balloon activity gallery; no property-substitute or generated images.

## Quality bar comparison (vs activities/volcanoes-golden-monkey-trekking reference)
- Rendered local and live HTML checked against the reference: hero + gallery photo cards render the six subjects with per-photo alt from the library; house destination h2 flow (Explore Serengeti, Highlights, Getting there and around, Best time to visit, Planning your stay) plus directory card sections (Attractions to explore, Things to do, Where to stay, Travel insights, More destinations) — the destination-directory equivalent of the reference page's structure; booking CTA is not part of the destination house flow (no exact verified product was attached, matching the rule).
- Clean rendered copy confirmed live: no escaped markup, no affiliate CTA, internal links resolve HTTP 200 (attraction, activity, lodge, insight, country).

## Publication
- Content commit `fe495dd`, pushed `5bf45c3..fe495dd` to main (push worked this run).
- Live receipt: `https://trekafricaguide.com/countries/tanzania/serengeti/` HTTP 200, 46,049 bytes, 16 Nov 2026; country page and homepage search data list the destination; photo-credits live with the three attribution-required creators.
- CMS mirror: publishable-key REST read — travel_articles 200, local_destinations 404 (schema cache, unchanged), editorial_documents 400 (column-name probe, service-role data not readable by design). No writes attempted; mirror import runs server-side from source commit fe495dd; owner-side check to confirm `local_destinations/serengeti` or the travel_articles equivalent.
