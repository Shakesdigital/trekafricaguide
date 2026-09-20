# Africa Guide Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved five-region, 29-country guide-first Trek Africa Guide experience with internal listing-card journeys, dormant restaurants, and direct non-affiliate booking links on detail pages.

**Architecture:** Keep the current Laravel/Blade templates, Supabase-compatible CMS schema, static builder, and visual component system. Change public presentation and routing in place, retain restaurant storage without exposing it, and extend structured seed content through a focused expansion data provider so the main seeder remains readable.

**Tech Stack:** PHP 8.2+, Laravel 12, Blade, Eloquent, Supabase/Postgres-compatible schema, vanilla JavaScript CMS synchronization, Vite/Tailwind build pipeline, Netlify static output.

**Spec:** `docs/superpowers/specs/2026-09-20-africa-guide-content-expansion-design.md`

## Global Constraints

- Preserve the current typography, color palette, spacing system, card shapes, buttons, navigation behavior, templates, and mobile breakpoints.
- Every public attraction and stay card links to an internal detail page.
- Attraction cards end with `View attraction detail`; stay cards end with `View stay`.
- Restaurant content is absent from public routes, navigation, pages, search, static output, and visible editor workflows; retained data is not deleted.
- External providers appear only on detail pages through direct non-affiliate URLs.
- No Stay22 script, URL, affiliate ID, campaign parameter, `sponsored` relation, affiliate disclosure, or affiliate-focused copy remains in public output.
- Research and content rollout order is West, East, Southern, Northern, Central Africa.
- Existing unrelated and untracked workspace files are not modified.
- Production deployment and hosted Supabase mutation are excluded.
- The user requested implementation-first execution without running test suites in this pass; tests remain specified for later validation and delivery must state that they were not run.

## Review Focus

- A listing with no verified provider URL must retain a useful detail page and render no empty or `#` external action.
- A dormant restaurant record must never reappear through CMS synchronization, search suggestions, navigation, or static generation.
- Attraction and stay cards must preserve the existing visual classes while presenting type-specific field order and CTA text.
- A country with a currently restricted attraction must publish a dated verification warning rather than implying ordinary access.
- A stay without an official star classification must use a descriptive tier, not claim an official star rating.

---

### Task 1: Disable Restaurants and Reframe the Public Guide

**Files:**
- Modify: `routes/web.php`
- Modify: `app/Http/Controllers/SiteController.php`
- Modify: `app/Http/Controllers/AdminController.php`
- Modify: `app/Http/Controllers/Auth/AdminAuthController.php`
- Modify: `resources/views/layouts/site.blade.php`
- Modify: `resources/views/site/home.blade.php`
- Modify: `resources/views/site/countries/index.blade.php`
- Modify: `resources/views/site/countries/show.blade.php`
- Modify: `resources/views/site/regions/show.blade.php`
- Modify: `resources/views/site/attractions/show.blade.php`
- Modify: `resources/views/site/contact.blade.php`
- Modify: `resources/views/admin/index.blade.php`
- Test: `tests/Feature/TravelPagesTest.php`
- Test: `tests/Feature/ListingDetailPagesTest.php`

**Interfaces:**
- Consumes: Existing route names and controller payloads.
- Produces: Public navigation containing Home, Regions, Destinations, Attractions, Accommodations, Contact; restaurant requests resolve through the normal 404 path.

- [ ] Remove restaurant routes and public controller queries/methods while retaining the model and tables.
- [ ] Remove restaurant navigation, home sections, cards, country dining blocks, attraction dining blocks, contact links, and restaurant-oriented copy.
- [ ] Remove Restaurants and restaurant booking choices from the visible admin workflow without deleting stored records.
- [ ] Replace homepage/site messaging with destination inspiration, attraction planning, and nearby-stay guidance.
- [ ] Add assertions equivalent to:

```php
$this->get('/')->assertOk()->assertDontSee('Restaurants')->assertDontSee('Stay22');
$this->get('/restaurants')->assertNotFound();
$this->get('/restaurants/example')->assertNotFound();
```

### Task 2: Make Every Listing Card an Internal Guide Action

