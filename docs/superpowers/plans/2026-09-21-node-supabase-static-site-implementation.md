# Node-Only Supabase Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Laravel/PHP Netlify build with an Astro static site that reads published content from Supabase and preserves Trek Africa Guide's existing routes, design, CMS, and Stay22 detail-page booking behavior.

**Architecture:** Astro uses Vite to generate complete static HTML into `dist`. A build-time repository reads public Supabase tables, validates and joins the records into one immutable site model, and supplies that model to all page templates. The Astro implementation is built beside Laravel until route, content, link, and responsive parity pass; Netlify is switched to Node-only immediately before the PHP stack is removed.

**Tech Stack:** Node.js 22, Astro, Vite, `@supabase/supabase-js`, Zod, `sanitize-html`, Node's built-in test runner, Supabase Postgres/Auth/Storage, Netlify.

**Spec:** `docs/superpowers/specs/2026-09-21-node-supabase-static-site-design.md`

## Global Constraints

- Preserve the existing visual design, typography, layout, card structure, CTA styling, and responsive behavior.
- Preserve `/`, `/regions`, `/countries`, `/attractions`, `/accommodations`, `/contact`, and every published detail URL.
- Restaurant routes, navigation, search options, cards, and featured modules remain disabled.
- Cards link internally using `View attraction detail` and `View stay`; provider links appear only on full detail pages.
- Supported detail-page provider URLs use the Stay22 wrapper; no on-site payment flow is introduced.
- Supabase remains the source of truth; CMS changes become public only after a successful Netlify deployment.
- Only the Supabase project URL and public publishable key may be used by the build and browser code. Never expose a service-role or secret key.
- Supabase failure, missing essential collections, invalid relationships, or duplicate routes must fail the build.
- The final Netlify build must not require PHP, Composer, Laravel, or SQLite.
- Confirm the production Supabase project reference before any hosted mutation.

## Review Focus

- An HTTP-successful but empty Supabase response must fail the build instead of publishing an empty site; Task 2 tests this.
- Future-dated content and children of unpublished parents must not generate pages or cards; Tasks 2 and 3 test this.
- Duplicate slugs within one route family must identify both offending records and stop generation; Task 3 tests this.
- Unsafe rich HTML and non-HTTP provider URLs must be removed rather than rendered; Task 4 tests this.
- Missing CMS/browser configuration must produce a clear configuration screen without exposing secrets or breaking public pages; Task 8 tests this.

## Target File Structure

- `astro.config.mjs` — static output and Vite configuration.
- `src/config/site.mjs` — immutable route and default-brand configuration.
- `src/lib/env.mjs` — build environment validation.
- `src/lib/supabase.mjs` — public Supabase client factory.
- `src/lib/content-repository.mjs` — table loading and publication filtering.
- `src/lib/site-model.mjs` — relationship joining, indexes, validation, and page models.
- `src/lib/booking.mjs` — offer freshness, URL safety, and Stay22 wrapping.
- `src/lib/content-html.mjs` — rich-text sanitization and plain-text extraction.
- `src/lib/images.mjs` — media resolution and accessible fallback selection.
- `src/layouts/SiteLayout.astro` — shared metadata and page shell.
- `src/components/*` — reusable visual components matching the Blade partials.
- `src/pages/*` — static and dynamic public routes.
- `src/scripts/site.js` — navigation, search, carousel, and gallery interactions.
- `src/styles/app.css` — the existing design system moved from `resources/css/app.css`.
- `scripts/write-public-config.mjs` — generates public CMS/supplier configuration from Netlify variables.
- `scripts/build-fixture.mjs` — deterministic Astro build using test content.
- `scripts/audit-content-parity.mjs` — compares required legacy slugs with Supabase.
- `scripts/audit-dist.mjs` — audits generated routes, links, assets, restaurant exclusions, and PHP references.
- `content/legacy-route-manifest.json` — checked-in minimum route inventory extracted before Laravel removal.
- `tests/node/*` and `tests/fixtures/site-data.json` — Node-only unit and static-build coverage.

---

### Task 1: Establish the Astro Build Foundation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `.env.example`
- Create: `src/config/site.mjs`
- Create: `tests/node/build-config.test.mjs`

