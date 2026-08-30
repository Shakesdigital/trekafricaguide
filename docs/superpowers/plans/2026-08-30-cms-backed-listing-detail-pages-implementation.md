# CMS-Backed Listing Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore 72 first-party listing detail pages and make the Supabase CMS the secure, field-complete source of truth for their content, media, SEO, and Stay22 booking offers.

**Architecture:** Laravel and Blade continue to render complete local and static fallback pages in the existing design. Supabase Postgres, Auth, Storage, RLS, the hosted CMS, and `cms-sync.js` provide live published-content updates; directory cards stay internal and OTA actions render only inside detail-page offer panels.

**Tech Stack:** Laravel 12, PHP 8.2+, Blade, Vite, vanilla JavaScript, Supabase Postgres/Auth/Storage/Data API, pgTAP-compatible SQL tests, Netlify static output.

**Spec:** `docs/superpowers/specs/2026-08-30-cms-backed-listing-detail-pages-design.md`

## Global Constraints

- Preserve the current public design, search ribbons, and route families.
- Keep the catalogue at 24 attractions, 24 accommodations, and 24 restaurants unless a failing fixture proves the existing seed differs.
- Directory cards expose only an internal `View details` action; OTA offers appear only on listing detail pages.
- Use only the 24 verified Wikimedia Commons stock files and their recorded licenses for the initial media assignment; never select `/images/generated/`.
- Public content is visible only when `status = 'published'` and `published_at` is null or not in the future.
- A price is displayable only while its complete evidence is no older than `INDICATIVE_PRICE_MAX_AGE_DAYS`, default 90 days; otherwise show `Check live price`.
- Do not mutate Supabase project `pmskfhfxnhkpiaykgnra`; hosted mutations target only confirmed project `rfaoaaehhenhniqkgpl` after it becomes accessible.
- Never commit credentials, service-role keys, known passwords, `supabase/migrations/20260607000100_seed_auth_user.sql`, or unrelated user files.
- Generate `dist/` only after the source and staging build pass, and preserve the existing untracked screenshots.

---

### Task 1: Publication and licensed-media contracts

**Files:**

- Create: `database/migrations/2026_08_30_000100_add_publication_seo_and_media.php`
- Create: `app/Models/MediaAsset.php`
- Create: `app/Models/Concerns/HasPublicationState.php`
- Create: `database/data/media-assignments.json`
- Create: `tests/Feature/PublishedContentVisibilityTest.php`
- Create: `tests/Feature/MediaAssignmentAuditTest.php`
- Modify: `app/Models/Region.php`
- Modify: `app/Models/Country.php`
- Modify: `app/Models/Attraction.php`
- Modify: `app/Models/Accommodation.php`
- Modify: `app/Models/Restaurant.php`
- Modify: `app/Models/TourOperator.php`
- Modify: `app/Models/PageSection.php`
- Modify: `app/Models/SiteSetting.php`
- Modify: `database/seeders/TrekAfricaGuideSeeder.php`

**Interfaces:**

- Produces: `HasPublicationState::scopePubliclyVisible(Builder $query): Builder`.
- Produces: `MediaAsset` morph relation named `mediaAssets()` and ordered hero selection named `heroMedia()`.
- Produces: `database/data/media-assignments.json` entries with `entity_type`, `entity_slug`, `role`, `local_path`, `alt_text`, `source_page`, `creator`, `license`, `license_url`, `exact_subject_match`, and `attribution_text`.

- [ ] **Step 1: Write failing publication tests**

```php
public function test_draft_and_future_listings_are_not_publicly_visible(): void
{
    $draft = Attraction::factory()->create(['status' => 'draft']);
    $future = Attraction::factory()->create(['status' => 'published', 'published_at' => now()->addDay()]);

    $this->assertFalse(Attraction::publiclyVisible()->whereKey($draft)->exists());
    $this->assertFalse(Attraction::publiclyVisible()->whereKey($future)->exists());
}
```

- [ ] **Step 2: Write the failing media audit**

Assert exactly 72 assignments, every `local_path` exists below `public/images/stock/destinations`, every SHA-256 and license record matches `database/data/image-credits.json`, and no assignment contains `/images/generated/`.

