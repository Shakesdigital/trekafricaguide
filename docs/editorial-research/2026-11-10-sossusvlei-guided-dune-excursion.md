# 2026-11-10 - Sossusvlei guided dune excursion (activities rotation)

## Gap
Live activities directory (checked 10 Nov 2026) listed 21 published pages with zero Namibia activity pages, while the Namibia cluster held: country guide, Sesriem & Sossusvlei destination, Namib Desert attraction, three stay guides (Sossusvlei Lodge, Desert Quiver Camp, Desert Luxury Camp) and two published Sossusvlei-sunrise planning insights. Two Sossusvlei sunrise insights already exist, so the new page is angled as the outing product itself (deadvlei walk, dune climb choice, shuttle interplay, guided costs), not a third sunrise planning story.

## Deliverable
- Slug: `sossusvlei-guided-dune-excursion`, attraction id 60 (namib-desert), country Namibia.
- Booking: GetYourGuide exact product t1314104 "2-Day Scenic Sossusvlei Adventure Tour", provider Desert Dunes and Dust Tours, from EUR 754, 5.0/5 from 2 reviews (small sample), free cancellation 24 h, reserve-now-pay-later, pickup included, park fees + Moon Mountain Lodge + meals included, minimum 2 pax. Verified live 10 Nov 2026 in the embedded browser.

## Facts checked live 10 Nov 2026
- NWR Sesriem Campsite page: "located by the Sesriem canyon, which marks the gateway to the globally renowned Sossusvlei inside the world's oldest desert"; rate sheet Nov 2026Jun 2027: shuttle (2x4 to Deadvlei stage) N$180 pp, sunset drive to Elim Dune N$300, canyon drive N$200, guided morning drive N$600 excl / N$700 incl breakfast.
- MEFT FAQ: all national parks issue permits on arrival at the gate; fees differ at a few; no permit for the main road through Namib-Naukluft.
- MEFT Namib-Naukluft overview (HTTP 200): dunes at Sossusvlei, canyon at Sesriem; Sossus Dune Lodge in-park; sunset drives, guided nature drives, stargazing, canyon walks.
- MEFT news 299 page exists (200) but body not text-extractable; carried as existence evidence only.
- Internal pages carried with backlinks: destination page (60 km beyond gate, Windhoek 334 km, canyon 1 km / 30-40 m, 2026 access-rule changes), attraction guide, two sunrise insights.
- UNESCO Namib Sand Sea (site 1430, inscribed 2013) reachable; no uncited numeric claims drawn.

## Photos (six distinct Wikimedia Commons files, downloaded via Special:Redirect/file at 1800-1920 px, SHA-256 recorded in photo-library entries)
1. dead-vlei-camelthorn-2018-delso-dd-085.jpg - Diego Delso, CC BY-SA 4.0, 2018-08-06 (hero/galleria 1).
2. big-daddy-aerial-2019-kraasch.jpg - Reinhard Kraasch, CC BY-SA 4.0, 2019-10-22.
3. oryx-big-daddy-2021-strassler.jpg - Christoph Strässler, CC BY-SA 2.0, 2021-09-20.
4. dune-45-sunrise-2006-schaufele.jpg - Philipp Schäufele, CC BY-SA 3.0, 2006-11.
5. sesriem-canyon-2018-delso-dd-186.jpg - Diego Delso, CC BY-SA 4.0, 2018-08-06.
6. view-from-big-daddy-2006-willis.jpg - Greg Willis, CC BY-SA 3.0, 2006-10-02.
Note: the activities pipeline (linkAttractionMentions -> sanitizeRichText without allowImages) strips inline body figures; the six photos are therefore wired as record.gallery + hero_image_url, rendered by the Gallery component with photo-library credits, matching the reference page's gallery behavior.

## Quality bar vs reference (volcanoes-golden-monkey-trekking)
h2 flow About this activity / Highlights / Best time to participate / Planning notes / Booking option / Nearby stays matches; h3 subheads inside sections. "You may also like" absent because the template only lists same-country activities and Namibia has no second published activity (same situation as the Botswana mokoro page). Stay22 CTA campaign activities_sossusvlei_guided_dune_excursion, notes/operator/rating render in the About-this-option details. Destination page now lists the activity.

## Build/QA
npm run build: check-build-inputs passed, production build 147 pages, readability guard passed 152 pages; new page in gallery/activities index; all six gallery JPEGs present in dist.

## Not done in this run
- No new figures sourced for N$ fees beyond the Sesriem rate sheet; park fees PDF (April 2026) was image-only and could not be text-extracted, so no figures were drawn from it.
