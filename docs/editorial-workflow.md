# Trek Africa Guide editorial workflow

Owner's standing brief, updated 11 October 2026. Manage contributions through the existing chat. The owner authorizes autonomous content selection, factual content edits, Git commits and pushes to the website repository. Preserve the existing visual layout. No routine tests or builds; inspect changed material. Do not claim publication until confirmed.

## Collaboration every three hours

Schedule: every three hours, next start 14 October 2026 at 16:30 Africa/Kampala, then 19:30, 22:30, 01:30, 04:30, 07:30, 10:30 and 13:30. Announce the chosen work before making changes and proceed without waiting for owner approval. Complete a manageable researched page, related group or maintenance improvement each run. Rotate destinations, attractions, activities, stays, listing cards and travel insights for solo, adventure, safari, budget, mid-range and cultural travelers. Preserve the current display style.

Publish evidence-backed, complete content even when optional owner input would improve it, then request that input through the progress report. Unsupported claims, unlicensed images and broken records are not made publishable by a request for later review. Report live links versus drafts/pushed changes, image counts, sources, blockers and next priority. Send the report and a reminder about review areas to the owner's configured email recipient using the connected Gmail account; the address is held in the private automation configuration. Record send success locally and do not claim delivery when the tool fails.

The existing thread automation remains local. Its three-hour schedule does not establish execution while the computer/app is off; a cloud execution path is not configured. Keep that limitation explicit. Prioritize quality over quotas and respect usage limits.

## Publishing

Repository: https://github.com/Shakesdigital/trekafricaguide (main).
Website: https://trekafricaguide.com/
The existing Astro build loads Supabase via src/lib/content-repository.mjs. A Git document alone does not publish a guide: use the repository content layer once implemented and inspect its documented schema. Preserve Supabase base records, relationships, publication controls and unrelated settings. Verify actual deployment outcome separately from a successful commit.
The saved D:\\TrekAfricaGuide path was unavailable. Older project notes identify E:\\TrekAfricaGuide; check before choosing another checkout. Connected Supabase access did not include the site's project; GitHub write access is available.

## Page requirements

Local destinations (cities, areas and islands) now use `content/local-destinations.json`; follow [Local destination authoring](local-destinations.md) for fields, explicit country/attraction/activity/stay links, publication rules, shared country cards and nested detail pages. Future editorial runs may add complete researched local guides through this collection. Keep the existing accommodation photography checkpoint active; the new local guides have their own six-photo follow-up in the feature ledger.

- Destinations: why visit, local context, principal and lesser-covered attractions, seasonal tradeoffs, access and suggested routes, linked activities/stays, and practical travel insights.
- Attractions: appeal and overview, how to get there, best time, realistic planning routes, sourced traveler perspectives, image-led activity listings and nearby stays.
- Activities: full overview, highlights, best time, routes/planning, related attraction guide, sourced traveler perspectives, and nearby stays. Research duration and suitability instead of inventing them.
- Accommodations: full description, what distinguishes the actual property, verified amenities, location/access and nearby activities, evidence-based budget/mid-range/luxury positioning. Multiple room categories do not imply every price tier. No fabricated rates or availability.
- Travel insights: useful destination/attraction planning articles, seasonal guidance, cultural etiquette, route comparisons and local stories linked to the relevant guides.
- One canonical accommodation can appear on multiple related attraction/activity pages. Verify geographical and practical relevance; do not duplicate the accommodation record.
- Preserve existing page structure. Where dedicated fields do not exist, use supported rich-text sections rather than inventing non-rendered fields.

## Research and voice

### Travel Insights depth and storytelling — 18 October 2026

Write original, substantial, story-led insights that help readers picture the journey and plan it confidently. Use a grounded opening, a clear progression through the experience, place-specific detail, practical explanations and honest trade-offs. Draw general inspiration from the accessible storytelling and practical depth of Lonely Planet and Bradt, without copying or closely paraphrasing their prose. Explain the pace, atmosphere, pleasures and difficulties only where reliable sources support them. Never invent firsthand visits, sensory observations, dialogue, encounters or reviews; attribute published traveller experiences with source/date context and distinguish editorial inference from evidence.

Answer the particular destination, safari, itinerary or how-to question thoroughly, anticipating follow-up questions. Where relevant, cover arrival and access, route choices, realistic pacing, suitability, transport, permits, booking logistics, dated costs, respectful etiquette and linked internal guides. Include a tailored packing section with reasons and useful FAQs that resolve real planning uncertainties. Add visa/entry guidance when relevant, freshly checked against official immigration or embassy sources, with checked dates and passport/nationality, trip-purpose and transit dependencies. Link official verification/application pages; never imply one rule applies to every traveller. Use authoritative evidence for material health and safety guidance.

