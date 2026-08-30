# CMS-Backed Listing Detail Pages Design

## Objective

Restore Trek Africa Guide as the complete Africa travel-planning layer. Travelers move from region to country to attraction, accommodation, or restaurant detail pages inside Trek Africa Guide. External OTAs appear only as clearly labeled booking choices on a listing's detail page, and supported links are routed through Stay22.

Supabase is the hosted source of truth for the public site and CMS. An authorized editor must be able to change the content represented on the frontend without editing source files.

## Existing Product Constraints

- Preserve the current public visual design and responsive behavior.
- Preserve the public route families: `/regions/{slug}`, `/countries/{slug}`, `/attractions/{slug}`, `/accommodations/{slug}`, and `/restaurants/{slug}`.
- Keep the search ribbons and their travel-date, guest, and room context.
- Use the existing Laravel and Blade renderer for local development and static production generation.
- Use the static Supabase CMS at `/cms.html` for the hosted editor experience.
- Use Supabase Postgres, Auth, Storage, the Data API, and RLS rather than creating a second hosted CMS database.
- Keep Supabase secret and service-role keys out of browser code and source control. A publishable or legacy anon key may be used by the public client only with least-privilege grants and RLS.

## Traveler Information Architecture

### Region pages

Each region page contains its independent editorial overview, planning context, licensed hero image, country cards, and featured attraction cards. Country cards open Trek Africa Guide country pages.

### Country pages

Each country page contains the country's editorial guide, access information, best-time guidance, planning tips, licensed imagery, and complete groups of its published attractions, accommodations, and restaurants. Each listing card opens a Trek Africa Guide detail page.

### Directory pages

The attraction, accommodation, and restaurant indexes remain searchable directories. A card contains editorial summary and planning facts plus one internal `View details` action. OTA offer buttons do not appear on directory cards.

### Listing detail pages

Every published attraction, accommodation, and restaurant has an independent page. The page includes:

- hierarchical breadcrumbs through region and country;
- a licensed stock hero image and accessible alt text;
- listing summary and full editorial content;
- location, pricing guidance, and type-specific planning facts;
- relevant practical information and verification guidance;
- nearby internal listings;
- a `Compare booking options` panel containing zero or more active provider offers.

An offer displays provider name, current or indicative price when sufficiently documented, the checked date and price basis, and a CTA such as `View deal on Booking.com`. Supported providers route through Stay22. Unsupported providers may use a direct external URL but must be identified as a non-affiliate external link.

## Stock Image and Attribution Design

The existing verified Wikimedia Commons destination collection is the approved starting image set. Every detail page receives at least one relevant image: exact destination photography for attractions and destination-context photography for the related accommodation or restaurant when a commercially reusable exact-property photo is unavailable.

Generated images must not be selected by the listing templates. Initial stock images are downloaded and served locally for stable production rendering. Editors may later replace an image through Supabase Storage.

Each managed image records:

- public image URL or local asset path;
- alt text;
- source page URL;
- creator or photographer;
- license name;
- license URL;
- whether the image is an exact subject match;
- optional attribution text.

Attribution records are editable in the CMS and available to an image-credits presentation. Images with unclear commercial-use terms are excluded.

## Supabase Content Architecture

### Core content entities

- `regions`
- `countries`
- `districts`
- `attractions`
- `accommodations`
- `restaurants`
- `tour_operators`
- `booking_offers`
- `site_settings`
- `page_sections`
- `media_assets`

Regions, countries, attractions, accommodations, restaurants, tour operators, and page sections support `draft` and `published` status. Public queries return published records only. Timed publication is represented by `published_at` where useful.

Every public entity supports `meta_title`, `meta_description`, and `meta_image_url`, falling back to global SEO settings when empty. Listing entities retain their type-specific fields rather than being flattened into a generic table.

### Page modules

`page_sections` is the focused module system for editable shared and landing-page blocks. It supports an owning `page_key`, `section_key`, `module_type`, status, ordered position, copy, image, and JSON configuration. The fixed travel-page templates remain stable so editors cannot accidentally break the design, while the content inside their defined regions is editable.

### Settings

Settings are grouped as `general`, `contact`, `branding`, `seo`, `integrations`, and `system`. Public-safe values may be read by the frontend. Secrets remain environment variables or protected server configuration and never appear in a public settings query.

The Stay22 affiliate identifier is treated as public integration metadata because it is necessarily present in outbound affiliate URLs. Service-role and secret keys are never stored as public settings.

### Booking offers

Each booking offer belongs polymorphically to one attraction, accommodation, or restaurant and stores:

