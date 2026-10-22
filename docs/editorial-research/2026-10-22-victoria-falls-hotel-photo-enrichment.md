# Victoria Falls Hotel photo enrichment — 22 October 2026

## Scope and review

Reviewed the published accommodation guide at https://trekafricaguide.com/accommodations/victoria-falls-hotel/ and its full editorial override. It identifies the Victoria Falls Hotel in Zimbabwe and discusses its history, gardens, terrace outlook, and dining. The collection already had six images. This run adds three distinct, exact-property photographs to improve terrace and dining context. They bring the detail gallery to nine images. No guest-room or bathroom image with independently verified reuse rights was found in the focused review; those subjects remain gaps. The kitchen photograph is presented only as historical kitchen context, not as a guest facility or current staffing claim.

The hotel guide and gallery schema were reviewed before integration. Existing supported image records and gallery rendering are used; no renderer changes or factual guide edits were made. Selected images were visually inspected from the original Wikimedia Commons file previews, and their downloaded local SHA-256 hashes were checked against all local public images and assigned detail collections. No selected source URL or image hash duplicates another detail collection.

## Added sources

All source pages and assets were checked on 22 October 2026. Licenses below are the versions shown on the original Commons file pages. Attribution and license links are preserved in the photo library records and public photo-library mirror.

| Local image | Exact subject and visual review | Source, creator, license and capture date | SHA-256 | Alt/caption and restrictions |
|---|---|---|---|---|
| `public/images/editorial/victoria-falls-hotel/hotel-terrace-and-facade-2012.jpg` | The Victoria Falls Hotel terrace and facade, shaded tables and potted plants; Commons description places it on hotel grounds. | [Original Commons file page](https://commons.wikimedia.org/wiki/File:Victoria_Falls_2012_05_24_1289_(7421895490).jpg); Harvey Barrison; CC BY-SA 2.0; captured 24 May 2012. | `e840a5abd281062090097f9206cc3d60bce41964d4d6fee20f43fc5adee3578c` | Describes the visible terrace/facade and dates it May 2012. Reuse under CC BY-SA 2.0 with attribution and share-alike terms; do not imply current condition. |
| `public/images/editorial/victoria-falls-hotel/hotel-kitchen-chefs-2019.jpg` | Two chefs preparing food in a kitchen identified by the source as the Victoria Falls Hotel; historical kitchen context. | [Original Commons file page](https://commons.wikimedia.org/wiki/File:Chefs_at_the_Victoria_Falls_Hotel.jpg); Royal Mayhem; CC BY-SA 4.0; captured 15 July 2019. | `77f0cc44a5c34fdf4529065751911eda05ea7721d26545e248bcae35b6bdc499` | Identifies two chefs and the source-attributed hotel kitchen, dated July 2019. Does not imply that guests can use a kitchen or that these are current employees. CC BY-SA 4.0 attribution/share-alike applies. |
| `public/images/editorial/victoria-falls-hotel/hotel-branded-tableware-2012.jpg` | Salt and pepper shakers visibly bearing the hotel's branding; Commons file page and coordinates place the image at the hotel. | [Original Commons file page](https://commons.wikimedia.org/wiki/File:Victoria_Falls,_RTW_2012_(8357872959).jpg); Ana Raquel S. Hernandes; CC BY-SA 2.0; captured 21 October 2012. | `8574053dca3b52d543cb3741a7c5968df2fe2fb7fe85a868f8aa213bdd7facee` | Identifies branded tableware and dates it October 2012. It is descriptive and does not imply endorsement. CC BY-SA 2.0 attribution/share-alike applies. |

## Exclusions and remaining gaps

- A similarly titled Commons image depicts a sunset cruise, not the hotel, and was rejected.
- A second archival facade image repeated an already covered exterior view and had uncertain capture-date evidence; it was not selected.
- The hotel's own gallery and third-party guest images did not provide a verified reusable license, so they were not copied.
- No eligible room, bathroom, reception, or current dining-room image was established in this focused pass. Keep the nine-photo collection and revisit only if new, verifiable reusable source evidence appears; do not repeat the same broad Commons search.

## Publication record

Gallery data was added to `content/editorial-overrides.json` and `src/lib/photo-library.js`; `public/photo-library.js` is the generated mirror. The run checkpoint is `docs/image-enrichment-progress.json`. Commit `d9854c8` was pushed to `origin/main`. On 22 October 2026 at 04:19 Africa/Kampala, the production detail page returned HTTP 200, showed “See all 9,” and referenced all three new files; each plain JPEG URL returned HTTP 200 `image/jpeg`. The required `npm run check:build-inputs` passed after syncing the public photo-library mirror. A concise report was sent to the authorized recipient at 04:20 Africa/Kampala; Gmail message ID `1a16131935e37816`.
