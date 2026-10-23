# Cape Town attraction guide photo enrichment — 23 October 2026

## Scope and mapping

Target: [Cape Town attraction guide](https://trekafricaguide.com/attractions/cape-town/), which had one generic stock image. Replaced it with six varied photographs matched to this full city guide's stated subjects: the Cape Peninsula, mountain and coastal landscape, neighborhoods, city heritage and botanic setting. The six selected files are not in the published Cape Town local-destination guide, Cape Town base-planning insight, or Table Mountain guided-hike activity galleries. A City Hall panorama candidate was excluded after a global source-page dedup check found it in the Cape Town base insight; the selected Lion's Head from CBD image is distinct.

Existing guide mapping checked in `content/editorial-overrides.json`: the prose covers Table Mountain National Park, the Cape Peninsula, coast, neighborhoods and cultural interests, recommends separate flexible days, and names no additional exact photo-specific claims. Existing source records point to SANParks' Table Mountain attractions and hiking safety guidance. The selected photos support the existing destination overview; no guide prose, factual claims, relationships, layout, booking IDs, analytics, redirects or canonicals were edited.

## Selected files

All source pages were checked 23 October 2026. Files were downloaded as Wikimedia Commons 1280-pixel JPEG thumbnails and visually inspected at full preview size; no further edits were made. Credits, licence links, capture/check dates, subject evidence, alt, restrictions and SHA-256 are also in `src/lib/photo-library.js` and its public mirror.

| Site image / scene | Commons source | Creator / capture / licence | Alt text |
| --- | --- | --- | --- |
| `castle-of-good-hope-2017.jpg` — Castle of Good Hope | [File page](https://commons.wikimedia.org/wiki/File:Castle_of_Good_Hope_Cape_Town.jpg) | Mattias Hill; 27 May 2017; [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | The Castle of Good Hope’s stone bastions and moat reflect its 17th-century Cape Town setting. |
| `cape-point-trailhead-2007.jpg` — Cape Point approach | [File page](https://commons.wikimedia.org/wiki/File:Cape_Point_South_Africa.jpg) | PIERRE ANDRE LECLERCQ; 20 September 2007; [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | A Cape Point sign marks an exposed fynbos path toward the lighthouse area. |
| `signal-hill-lookout-2019.jpg` — Signal Hill lookout | [File page](https://commons.wikimedia.org/wiki/File:Signal_hill_(Cape_Town_).jpg) | Kademo80; 14 May 2019; [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | A railed Signal Hill lookout faces the Atlantic coast and Cape Town suburbs below. |
| `bo-kaap-wale-street-2014.jpg` — Wale Street, Bo-Kaap | [File page](https://commons.wikimedia.org/wiki/File:Bo_Kaap_street_view_Cape_Town.jpg) | Kotivalo; 26 August 2014; [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | A brightly painted building fronts Wale Street in Cape Town’s Bo-Kaap neighborhood. |
| `kirstenbosch-fynbos-garden-2013.jpg` — Kirstenbosch fynbos | [File page](https://commons.wikimedia.org/wiki/File:Kirstenbosch_botanical_garden_-_fynbos_-_cape_town.jpg) | Abu Shawka; 10 August 2013; [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Fynbos flowers and mountain-backed planting at Kirstenbosch National Botanical Garden. |
| `lions-head-from-cbd-2026.jpg` — Lion’s Head above CBD | [File page](https://commons.wikimedia.org/wiki/File:Lion%27s_Head_from_Cape_Town_CBD_(Landscape).jpg) | Husskeyy; 19 January 2026; [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Lion’s Head rises above central Cape Town neighborhoods in a broad daylight view. |

Commons evidence distinguishes each exact scene and capture from present-day conditions. Captions/reuse notes do not suggest that pictured visitors are linked to an operator, that access is current, or that a dated flower or weather scene is guaranteed. Attribution, licence and modification notice are stored for the public photo-credit workflow; share-alike obligations apply to adapted CC BY-SA works.

## Deduplication and publication

Checked source-page URLs against all photo-library records and SHA-256 hashes against all other public image files and each other. The six selected sources and files passed both checks. The previous generic feature image was removed from this attraction gallery only. No changes were made to the Cape Town local destination or its distinct photography, the base insight, or the Table Mountain activity.

Status: `complete_live_confirmed`. Commit `73f18d9` was pushed to `main`. On 23 October 2026 at 21:45 Africa/Kampala, the production attraction detail page returned HTTP 200 and contained all six expected image paths; each plain image asset returned HTTP 200 with `image/jpeg` content type. The public source mirror matched the curated source, JSON/module syntax and `git diff --check` passed, and `node scripts/sync-photo-library.mjs` completed. No tests, full build or QA suite were run under the image workflow. Report sent to `fsddanmugisa@gmail.com`; Gmail receipt `1a16a14cace3ebcd`.
