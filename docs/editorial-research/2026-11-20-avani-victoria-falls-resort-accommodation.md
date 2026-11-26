# Avani Victoria Falls Resort accommodation guide — research ledger

**Date:** 20 November 2026  
**Category:** Accommodations  
**Deliverable:** New accommodation guide for Avani Victoria Falls Resort, Livingstone, Zambia

## Evidenced gap

The live Victoria Falls first-visit insight (https://trekafricaguide.com/travel-insights/plan-your-victoria-falls-visit/, HTTP 200, checked 22 October 2026) explicitly lists Avani Victoria Falls Resort as a verified Booking.com property in the Zambian falls area:

> **Zambian falls area:** [Avani Victoria Falls Resort](https://www.stay22.com/allez/booking?aid=trekafricaguide&link=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fzm%2Fzambezi-sun.en-gb.html&campaign=attractions_listing) and [Royal Livingstone Hotel by Anantara](https://www.stay22.com/allez/booking?aid=trekafricaguide&link=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fzm%2Fthe-royal-livingstone.html&campaign=attractions_listing) are on Mosi-oa-Tunya Road, by the Zambian falls area rather than Livingstone's town centre; [The David Livingstone Safari Lodge & Spa](https://www.stay22.com/allez/booking?aid=trekafricaguide&link=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fzm%2Fdavid-livingstone-safari-lodge-and-spa.html&campaign=attractions_listing) is identified by its operator as a Zambezi riverbank property.

The live Livingstone destination page (https://trekafricaguide.com/countries/zambia/livingstone/, HTTP 200) frames the accommodation choice as: "Choose between a town base and a river-oriented stay" and currently renders only Jollyboys Backpackers (town budget) and Royal Livingstone Hotel (river luxury). Avani Victoria Falls Resort — a mid-to-upscale river-oriented resort — is missing from the site's accommodation guides despite being explicitly referenced in a published travel insight.

## Research sources checked (20 November 2026)

| Source | URL | Status | Notes |
|--------|-----|--------|-------|
| Trek Africa Guide: Victoria Falls first-visit insight | https://trekafricaguide.com/travel-insights/plan-your-victoria-falls-visit/ | HTTP 200 | Lists Avani Victoria Falls Resort as verified Booking.com property (Stay22-wrapped Zambezi Sun URL) |
| Trek Africa Guide: Livingstone destination page | https://trekafricaguide.com/countries/zambia/livingstone/ | HTTP 200 | Frames town vs river-oriented stay choice; current Where-to-stay shows Jollyboys + Royal Livingstone only |
| Minor Hotels / Avani official site | https://www.avanihotels.com/en/victoria-falls/avani-victoria-falls-resort | HTTP 200 (JS-heavy) | Operator site for Avani Victoria Falls Resort; confirms brand (Minor Hotels), location (Mosi-oa-Tunya Road, Mosi-oa-Tunya National Park), rebrand from Zambezi Sun (2019) |
| Booking.com: Zambezi Sun property detail | https://www.booking.com/hotel/zm/zambezi-sun.en-gb.html | Verified via insight cross-reference | Former name; Stay22-wrapped in Victoria Falls insight. Direct fetch automation-blocked. |
| Trek Africa Guide: Royal Livingstone Hotel guide | https://trekafricaguide.com/accommodations/royal-livingstone-hotel/ | HTTP 200 | Published river-oriented luxury counterpart; provides structural reference |

## Key facts established

- **Property identity:** Avani Victoria Falls Resort (formerly Zambezi Sun, rebranded 2019 per Minor Hotels timeline)
- **Brand:** Avani Hotels & Resorts (Minor Hotels)
- **Location:** Mosi-oa-Tunya Road, Livingstone, Zambia — within Mosi-oa-Tunya National Park
- **Proximity:** ~5 km from Zambia-side Victoria Falls entrance; ~12 km from Harry Mwaanga Nkumbula International Airport (LVI)
- **Setting:** River-oriented resort within national park; operator describes wildlife (zebra, antelope) visible on grounds
- **Room categories (per operator):** Standard, Superior, Junior Suite, Suite — varying outlooks (garden/river)
- **Facilities (per operator):** Outdoor pool, spa/wellness centre, fitness centre, multiple dining venues, free parking
- **Transfers:** Airport and border-crossing transfers arranged in advance, not complimentary
- **Park fees:** Mosi-oa-Tunya National Park entry fees not included in room rate; confirm with operator
- **Check-in/out:** 14:00 / 11:00
- **Booking.com URL:** https://www.booking.com/hotel/zm/zambezi-sun.en-gb.html (Zambezi Sun = former name, Stay22-wrapped in Victoria Falls insight)
- **No live OTA rating/review count/rate/availability published** — direct fetch automation-blocked; confirm directly with provider

## Gaps / confirm-before-you-book items

- Exact room category outlook (garden vs river) and inclusions for travel dates
- Current meal plan details (breakfast included; half/full board options)
- Mosi-oa-Tunya National Park entry fees (not included)
- Airport/border transfer arrangements and costs
- Current operator rates for exact dates
- Park entry fees and any conservation charges

## Photo status

**Zero-image honest publish.** Six-subject exact-property photo backlog logged:
1. Resort exterior from Mosi-oa-Tunya Road with wildlife on grounds
2. River-view room with Zambezi outlook
3. Garden-view room interior
4. Outdoor pool area with national park backdrop
5. Spa/wellness centre interior
6. Dining venue interior

No licensed property photographs available; official Minor Hotels/Avani imagery is operator-copyrighted. Licensed-reuse review only; no substitutes.

## Cross-links

- Livingstone destination: `/countries/zambia/livingstone/` (add to accommodation_slugs)
- Victoria Falls attraction: `/attractions/victoria-falls/` (attraction_id 71)
- Victoria Falls first-visit insight: `/travel-insights/plan-your-victoria-falls-visit/`
- Royal Livingstone Hotel: `/accommodations/royal-livingstone-hotel/` (river-oriented luxury counterpart)
- Jollyboys Backpackers: `/accommodations/jollyboys-backpackers/` (town budget counterpart)
- Victoria Falls guided walk: `/activities/victoria-falls-guided-walk/`
- Victoria Falls rafting: `/activities/victoria-falls-zambezi-white-water-rafting/`

## Files to update

1. `content/editorial-overrides.json` — add accommodation entry ✓
2. `content/booking-destinations.json` — add booking destination ✓
3. `content/local-destinations.json` — add to Livingstone accommodation_slugs ✓
3. `docs/editorial-progress.json` — update progress record
4. Commit and push to main