# Volcanoes gorilla trekking photo enrichment — 2026-11-11

Run: image-enrichment heartbeat, collection `/activities/volcanoes-gorilla-trek/` (activity, target 7–12).

## Page and scope

- Live page before edit: https://trekafricaguide.com/activities/volcanoes-gorilla-trek/ — HTTP 200, published, 3 dedicated photos in gallery ("See all 3 images"): two stock images (Charles J. Sharp CC BY-SA 4.0, Nina R CC BY 2.0) plus one Pexels image (Ana Kenk, Pexels License) of a silverback at Kinigi.
- Picked as the live site's least-photographed activity page (3 photos against 7–12 target; other activity/attraction pages at 5+).
- Guide's activity facts: ranger-led gorilla trek in Volcanoes National Park, Rwanda; registration/briefing at Kinigi; habituated groups on Karisimbi and Sabyinyo slopes. All photos checked for exact Volcanoes NP location; exact-location rule applied (Volcanoes NP only, not Mgahinga, Bwindi, or Virunga NP generally).

## Rights standard applied

Owner decision 2026-11-07: free stock incl. credit-bearing CC allowed; NC/ND excluded; exact subject only; no OTA/social thumbnails; no AI-fabricated subjects.

## Source review

Wikimedia Commons MediaSearch "Volcanoes National Park gorilla" returned 17,000+ results. Filtered for files explicitly naming Volcanoes National Park in title/description, with CC BY / CC BY-SA / CC0 licences. Selected 4 distinct-subject files:

| file | creator | licence | captured | subject | evidence |
|---|---|---|---|---|---|
| Female Gorilla in Rwanda at the Volcanoes National Park (290812727).jpg | Derek Keats | CC BY 2.0 | 2006-11-04 | female gorilla | title, DateTimeOriginal, GPS in Rwanda |
| Gorillas of Volcanoes National park.jpg | Mahorogeoffrey | CC BY-SA 4.0 | 2019-08-17 | gorilla group | title, DateTimeOriginal |
| Mountain gorilla from Susa Group in Karisimbi thicket... | Emmanuel Kwizera | CC BY-SA 4.0 | 2019-12-01 | Susa group gorilla | title names Susa Group, Karisimbi thicket, Volcanoes NP |
| Gorillas at Volcanoes National Park, Rwanda.jpg | Voyager | CC BY-SA 4.0 | 2017-05-15 | gorillas | title, DateTimeOriginal |

All downloaded from Wikimedia Commons originals (largest available sizes), aspect preserved, no edits. SHA-256 recorded.

Excluded: Mgahinga NP files (different park), Virunga NP (DRC), generic "mountain gorilla" without park evidence, ND/NC licences, files with people/tourist interaction as primary subject.

## Result

- Gallery extended 3 → 7 dedicated photos (3 stock + 1 Pexels + 4 new Wikimedia Commons).
- 4 new library entries added to src/lib/photo-library.js; gallery array extended in listings.activities.volcanoes-gorilla-trek; updated_at bumped.
- public/photo-library.js regenerated via scripts/sync-photo-library.mjs; npm run check:build-inputs passed.
- Factual copy untouched; stock hero/starter images retained.

## Missing subjects recorded (future runs)

Kinigi registration/briefing centre, tracker/ranger at work, trekkers on forest trail (no people as primary subject), bamboo zone vegetation, specific habituated group identities (Susa, Amahoro, etc.) — reopen when new rights-clean exact-subject leads appear.

## Files

- public/images/editorial/volcanoes-gorilla-trek/vnp-female-gorilla-2006-keats.jpg (new)
- public/images/editorial/volcanoes-gorilla-trek/vnp-gorillas-group-2019-mahorogeoffrey.jpg (new)
- public/images/editorial/volcanoes-gorilla-trek/vnp-susa-group-gorilla-2019-kwizera.jpg (new)
- public/images/editorial/volcanoes-gorilla-trek/vnp-gorillas-2017-voyager.jpg (new)
- src/lib/photo-library.js (4 new image entries; gallery append; updated_at)
- public/photo-library.js (mirror regenerated)
- docs/editorial-research/2026-11-11-volcanoes-gorilla-trek-photo-enrichment.md
- docs/image-enrichment-progress.json