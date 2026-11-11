# Great Zimbabwe monument-days travel insight — research ledger

**Date:** 2026-11-11
**Category:** travel_insights (travel_articles)
**Slug:** plan-great-zimbabwe-monument-days-from-masvingo
**Country:** zimbabwe
**Status:** drafted this run; see editorial-progress.json for publication receipt

## Evidenced gap

- Live travel-insights archive (HTTP 200, 11 Nov 2026) holds 14 stories with **zero Zimbabwe coverage**; the site's Zimbabwe cluster (country guide, Great Zimbabwe National Monument attraction, great-zimbabwe-guided-monument-visit activity, Great Zimbabwe Hotel stay, Masvingo destination) was completed the same day with no story behind it.
- The live Masvingo destination page rendered **no Travel insights card at all** (`travel_insight_slugs` empty; zero `travel-insights/` refs in live HTML, 11 Nov 2026).
- The live monument attraction guide instructs readers to "Plan the visit from Masvingo and allow time for uneven paths, a steep hill section" — pacing/road/second-day questions were answered on no page.
- Duplicate check: no existing insight covers Great Zimbabwe, Masvingo, or Zimbabwe monument planning (14 slugs enumerated live; `plan-your-victoria-falls-visit` covers the falls only).

## Key facts verified (all fetched/checked 11 November 2026)

- **greatzimbabweguide.com travel guide (last updated March 2024):** ruins 25 km south-east of Masvingo; ~4 h drive from Bulawayo and Harare respectively, ~8 h from Victoria Falls; drive through Masvingo on A4 and turn left following signs; A4 tarred and fairly busy (main international freight route); don't pull off in remote stretches between Harare and Masvingo; no scheduled reliable public transport Masvingo→monument (hotel/lodge private shuttle; lodges with intercity shuttles); informal minibuses from Harare Road Port / Mbare terminals, then walk past Great Zimbabwe Hotel (~2 km); Masvingo Airport charter flights only (<1 h domestically); entry fee US$5 residents / US$15 non-residents **including** the museum (dated March 2024 — reconfirm posture carried); gates usually 08:00–17:00, arrive ~09:00 recommended; ~4 h recommended vs 2 h fast walk; paths sandy but bumpy; Hill Complex single file and steep in places, less suitable for younger children; guide not necessary (signs + booklets; government guide at gate, private via lodges/operators; This and That Safaris / Black Rhino Safaris named from Harare/Bulawayo); toilets at main gate and museum/restaurant only, none inside the ruin area; ATMs in Masvingo 25 km away; best April–September, rains November–March; high altitude keeps heat workable but the sun is powerful.
- **greatzimbabwewhs.com local-attractions guide:** Murray McDougall Drive — scenic circular drive connecting Masvingo, the Lake Mutirikwi shoreline and the dam wall, called "Zimbabwe's garden route"; good tarred road for the first sixty kilometres, some twenty-five kilometres of dirt road, before joining the tar again on the A9; "a full day's journey". Lake Mutirikwi built 1961, "second largest inland lake in Zimbabwe formerly known as Lake Kyle" (their claim, vs association's largest claim — carried conflicts noted). Masvingo founded 1890; name sequence Fort Victoria → Victoria 1929 → Nyanda 1982 → Masvingo 'fortifications'.
- **ZimParks Lake Kyle Recreational Park page:** 169 km² park about 30 km east of Masvingo, Great Zimbabwe Ruins (a world heritage site) to its south. (Park's wildlife list, Beza Range and no-fees-online posture carried from the Masvingo destination record checked earlier today.)
- **Masvingo Publicity Association (carried from the Masvingo record, checked 11 Nov 2026):** monument 27 km from town; Lake Mutirikwi ~25 km; Chesvingo Karanga Village 40 km along Great Zimbabwe Road toward the Kyle dam wall.
- **UNESCO ID 364 (carried from the Masvingo record, checked 11 Nov 2026):** inscribed 1986, criteria (i)(iii)(vi), 722 ha, ~30 km from Masvingo, living sacred site; whc.unesco.org re-fetch returned HTTP 403 to this environment this run — facts carried from the morning record, not re-fetched.
- **On-site cluster re-read live 11 Nov 2026:** all six cross-link targets HTTP 200 (see research_sources entry 6).
- **Not claimed:** current gate fee as fact (dated figure + hedge only); ZimParks fees; opening hours as guaranteed; shuttle prices; no invented reviews or dates.

## Photos (six, all distinct from existing collections)

Checked against the live great-zimbabwe-guided-monument-visit activity collection (Jan Derk 1997 x3, ulamm 1983 x2, Maciver 1906) and the monument attraction's thumb gallery (Klinzing wall, Hill Complex (2), amanderson2 passageways, Moore Conical Tower V, still-standing, Great Hill Complex, Hügelsiedlung) — none reused:

1. great-enclosure-wall-2015-schertzer.jpg — CC BY 3.0, Fanny Schertzer, 2015-09-07 (Great Enclosure outer wall) — **hero**
2. sacred-enclosure-2015-schertzer.jpg — CC BY 3.0, Fanny Schertzer, 2015-09-07 (sacred enclosure)
3. site-aerial-looking-west-2015-bell.jpg — CC BY-SA 4.0, Janice Bell, 2015-07-17 (aerial overview)
4. western-entrance-2019-moore.jpg — CC BY-SA 2.0, Andrew Moore, 2019-03-26 (western entrance passage)
5. masvingo-city-centre-2020-realtino.jpg — CC BY-SA 4.0, Realtino, 2020-08-19 (base town)
6. lake-kyle-2011-maitynoe.jpg — CC BY-SA 4.0, MaiTynoe, 2011-07-23 (Lake Mutirikwi/Kyle)

All downloaded from Commons 1920px renditions with SHA-256 recorded; attribution in on-page captions; `requires_attribution` notes carry share-alike where applicable.

## Booking CTA

None by design: insight pages carry no product CTA (house pattern; see Marrakech/Tunis/Egypt precedents); no booking-destinations.json change.

## Files

1. `content/editorial-overrides.json` — travel article appended (26th story, first Zimbabwe insight)
2. `content/local-destinations.json` — masvingo.travel_insight_slugs + this slug (first insight card on the page)
3. `src/lib/photo-library.js` + `public/photo-library.js` — six catalog entries
4. `public/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo/` — six JPEGs
5. Scripts: `download-great-zimbabwe-insight-photos.mjs`, `add-great-zimbabwe-insight.mjs`, `insert-great-zimbabwe-photo-library.mjs`, `check-great-zimbabwe-dist.mjs`; source snapshots `src-greatzimbabweguide-travel-guide.txt`, `src-greatzimbabw.txt` (whs), `src-zimparks.txt`
