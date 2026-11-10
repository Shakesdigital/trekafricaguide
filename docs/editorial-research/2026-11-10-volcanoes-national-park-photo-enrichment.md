# Volcanoes National Park attraction — photo enrichment (2026-11-10)

Page: https://trekafricaguide.com/attractions/volcanoes-national-park/ (attraction detail page)
Check date: 2026-11-10
Run: scheduled hourly heartbeat, 2026-11-10 19:07 UTC (22:07 Africa/Kampala)
Reviewer: image-enrichment automation (this agent). Provenance is internal only; no source links or quotations go public.

## Live verification (production, 2026-11-10 ~19:07 UTC / 22:07 Africa/Kampala)
- Page HTTP 200, read in full.
- Dedicated photos: 6 (2 stock: Kinigi Ruanda landscape + gorilla starter; 4 editorial: Musanze volcano peak, Bisoke Virunga view, Kinigi Karisimbi lone tree, Kinigi potato sacks mountains).
- Gallery target for attractions: 7–12 distinct photographs.
- Neutral presentation not needed; existing gallery renders.

## Rights-standard review (owner standard 2026-11-07; free stock incl. CC-credit allowed; NC/ND, unclear terms, OTA galleries, social thumbnails, search-only results, scenery-as-property, and AI imagery excluded)
Repo synced to origin/main 7656274 before research (editorial commits untouched).

Source-by-source results. Exact-park identity required: a source page must specifically depict Volcanoes National Park, Rwanda.
1. **Wikimedia Commons (API, File namespace)**: searched "Volcanoes National Park Rwanda", "Bisoke Crater Lake", "Gahinga volcano", "Sabyinyo view", "Volcanoes Park forest". Found multiple CC0/CC BY-SA 4.0 files from Wiki Loves Earth/Africa campaigns with exact park locations (Musanze district, Kinigi sector, Mount Bisoke summit, Mount Gahinga).
2. **Flickr (licence-filtered CC BY / BY-SA / CC0 / PDM)**: Dave Proffer 2007 set (CC BY-NC-SA) excluded on non-commercial licence; other results not exact-park.
3. **Openverse API**: unreachable (Cloudflare challenge); not retried.
4. **Pexels/Unsplash/Pixabay/StockSnap**: not searched; Commons pool sufficient.

## Selected images (4 new, all Wikimedia Commons)

| local file | source page | creator | licence | captured | evidence |
|---|---|---|---|---|---|
| bisoke-crater-lake-2026.jpg | https://commons.wikimedia.org/wiki/File:Bisoke_Crater_Lake_in_Volcanoes_National_Park,_Rwanda.jpg | Happy Gentille | CC0 1.0 | 2026-04-24 | Commons category "Bisoke Crater Lake", Wiki Loves Africa 2026 Rwanda; visual: greenish crater lake at Mount Bisoke summit |
| gahinga-volcano-peak-2009.jpg | https://commons.wikimedia.org/wiki/File:The_scenery_of_Gahinga_volcano_in_Volcanoes_National_Park.jpg | Mahorogeoffrey | CC BY-SA 4.0 | 2009-08-04 | Commons categories "Volcanoes National Park", "Mount Gahinga", "Crater lakes of Rwanda"; visual: volcano peak with crater lake |
| sabyinyo-view-tourist-rest-2018.jpg | https://commons.wikimedia.org/wiki/File:Tourists_resting_space,_Volcanoes_Park,_Rwanda.jpg | Maxime Ishmax | CC BY-SA 4.0 | 2018-12-16 | Commons description "Great view of Sabyinyo volcano, from the tourists resting place. Located in Musanze district, Rwanda"; categories "Views of Mount Sabyinyo from Rwanda", Wiki Loves Earth 2020 Rwanda |
| forest-interior-trees-2018.jpg | https://commons.wikimedia.org/wiki/File:Amazing_trees_located_in_the_Volcanoes_Park,_Rwanda.jpg | Maxime Ishmax | CC BY-SA 4.0 | 2018-12-16 | Commons description "A great shot from inside the forest in Volcanoes National Park. Located in Musanze district, Rwanda"; categories "Forests in Volcanoes National Park", Wiki Loves Earth 2020 Rwanda |

Downloads stored as original files from Commons (no resizing); SHA-256 recorded in library.

## Excluded candidates and why
- **Gorilla-centric photos** (Emmanuel Kwizera 2019 gorilla series, Nina R gorilla series, 2006 gorilla sets by various) — excluded to avoid subject overlap with the dedicated Volcanoes gorilla trekking activity page; these are wildlife portraits, not park landscape subjects.
- **Dave Proffer 2007 Flickr set** (Parc National Des Volcans) — CC BY-NC-SA, excluded on non-commercial licence.
- **Park banner/logo files** (Volcanoes National Park Banner Image.gif, Volcanoes National Park banner Gorilla.jpg) — not photographs of park subjects.
- **Kinigi village/farmland photos by Nina R** (Kinigi potato sacks, Kinigi Karisimbi lone tree, etc.) — already in gallery from prior Pexels-sourced run; not re-downloaded.

## Missing subjects recorded (for future runs to reach 12)
Park HQ / Kinigi briefing centre, bamboo zone trail interior, Kinigi village morning scenes, Muhabura volcano close-up, visitor centre / permit office, ranger patrol / anti-poaching unit (if rights-clean).

## Result
Extended gallery from 6 to 10 distinct photographs (target 7–12 for attractions). All 4 new images verified exact-park subjects, CC0 or CC BY-SA 4.0. Published commit 8bd8273, pushed 2026-11-10 19:45 UTC. Live verification 2026-11-10 20:15 Africa/Kampala: page HTTP 200, "See all 10 images", all 10 asset URLs HTTP 200 image/jpeg.

## Files touched
- src/lib/photo-library.js
- public/photo-library.js
- public/images/editorial/volcanoes-national-park-attraction/bisoke-crater-lake-2026.jpg
- public/images/editorial/volcanoes-national-park-attraction/forest-interior-trees-2018.jpg
- public/images/editorial/volcanoes-national-park-attraction/gahinga-volcano-peak-2009.jpg
- public/images/editorial/volcanoes-national-park-attraction/sabyinyo-view-tourist-rest-2018.jpg
- docs/editorial-research/2026-11-10-volcanoes-national-park-photo-enrichment.md (this ledger)
- docs/image-enrichment-progress.json