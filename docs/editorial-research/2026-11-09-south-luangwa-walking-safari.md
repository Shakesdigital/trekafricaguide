# Activity: South Luangwa walking safari — 9 November 2026

## Selection (live inventory)

- Category rotation: the travel-insights turn closed with `travel_insight_bwindi_vs_volcanoes_choice` (live, `aa0f21c`); current rotation category is **activities**.
- Evidence: the live [South Luangwa attraction page](https://trekafricaguide.com/attractions/south-luangwa/) (HTTP 200, checked 9 Nov 2026) lists "Guided walking safaris" top of its what-draws-people panel and its intro makes walking the park's defining reputation, yet the page renders **no Related activities card** and the site had no South Luangwa activity guide among the 18 published activities (slugs re-listed from `content/editorial-overrides.json` this run). Reader impact: the page's own booking option is a GetYourGuide **game drive** — a reader whose reason for coming is a walk had no local guide to plan from.
- Not a duplicate: existing activities checked against the slug list — no South Luangwa or Zambia-park activity exists.

## Claim-level sources (all checked 9 November 2026)

1. Zambia Tourism: South Luangwa National Park visitor guide — the walking safari "originated in South Luangwa"; mobile walking safaris move camp-to-camp "deep in the heart of the park" through roadless river country; nature walks run "usually for a few hours at a time" with "a qualified walking guide and armed ranger" escorting; night drives are a camp routine; park 9,050 km², founded 1972; dry season April–October intensifying (October hottest, game at water), wet November–March lush with migrant birds; Mfuwe International Airport the air hub with Proflight Zambia year-round Lusaka flights and high-season frequency increases; Chipata road 123 km ≈ 2 h to Mfuwe; "Valley of the Leopard" nickname; central-area lodges open year-round while remote camps follow opening calendars. https://www.zambiatourism.com/destinations/national-parks/south-luangwa-national-park/
2. Trek Africa Guide published South Luangwa attraction guide — walking safaris are "guided activities with specific arrangements, not permission to walk independently"; Mfuwe gateway and Chipata road approach; check carried on the live page 9 Nov 2026.

## Editorial approach

Follows the published Murchison launch-trip / Kibale chimp-trek zero-CTA, zero-photo precedents: h2 template flow (About this activity, Highlights, Best time, Planning notes, honest no-verified-booking rail, You may also like, Nearby stays), attributed authority claims with check dates, confirm-before-you-book list, packing list. Only internal links to already-published pages: the South Luangwa attraction guide and the Mfuwe Lodge stay guide.

## Checks

- No invented facts, prices, dates, reviews or images. No rate/availability/review claims anywhere.
- Booking CTA: **none**. A GetYourGuide "walking safari" product for South Luangwa could not be found (Bing query `South Luangwa walking safari GetYourGuide` returned no results, 9 Nov 2026); the attraction page's existing CTA stays a game drive. No booking-destinations entry added. Exact-property test repeats when an OTA listing surfaces.
- DNPW (dnpw.gov.zm) fetches failed with transport errors from this environment on 9 Nov 2026 — the authority side (park entry fee values, walk-permit rules) is therefore **not verified**; the page directs readers to confirm entry terms with the operator rather than reprinting fees.
- Zero images: honest no-hero state; six-subject licensed-photo backlog recorded in editorial-progress.json. Photos must not reuse the Mfuwe Lodge or South Luangwa attraction collections.
- Temp artifacts: none persisted (this helper script lives in the ledger directory as `add-walking-safari.cjs`).

## Publication record

- Build: check-build-inputs + check-rendered-content run this run; commit/push/live verification filled in editorial-progress.json `activity_south_luangwa_walking_safari`.
