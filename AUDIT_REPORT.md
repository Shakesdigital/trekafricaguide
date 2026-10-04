# Trek Africa Guide — Technical Implementation Audit Report

**Date:** 2026-10-04  
**Scope:** AUDIT ONLY — no files modified, deleted, migrated, overwritten, or published.  
**Auditor:** Claude (Opus model) + Supabase CMS Architect / Fable Mode Pro skills  

---

## SECTION A — Current Architecture

### A.1 Frontend Architecture

**Stack:** Astro 5.18.2 (static site generator) with `output: 'static'` targeting `./dist`.

**Build pipeline:**
- `package.json` scripts: `dev` (astro dev), `build` (`node scripts/write-public-config.mjs && astro build`), `test` (node --test), `verify` (npm test && npm run build)
- Dependencies: `@supabase/supabase-js` 2.116.0, `zod` 3.25.76, `sanitize-html` 2.17.5, `@electric-sql/pglite` 0.5.8 (dev)
- `astro.config.mjs`: site URL `https://trekafricaguide.com`, `trailingSlash: 'never'`

**Key architectural decisions:**
- **Build-time only Supabase reads:** `src/lib/supabase.mjs` creates a public client with `persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false`. The service_role key is explicitly forbidden from build env (`src/lib/env.mjs` — `readBuildEnv()` does not read it).
- **Static generation:** All content pages use `getStaticPaths()` with `getSiteModel()` which loads all published Supabase records at build time. No client-side data fetching.
- **Search is client-side only:** `window.trekSearchSuggestions` is injected at build time by `SiteLayout.astro` via `define:vars`. `src/scripts/site.js` filters client-side. No server-side search endpoint.

**Route families:** `regions`, `countries`, `attractions`, `accommodations`, `activities`, `travel-insights`, `contact`. Routes are defined in `src/config/site.mjs` with `INTERNAL_ROUTE_FAMILIES`.

**Components:**
- `ListingCard.astro` — reusable card for attractions/accommodations/activities
- `BookingOffers.astro` — Stay22 affiliate link rendering with `rel="nofollow sponsored noopener"` or `rel="nofollow noopener"`
- `ImageSlot.astro` — stock image resolution via `resolveImage()` from `src/lib/images.mjs`
- `Gallery.astro` — photo gallery from `hero_image_url` + `gallery` arrays
- `PageHero.astro` — page hero with image-slot resolution
- `SearchRibbon.astro` — dual-mode search (stays/attractions) with date/occupancy fields
- `Header.astro` / `Footer.astro` — navigation and contact info
- `Breadcrumbs.astro` — breadcrumb trail
- `VideoStory.astro` — YouTube embed component

### A.2 Backend Architecture

**Dual-stack hybrid:**

1. **Supabase (authoritative CMS backend):**
   - Postgres database with 11 migration files in `supabase/migrations/`
   - Supabase Auth (auth.users) for CMS identity with `profiles` table
   - Supabase Storage buckets: `media` and `branding`
   - Row Level Security (RLS) with role-based policies

2. **Laravel 11 (legacy server-rendered fallback / admin):**
   - `app/Models/` — Eloquent models: Accommodation, Attraction, Country, District, MediaAsset, PageSection, Region, Restaurant, SiteSetting, TourOperator, BookingOffer, User
   - `app/Http/Controllers/` — AdminController, SiteController, TravelController, Auth/AdminAuthController
   - `app/Models/Concerns/HasPublicationState.php` — `scopePubliclyVisible` trait mirroring the Supabase `visibleAt()` logic
   - `routes/web.php` — web routes mirroring Astro route structure
   - `database/migrations/2026_04_19_210000_create_trek_africa_cms_tables.php` — Laravel migration mirroring Supabase schema
   - `database/seeders/TrekAfricaGuideSeeder.php` — 157KB seed file (single source of truth referenced by both)
   - Uses SQLite for local development (not explicitly configured but implied by the seeder)

**Migration history (git log):**
```
9e4be2a chore: checkpoint existing workspace before AI infrastructure
b14ccc9 Add credited starter photography across listings and CMS
693c5d8 Add activities catalogue and editorial Travel Insights with CMS support
644b3bf fix(cms-sync): add restaurants support to frontend sync
e413183 fix(cms): add restaurants support to CMS - fix revert after save
d21abbc fix(cms): resolve null innerHTML crash on save + add Netlify deploy hook
d927fd4 fix(build): add backward-compat SUPABASE_ANON_KEY fallback in env validation
9f46f0b fix: update .env.netlify to use new Supabase env var names
7141efc Merge: resolve netlify conflicts, keep Node-only build
0e06824 fix(deploy): switch Netlify to Node-only Astro build, remove PHP
044130f feat: port Trek Africa Guide design to Astro
0d2140d feat: port safe content and Stay22 rules to Node
4d20edc feat: validate and join Supabase site content
5fbd19f feat: load published travel content from Supabase
```

The architecture is in transition: Laravel was the original stack, and Astro was added as a static front. The `0e06824` commit switched Netlify to "Node-only Astro build, remove PHP", but the Laravel code remains in the repo as a parallel/admin path.

### A.3 Deployment Architecture

**Primary target:** Netlify (static hosting with Netlify Functions)

- `netlify/functions/ai-config.mjs` — Lambda function for AI task config management (10s timeout)
- `netlify/functions/ai-maintenance.mjs` — Scheduled daily function for AI infrastructure cleanup (3:17 AM)
- `public/.htaccess` — Apache rewrite rules (legacy PHP fallback, kept for Laravel paths)
- `public/index.php` — Legacy PHP entry point
- Env vars: `.env.example` (public), `.env.ai.example` (server-side AI only)

**Build flow:**
1. `node scripts/write-public-config.mjs` writes runtime config
2. `astro build` generates static pages from Supabase data
3. Pages deployed to Netlify with functions for AI endpoints

### A.4 Data Flow

```
Supabase Postgres → (build-time public client read) → src/lib/content-repository.mjs 
  → src/lib/site-model.mjs (buildSiteModel) 
  → Astro page components → static HTML in dist/
```

The `loadContent()` function (`content-repository.mjs`) is the single entry point for all content. It supports test fixtures via `CONTENT_FIXTURE_PATH` (only when `NODE_ENV === 'test'`). The `buildSiteModel()` function produces an immutable, frozen model with join maps (`regionsBySlug`, `countriesBySlug`, `attractionsBySlug`, etc.).

---

## SECTION B — Database Map

### B.1 Supabase Schema (11 Migrations)