Prefer meaningful subheadings, short paragraphs and purposeful lists to padding or generic checklists. Pair the narrative with relevant image follow-ups handled by the separate image automation. Apply this standard to new insights and progressively deepen existing planned insights during travel-insight rotation turns; never restore removed development placeholder articles. Preserve supported fields, research records, category rotation and pending-deliverable priority.

Attraction full-detail pages place Related activities after the main information/further stay planning and before Nearby stays. Activity pages use You may also like for other published activities in the same destination, prioritizing the same attraction, followed by Nearby stays. Reuse ListingCard and the existing full-width listing-grid without different card dimensions. Do not show empty related sections or invent related records. Keep published stay recommendations in the canonical Nearby stays grid rather than a second narrower card section. Remove the Attraction guide block from activity pages. Source sections are visible only in travel insights; preserve research evidence in records and ledgers. Required photo attribution remains available separately. Link natural mentions of published attractions within prose; avoid self-links, unpublished destinations and nested links. Exact attraction names are linked by the detail templates; write future mentions using the appropriate canonical name where natural.

Use fresh official tourism, attraction, park, property and community sources. Record claim-level URLs and checked dates. Verify changing regulations, access, fees and seasonal operations when relevant. Distinguish factual evidence, traveler opinions and editorial inference.
Traveler feedback must come from real attributable reviews, with platform/source links and date context, including meaningful drawbacks when supported. Never invent quotations, ratings, review totals or firsthand visits. Do not interpret operator marketing as independent traveler feedback.
Explore lesser-covered places, everyday culture, food, crafts, contemporary arts and community-led experiences. Describe communities respectfully and specifically; avoid exoticizing or exposing restricted cultural locations. No unsupported claims that places are unknown.
Kaya reference URL is still needed. Study useful presentation patterns without copying prose or images.

## Photographs

Every full destination, attraction, activity, accommodation and travel insight page needs 6–7 distinct images; target six. Prefer genuine free, subject-specific photographs and verify identity/location and reuse rights. Keep source, photographer, licence, date and accessible alt text. Do not repeat a photo across different detail-page collections; a canonical listing card may reuse its own page's feature image. A search result is not a licence.
The owner explicitly authorized the built-in ChatGPT image generator as a fallback on 12 October 2026. Use natural photographic styling, without text overlays or illustration styling. Generated scenes can represent a general travel experience, but must not invent a named property's rooms, amenities, an actual visit or a particular operator. Keep provenance in expandable image credits and the source ledger, not labels over the images. The tool has no selectable model called Images 2.5; do not claim that model was used. Preserve legally required attribution discreetly. Generic destination views must not be represented as property photographs.
If exact property photography is unavailable, record the missing subjects and use only accurate contextual imagery or retain the draft. Owner-supplied photos still need ownership or permission information.

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

## Progress — 12 October 2026

