# Search Ribbon and Affiliate Listings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add attraction and accommodation search ribbons, dated indicative prices, and clearly labeled Stay22/provider actions while preserving Trek Africa Guide's current visual design.

**Architecture:** Keep the existing Laravel, Blade, Vite, Supabase synchronization, and Netlify static-build architecture. Store provider offers in a polymorphic `booking_offers` table, generate Stay22 URLs through one PHP service and one static-runtime JavaScript helper, and enhance the current listing-card partial rather than redesigning pages. Search is server-rendered in Laravel and reproduced client-side from the already-loaded Supabase tables for static deployment.

**Tech Stack:** Laravel, Eloquent, Blade, vanilla JavaScript, Vite, Tailwind-compatible existing CSS, Supabase REST synchronization, Netlify static HTML, PHPUnit.

**Spec:** `docs/superpowers/specs/2026-08-29-africa-travel-search-affiliate-directory-design.md`

## Global Constraints

- Preserve the current typography, colors, header, navigation, hero treatments, page structure, spacing, cards, galleries, and responsive identity.
- New search and provider controls must look native to the current design.
- Search ribbon modes are Attractions and Accommodations only.
- Do not claim real-time prices or availability without an approved live inventory API.
- Every published price is a dated indicative "From" price with provider, unit, and example basis.
- Final booking and payment occur on the selected external provider.
- Provider labels must match the provider endpoint or clearly say "Compare booking sites."
- Preserve user-owned changes in `cms.html`, `public/cms.html`, `public/cms-sync.js`, `dist/`, and other dirty files; merge carefully and never overwrite unrelated work.
- Do not publish, purchase imagery/data, change the Stay22 account, or delete the private administrative system.

---

### Task 1: District and booking-offer persistence

**Files:**
- Create: `database/migrations/2026_08_29_000100_create_districts_and_booking_offers.php`
- Create: `app/Models/District.php`
- Create: `app/Models/BookingOffer.php`
- Modify: `app/Models/Country.php`
- Modify: `app/Models/Accommodation.php`
- Modify: `app/Models/Attraction.php`
- Modify: `app/Models/Restaurant.php`
- Modify: `supabase/migrations/20260401000100_create_trek_africa_cms.sql`
- Test: `tests/Feature/BookingOfferModelTest.php`

**Interfaces:**
- Produces: `BookingOffer::offerable(): MorphTo`
- Produces: `Accommodation|Attraction|Restaurant::bookingOffers(): MorphMany`
- Produces: `District::country(): BelongsTo`, `Country::districts(): HasMany`, and nullable `district()` relationships on all three listing models
- Produces fields: `provider`, `label`, `source_url`, `stay22_provider`, `affiliate_supported`, `price_amount`, `price_currency`, `price_unit`, `price_checked_at`, `price_basis`, `active`, `sort_order`

- [ ] **Step 1: Write the failing relationship and cast test**

```php
public function test_an_accommodation_has_ordered_active_booking_offers(): void
{
    $this->seed();
    $stay = Accommodation::query()->firstOrFail();
    $stay->bookingOffers()->create([
        'provider' => 'booking',
        'label' => 'View deal on Booking.com',
        'source_url' => 'https://www.booking.com/hotel/ug/example.html',
        'stay22_provider' => 'booking',
        'affiliate_supported' => true,
        'price_amount' => 69,
        'price_currency' => 'USD',
        'price_unit' => 'night',
        'price_checked_at' => '2026-08-29',
        'price_basis' => '1 night, 2 adults, 1 room; taxes confirmed on provider',
        'active' => true,
        'sort_order' => 1,
    ]);

    $offer = $stay->bookingOffers()->firstOrFail();
    $this->assertSame('69.00', $offer->price_amount);
    $this->assertTrue($offer->affiliate_supported);
    $this->assertSame('2026-08-29', $offer->price_checked_at->toDateString());
}
```

- [ ] **Step 2: Run the focused test and confirm it fails because the table/model is absent**

Run: `php artisan test tests/Feature/BookingOfferModelTest.php`

Expected: FAIL for missing `booking_offers` table or model.

- [ ] **Step 3: Create the migration and model**

