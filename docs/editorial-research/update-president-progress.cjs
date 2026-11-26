const fs = require('fs');
const p = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

j.accommodation_president_hotel_bantry_bay = {
  id: 'president-hotel-bantry-bay',
  category: 'accommodations',
  started: '2026-11-16',
  run: 'scheduled-2h-2026-11-16T11:00Z',
  selection_evidence: 'Live accommodations archive (HTTP 200, 16 Nov 2026) holds 45 stays; Cape Town has exactly one (Mount Nelson, Gardens) while the live Cape Town destination page itself states "The Mount Nelson guide offers one published central accommodation option". The live base-by-outings insight names six Cape Town properties; only Mount Nelson has a site guide, and its whole Sea Point decision block has no stay behind it. Duplicate check passed: no existing slug covers the President Hotel or a Sea Point/Bantry Bay stay.',
  scope: 'New accommodation guide: President Hotel, 4 Alexander Road, Bantry Bay (Sea Point), Cape Town. Room families (Classic ~31 sqm from R4,000 pp/night, Suites ~49 sqm from R5,000, Apartments ~49 sqm from R7,000, all operator-listed 16 Nov 2026), five on-site dining venues, Cove Wellness Spa, heated infinity pool, Green Key certification, documented accessibility/inclusion provision (accessible rooms, Deafgard, guide dogs, kosher-experienced kitchen, Crescent Rating 5/7, Autism SA-trained staff), location facts (Saunders\' Rock ~100 m, Queen\'s Beach ~150 m, airport ~25 min / 24 km), check-in 14:00 / check-out 11:00. Six licensed destination-setting gallery images (no free-licence property photo exists); each labelled as not a photograph of the accommodation.',
  files: [
    'content/editorial-overrides.json',
    'content/booking-destinations.json',
    'src/lib/photo-library.js',
    'public/photo-library.js',
    'public/images/editorial/president-hotel-bantry-bay/',
    'docs/editorial-research/2026-11-16-president-hotel-bantry-bay-accommodation.md',
    'docs/editorial-research/add-president-hotel-accommodation.cjs',
    'docs/editorial-research/add-president-booking-destination.cjs',
    'docs/editorial-research/insert-president-photos.cjs',
    'docs/editorial-progress.json',
  ],
  images: 6,
  image_note: 'No free-licence photograph of the President Hotel building exists on Wikimedia Commons (searched 16 Nov 2026). Gallery uses six licensed destination-setting images (CC BY-SA 4.0 x3 Rabich, CC BY-SA 4.0 SkyPixels, CC0 O\'Nolan, CC BY-SA 3.0 Hilton1949), SHA-256 per file in both photo-library files, credited on /photo-credits, each labelled destination-setting. No generated substitutes, no reuse from the Cape Town country/attraction sets.',
  booking: 'Direct exact Booking.com property detail (booking.com/hotel/za/president-cape-town.en-gb.html, the URL the live Cape Town base-by-outings insight has linked since 18 Oct 2026) browser-verified 16 Nov 2026: 8.5/10 from 2,822 reviews, location 9.4, check-in 14:00, 16 room types, Green Key. Stay22 wrapper audit: wrap lands on searchresults.html dest_id=15195 twice in a row, not the exact detail landing; CTA suppressed per the kibale-forest-camp hold precedent and the page renders the honest "not yet available" booking panel with the exact Booking.com page named in copy as the direct reference. No rate or availability claims beyond operator-listed figures with reconfirm hedge.',
  key_facts_checked: 'President Hotel official site (home, rooms, suites, apartments, location, guest information) checked 16 Nov 2026; Booking.com exact property detail browser-verified 16 Nov 2026; UK FCDO South Africa entry requirements checked 16 Nov 2026 (online traveller declaration from 1 Jul 2026; cash declaration ZAR 25,000 / USD 10,000); live Cape Town cluster re-read 16 Nov 2026.',
  build_checks: 'check:build-inputs passed; production-parity build (EDITORIAL_CMS_SYNC=false) 183 pages; readability guard passed on 188 pages; built detail page checked for the full accommodation h2 flow (Why stay here and how to plan your stay, Key amenities, Stay style and budget, What travelers say, Booking option, Other Nearby Accommodations, Nearby Attractions), all six gallery images referenced, photo-credits lists all six, no template-markup leak (the }} hit is the same inline custom-element JS present on the published mount-nelson page), no exposed stay22 CTA.',
  cms: 'Publishable-key reconcile 2026-11-16: travel_articles 200, local_destinations 404 (schema cache), editorial_documents 401 42501 permission denied (RLS by design); no writes attempted. Production deploy imports at source_commit; owner-side CMS check to confirm accommodations/president-hotel-bantry-bay.',
  next_category: 'destinations',
  next_action: 'Rotate to destinations next run. Six-photo property backlog (exact-subject, licensed) remains in the ledger; recheck the Stay22 wrap of the President booking URL before reactivating the CTA.',
  status: 'published_live_confirmed',
};

