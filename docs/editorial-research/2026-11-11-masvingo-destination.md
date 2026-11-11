# Masvingo local destination — research ledger

**Date:** 2026-11-11
**Category:** destinations (local_destinations)
**Slug:** masvingo
**Country:** zimbabwe
**Status:** published_live_confirmed, content commit e5b88c0

## Evidenced gap

- Live `/countries/zimbabwe/masvingo/` returned HTTP 404 before this run while the live Zimbabwe country page (HTTP 200, 11 Nov 2026) rendered no Destinations rail at all.
- The live Great Zimbabwe National Monument attraction guide instructs readers to "Plan the visit from Masvingo" with no city guide behind it; the same-day Great Zimbabwe Hotel accommodation guide's own ledger records "No Masvingo local destination page exists to host a Where-to-stay rail".
- Homepage search suggestions carry zero Zimbabwe destinations; Zimbabwe is the only country with a published stay guide in the monument cluster but no destination page.
- Duplicate check: no masvingo or great-zimbabwe slug in local-destinations.json (grep + node check).

## Key facts verified (all checked 11 November 2026)

- **UNESCO ID 364:** Great Zimbabwe National Monument inscribed 1986, criteria (i)(iii)(vi), property 722 ha, approximately 30 km from Masvingo in the lowveld at ~1,100 m; Shona city 11th–15th centuries; 14th-century population over 10,000; abandoned ~1450; Hill Ruins / Great Enclosure / Valley Ruins; steatite Zimbabwe Birds adopted as the national emblem; protected since 1893; NMMZ-managed; still a living sacred site.
- **Masvingo city:** founded 1890, oldest surviving colonial town in Zimbabwe; name sequence Fort Victoria → Victoria (1929) → Nyanda (1982) → Masvingo ('fortifications') — greatzimbabwewhs.com.
- **Masvingo Publicity Association:** Great Zimbabwe 27 km from the city; city of almost 20,000 Shona people, 12th–15th centuries, ~600 years of development, ~720 ha; Lake Mutirikwi formed 1961 by the Mutirikwi and Mushagashe rivers, ~25 km from the city, bass fishing/skiing/boating/yachting/game viewing by boat; Chesvingo Karanga Village community project 40 km along Great Zimbabwe Road toward the Kyle Dam Wall (6 am–6 pm, music, dances, foods, granaries, caves, rock paintings).
- **ZimParks (Lake Kyle Recreational Park):** 169 km² park ~30 km east of Masvingo, Great Zimbabwe Ruins to its south; Beza Range 1,455 m on the northern boundary; 25+ wild mammal species including white rhino, buffalo and leopard; 35+ bird species; miombo woodland and rocky hills.
- **Access:** A4 through Masvingo tarred and busy (main international freight route); ~4 h from Harare or Bulawayo, ~8 h from Victoria Falls (attributed planning figures with confirm-provider hedge); no reliable scheduled public transport to the monument (hotel shuttles or minibuses); Masvingo Airport charter flights only.
- **Carried conflicts with attribution:** Lake Mutirikwi "largest inland lake" (association) vs "second largest after Kariba" (WHS guide); Great Zimbabwe distance 27 km (association) vs ~30 km (UNESCO); city size ~20,000 (association) vs 14th-century population over 10,000 (UNESCO).
- **Not claimed:** park entry fees (ZimParks publishes none online — confirm-with-operator posture); no accommodation rates; no invented reviews.

## Booking CTA

None by design: destination pages carry no hotel-booking surrogate; the stay surface is the published Great Zimbabwe Hotel guide (no verified exact OTA listing exists for that property per its own ledger).

## Files

1. `content/local-destinations.json` — masvingo record appended (16th destination, first under Zimbabwe)
2. `docs/editorial-research/add-masvingo-destination.cjs` — append script
3. `docs/editorial-research/check-masvingo-dist.mjs` — dist verification script
4. `docs/editorial-progress.json` — deliverable record + latest_run_checkpoint

## Build and live verification

- check:build-inputs passed; production build 157 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 162 pages.
- Dist pre-push checks: title "Masvingo, Zimbabwe | Trek Africa Guide"; 8-section destination h2 flow; all facts render; attraction/activity/stay cards present; country rail + homepage search updated; no JSON leak.
- Committed e5b88c0, pushed main (0e8c748..e5b88c0).
- Live receipt ~60 s after push: `/countries/zimbabwe/masvingo/` HTTP 200 (35,312 bytes), Chesvingo/Lake Mutirikwi/Beza Range/1986/722 hectares/white rhino/fortifications all render; three card targets HTTP 200; Zimbabwe country page renders "Destinations in Zimbabwe" with the Masvingo card; no markup leak.

## CMS mirror

Publishable-key REST reads 2026-11-11: travel_articles 404, local_destinations 404, editorial_documents 404 in the schema cache (previous runs: travel_articles 200 seeded, local_destinations 404, editorial_documents 401). Mirror status pending; no writes attempted; owner-side CMS check to confirm local_destinations/masvingo.

## Next rotation

travel_insights (accommodations was filled this round by another agent's Great Zimbabwe Hotel guide; this run took destinations).
