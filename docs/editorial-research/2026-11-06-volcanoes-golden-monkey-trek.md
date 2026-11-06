# Live-site gap — Golden monkey trekking, Volcanoes National Park (new activity page) — 6 November 2026

## Live-site evidence (gap)
- Live URL reviewed: https://trekafricaguide.com/activities/ (16 activities, checked 6 November 2026).
- Evidence: Rwanda's Volcanoes National Park is already represented by a published gorilla trekking activity (attraction 71) and accommodation (Sabyinyo), but no page answers the common follow-up question "what else is there to do after/with gorillas in Volcanoes?" Golden monkey trekking is the park's most evidenced second primate experience and was absent from the catalogue.
- Reader impact: a traveller pairing gorilla trekking with a second day (or time-sufficient for only a half-day primate walk) currently has no internal guide for permits, the 7 a.m. Kinigi reporting time, fee categories or suitability.
- Next editorial category on rotation: activities (this deliverable).

## Facts and sources (all checked 6 November 2026)
1. RDB online booking portal, golden monkey product page — permit fee categories (foreigner adult USD 100; Rwandan/EAC foreign-resident USD 65; East African citizen USD 65 / EAC foreign resident USD 80; Rwandan citizen RWF 4,000), 4 consecutive months' residency rule for resident rates; minimum age 12 years; maximum 16 visitors per group; reporting 07:00 at the visitor information/registration centre; the visit runs once per day from Kinigi headquarters; time allocated once booked; document verification at park entry, erroneous/false applications denied entry regardless of payment. https://visitrwandabookings.rdb.rw/rdbportal/golden-monkeys (SPA page text retrieved through r.jina.ai render, same URL).
2. Visit Rwanda — Primate Tracking: golden monkeys occur in Volcanoes NP and Gishwati; in Volcanoes two groups can be tracked, one on the slopes of Mount Karisimbi and one in the bamboo forest on Mount Sabyinyo; a standalone excursion, departing Kinigi headquarters once each day. https://visitrwanda.com/interests/primate-tracking/
3. Visit Rwanda — Volcanoes National Park: Virunga ecosystem, Karisimbi/Bisoke/Sabyinyo/Gahinga/Muhabura, "what to wear" (sturdy clothing, solid walking shoes, gaiters/lightweight waterproof for rain). https://visitrwanda.com/destinations/volcanoes-national-park/
4. Visit Rwanda — Weather: rainy seasons mid-February–May and mid-September–mid-December; dry season June–mid-September with easier roads and paths. https://visitrwanda.com/facts/weather/
5. Rwanda Immigration — visa-on-arrival official entry guidance page linked as the entry-check pointer (generic helper line, no rule asserted). https://www.migration.gov.rw/visa-on-arrival
6. GetYourGuide — exact product "Golden Monkey Trekking with lunch", product t850037 (Kigali-l32466), collector: activity provider "Private Tours /Rwanda"; 4.8/5 from 6 reviews (checked 6 November 2026); USD 320 per person advertised at check time; ~8-hour day; Kigali hotel pickup; English/French guide; includes the USD 100 golden monkey ticket, lunch, bottled water, 4WD private transport; not suitable for under-12s; drones and littering prohibited; trek described by the provider as shorter ("about an hour") and less strenuous than gorilla trekking. https://www.getyourguide.com/kigali-l32466/golden-monkey-trekking-with-lunch-t850037/ (retrieved through r.jina.ai render).

## Dated traveller feedback (verified-booking reviews on the exact product, retrieved 6 November 2026)
- Adam (United States, 5 July 2026): guide wonderful, experience incredible.
- GetYourGuide traveller (Norway, 29 October 2025): fantastic guide, beautiful landscape, "got really close to the monkeys".
- GetYourGuide traveller (Argentina, 15 July 2025): praised the organisation and mentioned an added Dian Fossey Foundation visit.
- Booking reviews describe one product, not the park overall; no park-wide guarantee is implied.

## Canonical relationships
- Parent attraction: `volcanoes-national-park`, attraction_id **71** (verified against trek-cms-native-backup-20261025.json; cross-check: Sabyinyo accommodation override uses attraction_id 71).
- Prose internal links: /attractions/volcanoes-national-park, /activities/volcanoes-gorilla-trek, /accommodations/sabyinyo-silverback-lodge (all published).
- Nearby stays: inherited from the attraction's canonical relationships (Sabyinyo via attraction_id 71); no new stay records.
- sort_order 17 (activities max was 16, Murchison launch trip).

## Booking destination (exact OTA product through the shared Stay22 resolver)
- activities key `volcanoes-golden-monkey-trekking` → https://www.getyourguide.com/kigali-l32466/golden-monkey-trekking-with-lunch-t850037/
- provider getyourguide; operator "Private Tours /Rwanda"; rating 4.8; review_count 6; checked_at 2026-11-06 (within the 90-day review-label window).
- URL matches the resolver's getyourguide pattern (`-t850037/`), so `buildStay22Url` wraps it; no generic search pages.

## Images
- Published with the site's honest no-photo presentation (hero_image_url null, empty gallery); no stock or generated images assigned.
- Six-subject photo backlog (separate image-automation follow-up, must not reuse attraction/gorilla-trek photos): 1) Kinigi trailhead/registration morning, 2) bamboo forest interior on the Sabyinyo or Karisimbi route, 3) golden monkeys in bamboo (safe distance), 4) ranger briefing before departure, 5) forest trail/golden light, 6) trekkers following rangers on the monkey walk. Verify reuse rights and license/creator/date metadata before use.

## Not asserted
- No official viewing-time limit for golden monkeys is stated on the RDB page; "about an hour" is the linked product's own estimate and is attributed as such.
- No published price of the Kigali product is treated as fixed (advertised at check time); fees verified from RDB categories only.

## Checkpoint
- Status: research complete; copy drafted; JSON edits pending. Active task under owner's 6 November live-site instruction and activities rotation.
- Next: add record to content/editorial-overrides.json, register booking destination, validate JSON, commit/push to main, verify live URL and rendered linkage separately from push, then update docs/editorial-progress.json.
