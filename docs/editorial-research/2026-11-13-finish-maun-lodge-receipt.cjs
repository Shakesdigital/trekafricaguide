// Complete the Maun Lodge publication receipt left PENDING by the cut-off 07:13Z run.
const fs = require('fs');
const path = 'docs/editorial-progress.json';
const p = JSON.parse(fs.readFileSync(path, 'utf8'));

const rec = p.accommodation_maun_lodge;
rec.latest_run_note = 'Scheduled 15:00Z routine run; the 07:13Z run had published the guide (commits 7a18af7 + 3286342) but was cut off before the receipt. This run verified live and completed the record.';
rec.content_commit = '3286342';
rec.publication = {
  content_commit: '3286342',
  pushed_to: 'main',
  push_result: 'success (publish commit 7a18af7, country-association correction 3286342; both on main)',
  pushed_at: '2026-11-13',
  live_url: 'https://trekafricaguide.com/accommodations/maun-lodge/',
  live_http_status: 200,
  checked_at: '2026-11-13',
  live_distinctive_text: 'Maun Lodge | Trek Africa Guide',
  live_checks: {
    detail: "HTTP 200 (33,882 bytes); title correct; full accommodation h2 flow (Why stay here and how to plan your stay, Key amenities, Stay style and budget, What travelers say, Booking option, Nearby Attractions); distinctive copy renders (Thamalakane River, 2.5 km from town centre, 4 km from Maun International Airport, five room categories, Boma restaurant, 500-delegate conference, +267 686 3939); no template/markup leak markers (no {{, }} or unrendered island markup).",
    booking: "Exact Stay22-wrapped Booking.com detail (booking.com/hotel/bw/maun-lodge) confirmed in production HTML with campaign accommodations_maun_lodge.",
    cards: "Maun destination page links maun-lodge; accommodations archive and homepage search list the guide (all fetched live 13 Nov 2026).",
    internal_links: "okavango-mokoro-safari activity, camp-okavango and chobe-safari-lodge cross-links all present in live HTML.",
    images: "Honest zero-image state (six-subject exact-property backlog in ledger)."
  },
  cms_source_commit: 'imported at source_commit 3286342; publishable-key reconcile 2026-11-13 (this run): travel_articles 200 (queryable; no maun-lodge row - accommodations are not in this mirror table), local_destinations 404 (schema cache), editorial_documents 401 to anon (RLS by design); no writes attempted - owner-side CMS check to confirm accommodations/maun-lodge.'
};
rec.owner_email_draft = {
  prepared: '2026-11-13',
  to: 'fsddanmugisa@gmail.com',
  status: 'unsent - owner Gmail signed out (accounts.google.com sign-in tab open on the work machine); stored here for sending on one sign-in, together with the seven earlier pending drafts',
  subject: 'Trek Africa Guide: Maun Lodge stay guide shipped and live',
  body: "Hi,\n\nThe Maun Lodge accommodation guide (Thamalakane River, Maun, Botswana) was published and pushed to main (commit 7a18af7, country-association correction 3286342); this run completed the live verification the prior run was cut off before finishing.\n\nWhy this one: the live Maun destination page calls Maun the country's tourism capital, but its Where-to-stay rail showed only Camp Okavango, a fly-in Delta island camp - no Maun town hotel existed site-wide. Maun Lodge is a 140-room riverfront lodge 2.5 km from town centre and 4 km from the airport.\n\nLive receipt: https://trekafricaguide.com/accommodations/maun-lodge/ (HTTP 200, full stay-guide layout, exact Booking.com booking option Stay22-wrapped, Maun destination + archive + homepage search all list it). Zero-image honest publish; six exact-property photo subjects logged for a later pass.\n\nBlockers: owner Gmail is signed out on the work machine, so this and seven earlier progress emails remain stored as drafts pending one sign-in; CMS mirror reconcile still pending on the Supabase side (travel_articles reads fine, local_destinations 404 to the publishable key, editorial_documents service-role only by design) - worth a quick owner-side check that the CMS imported source_commit 3286342.\n\nNext run rotates to travel insights.\n\n- OpenBot Trek editorial agent"
};

p.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-13T15:00Z',
  category_rotation: 'accommodations (completion of the cut-off 07:13Z run)',
  deliverable: 'accommodation_maun_lodge',
  inventory_note: 'Whole-site inventory maintained; Maun Lodge found already published and live by the interrupted 07:13Z run (commits 7a18af7/3286342), so this run closed its receipt rather than duplicating a deliverable.',
  next_category: 'travel_insights',
  next_action: 'Rotate to travel insights next run.',
  commit: 'PENDING_COMMIT',
  push: 'Content already on main; this run commits the receipt/checkpoint only.',
  live_receipt: 'https://trekafricaguide.com/accommodations/maun-lodge/ HTTP 200 (33,882 B), full accommodation h2 flow, distinctive copy, exact Stay22 Booking.com CTA, destination/archive/home cards all live, no markup leak.',
  cms: 'Publishable-key reconcile 2026-11-13: travel_articles 200 (no maun-lodge row - accommodations not mirrored there), local_destinations 404 (schema cache), editorial_documents 401 to anon (RLS); no writes attempted.',
  email: 'Owner progress email drafted and pending send (Gmail signed out on the work machine); draft stored in the record (eighth pending draft, one sign-in ships all).'
};

p.updated_at = new Date().toISOString();
fs.writeFileSync(path, JSON.stringify(p, null, 1) + '\n');
console.log('progress updated');
