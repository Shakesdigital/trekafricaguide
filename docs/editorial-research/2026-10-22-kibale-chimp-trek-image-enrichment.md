# Kibale chimp-trek planning insight image enrichment — 22 October 2026

## Scope

Reviewed the full published insight at https://trekafricaguide.com/travel-insights/plan-kibale-around-chimpanzee-trek/. It advises readers to pace the Kampala–Fort Portal road journey around a variable guided forest walk, confirm the current Kanyanchu reporting details, and avoid assuming a chimpanzee sighting. The guide links the Kibale National Park and Kibale Forest Camp pages. It had no property-specific images.

Added six distinct images from Wikimedia Commons: one hero image and five inline figures using absolute same-site HTTPS URLs, as required by the travel-insight renderer. Captions mark older road, sign, and entrance images as archival context; they do not present them as current directions, conditions, guidance, or tour participants. Chimpanzee photos are explicitly illustrative and do not promise a sighting. No prose beyond image markup, alt text, and captions was changed. The existing insight sanitizer permits inline figures and images; no renderer support or style changes were needed.

Every selected source page and licence was checked on 22 October 2026. Source thumbnails were visually inspected before selection. The local SHA-256 hashes and source URLs were compared against the photo library and every local public image; none duplicates an assigned image or another selected image.

## Selected images

All six are Wikimedia Commons 1,280-pixel thumbnails stored unchanged. Each is licensed CC BY-SA 4.0; attribution and share-alike obligations apply. The photo library records creator, licence link, date, source page, exact-subject evidence, alt text, restrictions, local path, and SHA-256.

| Use | Local image | Source page and evidence | Creator; capture date | SHA-256 |
|---|---|---|---|---|
| Hero | `public/images/editorial/plan-kibale-around-chimp-trek/kibale-chimpanzees-2020.jpg` | [Chimpanzees of Kibale National Park](https://commons.wikimedia.org/wiki/File:Chimpanzees_of_Kibale_National_Park.jpg). Commons description names Kibale National Park in western Uganda; visual review confirms a chimpanzee in foliage. | Byekwaso Blasio; 8 January 2020 | `1886b6f6b13a3f87c7d4c67d2619e4d60a0d88c2ca06647b514ca6e920c7cd8c` |
| Inline | `public/images/editorial/plan-kibale-around-chimp-trek/kibale-forest-road-2025.jpg` | [Kibale Forest in Kibale National Park in Fort Portal in 2025 01](https://commons.wikimedia.org/wiki/File:Kibale_Forest_in_Kibale_National_Park_in_Fort_Portal_in_2025_01.jpg). The title and description identify the park; visual review shows a forest-lined roadway. | B722N; 27 October 2025 | `92f7434f8d722a10153b24686a01e612f9f58b5ac8635f7fa61a89b9a92627c3` |
| Inline | `public/images/editorial/plan-kibale-around-chimp-trek/kanyanchu-centre-sign-2019.jpg` | [Entrada del Kibale National Park 20190920 141713](https://commons.wikimedia.org/wiki/File:Entrada_del_Kibale_National_Park_20190920_141713.jpg). The file title identifies the park entrance; the visible roadside sign directs visitors toward Kanyanchu Visitor Information Centre. | Josefito123; 20 September 2019 | `dcd7067f8f6a106a417a2889820699f16abecb730b5dfc919db3d58e2da13886` |
| Inline | `public/images/editorial/plan-kibale-around-chimp-trek/kibale-forest-trail-2019.jpg` | [Kibale National Park 20190920 095702](https://commons.wikimedia.org/wiki/File:Kibale_National_Park_20190920_095702.jpg). Commons title/category identify Kibale National Park; visual review shows a forest trail with distant walkers. | Josefito123; 20 September 2019 | `33b8d69c65dd8fc6703e9400962ffc78cafcfece38ae40b7d00e0eb0c2e8ec4d` |
| Inline | `public/images/editorial/plan-kibale-around-chimp-trek/kibale-chimpanzee-2016.jpg` | [Common chimpanzee in Kibale](https://commons.wikimedia.org/wiki/File:Common_chimpanzee_(Pan_troglodytes_schweinfurthii)_Kibale.jpg). Commons description identifies the species and Kibale Forest, Uganda; visual review confirms a single chimpanzee among branches. | Charles J. Sharp; 17 October 2016 | `6ba24381279aee084e67ccdf88e52d4a482ae6ea225b258cb10d571e2d8667cf` |
| Inline | `public/images/editorial/plan-kibale-around-chimp-trek/kibale-entrance-monument-2019.jpg` | [Monumento a la entrada del Kibale National Park 20190920 141651](https://commons.wikimedia.org/wiki/File:Monumento_a_la_entrada_del_Kibale_National_Park_20190920_141651.jpg). The file title identifies the park entrance; visual review confirms the chimpanzee monument and an unnamed visitor. | Josefito123; 20 September 2019 | `1d26fab54582d8f273178835fc3f1063ddd3084a31716b9a8a0a3f3a29b84694` |

## Excluded candidates and limits

- Rejected additional road frames from the same Wikimedia Commons series after visual inspection because they were near-duplicates and did not improve subject coverage.
- Excluded an older park guidance board so historic visitor rules would not be mistaken for current instructions. The sign and monument captions likewise state their archival dates.
- Excluded a branded safari vehicle image to avoid suggesting an operator relationship or endorsement.
- Do not reuse the six photographs already assigned to the Kibale National Park attraction detail page. None of this run's image URLs or hashes overlap that gallery or any other local detail-page assignment.

## Publication record

The article hero and inline image markup are in `content/editorial-overrides.json`; provenance and hero mapping are in `src/lib/photo-library.js`, mirrored to `public/photo-library.js`. The run checkpoint is `docs/image-enrichment-progress.json`; add commit, live verification, and notification receipt after publication.
