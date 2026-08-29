# Researched Listings and Stock Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Trek Africa Guide's published listings with verified OTA/activity links, dated indicative prices, and license-verified real photography while retaining the current page design.

**Architecture:** Keep editorial listing content in the existing Laravel seeder and add structured research manifests for provenance, provider offers, and image credits. Use official destination/property/provider sources for identity and pricing context, download only commercially reusable images with recorded license metadata, and make the seeder merge researched offer/image data into the existing records.

**Tech Stack:** Laravel seeding, JSON manifests, PowerShell/Node download verification, Wikimedia Commons/Unsplash/Pexels source pages, Booking.com/Expedia/Hotels.com/GetYourGuide public provider pages, PHPUnit, Vite.

**Spec:** `docs/superpowers/specs/2026-08-29-africa-travel-search-affiliate-directory-design.md`

## Global Constraints

- Preserve the current public design and page structure.
- Refresh every currently published attraction, accommodation, and restaurant listing before adding expansion records.
- Prefer exact listing imagery; use truthful destination/type imagery only when exact-property reusable photography is unavailable.
- Every local image requires creator, source page, license, download URL, and listing association.
- Every published indicative price requires provider, currency, unit, checked date, and example search basis.
- Do not scrape restricted content, copy OTA descriptions, or treat search-result snippets as licensed content.
- A missing or unreliable price renders as "Check live price," never an invented amount.
- A provider link must resolve to the exact listing/activity or be labeled as a broader comparison/search action.
- Preserve user-owned dirty files and do not publish externally.

---

### Task 1: Research-manifest contracts and validation

**Files:**
- Create: `database/data/listing-research.json`
- Create: `database/data/image-credits.json`
- Create: `tests/Unit/ListingResearchManifestTest.php`

**Interfaces:**
- Produces listing research keys: `type`, `slug`, `country`, `district`, `sources`, `offers`, `reviewed_at`
- Produces image keys: `path`, `listing_type`, `listing_slug`, `subject`, `exact_match`, `creator`, `source_page`, `download_url`, `license`, `license_url`, `attribution`

- [ ] **Step 1: Write a failing manifest-schema test**

```php
public function test_every_published_offer_has_auditable_pricing_and_source_data(): void
{
    $records = json_decode(file_get_contents(database_path('data/listing-research.json')), true, 512, JSON_THROW_ON_ERROR);

    foreach ($records as $record) {
        $this->assertNotEmpty($record['sources']);
        foreach ($record['offers'] as $offer) {
            $this->assertNotEmpty($offer['provider']);
            $this->assertNotEmpty($offer['source_url']);
            if (isset($offer['price_amount'])) {
                $this->assertNotEmpty($offer['price_currency']);
                $this->assertNotEmpty($offer['price_unit']);
                $this->assertNotEmpty($offer['price_checked_at']);
                $this->assertNotEmpty($offer['price_basis']);
            }
        }
    }
}
```

Add an image test requiring a local existing file, primary source page, license URL, creator, truthful exact/representative flag, and non-empty alt subject.

- [ ] **Step 2: Run the manifest test and confirm files are missing**

Run: `php artisan test tests/Unit/ListingResearchManifestTest.php`

Expected: FAIL for absent manifests.

- [ ] **Step 3: Create valid empty schemas plus one fixture record**

Use JSON arrays and stable `type:slug` keys. Do not include credentials, copied descriptions, or unverified claims.

- [ ] **Step 4: Run the schema test**

Run: `php artisan test tests/Unit/ListingResearchManifestTest.php`

Expected: PASS for the fixture contract.

- [ ] **Step 5: Commit**

```bash
git add database/data/listing-research.json database/data/image-credits.json tests/Unit/ListingResearchManifestTest.php
git commit -m "test: define listing research provenance"
```

### Task 2: Verify and refresh existing attraction and accommodation offers

**Files:**
- Modify: `database/data/listing-research.json`
- Create: `research/africa-listing-refresh-2026-08-29.md`

