# Complete website content control through the CMS

Review date: 7 September 2026

Website: https://www.trekafricaguide.com (redirects to https://trekafricaguide.com)

Supabase project: rftoaaehhenhnziukgpl

Status: review and proposed execution plan. No database, storage, application, or deployment changes are authorized by this document alone.

## Objective and expected editing experience

Preserve the current website's content, images, page structure, and working interactions while making all editorial content manageable through the CMS. After migration, an editor should be able to open a page by its familiar name, edit its sections and media, preview a draft, and publish without editing source code or Git files.

Supabase should hold the authoritative content and media records. Netlify should serve pages generated from a consistent published content release. Browser interactions should enhance those pages without replacing them with a different layout or stale content.

Include public supplier landing copy and supplier terms. Supplier transactions, payouts, account administration, and changes to commercial terms are separate from importing the existing public content. Retain layout components and application behavior in code; expose their text, links, ordering, visibility, and media as structured fields.

## Evidence and review coverage

- Inspected routes, static exporter, active Blade templates, CMS forms, browser rendering code, models, Supabase migrations, media manifests, and existing test coverage.
- Checked all 32 public HTML routes present in the committed static export against the live domain. All returned HTTP 200. These comprise the homepage, six directory/contact pages, four region guides, 19 country guides, supplier landing page, and supplier terms. `/cms.html` also returned 200.
- Live `/cms-core.js` and `/cms-schema.js` returned 404. Both files exist in `public` but are absent from `dist`; the static exporter does not copy them. The site layout does not load the shared core before `cms-sync.js`.
- The sampled detail URL `/attractions/bwindi-impenetrable-national-park` returned 404. `BuildStatic.php` exports country and region details but omits attraction, accommodation, and restaurant details, then appends their redirect rules after a broad fallback. Detail templates do exist in the source.
- `netlify.toml` publishes `dist` using an echo-only command. The prior authentication fix changed hardcoded browser configuration; it did not implement environment-variable injection or automatic content builds.
- `public/cms.html` and `public/cms-sync.js` differ from their `dist` copies. The source CMS schema also defines fields that are not wired into the active hand-written editor forms.
- The initial live homepage HTML contains Trip-Fit Finder, route collections, featured sections, and supporting editorial blocks. `public/cms-sync.js::renderHome()` replaces the main content with a different, simpler layout when Supabase data is available. `renderContact()` similarly renders a reduced version of the source contact page.
- Global navigation, footer explanations, labels, homepage route collections, card facts, contact explanations, and other copy remain embedded in templates or JavaScript. Existing settings update only some global content.
- The repository contains 385 JPG and five PNG files under `public`. Its credit manifest records 24 stock images; its media assignment manifest records 72 associations. These are file/manifest counts, not counts of unique visible assets or confirmed Supabase objects. Generated images and unrelated reference graphics coexist with active media.
- No video files were found in the inspected public media inventory, and none of the 32 fetched public HTML pages contained video tags, MP4/WebM references, or recognized YouTube/Vimeo embeds. The CMS currently offers image uploads and image galleries; there is no complete video editor/player workflow.

Limits: this was a source and live HTTP review. Browser automation timed out, so JavaScript-rendered states, responsive appearance, authenticated CMS actions, actual remote database contents, applied migrations, storage inventory, and role enforcement remain to be verified. A database table or migration in Git does not prove it exists in production. Videos loaded exclusively after JavaScript executes remain unconfirmed.

## Content coverage map

| Area | Existing foundation | Required completion |
| --- | --- | --- |
| Shared header and footer | Site settings, logo and color support | Navigation labels/links/order, subtitle, tagline, footer blocks, contact details, disclosures, favicon and social metadata |
| Homepage | Page sections, featured listings | Current hero/carousel, slide images and text, Trip-Fit Finder, introduction, how-it-works block, route collections, all headings and CTAs, ordered featured selections |
| Region and country guides | Related content models and CMS forms | All visible guide fields, hero/gallery media, section headings, ordering, SEO and publication controls |
| Attractions, stays, restaurants | Models, detail templates, existing editors | Missing form fields, published detail routes, practical facts and links, galleries, consistent related content and booking offers |
| Tour operators and booking offers | Operator editor; offer schema/backend support | Complete offer and operator editing, associations, ordering, valid URLs, verified prices and disclosures |
| Contact page | Settings and partial section support | All visible copy, supporting lists, image, headings and consistent footer/contact updates |
| Supplier public pages | Standalone static HTML | Editable public copy, images and existing terms text while preserving supplier application behavior |
| Media | Image uploads, URL galleries, media model | Searchable library, reusable asset records, usage references, captions/alt/credits, replacement, image/video support |
| Publishing | Some status fields and access policies in source | Complete editor controls, preview, revisions, consistent publication filtering, deployment status, rollback |

