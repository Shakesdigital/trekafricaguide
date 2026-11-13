// Finalizes the run record: live checks, CMS mirror status, owner email draft.
const fs = require('fs');
const p = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

const rec = j.accommodation_hotel_barmoi_freetown;
rec.publication.live_http_status = 200;
rec.publication.checked_at = '2026-11-13';
rec.publication.live_checks = {
  detail:
    'HTTP 200 (39,128 B); title "Hotel Barmoi, Freetown | Trek Africa Guide"; full site-standard h2 flow (Why stay here and how to plan your stay, Key amenities, Stay style and budget, What travelers say, Booking option, Other Nearby Accommodations, Nearby Attractions); no exposed markup.',
  booking:
    'Exact Stay22-wrapped Booking.com detail CTA with campaign accommodations_hotel_barmoi_freetown; wrapped URL browser-verified 13 Nov 2026 to open the exact property page.',
  cards:
    'Sierra Leone country page, tokeh-and-river-no2 attraction rail, accommodations archive and homepage search all list the guide (verified live).',
  cross_links: 'Nearby Attractions renders the Tokeh and River Number Two card; Other Nearby Accommodations renders The Place Resort card.',
  images: 'All six gallery JPEGs HTTP 200 image/jpeg; attribution rendered site-wide on /photo-credits.',
  corrective:
    'Jozani Forest attraction live page: stale "No verified nearby property" sentence gone; Zanzibar White Sand stay card present.',
};
rec.cms =
  'Publishable-key reconcile 2026-11-13: travel_articles 200 (rows present), local_destinations 404 (schema cache), editorial_documents 401 to anon (RLS by design); no writes attempted - owner-side CMS check to confirm accommodations/hotel-barmoi-freetown imported.';

j.latest_run_checkpoint.live_receipt =
  'https://trekafricaguide.com/accommodations/hotel-barmoi-freetown/ HTTP 200, 7 h2s, 6 distinct licensed photos all HTTP 200 image/jpeg, exact Stay22 Booking.com CTA, no markup leak. Corrective Jozani copy fix live-verified.';
j.latest_run_checkpoint.cms =
  'Publishable-key reconcile 2026-11-13: travel_articles 200, local_destinations 404 (schema cache), editorial_documents 401 to anon (RLS); no writes attempted.';
j.latest_run_checkpoint.email =
  'Owner progress email drafted and pending send (Gmail sign-in still pending on the work machine); draft stored below as owner_email_draft (seventh pending draft, one sign-in ships all).';

j.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek editorial run 13 Nov: Freetown stay guide shipped and live',
  body:
    'Hi,\n\n' +
    "Today's editorial run shipped an accommodations deliverable: a new stay guide, \"Hotel Barmoi, Freetown\" (Aberdeen oceanfront, Cape Road).\n\n" +
    'Why this one: the live Sierra Leone country page listed exactly one stay for the whole country (The Place Resort at Tokeh), yet every Sierra Leone guide routes travelers through Freetown, the arrival hub across the harbour from Lungi airport. A city-side base was the strongest evidenced gap. The guide covers the oceanfront position about 400 m from Lumley Beach, room categories from Standard Double to the Penthouse Suite with sea views and balconies, pool, gym and restaurant, arrival transfer planning (Lungi is about 35 km), and check-in/payment practicalities.\n\n' +
    'Receipts: the exact Booking.com detail page was verified in the browser and the Stay22-wrapped CTA tested to open the property page directly (not a search). Six distinct licensed Wikimedia Commons Freetown photos are in the gallery with on-site attribution (/photo-credits); the property\'s own photos stay out because they are operator-copyrighted, so six exact-property subjects are logged as the next photo backlog.\n\n' +
    'Live receipt: https://trekafricaguide.com/accommodations/hotel-barmoi-freetown/ - HTTP 200, full site-standard section flow, no markup leak, all six photos HTTP 200. Commit f05dfa1 pushed to main after a rebase over the concurrent Lalibela commits.\n\n' +
    'Corrective fix in the same run: the Jozani Forest attraction page still claimed "no verified nearby property" even though the Zanzibar White Sand stay card has rendered under it since 10 Nov; the stale sentence is now replaced and live-verified.\n\n' +
    'Blockers: Gmail on the work machine is still signed out, so this is draft number seven pending one sign-in to send all of them. CMS mirror remains read-only from here (editorial_documents needs the Netlify-held service role); a quick owner-side check that accommodations/hotel-barmoi-freetown imported would confirm the mirror.\n\n' +
    'Next rotation: travel insights.\n\n' +
    '- Trek editorial agent\n',
  prepared_at: new Date().toISOString(),
  status: 'pending_gmail_signin',
};

fs.writeFileSync(p, JSON.stringify(j, null, 1) + '\n');
console.log('finalized');
