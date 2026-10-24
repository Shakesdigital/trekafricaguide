# Activity review batch — seven guides

Checked 24 October 2026. Patch records are in `2026-10-24-activity-worker-patches.json`. Stable activity slugs and existing attraction relationships are retained by matching slug; no gallery fields or booking registry records are changed. The local override already carries the six generated Mokoro images and the Victoria Falls rafting gallery, so the patches leave galleries untouched.

## Editorial claim ledger

| Activity | Key source support and limits |
|---|---|
| Maasai Mara balloon | [Balloon Safaris Kenya FAQ](https://www.balloonsafariskenya.com/faqs/) gives sunrise timing, early camp pickup, weather caveats and passenger considerations. [MasaiMara.ke pickup PDF](https://masaimara.ke/wp-content/uploads/2025/02/Pick-up-Locations-and-Timings-for-Masai-Mara-Balloon-Safaris.pdf) demonstrates pickup areas differ by camp; the selected Perfect Wilderness Tours and Safari product's own pickup must be confirmed. |
| Amboseli drive | [Kenya Wildlife Service](https://kws.go.ke/park/amboseli-national-park/) supports habitat, access, fees and park rules. The selected Niroskos Tours And Safaris [GetYourGuide day tour](https://www.getyourguide.com/nairobi-l267/nairobi-day-tour-to-amboseli-national-park-maasai-village-t543578/) departs Nairobi; confirm transport, entry, optional cultural visit and meal details. |
| Serengeti balloon | [Serengeti Balloon Safaris FAQ](https://www.balloonsafaris.com/faqs) supports the approximate five-hour outing, pickup/return, park-fee exclusion and minimum age. [Flight reports](https://www.balloonsafaris.com/todays-flights/) show several regions but cannot predict a future route or sighting. [Low-impact operations](https://www.balloonsafaris.com/news/leaving-nothing-behind) supports respectful launch-site guidance. |
| Okavango mokoro | The selected [Kalahari Breeze Safaris GetYourGuide excursion](https://www.getyourguide.com/maun-l116302/okavango-delta-full-day-mokorocanoe-tour-all-inclusive-t604726/) is a full-day Maun departure combining mokoro and walking, with pickup, lunch and route details on the current page. [African Jacana](https://africanjacana.co.bw/okavango-delta-full-day-mokoro-experience/) and [Thamalakane River Lodge](https://trlmaun.com/wordpress/index.php/tour-item/mokoro-hourly-day-trip/) were consulted only as comparative local operators. No unsupported water-season month is asserted. |
| Cape Coast and Kakum | [GHCT / Kakum Park](https://www.kakumpark.com/explore-kakum-park/) supports visitor facilities and canopy walkway; [Central Regional Coordinating Council](https://crcc.gov.gh/kakum-national-park/) supports rainforest walk context. Confirm current admissions, access and times for the selected [GetYourGuide tour](https://www.getyourguide.com/accra-l506/from-accra-the-cape-coast-day-tour-guided-experience-t834942/). |
| Victoria Falls both-sides walk | Border and visa checks link to [Zambia Immigration KAZA Univisa](https://www.zambiaimmigration.gov.zm/kaza-univisa/) and [Zimbabwe Immigration visa information](https://www.zimimmigration.gov.zw/?page_id=6900), both rechecked 24 October 2026. [Zambia Tourism park-fee guidance](https://www.zambiatourism.com/park-entry-fees/) is dated 2025 and subject to change; the page gives no fee amount. |
| Victoria Falls rafting | [Wild Horizons rafting details](https://wildhorizons.co.za/experiences/white-water-rafting-victoria-falls/), [season guide](https://wildhorizons.co.za/best-time-to-visit-victoria-falls/) and [booking terms](https://wildhorizons.activitar.com/services/4200/terms_and_conditions) were rechecked 24 October 2026. Published duration, age, inclusions and insurance terms should be reconfirmed for the actual departure. [Victoria Falls Hotel address](https://www.victoriafallshotel.com/contact) supports the linked town base only, not a confirmed pickup. |

## Fresh booking-page and traveler-review check

Direct GetYourGuide product pages were reopened on 24 October 2026. Scores and totals below are a dated snapshot and can change. The linked individual feedback is summarized in each affected activity description.

| Tour | Live score on 24 Oct 2026 | Attributable traveler evidence |
|---|---:|---|
| Maasai Mara balloon | 4.8/5, 37 reviews | Jacqui (United Kingdom, 7 Jul 2024) said few wildlife sightings did not spoil the sunrise flight. |
| Amboseli Nairobi day tour | 4.5/5, 452 reviews | Dylan (United Kingdom, 12 Oct 2026) praised the guide and sightings but described the day as long and the lunch options as disappointing. |
| Serengeti dawn balloon | 4.2/5, 14 reviews | Liem (United States, 15 Apr 2025) praised the smooth flight and breakfast while noting the expense; this is older feedback and the sample remains small. |
| Maun mokoro day trip | 4.7/5, 119 reviews | Motolani (France, 30 Sep 2026) praised smooth pickup and the peaceful ride, and noted that wildlife was incidental. |
| Accra–Cape Coast–Kakum tour | Not retrievable | The product URL returned a page shell without score or review content. The limitation is recorded here; public copy gives useful advice on comparing trip-specific feedback. |
| Victoria Falls both-sides walk | 4.7/5, 516 reviews | Samantha (South Africa, 30 Sep 2026) said fatigue prevented completing the Zambia section although the guide accommodated her pace. |
| Wild Horizons rafting | Not verified | No exact current OTA review page or score established; public copy recommends checking trip-specific feedback without claiming an established review set. |

The first-hand statements above are short paraphrases of individual verified GetYourGuide reviews, not independent quality assessments. The review dates are included because recency varies. Scores are source-page snapshots, not durable claims.

## Booking and relationship review

- Six activities have exact GetYourGuide product detail URLs in the shared booking destinations: Maasai Mara balloon, Amboseli day tour, Serengeti balloon, Maun mokoro, Cape Coast/Elmina/Kakum, and the Victoria Falls both-sides walk. No registry values were modified. Current public-page ratings/counts should be refreshed at each publishing date.
- **Mismatch / missing exact destination:** `victoria-falls-zambezi-white-water-rafting` has no exact OTA destination in `content/booking-destinations.json`. Wild Horizons’ official product page confirms activity details but does not establish an affiliate booking destination. Keep its booking CTA unavailable until an exact suitable product is verified.
- Patches add no CTA. Attraction links point to existing known slugs; the rafting prose retains the existing Victoria Falls Hotel guide mention and explicitly avoids implying confirmed pickup there.
- No new accommodation relationship was proposed because pickup/geographic relevance for the other tours was not independently established.

## Photo notes

- Mokoro collection: six generated representative images are documented in `2026-10-12-mokoro-generation-prompts.md`; they represent general travel scenes, not documentary proof of a particular operator or exact Delta location. Existing gallery paths remain untouched.
- Victoria Falls rafting collection already has six locally referenced gallery images. Its rights/credit manifest was not audited in this content-only task.
- Provenance for the other five activity galleries was not audited here; this patch does not mark those image collections cleared.
