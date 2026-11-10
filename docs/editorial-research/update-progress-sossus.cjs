const fs = require('fs');
const root = 'C:/Users/FOSCOD/OpenBot/Agents/agent-7e66c7d5-768a-4689-89ab-be30d19745b6/trek-photo-site';
const p = `${root}/docs/editorial-progress.json`;
const o = JSON.parse(fs.readFileSync(p, 'utf8'));

o.updated_at = '2026-11-10T14:35:00.000Z';

o.latest_run_checkpoint = {
  date: '2026-11-10 (13:00 UTC scheduled run)',
  run: 'editorial content run (activities - Sossusvlei guided dune excursion)',
  status: 'published_local_pending_push',
  live_url: 'https://trekafricaguide.com/activities/sossusvlei-guided-dune-excursion/',
  deliverable_summary: 'New activity "Sossusvlei guided dune excursion" (activities rotation, Namibia cluster): gate-to-dune outing from Sesriem with the honest 2026 shuttle/4x4 caveats, Deadvlei pan walk vs Big Daddy climb choice, NWR checked drive rates (shuttle N$180 pp Nov 2026-Jun 2027, guided morning drives N$600/700, Elim sunset drive N$300, canyon drive N$200), and an exact verified GetYourGuide product (t1314104, Desert Dunes and Dust Tours, from EUR 754). Six distinct licensed Commons photos wired as record gallery (activities pipeline strips inline body figures).',
  evidence: 'Live activities directory (checked 10 Nov 2026): 21 published pages, zero for Namibia, vs a seven-entry live Namibia cluster (country, Sesriem & Sossusvlei destination, Namib Desert attraction, three stays, two sunrise insights). No prior activity slug for Sossusvlei; the two sunrise insights cover planning decisions, and this page covers the outing product itself.',
  photos: 'Six distinct new Wikimedia Commons files verified on file pages, downloaded via Special:Redirect/file at 1,800-1,920 px sequential, SHA-256 recorded, visually inspected: Deadvlei dead camelthorn on white pan (Diego Delso CC BY-SA 4.0 2018, hero/gallery 1), Big Daddy aerial (Reinhard Kraasch CC BY-SA 4.0 2019), oryx in front of Big Daddy (Christoph Strässler CC BY-SA 2.0 2021), sunrise from Dune 45 (Philipp Schäufele CC BY-SA 3.0 2006), Sesriem Canyon interior (Diego Delso CC BY-SA 4.0 2018), view west from Big Daddy (Greg Willis CC BY-SA 3.0 2006).',
  build_checks: 'check-build-inputs passed; production build 147 pages; readability guard passed on 152 pages; all six gallery JPEG assets present in dist.',
  content_commit: 'pending this run (see git log)',
  quality_bar: 'Compared dist HTML against /activities/volcanoes-golden-monkey-trekking/ in the same run: h2 flow About/Highlights/Best time/Planning notes/Booking option/Nearby stays matches (You may also like is template-gated on a second same-country activity and does not exist without one); Stay22 CTA with campaign activities_sossusvlei_guided_dune_excursion and operator/notes render in About this option; six gallery tiles wire the photos.',
  live_verification: 'pending push',
  cms: 'pending reconcile below',
};

o.rotation = {
  last_completed_category: 'activities',
  next_category: 'accommodations',
  next_deliverable: 'Sossusvlei guided dune excursion published 2026-11-10 (activities rotation); next run rotates to accommodations / new destinations before insights.',
  rule: 'Finish the individual deliverable and report its live state, then rotate.',
};

o.deliverable_sossusvlei_guided_dune_excursion = {
  id: 'sossusvlei-guided-dune-excursion',
  status: 'published_local_pending_push',
  started: '2026-11-10',
  category: 'activities',
  scope: 'New Sossusvlei guided dune excursion activity record under attraction 60 (namib-desert) with an exact verified GYG product and six licensed Commons gallery photos; local-destination cluster link added on sesriem-sossusvlei.',
  files: [
    'content/editorial-overrides.json',
    'content/booking-destinations.json',
    'content/local-destinations.json',
    'src/lib/photo-library.js',
    'public/photo-library.js',
    'public/images/editorial/sossusvlei-deadvlei-walk/ (6 files)',
    'docs/editorial-research/2026-11-10-sossusvlei-guided-dune-excursion.md',
    'docs/editorial-progress.json'
  ],
  booking_destination: 'GetYourGuide t1314104 "2-Day Scenic Sossusvlei Adventure Tour", operator Desert Dunes and Dust Tours, from EUR 754, 5.0/5 (2 reviews, small sample, checked 2026-11-10), minimum 2 pax, 24 h free cancellation.',
  key_facts_checked: 'NWR Sesriem Campsite rate sheet (shuttle to Deadvlei stage N$180 pp, Elim sunset drive N$300, canyon drive N$200, guided morning drives N$600/700, Nov 2026-Jun 2027), MEFT FAQ permits-issued-at-gate, MEFT Namib-Naukluft overview, MEFT shuttle-concession clarification title (existence evidence only), NWR distance table 60 km / 334 km via the destination page; all checked 2026-11-10.',
  publication: { content_commit: 'pending this run', live_http_status: null, email_id: null },
  note: 'Two Sossusvlei sunrise insights pre-existed; the new page is the outing product guide, and the destination page links both. The April 2026 park-fee PDF is a scan and yielded no extractable figures.',
};

fs.writeFileSync(p, JSON.stringify(o, null, 2));
console.log('progress updated');
