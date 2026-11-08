# Kibale chimpanzee trek activity guide — 8 November 2026

## Selection and scope

Rolling whole-site inventory (live crawl, refresh from production) shows every major Ugandan/Rwandan park has a matching activity page except Kibale: the [Kibale National Park attraction guide](https://trekafricaguide.com/attractions/kibale-national-park) names the ranger-led chimpanzee trek as the park's principal experience, the [Uganda country page](https://trekafricaguide.com/countries/uganda) lists Kibale among its attractions, and the published [Kibale chimpanzee-trek planning insight](https://trekafricaguide.com/travel-insights/plan-kibale-around-chimpanzee-trek/) tells readers how to plan a journey around that trek — but no activity page to land on. This answers the natural next reader question under the site's own precedent (Bwindi → gorilla trek, Volcanoes → gorilla + golden monkey, Okavango → mokoro, Murchison → launch trip). One deliverable: a new Activity record `kibale-chimpanzee-trekking` under the repo-managed Kibale attraction (`attraction_id: "repo:attractions:kibale-national-park"`, the same pattern as the Great Zimbabwe monument visit). No changes to existing attraction/country/insight/stay records, no booking-destinations change (Kibale pages carry no bookable chimp product until an exact current OTA listing is verified).

## Current official evidence (all checked 8 November 2026)

- Uganda Wildlife Authority, [Kibale National Park](https://ugandawildlife.org/national-parks/kibale-national-park/). Kanyanchu Primate Walk is the park's flagship experience; the community has been monitored and habituated since 1993; sighting success stated at **over 90 percent**; guided walks currently scheduled **08:00, 11:00 and 14:00 from the Kanyanchu Visitor Centre**, typical duration **2–5 hours**, **one hour** with the chimpanzees, groups **limited to six**, advance booking mandatory, early registration and briefing advised, and the page states **all visitors must be at least 16**.
- Uganda Wildlife Authority, [Conservation Tariff card (July 2024–June 2026)](https://ugandawildlife.org/wp-content/uploads/2024/03/UWA-Conservation-Tariff-July-2024-June-2026.pdf). Chimpanzee-tracking rules (one hour at ten metres, no flash, no eating/drinking/smoking, no mimicking calls, human waste buried 30 cm, no littering, no forest access when ill); its tracking-rule table lists **minimum age 12** — the second official divergence now in evidence. It also states foreign non-resident and rest-of-Africa **permits are bookable only through licensed tour operators**, which UWA reiterated in the February 2026 circular relayed by industry summaries. Rate values are not reprinted, matching the park guide's stated policy; the card's validity window has expired without a published successor, so the site's standing rule holds.
- Uganda Wildlife Authority, [Chimpanzee Tracking](https://ugandawildlife.org/activities/chimpanzee-tracking/). Still sparse; treat the park page and the booking confirmation as primary.
- UWA tariff circular of 26 February 2026 (ref. TDO 93/04), via [secondary industry summary](https://safariroamer.com/en/post/chimpanzee-trekking-uganda-rwanda-tanzania): payment-in-full booking (reservation window suspended 1 March 2026), discounted low-season rates for April/May/November **that cannot be rescheduled**, and a revised 2027 tariff announced. Recorded as a secondary source with an explicit confirm-with-UWA caveat.

## Editorial approach

Follows the golden monkey activity guide's section format (overview → How the trek usually runs → Permits and booking → Who it suits → Staying near the trailhead → Track with care → Highlights → Best time → Planning notes) while keeping Kibale-specific discipline: prices, low-season conditions and the age question are explained without reprinting contested figures, divergences are named explicitly (12 vs 16; bundled vs split fees), and the schedule is attributed to UWA's current park page with a "confirmation is what counts" hedge. Internal links: Kibale attraction guide (auto-linked), Bwindi gorilla trekking activity, Fort Portal destination, Kibale Forest Camp stay, and the planning insight. No traveler_feedback field: no real attributable review with platform/date context was verified for this specific product during this run; omit rather than borrow the attraction page's feedback.

## Build and rendered checks (local, production data)

- `check-build-inputs` passed (JSON syntax, photo-library mirrors).
- Full production build with the connected public Supabase data: **128 pages built, 0 activities missing attraction joins**, readability guard passed on 133 generated pages — no exposed markup.
- Rendered inspection of `dist/activities/kibale-chimpanzee-trekking/`: correct title/meta, all sections present, related-activities carousel includes Murchison launch trip and Bwindi, Nearby stays shows Kibale Forest Camp, booking rail shows the honest "not yet available" state, archive lists the new guide, and the parent attraction page auto-renders it in Related activities.

## Images

Zero-image publication with an honest empty gallery, as sanctioned by the workflow ("ready factual text can publish with a neutral no-photo state"). Separate six-subject backlog for the image automation, not reusing any photo already assigned to the Kibale attraction, the Kibale insight or Kibale Forest Camp: Kanyanchu Visitor Centre signage, forest interior with light shafts, chimpanzees at safe distance, ranger briefing, forest trail, trekkers following their guide. Required credits recorded when sourced.

## Publication record

- Commit: this commit ("Publish Kibale National Park chimpanzee trek activity guide"), pushed to `main`; Netlify production build follows.
- CMS mirror reconciliation: cannot read `public.editorial_documents` with the publishable key (RLS grants SELECT to authenticated CMS staff only, verified 8 November 2026). The production build runs with `EDITORIAL_CMS_SYNC=true`, so the deploy itself imports the document; owner-side CMS check or a service-role read should confirm the new row `activities/kibale-chimpanzee-trekking` after deploy.
- Owner report: sent in chat (no Gmail wiring in this environment), to be pasted into the owner's configured report channel.

## Unresolved wider blocker carried from the previous run

Nyungwe National Park attraction guide remains blocked in production (404) pending service-role CMS access; the publishable key cannot read `editorial_documents` (401/42501). Still needs owner/CMS-staff action; not touched in this run.
