# Choose first night in Tunis — photo enrichment (4 exact-subject stock photographs)

Checked: 16 November 2026, Africa/Kampala. Page: travel insight `choose-first-night-tunis-medina-or-coast`,
https://trekafricaguide.com/travel-insights/choose-first-night-tunis-medina-or-coast/ (live HTTP 200).

## Scope

The insight helps travelers choose between a historic-city night in the Tunis medina and a hillside night in the
Sidi Bou Saïd coast before a Carthage day. The page carried 2 dedicated images (1 Pexels photograph of a Sidi Bou
Saïd street, 1 generated medina-courtyard context frame). This run adds 4 distinct exact-subject photographs
illustrating the Tunis medina souk, the Tunis rooftop/minaret cityscape, and the Carthage shoreline/building; it
does not change any factual copy.

## Rights standard applied this run

Owner instruction: new photographs only from exact-subject assets whose verified terms allow commercial reuse
without public attribution (CC0, public domain, or a stock licence that does not require credit). All 4 files come
from Pexels under the Pexels License (https://www.pexels.com/license/), which permits free commercial use and does
not require attribution. No CC BY or CC BY-SA file was newly published, and no existing credit line was removed or
altered. Rights evidence (source page, creator, licence, licence URL, check date, SHA-256) is recorded in
src/lib/photo-library.js for every file; no source links or credits appear on the public page, per the owner's
standing preference.

Exact-subject evidence is the Pexels photo page title/description plus confirmation that the downloaded frame shows
the described subject. Pexels search-result and photo-page metadata was captured on 16 November 2026. Each download
is the Pexels CDN JPEG resized to 1600 pixels wide with no other edits.

## Selected photographs

| File | Subject on the source page | Creator | SHA-256 (first 16) |
|---|---|---|---|
| tunis-souk-elderly-merchant.jpg | Elderly merchant in a Tunis souk shop | Mahmoud Yahyaoui | 958235b72d678164 |
| tunis-rooftops-minaret.jpg | Tunis rooftops beneath a minaret | Mahmoud Yahyaoui | be0442b983d2e6ed |
| carthage-shoreline-aerial.jpg | Aerial view of the Carthage shoreline | Mahmoud Yahyaoui | 96550fd6f6a0dfe8 |
| carthage-flag-building.jpg | Tunisian flag at a building in Carthage | Mahmoud Yahyaoui | 6be2c41156a67a9d |

Alt text for each file is stored with its library entry and describes only what the frame shows. No image is
presented as a photograph of a specific property, person or event, and the insight makes no such claim.

## Duplicate check

No file hash, Pexels id or subject already present in src/lib/photo-library.js was reused. The existing
sidi-bou-said-street-pexels-24233192.jpg (Pexels id 24233192, sidewalk cafe) remains the page's Sidi Bou Saïd
frame; this run adds a different subject (Carthage/Tunis city) so no near-duplicate frames were introduced.

## Exclusions and gaps

- Sidi Bou Said bay/alleyway view: a Pexels frame (scenic alleyway in Sidi Bou Said, id 35689268) was located but
  its creator line could not be verified within this run, so it was excluded pending creator verification. Revisit
  when the photo page can be inspected.
- Image generation was unavailable: the Radius image endpoint returned 402 insufficient_balance and OpenRouter
  image endpoints returned 402 Insufficient credits in the prior run, and ChatGPT built-in image generation has
  previously failed with connection errors. No synthetic frame was produced or added. Complementary generated scenes
  (Sidi Bou Said bay view, Tunis medina dawn) remain a gap.
- The collection now stands at 6 distinct images (2 existing + 4 new), short of the 10-17 target. Remaining gap:
  4-11 distinct images, prioritizing a Sidi Bou Said coast view and a Tunis medina/cityscape frame.

## Files

- `src/lib/photo-library.js`, `public/photo-library.js` — 4 new image entries (mirrored by sync script).
- `public/images/editorial/choose-first-night-tunis/` — 4 new JPEGs.
- `content/editorial-overrides.json` — 4 new figure blocks added to the insight body.
- `docs/editorial-research/2026-11-16-choose-first-night-tunis-photo-enrichment.md` — this ledger.

Mandatory checks: `node scripts/sync-photo-library.mjs` and `npm run check:build-inputs` both passed.
A local `npm run build` cannot complete on this machine because `.env.local` holds placeholder Supabase
credentials; publication therefore relies on the production build and is verified against the live site after push.
