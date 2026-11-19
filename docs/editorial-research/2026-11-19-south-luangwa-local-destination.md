# South Luangwa Local Destination — Research Ledger

**Date:** 19 November 2026  
**Category:** destinations  
**Target gap:** Live `/countries/zambia/` (HTTP 200, 19 Nov 2026) explicitly frames South Luangwa as "a strong example of river-centered wildlife travel and guided walking" and "South Luangwa providing a strong example of river-centered wildlife travel and guided walking" but the Destinations rail shows only Livingstone. The live South Luangwa attraction page (HTTP 200) states "Walking safaris are a major part of the park's reputation" and Mfuwe Lodge stay (HTTP 200) calls the valley "widely credited as the birthplace of the walking safari." The South Luangwa walking safari activity was published to GitHub (commits 63d08c7, 7b644e1) but Netlify deploy has not generated the detail page. No local destination guide exists for South Luangwa.

## Evidenced Gap
- Zambia country page: "Destinations in Zambia" renders only Livingstone card
- South Luangwa attraction page: explicitly lists "Guided walking safaris" as a major draw, has Mfuwe Lodge as nearby stay
- Mfuwe Lodge page: states "South Luangwa valley is widely credited as the birthplace of the walking safari"
- South Luangwa walking safari activity: published to repo but not live
- No local destination guide anchors this cluster

## Sources (all checked 19 November 2026)

### 1. Zambia Tourism — South Luangwa National Park (official national tourism board)
**URL:** https://www.zambiatourism.com/destinations/national-parks/south-luangwa-national-park/  
**Key facts extracted:**
- Area: 9,050 km² / 5,623 mi², founded 1972
- Provinces: Northern, Eastern and Central Zambia
- Coordinates: 12.9410° S, 31.9045° E
- "The 'walking safari' was made famous in this park and is still a captivating way to explore the landscape."
- **Mobile walking safaris:** "You will be accompanied by a guide as you walk from one overnight camp to another deep in the heart of the park, along the river banks, exploring areas where there are no roads so you are unlikely to see anything but wildlife. This park is one of the best known for these types of safaris."
- **Nature walks:** "You have the opportunity to enjoy the bush on foot, usually for a few hours at a time. A qualified walking guide and armed ranger will accompany you and make sure of your safety during your excursion."
- Other activities: birding safaris, boat safaris (rainy season), night drives, Kawaza Village cultural visits, Tribal Textiles workshop
- Lodge activities: Game drives (morning/afternoon), night drives, nature walks (few hours, qualified walking guide + armed ranger), local village visits, photographic safaris
- Access: Mfuwe International Airport (Proflight Zambia from Lusaka year-round). Road from Chipata: 123 km / ~2 hours to Mfuwe.
- Seasons: Dry season April–October (intensifies to October, hottest month). Wet season November–March.
- "Some accommodation remains accessible longer than other camps, so an opening calendar is an essential part of the quotation."
- Wildlife: "Valley of the Leopard" — high leopard density; 14 antelope species; ~50 hippos/km of Luangwa River; Thornicroft's giraffe (endemic); elephant herds up to 70; buffalo abundant
- Birding: superb; carmine bee-eaters nesting in river banks; palearctic migrants from Nov (red-chested cuckoo, white storks, European swallows, Steppe eagles/buzzards)
- Accommodation: wide range along Luangwa river's edge; many lodges open all year in central area

### 2. UK FCDO — Zambia Travel Advice
**URL:** https://www.gov.uk/foreign-travel-advice/zambia (updated 12 Nov 2026)  
**URL:** https://www.gov.uk/foreign-travel-advice/zambia/entry-requirements (updated 12 Nov 2026)  
**URL:** https://www.gov.uk/foreign-travel-advice/zambia/safety-and-security (updated 12 Nov 2026)  
**Key facts extracted:**
- Passport: expiry date at least 6 months after arrival, at least 2 blank pages for entry stamping
- Visa: British passport holders do not need a visa; 90 days in any 12-month period for tourists
- KAZA UNIVISA: $50, valid 30 days, unlimited travel between Zambia and Zimbabwe, day trips to Botswana; available online or on arrival at Kenneth Kaunda (Lusaka), Harry Mwanga Nkumbula (Livingstone), Victoria Falls land border, Kazungula land border
- Yellow fever certificate required if arriving from transmission-risk country
- Departure tax: $25 international, $3 domestic (usually included in ticket)
- Safety: Terrorism cannot be ruled out; demonstrations in Lusaka and urban areas can disrupt transport and become violent; crime in larger cities — pre-arrange transport, avoid walking at night; road travel dangerous after dark (abandoned vehicles, pedestrians, stray animals, vehicles without lights); many roads severely potholed; rainy season Nov–Apr brings sudden floods
- Laws: pornography illegal; drugs illegal including marijuana; photography of sensitive sites illegal; same-sex sexual activity illegal; wildlife/animal parts trade illegal without licence
- Driving: UK photocard licence valid up to 90 days; IDP needed for stays >90 days

