# Research ledger — Nyungwe Top View Hill Hotel (accommodation run, 2026-11-09)

## Selection evidence
- Live accommodations archive (1280px render fetched this run) lists 32 stay guides; Rwanda has exactly two: Wilderness Sabyinyo (Volcanoes) and Kigali Serena Hotel (capital). No Nyungwe-area stay exists.
- Live Nyungwe canopy-walk activity page (fetched this run, HTTP 200) renders its "Nearby stays" section with no cards — an honest empty rail, created by design when its record shipped because "no Nyungwe-area stay record exists; none invented".
- The Nyungwe attraction guide is repo-managed (`repo:attractions:nyungwe-national-park`), the same resolution the 8–9 Nov repo builds use for the published Kibale Forest Camp pairing with a repo-managed attraction; the repo-prefix pairing renders live (unlike the Supabase-managed south-luangwa numeric pairing still flagged for owner-side CMS check).

## Category rotation
Checkpoint `next_category: accommodations` (Nairobi run checkpoint, and the Nyungwe canopy-walk run set the same). This run fills the accommodations gap.

## New record
- slug: `nyungwe-top-view-hill-hotel`
- Country: Rwanda (country_id 49, region_id 14)
- Parent attraction: `repo:attractions:nyungwe-national-park`
- Booking CTA: none. No exact verified current OTA product:
  - Booking.com live index (Google/DuckDuckGo searches this run) shows no property-detail listing for the hotel; the legacy French reviews URL `booking.com/reviews/rw/hotel/nyungwe-top-view-hill-hotel.fr.html` still appears, but a direct fetch of `booking.com/hotel/rw/nyungwe-top-view-hill-hotel.en-gb.html` redirected to an empty "Luhonge: No properties found" search page (check 2026-11-09) — not a verified current product.
  - A direct fetch of the guessed One&Only Nyungwe House Booking slug returned Booking.com's "Page not found" page, so no alternative exact product was fabricated either.
  - The property's official website exposes no working online booking channel: `nyungwehotel.com/Accommodation` is a Laravel database-error page (fetched this run), and the homepage "Book Now" is present without a verifiable reservation endpoint. So no booking-destinations entry was added; the page will render the honest "A verified booking link for this specific listing is not yet available." rail.

## Facts and sources (all checked 2026-11-09)
1. Official site home `https://nyungwehotel.com/` — brand "Nyungwe Hotel" with the tagline history; phone +250 787 109 335; email reservations@nyungwehotel.com; footer "©2020 Nyungwe Top View Hotel"; sections Accommodations / About Us / Facilities / Gallery / Contact; homepage copy: forest primates (chimpanzees, black and white colobus, mangabey), orchids, endangered bird species, waterfalls, canopy walkway, hike trails and interpretation centre as key pulls. Google Search knowledge panel links the hotel's official "Website" to exactly this domain (verified in the search session this run).
2. Official `AboutUs` page `https://nyungwehotel.com/AboutUs` — located in Buvungira Cell of Bushekeri Sector of Nyamasheke District, Western Province; owned by a Rwandese entrepreneur and conservationist; in operation since February 2011; main building is a two-tiered modern rondavel (reception ground floor with Rwandan murals; mezzanine dining area and bar with sweeping veranda; bar decorated entirely from bottle tops); on clear days views reach Lake Kivu and the volcanoes of far-north Rwanda and eastern DRC; 12 cottages in two rows, a sunrise and a sunset side, six red-brick cottages each; each cottage is double or twin with a front lounge (terracotta-tiled floors, sofa, chair, coffee table, fireplace lit on cold evenings); bedrooms described as simple with a bed, clothes hanging space, a dresser and a decorated bathroom; every cottage faces a particular view and is named for it (e.g. Kivu, Nyungwe); less than 2 km from the Kigali–Bukavu main road; about 30 minutes' drive from the Lake Kivu shore (with the thrice-weekly Rusizi–Rubavu lake-boat context); about 45 minutes' drive from Kamembe airport (RwandAir daily schedule claimed by the operator) and 45 minutes from Bukavu (DRC).
3. Official `Facilities` page `https://nyungwehotel.com/Facilities` — ground shuttle within Rwanda, conference room, front-desk services, ticketing and reservations desk for Nyungwe attractions and other country attractions including gorilla permits and the Lake Kivu circuit, restaurant and bar.
4. Official `ContactUs` page `https://nyungwehotel.com/ContactUs` — phone and reservation email as above.
5. Google Search hotel panel (search session this run, 2026-11-09): hotel listed as a 3-star hotel with 152 Google reviews, "Kamembe" area label, map entry and website link to nyungwehotel.com. The review count and star grade are attributed to that panel snapshot and are NOT reprinted as scores or quotes; no rating value was visible, so `rating` stays null.
6. Independent context (operator-marketing class, used only to sanity-check positioning, never as a fact source): Specialist Uganda stays page describes the hotel as a hilltop property with panoramic Nyungwe Forest views (fetched this run).
7. Visit Rwanda's hotel page `visitrwanda.com/explore/nyungwe-top-view-hill-hotel/` (fetched this run) is a broken template (lorem-ipsum placeholders) — mirrored the RDB canopy-page disclosure; no facts drawn from it, and the page notes this in copy where it matters (none, since no Visit Rwanda figure is printed).
8. On-site continuity: live Nyungwe attraction guide and live Nyungwe canopy-walk activity guide (fetched this run) for pairing copy; the fee table and day-trip facts stay on the activity guide and are not reprinted here.

## Breaks and honesty rules
- No licensed exact-property photograph available: the official site's own cmsImages are operator-copyrighted and not reuseable; Commons/Openverse candidates were not acceptable substitutes per the no-substitutes rule, so the zero-photo honest-hero state follows the published Kigali Serena / Kibale Forest Camp precedent, with a six-subject backlog for the image pipeline:
  1. Red-brick rondavel main building exterior from the driveway
  2. Mezzanine restaurant/bar veranda with its bottle-top bar
  3. Sunrise-wing cottage exterior with balcony
  4. Cottage front lounge with fireplace
  5. Cottage bedroom
  6. Hilltop panorama toward Nyungwe canopy / Lake Kivu at clear-weather times
- No rate, availability, star-quality judgment, review quote or score published. No invented distances: all travel figures are the operator's own published estimates, kept attributed.
- Zero-CTA decision recorded above with both negative verifications (Booking delisting evidence + broken official booking page).

## Files
- `content/editorial-overrides.json` (new accommodation record), `docs/editorial-research/2026-11-09-nyungwe-top-view-hill-hotel.md` (this ledger), helper script `docs/editorial-research/add-top-view-hill-accommodation.cjs`, `docs/editorial-progress.json`.