## Ordered implementation tasks

### 1. Capture a recoverable baseline and complete the inventory

Record the current deployed revision, export Supabase content and media metadata, and capture rendered desktop/mobile page states. Inventory every route, section, text block, link, image, gallery item, CSS background, carousel asset, and video or external embed. Follow detail links and compare initial HTML with the page after Supabase loads.

Create a coverage manifest containing public URL, section identifier, current value, source location, destination CMS field, media references, and verification state. Compare the live site, committed `dist`, source templates, local seeded content, and existing Supabase rows before deciding which values to import. Treat the current visible site as the preservation baseline, and retain newer CMS drafts separately.

Acceptance: every visible editorial element has a destination field; every discrepancy is recorded; backups and rollback instructions are available. Unreferenced files are catalogued rather than automatically published or deleted.

### 2. Establish one reliable content and deployment path

Use the existing static-site architecture initially. Build a versioned snapshot of published Supabase content, render all pages from it, and deploy the complete output to Netlify. Ensure the renderer actually reads the Supabase snapshot rather than silently rebuilding from a different local SQLite dataset.

Apply one explicit publication filter to every snapshot query and page export. The current Laravel controller does not consistently call `publiclyVisible()` for homepage collections, regions/countries and restaurant listings, and the exporter enumerates all regions/countries. Supabase row policies alone cannot protect a static build that reads through another database or privileged connection. Export only allowlisted public settings (`is_public`) and public content fields, never integration secrets. Render into a clean staging directory and promote the output only after validation.

Generate browser-safe configuration from Netlify variables; allow only the URL and publishable key into public output. Remove duplicated legacy key declarations. Include required shared CMS assets and pin dependencies. Generate real listing detail pages, fix redirect ordering, and verify new/renamed slugs. Do not run the current destructive exporter over the working `dist` directory without first protecting unrelated files.

Remove or refactor the current whole-page runtime replacement so it cannot erase existing sections. Retain search, filtering, carousels, gallery interaction and booking behavior against the same published content contract.

Acceptance: a fresh build reproduces the baseline, all public scripts load, all published detail routes resolve, and a seeded value cannot overwrite a newer Supabase value on rebuild.

### 3. Extend the structured content model

Reuse regions, countries, districts, attractions, accommodations, restaurants, operators, offers, settings, sections and media tables where suitable. Add structured definitions for pages, navigation, repeatable blocks, hero slides, route collections, editorial labels and related-record selection. Model text facts explicitly where current code invents or derives them.

Add stable IDs, ordering, visibility, publication state, SEO fields and validation. Introduce release/revision records so editing a published page creates a draft without changing the live release. Choose one canonical media reference format instead of competing local paths, URL arrays and image-slot placeholders.

Acceptance: the coverage manifest maps to concrete editable fields, and repeatable content can be added/reordered without raw JSON editing.

### 4. Build the shared image and video library

Extend media records with media type, storage location or approved external URL, MIME type, size, dimensions/duration, poster/thumbnail, captions, alt text, credits and rights metadata. Separate an asset from its usages so the same image can serve several pages with appropriate per-placement text and ordering.

Provide upload progress, retry, search, preview, replace, reuse and where-used views. Use resumable uploads for large files. Support uploaded MP4/WebM and validated YouTube/Vimeo links as explicit video blocks; avoid arbitrary iframe HTML. Include poster images, captions/transcripts where applicable and accessible playback controls. Storage alone does not provide a complete adaptive video streaming/transcoding service; evaluate that separately if the actual video volume requires it.

Keep drafts protected and avoid deleting media still referenced by a published release. Version replacement files to avoid stale cached images. Preserve source credits and mark illustrative imagery accurately.

Acceptance: an image and a video can each be uploaded or linked, previewed, assigned, reordered, published and replaced without broken references; failed/interrupted uploads are recoverable.

### 5. Import the existing content and active media

Implement a dry-run importer with a change report before writes. Import in dependency order: global/page definitions, regions, countries/districts, listings/operators, relationships/offers, media, then section/media assignments. Match stable identifiers and natural keys, not assumptions about IDs shared between SQLite and Supabase.

Map every visible image to a library asset. Upload owned/permitted assets to managed storage and retain valid external references where appropriate. Preserve filenames/source URLs in provenance metadata; deduplicate by checksum while retaining separate usage records. Do not replace current imagery with stock substitutes or import every unused image as published content.

Acceptance: repeated import produces no duplicates; all public text and active media are accounted for; content relationships and credits survive; the pre-migration website can be reproduced from imported records.

### 6. Complete the CMS editing interface

