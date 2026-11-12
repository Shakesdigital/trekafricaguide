// Record Accra City Hotel deliverable in docs/editorial-progress.json. One-off run script (12 Nov 2026).
const fs = require('fs');
const path = 'docs/editorial-progress.json';
const p = JSON.parse(fs.readFileSync(path, 'utf8'));

p.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-12T13:00Z',
  category_rotation: 'accommodations',
  deliverable: 'accommodation_accra_city_hotel',
  inventory_note: 'All 38 live destination guides carry at least one stay card; gap moved to accommodations-without-parent-stay coverage: no Accra accommodation guide existed site-wide despite the live Kwame Nkrumah Memorial Park attraction and Accra\'s role as the departure anchor for the Cape Coast/Elmina circuit.',
  next_category: 'destinations',
  next_action: 'Rotate to destinations next run. Queued destination candidates: Ethiopia (Lalibela — advisory-sensitive, queued) and Sierra Leone (Tokeh/Freetown peninsula). Also pending: six-subject photo backlogs (incl. Accra City Hotel, Lemon Beach Resort); owner Gmail still signed out so owner_email_draft unsent.',
  cms: 'Publishable-key reconcile 2026-11-12 (SUPABASE_PUBLISHABLE_KEY in repo .env; task key name TREK_SUPABASE_PUBLISHABLE absent from env): travel_articles 200 (seeded row id:2 only, no accra-city-hotel row — CMS import pending), local_destinations 404 (schema cache), editorial_documents 400 to anon (RLS by design); no writes attempted; owner-side CMS check to confirm accommodations/accra-city-hotel.'
};