- [ ] **Step 3: Run the focused tests and verify RED**

```powershell
php artisan test --filter="PublishedContentVisibility|MediaAssignmentAudit"
```

Expected: failures for missing publication columns, model scopes, media table, and assignment file.

- [ ] **Step 4: Add the minimal migration and model behavior**

Add `status`, `published_at`, `meta_title`, `meta_description`, and `meta_image_url` to routed public entities; `module_type` to `page_sections`; and `is_public` to `site_settings`. Add `media_assets` with a morph owner, asset role, URL/path, alt, attribution/license fields, publication fields, and sort order. Default existing seeded content to published.

- [ ] **Step 5: Seed idempotent media assignments**

Map each attraction to its exact destination stock asset. Map each related accommodation and restaurant to the same destination asset using truthful contextual alt text and `exact_subject_match = false`. Use `updateOrCreate` keyed by owner, role, and source page.

- [ ] **Step 6: Run the focused tests and verify GREEN**

```powershell
php artisan migrate:fresh --seed
php artisan test --filter="PublishedContentVisibility|MediaAssignmentAudit"
```

- [ ] **Step 7: Commit Task 1**

```powershell
git add -- app/Models app/Models/Concerns database/migrations/2026_08_30_000100_add_publication_seo_and_media.php database/data/media-assignments.json database/seeders/TrekAfricaGuideSeeder.php tests/Feature/PublishedContentVisibilityTest.php tests/Feature/MediaAssignmentAuditTest.php
git commit -m "feat: add published content and licensed media model"
```

### Task 2: Secure Supabase CMS schema, roles, and storage

**Files:**

- Create: `supabase/config.toml`
- Create: `supabase/migrations/20260830000100_harden_cms_content_and_roles.sql`
- Create: `supabase/seed/20260830000200_seed_cms_content_and_media.sql`
- Create: `supabase/tests/cms_rls.sql`
- Create: `tests/Feature/SupabaseSchemaContractTest.php`

**Interfaces:**

- Produces: `public.profiles(id uuid, role text, display_name text, created_at timestamptz, updated_at timestamptz)` with roles `super_admin`, `admin`, `editor`, `viewer`.
- Produces: private authorization helpers callable by RLS but not anonymously executable.
- Produces: public `media` and `branding` buckets plus role- and path-constrained Storage policies.
- Consumes: publication, SEO, settings-safety, and media field names from Task 1.

- [ ] **Step 1: Write a failing migration-contract test**

Assert the SQL migration contains RLS enablement, explicit grants, `profiles`, all four roles, published-only public SELECT policies, UPDATE policies with `USING` and `WITH CHECK`, media buckets, and separate Storage operations. Assert it does not contain `user_metadata`, a password, a service-role key, or the unrelated project ref.

- [ ] **Step 2: Write failing SQL authorization scenarios**

Create pgTAP-compatible cases for anon published reads, anon write denial, viewer mutation denial, editor draft insert/update, editor publish/delete denial, admin publish/delete, super-admin profile management, and media INSERT/SELECT/UPDATE/DELETE boundaries.

- [ ] **Step 3: Run contract verification and verify RED**

```powershell
php artisan test --filter=SupabaseSchemaContract
```

- [ ] **Step 4: Implement the additive Supabase migration**

Replace broad authenticated write policies with least-privilege policies backed by trusted `profiles` roles. Bundle grants and RLS. Keep authorization helpers outside the exposed API surface, set a safe `search_path`, revoke default PUBLIC execution, and explicitly grant only what policies require. Do not edit Supabase-managed schema objects other than documented Storage policies and bucket rows.

- [ ] **Step 5: Add the idempotent content/media seed**

Upsert catalogue and media records by stable slugs/source identifiers. Do not create Auth users. Do not reference `20260607000100_seed_auth_user.sql`.

- [ ] **Step 6: Verify locally when the CLI is available**

```powershell
supabase --version
supabase db reset --local
supabase test db
php artisan test --filter=SupabaseSchemaContract
```