| Migration | Description |
|-----------|-------------|
| `20260401000100_create_trek_africa_cms.sql` | Base schema: 8 content tables (regions, countries, attractions, accommodations, restaurants, tour_operators, site_settings, page_sections), districts, booking_offers, `users`/`password_reset_tokens`/`sessions` (Laravel-compatible), storage buckets, `set_updated_at()` trigger, RLS enablement with broad public-read policies |
| `20260517000100_create_supplier_marketplace.sql` | Supplier marketplace: `supplier_profiles`, `supplier_products`, `supplier_bookings`, `supplier_payouts`, `supplier_reviews`, `supplier_notifications`, `supplier_notification_outbox`, `supplier_commission_settings`; commission triggers, booking notification triggers; storage buckets `supplier-media` and `supplier-documents` |
| `20260606000100_add_cms_write_policies.sql` | INSERT/UPDATE/DELETE policies for all 8 content tables for authenticated users (transitory — later replaced) |
| `20260607000100_seed_auth_user.sql` | Seeds admin auth user `shakesdigital@gmail.com` / password `root` |
| `20260829000200_add_districts_booking_offers.sql` | `districts` table (country-scoped), `booking_offers` table (polymorphic), RLS policies |
| `20260830000100_harden_cms_content_and_roles.sql` | **Key migration:** `profiles` table with roles, `private.has_cms_role()` security-definer function, `public.is_admin()` wrapper; adds status/published_at/meta_* columns to all content tables; creates `media_assets` table with polymorphic relations; replaces broad policies with role-based policies |
| `20260908000100_add_media_library_metadata.sql` | Adds media_type/source_type/mime_type/file_size/duration/poster_url/caption/transcript to media_assets |
| `20260930000100_add_activities_and_travel_articles.sql` | `activities` table (FK to attractions), `travel_articles` table, seeded examples, RLS policies |
| `20261002102519_add_ai_infrastructure.sql` | AI tables: `ai_task_config`, `ai_jobs`, `ai_request_attempts`, `ai_cache`; service-role-only mutations; `ai_usage_summary()` and `cleanup_ai_infrastructure()` functions |

### B.2 Table Inventory (25 tables)

**Core content tables (8):**
1. `regions` (id, slug, name, hero_title, hero_text, overview, countries_intro, hero_image_url, hero_image_alt, gallery[jsonb], sort_order, status, published_at, meta_*, timestamps)
2. `countries` (id, region_id→regions, slug, name, hero_title, hero_text, overview, access_summary, best_time, planning_tips, hero_image_url, hero_image_alt, gallery[jsonb], sort_order, status, published_at, meta_*, timestamps)
3. `attractions` (id, region_id, country_id, slug, name, location_name, hero_image_url, hero_image_alt, gallery[jsonb], listing_summary, detail_intro, full_description, getting_there, best_time, practical_info, highlights[jsonb], rating, review_count, price_label, booking_url, featured, sort_order, status, published_at, meta_*, timestamps)
4. `accommodations` (id, region_id, country_id, attraction_id, slug, name, property_type, location_name, hero_image_url, hero_image_alt, gallery[jsonb], listing_summary, detail_intro, practical_info, amenities[jsonb], rating, review_count, price_label, booking_url, featured, sort_order, status, published_at, meta_*, timestamps)
5. `restaurants` (id, region_id, country_id, attraction_id, slug, name, cuisine, location_name, signature_dish, hero_image_url, hero_image_alt, gallery[jsonb], listing_summary, detail_intro, practical_info, rating, review_count, price_label, booking_url, featured, sort_order, status, published_at, meta_*, timestamps)
6. `tour_operators` (id, region_id, country_id, attraction_id, slug, name, summary, website_url, booking_url, hero_image_url, hero_image_alt, specialties[jsonb], timestamps)
7. `districts` (id, country_id, slug, name, overview, aliases[jsonb], sort_order, timestamps) — FK: country_id
8. `page_sections` (id, page_key, section_key, module_type, eyebrow, title, body, image_url, meta[jsonb], sort_order, status, published_at, timestamps)
9. `site_settings` (id, group_name, key, value, is_public, timestamps) — key unique

**Booking / commerce tables (2):**
10. `booking_offers` (id, offerable_type[text], offerable_id[bigint], provider, label, source_url, stay22_provider, affiliate_supported, price_amount[numeric], price_currency[char(3)], price_unit, price_checked_at[date], price_basis, active, sort_order, timestamps)
11. `tour_operators` (covered above)

**Media table (1):**
12. `media_assets` (id, mediable_type[text], mediable_id[bigint], role, local_path, url, alt_text, source_page, creator, license, license_url, exact_subject_match, attribution_text, media_type, source_type, mime_type, file_size, width, height, duration_seconds, poster_url, caption, transcript, status, published_at, sort_order, timestamps)

**New content tables (2):**
13. `activities` (id, attraction_id→attractions, slug, name, location_name, listing_summary, detail_intro, full_description, highlights[jsonb], best_time, practical_info, hero_image_url, hero_image_alt, gallery[jsonb], booking_url, source_url, featured, sort_order, status, published_at, meta_*, timestamps)
14. `travel_articles` (id, slug, title, category, region, country, excerpt, body, read_time, hero_image_url, hero_image_alt, video_url, source_url, featured, sort_order, status, published_at, meta_*, timestamps)

**AI infrastructure tables (4):**
15. `ai_task_config` (task_type PK, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds, updated_by→auth.users, timestamps)
16. `ai_jobs` (id UUID PK, task_type, status enum, provider, model, started_at, finished_at, duration_ms, attempts, input_tokens, output_tokens, usage_complete, error_code, error_message)
17. `ai_request_attempts` (job_id→ai_jobs, attempt, task_type, provider, model, status, started_at, finished_at, input_tokens, output_tokens, http_status, error_code, error_message)
18. `ai_cache` (cache_key PK[64-char hex], result_text[max 128k], expires_at, created_at)

**Auth tables (3):**
19. `profiles` (id→auth.users, role, display_name, timestamps) — roles: super_admin, admin, editor, viewer
20. `users` (Laravel-compatible: id, name, email, email_verified_at, password, role, remember_token, timestamps)
21. `password_reset_tokens` (email PK, token, created_at)
22. `sessions` (id PK, user_id→users, ip_address, user_agent, payload, last_activity)

**Supplier marketplace tables (8):**
23. `supplier_commission_settings` (id, setting_key unique, rate, description, timestamps)
24. `supplier_profiles` (id UUID PK, user_id→auth.users, business_name, provider_kind, provider_type, contact_name, contact_email, phone, website_url, locations[jsonb], registration_tax_number, payout_method, bank_details[jsonb], mobile_money_details[jsonb], liability_insurance_path, logo_path, profile_photo_path, status enum, commission_rate, approved_at, rejected_at, admin_notes, timestamps)
25. `supplier_products` (id UUID PK, supplier_id, country_id, title, slug, service_type enum, category, status enum, booking_mode enum, affiliate_url, description, highlights[jsonb], itinerary[jsonb], included[jsonb], excluded[jsonb], duration, min_group_size, max_group_size, languages[jsonb], meeting_point, base_price, currency, pricing_tiers[jsonb], availability[jsonb], photos[jsonb], videos[jsonb], commission_rate, published_at, timestamps)
26. `supplier_bookings` (id UUID PK, supplier_product_id, booking_reference, status enum, customer details, total_amount, commission_amount, payout_status, timestamps)
27. `supplier_payouts` (id UUID PK, supplier_id, period_start, period_end, amount, status enum, paid_at, notes, timestamps)
28. `supplier_reviews` — supplier product reviews
29. `supplier_notifications` — notification templates
30. `supplier_notification_outbox` — pending notification queue

**Storage buckets (5):**
- `media` (public) — regions, countries, attractions, accommodations, restaurants, tour_operators, page_sections
- `branding` (public) — logos
- `supplier-media` (public) — supplier product media
- `supplier-documents` (private) — supplier docs

### B.3 Relationships

```
regions
  └── countries (region_id)
        └── attractions (country_id, region_id)
              ├── activities (attraction_id)
              ├── accommodations (attraction_id, country_id, region_id)
              ├── restaurants (attraction_id, country_id, region_id)
              ├── tour_operators (attraction_id, country_id, region_id)
              └── booking_offers (polymorphic: offerable_type, offerable_id)
        ├── districts (country_id)
        └── accommodations/restaurants/tour_operators (district_id)

media_assets (polymorphic: mediable_type, mediable_id)
  └── links to any content entity

travel_articles (no FK — standalone editorial)

supplier_profiles (user_id → auth.users)
  └── supplier_products (supplier_id, country_id)
        └── supplier_bookings (supplier_product_id)

ai_jobs
  └── ai_request_attempts (job_id)
```

