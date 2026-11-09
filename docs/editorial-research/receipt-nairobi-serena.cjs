// Receipt commit: record Nairobi Serena deliverable + rotation in docs/editorial-progress.json.
const fs = require('fs');
const p = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.updated_at = '2026-11-09T15:35:00.000Z';
j.rotation.last_completed_category = 'accommodations';
j.rotation.next_category = 'travel_insights';
j.rotation.next_deliverable = 'Nairobi Serena Hotel accommodation published this run and live-verified; next run rotates to travel insights and re-verifies the travel-insights archive before picking the next evidenced story.';
j.current_deliverable = {
  category: 'travel_insights - next run',
  rotation: 'attractions after that',
  note: 'Nairobi Serena shipped 2026-11-09 (content 90a38b6); next category: travel insights. Nyungwe numeric-vs-repo pairing anomaly remains an owner-side item.'
};
j.accommodation_nairobi_serena = {
  id: 'nairobi-serena-hotel',
  category: 'accommodations',
  started: '2026-11-09',
  scope: "New accommodation record: Nairobi Serena Hotel, the site's first Nairobi city-stay guide (region 14 east-africa, country_id 46 kenya). Fills the empty stay surface on the live Nairobi destination page, which previously rendered no Where-to-stay rail at all; Kenya stays were all in-park (Mara/Amboseli).",
  evidence: "Live /countries/kenya/nairobi (HTTP 200, 9 Nov 2026) had no stays rail; live /accommodations archive listed zero Nairobi properties; the page's own copy already instructs readers to 'build a rested night in the city'. Precisely the gap Kigali Serena closed for Kigali earlier today.",
  files: ['content/editorial-overrides.json', 'content/booking-destinations.json', 'content/local-destinations.json', 'docs/editorial-research/2026-11-09-nairobi-serena-hotel.md', 'docs/editorial-research/add-nairobi-serena-accommodation.cjs', 'docs/editorial-research/link-nairobi-serena.cjs'],
  images: 0,
  image_followup: 'Six distinct licensed exact-property subjects (backlog in the ledger): exterior beside Central Park, Deluxe room, Premium skyline room, Superior balcony space, Mandhari/Aksum interior, pool terrace. No substitutes; the official site imagery is operator-copyrighted.',
  booking_destination: 'Exact Booking.com property detail https://www.booking.com/hotel/ke/nairobi-serena.html, search-verified 9 November 2026 (address Kenyatta Avenue, 00100 Nairobi, matches the official location); registered in content/booking-destinations.json as accommodations_nairobi_serena_hotel and Stay22-wrapped in the built page. Direct OTA fetch automation-blocked (Ridge Royal standard): no rate, availability, numeric rating or review-count published.',
  key_facts_checked: 'Official serenahotels.com/nairobi (full page fetched 9 Nov 2026): five-star positioning beside Central Park near the CBD and a short drive from JKIA; 196 remodeled rooms and suites (operator count; conflicting third-party 183 figure NOT published); nine categories with sizes (Deluxe 26 sqm through Chale Presidential Suite 167 sqm on the highest floor with private fitness studio); Executive Room 5th-floor and Premium 6th-7th-floor lounge/tier perks; heated pool, Maisha Health Club & Spa (treatments at a fee); six dining venues (Herbs & Spices 11:00-23:00, Mandhari fine dining closed Sundays, Cafe Maghreb themed dinners, Aksum/Bambara/Pool Bars); 24-hour room service; Ballroom + named meeting rooms five minutes from the CBD. Booking.com search-verified for the exact property URL and address.',
  build_checks: 'check-build-inputs passed; production build 141 pages (Supabase + Stay22 envs, EDITORIAL_CMS_SYNC=false); readability guard passed on 146 pages; built detail page carries the full site-standard h2 flow, the Stay22-wrapped exact destination (campaign accommodations_nairobi_serena_hotel), an internal link to /countries/kenya/nairobi and no exposed markup; built Nairobi destination page gained the Where-to-stay h2 with the stay card (dist verified before push).',
  publication: {
    content_commit: '90a38b6',
    pushed_to: 'main',
    push_result: 'success (2f08ef1..90a38b6)',
    live_url: 'https://trekafricaguide.com/accommodations/nairobi-serena-hotel/',
    live_http_status: 200,
    checked_at: '2026-11-09',
    live_checks: {
      detail: 'HTTP 200 (25,056 bytes) minutes after push; title "Nairobi Serena Hotel | Trek Africa Guide"; full h2 flow (Why stay here and how to plan your stay, Key amenities, Stay style and budget, Booking option, Other Nearby Accommodations, Nearby Attractions); official facts render (196 rooms, nine categories with sizes, six venues, Maisha Spa, Ballroom); Booking option renders the exact Stay22-wrapped Booking.com URL (booking.com/hotel/ke/nairobi-serena.html); honest Other Nearby Accommodations empty state; no exposed markup.',
      destination: '/countries/kenya/nairobi/ now renders "Where to stay" with the Nairobi Serena card (was absent this morning) — the run closed the empty-stays gap on the destination page itself.',
      archive_home_country: 'Accommodations archive (4 refs), homepage search (2 refs) and Kenya country page (4 refs) each list the guide.',
      other_links: 'Internal link from detail prose to the Nairobi guide live; formatting matches the Kigali Serena / Fairway accommodation pattern.'
    },
    cms_source_commit: 'imported at source_commit 90a38b6; publishable-key read of editorial_documents remains RLS-blocked by design — owner-side CMS check to confirm accommodations/nairobi-serena-hotel'
  },
  next_category: 'travel_insights',
  next_action: 'Rotate to travel insights next run; re-verify the travel-insights archive and pick the next evidenced story; six-property-photo backlog tracked in the ledger.',
  status: 'published_live_confirmed',
  commit: '90a38b6 (content) + this receipt commit'
};
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
console.log('progress updated; rotation ->', j.rotation.next_category);
