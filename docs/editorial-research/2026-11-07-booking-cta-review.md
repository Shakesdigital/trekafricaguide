# Booking CTA full-site review — 7 November 2026 (Kampala)

Owner request for this run: review the whole site's Booking option links, find missing ones, and only add exact Stay22-supported OTA detail pages; recheck where existing links are not direct-to-detail.

## Current coverage state (verified on the live site today)

- Every accommodation, activity and attraction with a supported exact OTA page renders its Booking option card with the shared Stay22 resolver, `roam=false` and a per-slug campaign.
- Live spot-checks returned HTTP 200 with exact-detail CTAs:
  - `/accommodations/paraa-safari-lodge` → allez/booking linking the exact `booking.com/hotel/ug/paraa-safari-lodge.html` property page.
  - `/accommodations/jollyboys-backpackers` → allez/expedia linking exact property ID 14704528.
  - `/activities/maasai-mara-balloon-safari` → allez/getyourguide linking exact activity t254357 (Keekorok).
- Suppression behaves correctly: `/accommodations/riad-rosemary` shows the honest not-yet-available message with no external CTA.
- `content/booking-destinations.json` structural check: all configured URLs match their provider's exact-detail path pattern (booking.com/hotel/…, Expedia .hNNNNNN.Hotel-Information, GetYourGuide -tNNNNNN). No generic search destinations are configured anywhere.

## Records still without a supported exact booking destination (8 stays, 2 attraction holds)

camp-okavango, governors-camp, mfuwe-lodge, riad-rosemary, sabyinyo-silverback-lodge, sanctuary-gorilla-forest-camp, terres-touareg-guest-house, desert-luxury-camp; attractions lalibela and tokeh-and-river-no2.

New evidence this run:

- riad-rosemary: fresh searches today confirm the LRNCE-designed riad sells directly and on directories; Booking.com's indexed Marrakech results contain only namesakes (Riad Rose Meryam, Mechouar-Kasbah; a Rosemary apartment). Registry evidence updated with checked_at 2026-11-07; CTA stays suppressed rather than matching a namesake.
- governors-camp and mfuwe-lodge: fresh searches began today but public search engines rate-limited or challenged the automation mid-run (stacked listings unavailable), so no conclusive new negative evidence for these two beyond the 11 October audit. Their prior status stands; do not publish namesakes.

## Tooling limitation recorded

During this run the websearch integration returned empty results and Bing, DuckDuckGo (both forms), Mojeek, SearXNG and Brave either challenged the automation or returned unusable output; direct Booking.com requests returned nothing. Full multi-OTA rechecks for the remaining seven stays need a session when search access is restored or through the owner's browser. No namesake substitution was made.

## Next priority

On the next booking turn, re-run targeted searches for the seven remaining stays (priority: governors-camp, mfuwe-lodge, sanctuary-gorilla-forest-camp, sabyinyo-silverback-lodge — safari camps historically absent from Booking.com may exist on other supported providers). If still absent, the CTA remains deliberately omitted; that is the correct behavior under the no-namesakes rule.