```php
Schema::create('booking_offers', function (Blueprint $table) {
    $table->id();
    $table->morphs('offerable');
    $table->string('provider');
    $table->string('label');
    $table->string('source_url', 2048)->nullable();
    $table->string('stay22_provider')->nullable();
    $table->boolean('affiliate_supported')->default(false);
    $table->decimal('price_amount', 10, 2)->nullable();
    $table->char('price_currency', 3)->nullable();
    $table->string('price_unit')->nullable();
    $table->date('price_checked_at')->nullable();
    $table->text('price_basis')->nullable();
    $table->boolean('active')->default(true);
    $table->unsignedInteger('sort_order')->default(0);
    $table->timestamps();
    $table->index(['provider', 'active']);
});
```

Before the offer table, create `districts` with `country_id`, unique `(country_id, slug)`, `name`, optional `overview`, JSON `aliases`, and `sort_order`; add nullable constrained `district_id` columns to attractions, accommodations, and restaurants. Cast `price_amount` to `decimal:2`, `price_checked_at` to `date`, and both booleans to `boolean`. Add district and ordered `morphMany` relationships to the relevant models.

- [ ] **Step 4: Add the equivalent Supabase table, indexes, read policy, and write policy pattern**

Use the existing policy naming and authenticated-admin write rules in the Supabase migration; do not invent a second authorization scheme.

- [ ] **Step 5: Run the model test**

Run: `php artisan test tests/Feature/BookingOfferModelTest.php`

Expected: PASS.

- [ ] **Step 6: Commit the isolated schema change**

```bash
git add database/migrations/2026_08_29_000100_create_districts_and_booking_offers.php app/Models/District.php app/Models/BookingOffer.php app/Models/Country.php app/Models/Accommodation.php app/Models/Attraction.php app/Models/Restaurant.php supabase/migrations/20260401000100_create_trek_africa_cms.sql tests/Feature/BookingOfferModelTest.php
git commit -m "feat: add provider booking offers"
```

### Task 2: Stay22 affiliate URL builder

**Files:**
- Create: `app/Services/Stay22LinkBuilder.php`
- Modify: `config/services.php`
- Modify: `.env.example`
- Test: `tests/Unit/Stay22LinkBuilderTest.php`

**Interfaces:**
- Consumes: `BookingOffer`, listing model with `name`, `slug`, `location_name`, and `country`
- Produces: `Stay22LinkBuilder::forOffer(Model $listing, BookingOffer $offer, array $search = []): string`
- Produces: `Stay22LinkBuilder::searchbar(string $address, array $search = []): string`

- [ ] **Step 1: Write failing URL-generation tests**

```php
public function test_named_provider_link_contains_affiliate_source_and_campaigns(): void
{
    config()->set('services.stay22.affiliate_id', 'aid-test');
    $url = app(Stay22LinkBuilder::class)->forOffer($this->stay, $this->bookingOffer, [
        'checkin' => '2026-11-10',
        'checkout' => '2026-11-12',
        'adults' => 2,
        'children' => 0,
        'rooms' => 1,
    ]);

    $this->assertStringStartsWith('https://www.stay22.com/allez/booking?', $url);
    $this->assertStringContainsString('aid=aid-test', $url);
    $this->assertStringContainsString('checkin=2026-11-10', $url);
    $this->assertStringContainsString('campaign=accommodation_', $url);
    $this->assertStringContainsString('link=', $url);
}
```

Also test Roam address matching, `/allez/searchbar`, missing optional dates, URL encoding, and campaign underscores.

- [ ] **Step 2: Run the unit test and confirm the service is missing**

Run: `php artisan test tests/Unit/Stay22LinkBuilderTest.php`

Expected: FAIL because `Stay22LinkBuilder` does not exist.

- [ ] **Step 3: Implement deterministic link construction**

```php
public function forOffer(Model $listing, BookingOffer $offer, array $search = []): string
{
    $provider = $offer->stay22_provider ?: 'roam';
    $params = $this->baseParams($listing, $offer, $search);

    if ($offer->source_url) {
        $params['link'] = $offer->source_url;
        unset($params['address'], $params['hotelname']);
    }

    return 'https://www.stay22.com/allez/'.$provider.'?'.http_build_query($params);
}
```

Use configuration key `services.stay22.affiliate_id`, defaulting to the existing deployed affiliate ID only in configuration, and document `STAY22_AFFILIATE_ID` in `.env.example`. Pass only Stay22-supported parameters; keep room count in a Trek Africa Guide campaign/context parameter unless Stay22 documents a room parameter.

- [ ] **Step 4: Run the unit tests**