### 3. Trek Africa Guide — Live Pages (all HTTP 200, checked 19 Nov 2026)
- **Zambia country page:** https://trekafricaguide.com/countries/zambia/ — frames South Luangwa as walking safari area, Destinations rail shows only Livingstone
- **South Luangwa attraction:** https://trekafricaguide.com/attractions/south-luangwa/ — "Walking safaris are a major part of the park's reputation"; Mfuwe Lodge as nearby stay
- **Mfuwe Lodge:** https://trekafricaguide.com/accommodations/mfuwe-lodge/ — "birthplace of the walking safari"; 18 thatched chalets, Bush-Spa, walking safaris offered; no verified OTA booking link
- **South Luangwa walking safari activity:** published to repo (commits 63d08c7, 7b644e1) but detail page returns 404 on live

### 4. The Bushcamp Company — South Luangwa Guide
**URL:** https://www.bushcampcompany.com/pages/south-luangwa-guide  
**Key facts:** Operator runs Mfuwe Lodge and 6 bushcamps (Chindeni, Kapamba, Kuyenda, Bilimungwe, Chamilandu, Chikoko); mobile walking safaris between bushcamps; walking safari heritage

### 5. Remote Africa Safaris
**Key facts:** Operates Tafika Camp and Chikoko Trails (walking-focused); listed on Zambia Tourism with walking safari activities

### 6. Zambia Tourism — Accommodation Listings (checked 19 Nov 2026)
Major operators/camps in South Luangwa:
- Mfuwe Lodge (Bushcamp Company) — $540, gateway lodge, open all year
- Time + Tide: Chinzombo ($1,330), Mchenja ($880), Luwi, Nsolo, Kakuli
- Bushcamp Company bushcamps: Chindeni ($750), Kapamba, Kuyenda ($570), Bilimungwe, Chamilandu ($700), Chikoko
- Remote Africa: Tafika ($613), Chikoko Trails
- Others: Kaingo ($819), Lion Camp ($815), Kulandila ($900), Flatdogs ($300), Chikunto ($500), Track & Trail ($312), Mwamba ($766.50), Thornicroft Lodge, Three Rivers ($735), Puku Ridge ($1,255), Island Bush Camp ($645), Sungani ($1,100), Kafunta ($530), Chichele Presidential ($1,400)

## Cross-link Targets (all live HTTP 200, 19 Nov 2026)
- Country: `/countries/zambia/`
- Attraction: `/attractions/south-luangwa/`
- Accommodation: `/accommodations/mfuwe-lodge/`
- Activity: `/activities/south-luangwa-walking-safari/` (published to repo, pending live)
- Travel Insight: `/travel-insights/plan-your-victoria-falls-visit/` (cross-border relevance)

## Photo Backlog (six-subject, exact/licensed)
1. Luangwa River with hippo pods and riverine woodland
2. Walking safari group with armed ranger interpreting tracks
3. Mobile walking safari camp setup (tents, dining fly, campfire)
4. Thornicroft's giraffe (endemic subspecies) in mopane woodland
5. Leopard in sausage tree (Valley of the Leopard signature)
6. Carmine bee-eater colony nesting in river bank (seasonal Nov–Dec)

All subjects require licensed exact-property/original photography; none available in current repository. Zero-image honest publish.

## Proposed Destination Slug
`south-luangwa`

## Proposed Title
`South Luangwa`

## Category
`Park gateway`

## Hero Title
`South Luangwa: the walking-safari heart of the Luangwa Valley`

## Listing Summary
`Plan a South Luangwa stay around the river, the season and the walking-safari model that fits you — from a gateway lodge to a mobile camp-to-camp trek.`

## Next Steps
1. Write destination guide into `content/local-destinations.json`
2. Update `docs/editorial-progress.json` with deliverable checkpoint
3. Run `node scripts/check-build-inputs.mjs` and full build
4. Commit, push, verify live
5. Append run-log entry and refresh memory