**Interfaces:**
- Produces: `SITE_URL`, `ROUTES`, and `DEFAULT_BRAND` exports from `src/config/site.mjs`.
- Produces: `npm run dev`, `npm run build`, `npm test`, and `npm run verify` commands.

- [ ] **Step 1: Write the failing configuration test**

```js
// tests/node/build-config.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('package exposes an Astro-only production build', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(pkg.scripts.build, 'astro build');
  assert.match(pkg.dependencies.astro, /^\d/);
  assert.equal('laravel-vite-plugin' in (pkg.devDependencies || {}), false);
});

test('Astro is configured for static dist output', async () => {
  const source = await readFile('astro.config.mjs', 'utf8');
  assert.match(source, /output:\s*['"]static['"]/);
  assert.match(source, /outDir:\s*['"]\.\/dist['"]/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/node/build-config.test.mjs`

Expected: FAIL because `astro.config.mjs` and the Astro scripts do not exist.

- [ ] **Step 3: Install pinned Node dependencies and create the base configuration**

Run:

```powershell
npm install --save-exact astro @supabase/supabase-js zod sanitize-html
npm uninstall laravel-vite-plugin @tailwindcss/vite tailwindcss axios concurrently
```

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://trekafricaguide.com',
  output: 'static',
  outDir: './dist',
  publicDir: './public',
  trailingSlash: 'never',
});
```

Create `.env.example` with public-only names:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_example
STAY22_AFFILIATE_ID=replace-with-public-affiliate-id
SITE_URL=https://trekafricaguide.com
```

Set `package.json` scripts exactly:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "build:fixture": "node scripts/build-fixture.mjs",
    "test": "node --test tests/node/**/*.test.mjs tests/js/**/*.test.mjs",
    "verify": "npm test && npm run build"
  }
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/node/build-config.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the foundation**

```powershell
git add package.json package-lock.json astro.config.mjs .env.example src/config/site.mjs tests/node/build-config.test.mjs
git commit -m "build: add Astro static site foundation"
```

---

### Task 2: Build the Supabase Content Repository

**Files:**
- Create: `src/lib/env.mjs`
- Create: `src/lib/supabase.mjs`
- Create: `src/lib/content-repository.mjs`
- Create: `tests/fixtures/site-data.json`
- Create: `tests/node/content-repository.test.mjs`

**Interfaces:**
- Produces: `readBuildEnv(source = process.env): BuildEnv`.
- Produces: `createPublicClient(env): SupabaseClient`.
- Produces: `loadPublishedTables(client, now = new Date()): Promise<RawTables>`.
- Produces: `loadContent({ env, client, now, fixturePath }): Promise<RawTables>`.

- [ ] **Step 1: Write failing repository tests**

```js
// tests/node/content-repository.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readBuildEnv } from '../../src/lib/env.mjs';
import { visibleAt } from '../../src/lib/content-repository.mjs';

test('build environment rejects missing public Supabase configuration', () => {
  assert.throws(() => readBuildEnv({}), /SUPABASE_URL/);
});

test('visibleAt excludes drafts and future publication', () => {
  const now = new Date('2026-09-21T12:00:00Z');
  assert.equal(visibleAt({ status: 'draft' }, now), false);
  assert.equal(visibleAt({ status: 'published', published_at: '2026-09-22T00:00:00Z' }, now), false);
  assert.equal(visibleAt({ status: 'published', published_at: null }, now), true);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/content-repository.test.mjs`

Expected: FAIL with missing module errors.

- [ ] **Step 3: Implement environment validation and table loading**

Use Zod to require valid `https:` Supabase and site URLs and a non-empty publishable key. `createPublicClient` must set `auth.persistSession`, `auth.autoRefreshToken`, and `auth.detectSessionInUrl` to `false` because this client runs during a build.

Load these tables with `select('*')`: `regions`, `countries`, `districts`, `attractions`, `accommodations`, `booking_offers`, `site_settings`, `page_sections`, and `media_assets`. Check every `{ data, error }` result and throw `Failed to load <table>: <message>` without logging credentials.

Implement publication filtering as:

```js
export function visibleAt(record, now = new Date()) {
  if (!record || record.status !== 'published') return false;
  if (!record.published_at) return true;
  const publishedAt = Date.parse(record.published_at);
  return Number.isFinite(publishedAt) && publishedAt <= now.getTime();
}
```

`booking_offers` use `active === true`; `site_settings` use `is_public === true`; districts are retained when returned by RLS. Reject empty `regions` or `countries` after filtering.

The fixture path is allowed only when `NODE_ENV === 'test'`; production must throw if `CONTENT_FIXTURE_PATH` is set.

- [ ] **Step 4: Test errors, empty essentials, and fixture loading**

Add fake-client cases proving one failed table reports its table name, empty regions fail, and the fixture loads without network access.

Run: `node --test tests/node/content-repository.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the repository**

```powershell
git add src/lib/env.mjs src/lib/supabase.mjs src/lib/content-repository.mjs tests/fixtures/site-data.json tests/node/content-repository.test.mjs
git commit -m "feat: load published travel content from Supabase"
```

---

### Task 3: Normalize and Validate the Site Model

**Files:**
- Create: `src/lib/site-model.mjs`
- Create: `src/lib/images.mjs`
- Create: `tests/node/site-model.test.mjs`
- Create: `tests/node/images.test.mjs`

**Interfaces:**
- Consumes: `RawTables` from Task 2.
- Produces: `buildSiteModel(tables, now): SiteModel`.
- Produces: `getSiteModel(): Promise<SiteModel>` with one cached build-time promise.
- Produces: `resolveImage(entity, model): ResolvedImage`.

- [ ] **Step 1: Write failing relationship and route tests**

Cover these exact cases:

```js
test('joins country, region, district, media, attraction, and offers', () => {
  const model = buildSiteModel(fixtureTables, new Date('2026-09-21T12:00:00Z'));
  const stay = model.accommodationsBySlug.get('test-stay');
  assert.equal(stay.country.slug, 'uganda');
  assert.equal(stay.region.slug, 'east-africa');
  assert.equal(stay.attraction.slug, 'test-attraction');
  assert.equal(stay.bookingOffers.length, 1);
});

test('rejects duplicate slugs inside one route family', () => {
  assert.throws(() => buildSiteModel(duplicateAttractionFixture), /duplicate attraction slug/i);
});