### B.4 Index Map

- `idx_countries_region_id` on countries(region_id)
- `idx_attractions_region_id`, `idx_attractions_country_id`
- `idx_accommodations_country_id`, `idx_accommodations_attraction_id`
- `idx_restaurants_country_id`, `idx_restaurants_attraction_id`
- `idx_tour_operators_country_id`, `idx_tour_operators_attraction_id`
- `idx_booking_offers_offerable` on booking_offers(offerable_type, offerable_id)
- `idx_booking_offers_provider_active` on booking_offers(provider, active)
- `idx_media_assets_mediable_role` on media_assets(mediable_type, mediable_id, role)
- `activities_attraction_idx` on activities(attraction_id, sort_order)
- `travel_articles_publication_idx` on travel_articles(status, published_at, featured, sort_order)
- `ai_jobs_task_started_idx`, `ai_jobs_started_idx`, `ai_jobs_running_idx`
- `ai_attempts_usage_idx` on ai_request_attempts(started_at, provider, model)
- `ai_cache_expiry_idx` on ai_cache(expires_at)

---

## SECTION C — Content Map

### C.1 Content Types (13 tables loaded by `TABLE_NAMES` array in `content-repository.mjs`)

| Table | Type | Public Read Policy | Fields |
|-------|------|--------------------|--------|
| `regions` | Hierarchical container | `status='published' AND published_at <= now()` | slug, name, hero_title, hero_text, overview, gallery, sort_order |
| `countries` | Destination | Same RLS | All region fields + region_id FK |
| `districts` | Sub-region | `using (true)` — fully public | country_id FK, slug, name, overview, aliases, sort_order |
| `attractions` | POI / attraction | Same RLS | Full text fields, highlights[jsonb], rating, booking_url |
| `activities` | Sub-attraction | Same RLS | attraction_id FK, booking_url, source_url |
| `travel_articles` | Editorial | Same RLS | body (HTML), video_url, category, region, country |
| `accommodations` | Stay | Same RLS | property_type, amenities[jsonb], attraction_id FK |
| `restaurants` | Dining | Same RLS | cuisine, signature_dish, attraction_id FK |
| `tour_operators` | Guide | None specified in harden migration (inherits from base migration) | website_url, booking_url, specialties[jsonb] |
| `booking_offers` | Affiliate link | `active = true` | Polymorphic (offerable_type, offerable_id), provider, price fields |
| `site_settings` | Global config | `is_public = true` | group_name, key (unique), value |
| `page_sections` | Modular page content | Same RLS | page_key, section_key, module_type, meta[jsonb] |
| `media_assets` | Media metadata | Same RLS | Polymorphic (mediable_type, mediable_id), role, attribution fields |

### C.2 Publication Model

**Status field:** `draft` | `published` — on all content tables (added by `20260830` harden migration)

**Published_at filter:** `published_at IS NULL OR published_at <= now()` — applied at both RLS policy level and `visibleAt()` client-side filter in `content-repository.mjs`

**Client-side enforcement:** `src/lib/content-repository.mjs` `visibleAt()` / `visibleRecords()` functions filter records after loading, providing defense-in-depth.

**Seed data:** All seeded content is published with `status='published'` and `published_at=now()`.

### C.3 Content Hierarchy

```
Region (East Africa, West Africa, Southern Africa, Northern Africa)
  └── Country (Uganda, Kenya, Tanzania, Rwanda, Ethiopia, Ghana, Senegal, Benin, Sierra Leone, Cabo Verde, South Africa, Botswana, Namibia, Zimbabwe, Zambia, Morocco, Egypt, Tunisia, Algeria)
      ├── District (auto-seeded as "primary-district" for each country)
      ├── Attraction (24 total: Bwindi, Maasai Mara, Serengeti, Cape Town, etc.)
      │   ├── Activity (11 total: balloon safaris, gorilla trekking, game drives, etc.)
      │   ├── Accommodation (24 total: lodges, hotels, camps)
      │   ├── Restaurant (24 total: dining at attractions)
      │   ├── Tour Operator (19 total: one per country)
      │   └── Booking Offer (polymorphic, 48+ seeded: Booking.com for stays, GetYourGuide for attractions)
      └── Travel Article (10 total: planning guides, safety, cultural tips)
```

### C.4 Site Settings

Seeded `site_settings` with `is_public=true`:
- `general.site_name` = "Trek Africa Guide"
- `general.site_tagline` (varies between seeds)
- `branding.primary_color` = #284932
- `branding.secondary_color` = #c56b3d
- `branding.accent_color` = #c5b580
- `seo.default_meta_description`

### C.5 Page Sections (Modular Content)

Seeded `page_sections` with `page_key` + `section_key`:
- `home` → `hero`, `intro`, `featured_regions`, `featured_attractions`, `featured_accommodations`, `featured_restaurants`
- `travel-insights` → `hero`
- `activities` → `hero`
- `regions` → index pages
- `countries` → index pages

Each has: eyebrow, title, body, image_url, module_type, meta[jsonb], sort_order

### C.6 Media System

**Two parallel systems:**

1. **Supabase Storage (`media_assets` table + `media`/`branding` buckets):**
   - 72+ seeded media assets with CC-BY-SA attribution
   - Each has: source_page (Wikimedia URL), creator, license, license_url, exact_subject_match, attribution_text
   - `hero_image_url` on entities points to `/images/stock/destinations/{slug}.jpg` (local path)
   - `url` field mirrors `local_path` in seed

2. **Image-slot system (`src/lib/images.mjs`):**
   - `SLOT_MAP`: maps keys like `home-hero-east-africa` → `maasai-mara` → `/images/stock/destinations/maasai-mara.jpg`
   - `resolveImage()`: resolves `image-slot:KEY` to stock path, with fallback chains for country/attraction/stay prefixes
   - `pickHero()` / `pickGallery()`: priority-based image selection
   - Used in `ImageSlot.astro` component

3. **Photo defaults library (`src/lib/photo-library.js` + `photo-defaults.mjs`):**
   - 74KB curated image library with source_page, creator, license, license_url, sha256, exact_subject, property flag
   - `applyPhotoDefaults()`: only overrides editor empty values, never replaces existing images
   - Organized by table/slug in `images` and `listings` sections

### C.7 Restaurants Status

- **`RESTAURANTS_ENABLED = false`** in `src/config/site.mjs`
- No restaurants listing page or detail pages in `src/pages/`
- Restaurant data is loaded, joined, and present in seed (24 restaurants)
- `BookingOffers.astro` component handles `offerable_type: 'restaurant'`
- Restaurants appear in seed CMS content and Laravel controllers
- The `20260606000100_add_cms_write_policies.sql` migration title mentions "restaurants support"
- **Conclusion:** Restaurants data exists but the public Astro routes are disabled pending full listing page implementation

---

## SECTION D — CMS Map

### D.1 Standalone CMS (`cms.html` + asset files)

A 2,352-line standalone static HTML application that authenticates directly against Supabase Auth.

**Files:**
- `public/cms.html` (113KB) — full CMS UI
- `public/cms-core.js` (15KB) — pure runtime rules (publication timing, image-slot resolution, validation)
- `public/cms-schema.js` (29KB) — field definitions and schema
- `public/cms-sync.js` (43KB) — sync logic (Supabase → CMS state)
- `public/photo-defaults.js` (1KB) — photo defaults for CMS
- `public/photo-library.js` (74KB) — master image library

