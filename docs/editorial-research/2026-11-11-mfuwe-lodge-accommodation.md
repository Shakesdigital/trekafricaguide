# Mfuwe Lodge accommodation refresh — 11 November 2026

## Selection

Rotation category: accommodations (recorded in docs/editorial-progress.json after the 2026-11-11 activities run).
Live page: https://trekafricaguide.com/accommodations/mfuwe-lodge/ — confirmed live (HTTP 200) before work began.
Evidence: the live page carried the honest rail "A verified booking link for this specific listing is not yet available", and content/booking-destinations.json held only a bare `unavailable` marker with no check date or evidence. The record's research dates were 2026-10-11 and its copy was the generic seed pattern (~965 characters) rather than the depth of recent accommodation refreshes (Ridge Royal, Fairway, Mountains of the Moon). Reader impact: this is the gateway lodge for South Luangwa — where the site's recently published South Luangwa walking safari and attraction content point readers to stay — yet its guide was the thinnest layer of that group.

Chosen deliverable: full researched refresh of the stay guide with fresh claim-level official sources and the honest no-CTA state verified and documented (not re-chased).

## Claim-level sources (all checked 2026-11-11)

- The Bushcamp Company — Mfuwe Lodge product page: 18 chalets (2 suites, 3 family rooms, 13 rooms) + family house; pool, Bush-Spa, curio shop, library, photographic studio, outdoor gym; 45-minute airport transfer; all ages; open all year; 220 V mains + generator, solar hot water, Wi-Fi main area, laundry, air con + fans, mosquito nets; en-suite bathrooms (suites with bathtub); experiences list (elephants in reception, game drives, walking safaris, sundowners); mango season late October–mid-December. https://bushcampcompany.com/products/mfuwe-lodge
- The Bushcamp Company — Travel information: Mfuwe International Airport (MFU) as the only commercial airport serving South Luangwa; daily Proflight Zambia Lusaka–Mfuwe; seasonal Lilongwe connections; 23 kg soft-bag limit; 45-minute open-vehicle transfer; transfer times from the lodge to bushcamps; three-season framing (green Dec–Apr, shoulder May–mid-June + November, peak mid-June–Oct); children 12+ for walking safaris, younger children welcomed at Mfuwe Lodge with vehicle-based viewing; walking safaris 2–3 hours; malaria guidance; payments (Visa/Mastercard, USD/ZMW, clean post-2006 notes); no guest drones (ZCAA); community visits (Tribal Textiles, Kawaza Village, Chipembele, The Farm). https://bushcampcompany.com/pages/travel-information
- The Bushcamp Company blog — Mfuwe Lodge location: inside the park boundary, a few minutes beyond the main gate, between the Mfuwe Lagoon and a wafwa (dried oxbow) with a busy waterhole. https://bushcampcompany.com/blogs/experience/mfuwe-lodge-why-one-of-the-worlds-top-rated-hotels-is-a-safari-lodge-in-zambia
- Condé Nast Traveler — Mfuwe Lodge listing: "Book Now at Bush Camp Company — Powered By: Bush Camp Company" (direct-sales evidence). https://www.cntraveler.com/hotels/zambia/luangwa-valley/mfuwe-lodge
- Booking.com — Mfuwe city/family results: list only other lodges (Royal South Luangwa, Thornicroft, Mopani, Msandile); no exact Mfuwe Lodge listing found. https://www.booking.com/city/zm/mfuwe.html
- Expedia — Mfuwe hotels/lodges guides: Mfuwe Lodge absent from both top-choice lists. https://www.expedia.com/Mfuwe-Hotels.d2276.Travel-Guide-Hotels

## Booking decision

The property sells direct through The Bushcamp Company. No exact OTA property detail page exists at check, so the booking CTA stays suppressed and the honest "verified booking link not yet available" rail remains. Recorded as a dated `status: "unavailable"` entry with evidence in content/booking-destinations.json (replacing the earlier undated bare marker) so future runs do not re-chase it or substitute a namesake/neighbour lodge.

## Editorial approach

- Rewrite listing_summary, detail_intro and practical_info from the operator's own current pages, attributing operator claims ("the operator lists/describes/recommends") and distinguishing them from editorial inference.
- Keep the no-rate discipline: the operator publishes a rate band on its site, but no rates or availability are copied into the guide; price_label "Luxury" retained.
- No traveler reviews used (none verified); the operator's award claims were deliberately not restated as independent recognition.
- Health/safety text (malaria, insurance, drones) attributed to the operator's travel page and kept general; it is not a substitute for professional advice.
- Existing canonical relationships preserved: region 16, country 56 (Zambia), attraction 67 (South Luangwa). No accommodation/attraction relationship changes; nearby-stay cards and attraction links unchanged.
- Images unchanged (existing licensed gallery: 4 paths live on the page; hero + gallery retained). Photo backlog subjects for a future six-image pass (exact-property, licensed only): main-area lagoon deck, chalet exterior, chalet interior, pool/spa area, elephants-in-reception (properly licensed only), road-transfer/game-drive vehicle.
- Zero fabricated content: no invented reviews, rates, distances beyond operator-stated figures, or sensory claims.

## Checks

- JSON valid after edit (parse + per-table duplicate-slug check passed).
- node scripts/check-build-inputs.mjs — pass (see publication record below).
- Full production build with documented env — pass; generated page inspected (see publication record below).
- Live verification after Netlify deploy recorded in docs/editorial-progress.json (accommodation_mfuwe_lodge).

## Publication record

- Content commit: 9e38952 (the Mfuwe Lodge content edits travelled in this pushed commit — a concurrent agent committed the shared content files at 07:49 while my edits were in the working tree, and the commit went live; single-record state verified before this run's own push)
- Ledger commit: a65c947
- Live URL: https://trekafricaguide.com/accommodations/mfuwe-lodge/
- Live HTTP status: 200 (checked 2026-11-11, page length matches the locally built page byte-for-byte at 32,117)
- Live checks: new distinctive copy present (inside-the-park framing, 18-chalet breakdown, MFU/Proflight access and 23 kg note, three-season framing, no-OTA hedge, wafwa/wild-mango detail); honest booking rail retained ("not yet available", no Stay22 CTA on the page); nearby-attraction card (South Luangwa) present; no exposed markup; hero + 3-image editorial gallery intact and first JPEG asset HTTP 200 image/jpeg; accommodations archive and Zambia country page both carry the record.
- Receipt commit: (this file's next commit)
- CMS: production build ran EDITORIAL_CMS_SYNC=true, so the deploy imported the document at source_commit; publishable-key reads of editorial_documents are RLS-blocked (401, verified pattern) — owner-side CMS check pending: the updated document should appear under accommodations/mfuwe-lodge.