- provider and CTA label;
- source OTA URL;
- Stay22 provider identifier;
- affiliate-supported flag;
- optional price amount, currency, unit, checked date, and basis;
- active state and sort order.

The CMS uses searchable listing selectors rather than asking an editor to enter raw database IDs.

## Authentication and Authorization

Supabase Auth controls CMS sign-in. A `profiles` table maps `auth.users.id` to one of `super_admin`, `admin`, `editor`, or `viewer`.

- Public/anonymous visitors can select only public-safe, published content.
- Viewers can inspect CMS content but cannot mutate it.
- Editors can create and update content, media metadata, and booking offers.
- Admins can additionally publish and delete content.
- Super admins can manage profiles and role assignments.

Authorization is enforced by database grants and RLS, not only by hiding controls in the browser. Policies use trusted profile data or app metadata, never user-editable metadata. UPDATE policies include both `USING` and `WITH CHECK`. Every exposed table has RLS enabled and explicit grants.

No migration may create a known email/password combination or contain a plaintext credential. The existing uncommitted starter-password migration is excluded from the implementation.

## Storage

Supabase Storage uses public `media` and `branding` buckets with predictable paths:

- `media/regions/{slug}/...`
- `media/countries/{slug}/...`
- `media/attractions/{slug}/...`
- `media/accommodations/{slug}/...`
- `media/restaurants/{slug}/...`
- `branding/logos/...`

Public reads are allowed for published media. CMS-role uploads, updates, and deletes are protected by Storage RLS. Replacement/upsert policies include the required INSERT, SELECT, and UPDATE access.

## CMS Experience

The hosted CMS mirrors the public information architecture with these sections:

- Dashboard
- Regions
- Countries
- Districts
- Attractions
- Accommodations
- Restaurants
- Tour operators
- Booking offers
- Page sections
- Media and image credits
- Settings and SEO
- Users and roles for super admins

Forms group fields according to their frontend location: page identity, card content, hero/media, detail content, relationships, SEO, publication, and booking options. Editors see image previews, readable related-record selectors, validation errors, publish status, search, and filters.

## Public Data Flow

1. The Laravel renderer produces complete static fallback HTML for every public page from seeded content.
2. The static build emits each listing detail route as a real `index.html`; it does not emit redirects from detail routes to directory cards.
3. In production, `cms-sync.js` reads published Supabase records and replaces the matching page content using the same route and content relationships.
4. A saved CMS change is therefore visible on the hosted frontend without a source-code edit or static rebuild, while the static fallback remains usable if Supabase is temporarily unavailable.
5. Listing cards always link internally. OTA links are rendered only by detail-page booking panels.

## Failure and Safety Behavior

- If Supabase cannot be reached, the complete pre-rendered page remains visible.
- Draft content never replaces public fallback content and is not discoverable through anonymous Data API queries.
- If a listing has no active offers, the detail page remains useful and shows a neutral availability message rather than a broken CTA.
- If an offer lacks trustworthy current pricing, it displays `Check live price` rather than an invented amount.
- If a Stay22 provider is unsupported, the direct provider URL is used only when present and is labeled as non-affiliate.
- Missing images fall back to a related licensed destination image, never a generated placeholder.

## Verification Requirements

- Feature tests prove all three listing detail routes return `200`, contain internal editorial content, and no longer redirect.
- Card tests prove directory cards expose `View details` and no OTA buttons.
- Detail tests prove active offers render only on detail pages and supported offers use Stay22 URLs.
- Country and region tests prove correct hierarchical grouping.
- Static-build tests prove all listing detail pages are emitted and obsolete focused redirects are absent.
- CMS tests prove all frontend fields have corresponding editable fields and readable related selectors.
- SQL tests or equivalent assertions prove published public reads, denied anonymous writes, editor mutations, admin publication/deletion, and Storage policy boundaries.
- Image audits prove every published listing resolves to a licensed stock image and a complete attribution record.
- The complete PHP test suite, JavaScript syntax checks, production asset build, static render, link audit, and responsive browser checks pass before completion.

## Delivery Boundary

The repository will contain the complete frontend, CMS, tracked Supabase migrations, seeds or import data, licensed stock assets, attribution metadata, and deployment-ready static output. Applying migrations to a hosted Supabase project is performed only against the project that is confirmed to back the website. The currently connected Supabase account exposes project `pmskfhfxnhkpiaykgnra`, while the checked-in CMS points at `rfaoaaehhenhniqkgpl`; this mismatch must be resolved before any hosted database mutation.