If the CLI or container runtime is unavailable, retain the passing repository contract test and record the environmental limitation; do not apply SQL to another hosted project.

- [ ] **Step 7: Commit Task 2**

```powershell
git add -- supabase/config.toml supabase/migrations/20260830000100_harden_cms_content_and_roles.sql supabase/seed/20260830000200_seed_cms_content_and_media.sql supabase/tests/cms_rls.sql tests/Feature/SupabaseSchemaContractTest.php
git commit -m "feat: secure Supabase CMS content and media"
```

### Task 3: Restore first-party detail pages and isolate OTA offers

**Files:**

- Create: `tests/Feature/ListingDetailPagesTest.php`
- Modify: `app/Http/Controllers/SiteController.php`
- Modify: `resources/views/site/partials/listing-card.blade.php`
- Modify: `resources/views/site/partials/booking-offers.blade.php`
- Modify: `resources/views/site/attractions/show.blade.php`
- Modify: `resources/views/site/accommodations/show.blade.php`
- Modify: `resources/views/site/restaurants/show.blade.php`
- Modify: `tests/Feature/TravelPagesTest.php`
- Modify: `tests/Feature/TravelSearchTest.php`
- Modify: `tests/Feature/ListingOfferCardTest.php`
- Modify: `tests/Unit/Stay22LinkBuilderTest.php`

**Interfaces:**

- `SiteController::attraction(Attraction $attraction)` returns a detail view or 404.
- `SiteController::accommodation(Accommodation $accommodation)` returns a detail view or 404.
- `SiteController::restaurant(Restaurant $restaurant)` returns a detail view or 404.
- `listing-card.blade.php` consumes internal `$href` and never renders booking offers.
- `booking-offers.blade.php` consumes `$listing`, `$listing->bookingOffers`, and optional `$searchContext` only from detail pages.

- [ ] **Step 1: Invert the route and card tests**

Assert representative and full-catalogue detail URLs return 200, draft/future records return 404, cards contain `View details`, directory responses contain no `View deal on`, and detail responses contain active offers.

- [ ] **Step 2: Verify RED**

```powershell
php artisan test --filter="ListingDetailPages|ListingOfferCard|TravelPages|TravelSearch|Stay22LinkBuilder"
```

Expected: current detail routes redirect and cards render provider offers.

- [ ] **Step 3: Restore controller rendering**

Load the listing's region, country, district, published hero media, active ordered offers, and nearby published listings. Replace the three 301 methods with existing `show` templates. Remove offer eager-loading from home, directory, country, region, and nearby-card queries.

- [ ] **Step 4: Restore internal-only cards**

Make the card title/body/image presentational and render exactly one internal `View details` action from `$href`. Do not include the booking-offers partial.

- [ ] **Step 5: Render a detail-only offer panel**

Use the booking-offers partial in all three show templates under `Compare booking options`. Render `Check live price` for stale/incomplete evidence; render a neutral no-offer message; preserve sponsored/nofollow/noopener attributes; label unsupported direct links as non-affiliate.

- [ ] **Step 6: Add hierarchical breadcrumbs**

Render Home → Region → Country → type directory → listing using the stable existing route families.

- [ ] **Step 7: Verify GREEN and commit**

```powershell
php artisan test --filter="ListingDetailPages|ListingOfferCard|TravelPages|TravelSearch|Stay22LinkBuilder"
git add -- app/Http/Controllers/SiteController.php resources/views/site tests/Feature/ListingDetailPagesTest.php tests/Feature/TravelPagesTest.php tests/Feature/TravelSearchTest.php tests/Feature/ListingOfferCardTest.php tests/Unit/Stay22LinkBuilderTest.php
git commit -m "feat: restore first-party listing detail pages"
```

### Task 4: Stock media selection, attribution, and SEO

**Files:**

- Modify: `resources/views/site/attractions/show.blade.php`
- Modify: `resources/views/site/accommodations/show.blade.php`
- Modify: `resources/views/site/restaurants/show.blade.php`
- Modify: `resources/views/site/partials/image-slot.blade.php`
- Modify: `resources/views/layouts/site.blade.php`
- Modify: `app/Http/Controllers/SiteController.php`
- Modify: `tests/Feature/MediaAssignmentAuditTest.php`
- Modify: `tests/Feature/ImageCreditsAuditTest.php`

