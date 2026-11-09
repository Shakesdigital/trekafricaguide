# Nairobi local destination — photo enrichment (2026-11-09)

Page: https://trekafricaguide.com/countries/kenya/nairobi/ (local destination, published 2026-11-09 by the editorial automation with a zero-photo honest state).

Run start: 2026-11-09 12:07 UTC (15:07 Africa/Kampala). Repo synced to origin/main `f3adc40` first (editorial automation commits merged cleanly).

## Baseline (pre-edit live verification)

Production page HTTP 200, read in full: zero dedicated photographs of any kind — no hero, no gallery. Only category/attraction cards.

## Collection added (10 distinct images, target 7–12)

All exact-Nairobi subjects from Wikimedia Commons, visually inspected. Local store: `/images/editorial/nairobi-local-destination/`, 1280px JPEG (Commons thumbs), SHA-256 recorded for each.

| File | Subject | Creator | Licence | Source page |
|---|---|---|---|---|
| nairobi-giraffe-skyline-britam-2020.jpg (hero) | Maasai giraffe, Nairobi NP, city skyline behind | Alexmbogo | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:A_Maasai_Giraffe_the_Tallest_Animal_in_Kenya_with_Britam_Tower_the_tallest_building_in_Kenya_in_the_background_at_Nairobi_National_Park.jpg |
| nairobi-np-zebra-skyline-2025.jpg | Zebra in Nairobi NP with skyline | Addshore | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Nairobi_National_Park_(August_2025),_Zebra_and_city_skyline.jpg |
| nairobi-np-ostrich-skyline-2025.jpg | Male Maasai ostrich, Nairobi NP, skyline haze | Shadychiri | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Male_maasai_Ostrich_facing_the_Nairobi_Skyline_from_the_Nairobi_National_park.jpg |
| nairobi-city-skyline-dusk-2020.jpg | CBD skyline at dusk (KICC visible) | Antony Trivet | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Nairobi_City_County_Skyline.jpg |
| nairobi-kicc-entrance-2025.jpg | KICC main gate entrance | Francis Akuka for the Wikimedia Foundation | CC0 1.0 | https://commons.wikimedia.org/wiki/File:Kenyatta_International_Convention_Centre_07.jpg |
| nairobi-museum-hominin-hall-2014.jpg | Hominin skull display, Nairobi National Museum | Mike W. | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Nairobi_National_Museum_9.jpg |
| nairobi-museum-gourd-culture-hall-2014.jpg | Decorated gourds in museum culture hall | Mike W. | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Nairobi_National_Museum_2.jpg |
| nairobi-giraffe-centre-feeding-2019.jpg | Rothschild giraffe at Giraffe Centre platform | GioRan | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Giraffe_at_Giraffe_Centre_Nairobi,_Kenya.jpg |
| nairobi-matatu-street-2025.jpg | Matatu minibus in central Nairobi traffic | AEira-WMF | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:A_colorful_matatu_in_Nairobi,_Kenya,_during_rush_hour.jpg |
| nairobi-nyama-choma-grill-2021.jpg | Nyama choma over charcoal, Nairobi | Kengitau254 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Nyama_choma_in_nairobi_kenya.jpg |

## Candidates considered and excluded

- `Nairobi Museum entrance 2.JPG` (Krg, CC BY-SA 3.0, 2005): pre-2008-renovation museum facade; replaced by the two 2014 current-building interiors.
- `Nairobi Montage A.jpg` (CC BY-SA 3.0): composite montage, not a single photograph.
- `Intrusive SGR Railway in Nairobi National Park.jpg`: railway infrastructure is the subject, weaker fit for a visitor gallery.
- Commandeered adjacent-region wildlife/climate shots: none needed; all nine subjects verified exact.

## Governance notes

- No property photographs involved (`property: false` on all entries); caption/credit block renders creator + licence on the page.
- No guide copy changed; only `hero_image_url`, `hero_image_alt`, `gallery` in `content/local-destinations.json` plus library entries.
- Source-ID and SHA-256 dedup `src/lib/photo-library.js` and public image assets — only matches were within this run's own inserted block.
- Validation: `node scripts/sync-photo-library.mjs` and `npm run check:build-inputs` passed.
