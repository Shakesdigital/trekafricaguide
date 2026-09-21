# Node-Only Supabase Static Site Design

## Objective

Replace the Laravel/PHP production renderer and static-site generator with an Astro application built by Node and Vite. Supabase remains the source of truth and the existing CMS remains the editing interface. Netlify must generate and publish complete static HTML without PHP, Composer, Laravel, or SQLite.

The migration must preserve the established Trek Africa Guide design, public information architecture, internal card navigation, planner-focused tone, responsive behavior, and detail-page Stay22 booking flow. Restaurant content remains disabled.

## Publishing Model

CMS edits do not update the public site immediately. A new Netlify deployment publishes the latest content.

During each deployment, Astro connects to Supabase with the project URL and public publishable key, reads published content permitted by RLS, validates the result, and creates the static site in `dist`. A failed or invalid Supabase response fails the deployment rather than publishing an incomplete website.

No service-role or secret database key may be used by the public application or committed to source control.

## Public Architecture

Astro replaces Laravel as the public renderer and uses Vite as its asset pipeline. The generated site retains these routes:

- `/`
- `/regions`
- `/regions/{slug}`
- `/countries`
- `/countries/{slug}`
- `/attractions`
- `/attractions/{slug}`
- `/accommodations`
- `/accommodations/{slug}`
- `/contact`

Legacy redirects remain available for previously supported aliases. Restaurant routes, cards, navigation, search options, and featured modules remain absent.

Every public content page is emitted as a real HTML document. Directory search and filtering use small browser-side JavaScript modules, but core content and navigation do not depend on client-side rendering.

## Supabase Data Layer

A focused content repository reads these public content sources:

- `regions`
- `countries`
- `districts`
- `attractions`
- `accommodations`
- `booking_offers`
- `site_settings`
- `page_sections`
- `media_assets`

Queries explicitly request published, currently visible records even though RLS also enforces public visibility. The repository normalizes database records into stable page models and resolves region, country, district, listing, offer, and media relationships before rendering.

Build validation rejects:

- missing or duplicate slugs;
- orphaned country or listing relationships;
- a published child whose required parent is not published;
- malformed internal route data;
- malformed external booking URLs;
- missing essential collections such as regions or countries;
- unavailable Supabase or missing build environment variables.

Optional booking offers, galleries, nearby stays, and secondary editorial sections may be empty. Their templates render neutral fallbacks or omit the section without breaking the page.

## Content Migration and Project Identity

Before cutover, the Laravel seed dataset and current Supabase dataset must be compared by stable slug and relationship. Missing production content must be imported through reviewed Supabase SQL or a bounded import tool before the Astro build becomes authoritative.

The repository contains references to more than one Supabase project. The production project reference must be confirmed before any hosted database mutation. Read-only comparison may use the public project configuration, but writes require explicit confirmation of the target project and appropriate authorization.

The migration must not create known passwords, commit credentials, expose a service-role key, weaken RLS, or make draft content publicly readable.

## UI Components and Design Preservation

Shared Astro components mirror the current public templates:

- document layout, metadata, header, navigation, and footer;
- search ribbon;
- page hero and breadcrumbs;
- listing card and image slot;
- galleries and media credits;
- planning facts and editorial sections;
- region and country collections;
- attraction and accommodation detail sections;
- booking-offer panel;
- empty-state and not-found presentation.

Existing CSS, typography, spacing, color use, card structure, imagery, responsive behavior, and CTA styling remain unchanged unless a technical difference is required for equivalent Astro output.

Attraction cards lead to internal detail pages and use `View attraction detail`. Accommodation cards lead to internal detail pages and use `View stay`. Provider links appear only on full detail pages.

## Stay22 and External Booking Links

A tested JavaScript Stay22 link builder replaces the PHP helper. It consumes listing context, provider configuration, travel search values, and the public Stay22 affiliate identifier.