Run: `php artisan test tests/Unit/Stay22LinkBuilderTest.php`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/Services/Stay22LinkBuilder.php config/services.php .env.example tests/Unit/Stay22LinkBuilderTest.php
git commit -m "feat: generate tracked Stay22 booking links"
```

### Task 3: Attraction and accommodation search behavior

**Files:**
- Modify: `app/Http/Controllers/SiteController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/TravelSearchTest.php`

**Interfaces:**
- Consumes query parameters: `mode`, `q`, `country`, `region`, `travel_date`, `checkin`, `checkout`, `adults`, `children`, `rooms`, `focus`
- Produces view values: `searchContext`, `searchSuggestions`, filtered `attractions` or `accommodations`

- [ ] **Step 1: Write failing feature tests for geographic and exact-name search**

```php
public function test_accommodation_search_matches_country_location_and_exact_property(): void
{
    $this->get('/accommodations?q=Uganda&checkin=2026-11-10&checkout=2026-11-12&adults=2&rooms=1')
        ->assertOk()
        ->assertSee('Sanctuary Gorilla Forest Camp')
        ->assertDontSee('Victoria Falls Hotel');

    $this->get('/accommodations?q=Sanctuary+Gorilla+Forest+Camp')
        ->assertOk()
        ->assertSee('Sanctuary Gorilla Forest Camp');
}
```

Add equivalent attraction tests for country, location, and exact attraction. Add validation tests rejecting invalid date order and clamping adults/rooms to safe positive ranges.

- [ ] **Step 2: Run the feature test and observe current country-name searches fail**

Run: `php artisan test tests/Feature/TravelSearchTest.php`

Expected: FAIL because the current `q` filters do not search country/region relations and do not retain occupancy context.

- [ ] **Step 3: Extend existing queries without changing page layout**

Add grouped `where` clauses for listing name, summary, location, related country name, related region name, and nearby attraction name. Validate with a dedicated private method or Form Request and pass normalized values as `searchContext`.

- [ ] **Step 4: Redirect legacy listing pages to focused index results**

```php
public function accommodation(Accommodation $accommodation): RedirectResponse
{
    return redirect()->route('accommodations.index', [
        'q' => $accommodation->name,
        'focus' => $accommodation->slug,
    ], 301);
}
```

Apply the same pattern to attraction and restaurant routes, targeting their existing landing pages.

- [ ] **Step 5: Run search and legacy redirect tests**

Run: `php artisan test tests/Feature/TravelSearchTest.php tests/Feature/TravelPagesTest.php`

Expected: PASS after updating old detail-page assertions to the new redirect contract.

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/SiteController.php routes/web.php tests/Feature/TravelSearchTest.php tests/Feature/TravelPagesTest.php
git commit -m "feat: search attractions and stays by destination"
```

### Task 4: Native search-ribbon component

**Files:**
- Create: `resources/views/site/partials/search-ribbon.blade.php`
- Modify: `resources/views/site/home.blade.php`
- Modify: `resources/views/site/attractions/index.blade.php`
- Modify: `resources/views/site/accommodations/index.blade.php`
- Modify: `resources/views/site/countries/show.blade.php`
- Modify: `resources/js/app.js`
- Modify: `resources/css/app.css`
- Test: `tests/Feature/SearchRibbonMarkupTest.php`

**Interfaces:**
- Consumes: `searchContext`, `searchSuggestions`, optional preselected `country`
- Produces DOM hooks: `[data-search-ribbon]`, `[data-search-mode]`, `[data-search-input]`, `[data-search-listbox]`, `[data-stay-fields]`

- [ ] **Step 1: Write failing markup assertions**

```php
public function test_accommodation_page_has_dates_travelers_and_rooms(): void
{
    $this->get('/accommodations')
        ->assertOk()
        ->assertSee('data-search-ribbon', false)
        ->assertSee('name="checkin"', false)
        ->assertSee('name="checkout"', false)
        ->assertSee('name="adults"', false)
        ->assertSee('name="rooms"', false);
}
```

Also assert two modes, accessible combobox attributes, and country-page preselection.

- [ ] **Step 2: Run markup tests**

Run: `php artisan test tests/Feature/SearchRibbonMarkupTest.php`

Expected: FAIL because the shared ribbon does not exist.

- [ ] **Step 3: Implement the Blade partial using existing design tokens**