Published [Table Mountain: plan for the weather, choose the right way up](https://trekafricaguide.com/travel-insights/table-mountain-weather-cableway-or-hike) with six distinct licensed photographs, current operator/park sources and dated traveler perspectives. Live HTML confirmed. [Daily evidence and backlog](editorial-research/2026-10-12-daily-content.md). Seven earlier additions remain drafts, and the three YouTube candidates remain pending-license. Next priority: Elmina Castle imagery and heritage guide completion.

## Progress — 13 October 2026

Prepared six-image collections for eight attractions, two accommodations and the mokoro activity. Sixty licensed photographs and six generated representative images; no duplicated source-file hashes between these collections. Elmina, Kibale and Jozani keep draft status pending their remaining editorial review. The other eight collections update existing published pages. See [image rollout ledger](editorial-research/2026-10-13-image-rollout.md) for deployment status and remaining work. This is a partial rollout, not completion of the 85-page image inventory.

## Card sections and nearby discovery — 13 October 2026

- Use shared CardCarousel with ListingCard for homepage and full-detail card collections. Preserve archive grids, card widths, internal detail links, touch scrolling and previous/next wraparound. No autoplay.
- Accommodation pages: Other Nearby Accommodations, then Nearby Attractions. Exclude the current stay and drafts; use recorded attraction/stay relationships, not country-wide proximity guesses. Keep an honest empty state until nearby guides exist.
- Homepage includes Home navigation, featured attractions, stays and travel insights, with View More archive links.
- Discover candidates through TripAdvisor, Expedia, Kayak, Booking.com, Hotels.com and Safari.com as well as official tourism/property/operator sources. Verify location and practical routes before assigning relationships, cross-check material facts and date review evidence. OTA presence is not permission to reuse photos or copy text. Preserve exact Stay22 booking destinations.
- Follow the three-hour cadence anchored at 16:30 Kampala. Research sources remain in the editorial records even where source panels are hidden.

## Accommodation photography and homepage search — 13 October 2026

Accommodation heroes and galleries must depict the actual named property. Remove attraction/destination substitutes; retain a neutral no-photo state where identity and reuse rights cannot be verified. Do not generate imagined hotel rooms, pools or buildings. Target six distinct property photos and keep a per-property shortfall ledger for owner contributions. This supersedes earlier permission for destination-context accommodation imagery.

Keep homepage featured attraction and stay carousels populated from published records; prioritize actual-property photos for stays. The homepage search covers destinations, attractions, activities, accommodations and travel insights, linking directly to internal guides. No check-in/check-out, guest or region booking fields in this ribbon.

## Property-photo progress — 14 October 2026

See [accommodation photo additions](editorial-research/2026-10-14-accommodation-photos.md). Added 17 verified real-property photos: Paraa 1, Emerson Spice 6, Desert Quiver 6, Amboseli Serena 4. Desert Quiver and Amboseli Serena remain drafts. Fourteen accommodation records still need a first usable property photo. Openverse discovery followed by original Flickr license checks succeeded where exact Commons searches had failed. Do not repeat rejected Wetu downloads without owner agreement, NC-only Flickr licenses, namesake properties or wildlife-only images. Prioritize Desert Quiver final editorial review and the remaining photo gaps.

## Checkpoint-first execution — 14 October 2026

Read docs/editorial-progress.json first. Complete one bounded subtask per run, resuming active and review work before new tasks. Save the exact next action, sources, files, commit/deployment state and blockers after each meaningful step. Finish the parent task before selecting another by urgent user value and discoverability. If credits become unavailable, resume the checkpoint at the next eligible scheduled run after credits return; no immediate reset-trigger wakeup is configured. Do not treat optional owner feedback as a new approval gate. This replaces older batch-size and schedule instructions.


## Task magnitude — 15 October 2026
One task means one complete useful deliverable: for example, a researched full accommodation guide plus exact Stay22 booking destination and canonical listing card/relationships. Finish this together rather than scheduling individual paragraphs or links. A full photo collection may be the next linked task; ready factual text can publish with verified existing photos or an honest neutral no-photo state. Never fabricate property photos. Resume unfinished deliverables first; checkpoint real blockers/usage interruptions. Three-hour cadence unchanged.

## Balanced content rotation — 16 October 2026
Finish an individual deliverable and required fixes, then switch content category: accommodations, travel insights, activities, attractions, country/local destinations. Resume interrupted deliverables first, but keep category-wide image gaps as a backlog rather than blocking other categories. Record last/next category in the progress ledger. Exact OTA detail-page destinations through Stay22 are mandatory for booking CTAs; suppress unavailable/unverified matches, never substitute searches or homepages. Three-hour schedule unchanged.

## Broader African coverage — 16 October 2026
The owner encourages researched new coverage beyond the current catalogue: countries, local destinations, attractions, activities, accommodations, culture, food, arts, history, community-led experiences and practical insights. Choose useful coverage gaps across Africa while rotating content categories. Stay within supported fields/templates and canonical relationships; preserve factual, media-rights and exact OTA booking requirements. Complete one useful deliverable per task, with image gaps tracked separately.

## Owner override — 17 October 2026

Remove public affiliate disclosure and commission wording and remove public contact pages/details. Preserve Stay22 tracking and exact OTA redirects, including the configured affiliate ID. Do not change private owner contact records or research/history evidence.

## Country tabs refinement — 17 October 2026
Homepage and Destinations archive use compact name-only tabs sized like region tabs, with no flags, scrollbar, pause button or arrow controls. Preserve automatic looping, touch scrolling and hover/focus/reduced-motion safeguards. This supersedes the earlier flag-card styling.

## Homepage introduction — 18 October 2026
Keep the homepage introduction directly after the hero and before the country tabs. Pair concise independent-guide and Africa travel-planning context with a credited, relevant Africa image; link to the About Trek Africa Guide landing page with the CTA “Read More About Trek Africa Guide.” Keep the country tabs below the introduction. Avoid repeating the homepage planning copy or booking-verification guidance in the footer.

## Travel Insights catalogue — 17 October 2026
Owner removed the ten original development-seed insights from public publication. Keep their draft overrides; do not restore them through routine editorial runs. Retain the researched Table Mountain, Bwindi-sector and Cape Town-base insights and add newly researched original articles normally. See 2026-10-17-insight-cleanup ledger.

## Rendered readability gate — 23 October 2026

Publication must show readable paragraphs and working labeled links, never literal HTML tags or Markdown link syntax. Use EditorialText for mixed plain/rich editorial prose and the shared sanitizer for article HTML. Do not escape a whole HTML document into text. The production build checks every generated HTML page and fails on exposed markup. After deployment, inspect the changed page’s rendered text and actual anchor destinations; HTTP 200 or matching words alone is insufficient. Fix any failures before selecting new editorial work.
