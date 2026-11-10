# Research ledger — 2026-11-09: "Serengeti safari and Zanzibar: connecting the two halves" (travel insight)

## Selected gap and evidence
- Category: travel_insights (rotation next_category after Nairobi Serena run).
- Live evidence (2026-11-09): the published [Unguja destination guide](https://trekafricaguide.com/countries/tanzania/unguja/) instructs readers in its Planning-your-stay section to "open the **linked** Serengeti and Zanzibar planning insight rather than assuming the island is a short overland extension of the parks" — but `travel_insight_slugs` was empty and no such insight exists live (only the nav link `/travel-insights` renders on the page). The instruction refers to a story the site no longer holds.
- The live travel-insights archive (2026-11-09) lists 9 stories: South Africa x2, Uganda x3 (+1 cross-border), Tunisia x1, Namibia x1, Zambia/Zimbabwe x1, Kenya x1. **Zero Tanzania stories** while Tanzania holds a published destination (Unguja), two published attraction guides (Serengeti, Zanzibar) and an island activity/stay cluster.
- Registry: `combine-serengeti-and-zanzibar` is an owner-removed development seed (docs/editorial-progress.json owner_removed_articles + 2026-10-17 insight-cleanup note). This run does NOT restore it: new slug **pair-tanzania-safari-with-zanzibar-coast**, original outline, no copied seed text. (Precedent: the Kenya first-safari insight was similarly written fresh over dead legacy registry slugs.)

## Sources and claim level (all checked 9 November 2026 unless noted)
1. **Trek Africa Guide Serengeti attraction guide** (live HTML, 9 Nov 2026): TANAPA-identified visitor activities (game drives, balloon excursions, authorized walking); Arusha and Kilimanjaro named as principal planning gateways; road vs light-aircraft tradeoffs; June–October dry-season migration travel and January–February calving interest as TANAPA patterns; separate accommodation/park/concession/transport charges in quotes; light-aircraft baggage limits; avoid tight same-day connections to an international departure.
2. **Trek Africa Guide Zanzibar attraction guide** (live HTML, 9 Nov 2026): ZCT experience menu (Stone Town, spice farms, Jozani, marine); ferry/flight verify-direct language; land-based alternative for sea excursions; avoid excursions before international departures.
3. **Trek Africa Guide Unguja destination guide** (live HTML, 9 Nov 2026): ZCT June–October dry-season window; Stone Town + separate coastal base structure; the exact "linked Serengeti and Zanzibar planning insight" demand recorded above.
4. **In-repo verification record**: Zanzibar Commission for Tourism zanzibartourism.go.tz homepage seasonal claim verified 16 October 2026 in `content/local-destinations.json` (unguja research_sources); carried with that date.
5. **Published island cluster for cross-links**: /activities/stone-town-historical-walking-tour, /accommodations/emerson-spice, /activities/spice-tour (Supabase-managed; separate CTA), /attractions/jozani-forest, /countries/tanzania (Zanzibar/Jozani attraction cards; live-checked hrefs 9 Nov 2026).
6. **Published safari half for cross-links**: /activities/serengeti-balloon-safari, /accommodations/serengeti-serena-safari-lodge, /attractions/serengeti-national-park, /countries/tanzania (live-checked hrefs 9 Nov 2026).

## Network outage note (context for the next run)
This run executed during a partial network outage: github.com, whc.unesco.org and the Tanzania/Zanzibar government hosts (zanzibartourism.go.tz, airports.go.tz, TANAPA, the Tanzanian eVisa portal) were unreachable; DNS partially failing (service restored for github via a local DoH-pinned tunnel). An attempt to re-verify the ZCT seasonal claim directly returned a transport error (checked 9 Nov 2026). Consequence:
- No visa fees, insurance rules, flight schedules, ferry timetable or domestic airfare figures are reprinted — the article defers all such confirmations to the operator and the authorities, in the South Luangwa precedent.
- TANAPA statements carried are those quoted in the live Serengeti guide (verified by the earlier attraction run), not fresh TANAPA fetches.

## Editorial decisions
- Zero-image publish; six-subject photo backlog: Seronera value plain at dawn, migration herd column across grassland, Grumeti river corridor, Stone Town dhow harbor at dusk, east-coast dawn beach empty, spice-farm interior. Never reuse attraction/destination collection photos.
- No booking CTA by design (insight pages carry no product; revenue surface is the two balloon/spice-tour activity cards and stay rails via cross-links).
- New relationships: `content/local-destinations.json` unguja.travel_insight_slugs gains this slug (fixing that page's dangling demand).
- Honest fences in copy: no promises of river crossings or herd positions; connection logistics framed as "confirm with operator"; no,port/entry documents invented.
