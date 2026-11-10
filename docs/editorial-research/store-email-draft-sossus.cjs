const fs = require('fs');
const root = 'C:/Users/FOSCOD/OpenBot/Agents/agent-7e66c7d5-768a-4689-89ab-be30d19745b6/trek-photo-site';
const p = `${root}/docs/editorial-progress.json`;
const o = JSON.parse(fs.readFileSync(p, 'utf8'));

o.latest_run_checkpoint.status = 'published_pushed_live_confirmed';
o.latest_run_checkpoint.content_commit = '38cda24 (content) ; push 2cce7b6..38cda24 to main succeeded';
o.latest_run_checkpoint.live_verification = '2026-11-10, minutes after push: detail URL HTTP 200 (38,547 bytes); six gallery paths render; Stay22 CTA renders with campaign activities_sossusvlei_guided_dune_excursion and operator Desert Dunes and Dust Tours; /activities/ archive lists the page; Sesriem & Sossusvlei destination page links it; 6/6 JPEG assets HTTP 200 image/jpeg';
o.latest_run_checkpoint.cms = 'Publishable-key reconcile 2026-11-10: travel_articles 200 (2 seeded rows; no Sossusvlei rows), local_destinations 404 (not in schema cache), editorial_documents 401 to anon per RLS design; mirror pending; no writes attempted.';

o.deliverable_sossusvlei_guided_dune_excursion.status = 'published_pushed_live_confirmed';
o.deliverable_sossusvlei_guided_dune_excursion.publication = {
  content_commit: '38cda24',
  push: '2cce7b6..38cda24 to main succeeded',
  live_http_status: 200,
  email_id: null,
};

o.owner_email_draft = {
  prepared_at: '2026-11-10T14:40:00.000Z',
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek Africa Guide: Sossusvlei guided dune excursion published (activities rotation)',
  body: 'Hi Fsd,' +
    '\n\nNew deliverable: Sossusvlei guided dune excursion (https://trekafricaguide.com/activities/sossusvlei-guided-dune-excursion/), the first activity page for Namibia. It complements the existing Sesriem destination, Namib Desert attraction and the two Sossusvlei sunrise insights, and equals the golden-monkey activity format: About, Highlights, Best time, Planning notes, Booking option, Nearby stays.' +
    '\n\nReceipt: pushed as commit 38cda24 to main; live verified the same hour: HTTP 200, all six gallery photos loading (JPEG 200), booking rail renders, /activities/ archive lists the page and the Sesriem destination crosslinks it.' +
    '\n\nPhotos: six distinct Wikimedia Commons files with creator, licence and alt text carried in the photo library and credits section (Deadvlei dead camelthorn hero by Diego Delso, Big Daddy aerial, oryx, Dune 45 sunrise, Sesriem Canyon, crest view).' +
    '\n\nBooking: exact verified GetYourGuide product t1314104, 2-Day Scenic Sossusvlei Adventure Tour by Desert Dunes and Dust Tours, from EUR 754, 5.0/5 from 2 reviews (small sample), checked 10 November 2026.' +
    '\n\nBlockers: owner Gmail is signed out, so this report was not sent from Gmail (draft stored in docs/editorial-progress.json owner_email_draft). CMS mirror still pending by design: travel_articles reads 200, local_destinations 404 in schema cache, editorial_documents 401 to anon (service-role required); no writes attempted.' +
    '\n\nNext rotation: accommodations.',
};

fs.writeFileSync(p, JSON.stringify(o, null, 2));
console.log('owner email draft stored');