**Files:**
- Modify: `resources/views/site/partials/listing-card.blade.php`
- Modify: `resources/views/site/home.blade.php`
- Modify: `resources/views/site/regions/show.blade.php`
- Modify: `resources/views/site/countries/show.blade.php`
- Modify: `resources/views/site/attractions/index.blade.php`
- Modify: `resources/views/site/attractions/show.blade.php`
- Modify: `resources/views/site/accommodations/index.blade.php`
- Modify: `resources/views/site/accommodations/show.blade.php`
- Modify: `public/cms-sync.js`
- Modify: `public/cms-core.js`
- Test: `tests/Feature/TravelPagesTest.php`
- Test: `tests/js/cms-core.test.mjs`

**Interfaces:**
- Consumes: `listing-card` inputs `href`, `listing`, `title`, `eyebrow`, `summary`, `chips`, and `cta`.
- Produces: Consistent attraction and accommodation card contracts in server and CMS-rendered markup.

- [ ] Ensure the shared card renders the title before location metadata without changing its CSS classes or container structure.
- [ ] Pass attraction location/country, concise summary, in-country locality, and `View attraction detail` in every attraction context.
- [ ] Pass stay locality/country, concise summary, nearby attraction or subregion, and `View stay` in every accommodation context.
- [ ] Make card image, heading link, and CTA use the same internal detail URL.
- [ ] Remove external booking actions and provider language from all cards.
- [ ] Add assertions equivalent to:

```php
$this->get('/attractions')->assertSeeInOrder(['Bwindi Impenetrable National Park', 'Uganda', 'View attraction detail']);
$this->get('/accommodations')->assertSeeInOrder(['Sanctuary Gorilla Forest Camp', 'Uganda', 'View stay']);
```

### Task 3: Replace Affiliate Rendering with Direct Detail-Page Choices

**Files:**
- Modify: `resources/views/layouts/site.blade.php`
- Modify: `resources/views/site/partials/booking-offers.blade.php`
- Modify: `resources/views/site/attractions/show.blade.php`
- Modify: `resources/views/site/accommodations/show.blade.php`
- Modify: `app/Models/BookingOffer.php`
- Modify: `database/seeders/TrekAfricaGuideSeeder.php`
- Modify: `public/cms-core.js`
- Modify: `public/cms-sync.js`
- Test: `tests/Feature/ListingDetailPagesTest.php`
- Test: `tests/js/cms-core.test.mjs`

**Interfaces:**
- Consumes: Active `BookingOffer` records and their `source_url`, `provider`, `label`, and sort order.
- Produces: Safe direct provider anchors with `target="_blank" rel="nofollow noopener noreferrer"` on detail pages only.

- [ ] Remove the Stay22 script and bypass `Stay22LinkBuilder` in public rendering.
- [ ] Render `source_url` directly and omit active offers with invalid or empty HTTP(S) URLs.
- [ ] Seed provider labels by listing type: attraction (`Explore on GetYourGuide`, `Review on Tripadvisor`) and stay (`Book via Booking.com`, `Review on Tripadvisor`, `Book via Agoda`, `Compare on Kayak`, `View on Hotels.com`).
- [ ] Set new seed offers to `affiliate_supported=false` and leave legacy affiliate columns dormant.
- [ ] Remove affiliate notices, `sponsored`, wrapped URLs, comparison pricing, and affiliate campaign logic from public JavaScript.
- [ ] Keep the neutral reminder that Trek Africa Guide does not take payment and that current terms must be checked on the provider site.

### Task 4: Add the Structured Expansion Content Provider and Research Ledger

**Files:**
- Create: `database/seeders/Concerns/SeedsAfricaGuideExpansion.php`
- Modify: `database/seeders/TrekAfricaGuideSeeder.php`
- Create: `research/africa-guide-source-ledger.md`
- Modify: `database/data/media-assignments.json`

**Interfaces:**
- Consumes: Existing `country()`, `attraction()`, and `stay()` helpers in `TrekAfricaGuideSeeder`.
- Produces: `expansionRegions(): array`, `expansionCountries(): array`, `expansionAttractions(): array`, `expansionAccommodations(): array`, and `directBookingOffers(): array`.

- [ ] Add Central Africa and the ten new country records with practical gateway, seasonality, planning, and verification copy.
- [ ] Define the prioritized attraction roster for every new country and additions required to bring existing countries to four or more attractions.
- [ ] Define real nearby stays across budget, mid-range, and luxury tiers where supported; reuse a property relationship only when geographically accurate.
- [ ] Include locality, descriptive tier or verified official category, uniqueness, route-fit reason, amenities, direct official/property URL, and related attraction.
- [ ] Record supporting official and corroborating sources in the ledger with organization, URL, source year/date, record mapping, and changing-condition notes.
- [ ] Add media assignments only where source, creator, license, and exact-versus-context status are complete.