Keep the current hero/page structure. Replace the homepage's simple search form and each index filter form with the shared partial only where requested. Keep existing filters available beneath or integrated into the ribbon.

- [ ] **Step 4: Add keyboard-safe client behavior**

In `resources/js/app.js`, implement mode switching, stay-field visibility, min-date/date-order behavior, suggestion filtering, ArrowUp/ArrowDown movement, Enter selection, Escape dismissal, and click-outside dismissal. Use existing DOMContentLoaded setup patterns.

- [ ] **Step 5: Extend CSS rather than restyling the site**

Add `.search-ribbon*` rules adjacent to `.hero-search` and `.filter-form`. Reuse `--brand-primary`, `--brand-secondary`, existing radii, shadows, type scale, focus outline, and mobile breakpoints.

- [ ] **Step 6: Run tests and asset build**

Run: `php artisan test tests/Feature/SearchRibbonMarkupTest.php tests/Feature/TravelSearchTest.php`

Run: `npm run build`

Expected: Tests PASS and Vite build exits 0.

- [ ] **Step 7: Commit**

```bash
git add resources/views/site/partials/search-ribbon.blade.php resources/views/site/home.blade.php resources/views/site/attractions/index.blade.php resources/views/site/accommodations/index.blade.php resources/views/site/countries/show.blade.php resources/js/app.js resources/css/app.css tests/Feature/SearchRibbonMarkupTest.php
git commit -m "feat: add native travel search ribbon"
```

### Task 5: Indicative pricing and provider actions in existing cards

**Files:**
- Create: `resources/views/site/partials/booking-offers.blade.php`
- Modify: `resources/views/site/partials/listing-card.blade.php`
- Modify: every Blade caller of `site.partials.listing-card`
- Modify: `app/Http/Controllers/SiteController.php`
- Test: `tests/Feature/ListingOfferCardTest.php`

**Interfaces:**
- Consumes: `listing`, `listingType`, `listing->bookingOffers`, `searchContext`
- Produces: provider labels, indicative-price disclosure, affiliate URL, checked date, and price basis

- [ ] **Step 1: Write failing card tests**

```php
public function test_stay_card_shows_dated_from_price_and_named_provider_link(): void
{
    $this->get('/accommodations?q=Sanctuary')
        ->assertOk()
        ->assertSee('From $69 per night')
        ->assertSee('View deal on Booking.com')
        ->assertSee('Price checked')
        ->assertSee('stay22.com/allez/booking', false)
        ->assertDontSee('/accommodations/sanctuary-gorilla-forest-camp', false);
}
```

Add tests for "Check live price," GetYourGuide attraction labels, restaurant non-affiliate labeling, `target="_blank"`, and safe `rel` values.

- [ ] **Step 2: Run the card tests**

Run: `php artisan test tests/Feature/ListingOfferCardTest.php`

Expected: FAIL because current cards link their image/title/CTA to detail routes.

- [ ] **Step 3: Load active offers in controller queries**

Eager-load `bookingOffers` for featured, country, attraction, accommodation, and restaurant collections to avoid N+1 queries.

- [ ] **Step 4: Preserve the card markup and replace navigation semantics**

Remove anchors from the listing image and title. Keep the current article, image slot, body, eyebrow, chips, and footer classes. Render the new booking-offers partial in the footer and include a concise external-booking notice.

- [ ] **Step 5: Format only valid indicative prices**

Show `From {currency symbol}{amount} per {unit}` only when amount, currency, unit, checked date, and price basis are all present and within the research freshness rule. Otherwise show `Check live price`. Never infer tax inclusion.

- [ ] **Step 6: Run the feature suite**

