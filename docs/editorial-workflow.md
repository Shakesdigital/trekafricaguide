# Trek Africa Guide editorial workflow

Owner's standing brief, updated 11 October 2026. Manage contributions through the existing chat. The owner authorizes autonomous content selection, factual content edits, Git commits and pushes to the website repository. Preserve the existing visual layout. No routine tests or builds; inspect changed material. Do not claim publication until confirmed.

## Daily collaboration

At 09:00 Africa/Kampala, announce the proposed page/topic and scope BEFORE making changes. Incorporate owner corrections received during work; this notice does not require a daily approval response. Research and develop a manageable complete page or related group, then report published links versus drafts, photographs, evidence, blockers and next priority. Maintain a dated ledger here or in an adjacent editorial ledger. Prioritize quality over a page quota. An automated run is scheduled, not a promise of uninterrupted availability.

## Publishing

Repository: https://github.com/Shakesdigital/trekafricaguide (main).
Website: https://trekafricaguide.com/
The existing Astro build loads Supabase via src/lib/content-repository.mjs. A Git document alone does not publish a guide: use the repository content layer once implemented and inspect its documented schema. Preserve Supabase base records, relationships, publication controls and unrelated settings. Verify actual deployment outcome separately from a successful commit.
The saved D:\\TrekAfricaGuide path was unavailable. Older project notes identify E:\\TrekAfricaGuide; check before choosing another checkout. Connected Supabase access did not include the site's project; GitHub write access is available.

## Page requirements

- Destinations: why visit, local context, principal and lesser-covered attractions, seasonal tradeoffs, access and suggested routes, linked activities/stays, and practical travel insights.
- Attractions: appeal and overview, how to get there, best time, realistic planning routes, sourced traveler perspectives, image-led activity listings and nearby stays.
- Activities: full overview, highlights, best time, routes/planning, related attraction guide, sourced traveler perspectives, and nearby stays. Research duration and suitability instead of inventing them.
- Accommodations: full description, what distinguishes the actual property, verified amenities, location/access and nearby activities, evidence-based budget/mid-range/luxury positioning. Multiple room categories do not imply every price tier. No fabricated rates or availability.
- Travel insights: useful destination/attraction planning articles, seasonal guidance, cultural etiquette, route comparisons and local stories linked to the relevant guides.
- One canonical accommodation can appear on multiple related attraction/activity pages. Verify geographical and practical relevance; do not duplicate the accommodation record.
- Preserve existing page structure. Where dedicated fields do not exist, use supported rich-text sections rather than inventing non-rendered fields.

## Research and voice

Use fresh official tourism, attraction, park, property and community sources. Record claim-level URLs and checked dates. Verify changing regulations, access, fees and seasonal operations when relevant. Distinguish factual evidence, traveler opinions and editorial inference.
Traveler feedback must come from real attributable reviews, with platform/source links and date context, including meaningful drawbacks when supported. Never invent quotations, ratings, review totals or firsthand visits. Do not interpret operator marketing as independent traveler feedback.
Explore lesser-covered places, everyday culture, food, crafts, contemporary arts and community-led experiences. Describe communities respectfully and specifically; avoid exoticizing or exposing restricted cultural locations. No unsupported claims that places are unknown.
Kaya reference URL is still needed. Study useful presentation patterns without copying prose or images.

## Photographs

Every full destination, attraction, activity, accommodation and travel insight page needs 5–6 distinct, subject-specific real photographs; target six. Confirm identity/location and permitted reuse; retain credit, source, license, caption and alt text. A search result is not a license. Do not reuse generic Africa images to imply a particular property or activity, and do not pass generated scenery off as a real photograph.
If suitable photos are unavailable, retain a draft and give the owner a precise image request (subject, view needed, intended page, required rights). Owner-supplied photos still need ownership or permission information.

## Optional owner contribution form

Fill only what you know; the agent researches the rest.