**Interfaces:**

- Entity SEO payload: `metaTitle`, `metaDescription`, `canonicalUrl`, `metaImageUrl`.
- Hero-media fallback order: published hero media → related licensed destination media → entity `hero_image_url` only when it resolves to verified stock.

- [ ] **Step 1: Add failing response audits**

For all 72 detail responses assert a stock path, truthful alt text, creator, source page, license name/URL, canonical URL, description, and Open Graph image. Assert no `/images/generated/`, `image-slot:`, or placeholder language.

- [ ] **Step 2: Verify RED**

```powershell
php artisan test --filter="MediaAssignmentAudit|ImageCreditsAudit"
```

- [ ] **Step 3: Replace generated-gallery probing**

Delete the `images/generated/{type}/{slug}` gallery selection from all show templates. Render the published stock hero and a compact attribution line or credits link without disrupting the gallery layout.

- [ ] **Step 4: Add entity SEO with global fallbacks**

Populate `<title>`, description, canonical, `og:title`, `og:description`, and `og:image` from entity fields with `site_settings` fallbacks. Keep the existing layout and branding.

- [ ] **Step 5: Verify GREEN and commit**

```powershell
php artisan test --filter="MediaAssignmentAudit|ImageCreditsAudit"
git add -- resources/views/site resources/views/layouts/site.blade.php app/Http/Controllers/SiteController.php tests/Feature/MediaAssignmentAuditTest.php tests/Feature/ImageCreditsAuditTest.php
git commit -m "feat: use licensed stock media and listing SEO"
```

### Task 5: Hosted CMS and live-runtime parity

**Files:**

- Create: `public/cms-core.js`
- Create: `public/cms-schema.js`
- Create: `tests/js/cms-core.test.mjs`
- Create: `tests/Feature/CmsFieldParityTest.php`
- Modify: `public/cms.html`
- Modify: `public/cms-sync.js`
- Modify: `cms.html`
- Modify: `app/Http/Controllers/AdminController.php`
- Modify: `resources/views/admin/index.blade.php`
- Modify: `package.json`

**Interfaces:**

- `window.TrekCmsSchema.resources` defines editable fields for regions, countries, districts, attractions, accommodations, restaurants, tour operators, booking offers, page sections, media assets, public settings/SEO, and profiles.
- `window.TrekCmsCore.isPublished(record, now)` returns public visibility.
- `window.TrekCmsCore.pickHeroMedia(listing, media, related)` returns a licensed media record or null.
- `window.TrekCmsCore.presentOffer(offer, listing, context, now)` returns provider label, price label, disclosure, and safe URL.
- `cms-sync.js` preserves pre-rendered `<main>` when fetching or matching fails.

- [ ] **Step 1: Write failing JavaScript unit tests**

Test publication timing, relationship normalization, stock fallback, offer freshness, Stay22 versus direct disclosures, and internal detail URLs.

- [ ] **Step 2: Write a failing PHP field-parity test**

Assert every public model field used by Blade and `cms-sync.js` exists in `cms-schema.js`, all relationships use readable selectors, booking offers never request a raw ID without a selector, and secrets are absent.

- [ ] **Step 3: Verify RED**

```powershell
node --test tests/js/cms-core.test.mjs
php artisan test --filter=CmsFieldParity
```

- [ ] **Step 4: Implement the shared CMS resource contract**

Extract pure rules to `cms-core.js` and resource definitions to `cms-schema.js`. Load them from both root/public CMS artifacts. Provide grouped identity, card, detail, relationship, SEO, publication, media, and offer fields; human-readable relationship selectors; status/search/filter/error states; and role-aware UI backed by RLS.

- [ ] **Step 5: Update live runtime synchronization**

Fetch only public-safe published records plus media and active offers. Render internal card URLs, first-party detail content, detail-only offers, stock media, and entity SEO. Never clear or replace the static page on fetch/match failure.

- [ ] **Step 6: Verify GREEN and commit**