Run: `php artisan test tests/Feature/ListingOfferCardTest.php tests/Feature/TravelPagesTest.php`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add resources/views/site/partials/booking-offers.blade.php resources/views/site/partials/listing-card.blade.php resources/views/site app/Http/Controllers/SiteController.php tests/Feature/ListingOfferCardTest.php tests/Feature/TravelPagesTest.php
git commit -m "feat: show provider deals on listing cards"
```

### Task 6: Administrative, Supabase, and static-site parity

**Files:**
- Modify: `app/Http/Controllers/AdminController.php`
- Modify: `resources/views/admin/index.blade.php`
- Modify: `public/cms-sync.js`
- Modify: `cms.html`
- Modify: `app/Console/Commands/BuildStatic.php`
- Modify: `netlify.toml`
- Test: `tests/Feature/AdminBookingOfferTest.php`
- Test: `tests/Feature/StaticBuildRoutesTest.php`

**Interfaces:**
- Consumes Supabase table: `booking_offers`
- Produces static-runtime helpers: `stay22Link(listing, offer, search)` and `searchRibbon(mode, context, tables)`

- [ ] **Step 1: Write failing admin and static-contract tests**

Test that an admin can create/update an offer with price basis and checked date, public users cannot, and the static build no longer emits standalone listing-detail pages. First assert that `php artisan static:build --output=storage/app/static-verify` writes only beneath that explicit directory and leaves the current dirty `dist/` tree untouched.

- [ ] **Step 2: Run focused tests**

Run: `php artisan test tests/Feature/AdminBookingOfferTest.php tests/Feature/StaticBuildRoutesTest.php`

Expected: FAIL because booking offers are absent from admin/static flows.

- [ ] **Step 3: Add offer management without changing the public visual design**

Register `booking-offers` in the existing admin definition/rules/normalization pattern. Add fields for listing type/id, provider, label, source URL, Stay22 provider, affiliate flag, amount, currency, unit, checked date, basis, active state, and sort order.

- [ ] **Step 4: Update Supabase synchronization carefully**

Add `booking_offers` to the existing table fetch. Update only the relevant listing-card and page-rendering helpers in `public/cms-sync.js`; preserve unrelated user changes. Implement the same search parameters, provider labels, indicative-price disclosure, and non-detail card behavior used by Blade.

- [ ] **Step 5: Make static verification non-destructive, then remove detail-page generation**

Add an `--output` option to `BuildStatic` and resolve every delete/copy/write against a verified child of the workspace such as `storage/app/static-verify`. Never run the current command against `dist/` while user-owned changes are present. Stop rendering standalone attraction/accommodation/restaurant detail HTML. Generate Netlify redirect entries from legacy slugs to the appropriate index query/focus URL, or create equivalent deterministic redirect HTML if the build system cannot emit dynamic configuration.

- [ ] **Step 6: Keep generated deployment artifacts synchronized**

Run the static workflow only with `--output=storage/app/static-verify`. Do not hand-edit or regenerate `dist` in this checkout. Preserve unrelated dirty `dist` and CMS artifact changes.

- [ ] **Step 7: Run tests and build**

Run: `php artisan test tests/Feature/AdminBookingOfferTest.php tests/Feature/StaticBuildRoutesTest.php`

Run: `npm run build`

Expected: PASS and build exit 0.

- [ ] **Step 8: Commit**

```bash
git add app/Http/Controllers/AdminController.php resources/views/admin/index.blade.php public/cms-sync.js cms.html app/Console/Commands/BuildStatic.php netlify.toml tests/Feature/AdminBookingOfferTest.php tests/Feature/StaticBuildRoutesTest.php
git commit -m "feat: sync affiliate offers across publishing flows"
```

### Task 7: Integrated verification

**Files:**
- Modify only when a verified failure requires a focused fix.

**Interfaces:**
- Consumes all prior tasks.
- Produces verified local application and static build.

- [ ] **Step 1: Run the full PHP suite**

Run: `php artisan test`

Expected: PASS. If PHP is unavailable on the host, record that limitation and run the suite in the project's documented PHP environment rather than claiming success.

- [ ] **Step 2: Run the production asset build**

Run: `npm run build`

Expected: Vite exits 0.

- [ ] **Step 3: Run the static build**

Run: `php artisan static:build`

Expected: Static pages and redirect artifacts are produced without listing-detail HTML.

- [ ] **Step 4: Browser-test the primary flows**

Verify desktop and mobile attraction/accommodation ribbons, keyboard suggestions, date validation, traveler/room controls, country/location/name results, empty results, indicative-price disclosures, Booking.com/GetYourGuide labels, outbound Stay22 parameters, restaurant honesty, and legacy redirects.

- [ ] **Step 5: Verify preservation**

Compare the homepage, one region page, one country page, and all three listing indexes against the current design. Confirm that only search controls, card contents/actions, public wording, and imagery changed.

- [ ] **Step 6: Commit focused verification fixes, if any**

```bash
git status --short
```

If verification required a source fix, stage only the exact paths reported above that belong to that fix and commit them with `git commit -m "fix: finalize travel search and provider flows"`. If no fix was required, do not create an empty commit.