- Action: add a page / improve a page / correct information
- Page type: destination / attraction / activity / accommodation / travel insight
- Place or page name:
- Country and specific location, or existing page URL:
- What should travelers know? Local story, useful detail, correction or suggested angle:
- Related attraction/activity or nearby stay:
- Accommodation amenities and price category, if applicable:
- Official website or supporting source:
- Photographs or photo links, with photographer and reuse permission:
- Any timing, priority or information to keep private:

## Initial live inventory

Retrieved from the public listing pages on 11 October 2026: **24 attractions, 11 activities, 24 accommodations and 10 travel insights**. These are observed listing counts, not a completed quality audit or database-wide count.

### Attraction backlog

Names below preserve the current website labels. Each needs a full content/image/source review before being marked complete.

- [ ] [Amboseli National Park](https://trekafricaguide.com/attractions/amboseli-national-park)
- [ ] [Bwindi Impenetrable National Park](https://trekafricaguide.com/attractions/bwindi-impenetrable-national-park)
- [ ] [Cairo And Giza](https://trekafricaguide.com/attractions/cairo-and-giza)
- [ ] [Cape Coast Kakum](https://trekafricaguide.com/attractions/cape-coast-kakum)
- [ ] [Cape Town](https://trekafricaguide.com/attractions/cape-town)
- [ ] [Djanet And Tassili](https://trekafricaguide.com/attractions/djanet-and-tassili)
- [ ] [Kruger National Park](https://trekafricaguide.com/attractions/kruger-national-park)
- [ ] [Lalibela](https://trekafricaguide.com/attractions/lalibela)
- [ ] [Maasai Mara](https://trekafricaguide.com/attractions/maasai-mara)
- [ ] [Marrakech And Atlas](https://trekafricaguide.com/attractions/marrakech-and-atlas)
- [ ] [Murchison Falls National Park](https://trekafricaguide.com/attractions/murchison-falls-national-park)
- [ ] [Namib Desert](https://trekafricaguide.com/attractions/namib-desert)
- [ ] [Okavango Delta](https://trekafricaguide.com/attractions/okavango-delta)
- [ ] [Ouidah And Ganvie](https://trekafricaguide.com/attractions/ouidah-and-ganvie)
- [ ] [Sahara Dunes](https://trekafricaguide.com/attractions/sahara-dunes)
- [ ] [Sal Island](https://trekafricaguide.com/attractions/sal-island)
- [ ] [Serengeti National Park](https://trekafricaguide.com/attractions/serengeti-national-park)
- [ ] [Sine Saloum Delta](https://trekafricaguide.com/attractions/sine-saloum-delta)
- [ ] [South Luangwa](https://trekafricaguide.com/attractions/south-luangwa)
- [ ] [Tokeh And River No2](https://trekafricaguide.com/attractions/tokeh-and-river-no2)
- [ ] [Tunis And Sidi Bou Said](https://trekafricaguide.com/attractions/tunis-and-sidi-bou-said)
- [ ] [Victoria Falls](https://trekafricaguide.com/attractions/victoria-falls)
- [ ] [Volcanoes National Park](https://trekafricaguide.com/attractions/volcanoes-national-park)
- [ ] [Zanzibar](https://trekafricaguide.com/attractions/zanzibar)

## Initial priorities

1. Establish the Git content publishing path and persistent evidence/image records.
2. Audit Bwindi's attraction, gorilla activity and existing accommodation as the first connected group; verify current property names and access by trekking sector before recommending nearby stays.
3. Expand the Murchison Falls group, then rotate among African regions.
4. Research a lesser-covered cultural or community-led experience alongside major attractions, choosing publishable subjects only after reliable evidence and suitable photos are available.
5. Refresh this order based on owner input, missing content and genuine audience needs. No traffic or commercial performance claims without analytics.

## Progress — 11 October 2026

- Confirmed GitHub repository write access and inspected the Supabase-backed publishing architecture.
- Inventoried public attraction/activity/accommodation/insight archives.
- Updated the existing daily automation to include advance notices, Git publishing, all five page types, owner contributions and specific image shortfall reporting.
- This document is the operating brief and backlog, not newly published travel content. No researched guide or photo package has yet been completed in this setup.
