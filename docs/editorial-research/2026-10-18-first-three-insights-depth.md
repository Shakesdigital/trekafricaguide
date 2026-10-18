# First three published Travel Insights: depth and storytelling update

Completed 18 October 2026 as one manual batch. This work deepens the first three existing published insights in catalogue sequence. The next insight, Kibale, was outside this task. Existing design, publication status, internal page relationships, booking configuration and media records were preserved.

## Table Mountain: cableway, weather and hiking

Updated `table-mountain-weather-cableway-or-hike` with a clearer distinction between a cableway visit and a strenuous hike, realistic ascent/descent contingency, flexible mountain-day planning, current operating/access guidance, tailored packing and practical FAQs. Existing hero and five inline licensed images remain; total six photos. Existing dated traveler review references and canonical links remain. The article does not treat old photographs as current trail or weather reports.

Sources rechecked 18 October 2026:

- Cableway ticket validity and weather operations: https://www.tablemountain.net/plan-your-visit/ticket-prices
- Cableway arrival and shuttle information: https://www.tablemountain.net/plan-your-visit/getting-here
- Cableway mobility access: https://www.tablemountain.net/plan-your-visit/wheelchair-access-and-mobility-scooters
- SANParks hiking routes, effort and descent guidance: https://www.sanparks.org/parks/table-mountain/what-to-do/activities/hikes-walks-trails
- SANParks current safe-hiking advice: https://www.sanparks.org/parks/table-mountain/useful-information/safe-hiking
- South African visa guidance (passport-specific exemptions): https://www.gov.za/services/temporary-residence/visa
- Department of Health 2026 yellow-fever entry protocol: https://www.health.gov.za/wp-content/uploads/2026/09/Protocols-for-Travellers.pdf

Photo follow-up: none; six existing credited photographs retained.

## Bwindi: choose the sector before the stay

Rebuilt `choose-bwindi-sector-before-booking-stay` around sector/date confirmation, exact reporting point, property-to-trailhead transport, comparing package inclusions and realistic arrival/trek/departure pacing. Added a reasoned packing section, FAQs on children, permits and cross-sector stays, and conditional Uganda entry guidance. It explains that entry permission and a gorilla permit are separate decisions. No invented transfer duration, price, availability, ranking or wildlife guarantee.

Sources checked 18 October 2026:

- UWA gorilla tracking and four sectors: https://ugandawildlife.org/activities/gorilla-tracking/
- UWA Bwindi access overview: https://ugandawildlife.org/national-parks/bwindi-impenetrable-national-park/
- UWA 2024 tracking guidelines, including minimum gorilla-tracking age 15 and documentation categories: https://ugandawildlife.org/wp-content/uploads/2024/07/Guidelines-for-the-management-of-gorilla-and-chimpanzee-tracking-JULY-2024.pdf
- Uganda DCIC warning identifying the official visa application portal: https://www.immigration.go.ug/index.php/node/230
- Official Uganda visa application portal, as named by DCIC: https://visas.immigration.go.ug/

Photo follow-up remains 0/6. Subjects remain northern and southern approaches, Buhoma streetscape, forest terrain, identified public trailhead and local travel context. No photo sourcing was performed, no existing guide image was reused.

## Cape Town: choose a base by outings

Rebuilt `choose-cape-town-base-by-outings` around three trip rhythms (central-city, promenade-plus-city, and coast-led), exact-property route checks, an itinerary sketch, explicit trade-offs, city/coast packing and practical FAQs. Added passport-dependent entry guidance and transit-dependent yellow-fever guidance from official sources. Existing local destination, attraction, activity, stay and related-insight links remain intact. No fares, journey times, safety claims or availability invented.

Sources checked 18 October 2026:

- Cape Town Tourism area guide: https://www.capetown.travel/the-best-areas-to-stay-in-cape-town/
- Central City: https://www.capetown.travel/areas/central-city/
- Atlantic Seaboard: https://www.capetown.travel/areas/atlantic-seaboard/
- Sea Point: https://www.capetown.travel/sea-point/
- Camps Bay: https://www.capetown.travel/neighbourhood/camps-bay/
- Cape Town transport overview: https://www.capetown.travel/getting-around-cape-town-heres-your-complete-transport-guide/
- MyCiTi current route and stop map: https://www.myciti.org.za/en/routes-stops/route-stop-station-map/
- South African Government visa guidance: https://www.gov.za/services/temporary-residence/visa
- Department of Health 2026 yellow-fever entry protocol: https://www.health.gov.za/wp-content/uploads/2026/09/Protocols-for-Travellers.pdf

