# Sossusvlei Lodge image enrichment — 22 October 2026

## Scope and result

Reviewed the published Sossusvlei Lodge accommodation guide at https://trekafricaguide.com/accommodations/sossusvlei-lodge/ and its full editorial record. It describes the named lodge beside the Sesriem entrance, with patios, bedrooms and en-suite bathrooms, shared pool, bar, beer garden, outdoor dining terrace, and Adventure Centre. This update adds one additional exact-property image to the existing one-photo gallery. It is a useful partial collection; no rooms, bathrooms, reception, pool, dining or activity-centre views were established in the focused source review. No copy, layout, booking, relationship, tracking or canonical changes were made.

The image was visually inspected at 1280 × 853 pixels. It shows the view from beneath a roofed patio across desert scrub. This is distinct from the existing courtyard hero, but both images are archival. The caption states the date and does not imply current property conditions or a room category. The image source and SHA-256 were compared against all photo-library records and every other local image under `public/images`; no source URL or hash duplicate was found.

## Added source

| Local image | Source and rights evidence | Subject, alt and caption | SHA-256 and restrictions |
|---|---|---|---|
| `public/images/editorial/sossusvlei-lodge/property-patio-2010.jpg` | [Original Commons file page](https://commons.wikimedia.org/wiki/File:DSC02675_-_Namibia_2010_Sossusvlei_(32043106841).jpg), checked 22 October 2026. Creator: Heribert Bechen, 5 million visits - many thanks! Capture date: 24 February 2010, 10:42. The source description explicitly says “Sossusvlei Lodge” and links the named property. Commons records the original Flickr upload by HerryB; FlickreviewR 2 confirmed CC BY-SA 2.0 on 15 August 2021. | Alt: “Namibian desert viewed from a shaded patio at Sossusvlei Lodge.” Caption: “View from a shaded patio at Sossusvlei Lodge, photographed 24 February 2010. Archival property photograph; it does not establish the present view or room category.” | `da023a344375e1c3cc16dd091f08b810535b172aa829137db736ec8f29893061`. License: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). Attribute the photographer and link the license; identify changes (Wikimedia 1280-pixel resize, no other edits); do not imply endorsement. If adapted, comply with ShareAlike. |

## Focused exclusions and remaining gaps

The focused Commons review visually inspected 13 candidate images returned for Sossusvlei Lodge. Twelve depicted dunes, Deadvlei landmarks or broader excursion scenery rather than useful property views and were not added. The selected patio photograph is the only additional exact-property frame in that reviewed set. Official and third-party property imagery without a verified reuse license was not copied. Room, bathroom, reception, pool, dining and Adventure Centre imagery remain unverified gaps; keep this two-photo gallery partial and revisit only when new licensed exact-property evidence is available.

## Integration and publication

The new photograph is recorded in `src/lib/photo-library.js`, mirrored to `public/photo-library.js` by `node scripts/sync-photo-library.mjs`, and assigned to the existing accommodation gallery in `content/editorial-overrides.json`. The dated image checkpoint is `docs/image-enrichment-progress.json`. No renderer changes were needed.

Commit `3415492` was pushed to `origin/main`. At 16:31 Africa/Kampala on 22 October 2026, the production accommodation page returned HTTP 200, included the new filename and “See all 2”; the plain JPEG URL returned HTTP 200 `image/jpeg` (340,868 bytes). A concise update was sent to the authorized recipient at 16:32 Africa/Kampala; Gmail message ID `1a163d0002fb4640`.
