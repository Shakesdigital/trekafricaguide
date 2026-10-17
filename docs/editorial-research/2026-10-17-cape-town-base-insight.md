# Choosing a Cape Town base by planned outings — 17 October 2026

## Editorial record

Added the new published travel insight `choose-cape-town-base-by-outings` to `content/editorial-overrides.json` and related it to Cape Town through `travel_insight_slugs` in `content/local-destinations.json`. It helps readers compare the City Bowl for central-city days, Sea Point for promenade and city days together, and Camps Bay/other Atlantic Seaboard neighborhoods for beach-led plans. It is distinct from `cape-town-before-or-after-safari`, which considers Cape Town's place in a wider safari itinerary.

The guide recommends grouping planned outings, comparing a property's exact address and current route options, and leaving the mountain day flexible. This is editorial planning advice rather than a ranking or transport promise. No fare, travel duration, safety guarantee, review, or availability claim was added. The story uses supported rich-text `body`, research metadata, publication status and SEO fields. Its hero image is explicitly null; the insight has **0/6 photographs** and a separate photo follow-up remains necessary. Existing Cape Town destination and Table Mountain photographs were not reused.

## Sources checked on 17 October 2026

| Source | URL | Use |
| --- | --- | --- |
| Cape Town Tourism, where to stay and neighborhood comparisons | https://www.capetown.travel/the-best-areas-to-stay-in-cape-town/ | City Bowl, Sea Point, Green Point, Clifton/Camps Bay and other base profiles |
| Cape Town Tourism, Central City | https://www.capetown.travel/areas/central-city/ | City Bowl orientation, dining and attraction context |
| Cape Town Tourism, Atlantic Seaboard | https://www.capetown.travel/areas/atlantic-seaboard/ | Extent and neighborhood grouping along the coast |
| Cape Town Tourism, Sea Point | https://www.capetown.travel/sea-point/ | Promenade and neighborhood context |
| Cape Town Tourism, getting around (published 9 September 2026) | https://www.capetown.travel/getting-around-cape-town-heres-your-complete-transport-guide/ | Current overview of transport choices; used without copying fares or safety claims |
| MyCiTi, current route and stop map | https://www.myciti.org.za/en/routes-stops/route-stop-station-map/ | Route map lists Sea Point–Fresnaye–Civic Centre and clockwise/anticlockwise Camps Bay–Civic Centre services; readers are directed to verify their actual stop and service |
| Cape Town Tourism, Camps Bay | https://www.capetown.travel/neighbourhood/camps-bay/ | Beach, tidal-pool and restaurant context |

## Links and publication state

The insight links to the canonical Cape Town local guide, Cape Town attraction guide, Table Mountain guided-hike activity, Mount Nelson accommodation guide and the existing before/after-safari insight. Source and photo credits are recorded in supported content fields; there are no inline external images. Commit `660fe3d` was pushed to `main`. The exact guide URL, https://trekafricaguide.com/travel-insights/choose-cape-town-base-by-outings, returned HTTP 404 on the first request. After one 60-second wait, a second request returned HTTP 200 with the expected page title, City Bowl section and MyCiTi source list. The page is confirmed live. Its hero remains intentionally neutral until the separate six-photo collection is completed.

## Checkpoint

- Content and canonical relationship were pushed and live-confirmed after one bounded retry.
- No tests, build or browser QA run, per standing instructions.
- Owner report sent to fsddanmugisa@gmail.com with subject “Trek Africa Guide update — 17 October 2026, 07:30 Kampala”; Gmail SENT ID `1a148262f1ce457e`. The three-hour schedule resumes at 10:30 Kampala with activities.

Owner update emailed to fsddanmugisa@gmail.com with subject 'Trek Africa Guide update — 17 October 2026, 07:30 Kampala'; Gmail SENT ID 1a148262f1ce457e.
