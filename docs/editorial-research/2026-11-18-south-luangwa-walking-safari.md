# South Luangwa Walking Safari — Research Ledger

**Date:** 18 November 2026  
**Category:** activities  
**Target gap:** South Luangwa attraction page frames guided walking safaris as a major draw ("Guided walking safaris" listed under "What draws people here") but has zero Related activities. The activities archive holds no Zambia walking safari activities.

## Evidenced Gap
- Live `/attractions/south-luangwa/` (HTTP 200, 18 Nov 2026) explicitly lists "Guided walking safaris" as a check-list draw.
- The attraction page's booking panel offers only a morning game drive (GetYourGuide t1056815).
- Activities archive (26 published) contains zero Zambia walking safari entries.
- Mfuwe Lodge accommodation page (live) states: "the South Luangwa valley is widely credited as the birthplace of the walking safari, an experience the operator's own guides lead in the park."

## Sources (all checked 18 November 2026)

### 1. Zambia Tourism — South Luangwa National Park (official national tourism board)
**URL:** https://www.zambiatourism.com/destinations/national-parks/south-luangwa-national-park/  
**Key facts extracted:**
- "The 'walking safari' was made famous in this park and is still a captivating way to explore the landscape."
- **Mobile walking safaris:** "You will be accompanied by a guide as you walk from one overnight camp to another deep in the heart of the park, along the river banks, exploring areas where there are no roads so you are unlikely to see anything but wildlife. This park is one of the best known for these types of safaris."
- **Nature walks:** "You have the opportunity to enjoy the bush on foot, usually for a few hours at a time. A qualified walking guide and armed ranger will accompany you and make sure of your safety during your excursion."
- Other activities listed: birding safaris, boat safaris (rainy season), night drives, Kawaza Village cultural visits, Tribal Textiles workshop.
- **Lodge activities:** Game drives (morning/afternoon), night drives, nature walks (few hours, qualified walking guide + armed ranger), local village visits, photographic safaris.
- Park area: 9,050 km², founded 1972. Coordinates: 12.9410° S, 31.9045° E.
- Access: Mfuwe International Airport (Proflight Zambia from Lusaka year-round). Road from Chipata: 123 km / ~2 hours to Mfuwe.
- Seasons: Dry season April–October (intensifies to October, hottest month). Wet season November–March.
- "Some accommodation remains accessible longer than other camps, so an opening calendar is an essential part of the quotation."

### 2. Trek Africa Guide — South Luangwa attraction page (live)
**URL:** https://trekafricaguide.com/attractions/south-luangwa/  
**Confirmed (18 Nov 2026):** Lists "Guided walking safaris" under "What draws people here". Booking panel shows only GetYourGuide t1056815 (morning game drive, no reviews yet). No Related activities section exists.

### 3. Trek Africa Guide — Mfuwe Lodge accommodation page (live)
**URL:** https://trekafricaguide.com/accommodations/mfuwe-lodge/  
**Confirmed (18 Nov 2026):** States "the South Luangwa valley is widely credited as the birthplace of the walking safari, an experience the operator's own guides lead in the park." Guided outings include "day and night game drives, walking safaris and sundowners."

### 4. The Bushcamp Company — South Luangwa Guide (operator running Mfuwe Lodge and bushcamps)
**URL:** https://www.bushcampcompany.com/pages/south-luangwa-guide  
**Note:** Shopify-rendered page; content consistent with Zambia Tourism on walking safari heritage. Operator runs mobile walking safaris between bushcamps.

## Booking CTA Status
- **No verified walking safari product URL found.** The GetYourGuide link on the attraction page (t1056815) is for a morning game drive with transfers, not a walking safari. GetYourGuide South Luangwa category page returns errors from this network location.
- **Honest state:** verified booking link not yet available. Will record `booking_url: null` and `booking_note: "No verified walking safari product URL found; the attraction page's GetYourGuide link (t1056815) is for a morning game drive. Walking safaris are typically arranged through lodges (Mfuwe Lodge, Bushcamp Company camps, Remote Africa Safaris camps) or specialist operators. Contact your accommodation for walking safari inclusions and standalone bookings."`

## Price/Schedule Discipline
- Zambia park fees and walking safari costs vary by operator and camp. No official published fee table found on DNPW (Department of National Parks and Wildlife Zambia) site accessible this run.
- **Omit contested figures.** Record only: walking safaris are offered as multi-day mobile (camp-to-camp) or half-day nature walks from a lodge base; minimum age/participation requirements apply; armed ranger mandatory.

## Cross-link Targets (all live HTTP 200, 18 Nov 2026)
- Country: `/countries/zambia/`
- Attraction: `/attractions/south-luangwa/`
- Accommodation: `/accommodations/mfuwe-lodge/`
- Activities archive: `/activities/`

## Photo Backlog (six-subject, exact/licensed)
1. Walking safari group on foot with armed ranger, Luangwa riverbank
2. Mobile walking safari camp setup (tents, dining fly)
3. Qualified walking guide interpreting tracks/spoor
4. Elephant encounter on foot (safe distance, telephoto)
5. Thornicroft's giraffe or leopard seen during walk
6. Bushcamp Company camp / Mfuwe Lodge walking safari departure point

All subjects require licensed exact-property/original photography; none available in current repository. Zero-image honest publish.

## Proposed Activity Slug
`south-luangwa-walking-safari`

## Proposed Title
`South Luangwa walking safari`

## Next Steps
1. Write activity guide into `content/editorial-overrides.json` (activities array).
2. Create research ledger (this file).
3. Update `docs/editorial-progress.json` with deliverable checkpoint.
4. Run `node scripts/check-build-inputs.mjs` and full build.
5. Commit, push, verify live.
6. Append run-log entry and refresh memory.