**Interfaces:**
- Consumes current slugs from `database/seeders/TrekAfricaGuideSeeder.php`
- Produces at least one verified offer or an explicit `check_live_price` result for every current attraction and accommodation

- [ ] **Step 1: Inventory current records by type and country**

Record all current attraction, accommodation, and restaurant slugs and flag missing Central Africa coverage separately from existing-listing completion.

- [ ] **Step 2: Research each current accommodation**

For a consistent snapshot, use a documented example basis such as one night, two adults, one room, and a future non-peak date far enough ahead to be bookable. On each provider's own page, capture exact property name, canonical URL, displayed starting amount when visible, currency, whether taxes are visibly included/excluded, basis, and checked date. If the exact property is absent or the amount is not reliably visible, record no amount and use `check_live_price: true`.

- [ ] **Step 3: Research each current attraction**

Use official attraction sources for identity and GetYourGuide exact activity pages for bookable offers. Record exact activity name, URL, per-person or group unit, example travel date/participants, starting amount when reliably visible, currency, and checked date. Distinguish the destination attraction from the provider's specific tour product.

- [ ] **Step 4: Verify restaurant links without claiming Stay22 revenue**

Record official/reservation URLs and operating identity. Do not add an affiliate flag unless a documented supported program applies. Add a separate Stay22 "Find stays nearby" offer only when useful and accurately labeled.

- [ ] **Step 5: Write the source-backed research report**

Summarize methodology, checked dates, representative occupancy, price limitations, provider coverage, records replaced because they lacked an exact bookable provider match, and remaining `Check live price` items. Cite primary and provider sources.

- [ ] **Step 6: Run manifest validation**

Run: `php artisan test tests/Unit/ListingResearchManifestTest.php`

Expected: PASS for every current listing.

- [ ] **Step 7: Commit**

```bash
git add database/data/listing-research.json research/africa-listing-refresh-2026-08-29.md
git commit -m "content: verify Africa travel provider listings"
```

### Task 3: Source and download license-verified stock imagery

**Files:**
- Modify: `database/data/image-credits.json`
- Create: `public/images/stock/regions/*`
- Create: `public/images/stock/countries/*`
- Create: `public/images/stock/attractions/*`
- Create: `public/images/stock/accommodations/*`
- Create: `public/images/stock/restaurants/*`
- Create: `research/image-credits.md`

**Interfaces:**
- Consumes listing slugs and subjects from the research manifest
- Produces local Web-ready JPEG/WebP paths and auditable credit records

- [ ] **Step 1: Build concrete search phrases**

For each exact attraction use `[attraction] [country] wide landscape`. For accommodations prefer the exact property, then `[district] safari lodge exterior`, `[city] hotel`, or another truthful representative scene. For restaurants prefer the exact venue, then `[city] local dining` or a cuisine/setting image that does not claim to depict the venue.

- [ ] **Step 2: Verify source-page licensing before download**

Prefer Wikimedia Commons files with explicit commercial Creative Commons/public-domain metadata, then Unsplash or Pexels source pages with current commercial-use terms. Reject editorial-only, unclear, watermarked, AI-generated, logo-heavy, or privacy-sensitive images.

- [ ] **Step 3: Download one primary image for every current listing and landing-page subject**

Use stable local paths such as `public/images/stock/attractions/maasai-mara/primary.jpg`. Add a second image only when it materially improves recognition and its license is equally clear. Keep sufficient resolution for existing hero/card crops without storing unnecessary originals.

- [ ] **Step 4: Record truthful attribution metadata**

Mark `exact_match: false` for representative property/restaurant images and ensure alt text describes the visible setting, not the exact business.

- [ ] **Step 5: Generate a human-readable credits page**

Create `research/image-credits.md` from the manifest, grouped by region/country and including creator, source link, license, and associated listing.

- [ ] **Step 6: Run manifest and file validation**

Run: `php artisan test tests/Unit/ListingResearchManifestTest.php`