**CMS Features:**
- Direct Supabase Auth login (email/password)
- Dashboard with tabs: overview, regions, countries, attractions, accommodations, restaurants, tour operators, page sections, settings, media
- Full CRUD for all content entities
- Draft/published status toggle with `published_at` scheduling
- Image upload to Supabase Storage buckets (media, branding)
- Hero image and gallery management
- Booking offer management (provider, affiliate URL, price fields)
- Meta fields (meta_title, meta_description, meta_image_url)
- Search and filtering
- Image-slot selection for page sections

**Authentication:** Uses `@supabase/supabase-js@2` loaded from CDN, authenticates against Supabase Auth with JWT persisted to `localStorage`.

**Validation:** `cms-core.js` contains `isVisible()` and `visibleRecords()` functions mirroring the build-time `visibleAt()` logic. The CMS validates slug format, required fields, and publication timing.

### D.2 Role-Based Access Control

| Role | Description |
|------|-------------|
| `super_admin` | Full access — can manage profiles, all content, all settings |
| `admin` | Full content management, cannot manage profiles |
| `editor` | Insert/update drafts only — can create content but cannot publish |
| `viewer` | Read-only access to all CMS content |

**Implementation:** `private.has_cms_role(text[])` security-definer function checks the `profiles` table joined to `auth.uid()`. Revoked from `public`, granted to `authenticated`. The `public.is_admin()` wrapper is also available.

### D.3 Admin Routes (Laravel)

`src/Http/Controllers/AdminController.php` provides:
- `GET /admin?tab={resource}` — dashboard view with all data pre-loaded
- `POST /admin/{resource}` — save (create/update)
- `DELETE /admin/{resource}/{record}` — delete
- Resources: regions, countries, attractions, accommodations, restaurants, tour-operators, page-sections, settings, booking-offers
- Validation rules per resource (Laravel FormRequest pattern)
- File uploads to Supabase Storage via `SupabaseStorageService`
- `mergeUploads()` handles hero_image_file, gallery_files, image_file, logo_file
- `normalizePayload()` converts text inputs to JSON arrays for gallery, highlights, amenities, specialties

**Auth:** `Auth\AdminAuthController.php` — Laravel session-based admin auth against the legacy `users` table (separate from Supabase Auth).

**Note:** The Laravel admin and Supabase CMS are two separate admin systems. The Laravel admin is session-based and backed by the legacy `users` table; the Supabase CMS is JWT-based against `auth.users` + `profiles`.

### D.4 Content Creation Flow

1. Editor logs into `cms.html` via Supabase Auth
2. Navigates to a content tab (e.g., attractions)
3. Creates/edits records with draft status
4. Sets `published_at` and toggles to "published"
5. Uploads images to Supabase Storage (validated folder structure)
6. All changes stored in Supabase Postgres via RLS policies

---

## SECTION E — AI Integration Map

### E.1 AI Infrastructure (4 tables, 2 functions, 2 Netlify functions)

**Tables:**

1. **`ai_task_config`** (config table):
   - `task_type` (PK, regex `^[a-z][a-z0-9_]{0,63}$`)
   - `enabled` (boolean, default false)
   - `provider` (text, regex `^[a-z][a-z0-9_-]{0,39}$`)
   - `model` (text, max 160 chars)
   - `timeout_ms` (integer, 1000-25000)
   - `max_retries` (integer, 0-2)
   - `max_output_tokens` (integer, 1-8192)
   - `cache_ttl_seconds` (integer, 0-3600)
   - `updated_by` (FK to auth.users)
   - **No tasks seeded** — all disabled by default

2. **`ai_jobs`** (operation ledger):
   - UUID PK, task_type, status enum (running/completed/failed/timed_out/cancelled/cached), provider, model
   - Timing: started_at, finished_at, duration_ms
   - Token tracking: input_tokens, output_tokens, usage_complete
   - Error tracking: error_code (max 64), error_message (max 200)
   - Max 3 attempts per job

3. **`ai_request_attempts`** (per-attempt audit):
   - Composite PK: (job_id, attempt)
   - All provider/model/status/timing fields
   - `http_status` for debugging provider responses

4. **`ai_cache`** (public-content cache):
   - `cache_key` (PK, 64-char hex — HMAC-SHA256)
   - `result_text` (max 128,000 chars)
   - `expires_at`, `created_at`
   - Cache keys include: config, adapter, endpoint, public_cache_version, messages

**Functions:**
- `ai_usage_summary()` — 30-day usage aggregation (day, task_type, provider, model, operations, cached_operations, failed_operations, attempts, token counts)
- `cleanup_ai_infrastructure()` — service-role only: marks stale running jobs as timed_out, deletes expired cache and old jobs

### E.2 Server-Side AI Logic (`server/ai/`)

| File | Responsibility |
|------|----------------|
| `service.mjs` | `createAIService()` — main execution engine. Input schema: zod (task_type, messages max 64000 chars each, max 40 messages, total ≤ 64000 chars). Retry logic with exponential backoff (250ms, 500ms, 1000ms cap). Cache-aside pattern. Job lifecycle management. |
| `config.mjs` | `readServerConfig()` — validates `AI_PROVIDERS_JSON` env var. Enforces HTTPS endpoints, blocks localhost/internal addresses. `validateTask()` checks model is in provider's allowed list. |
| `providers.mjs` | Adapters for `openai-compatible` and `anthropic`. HTTP status mapping: 429→RATE_LIMITED, 401/403→PROVIDER_AUTH. 512KB response body limit, 128000 char result limit. |
| `admin.mjs` | `createAdminHandler()` — GET lists task configs + provider info; PUT upserts with optimistic locking (`expected_updated_at`). `requireAdmin()` checks Bearer token → auth.users → profiles.role. Error mapping: UNAUTHORIZED→401, FORBIDDEN→403, INVALID_REQUEST→400, CONFLICT→409. |
| `errors.mjs` | `AIError` codes: 15 codes covering INVALID_REQUEST, DISABLED, CONFIGURATION, UNAUTHORIZED, FORBIDDEN, CONFLICT, TIMEOUT, CANCELLED, RATE_LIMITED, PROVIDER_ERROR, PROVIDER_AUTH, INVALID_RESPONSE, STORAGE_ERROR, INTERNAL_ERROR. `bounded()` timeout wrapper. |
| `store.mjs` | `createServerClient()` — service-role client, HTTPS only, 3s fetch timeout. `createStore()` — wraps ai_jobs, ai_request_attempts, ai_task_config, ai_cache CRUD. Checked queries with `.single()` enforcement. |

### E.3 Netlify Functions

1. **`netlify/functions/ai-config.mjs`** — wraps `createAdminHandler` with 10s timeout. Handles GET (list configs/usage) and PUT (upsert task config).

