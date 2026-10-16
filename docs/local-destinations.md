# Local destination authoring

Local destinations are cities, areas and islands within an existing published country. Author them in `content/local-destinations.json`, a Git-managed array loaded alongside the existing editorial overrides. No new Supabase table, migration or CMS setting is needed. Keep country records and local destinations distinct.

Each published record needs `slug`, `country_slug`, `name`, `category`, `listing_summary`, `overview`, `access_summary`, `best_time` and `planning_tips`. Use lowercase hyphenated route slugs. The canonical URL is `/countries/<country_slug>/<slug>`; duplicate slugs within a country fail the build. `status: "published"` and an absent or past `published_at` make a record eligible. Drafts, future publication dates and invalid publication dates stay hidden. Published records require a published parent country.

Use `attraction_slugs`, `activity_slugs`, `accommodation_slugs` and `travel_insight_slugs` as explicit arrays of existing published record slugs. All referenced attractions, activities and stays must belong to the parent country. Missing, unpublished, duplicate or cross-country references fail the build instead of generating misleading cards. Country membership validates data integrity; the editor must also verify the actual local geography and practical route. No country-wide proximity inference is used. Travel insights can discuss multiple countries; select them for a relevant route or planning subject. Empty relationship arrays are valid and their sections are hidden. Do not link a draft such as Jozani Forest until that guide is published.

Optional fields: `hero_title`, `meta_title`, `highlights` (plain-text array), `hero_image_url`, `hero_image_alt`, `gallery` (image URL array), `sort_order`, `research_sources` (label/URL objects), `last_researched` (YYYY-MM-DD). Text fields are plain text; separate paragraphs with two newlines. Attraction names in prose link through the existing editorial helper. Related cards retain their canonical detail-page URLs and existing booking behavior. Destination pages themselves have no hotel-booking surrogate.

The country detail page adds a **Destinations in [country]** carousel only when the country has published local destinations. The country archive includes local guides in a shared carousel. Search suggestions open the explicit nested URL when selected or when the exact destination name is submitted. All cards use ListingCard and CardCarousel; full guides reuse the country detail layout, Gallery and editorial sections. This repository currently has no automatic sitemap integration; no static sitemap was added.

## Repeatable editorial run

1. Pick one geographically coherent city, area or island supported by existing published guides. Verify official facts and the relevance of each related record; avoid inventing a new page solely to fill a country quota.
2. Write a useful overview, access, seasonal tradeoffs, practical pacing and stay selection. Distinguish editorial itineraries from operator facts. Keep rates, schedules and regulations out unless checked at the time of writing.
3. Save source URLs and the checked date in the record and a claim-level ledger under `docs/editorial-research/`. Sources remain internal to the record/ledger; visible source sections stay exclusive to travel insights. Do not invent traveler reviews.
4. Target six distinct, location-accurate, licensed photos per local guide. A canonical card may reuse its own guide's feature image. Do not borrow another detail page's photo collection or hotel images to populate a destination gallery. Save image provenance in the existing photo library workflow. Under the owner's current instruction, useful guides may publish with a neutral missing-image slot and an explicit six-photo backlog.
5. Inspect changed records, relationships and templates. No routine tests, builds or browser QA. Commit/push only within current authorization and report live deployment separately.

Initial guides: Buhoma (Uganda), Cape Town (South Africa), and Unguja (Tanzania). Each starts with zero dedicated photographs; all three need six distinct images. Existing property images are unchanged.

## Country and region navigation
Region detail pages display country-name tabs in a full-width strip after the hero, before the overview. Country detail pages use the same strip for published local destinations. DestinationTabs reuses the shared carousel controls (wraparound arrows, touch scrolling, reduced motion); links open canonical detail pages. Empty sections are omitted; arrows appear only when the tabs overflow. Keep attraction/stay carousels unchanged.