Expected: PASS with every referenced image present and auditable.

- [ ] **Step 7: Commit**

```bash
git add database/data/image-credits.json public/images/stock research/image-credits.md
git commit -m "content: replace generated imagery with licensed photos"
```

### Task 4: Merge researched offers and images into seeded content

**Files:**
- Modify: `database/seeders/TrekAfricaGuideSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`
- Modify: `supabase/seed/20260401000200_seed_trek_africa_launch.sql`
- Test: `tests/Feature/ResearchedListingSeedTest.php`

**Interfaces:**
- Consumes: both manifests and `BookingOffer`
- Produces: seeded local image paths, districts/locations, provider offers, and indicative pricing for public queries

- [ ] **Step 1: Write a failing seed test**

```php
public function test_every_seeded_listing_uses_researched_images_and_offer_metadata(): void
{
    $this->seed();

    Accommodation::with('bookingOffers')->each(function (Accommodation $stay): void {
        $this->assertStringStartsWith('/images/stock/', $stay->hero_image_url);
        $this->assertTrue($stay->bookingOffers->isNotEmpty());
    });

    Attraction::with('bookingOffers')->each(function (Attraction $attraction): void {
        $this->assertStringStartsWith('/images/stock/', $attraction->hero_image_url);
        $this->assertTrue($attraction->bookingOffers->isNotEmpty());
    });
}
```

Add assertions that public seed values contain no `/images/generated/` references and every priced offer has complete basis metadata.

- [ ] **Step 2: Run the seed test**

Run: `php artisan test tests/Feature/ResearchedListingSeedTest.php`

Expected: FAIL because current seed paths use generated images and do not create booking offers.

- [ ] **Step 3: Add manifest loaders and deterministic upserts**

Load JSON with `JSON_THROW_ON_ERROR`, resolve records by `type:slug`, update image/location fields, and `updateOrCreate` booking offers by listing/provider/source URL. Fail seeding with a useful exception when a published current listing is missing required research metadata.

- [ ] **Step 4: Mirror launch data into Supabase seed SQL**

Add the booking-offer inserts and stock-image paths using the same slugs and provider data. Do not embed the Stay22 affiliate ID in seed data; the runtime link builder owns it.

- [ ] **Step 5: Run seed and page tests**