test('rejects a published child with an unpublished parent', () => {
  assert.throws(() => buildSiteModel(orphanFixture), /published country.+unpublished region/i);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/site-model.test.mjs tests/node/images.test.mjs`

Expected: FAIL because the model does not exist.

- [ ] **Step 3: Implement deterministic model construction**

Create maps by numeric/string ID and slug. Join parents and related media without mutating raw records. Sort all collections by `featured DESC`, `sort_order ASC`, then `name ASC`. Nearby attractions must be deterministic: same country, different ID, first three after the standard sort—never random during static generation.

Expose:

```js
{
  settings,
  pageSections,
  regions,
  countries,
  attractions,
  accommodations,
  regionsBySlug,
  countriesBySlug,
  attractionsBySlug,
  accommodationsBySlug,
  searchSuggestions
}
```

Reject missing parents, duplicate slugs, invalid IDs, and entities whose computed internal URL escapes its route family.

- [ ] **Step 4: Implement image selection and verify GREEN**

Image resolution order is `hero_image_url`, linked hero media URL, resolved existing `image-slot:*`, first gallery image, related country image, then an accessible neutral image slot. Preserve creator, license, license URL, and source-page metadata when available.

Run: `node --test tests/node/site-model.test.mjs tests/node/images.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the model**

```powershell
git add src/lib/site-model.mjs src/lib/images.mjs tests/node/site-model.test.mjs tests/node/images.test.mjs
git commit -m "feat: validate and join Supabase site content"
```

---

### Task 4: Port Safe Content and Stay22 Rules

**Files:**
- Create: `src/lib/content-html.mjs`
- Create: `src/lib/booking.mjs`
- Create: `tests/node/content-html.test.mjs`
- Create: `tests/node/booking.test.mjs`
- Modify: `tests/js/cms-core.test.mjs`

**Interfaces:**
- Produces: `sanitizeRichText(value): string` and `plainText(value): string`.
- Produces: `safeExternalUrl(value): string | null`.
- Produces: `isOfferFresh(offer, now, maxAgeDays = 90): boolean`.
- Produces: `buildStay22Url({ listing, offer, search, affiliateId }): string | null`.
- Produces: `offerPresentation({ listing, offer, search, affiliateId, now }): OfferViewModel`.

- [ ] **Step 1: Write failing sanitizer and booking tests**

```js
test('sanitizer removes executable markup but preserves approved editorial tags', () => {
  const html = sanitizeRichText('<p>Hello <strong>Africa</strong></p><script>alert(1)</script>');
  assert.equal(html, '<p>Hello <strong>Africa</strong></p>');
});

test('provider URLs reject javascript and data schemes', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('data:text/html,test'), null);
  assert.equal(safeExternalUrl('https://www.booking.com/hotel/test'), 'https://www.booking.com/hotel/test');
});

test('supported booking offer is wrapped through Stay22', () => {
  const url = buildStay22Url({
    listing: { slug: 'test-stay', name: 'Test Stay', property_type: 'Lodge' },
    offer: { affiliate_supported: true, stay22_provider: 'booking', source_url: 'https://booking.com/test' },
    search: { checkin: '2026-11-10', checkout: '2026-11-12', adults: 2 },
    affiliateId: 'aid-test',
  });
  assert.match(url, /^https:\/\/www\.stay22\.com\/allez\/booking\?/);
  assert.match(url, /campaign=accommodation_test-stay/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/content-html.test.mjs tests/node/booking.test.mjs`

Expected: FAIL with missing module errors.

- [ ] **Step 3: Implement the shared rules**

Use `sanitize-html` with only `p`, `br`, `strong`, `em`, `b`, `i`, `u`, `ul`, `ol`, `li`, `h2`, `h3`, `blockquote`, and `a`; allow only `href` on anchors; allow only `http`, `https`, and `mailto`; always add `target="_blank"` and `rel="noopener noreferrer"` to editorial external links.

Port the supported Stay22 provider map and parameter rules from `public/cms-core.js`. Preserve date/adult/child inputs, omit rooms where the current implementation omits them, URL-encode all values, and use a direct URL only for a validated unsupported-provider destination.

- [ ] **Step 4: Remove restaurant expectations from retained JavaScript tests and verify GREEN**

Delete restaurant route and restaurant offer assertions from `tests/js/cms-core.test.mjs`; do not change attraction or accommodation expectations.

Run: `node --test tests/node/content-html.test.mjs tests/node/booking.test.mjs tests/js/cms-core.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the content rules**

```powershell
git add src/lib/content-html.mjs src/lib/booking.mjs tests/node/content-html.test.mjs tests/node/booking.test.mjs tests/js/cms-core.test.mjs
git commit -m "feat: port safe content and Stay22 rules to Node"
```

---

### Task 5: Port the Shared Design System and Page Shell

**Files:**
- Create: `src/layouts/SiteLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/Icon.astro`
- Create: `src/components/ImageSlot.astro`
- Create: `src/components/PageHero.astro`
- Create: `src/components/Breadcrumbs.astro`
- Create: `src/components/ListingCard.astro`
- Create: `src/components/SearchRibbon.astro`
- Create: `src/components/Gallery.astro`
- Create: `src/scripts/site.js`
- Create: `src/styles/app.css`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`
- Create: `scripts/build-fixture.mjs`
- Create: `tests/node/page-shell.test.mjs`

**Interfaces:**
- Consumes: shared settings, region navigation, search suggestions, and optional SEO metadata from `SiteModel`.
- Produces: accessible shared HTML shell and reusable card/detail components.

- [ ] **Step 1: Write a failing fixture-build shell test**

The test invokes `scripts/build-fixture.mjs`, then asserts that `dist/contact/index.html` contains the current header navigation, omits Restaurants, includes the footer verification language, and contains the expected brand CSS variables.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/page-shell.test.mjs`

Expected: FAIL because the Astro shell and fixture builder do not exist.

- [ ] **Step 3: Port the layout and CSS without redesign**

Move `resources/css/app.css` to `src/styles/app.css` without changing selectors except those tied to Laravel-only markup. Port the shared Blade layout and partials component-for-component. Keep Manrope, Instrument Serif, existing colors, spacing, card classes, breakpoints, menu button semantics, and footer copy.

Import `src/styles/app.css` from `SiteLayout.astro`. Set canonical, description, Open Graph, Twitter, favicon, and CSS variables from the page props and public settings.

- [ ] **Step 4: Port browser interactions and verify GREEN**

Move only public behaviors from `resources/js/app.js`: navigation toggle, search mode, suggestions, date normalization, carousel controls, and gallery lightbox. Exclude Laravel admin modal code and all runtime `cms-sync.js` rendering.

Run: `node --test tests/node/page-shell.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the shared UI**

```powershell
git add src/layouts src/components src/scripts src/styles src/pages/contact.astro src/pages/404.astro scripts/build-fixture.mjs tests/node/page-shell.test.mjs
git commit -m "feat: port Trek Africa Guide design to Astro"
```

---

### Task 6: Generate the Homepage and Directory Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/regions/index.astro`
- Create: `src/pages/countries/index.astro`
- Create: `src/pages/attractions/index.astro`
- Create: `src/pages/accommodations/index.astro`
- Create: `tests/node/directory-pages.test.mjs`

**Interfaces:**
- Consumes: `getSiteModel()` and Task 5 components.
- Produces: complete static homepage and directory documents.

- [ ] **Step 1: Write failing generated-page assertions**

Assert from a fixture build that:

- `dist/index.html` contains featured regions, attractions, and stays;
- attraction cards start with the attraction name and location, then use `View attraction detail`;
- accommodation cards use `View stay`;
- all card URLs are internal;
- the four directories exist;
- no directory or homepage contains booking-provider CTAs or restaurant navigation;
- filter option values match fixture slugs.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/directory-pages.test.mjs`

Expected: FAIL because the pages do not exist.

- [ ] **Step 3: Port the homepage and directory templates**

Use the current Blade templates as the markup authority. Preserve featured limits: up to eight attractions and four accommodations, sorted by the site model. Render all published entities in their directories. Directory query-string filtering remains browser-side and progressively enhances already-rendered cards.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/node/directory-pages.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit directories**

```powershell
git add src/pages/index.astro src/pages/regions/index.astro src/pages/countries/index.astro src/pages/attractions/index.astro src/pages/accommodations/index.astro tests/node/directory-pages.test.mjs
git commit -m "feat: generate Astro home and directory pages"
```

---

### Task 7: Generate Region, Country, Attraction, and Accommodation Detail Pages

**Files:**
- Create: `src/pages/regions/[slug].astro`
- Create: `src/pages/countries/[slug].astro`
- Create: `src/pages/attractions/[slug].astro`
- Create: `src/pages/accommodations/[slug].astro`
- Create: `src/components/BookingOffers.astro`
- Create: `tests/node/detail-pages.test.mjs`

**Interfaces:**
- Consumes: route maps and joined entity models from Task 3.
- Consumes: sanitization and booking functions from Task 4.
- Produces: one static detail page for every published entity.

- [ ] **Step 1: Write failing route-generation tests**

For the fixture dataset, assert that every slug has an `index.html`; breadcrumbs link through the correct region and country; unpublished and future-dated slugs do not exist; attraction pages show nearby stays; stay pages show related attraction context; provider CTAs appear only on detail pages; supported providers use `stay22.com`; and unsafe direct provider links are omitted.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/detail-pages.test.mjs`

Expected: FAIL because dynamic pages are absent.

- [ ] **Step 3: Implement deterministic `getStaticPaths()` functions**

Each page must return `{ params: { slug }, props: { entity } }` from the relevant model collection. Do not fetch Supabase independently inside each template. Use the cached site model so one build observes one consistent dataset.

Port every current country-planning and listing-detail section, including hero, summary, practical information, access, seasonal guidance, galleries, nearby internal listings, SEO, and image attribution. Preserve the current neutral planning tone.

- [ ] **Step 4: Implement booking panels and verify GREEN**

Render only active offers. Fresh documented pricing may show its currency, amount, and unit; otherwise show `Check current details on the provider site`. All provider anchors use `target="_blank"`, `nofollow noopener`, plus `sponsored` when the offer is affiliate-supported. State that Trek Africa Guide does not take payment on the page.

Run: `node --test tests/node/detail-pages.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit detail pages**

```powershell
git add src/pages/regions src/pages/countries src/pages/attractions src/pages/accommodations src/components/BookingOffers.astro tests/node/detail-pages.test.mjs
git commit -m "feat: generate Supabase-backed travel detail pages"
```

---

### Task 8: Preserve CMS Configuration and Prove Content Parity

**Files:**
- Modify: `package.json`
- Create: `scripts/write-public-config.mjs`
- Create: `scripts/extract-legacy-routes.mjs`
- Create: `scripts/audit-content-parity.mjs`
- Create: `content/legacy-route-manifest.json`
- Create: `tests/node/public-config.test.mjs`
- Create: `tests/node/content-parity.test.mjs`
- Modify: `public/cms.html`
- Modify: `public/suppliers/index.html`
- Modify: `public/suppliers/app.js`
- Modify: `.gitignore`

**Interfaces:**
- Produces: generated `public/runtime-config.js` defining `window.TREK_SUPABASE`.
- Produces: `extractLegacyRoutes(seederSource, distPath): LegacyManifest`.
- Produces: `auditContentParity(manifest, siteModel): ParityReport`.

- [ ] **Step 1: Write failing configuration and parity tests**

Test that generated browser configuration contains only URL, publishable key, and public Stay22 ID; missing variables generate a disabled configuration object with a clear message; no service-role-shaped variable is serialized; and every manifest slug exists in the fixture site model.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/public-config.test.mjs tests/node/content-parity.test.mjs`

Expected: FAIL because the scripts do not exist.

- [ ] **Step 3: Generate browser-safe configuration**

`write-public-config.mjs` writes JavaScript, not JSON embedded in HTML:

```js
window.TREK_SUPABASE = Object.freeze({
  url: "https://project.supabase.co",
  publishableKey: "sb_publishable_example",
  configured: true
});
```

Escape `<`, Unicode line separators, and closing-script sequences during serialization. Add `/public/runtime-config.js` to `.gitignore`. Load it before Supabase and application scripts in both CMS and supplier HTML. Replace hardcoded CMS credentials with `window.TREK_SUPABASE`; use the publishable key only.

Update the build script to `node scripts/write-public-config.mjs && astro build` so every real build generates the browser-safe configuration before Astro copies `public/`.

- [ ] **Step 4: Create and verify the legacy manifest**

`extract-legacy-routes.mjs` reads the `regions()`, `countries()`, `attractions()`, and `accommodations()` method bodies from `database/seeders/TrekAfricaGuideSeeder.php`, extracts their explicit constructor/call slugs, merges existing route directory names from `dist`, deduplicates them, and writes sorted arrays. Restaurant methods and directories are never included.

Run:

```powershell
node scripts/extract-legacy-routes.mjs
node scripts/audit-content-parity.mjs
```

Expected: the audit reports zero missing required slugs. If it reports missing content, stop the cutover; create reviewed Supabase seed SQL for only those records, confirm the production project reference, apply it through the authorized Supabase workflow, and rerun until zero are missing. Do not weaken the manifest to make the audit pass.

- [ ] **Step 5: Verify GREEN and commit**

Run: `node --test tests/node/public-config.test.mjs tests/node/content-parity.test.mjs`

Expected: PASS.

```powershell
git add scripts/write-public-config.mjs scripts/extract-legacy-routes.mjs scripts/audit-content-parity.mjs content/legacy-route-manifest.json tests/node/public-config.test.mjs tests/node/content-parity.test.mjs public/cms.html public/suppliers/index.html public/suppliers/app.js .gitignore
git commit -m "feat: preserve CMS config and audit content parity"
```

---

### Task 9: Audit Static Output and Cut Netlify Over to Node

**Files:**
- Modify: `package.json`
- Create: `scripts/audit-dist.mjs`
- Create: `tests/node/dist-audit.test.mjs`
- Modify: `netlify.toml`
- Delete: `build-static.sh`
- Delete: `.env.netlify`
- Delete: `composer.json`
- Delete: `composer.lock`
- Delete: `artisan`
- Delete: `phpunit.xml`
- Delete: `app/`
- Delete: `bootstrap/`
- Delete: `config/`
- Delete: `database/`
- Delete: `resources/`
- Delete: `routes/`
- Delete: `storage/`
- Delete: `tests/Feature/`
- Delete: `tests/Unit/`
- Delete: `tests/TestCase.php`

**Interfaces:**
- Consumes: generated `dist` and `content/legacy-route-manifest.json`.
- Produces: a non-zero exit on missing pages, broken internal links/assets, public restaurant routes, unsafe external links, or PHP build references.

- [ ] **Step 1: Write the failing distribution audit test**

Create temporary good and bad output fixtures. Prove the audit rejects a missing manifest route, `/restaurants` navigation, a broken internal asset, `javascript:` URLs, and a Netlify command containing `php` or `composer`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/node/dist-audit.test.mjs`

Expected: FAIL because the audit does not exist.

- [ ] **Step 3: Implement the output audit**

Walk every generated HTML file. Resolve root-relative internal links against `dist`; allow query strings and fragments; require every route to resolve to a file or route `index.html`; verify referenced local images/scripts/styles exist; reject restaurant route families and PHP/Composer build references; allow only `http`, `https`, `mailto`, `tel`, fragments, and internal paths.

- [ ] **Step 4: Run the complete Astro build before deleting Laravel**

Run:

```powershell
npm test
npm run build
node scripts/audit-content-parity.mjs
```

Expected: all tests pass, Astro builds all required pages, the output audit passes, and content parity reports zero missing slugs.

- [ ] **Step 5: Switch Netlify to Node-only**

Set `netlify.toml` to:

```toml
[build]
  publish = "dist"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "22"
```

Keep the existing security and cache headers. Remove `PHP_VERSION` entirely.

Set the final package build command to `node scripts/write-public-config.mjs && astro build && node scripts/audit-dist.mjs` so a malformed static output cannot be published.

- [ ] **Step 6: Remove the legacy PHP stack**

Delete only the listed Laravel/PHP paths after the successful pre-deletion build. Preserve `supabase/`, `public/`, `research/`, `docs/`, marketing assets, and all unrelated untracked user files. Confirm `resources/css/app.css` and required public JavaScript have already been ported before deleting `resources/`.

- [ ] **Step 7: Verify the final repository and build without PHP**

Run:

```powershell
npm ci
npm test
npm run build
git diff --check
rg -n "PHP_VERSION|composer install|php artisan|laravel-vite-plugin" netlify.toml package.json package-lock.json astro.config.mjs src scripts
```

Expected: install, tests, and build pass; `git diff --check` is clean; the final search returns no matches.

Inspect representative generated files for homepage, one region, one country, one attraction, one accommodation, CMS, and supplier portal. Perform desktop and mobile browser checks at 1440px, 768px, and 390px widths.

- [ ] **Step 8: Commit and push the cutover**

```powershell
git add -A -- netlify.toml package.json package-lock.json astro.config.mjs src scripts content public tests .env.example .gitignore
git add -u -- build-static.sh .env.netlify composer.json composer.lock artisan phpunit.xml app bootstrap config database resources routes storage tests
git commit -m "feat: replace Laravel deploy with Astro and Supabase"
git push origin main
```

Expected: Netlify detects the pushed commit, installs Node 22 dependencies, runs the Astro build, and publishes `dist` without provisioning PHP.

---

## Final Acceptance Checklist

- [ ] Netlify build logs contain no PHP installation or Composer command.
- [ ] `npm ci`, `npm test`, and `npm run build` pass from a clean checkout.
- [ ] Content parity reports zero missing required regions, countries, attractions, or accommodations.
- [ ] Every published Supabase entity has its expected static route.
- [ ] Homepage and listing cards use internal detail links and approved CTA wording.
- [ ] Booking-provider links occur only on detail pages and supported providers use Stay22.
- [ ] Restaurants are absent from routes, navigation, search, and generated content.
- [ ] CMS sign-in and content editing still operate against the confirmed Supabase project.
- [ ] A CMS edit becomes visible after a successful Netlify redeployment.
- [ ] Representative desktop and mobile pages preserve the existing visual system.
- [ ] The production site serves the new deploy and all key URLs return successful responses.