```powershell
node --test tests/js/cms-core.test.mjs
node --check public/cms-core.js
node --check public/cms-schema.js
node --check public/cms-sync.js
php artisan test --filter=CmsFieldParity
git add -- public/cms-core.js public/cms-schema.js public/cms.html public/cms-sync.js cms.html app/Http/Controllers/AdminController.php resources/views/admin/index.blade.php package.json tests/js/cms-core.test.mjs tests/Feature/CmsFieldParityTest.php
git commit -m "feat: mirror public content in Supabase CMS"
```

### Task 6: Static detail routes and link audit

**Files:**

- Modify: `app/Console/Commands/BuildStatic.php`
- Modify: `tests/Feature/StaticBuildRoutesTest.php`
- Create: `tests/Feature/StaticLinkAuditTest.php`

**Interfaces:**

- `php artisan static:build --output=<verified-child-path>` emits published public routes without mutating another directory.
- Static route contract contains exactly 24 attraction, 24 accommodation, and 24 restaurant detail `index.html` files.

- [ ] **Step 1: Invert static-route tests**

Assert 72 detail files exist, focused detail-to-index redirects do not exist, all card/detail links resolve, and CMS helper scripts are copied.

- [ ] **Step 2: Verify RED**

```powershell
php artisan test --filter="StaticBuildRoutes|StaticLinkAudit"
```

- [ ] **Step 3: Emit published detail pages**

Iterate publicly visible listing models in `BuildStatic`; render their real route URLs; remove focused redirects; copy `cms-core.js` and `cms-schema.js`; retain legitimate clean-route mappings.

- [ ] **Step 4: Build in disposable staging and verify GREEN**

```powershell
php artisan static:build --output=storage/app/static-verify
php artisan test --filter="StaticBuildRoutes|StaticLinkAudit"
```

- [ ] **Step 5: Commit Task 6**

```powershell
git add -- app/Console/Commands/BuildStatic.php tests/Feature/StaticBuildRoutesTest.php tests/Feature/StaticLinkAuditTest.php
git commit -m "build: emit all listing detail routes"
```

### Task 7: Full verification and production package

**Files:**

- Regenerate after all checks: tracked `dist/**`
- Preserve: unrelated and untracked research, marketing, screenshot, logo-reference, and local configuration files.

**Interfaces:**

- Completion requires local/static parity, Supabase contract parity, resolved links, and responsive visual checks.

- [ ] **Step 1: Run the complete automated gate**

```powershell
php artisan migrate:fresh --seed
composer test
node --test tests/js/cms-core.test.mjs
node --check public/cms-core.js
node --check public/cms-schema.js
node --check public/cms-sync.js
npm run build
php artisan static:build --output=storage/app/static-verify
git diff --check
```

- [ ] **Step 2: Run content and route audits**

Confirm exactly 72 static detail pages; no selected generated imagery; no broken internal links; no directory OTA CTA; no detail redirect; complete image attribution; and no secret-like string in the staged diff.

- [ ] **Step 3: Browser-check representative routes**

Check one region, one country, each directory type, and each detail type at approximately 375px, 768px, and 1440px. Verify the fallback with Supabase requests blocked and keyboard navigation through search controls.

- [ ] **Step 4: Synchronize verified staging output to `dist/`**

Copy only tracked production artifacts and new required assets/scripts. Preserve the three untracked reference screenshots already present in `dist/`. Run `git diff --check` and repeat the static link/content audits against `dist/`.

- [ ] **Step 5: Commit the production package**

```powershell
git add -- dist/_redirects dist/index.html dist/regions dist/countries dist/attractions dist/accommodations dist/restaurants dist/build dist/images/stock dist/cms.html dist/cms-sync.js dist/cms-core.js dist/cms-schema.js
git commit -m "build: publish CMS-backed listing detail pages"
```

- [ ] **Step 6: Record hosted activation limitation accurately**

Do not claim the production Supabase migration is active until project `rfaoaaehhenhniqkgpl` appears in the authenticated Supabase connection and its migration, RLS, Storage, and advisor checks pass. Do not substitute project `pmskfhfxnhkpiaykgnra`.
