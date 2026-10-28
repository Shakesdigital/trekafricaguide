# Ridge Royal Hotel accommodation refresh — 28 October 2026

## Scope and canonical record

Refreshed the existing public accommodation page rather than creating a duplicate. Supabase identifies Ridge Royal Hotel as accommodation ID 65, published, with country ID 45 (Ghana), region ID 15 and `attraction_id` 52 (`cape-coast-kakum`). The existing relationship is preserved. The record is in Cape Coast; it must not be described as on the grounds of Elmina Castle or Kakum National Park. Existing page and canonical Cape Coast Kakum attraction relationship are both retained.

## Guide changes

Expanded the guide around a full-service Cape Coast base, differentiated main-building rooms from chalets without implying every room has the same layout, and gave practical questions for bedding, bathroom, accessibility, meal inclusions and events. The guide describes the hotel as a separate base for Castle and Kakum outings, not as a property at any of those sites. It keeps qualitative mid-range positioning and makes no rate, availability or numerical star-rating claim.

The operator's current pages list air conditioning, Smart TV, Wi-Fi and breakfast for rooms; standard room and standard chalet layouts differ; official amenities include a pool, gym, lounge/bar, parking, laundry and event facilities; the dining page describes breakfast buffet and Ghanaian/international meal options. The operator states one specially adapted room but does not publish dimensions or features; the guide tells travelers to confirm individual access requirements. Pool and gym access is also offered to outside guests. No assumption is made that a shuttle or transfer is included.

Tripadvisor feedback is summarized as individual dated experiences: a family stay in July 2026 praised cleanliness, staff and city-area trip convenience; an August 2026 reviewer liked the spacious room and Ghanaian decor; a March 2025 reviewer reported slow lunch/dinner service and said a prior beach shuttle was no longer running. No quote, score, rating aggregate or generic quality guarantee is used. The public guide links directly to the review page.

## Exact booking destination

On 28 October 2026, the search result for the English Booking.com detail `https://www.booking.com/hotel/gh/ridge-royal-cape-coast.en-gb.html` named “Ridge Royal Hotel Cape Coast” at Number 1, 2nd Ridge, Cape Coast, Ghana. Opening the detail directly presented a bot-verification page, so no rates, availability or current Booking.com review data were copied. This exact listing replaces the prior German-locale URL in `content/booking-destinations.json`; the site's existing Stay22 builder wraps the canonical Booking.com property URL. No generic booking search URL is used.

## Sources checked 28 October 2026

- Ridge Royal Hotel official home/property page: https://www.ridgeroyalhotel.com.gh/
- Official room categories/inclusions: https://ridgeroyalhotel.com.gh/rooms-suites/
- Official amenities and facilities: https://ridgeroyalhotel.com.gh/hotel-amenities/
- Official dining information: https://ridgeroyalhotel.com.gh/dinning/index.php
- Exact Booking.com property page/search result (direct detail prompted bot verification): https://www.booking.com/hotel/gh/ridge-royal-cape-coast.en-gb.html
- Tripadvisor dated traveler feedback: https://www.tripadvisor.com/Hotel_Review-g303866-d12676020-Reviews-Ridge_Royal_Hotel-Cape_Coast_Central_Region.html
- Existing canonical relationship checked in `public.accommodations`/`public.attractions` on 28 October 2026.

## Images and follow-up

No property photographs were added; the page retains its neutral image state because exact-property reuse rights are not established. Keep the separate six-subject photo backlog: exterior/signage; standard main-building room; standard chalet interior; bathroom; restaurant/dining room; pool/gym or landscaped grounds. Each image must show this exact property and have reusable rights, creator/source, license, date and alt text. Do not substitute Cape Coast/Elmina/Kakum scenery or imagined/generated room imagery.

## Publication checkpoint

- Status before this refresh: the existing ID 65 record was already published and the live detail returned HTTP 200.
- Researched guide text, source ledger and exact Booking.com registry target are edited; no photos were added. CMS currently matches the old Git copy with no manual field divergence.
- Next: concise diff review; commit/push main with concurrent history reconciled and unrelated deployment ZIP untouched; verify production page content/CTA, Netlify deployment and CMS `source_commit`; send the authorized owner report and record its receipt.