Run: `php artisan test tests/Feature/ResearchedListingSeedTest.php tests/Feature/TravelPagesTest.php tests/Feature/ListingOfferCardTest.php`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add database/seeders/TrekAfricaGuideSeeder.php database/seeders/DatabaseSeeder.php supabase/seed/20260401000200_seed_trek_africa_launch.sql tests/Feature/ResearchedListingSeedTest.php
git commit -m "content: seed researched offers and licensed images"
```

### Task 5: Expand regional coverage without diluting verification

**Files:**
- Modify: `database/data/listing-research.json`
- Modify: `database/data/image-credits.json`
- Modify: `database/seeders/TrekAfricaGuideSeeder.php`
- Modify: `supabase/seed/20260401000200_seed_trek_africa_launch.sql`
- Modify: `research/africa-listing-refresh-2026-08-29.md`
- Add corresponding files under: `public/images/stock/**`
- Test: `tests/Feature/AfricaCoverageTest.php`

**Interfaces:**
- Consumes the same research contracts as Tasks 2-4
- Produces balanced coverage including Central Africa and additional country/district records

- [ ] **Step 1: Write a failing geographic-coverage test**

Assert that East, West, Southern, Northern, and Central Africa exist and that each region has searchable country, attraction, accommodation, and restaurant records.

- [ ] **Step 2: Add Central Africa as a region using verified copy and imagery**

Seed the region and an initial researched set of visitor-ready countries and districts. Prioritize exact provider matches and useful travel-planning coverage rather than unverified volume.

- [ ] **Step 3: Add researched expansion records across underrepresented countries**

For every added listing, complete the same source, price-basis, provider-link, image-license, and exact/representative checks. Do not add a price merely to satisfy record count.

- [ ] **Step 4: Update the report with explicit coverage and limitations**

List countries included, districts represented, source quality, provider coverage, and countries queued for future expansion. State that this is a scalable researched directory, not a claim to enumerate every operating business in Africa.

- [ ] **Step 5: Run coverage and manifest tests**

Run: `php artisan test tests/Feature/AfricaCoverageTest.php tests/Unit/ListingResearchManifestTest.php tests/Feature/ResearchedListingSeedTest.php`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add database/data public/images/stock database/seeders/TrekAfricaGuideSeeder.php supabase/seed/20260401000200_seed_trek_africa_launch.sql research/africa-listing-refresh-2026-08-29.md tests/Feature/AfricaCoverageTest.php
git commit -m "content: expand researched Africa directory coverage"
```

### Task 6: Copy cleanup and final content verification

**Files:**
- Modify: public-facing Blade views only where CMS/placeholder/generated wording exists
- Modify: `public/cms-sync.js` only where the same public wording is generated
- Test: `tests/Feature/PublicCopyTest.php`

**Interfaces:**
- Consumes refreshed data and current page design
- Produces original Africa-focused comparison copy with accurate booking disclosures

- [ ] **Step 1: Write failing copy assertions**

Assert that primary pages do not show `image slot`, `placeholder`, `CMS`, `generated`, or wording that says Trek Africa Guide takes payment. Assert that the pages explain provider checkout and indicative-price limitations.

- [ ] **Step 2: Run the copy test**

Run: `php artisan test tests/Feature/PublicCopyTest.php`

Expected: FAIL on current public implementation wording.

- [ ] **Step 3: Make focused wording edits only**

Retain the current section structure and tone. Rewrite only sentences necessary to position the platform around discovering Africa, comparing options, and choosing a provider. Do not copy KAYAK wording or alter unrelated editorial sections.

- [ ] **Step 4: Run content tests and builds**

Run: `php artisan test tests/Feature/PublicCopyTest.php tests/Feature/TravelPagesTest.php`

Run: `npm run build`

Expected: PASS and build exit 0.

- [ ] **Step 5: Audit generated-image references**

Run: `rg -n "/images/generated/|image-slot:|Reserved image space" app database resources public/cms-sync.js supabase --glob '!public/images/generated/**'`

Expected: no public-data or public-template matches; document any intentionally retained internal-only reference.

- [ ] **Step 6: Commit**

```bash
git add resources/views public/cms-sync.js tests/Feature/PublicCopyTest.php
git commit -m "content: focus public copy on Africa travel comparison"
```

### Task 7: Content and image browser verification

**Files:**
- Modify only when a verified content or image failure requires a focused fix.

**Interfaces:**
- Consumes the complete refreshed directory.
- Produces verified listing/provider/image presentation.

- [ ] **Step 1: Verify representative pages in every region**

Open the homepage, all listing indexes, and at least one country page per region. Confirm image loads/crops, accurate alt text, complete provider label, visible "From" or "Check live price" state, checked-date disclosure, and no visual redesign.

- [ ] **Step 2: Verify exact-provider redirects**

For representative Booking.com, Expedia/Hotels.com, and GetYourGuide offers, inspect the generated Stay22 URL and follow it far enough to confirm the expected provider/listing without completing any purchase.

- [ ] **Step 3: Verify representative-image honesty**

Cross-check cards marked `exact_match: false` against their alt text and copy; confirm they describe the destination/setting and not the exact property.

- [ ] **Step 4: Run all automated verification**

Run: `php artisan test`

Run: `npm run build`

Run: `php artisan static:build`

Expected: all commands exit 0 in the documented PHP environment.

- [ ] **Step 5: Commit focused verification fixes, if any**

```bash
git status --short
```

If verification required a source or content fix, stage only the exact paths reported above that belong to that fix and commit them with `git commit -m "fix: finalize researched listings and imagery"`. If no fix was required, do not create an empty commit.
