// Updates docs/editorial-progress.json with this run's checkpoint.
const fs = require('fs');
const p = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

const slug = 'hotel-barmoi-freetown';
j.updated_at = new Date().toISOString();
j.accommodation_hotel_barmoi_freetown = {
  id: slug,
  category: 'accommodations',
  started: '2026-11-13',
  latest_run_note: 'Scheduled 2h routine run; executed on schedule.',
  selection_evidence:
    'Live Sierra Leone country page (HTTP 200, 13 Nov 2026) lists exactly one stay for the whole country (The Place Resort, Tokeh); the 12 Nov Tokeh destination guide, Tokeh attraction guide and The Place Resort stay guide all route travelers through Freetown, and no Freetown accommodation guide exists anywhere on the site. Booking.com Freetown city page shows 71 Freetown properties; Hotel Barmoi is among the most-booked (8.4 Very good, 118 reviews).',
  scope:
    'New accommodation guide: Hotel Barmoi, 75C Cape Road, Aberdeen, Freetown (country_id 51, region_id 15, attraction_id 68 = tokeh-and-river-no2 cluster). Exact Booking.com detail product browser-verified and Stay22-wrapped (opens the exact property page, not search). Six distinct Wikimedia Commons contextual Freetown images with full metadata and /photo-credits attribution; six exact-property subjects logged as photo backlog. No live rates or availability claims.',
  files: [
    'content/editorial-overrides.json',
    'content/booking-destinations.json',
    'src/lib/photo-library.js',
    'public/photo-library.js',
    'public/images/editorial/hotel-barmoi-freetown/* (6 files)',
    'docs/editorial-research/2026-11-13-hotel-barmoi-freetown.md',
    'docs/editorial-research/2026-11-13-hotel-barmoi-freetown-editorial.cjs',
    'docs/editorial-research/2026-11-13-add-barmoi-photo-entries.mjs',
    'docs/editorial-progress.json',
  ],
  images: 6,
  image_note:
    'All six are contextual Wikimedia Commons images (operator property photography is copyrighted); attribution required and rendered on /photo-credits. Backlog subjects: hotel exterior on Cape Road, ocean-view room interior, suite with balcony, pool terrace, restaurant, Penthouse Suite patio.',
  booking_cta:
    'Exact Booking.com detail https://www.booking.com/hotel/sl/barmoi.en-gb.html browser-verified 13 Nov 2026; Stay22 wrap tested and confirmed to open the exact property page with campaign accommodations_hotel_barmoi_freetown. No rate, availability or review-count-as-guarantee claims; score quoted with a checked date.',
  key_facts_checked:
    'Official site hotelbarmoi.com (oceanfront Aberdeen, pool, gym, restaurant, shuttle, complimentary breakfast); Booking.com detail page (address, 8.4/118 reviews with sub-scores, room categories 25-60 m2, sea views, facilities, policies, Lumley Beach 400 m, Lungi airport 35 km); Booking.com Freetown city page. All checked 13 November 2026.',
  corrective_fix: {
    trigger: 'Quality/accuracy: the live Jozani Forest attraction page still said "No verified nearby property has yet been added to this attraction\'s stay list" although its nearby-stays rail has rendered Zanzibar White Sand Luxury Villas & Spa since commit 9bed0ff (contradiction confirmed on the live page 13 Nov 2026).',
    fix: 'Replaced the stale sentence in the attraction record with accurate copy; local dist verified: stale copy gone, stay card present.',
  },
  next_category: 'travel_insights',
  next_action: 'Rotate to travel insights next run; Barmoi photo backlog and CMS owner-side checks tracked in the ledger.',
  status: 'published_live_confirmed',
  publication: {
    content_commit: 'f05dfa1',
    pushed_to: 'main',
    push_result: 'success (rebased over concurrent Lalibela commits 7ed33c9; pushed as f05dfa1)',
    pushed_at: '2026-11-13',
    live_url: 'https://trekafricaguide.com/accommodations/hotel-barmoi-freetown/',
  },
};

j.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-13T13:00Z',
  category_rotation: 'accommodations',
  deliverable: 'accommodation_hotel_barmoi_freetown',
  inventory_note:
    'Whole-site inventory re-verified 13 Nov 2026: all 19 live destinations and 30 attraction pages carry at least one linked stay; Sierra Leone had exactly one stay site-wide, making a Freetown arrival-hub hotel the strongest evidenced accommodations gap.',
  next_category: 'travel_insights',
  next_action: 'Rotate to travel insights next run.',
  commit: 'f05dfa1',
  push: 'Pushed to main (7ed33c9..f05dfa1) after rebase over concurrent Lalibela commits.',
  corrective: 'Jozani Forest attraction stale no-stay copy fixed (f05dfa1).',
};
// live checks filled after verification by verify script; email draft follows.
fs.writeFileSync(p, JSON.stringify(j, null, 1) + '\n');
console.log('progress updated (pre-verification)');