Photo follow-up remains 0/6. No photos were added or sourced; the separate image workflow retains this gap.

## Field and publication notes

Only supported `travel_articles` fields were edited: `body`, `excerpt`, `read_time`, `last_researched` and `research_sources`. Table Mountain retains `hero_image_url` and all image markup. The two other insights retain their existing neutral hero state. No categories, statuses, links outside these bodies, Stay22 data, analytics, deployment settings or other deliverables were changed.

The narrative checkpoint was committed as `cdc8b37` and pushed. All three public URLs returned HTTP 200, but the first post-push checks still served pre-commit text; publication of that narrative update remains unconfirmed.

## Stay roundups — added after the narrative checkpoint

Added concise, exact-property shortlists to the same three articles. The two Cape Town articles share five options with different trip-fit framing: Cape Town Hollow and SunSquare City Bowl for value-conscious central plans; President Hotel in Bantry Bay/Sea Point and The Bay Hotel in Camps Bay for coastal plans; Mount Nelson in Gardens as a luxury central option. Cape Town Hollow and SunSquare are explicitly positioned by their operators as affordable/value-led; no current comparable nightly rates were available for assigning a defensible mid-range cutoff. No dated rates or availability are stated.

The Bwindi article has four exact OTA property pages, one in each trekking sector: Ruhondeza Lodge (Buhoma), Ruhija Gorilla Guest House (Ruhija), Rushaga Gorilla Lodge (Rushaga), and Nkuringo Bwindi Gorilla Lodge (Nkuringo). Ruhondeza is a budget-conscious option; Rushaga Gorilla Lodge is positioned by its operator at the mid-range end; Expedia describes Nkuringo as upscale. The Ruhija listing is presented by property type only. Each description directs readers to confirm the sector briefing point and actual trek-day transfer. The existing Buhoma Community Rest Camp is not presented as bookable because its canonical OTA destination is marked unavailable.

Every public CTA uses a supported Booking.com or Expedia property-detail URL. The existing rich-text sanitizer converts recognized exact-property OTA URLs to Stay22 `/allez/` links with the configured Trek Africa Guide affiliate ID; raw OTA links are retained in research metadata. No canonical stay records, booking configuration or affiliate settings were changed. No nightly prices, ratings, availability or transfer durations were invented.

Additional property sources checked 18 October 2026:

- Cape Town Hollow official site: https://www.capetownhollow.com/; exact Booking.com listing: https://www.booking.com/hotel/za/cape-town-hollow-boutique.en-gb.html
- SunSquare Cape Town City Bowl official positioning and address: https://www.southernsun.com/sunsquare-cape-town-city-bowl; exact Booking.com listing: https://www.booking.com/hotel/za/sunsquare-cape-town-city-bowl.en-gb.html
- President Hotel official address: https://www.thepresidenthotel.co.za/contact-us; exact Booking.com listing: https://www.booking.com/hotel/za/president-cape-town.en-gb.html
- The Bay Hotel official Camps Bay location: https://thebayhotel.com/location/; exact Booking.com listing: https://www.booking.com/hotel/za/the-bay.en-gb.html
- Mount Nelson official Gardens address: https://www.belmond.com/en/hotels/africa/south-africa/mount-nelson-cape-town/location; exact Booking.com listing: https://www.booking.com/hotel/za/belmond-mount-nelson.en-gb.html
- Ruhondeza Lodge official page: https://ruhondezalodgeug.com/about-us/; exact Booking.com listing: https://www.booking.com/hotel/ug/ruhondeza.en-gb.html
- Ruhija Gorilla Guest House exact Booking.com property/location detail: https://www.booking.com/hotel/ug/ruhija-gorilla-guest-house.en-gb.html
- Rushaga Gorilla Lodge official operator page: https://mbzgroup.africa/rushagagorillalodge; exact Booking.com listing: https://www.booking.com/hotel/ug/rushaga-gorilla-camp.en-gb.html
- Nkuringo Gorilla Lodge official southern Bwindi location: https://nkuringoecocollection.com/nkuringo-gorilla-lodge/getting-there/; exact Expedia listing: https://www.expedia.com/Nkuringo-Hotels-Nkuringo-Bwindi-Gorilla-Lodge.h10074835.Hotel-Information

The roundup follow-up is a separate commit. Independently verify the new shortlist and Stay22 links on all three live pages; the earlier three checks returned HTTP 200 but served pre-`cdc8b37` text.
