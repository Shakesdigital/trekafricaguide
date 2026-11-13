const fs = require('fs');
const p = 'docs/editorial-progress.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
d.updated_at = new Date().toISOString();
d.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-13T19:00Z',
  category_rotation: 'destinations',
  deliverable: 'destination_victoria_falls',
  inventory_note: 'Rolling whole-site inventory maintained via live country-page reads: Zimbabwe country page renders a Destinations rail with only Masvingo while its hero headline is "Zimbabwe delivers falls and strong guiding" and every hero photo is of the falls; the Victoria Falls attraction + Victoria Falls Hotel + two activities + one insight cluster had no destination anchor. Tanzania flagged as the next candidate (no mainland destination for the Serengeti/Arusha gateway).',
  next_category: 'activities',
  next_action: 'Rotate to activities next run.',
  commit: 'e7a5e2e (content) + receipt commit',
  push: 'Content pushed to main (87d12eb..e7a5e2e); push working, brief 403 note obsolete.',
  live_receipt: 'https://trekafricaguide.com/countries/zimbabwe/victoria-falls/ HTTP 200, full 9-section destination flow, distinctive copy (ZTA Smoke-that-thunders / 70% / 1855, FCDO KAZA US$50 + evisa.gov.zw + cash rules), six-photo gallery all HTTP 200 image/jpeg, country rail now lists Victoria Falls first, all cross-link cards live, no markup leak.',
  cms: 'Publishable-key reconcile 2026-11-13: travel_articles 200, local_destinations 404 (schema cache), editorial_documents 401 to anon (RLS by design); no writes attempted - owner-side check to confirm local_destinations/victoria-falls.',
  email: 'Owner progress email drafted and pending send (Gmail signed out in the OpenBot browser, re-checked 13 Nov 2026); draft stored in the record (tenth pending draft, one sign-in ships all).'
};
d.destination_victoria_falls = {
  id: 'victoria-falls',
  category: 'destinations',
  started: '2026-11-13',
  latest_run_note: 'Scheduled 2h routine run (19:00Z); executed on schedule. The 17:00Z Sal Island run set next category to destinations.',
  selection_evidence: 'Live /countries/zimbabwe/ (HTTP 200, 13 Nov 2026) renders a Destinations rail with only Masvingo, while the country hero headline is "Zimbabwe delivers falls and strong guiding" and all six hero photos are of Victoria Falls; /attractions/victoria-falls/ and /accommodations/victoria-falls-hotel/ (9 gallery photos) plus two published activities and the plan-your-victoria-falls-visit insight form a full cluster with no destination anchor. Duplicate check: no victoria-falls slug among the 21 local destinations.',
  scope: 'New local destination: Victoria Falls, Zimbabwe (the Zimbabwe-side falls town). Zimbabwe Tourism Authority framing (Mosi-oa-Tunya "Smoke that thunders", largest single curtain of falling water in the world, 70% of views from the Zimbabwe rain forest, spray-fed rainforest ecosystem, Livingstone 1855, hot couple-of-kilometres walk); UK FCDO entry facts (passport 6 months + 3 blank pages, visa on arrival usually 30 days with USD small notes, evisa.gov.zw, KAZA Univisa US$50 / 30 days at Victoria Falls airport and the Zimbabwe-Zambia land border covering Zimbabwe-Zambia travel and Botswana day trips, yellow fever certificate, US$10,000 cash-in declaration / US$2,000 cash-out limit). Relationships: attraction victoria-falls, activities victoria-falls-guided-walk + victoria-falls-zambezi-white-water-rafting, stay victoria-falls-hotel, insight plan-your-victoria-falls-visit; sort_order 1 ahead of Masvingo.',
  files: [
    'content/local-destinations.json',
    'docs/editorial-research/2026-11-13-victoria-falls-local-destination.md',
    'docs/editorial-research/add-victoria-falls-destination.cjs',
    'docs/editorial-research/cms-reconcile.cjs',
    'docs/editorial-progress.json'
  ],
  images: 6,
  image_note: 'Gallery reuses six already-registered, already-credited editorial images from the /images/editorial/victoria-falls/ collection (creator, source, licence, alt text and exact_subject evidence in both photo-library files; credited on /photo-credits). Reuse decision documented in the research record; no new downloads, no substitutes, no fabricated images. Hero: victoria-falls-zimbabwe-panorama.jpg.',
  booking_cta: 'None by design: destination pages carry no hotel-booking surrogate. The Victoria Falls Hotel stay guide records no verified booking link, and booking texture flows through the published activity guides (GetYourGuide via Stay22 on the attraction) and the hotel stay page. No booking-destinations.json change.',
  key_facts_checked: 'Zimbabwe Tourism Authority Victoria Falls (Mosi-oa-Tunya) destination page - checked 13 Nov 2026. UK FCDO Zimbabwe travel advice, entry requirements - checked 13 Nov 2026, page states "Still current at: 13 November 2026". Live Trek Africa Guide Zimbabwe cluster (country, attraction, hotel, two activities, insight) - re-read 13 Nov 2026. Not claimed: visa fee amounts beyond KAZA US$50, park entrance charges, future river-flow conditions, hotel rates or any booking link.',
  build_checks: 'check:build-inputs passed; production build 175 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 180 pages; dist verified pre-push: 9-section destination flow (Explore, Highlights, Getting there and around, Best time to visit, Planning your stay, Related travel insights, Attractions to explore, Things to do, Where to stay, Travel insights, More destinations), six gallery images referenced, KAZA/evisa facts render, country rail renders Victoria Falls first, no template-markup leak (the }} hit is inline custom-element JS also present in the published masvingo page).',
  cms: 'Publishable-key reconcile 2026-11-13: travel_articles 200, local_destinations 404 (schema cache), editorial_documents 401 to anon (RLS by design); no writes attempted - owner-side CMS check to confirm local_destinations/victoria-falls.',
  next_category: 'activities',
  next_action: 'Rotate to activities next run; Tanzania mainland destination flagged as the next destinations candidate.',
  status: 'published_live_confirmed',
  content_commit: 'e7a5e2e',
  publication: {
    content_commit: 'e7a5e2e',
    pushed_to: 'main',
    push_result: 'success (87d12eb..e7a5e2e)',
    pushed_at: '2026-11-13',
    live_url: 'https://trekafricaguide.com/countries/zimbabwe/victoria-falls/',
    live_http_status: 200,
    checked_at: '2026-11-13',
    live_distinctive_text: 'Victoria Falls: the Zimbabwe-side base for the Smoke that Thunders | Trek Africa Guide',
    live_checks: {
      detail: 'HTTP 200; title correct; full destination flow renders; distinctive copy renders (Smoke that thunders, largest single curtain of falling water, 70% of views from the Zimbabwe rain forest, Livingstone 1855, KAZA Univisa US$50 / 30 days, evisa.gov.zw, 6-months passport / 3 blank pages, yellow fever, US$2,000 cash-out limit); gallery renders all six images; no markup leak.',
      country_rail: 'Zimbabwe country page Destinations rail now lists Victoria Falls first, Masvingo second (was Masvingo only).',
      cards: 'Attractions to explore renders the Victoria Falls attraction; Things to do renders both activities; Where to stay renders The Victoria Falls Hotel; Travel insights renders plan-your-victoria-falls-visit (all live HTTP 200).',
      archive_home: 'Destination appears under Zimbabwe in the destinations archive and homepage search data.'
    },
    cms_source_commit: 'imported at source_commit e7a5e2e; publishable-key read of local_destinations stays blocked/404 (schema cache) - owner-side CMS check to confirm local_destinations/victoria-falls'
  },
  owner_email_draft: {
    prepared: '2026-11-13',
    to: 'fsddanmugisa@gmail.com',
    status: 'unsent - owner Gmail signed out (accounts.google.com sign-in tab open in the OpenBot browser, re-checked 13 Nov 2026); stored here for sending on one sign-in, together with the nine earlier pending drafts',
    subject: 'Trek Africa Guide: Victoria Falls destination guide shipped and live',
    body: 'Hi,\n\nToday\'s editorial run shipped a destinations deliverable: a new local destination guide for Victoria Falls, Zimbabwe - the site\'s Zimbabwe-side falls town.\n\nWhy this one: the live Zimbabwe country page\'s headline is "Zimbabwe delivers falls and strong guiding" and every hero photo is of the falls, yet its Destinations rail listed only Masvingo. Meanwhile a full Victoria Falls cluster already existed (attraction guide, The Victoria Falls Hotel stay guide with nine photos, two activities and a first-visit insight) with no destination anchor tying it together.\n\nThe guide is sourced from the Zimbabwe Tourism Authority\'s Mosi-oa-Tunya page (the "Smoke that thunders", the largest single curtain of falling water in the world, 70% of the views from the Zimbabwe rain forest, Livingstone 1855) and UK FCDO entry requirements checked today (KAZA Univisa US$50 for 30 days covering Zimbabwe-Zambia travel and Botswana day trips, e-visa at evisa.gov.zw, yellow-fever certificate, cash declaration limits). It cross-links the attraction, both activity guides, the hotel and the planning insight.\n\nLive receipt: https://trekafricaguide.com/countries/zimbabwe/victoria-falls/ (HTTP 200, full destination layout, six-photo gallery - all assets HTTP 200, credited on /photo-credits; the Zimbabwe country rail now lists Victoria Falls first). Commit e7a5e2e pushed to main.\n\nBlockers: owner Gmail is still signed out on the work machine, so this and nine earlier progress emails remain stored as drafts pending one sign-in to send all of them; CMS mirror reconcile still pending on the Supabase side (travel_articles reads fine, local_destinations 404 to the publishable key, editorial_documents service-role only by design) - a quick owner-side check that local_destinations/victoria-falls imported would confirm the mirror.\n\nNext run rotates to activities.\n\n- OpenBot Trek editorial agent'
  }
};
fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
console.log('progress updated');