Supported provider URLs are wrapped through Stay22. Unsupported providers may use a validated direct external URL. All provider links open externally with appropriate `rel` attributes and clearly state that Trek Africa Guide does not process payment.

Missing or stale prices display verification-focused language rather than an invented amount. Live rates, permits, availability, and provider terms must be checked on the linked provider site.

## CMS and Static Auxiliary Pages

The existing Supabase CMS remains available from the generated site. Its authentication, RLS-controlled editing, media management, and publishing workflow are preserved.

The supplier portal, supplier terms, robots file, images, and other approved static assets are copied into Astro's public output. Any CMS module that still assumes Laravel endpoints must be identified during parity testing and either changed to Supabase-native behavior or explicitly excluded from the production workflow.

## Failure and Safety Behavior

- Supabase network or authorization failures stop the build with a useful message.
- Invalid records identify their table and stable identifier without logging secrets.
- Missing optional content never produces broken markup or dead internal links.
- Rich CMS content is sanitized with a strict allowlist before insertion into generated HTML.
- Draft and future-dated content are excluded by both RLS and query logic.
- Missing images resolve to an approved related image or accessible neutral fallback.
- A listing with no active booking offers remains a useful editorial page.
- Generated external links allow only approved HTTP or HTTPS destinations.

## Migration Sequence

1. Inventory the current routes, components, content fields, assets, metadata, redirects, and interactive behavior.
2. Add Astro and the Node test/build toolchain alongside the legacy renderer.
3. Implement and test the Supabase repository, validation, sanitization, route models, and Stay22 builder.
4. Port the shared layout and public page families while preserving current CSS and assets.
5. Preserve the CMS and approved auxiliary static pages.
6. Audit Laravel seed content against the confirmed production Supabase project and prepare any required content import.
7. Build the Astro site to a separate comparison output and run parity checks against representative legacy pages.
8. Switch Netlify to the Node-only build after route, content, visual, and link acceptance checks pass.
9. Remove the Laravel application, Composer files, PHP tests, SQLite build flow, and PHP Netlify configuration.
10. Run the final Node-only build and production-deploy verification.

## Verification

Automated Node tests cover:

- Supabase record normalization and relationship resolution;
- publication and future-date filtering;
- required-data validation and duplicate route rejection;
- rich-text sanitization;
- Stay22 wrapping and safe direct-provider fallback;
- route generation for every published entity;
- card CTA and internal-link behavior;
- restaurant exclusion;
- search and directory filtering;
- missing optional content and image fallbacks.

The production build must also pass:

- generated page counts against published Supabase records;
- an internal-link and asset audit;
- an external-link safety audit;
- a scan for public restaurant routes or navigation;
- a scan confirming Netlify has no PHP or Composer dependency;
- representative desktop and mobile checks for the homepage, a region, a country, an attraction, and an accommodation;
- a CMS smoke check;
- a build with PHP unavailable.

## Acceptance Criteria

The migration is accepted when:

- Netlify runs only the Node/Vite/Astro installation and build path;
- every supported public URL generates complete static HTML from Supabase;
- the established design and responsive user experience are preserved;
- all required production content exists in the confirmed Supabase project;
- internal listing cards lead to their full Trek Africa Guide pages;
- detail-page provider actions use the required Stay22 behavior;
- restaurants remain disabled;
- CMS publishing followed by a Netlify deployment updates the public site;
- no PHP, Composer, Laravel, or SQLite production dependency remains;
- all specified automated and deployment checks pass.

## Delivery Boundary

This milestone includes the Node-only public frontend, build-time Supabase integration, content parity/import tooling needed for cutover, preserved CMS and static auxiliary pages, automated verification, Netlify configuration, and removal of the PHP production stack.

It does not redesign the site, add restaurant functionality, introduce on-site payments, replace Supabase, or add automatic deploy webhooks. Automatic deployment after CMS publishing can be considered separately after the Node-only migration is stable.
