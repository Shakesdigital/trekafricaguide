# Booking-links audit run — 8 November 2026

Auditor: booking-links audit agent (Trek Africa Guide). Scope of this run: reads of the
2026-10-11 audit, registry, progress files and resolver; full verification of all 56 active
registry links; targeted fixes. No editorial or image agent files were touched.

## Method

- Links verified by following the shared Stay22 `allez` wrapper redirect chain server-side
  (`aid` present per repo config; `roam=false`; campaign per family/slug) and recording the
  final landing URL, per booking.mjs URL construction.
- Booking.com direct pages remain bot-walled (HTTP 202 challenge), matching the prior audits'
  "JavaScript verification" disclosures; exact-item evidence for Booking.com entries relies on
  Stay22's redirect resolving to either the `/hotel/xx/name.html` detail path or Booking's
  single-property deep link (`searchresults.html?dest_id=N&dest_type=hotel`). Both are
  property-specific landings; no rate, availability, review or attribution claims were checked.
- GetYourGuide exact-product pages were additionally reconfirmed in a real browser session
  where new or previously-held entries were touched.

## Verification results (56 active links sampled)

- 28 GetYourGuide entries (activities + attractions families): every wrapper chain ends on the
  exact product page; product `t` identifiers preserved for all, including path renames
  (e.g. t604726, t566480, t850037). Exact item confirmed.
- 20 Booking.com entries: each wrapper chain lands on the exact property detail path or a
  `dest_type=hotel` single-property deep link. Exact item confirmed at landing-url level.
- 3 Expedia entries: jollyboys-backpackers lands on the property page
  (`h14704528.Hotel-Information`) — exact. emerson-spice and the-place-resort-tokeh showed
  ambiguous behavior: the Stay22 chain repeatedly ended on an Expedia destination search page
  (`Hotel-Search?destination=…&selected=<property id>`), but on retry the same wrappers landed
  on the exact property pages (emerson `h31570310`, tokeh `h7863256`) in a swapped pattern.
  This flip-flop is consistent with Expedia rate-limit responses to non-browser clients
  (HTTP 429 during probes) rather than a fixed Stay22 mapping failure. Disclosed as a
  limitation; browser click-through of production links recorded below.

## Fixes and additions this run

1. ** accommodations/emerson-spice ** — registry URL switched from the Spanish-locale page
   (`/es/…Informacion-Hotel`) to the English property-detail URL
   (`https://www.expedia.com/Zanzibar-Town-Hotels-Emerson-Spice-Hotel.h31570310.Hotel-Information`).
   The Spanish URL demoted to a Kiponda destination search in every chain check; the English
   URL redirects to the property page. Evidence limitations disclosed in the registry.
2. **activities/cape-coast-kakum-guided-visit** — hold lifted. The 2026-10-24 hold followed a
   non-browser retrieval returning a page shell. The exact product page (834942) was retrieved
   in a browser session today: Expedition-Go Tours, 4.7/5 from 220 reviews, itinerary covers
   Cape Coast Castle, Elmina Castle and Kakum National Park from Accra. CTA re-enabled.
3. **attractions/cape-coast-kakum** — review aggregate refreshed to 4.7/220 (was 4.7/211, checked
   2026-10-11) using today's browser evidence.
4. **attractions/jozani-forest** — NEW. Exact Jozani-only product
   `t968921` "Zanzibar: Jozani Forest, Nature Walk and Wildlife Tour", provider Zanzibar
   blessing tours and safari, 5/5 from 2 reviews (checked today in browser). Notes disclose the
   tiny review sample, Jozani meeting point and included entrance fee. This closes the
   jozani-forest page's no-booking-option gap.
5. **attractions/elmina-castle** — NEW, same exact product as the established Cape Coast
   attraction entry (t834942), following the registry's existing pattern of an attraction and
   its related detail sharing one exact product (maasai-mara/balloon, bwindi/gorilla, etc.).
   Notes disclose it is a shared Castle Coast day trip, not a castle-only visit.

## Gaps held, with reasons

- **attractions/great-zimbabwe (and the Great Zimbabwe guided activity)**: every GetYourGuide
  candidate surfaced today is a long cross-city transfer product (from Harare 14 h t741591
  4.7/5; from Bulawayo t1480708, t1048201; Zimbabwe rounds t1526899/t1028072). The published
  activity page's own copy directs readers to arrange road transfers separately, so a
  Harare/Bulawayo departure product is a logistics mismatch, not an exact on-site visit.
  Held; candidates recorded.
- **attractions/kwame-nkrumah-memorial-park**: GYG search returned no Ghana product for the
  query (generic fallback results only). No exact listing added.
- **attractions/kibale-national-park**: no verified exact operator listing; the canonical page
  keeps the explicit no-bookable-card position (editorial record 2026-11-08). Not touched.
- **attractions/nyungwe-national-park**: production detail page 404 (known CMS publication
  blocker of the editorial agent). Adding a booking row while the page cannot render would be
  untestable; deferred until the publication blocker resolves.
- **activities/victoria-falls-zambezi-white-water-rafting**: no CTA is the editor-recorded
  position. Untouched.
- **Unverified-at-scale limitation**: this run verified landing URLs and product identity.
  Payment/checkout completion, affiliate attribution and live rates were not, and per prior
  rules are never, verified.
- **tokeh (accommodations/the-place-resort-tokeh)**: left registered (exact Expedia property
  h7863256); flip-flop landing behavior documented above; browser click-through pending below.

## Next audit priority

1. Browser click-through of the production emerson-spice, tokeh, jozani and elmina links
   (real-browser confirmation of the Expedia ambiguity), recorded here.
2. Then re-research the eight unavailable accommodations (Camp Okavango, Governors', Mfuwe,
   Riad Rosemary, Sabyinyo, Gorilla Forest Lodge, Terres Touareg, Desert Luxury Camp) and the
   Great Zimbabwe/Kibale held gaps, using real-browser OTA sessions this time.
3. Sample Booking.com `dest_id` → property-name sanity checks for deep-linked entries that
   Stay22 rewrites to `searchresults.html?dest_type=hotel`.