2. **`netlify/functions/ai-maintenance.mjs`** — scheduled function (3:17 AM daily via Netlify's `schedule` event). Calls `cleanup_ai_infrastructure()`. Disabled unless `AI_MAINTENANCE_ENABLED=true`.

### E.4 Environment Variables (`.env.ai.example`)

```
AI_ENABLED=false              # Master kill switch
AI_MAINTENANCE_ENABLED=false  # Scheduled cleanup toggle
SUPABASE_URL=...              # Required for server client
SUPABASE_SERVICE_ROLE_KEY=... # Service-role only (never in build env)
AI_PROVIDERS_JSON=...         # Provider config (primary: OpenAI-compatible, secondary: Anthropic)
AI_PRIMARY_KEY=...            # OpenAI API key
AI_SECONDARY_KEY=...          # Anthropic API key
AI_CACHE_HMAC_KEY=...         # ≥32 random chars, required for caching
```

**Provider config format:**
```json
{
  "primary": {"adapter": "openai-compatible", "endpoint": "https://api.openai.com/v1/chat/completions", "apiKeyEnv": "AI_PRIMARY_KEY", "models": ["REPLACE_WITH_SUPPORTED_MODEL"]},
  "secondary": {"adapter": "anthropic", "endpoint": "https://api.anthropic.com/v1/messages", "apiKeyEnv": "AI_SECONDARY_KEY", "models": ["REPLACE_WITH_SUPPORTED_MODEL"]}
}
```

### E.5 Security Model

- **All AI mutations run via service_role** — direct table grants revoked from public/authenticated
- RLS policies on all AI tables: `authenticated` can SELECT (read), but only `admin`/`super_admin` (via `has_cms_role`)
- All writes go through `service.mjs` which validates against server config
- No API keys or prompts stored in any table (explicitly documented: "This is an operation ledger, not a research queue. No prompts or outputs are logged.")
- Cache keys are HMAC-SHA256 hashes (not raw prompts)
- Cache is "explicitly public-content-only" — keyed by input messages but stored results are meant for public display

### E.6 Current Status

- **Not enabled:** `AI_ENABLED=false`, `AI_MAINTENANCE_ENABLED=false`
- **No task configs exist** — migration explicitly states "Deliberately no enabled tasks, API keys, models, or provider endpoints seeded"
- **No consumers** — no Astro pages or Laravel views currently call the AI service
- **Infrastructure is ready** but dormant: schema, server logic, admin handler, and Netlify functions all exist

---

## SECTION F — Booking / Affiliate Map

### F.1 Stay22 Integration

**Implementation:** `src/lib/booking.mjs`

```javascript
const DEFAULT_AFFILIATE_ID = '6a809892f76b8b75f2a2e6a4';
const DEFAULT_MAX_AGE_DAYS = 90;
const SUPPORTED_PROVIDERS = new Set([
  'booking', 'expedia', 'hotelscom', 'vrbo', 'agoda',
  'tripadvisor', 'kayak', 'getyourguide', 'roam', 'searchbar'
]);
```

**`buildStay22Url({ listing, offer, search, affiliateId })`:**
- Generates: `https://www.stay22.com/allez/{provider}?aid={affiliateId}&hotelname={name}&campaign={type}_{slug}&link={sourceUrl}&checkin=...&checkout=...&adults=...`
- Provider mapped from `offer.stay22_provider` (default: 'roam')
- Falls back to `offer.source_url` or `listing.booking_url` if provider unsupported
- All URLs pass through `safeExternalUrl()` which rejects non-http(s) protocols

**`isOfferFresh(offer, now, maxAgeDays=90)`:**
- Validates all price fields present: `price_amount`, `price_currency`, `price_unit`, `price_basis`, `price_checked_at`
- Checks `price_checked_at` is within 90 days of current time (not in future)
- **No seeded offers have price data** — all seed offers have `price_amount=NULL`, `price_checked_at=NULL`

**`offerPresentation()`:**
- Returns: `{ href, label, priceLabel, rel, target: '_blank', disclosure, affiliateSupported }`
- `rel: 'nofollow sponsored noopener'` when `affiliate_supported=true`, else `'nofollow noopener'`
- Disclosure text: "Trek Africa Guide does not take payment on this page. Check current details on the provider site."
- Price label shows "From $X per night" if fresh, or "Check current details on the provider site" if stale

### F.2 Booking Offers (Database)

**Schema:** `booking_offers` table (polymorphic)
- `offerable_type`: text ('accommodation', 'attraction', 'activity', etc.)
- `offerable_id`: bigint
- `provider`: text (e.g., 'booking', 'getyourguide')
- `label`: text (e.g., "Compare on Booking.com", "Find activities")
- `source_url`: text (provider URL)
- `stay22_provider`: text (maps to Stay22 provider parameter)
- `affiliate_supported`: boolean
- `price_amount/currency/unit/basis/checked_at`: pricing data (all NULL in seed)
- `active`: boolean (filtered in loadContent)
- `sort_order`: integer

**Seeded offers (48 total):**
- 24 accommodations → Booking.com (`stay22_provider='roam'`, `affiliate_supported=true`)
- 24 attractions → GetYourGuide (`affiliate_supported=true`, `stay22_provider` not set → defaults to 'roam')

### F.3 Booking Link Rendering

**In `BookingOffers.astro` component:**
- Iterates `offers` prop, calls `offerPresentation()` for each
- Renders as full-width buttons with `target="_blank"` and `rel="nofollow sponsored noopener"`
- Includes disclosure text and trust notes
- **Only used on attraction pages** — accommodation detail pages do not yet have detail pages in `src/pages/accommodations/`

**In `activities/[slug].astro`:**
- Uses direct `safeExternalUrl(activity.booking_url)` link instead of `BookingOffers` component
- Renders "Book this activity ↗" button with `rel="nofollow noopener noreferrer"`
- Fallback message if no booking URL: "No verified bookable provider listing is currently linked"

### F.4 Missing Pricing Data

**Critical gap:** No seeded booking offers contain price data (`price_amount`, `price_currency`, `price_unit`, `price_basis`, `price_checked_at` all NULL). The `isOfferFresh()` check returns `false` for all offers, so all price labels show "Check current details on the provider site."

### F.5 Booking Model

The `booking_offers` table references `stay22_provider` but the `activities` table also has a direct `booking_url` field that is used in the activity detail page. This creates two parallel booking URL systems:
1. `booking_offers` — polymorphic offers with Stay22 wrapping
2. `activities.booking_url` / `attractions.booking_url` / `accommodations.booking_url` — direct provider URLs

**Accommodation detail pages do not exist** in `src/pages/accommodations/` — only `index.astro` (listing). Accommodations appear only in `ListingCard` components linking to their `internalUrl` (`/accommodations/{slug}`), but that route doesn't exist yet.

---

## SECTION G — Recommended AI Architecture

### G.1 Current State Assessment

The AI infrastructure is **fully built but dormant**:
- Schema exists (4 tables + 2 functions)
- Server logic exists (6 files in `server/ai/`)
- Netlify Functions exist (2 endpoints)
- Environment template exists (`.env.ai.example`)
- **Zero task configs seeded, AI_ENABLED=false**

### G.2 Recommended Implementation Plan

**Phase 1 — Activate with a single task type:**

1. **Seed an initial task config** (via direct SQL or admin API):
   ```sql
   INSERT INTO public.ai_task_config 
     (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
   VALUES 
     ('attraction_summary', true, 'primary', 'gpt-4o-mini', 15000, 1, 1024, 3600);
   ```

2. **Create a Netlify Function endpoint** that accepts attraction IDs and generates summaries:
   - `netlify/functions/ai-generate.mjs` — accepts POST with `{ task_type, listing_ids }`, reads from Supabase, calls `createAIService().run()`
   - Returns `{ job_id, text }` on success

3. **Wire into CMS:** Add a "Generate summary" button in `cms.html` for attraction records that calls the Netlify Function with the current attraction's `full_description`

4. **Cache strategy:** Use `public_cache_version` parameter tied to attraction `updated_at` so cached results invalidate when content changes

**Phase 2 — Expand task types:**

| Task Type | Purpose | Input | Cache Strategy |
|-----------|---------|-------|----------------|
| `attraction_summary` | Distill attraction full_description into listing_summary | 1 attraction | Cache key = content + version |
| `itinerary_suggestion` | Generate itinerary from country+duration | Country slug + days | Cache key = country + duration |
| `travel_tip` | Generate practical_info from attraction data | 1 attraction | Cache key = attraction slug |
| `meta_description` | Generate SEO meta from content | Page type + slug | Cache key = page + slug + version |

**Phase 3 — Admin integration:**

- Extend `ai-config.mjs` handler to support the new task types
- Add AI usage dashboard to `cms.html` — fetch from `ai_usage_summary()` RPC
- Add job status polling endpoint

### G.3 Design Principles

- **Server-side only:** AI calls must never go through the browser — all requests route through Netlify Functions using `SUPABASE_SERVICE_ROLE_KEY`
- **Input sanitization:** The zod schema in `service.mjs` already enforces message length limits (64000 chars total) — keep this
- **Cost control:** `max_retries: 1` default, `cache_ttl_seconds: 3600` for repeated content, `max_output_tokens: 1024` for summaries
- **Observability:** The `ai_jobs`/`ai_request_attempts` audit trail captures all usage — use `ai_usage_summary()` for cost monitoring
- **Error handling:** The 14 AIError codes provide structured error responses — the admin handler maps them to HTTP status codes

### G.4 Cache Hygiene

- Cache keys are HMAC-SHA256 of `{v:1, config, adapter, endpoint, version, messages}` — this means **any change to task config invalidates all cached entries for that task type**
- `public_cache_version` should be derived from content `updated_at` timestamps — e.g., `v1-attraction-{id}-{timestamp}`
- The 90-day cache expiry (`ai_cache_expiry_idx`) provides automatic cleanup via the scheduled maintenance function

---

## SECTION H — Database Changes

### H.1 Required Schema Additions

**1. Accommodation Detail Support (currently missing routes):**

No schema changes needed — `accommodations` table is complete with `property_type`, `amenities[jsonb]`, `practical_info`, `booking_url`, `rating`, `review_count`. The data exists but Astro detail pages don't.

**2. Activity Booking Offer Support:**

The `activities` table has a direct `booking_url` field but does not have entries in `booking_offers` table. To unify:

```sql
-- Add booking_offers for activities (currently only attractions and accommodations are seeded)
INSERT INTO public.booking_offers (offerable_type, offerable_id, provider, label, source_url, affiliate_supported, active, sort_order)
SELECT 'activity', id, 'getyourguide', 'Find activities', booking_url, true, true, 10
FROM public.activities 
WHERE booking_url IS NOT NULL 
AND NOT EXISTS (
  SELECT 1 FROM public.booking_offers 
  WHERE offerable_type = 'activity' AND offerable_id = activities.id
);
```

**3. Pricing Data for Booking Offers:**

No schema changes — the `booking_offers` table already has price fields. The gap is data population, not schema. A migration script would backfill `price_amount`, `price_currency`, `price_unit`, `price_checked_at`, `price_basis` from live provider APIs.

**4. Search Index Table:**

Currently search is client-side only (filtered from `window.trekSearchSuggestions`). For larger catalogs, add a server-side search table:

```sql
CREATE TABLE public.search_index (
  entity_type text NOT NULL,
  entity_id bigint NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  searchable tsvector NOT NULL,
  country text,
  region text,
  PRIMARY KEY (entity_type, entity_id)
);
CREATE INDEX idx_search ON public.search_idx USING gin(searchable);
```

**5. AI Content Metadata:**

Add fields to track AI-generated content provenance:

```sql
ALTER TABLE public.attractions 
  ADD COLUMN ai_summary_generated_at timestamptz,
  ADD COLUMN ai_summary_model text;
ALTER TABLE public.travel_articles 
  ADD COLUMN ai_writing_assisted boolean NOT NULL DEFAULT false,
  ADD COLUMN ai_model_used text;
```

### H.2 Indexing Recommendations

1. **Already present:** `idx_booking_offers_offerable` covers polymorphic lookups
2. **Missing:** Composite index on `(offerable_type, offerable_id, active)` for the common query pattern in `BookingOffers.astro`
3. **Present:** `travel_articles_publication_idx` covers the home page featured article query
4. **Missing:** Index on `countries.sort_order` for the regions page country listing

### H.3 Migration Conflict Risk

The dual Supabase + Laravel migration system creates a **synchronization risk**:
- `supabase/migrations/` — authoritative for the hosted Supabase project
- `database/migrations/2026_04_19_210000_create_trek_africa_cms_tables.php` — Laravel mirror
- These have diverged: Laravel version uses standard Laravel column types (`$table->id()`, `$table->string()`), while Supabase uses raw Postgres types (`bigint generated by default as identity`, `text`)
- The `20260830` harden migration added `profiles`, `status`, `published_at`, `meta_*` columns — verify these exist in the Laravel migration mirror

---

## SECTION I — Security

### I.1 Authentication

**Dual auth systems:**

1. **Supabase Auth (CMS):**
   - `auth.users` table with Supabase-managed auth
   - `profiles` table links to `auth.users(id)` with role (super_admin, admin, editor, viewer)
   - Seeded admin user: `shakesdigital@gmail.com` / password `root` (in `20260607000100_seed_auth_user.sql`)
   - Security-definer function `private.has_cms_role()` checks role from `profiles` table

2. **Laravel Auth (legacy admin):**
   - `users` table with bcrypt-hashed passwords (`$2y$12$...` format)
   - Seeded user: `admin@trekafricaguide.com` / password `root` (in `supabase/seed/20260401000200_seed_trek_africa_launch.sql`)
   - Session-based auth via Laravel's built-in auth system
   - **These are two different `users` tables** — Supabase's `auth.users` vs. the public `users` table in the base migration

**Risk: The seeded admin password `root` is weak and should be changed immediately after deployment.**

### I.2 Authorization (RLS Policies)

**Role hierarchy:**
```
anon  → read published content only (status='published' AND published_at <= now())
authenticated → read all published + draft (via role check), write drafts (editor+)
editor  → insert/update drafts only
admin  → full CRUD on all content
super_admin → full CRUD + manage profiles
```

**Policy pattern (applied via dynamic SQL in harden migration):**
- Public read: `status = 'published' AND (published_at IS NULL OR published_at <= now())`
- CMS staff read: `private.has_cms_role(array['viewer','editor','admin','super_admin'])`
- Editor insert/update: `private.has_cms_role(array['editor']) AND status = 'draft'`
- Admin full: `private.has_cms_role(array['admin','super_admin'])`

**Storage policies:** Folder-structure validation enforces `media/{table}/{slug}/` pattern. Branding uploads restricted to `branding/logos/` and require admin/super_admin.

### I.3 Environment Variable Security

**Build environment (`src/lib/env.mjs`):**
- Only reads: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (with `SUPABASE_ANON_KEY` fallback), `STAY22_AFFILIATE_ID`, `SITE_URL`, `NETLIFY_SITE_ID`, `NETLIFY_DEPLOY_HOOK`
- **Explicitly forbids service_role key** — `readBuildEnv()` does not read it
- Zod-validated with HTTPS enforcement for URLs

**Server environment (`.env.ai.example`):**
- Reads `SUPABASE_SERVICE_ROLE_KEY` (for AI operations)
- Reads `AI_PROVIDERS_JSON` with provider config
- Reads API keys from env (`AI_PRIMARY_KEY`, `AI_SECONDARY_KEY`)
- `AI_CACHE_HMAC_KEY` required for caching (≥32 chars)

**Leak prevention:**
- Build env: service_role key forbidden
- Server env: not exposed to frontend (no `PUBLIC_` prefix)
- CMS HTML loads supabase-js from CDN — runs entirely in browser, uses publishable key only

### I.4 Content Sanitization

**HTML sanitization:** `src/lib/content-html.mjs` uses `sanitize-html` 2.17.5 with:
- Allowed tags: p, br, strong, em, b, i, u, ul, ol, li, h2, h3, blockquote, a
- Allowed attributes: a → href, target, rel
- Allowed schemes: http, https, mailto
- All links get `target="_blank" rel="noopener noreferrer"`
- Used only in `activities/[slug].astro` and `travel-insights/[slug].astro`

**URL safety:** `safeExternalUrl()` rejects non-http(s) protocols, preventing `javascript:` and `data:` attacks

### I.5 Input Validation

- **Slug validation:** `assertRouteSlug()` in site-model.mjs enforces `^[a-z0-9]+(?:-[a-z0-9]+)*$` — prevents path traversal
- **Image slot resolution:** `resolveImage()` only accepts `image-slot:` prefix strings, maps to predefined SLOT_MAP
- **Search suggestions:** Injected as JSON via `define:vars`, filtered client-side — no injection risk
- **AI input schema:** zod validation enforces message length (64000 chars max per message, 64000 total), max 40 messages, requires at least one user message

### I.6 Identified Vulnerabilities

1. **Weak seeded credentials:** Admin password `root` in two systems
2. **No rate limiting** on Supabase Auth login (susceptible to brute force)
3. **Netlify function timeout:** 10s on ai-config — may be insufficient for complex admin operations
4. **Client-side search:** All content visible in browser search — could be replaced with server-side for better performance and access control
5. **Restaurants disabled** but data exists — inconsistent state between data and UI

---

## SECTION J — Risks

### J.1 Critical Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **Service role key exposure** | Critical | `.env.ai.example` documents `SUPABASE_SERVICE_ROLE_KEY` — if this leaks to the browser or is committed, all data is exposed | Verify env vars are server-only, use Netlify Function secrets, never commit actual keys |
| **Weak admin credentials** | Critical | Seeded password `root` in both auth systems — trivially guessable | Immediately rotate after deployment, enforce password complexity |
| **Dual migration drift** | High | Supabase and Laravel migrations have diverged — schema changes may apply to one but not both | Establish a single source of truth or automated parity check |

### J.2 High Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **Missing accommodation detail pages** | High | Accommodations have `internalUrl` set to `/accommodations/{slug}` but no `[slug].astro` exists — listing cards link to 404 | Create detail page template |
| **Missing restaurant listing/detail pages** | High | `RESTAURANTS_ENABLED=false` but data exists — orphaned content | Either implement routes or remove flag |
| **Empty price data** | Medium | All booking offers have NULL price fields — `isOfferFresh()` returns false, no prices displayed | Backfill from provider APIs |
| **AI infrastructure dormant** | Medium | All AI features exist but disabled, no task configs, no consumers | Seed initial task config, wire into CMS |

### J.3 Medium Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **Large image files** | Medium | `public/` contains 9.6MB PNG and 3.8MB PNG — impacts build/deploy time | Optimize and compress |
| **No structured logging** | Medium | AI service logs errors to console only | Integrate with Netlify/observability |
| **Client-side search scalability** | Medium | Search suggestions embedded in every page — grows with content | Implement server-side search API for >500 entities |
| **Hardcoded affiliate ID** | Medium | `DEFAULT_AFFILIATE_ID` hardcoded in 3 files — changing requires rebuild | Move to env or Supabase setting |

### J.4 Low Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **`.htaccess` present** | Low | Apache config in `public/` for Netlify — unnecessary for static hosting | Remove if not using Apache fallback |
| **`dist/` is checked in** | Low | 27 files pre-built in `dist/` — may conflict with CI builds | Add to `.gitignore` |
| **Photo credits page exists** | Low | `src/pages/photo-credits.astro` exists but content may be incomplete | Verify all 72+ media assets are credited |

---

## SECTION K — Implementation Plan

### K.1 Phase 1: Fix Broken Routes (Priority: Critical)

**Task K.1.1:** Create `src/pages/accommodations/[slug].astro`
- Mirror `attractions/[slug].astro` structure
- Include property_type, amenities list, practical_info
- Use `BookingOffers` component for booking links
- Show nearby attractions

**Task K.1.2:** Decide on restaurants routing
- Option A: Create `src/pages/restaurants/index.astro` and `[slug].astro`, set `RESTAURANTS_ENABLED=true`
- Option B: Remove restaurant data from Astro pipeline entirely

### K.2 Phase 2: Enhance Booking (Priority: High)

**Task K.2.1:** Backfill booking offer prices
- Create a one-off script that reads `booking_offers.source_url` and fetches current prices from providers
- Populate `price_amount`, `price_currency`, `price_unit`, `price_basis`, `price_checked_at`
- Run periodically via cron or Netlify scheduled function

**Task K.2.2:** Add booking offers for activities
- Activities have direct `booking_url` but no entries in `booking_offers` table
- Either add offers or route activities through `safeExternalUrl()` only (current approach)

### K.3 Phase 3: Activate AI (Priority: Medium)

**Task K.3.1:** Seed initial AI task configs
```sql
INSERT INTO public.ai_task_config (task_type, enabled, provider, model, ...) VALUES
  ('attraction_summary', true, 'primary', 'gpt-4o-mini', 15000, 1, 1024, 3600),
  ('itinerary_suggestion', true, 'primary', 'gpt-4o-mini', 20000, 1, 2048, 7200),
  ('meta_description', true, 'primary', 'gpt-4o-mini', 10000, 1, 512, 3600);
```

**Task K.3.2:** Create `netlify/functions/ai-generate.mjs`
- Accept POST: `{ task_type, listing_type, listing_slug }`
- Load content from Supabase (service role)
- Call `createAIService().run()` with appropriate prompt
- Return `{ job_id, text, cached }`

**Task K.3.3:** Add AI generation button to `cms.html`
- In attraction edit form: "Generate listing_summary from full_description"
- Calls `ai-generate` function, displays result in textarea
- Tracks provenance with `ai_summary_generated_at` field

**Task K.3.4:** Enable scheduled maintenance
- Set `AI_MAINTENANCE_ENABLED=true` in production
- Verify `ai-maintenance.mjs` runs daily at 3:17 AM

### K.4 Phase 4: Improve Architecture (Priority: Ongoing)

**Task K.4.1:** Consolidate dual auth systems
- Migrate Laravel `users` table users to Supabase Auth
- Remove session-based admin, use JWT-based CMS exclusively
- Single source of truth for user management

**Task K.4.2:** Add structured logging
- Use Pino or similar in Netlify Functions
- Log AI job lifecycle events, errors, and usage
- Export to observability platform (Datadog, Logtail)

**Task K.4.3:** Implement server-side search API
- Create `netlify/functions/search.mjs`
- Query Supabase with `ilike` or full-text search
- Return JSON results for client-side consumption
- Replace embedded search suggestions with API calls

**Task K.4.4:** Optimize build performance
- Current build loads 13 tables sequentially via Supabase REST
- Consider batch loading or using Supabase's batch API
- Add build caching for unchanged content (check `updated_at` before re-fetching)

**Task K.4.5:** Add image optimization
- Use `@astrojs/image` for on-demand image optimization
- Serve WebP/AVIF with AVIF as fallback
- Implement responsive image sets

### K.5 Phase 5: Testing & Verification

**Task K.5.1:** Run existing test suite
```bash
npm test     # Node tests in tests/node/, tests/js/
php artisan test  # Laravel tests in tests/Feature/, tests/Unit/
```

**Task K.5.2:** Add coverage for new features
- AI service integration tests (mock provider responses)
- Accommodation detail page render tests
- Price backfill script verification

---

## Appendix: File Inventory

### Supabase Migrations (9 files)
- `supabase/migrations/20260401000100_create_trek_africa_cms.sql`
- `supabase/migrations/20260517000100_create_supplier_marketplace.sql`
- `supabase/migrations/20260606000100_add_cms_write_policies.sql`
- `supabase/migrations/20260607000100_seed_auth_user.sql`
- `supabase/migrations/20260829000200_add_districts_booking_offers.sql`
- `supabase/migrations/20260830000100_harden_cms_content_and_roles.sql`
- `supabase/migrations/20260908000100_add_media_library_metadata.sql`
- `supabase/migrations/20260930000100_add_activities_and_travel_articles.sql`
- `supabase/migrations/20261002102519_add_ai_infrastructure.sql`

### Seed Files (2 files)
- `supabase/seed/20260401000200_seed_trek_africa_launch.sql`
- `supabase/seed/20260830000200_seed_cms_content_and_media.sql`

### Server-Side AI (6 files)
- `server/ai/service.mjs`
- `server/ai/config.mjs`
- `server/ai/providers.mjs`
- `server/ai/admin.mjs`
- `server/ai/errors.mjs`
- `server/ai/store.mjs`

### Netlify Functions (2 files)
- `netlify/functions/ai-config.mjs`
- `netlify/functions/ai-maintenance.mjs`

### Astro Source
- `src/lib/`: `supabase.mjs`, `content-repository.mjs`, `site-model.mjs`, `booking.mjs`, `images.mjs`, `photo-defaults.mjs`, `photo-library.js`, `env.mjs`, `content-html.mjs`
- `src/config/site.mjs`
- `src/layouts/SiteLayout.astro`
- `src/components/`: BookingOffers, Breadcrumbs, Footer, Gallery, Header, Icon, ImageSlot, ListingCard, PageHero, SearchRibbon, VideoStory (11 files)
- `src/pages/`: index, 404, contact, photo-credits, travel-insights/ (5 files)
- `src/pages/regions/[slug].astro`, `src/pages/regions/index.astro` (missing)
- `src/pages/countries/[slug].astro`, `src/pages/countries/index.astro` (missing — only 20260930 activity page sections)
- `src/pages/attractions/[slug].astro`, `src/pages/attractions/index.astro`
- `src/pages/accommodations/index.astro` (no `[slug].astro`)
- `src/pages/activities/[slug].astro`, `src/pages/activities/index.astro`

### Laravel Legacy
- `app/Models/`: Accommodation, Attraction, Country, District, MediaAsset, PageSection, Region, Restaurant, SiteSetting, TourOperator, BookingOffer, User
- `app/Models/Concerns/HasPublicationState.php`
- `app/Http/Controllers/`: AdminController, SiteController, TravelController, Auth/AdminAuthController
- `app/Http/Middleware/`: Admin middleware
- `app/Services/SupabaseStorageService.php`
- `routes/web.php`
- `database/migrations/2026_04_19_210000_create_trek_africa_cms_tables.php`
- `database/seeders/TrekAfricaGuideSeeder.php` (157KB)

### Tests
- Node tests: `tests/node/` — booking, build-config, content-html, content-parity, content-repository, detail-pages, directory-pages, images, page-shell, public-config, site-model
- JS tests: `tests/js/` — cms-core
- PHP tests: `tests/Feature/` + `tests/Unit/` — CmsFieldParity, ImageCreditsAudit, ListingDetailPages, ListingOfferCard, MediaAssignmentAudit, PublishedContentVisibility, SearchRibbonMarkup, StaticBuildRoutes, SupabaseSchemaContract, TravelPages, TravelSearch
- PHP test: `tests/Unit/Stay62LinkBuilderTest.php`

### Static CMS
- `public/cms.html` (2,352 lines)
- `public/cms-core.js` (15KB)
- `public/cms-schema.js` (29KB)
- `public/cms-sync.js` (43KB)
- `public/photo-defaults.js` (1KB)
- `public/photo-library.js` (74KB)

---

## Section A Summary (Analysis)

The Trek Africa Guide is a **hybrid Astro 5 + Laravel 11 application** with Supabase as the authoritative CMS/content backend. The system is in transition from a Laravel monolith to a static Astro frontend, with both stacks coexisting in the same repository and both backed by separate but mirrored Supabase schemas.

**Key architectural pillars:**

1. **Static-first with build-time data:** Astro generates ~50 static pages from Supabase REST reads at build time. No client-side data fetching beyond injected search suggestions.

2. **Role-based CMS via Supabase RLS:** A sophisticated 4-tier RBAC system (super_admin, admin, editor, viewer) enforces publication gating through SQL policies. The `private.has_cms_role()` security-definer function is the central authorization primitive.

3. **Dual CMS:** A standalone HTML-based Supabase CMS (`cms.html`) and a Laravel Blade-based admin panel both exist, using different auth systems (JWT vs session).

4. **AI infrastructure ready but dormant:** Complete server-side AI framework with Supabase-backed job tracking, caching, provider abstraction, and Netlify Function endpoints — but all disabled by default with zero task configs.

5. **Stay22 affiliate integration:** Well-structured URL building with safety checks, but no price data is seeded, so all offers show "Check current details" instead of prices.

6. **Image-slot system:** Deterministic stock image fallback with CC-BY-SA attribution, applied via photo-defaults library that never overrides editor content.

7. **Supplier marketplace:** A complete e-commerce layer (supplier profiles, products, bookings, payouts) exists in the schema but has no frontend routes or consumer code.

---

## Section B Summary (Recommendations)

The most impactful next steps, ranked by effort/return:

### Immediate (1-2 days):
1. **Fix broken accommodation detail pages** — create `/src/pages/accommodations/[slug].astro` mirroring the attraction detail page. This is the most visible gap: listing cards link to non-existent routes.
2. **Decide on restaurants** — either implement `/src/pages/restaurants/` routes and set `RESTAURANTS_ENABLED=true`, or remove restaurant data from the Astro pipeline to avoid confusion.

### Short-term (1-2 weeks):
3. **Activate AI infrastructure** — seed 3 task configs (summary, itinerary, meta description), deploy the `ai-generate` Netlify Function, and add "AI assist" buttons in the Supabase CMS. This unlocks automated content generation.
4. **Backfill booking offer prices** — schedule a one-off script to fetch live prices from Booking.com and GetYourGuide APIs, populating the empty price fields so the Stay22 integration shows actual pricing.

### Medium-term (1-3 months):
5. **Consolidate authentication** — migrate the Laravel `users` table to Supabase Auth, eliminating the dual-auth confusion. This simplifies the CMS to a single auth system.
6. **Add server-side search** — replace the embedded client-side search suggestions with a Netlify Function + Supabase full-text search for better scalability.
7. **Optimize build performance** — the current build loads 13 tables sequentially; adding parallel batch loading and change-detection caching would reduce build times significantly.</think>I now have comprehensive context across all 27 audit areas. Let me write a few more targeted reads to confirm the remaining details, then compose the final report.<tool_call>Read<arg_key>file_path</arg_key><arg_value>E:/TrekAfricaGuide/src/components/Breadcrumbs.astro