Organize the CMS around Pages, Destinations, Listings, Operators & Offers, Media Library, Navigation and Site Settings. Open pages by their displayed names, list sections in frontend order, and provide clear field previews. Use media selectors instead of requiring pasted URLs. Add form validation, unsaved-change handling, save feedback, drafts, preview and revision restore.

Wire the schema into actual forms and persistence; declaring fields in `cms-schema.js` alone is insufficient. Confirm staff roles in the database and storage policies. Supplier users must not gain editorial control over unrelated content.

The present CMS admits an authenticated session and relies on database policies for writes. Add role-aware capabilities and actionable permission errors in the editor; enforce publisher authorization on the server independently of what buttons the browser displays.

Acceptance: a nontechnical editor can modify a complete page, its image and its video without writing code or JSON; unauthorized users cannot publish or replace another user's restricted assets.

### 7. Connect every page to the content model

Integrate homepage and global content first, followed by region/country guides, listing indexes/details, contact, and supplier public content. Preserve the existing layout and behavior. Honor section order/visibility and publication rules consistently in static output, searches, related listings and media. Update page metadata, sitemap and redirects from the same data.

Acceptance: editing any inventoried field changes its intended placement and no unrelated page; repeated global content updates everywhere; newly created listing pages work by direct URL.

### 8. Add a clear publishing and recovery workflow

Recommended behavior: Save draft -> Preview -> Publish -> Build -> Live. A server-side authorized publisher triggers a Netlify build and records the release/deployment status. Keep build-hook credentials out of the browser. The site remains on the previous successful release if validation/build fails.

Show editors whether changes are draft, publishing, live or failed, with a link to the result. Coalesce rapid publish requests and prevent an older deployment from replacing a newer release. Rollback must restore the matching content revision and referenced media, not only the HTML. Scheduled publication, if exposed, must also trigger a build at the scheduled time.

Acceptance: publishing needs no Git edit; success corresponds to a verified live release; failed publishing preserves the previous site; rollback restores a known complete release.

### 9. Verify in a preview deployment and release

Test representative edits across every coverage area, then crawl every public route and active media reference. Exercise search/filtering, direct detail links, carousel/gallery behavior, image replacement, video playback, draft isolation, permissions, publish failure and rollback. Compare responsive screenshots and content inventories against the captured baseline. Include JavaScript-disabled HTML and social metadata checks so stale static output cannot hide behind browser updates.

Use relevant existing JS, schema, media, publication and route tests, and add end-to-end checks of actual editor-to-live behavior. Tests that only look for field names in source are not enough.

Acceptance: 100% of inventoried editorial content is mapped and verified; zero missing active image/video/script references; all published pages resolve; unpublished content stays private; an editor completes a content-and-media update without developer assistance. Obtain approval of the concrete preview before production cutover.

## Main affected files and systems

- `netlify.toml`, `build-static.sh`, `app/Console/Commands/BuildStatic.php`: reproducible generation, snapshot data source, route export, asset copying and deployment.
- `public/cms.html`, `public/cms-schema.js`, `public/cms-core.js`, `public/cms-sync.js`: editor, field contract, shared rules and runtime parity.
- `app/Http/Controllers/SiteController.php`, `app/Models`, `resources/views/site`, `resources/views/layouts/site.blade.php`: page data and rendering.
- `public/suppliers`, `public/supplier-terms`: public supplier copy integration.
- `supabase/migrations`, `supabase/seed`, `database/data`: schema, safe import, media and relationship mappings.
- Supabase Auth, Postgres and Storage; authorized publish endpoint; Netlify builds/previews; route/media/browser tests.

## Dependencies, permissions and stopping conditions

Implementation follows plan approval. Before import, obtain the actual authenticated Supabase content/storage inventory, confirm the staff account can edit, and confirm the canonical production Netlify site and build environment. Use read-only comparisons first. Never infer applied policies or production data from local seeds.

Stop a migration or publication on unbacked-up data, unresolved conflicting source values, missing media ownership information, unmapped relationships, failing access policies, missing routes/assets, or failed preview parity. Record the specific issue and keep the previous public release available.

Priority: repair reproducibility and routes first; complete the content contract and media library second; import and expose editing third; verify and publish last. Avoid estimating a fixed delivery date before the actual remote content and media volume are reconciled.

## Supporting documentation

- Supabase recommends resumable uploads for larger files and unstable connections: https://supabase.com/docs/guides/storage/uploads/resumable-uploads
- Netlify supports triggering builds through build hooks: https://docs.netlify.com/build/configure-builds/build-hooks/

Planning route: staged review using one GPT-5.6 Sol planner at high reasoning and a primary-agent source/live HTTP audit. Implementation is being applied in bounded passes; tests are intentionally skipped per the user's instruction.