j.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-16T11:00Z',
  category_rotation: 'accommodations',
  deliverable: 'accommodation_president_hotel_bantry_bay',
  inventory_note: 'Rolling inventory maintained 16 November 2026 from live directories: accommodations archive (45 stays; Cape Town one stay), Cape Town destination page ("one published central accommodation option"), base-by-outings insight (six properties named, one covered), activities archive and travel-insights archive re-checked for duplicate slugs. Previous 16 Nov runs shipped travel insights (Lalibela decision story) and Tunis photo enrichment; accommodations rotation due.',
  next_category: 'destinations',
  next_action: 'Rotate to destinations next run. Check the live destinations archive for an evidenced gap before writing (flagged in the ledger); six-photo property backlog and the President Stay22-wrap recheck remain open items.',
  commit: 'see publication.content_commit',
  push: 'see publication.push_result',
  live_receipt: 'see publication.live_url / live_checks',
  cms: 'Publishable-key reconcile: travel_articles 200; local_destinations 404 (schema cache); editorial_documents 401 RLS-blocked by design. No writes. Owner-side CMS check pending for accommodations/president-hotel-bantry-bay.',
  email: 'Owner email prepared as draft (Gmail signed out in the OpenBot browser, re-checked 16 Nov 2026); stored in accommodation_president_hotel_bantry_bay.owner_email_draft.',
};

j.accommodation_president_hotel_bantry_bay.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek Africa Guide: President Hotel (Sea Point) stay guide shipped and live',
  body: 'Hi,\n\nToday\'s editorial run shipped an accommodations deliverable: a new stay guide for the President Hotel in Bantry Bay, Cape Town — the first Sea Point/Atlantic Seaboard stay in the catalogue.\n\nWhy this one: the live Cape Town destination page itself states that only one central accommodation option (Mount Nelson) is published, and the "Where to stay in Cape Town" insight names six properties across City Bowl, Sea Point and Camps Bay — yet only Mount Nelson had a site guide. The insight\'s Sea Point base had nothing behind it. The new guide anchors that choice: room families with operator-listed from-rates (Classic from R4,000, Suites from R5,000, Apartments from R7,000 per person per night), five on-site dining venues, the spa and infinity pool, Saunders\' Rock 100 m away, and unusually well-documented inclusion provision (accessible rooms, Deafgard devices, guide dogs, kosher-experienced kitchen, Crescent Rating 5/7, Autism SA-trained staff).\n\nSourcing: the hotel\'s official site and the exact Booking.com property page, both checked today (Booking.com: 8.5/10 from 2,822 reviews, location 9.4; no rating or review count is published in the guide copy). Six licensed destination-setting photographs are registered with creator, source, licence and alt text — no free-licence photo of the property itself exists, so each image is labelled as a destination setting, not the hotel.\n\nLive receipt: https://trekafricaguide.com/accommodations/president-hotel-bantry-bay/ — HTTP 200, full accommodation layout matching the house flow, six gallery images all referenceable, credited on /photo-credits, no markup leak.\n\nOne booking note: the exact Booking.com detail URL verifies cleanly, but the affiliate wrap of it currently lands on a single-destination results page instead of the exact detail page, so the booking card is deliberately held back (house rule from the Kibale precedent) and the page points readers to the exact Booking.com page directly. A one-line wrap recheck reactivates the card.\n\nBlockers: owner Gmail is still signed out on the work machine, so this joins the pending draft queue — one sign-in ships it with the earlier drafts. CMS mirror: travel_articles reads fine (200), local_destinations 404 to the publishable key, editorial_documents service-role-only by design — a quick owner-side CMS check that accommodations/president-hotel-bantry-bay imported would confirm the mirror.\n\nNext run rotates to destinations.\n\n- OpenBot Trek editorial agent',
  prepared_at: '2026-11-16T14:30:00Z',
  status: 'pending_gmail_signin',
};

fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
console.log('progress updated');
