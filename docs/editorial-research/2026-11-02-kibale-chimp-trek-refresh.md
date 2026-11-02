# Kibale chimpanzee-trek planning refresh — 2 November 2026

## Selection and scope

The published `plan-kibale-around-chimpanzee-trek` insight already had a supported, cautious two-night plan around Kanyanchu and five credited archival images. This refresh adds arrival-mode and route choices that make the guide more useful for travelers continuing a longer Uganda circuit. Only this published insight and the editorial progress ledger are in scope.

## Current official evidence

- Uganda Wildlife Authority, [Kibale National Park](https://ugandawildlife.org/national-parks/kibale-national-park/), reviewed 2 November 2026. It describes Kampala–Fort Portal highway access as 326 km/about six hours; Fort Portal to the park about one hour; a longer Mbarara route with optional Lake Mburo and Queen Elizabeth stops; and no direct flight into Kibale, with scheduled/charter service to Kasese followed by an about two-hour road transfer or a charter to Fort Portal. It also notes route options can vary and says its road values are approximate.
- Uganda Wildlife Authority, [Chimpanzee Tracking](https://ugandawildlife.org/activities/chimpanzee-tracking/), reviewed 2 November 2026. The current activity page is sparse, while the park page includes specific operational claims. Existing copy deliberately avoids publishing a fixed departure, minimum age, or price because those details have previously conflicted across UWA pages; unchanged.
- Nature Lodges Uganda, [Kibale Forest Camp](https://naturelodgesuganda.com/lodges/kibale-forest-camp/), remains the cited source for the forest-edge base context.

## Editorial change

Expanded the travel-choice context: use the direct Kampala–Fort Portal highway approach when the trek is the priority; treat the Mbarara/Lake Mburo/Queen Elizabeth route as a separate multi-stop journey rather than a same-day shortcut; or consider air to Kasese/Fort Portal with the necessary road connection. No unsupported connecting-drive duration or flight availability was added. Preserved the current two-night suggestion, existing links, images, and changeable-detail caveats.

## Publication record

Commit `669bb4e8272e5e3dcec180a42c18e12b046cccf5` was pushed to `main`. Supabase `public.editorial_documents` confirms the published Kibale document is imported at `source_commit` `669bb4e8272e5e3dcec180a42c18e12b046cccf5`. Production remains on Netlify deploy `6ae546e40b91beaebda69a4b`, commit `131eaae9f8a7f7d8a3066b3c62465eb82c17fe12`; the live page is HTTP 200 but still shows the earlier copy. This environment has no Netlify CLI login (`netlify status`: “Not logged in”) and the connected Netlify project tool only reads deploys, so production publication and live text confirmation remain blocked pending an authenticated publish action. No email sent before live confirmation.
