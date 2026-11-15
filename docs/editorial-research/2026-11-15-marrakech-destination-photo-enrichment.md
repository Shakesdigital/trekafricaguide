# Marrakech destination — photo enrichment (13 exact-subject stock photographs)

Checked: 15 November 2026, Africa/Kampala. Page: `marrakech` local destination,
https://trekafricaguide.com/countries/morocco/marrakech/ (live HTTP 200, gallery empty before this run).

## Scope

The destination page carried no dedicated gallery and no hero. The page text already plans the city
around Jemaa el-Fna, the medina and souks, the Koutoubia, Majorelle Garden, El Badi Palace and the
Menara basin, the riads, Gueliz/Hivernage, and the Agafay, Ourika and Essaouira day trips. This run adds
13 distinct photographs that illustrate those named subjects; it does not change any factual copy.

## Rights standard applied this run

Owner instruction for this run: new photographs only from exact-subject assets whose verified terms allow
commercial reuse **without public attribution** (CC0, public domain, or a stock licence that does not require
credit). All 13 files come from Pexels under the Pexels License
(https://www.pexels.com/license/), which permits free commercial use and does not require attribution.
No CC BY or CC BY-SA file was newly published, and no existing credit line was removed or altered.
Rights evidence (source page, creator, licence, licence URL, check date, SHA-256) is recorded in
`src/lib/photo-library.js` for every file; no source links or credits appear on the public page, per the
owner's standing preference.

Exact-subject evidence is the Pexels photo page title and description, plus a check that the downloaded
frame shows the described subject. Pexels search-result metadata was captured on 15 November 2026 and each
photo page slug was recorded as the source page. The download is the Pexels CDN JPEG resized to 1600 px wide
with no other edits.

## Selected photographs

| File | Subject on the source page | Creator | SHA-256 (first 16) |
|---|---|---|---|
| jemaa-el-fna-market-day.jpg | Jemaa el-Fnaa square market, Marrakesh | Margo Evardson | 0e5249a648034f3e |
| koutoubia-minaret-sunset.jpg | Koutoubia Mosque at sunset, Marrakech | Desert Morocco Adventure Tours | afb326e68d9dd06a3 |
| koutoubia-reflection-gardens.jpg | Koutoubia Mosque reflection, Marrakech | Sukran | 0c5c9268120fd8ca |
| majorelle-blue-courtyard.jpg | Jardin Majorelle blue courtyard, Marrakech | Emre Kosak | 2452e82e0728d615 |
| el-badi-palace-pool.jpg | El Badi Palace and its reflecting pool | Domenico Bertazzo | f8865a0da801feaf |
| menara-gardens-pavilion.jpg | Menara Gardens pavilion and basin | Andre Manuel | 40f238a438ea758a |
| ben-youssef-madrasa-court.jpg | Ben Youssef Madrasa courtyard | Piotr Arnoldes | 639a0a5278e1ed82 |
| marrakech-souk-alley.jpg | Sunlit souk alley, Marrakech | Salaheddine Es-sellak | f19bbbdfc3619ce2 |
| marrakech-spice-market.jpg | Spice market, Marrakech | Othmane Ettalbi | 80dce942cb33361b |
| marrakech-riad-courtyard.jpg | Riad Palais Sebban courtyard, Marrakech | Moussa Idrissi | db4990858ef54bd9 |
| marrakech-evening-market-stalls.jpg | Evening market street, Marrakech | Philipp Martin | b9a4aa2d48168f77 |
| agafay-desert-camels.jpg | Camels in the Agafay desert, Marrakesh-Safi | Othmane Ettalbi | 4bc3eb5b0493f2c0 |
| ourika-valley-atlas.jpg | Ourika Valley and the Atlas Mountains | Zineb Dehbi | 4cb6dddba26c9d73 |

Alt text for each file is stored with its library entry and describes only what the frame shows. The riad
frame is labelled as riad architecture; it is not presented as a photograph of any property published on the
site, and the destination page makes no property claim.

## Duplicate check

No file hash, Pexels id or subject already present in `src/lib/photo-library.js` was reused. The Majorelle
set used on the Marrakech And Atlas attraction page comes from the same photographer shoot but is a different
frame; only this one new frame is used, on this page only.

## Exclusions and gaps

- Bab Agnaou: Pexels search returned no frame whose page states Bab Agnaou specifically under a no-credit
  licence (results were Fes, Rabat and Tunis gates, or unnamed Marrakech gates). Not published.
- Hammam: the available no-credit frames are generic Turkish/Moroccan spa interiors, not an identified
  Marrakech hammam. Not published.
- Essaouira: a separate city, outside this page's exact subject, so not used for a Marrakech day-trip slot.
- Image generation was unavailable this run: the Radius image endpoint returned `402 insufficient_balance`
  (no credits) and the OpenRouter image endpoints returned `402 Insufficient credits`. No synthetic frame was
  produced or added, so the collection is entirely real photography. Retry the complementary generated scenes
  (riad stay planning, medina walk) when a generation provider has credit.

## Files

- `src/lib/photo-library.js`, `public/photo-library.js` — 13 new image entries.
- `content/local-destinations.json` — `marrakech` hero and 13-image gallery.
- `public/images/editorial/marrakech-destination/` — 13 JPEGs.
- `docs/editorial-research/2026-11-15-marrakech-destination-photo-enrichment.md` — this ledger.

Mandatory checks: `node scripts/sync-photo-library.mjs` and `npm run check:build-inputs` both passed.
A local `npm run build` cannot complete on this machine because `.env.local` holds placeholder Supabase
credentials (`your-project.supabase.co`); publication therefore relies on the production build and was
verified against the live site after push.