### Task 5: Integrate the Five Regional Content Batches

**Files:**
- Modify: `database/seeders/Concerns/SeedsAfricaGuideExpansion.php`
- Modify: `database/seeders/TrekAfricaGuideSeeder.php`
- Modify: `resources/views/site/home.blade.php`
- Modify: `resources/views/site/regions/index.blade.php`
- Modify: `resources/views/site/regions/show.blade.php`
- Modify: `resources/views/site/countries/show.blade.php`
- Modify: `resources/views/site/attractions/show.blade.php`
- Modify: `resources/views/site/accommodations/show.blade.php`

**Interfaces:**
- Consumes: Expansion arrays from Task 4.
- Produces: Five regions, 29 countries, four-to-eight attraction entries per country, nearby stay recommendations, and correct collection membership.

- [ ] Merge West Africa records first: enrich Ghana, Senegal, Benin, Sierra Leone, Cabo Verde; add Nigeria, The Gambia, and Cote d'Ivoire.
- [ ] Merge East Africa records: enrich Uganda, Kenya, Tanzania, Rwanda, Ethiopia; add Mauritius and Seychelles.
- [ ] Merge Southern Africa records: enrich South Africa, Botswana, Namibia, Zimbabwe, Zambia; add Mozambique.
- [ ] Merge Northern Africa records: enrich Morocco, Egypt, Tunisia, and Algeria.
- [ ] Merge Central Africa records: Sao Tome and Principe, Cameroon, Gabon, Republic of the Congo; mention but do not publish bookable DRC or Central African Republic guides.
- [ ] Update homepage region slides and featured records without changing the homepage section layout.

### Task 6: Keep CMS Synchronization and Static Output in Parity

**Files:**
- Modify: `app/Console/Commands/BuildStatic.php`
- Modify: `public/cms-core.js`
- Modify: `public/cms-sync.js`
- Modify: `public/cms-schema.js`
- Modify: `public/cms.html`
- Modify: `resources/views/admin/index.blade.php`
- Test: `tests/Feature/StaticBuildRoutesTest.php`
- Test: `tests/Feature/CmsFieldParityTest.php`
- Test: `tests/js/cms-core.test.mjs`

**Interfaces:**
- Consumes: Published regions, countries, attractions, accommodations, page sections, media, and direct offers.
- Produces: CMS-enhanced pages and static output containing exactly the same enabled public resource families.

- [ ] Remove restaurant fetches, route construction, suggestions, editor panels, and static output rules.
- [ ] Ensure the CMS renderer preserves the card content order and CTA contract from Task 2.
- [ ] Ensure CMS offer rendering uses direct URLs and never rebuilds an affiliate wrapper.
- [ ] Emit every published region, country, attraction, and accommodation route as a real `index.html`.
- [ ] Keep dormant restaurant schema references only where required for reversible database compatibility.

### Task 7: Acceptance Validation and Delivery

**Files:**
- Modify: `tests/Feature/TravelPagesTest.php`
- Modify: `tests/Feature/ListingDetailPagesTest.php`
- Modify: `tests/Feature/StaticBuildRoutesTest.php`
- Modify: `tests/Feature/CmsFieldParityTest.php`
- Modify: `tests/Feature/ImageCreditsAuditTest.php`
- Modify: `tests/js/cms-core.test.mjs`

**Interfaces:**
- Consumes: All prior tasks.
- Produces: A validation-ready implementation and an explicit record of checks run or deferred.

- [ ] Update obsolete restaurant and affiliate expectations so the suites describe the approved product.
- [ ] Add count, relationship, card-order, direct-link, restaurant-absence, and affiliate-string-absence coverage.
- [ ] When authorized, run the focused PHP feature tests, JavaScript tests, production asset build, static render, link audit, and responsive checks at 390px, 768px, and 1440px.
- [ ] In this execution, honor the user's request not to run test suites; inspect changed files for obvious syntax and unresolved route references only if that can be done without executing the suites.
- [ ] Report implementation outcome, tests not run, remaining deployment/Supabase boundaries, and any content records intentionally omitted for safety or evidence quality.