p.accommodation_accra_city_hotel = {
  id: 'accra-city-hotel',
  category: 'accommodations',
  started: '2026-11-12',
  latest_run_note: 'Scheduled 13:00Z routine run; executed on schedule.',
  selection_evidence: 'Live /attractions/kwame-nkrumah-memorial-park/ (HTTP 200, 12 Nov 2026) renders no Nearby stays section at all, and the live accommodations archive (38 stays) holds zero Accra properties — Ghana has only Ridge Royal (Cape Coast) and Lemon Beach (Elmina). Accra is the international gateway (Kotoka) and the departure anchor the site\'s own Cape Coast/Elmina guides assume, with no downtown stay guide behind it.',
  scope: 'New accommodation guide: Accra City Hotel, Barnes Road, downtown Accra (four-star full-service city hotel; operator claims first international-branded hotel in Ghana, 1988, and 196 guest rooms). Four room categories with breakfast buffet and complimentary minibar per operator; pool, fitness centre, tennis court, THE CITY RESTAURANT, poolside terrace, lounge bar, free private parking/valet, free airport shuttle (~8 km from Kotoka, Booking.com), accessibility features. Zero-image honest publish; six-subject photo backlog logged.',
  files: [
    'content/editorial-overrides.json',
    'docs/editorial-research/2026-11-12-accra-city-hotel-accommodation.md',
    'docs/editorial-research/add-accra-city-hotel.cjs',
    'docs/editorial-progress.json'
  ],
  images: 0,
  image_followup: 'Six exact-property subjects: Barnes Road exterior, Standard/Superior room interior, Junior Suite, outdoor pool, THE CITY RESTAURANT, fitness/tennis. Official imagery operator-copyrighted; licensed-reuse review only; no substitutes.',
  booking_cta: 'Exact Booking.com detail https://www.booking.com/hotel/gh/accra-city-hotel.en-gb.html browser-verified 12 November 2026 (opened and read in a live browser session; stronger than the search-index standard). Stay22-wrapped via booking_url in built page (campaign accommodations_accra_city_hotel). No rate, availability or price claims; no booking-destinations.json entry needed (Lemon Beach pattern).',
  key_facts_checked: 'Official site accracityhotel.com home/rooms/food-beverages/about pages (HTTP 200, 12 Nov 2026): room categories and inclusions, dining (Sunday brunch, themed buffets, signature jollof/palava sauce), About-page heritage claims (1988 first international brand, first ISO-certified hotel in West Africa, 196 rooms) recorded as operator claims. Booking.com exact detail browser-verified 12 Nov 2026: 8.1 Very good from 116 reviews (ledger only, not copied into guide), facilities, accessibility, room types, 8 km/airport shuttle, ~2 km to beach. Booking.com reviews page browser-verified: undated guest comment cards (staff, breakfast buffet, 2 p.m. late checkout, repetitive-menu caveat). Tripadvisor aggregate via search index (page bot-walled behind slider CAPTCHA, not bypassed): 631 reviews, #20 of 144 Accra hotels, rated 3/5. Rebrand note: operator booking engine still runs at novotel-accra-city-centre.h-rez.com; recorded without asserting rebrand history.',
  build_checks: 'check:build-inputs passed; production build 164 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 169; dist verified pre-push (accommodation h2 flow, 7 practical_info <p> blocks, Stay22 CTA with exact source, attraction Nearby stays card, no markup leak).',
  status: 'published_live_confirmed',
  content_commit: 'e1fa582',
  publication: {
    content_commit: 'e1fa582',
    pushed_to: 'main',
    push_result: 'success (258c60a..e1fa582)',
    pushed_at: '2026-11-12',
    live_url: 'https://trekafricaguide.com/accommodations/accra-city-hotel/',
    live_http_status: 200,
    checked_at: '2026-11-12',
    live_distinctive_text: 'Accra City Hotel | Trek Africa Guide',
    live_checks: {
      detail: 'HTTP 200 (33,418 bytes) after the Netlify deploy; title correct; full accommodation h2 flow (Why stay here and how to plan your stay, Key amenities, Stay style and budget, What travelers say, Booking option, Other Nearby Accommodations, Nearby Attractions); distinctive copy renders (Barnes Road, first international-branded hotel, complimentary minibar, THE CITY RESTAURANT, free airport shuttle, 196 guest rooms, novotel-accra-city-centre.h-rez.com note); no exposed markup.',
      booking: 'Stay22-wrapped Booking.com exact-detail link confirmed in production HTML (campaign accommodations_accra_city_hotel).',
      cards: 'Nearby Attractions renders Kwame Nkrumah Memorial Park card; the attraction page now renders Nearby stays with the Accra City Hotel card (was absent this run).',
      archive_home: 'Accommodations archive and homepage search list the guide.',
      internal_links: 'All cross-link targets live HTTP 200 (Kwame Nkrumah Memorial Park attraction, Cape Coast Kakum attraction, Elmina destination, Ridge Royal Hotel).'
    },
    cms_source_commit: 'imported at source_commit e1fa582; publishable-key reconcile 2026-11-12: travel_articles 200 (seeded row only), local_destinations 404 (schema cache), editorial_documents 400 to anon (RLS); no writes attempted — owner-side CMS check to confirm accommodations/accra-city-hotel.'
  },
  owner_email_draft: {
    prepared: '2026-11-12',
    to: 'fsddanmugisa@gmail.com',
    status: 'unsent — owner Gmail signed out (accounts.google.com tab shows the sign-in page); stored here for sending on one sign-in, together with the Elmina and Sal drafts from earlier runs',
    subject: 'Trek Africa Guide: Accra City Hotel stay guide shipped and live',
    body: 'Hi,\n\nToday\'s editorial run shipped an accommodations deliverable: a new stay guide for the Accra City Hotel on Barnes Road, downtown Accra — the site\'s first Accra accommodation.\n\nWhy this one: the live Kwame Nkrumah Memorial Park attraction guide rendered no Nearby stays section at all, and Ghana had no Accra stay guide despite Accra being the international gateway and the departure anchor for the Cape Coast/Elmina castle circuit. The new guide closes both gaps — the attraction page now shows the stay card, and the guide cross-links the memorial park, Cape Coast/Kakum, Elmina and Ridge Royal.\n\nLive receipt: the page is live at https://trekafricaguide.com/accommodations/accra-city-hotel/ (HTTP 200, full stay-guide layout, honest no-photo state, verified Booking.com booking option). Commit e1fa582 pushed to main.\n\nPhotos: zero-image honest publish (no licensed exact-property photos found); a six-subject exact-property photo backlog is logged for a later pass.\n\nBlockers: owner Gmail is signed out on the work machine, so this and two earlier progress emails (Elmina, Sal) remain stored as drafts pending one sign-in; CMS mirror reconcile still pending on the Supabase side (travel_articles reads fine, editorial_documents is service-role only by design) — worth a quick owner-side check that the CMS imported source_commit e1fa582.\n\nNext run rotates to destinations; Ethiopia (Lalibela, advisory-sensitive) and Sierra Leone are the queued candidates.\n\n— OpenBot Trek editorial agent'
  }
};

fs.writeFileSync(path, JSON.stringify(p, null, 2) + '\n');
console.log('progress updated; keys now', Object.keys(p).length);
