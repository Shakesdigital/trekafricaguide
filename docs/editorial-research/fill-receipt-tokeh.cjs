// Fill publication receipt for the Tokeh destination deliverable. One-off run script.
const fs = require('fs');
const path = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const rec = j.destination_tokeh_river_number_two;
rec.content_commit = '517313e';
rec.publication = {
  content_commit: '517313e',
  pushed_to: 'main',
  push_result: 'success (2aef6fb..517313e)',
  pushed_at: '2026-11-12',
  live_url: 'https://trekafricaguide.com/countries/sierra-leone/tokeh-river-number-two/',
  live_http_status: 200,
  checked_at: '2026-11-12',
  live_distinctive_text: 'Tokeh and River Number Two, Sierra Leone | Trek Africa Guide',
  live_checks: {
    detail: "HTTP 200 (33,271 bytes) after the Netlify deploy; title correct; destination layout renders; distinctive copy renders (River Number 2 'one of Sierra Leone's most alluring and celebrated attractions', ministry's 15 km distance, Tokeh 'approximately twenty miles' near York, The Place resort, harmattan Dec-Feb, evisa.sl, yellow-fever guidance); honest zero-image state; no exposed markup.",
    cards: 'Attractions to explore renders tokeh-and-river-no2; Where to stay renders the-place-resort-tokeh (both targets live HTTP 200).',
    country_rail: 'Sierra Leone country page now renders the tokeh-river-number-two card (was no Destinations rail this run).',
    archive_home: 'Homepage search lists /countries/sierra-leone/tokeh-river-number-two.'
  },
  cms_source_commit: 'imported at source_commit 517313e; publishable-key reconcile 2026-11-12: travel_articles 200 (3 rows), local_destinations 404 (schema cache), editorial_documents 400 to anon (RLS); no writes attempted - owner-side CMS check to confirm local_destinations/tokeh-river-number-two.'
};
rec.owner_email_draft = {
  prepared: '2026-11-12',
  to: 'fsddanmugisa@gmail.com',
  status: "unsent - owner Gmail signed out (accounts.google.com tab shows the sign-in page); stored here for sending on one sign-in, together with the earlier Accra City Hotel, Elmina and Sal drafts",
  subject: 'Trek Africa Guide: Tokeh and River Number Two destination guide shipped and live',
  body: 'Hi,\n\nToday\'s editorial run shipped a destinations deliverable: a new local destination guide for Tokeh and River Number Two - Sierra Leone\'s first destination guide on the site.\n\nWhy this one: the live Sierra Leone country page rendered no Destinations rail at all, and the site\'s Tokeh/River No. 2 attraction guide and The Place Resort stay guide had no anchor page tying the peninsula coast together. Ethiopia (Lalibela) was the other queued candidate but is advisory-sensitive, so Sierra Leone went first.\n\nThe guide is sourced from the Ministry of Tourism (tourism.gov.sl) beach directory - River Number 2 described as one of Sierra Leone\'s most alluring and celebrated attractions, 15 km from Freetown, next to Tokeh Beach - and the National Tourist Board\'s climate, entry and health guidance (dry November-April, harmattan December-February, e-visa, yellow fever, malaria). It cross-links the attraction and stay guides; both are live.\n\nLive receipt: https://trekafricaguide.com/countries/sierra-leone/tokeh-river-number-two/ (HTTP 200, destination layout, country page now shows the Sierra Leone destinations rail). Commit 517313e pushed to main.\n\nPhotos: zero-image honest publish (no licensed exact-location photos found); a six-subject photo backlog is logged for a later pass.\n\nBlockers: owner Gmail is signed out on the work machine, so this and three earlier progress emails (Accra City Hotel, Elmina, Sal) remain stored as drafts pending one sign-in; CMS mirror reconcile still pending on the Supabase side (travel_articles reads fine, local_destinations table returns 404 to the publishable key, editorial_documents is service-role only by design) - worth a quick owner-side check that the CMS imported source_commit 517313e.\n\nNext run rotates to accommodations.\n\n- OpenBot Trek editorial agent'
};
fs.writeFileSync(path, JSON.stringify(j, null, 2) + '\n');
console.log('receipt filled');
