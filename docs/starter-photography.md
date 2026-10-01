# Starter photography — 1 October 2026

The shared library assigns one or two relevant photographs to all 19 published countries, 24 attractions, 11 activities and 24 accommodations. It also supplies covers for four regions and ten Travel Insights stories. Thirty new Wikimedia Commons photographs supplement the existing 24 credited destination photographs.

Nine properties have a property-specific photograph: Casa del Papa, Kruger Shalati, Mena House, Mfuwe Lodge, Mount Nelson, Ol Tukai Lodge, Serengeti Serena Safari Lodge, Sossusvlei Lodge and Victoria Falls Hotel. The other accommodation listings use clearly labelled destination-context photographs. Property photographs reflect their capture date; they are not a promise of current room layouts or facilities.

## Editing

- Website source: `src/lib/photo-library.js` contains every assignment, author, licence, source-page link and asset checksum.
- Images: `public/images/stock/starter/`. Existing images remain under `public/images/stock/destinations/`.
- `/photo-credits` displays the credits and source links. Detail galleries also credit photographers.
- The CMS applies the same defaults when loading a record. Saving the record persists the displayed hero and gallery to Supabase using the existing forms. New custom hero URLs and nonempty galleries are preserved.
- To change starter defaults in source, edit the source library or `src/lib/photo-defaults.mjs`, then run `node scripts/sync-photo-library.mjs` to copy them into the public CMS modules.
- The optional `database/seeds/2026-10-01-starter-photos.sql` persists all defaults at once. Deploy the image assets first, then apply it to the intended Supabase project. It only updates empty or originally audited hero URLs and preserves nonempty galleries. It was prepared but not applied because the available connector points at another project.

## Publication and licences

The site is statically generated. Source changes require a deployment before appearing publicly; CMS saves require a rebuild. Runtime defaults let the website display these images even before the optional SQL is applied.

All selected images use CC BY, CC BY-SA or CC0 licences. Attribution and licence links are retained. Resizing and display cropping are disclosed, and share-alike terms continue to apply to the images. The source links hold the full terms and capture information. No paid stock, generated imagery or unverified hotel marketing photographs were used.

Photos were inspected visually, and changed source was inspected. No tests, browser QA or local build were run, following the user's preferences.
