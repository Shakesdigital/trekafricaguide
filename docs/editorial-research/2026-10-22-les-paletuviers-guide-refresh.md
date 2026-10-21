# Les Palétuviers accommodation refresh — 22 October 2026

## Scope and decision

Refreshed the existing accommodation guide for Les Palétuviers Boutique Hotel in Toubacouta, Senegal. The canonical property record remains ID 57, Senegal country ID 50, and Sine-Saloum attraction ID 66. The existing exact Booking.com destination is retained and reconfirmed through the site's shared Stay22 resolver. No numerical rates, date-specific availability, ratings, review counts or claims of personal stay are used.

## Claim ledger

| Reader-facing claim | Evidence checked 22 October 2026 | Limit applied |
| --- | --- | --- |
| The hotel is in Toubacouta on the riverbank and is associated with the Sine-Saloum. | [Les Palétuviers official site](https://lespaletuviers.com/en/) | Property-published description and location; no claim about exact distance to every delta launch point. |
| The current room collection includes Zebra Lodge, Delta View Lodge, Garden View Lodge, Family Bungalow, Family Suite, Mangrove Suite, Baobab Treesuite and Garden View Suite. | [Les Palétuviers official site](https://lespaletuviers.com/en/), [room collection links](https://lespaletuviers.com/en/how-to-get-here/) | Categories and names are current on the official site. Travelers are directed to verify the exact configuration and availability of their selected category. |
| The hotel offers air-conditioned road transfers from Dakar and Banjul airports. | [Les Palétuviers official “How to get here” page](https://lespaletuviers.com/en/how-to-get-here/) | Service is property-published; current terms and any border arrangements should be confirmed directly. Prices shown on the official page were not copied. |
| On-site restaurant and wellness facilities; current Booking.com page also identifies an outdoor pool and spa/wellness facilities. | [Les Palétuviers official site](https://lespaletuviers.com/en/), [exact Booking.com hotel detail](https://www.booking.com/hotel/sn/les-pala-c-tuviers.en-gb.html) | No meal inclusions, wellness access, facility condition or availability inferred; confirm with the selected rate and property. |
| One January 2026 traveler praised location, service, food and excursion organization, while mentioning low occupancy; one February 2026 traveler criticized room condition and value while praising location and food. | [Tripadvisor property reviews](https://www.tripadvisor.com/Hotel_Review-g482877-d479654-Reviews-Les_Paletuviers_Boutique_Hotel-Toubakouta_Fatick_Region.html), individual reviews dated January and February 2026 | Summarized as two subjective individual accounts, not a consensus or guarantee. Ratings and counts omitted. |
| Booking CTA resolves to the exact Les Palétuviers Booking.com property page in Toubacouta, Senegal. | Existing `content/booking-destinations.json` accommodation entry, rechecked against [Booking.com](https://www.booking.com/hotel/sn/les-pala-c-tuviers.en-gb.html); current live CTA verified before edit as Stay22 `booking` path with exact encoded `link=` target and `aid=trekafricaguide` | No generic search URL or substituted namesake; no availability or purchase tested. |

## Photo status

Retained the existing neutral gallery with zero property images. The 20 October photo review found a regional mangrove photo but no licensed exact-property image; it was correctly rejected as a property substitute. Official gallery images lack an established reuse license, and the identified exact hotel photo was paid rights-managed imagery. Keep the separate six-subject backlog for the exterior/grounds, reception and common areas, dining, and accurately identified room categories; do not borrow Sine-Saloum attraction imagery.

## Stay22

Before the edit, the public accommodation page returned HTTP 200 and its CTA resolved to `https://www.stay22.com/allez/booking` with `link=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fsn%2Fles-pala-c-tuviers.en-gb.html` and `aid=trekafricaguide`. The shared resolver and affiliate configuration remain unchanged.
