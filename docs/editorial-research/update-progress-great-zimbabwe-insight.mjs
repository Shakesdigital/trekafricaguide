// Update docs/editorial-progress.json for the 2026-11-11 13:00Z run
import fs from 'node:fs';
const p = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

j.travel_insight_great_zimbabwe_monument_days = {
  id: 'plan-great-zimbabwe-monument-days-from-masvingo',
  category: 'travel_insights',
  started: '2026-11-11',
  latest_run_note: 'Scheduled 13:00 UTC routine run; executed on schedule (started ~13:05Z). Checkout: C:/Users/FOSCOD/.codex/artifacts/trek-photo-site (old C:/Users/TECH DEAL path no longer exists on this machine; brief re-read from the routine task text).',
  selection_evidence: 'Live travel-insights archive (HTTP 200, 11 Nov 2026) holds 14 stories with zero Zimbabwe coverage, while the site completed a full Zimbabwe cluster the same day (country guide, Great Zimbabwe monument attraction, guided monument visit activity, Great Zimbabwe Hotel stay, Masvingo destination). The live Masvingo destination page rendered no Travel insights card at all (travel_insight_slugs empty; zero travel-insights refs in live HTML). The live monument attraction instructs "Plan the visit from Masvingo and allow time for uneven paths, a steep hill section" with no pacing/road/second-day answer anywhere. Duplicate check passed against all 14 published slugs (Victoria Falls insight covers the falls only).',
  scope: 'New travel insight: pacing a Great Zimbabwe monument trip — one Masvingo night or two, the A4 road plan (~4 h Harare/Bulawayo, ~8 h Victoria Falls, attributed planning figures), the no-scheduled-transport reality and shuttle/minibus options, a four-hour monument-morning plan (gates usually 08:00-17:00 per the dated travel guide), Hill Complex difficulty and living-sacred-site etiquette, guide-or-not, second-day Murray McDougall lake circuit ("Zimbabwe\'s garden route") + Lake Kyle Recreational Park + Chesvingo Karanga Village, April-September window, confirm-before-you-book checklist (dated US$15 non-resident fee hedge), FAQ and continue-planning rails. Masvingo destination travel_insight_slugs updated — the page\'s first insight card.',
  files: [
    'content/editorial-overrides.json',
    'content/local-destinations.json',
    'src/lib/photo-library.js',
    'public/photo-library.js',
    'public/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo/ (6 files)',
    'docs/editorial-research/2026-11-11-great-zimbabwe-insight-ledger.md',
    'docs/editorial-research/download-great-zimbabwe-insight-photos.mjs',
    'docs/editorial-research/add-great-zimbabwe-insight.mjs',
    'docs/editorial-research/insert-great-zimbabwe-photo-library.mjs',
    'docs/editorial-research/check-great-zimbabwe-dist.mjs',
    'docs/editorial-progress.json',
  ],
  images: 6,
  image_note: 'Six licensed Commons photographs, all distinct from the guided-monument-visit activity collection (Jan Derk/ulamm/Maciver) and the monument attraction\'s thumb gallery (Klinzing/Hill Complex/amanderson2/Moore Tower V): Schertzer x2 (CC BY 3.0, 2015), Bell aerial (CC BY-SA 4.0, 2015), Moore western entrance (CC BY-SA 2.0, 2019), Realtino Masvingo city centre (CC BY-SA 4.0, 2020), MaiTynoe Lake Kyle (CC BY-SA 4.0, 2011). SHA-256 recorded in photo-library entries; attribution on-page in figure captions.',
  booking_cta: 'None by design: insight pages carry no product CTA (Marrakech/Tunis/Egypt precedents); no booking-destinations.json change.',
  key_facts_checked: 'greatzimbabweguide.com travel guide (last updated March 2024, fetched 11 Nov 2026): 25 km from Masvingo, ~4 h Harare/Bulawayo, ~8 h Victoria Falls, A4 freight-corridor routing + left turn, no scheduled reliable public transport (hotel shuttles; minibus + walk-past-hotel ~2 km), charter-only airport, US$5/US$15 entry incl museum (dated March 2024, hedged), gates usually 08:00-17:00 with 09:00 arrival, ~4 h recommended, sandy bumpy paths, Hill Complex single-file steep, guide optional, toilets only at gate/museum, ATMs 25 km away, April-September best / rains Nov-Mar. greatzimbabwewhs.com (fetched 11 Nov 2026): Murray McDougall Drive "Zimbabwe\'s garden route" (60 km tar + 25 km dirt, rejoins A9, full day), Lake Mutirikwi 1961 second-largest-after-Kariba claim, Masvingo name sequence. ZimParks Lake Kyle page (fetched 11 Nov 2026): 169 km², ~30 km east, ruins to its south. UNESCO facts carried from the morning Masvingo record (whc.unesco.org re-fetch 403 this run, disclosed). All on-site cluster pages live HTTP 200.',
  build_checks: 'check:build-inputs passed; production build 158 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 163 pages; dist verified pre-push (title, 9 h2 sections, 6 figures, all facts, Masvingo insight card, archive + homepage listing, no markup leak).',
  cms: 'Publishable-key REST reads 2026-11-11: travel_articles 200 (seeded rows only, ids 1-10), local_destinations 404 (schema cache), editorial_documents 400 (RLS). Production deploy imports at source_commit server-side; mirror pending — owner-side CMS check to confirm travel_articles/plan-great-zimbabwe-monument-days-from-masvingo. No writes attempted.',
  next_category: 'destinations',
  next_action: 'Rotate to destinations next run; CMS owner-side check pending (standard); owner Gmail sign-in still required to ship stored email drafts.',
  status: 'published_pushed_live_confirmed',
  content_commit: 'a319936',
  publication: {
    content_commit: 'a319936',
    pushed_to: 'main',
    push_result: 'success (0dd2cdd..a319936)',
    pushed_at: '2026-11-11',
    live_url: 'https://trekafricaguide.com/travel-insights/plan-great-zimbabwe-monument-days-from-masvingo/',
    live_http_status: 200,
    checked_at: '2026-11-11',
    live_distinctive_text: 'Plan Great Zimbabwe monument days: pacing the site, the road, and the lake',
    live_checks: {
      detail: 'HTTP 200 (34,497 bytes) ~75 s after push; title correct; 9 h2 sections render (decision, road plan, pacing, second day, when to go, confirm before you book, FAQ, continue planning, sources and scope); distinctive copy verified live (Murray McDougall, US$15 dated hedge, A4 freight, 169 sq km, Chesvingo, white rhino); six figures render; no exposed markup.',
      assets: '6/6 /images/editorial/plan-great-zimbabwe-monument-days-from-masvingo/*.jpg live HTTP 200 image/jpeg.',
      masvingo_card: 'Masvingo destination page (HTTP 200) now renders the insight card — the page\'s first Travel insights entry.',
      archive_home: 'Travel-insights archive and homepage search list the insight.',
      cluster_links: 'All cross-link targets live HTTP 200 (Zimbabwe country, Masvingo destination, monument attraction, guided monument visit activity, Great Zimbabwe Hotel, Victoria Falls insight).',
    },
  },
};

j.latest_run_checkpoint = {
  date: '2026-11-11 (13:00 UTC scheduled run)',
  run: 'editorial content run (travel insights - Great Zimbabwe monument days)',
  status: 'published_pushed_live_confirmed',
  live_url: 'https://trekafricaguide.com/travel-insights/plan-great-zimbabwe-monument-days-from-masvingo/',
  deliverable_summary: 'New travel insight "Plan Great Zimbabwe monument days" — the site\'s first Zimbabwe story and the first Travel insights card on the Masvingo destination page. Six licensed Commons photographs (distinct from both existing monument collections).',
  evidence: 'Live insights archive held 14 stories with zero Zimbabwe coverage on 11 Nov 2026 while the full Zimbabwe cluster was published; Masvingo page carried no insight card; the monument attraction\'s planning instruction had no pacing/road story behind it.',
  cms: 'Publishable-key reconcile 2026-11-11: travel_articles 200 (seeded rows only), local_destinations 404, editorial_documents 400 (RLS); mirror pending; no writes attempted.',
  owner_email: 'Draft prepared and stored in this file (owner_email_draft); owner Gmail sign-in state re-checked during the run.',
  next_category: 'destinations',
};

j.email_status = {
  run: '2026-11-11 (13:00 UTC run, Great Zimbabwe insight)',
  status: 'blocked_owner_gmail_signed_out',
  detail: 'Owner Gmail tab shows the Google sign-in page (no active owner session in the OpenBot browser), re-checked 11 Nov 2026 during this run; draft saved below, no takeover requested per routine rule.',
};

j.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  prepared_at: '2026-11-11T16:30:00+03:00',
  subject: 'Trek Africa Guide — first Zimbabwe travel insight live (run 11 Nov 13:00 UTC)',
  body: 'Shipped this run: "Plan Great Zimbabwe monument days: pacing the site, the road, and the lake" — the site\'s FIRST Zimbabwe travel insight, and the first Travel insights card on the new Masvingo destination page.\n\nEvidence: the live travel-insights archive held 14 stories with zero Zimbabwe coverage this morning, even though the full Zimbabwe cluster (country guide, monument attraction, guided monument visit, Great Zimbabwe Hotel, Masvingo destination) went live the same day. The Masvingo page rendered no insight card at all, and the monument attraction\'s "Plan the visit from Masvingo" instruction had no pacing or road story behind it.\n\nLive receipt: https://trekafricaguide.com/travel-insights/plan-great-zimbabwe-monument-days-from-masvingo/ — HTTP 200 verified ~75 seconds after push (commit a319936): nine sections render, six photographs load, the Masvingo page now carries the insight card, the archive and homepage list it, and all cross-links are live. No exposed markup.\n\nContent: one Masvingo night or two; the A4 road plan (~4 h Harare/Bulawayo, ~8 h Victoria Falls, attributed planning figures); the no-scheduled-transport reality with hotel-shuttle and minibus options; a four-hour monument morning (gates usually 08:00-17:00 per the dated travel guide, 09:00 arrival recommended); Hill Complex difficulty and living-sacred-site etiquette; the second-day Murray McDougall Drive ("Zimbabwe\'s garden route"), Lake Kyle Recreational Park and Chesvingo Karanga Village; the April-September window; and a confirm-before-you-book checklist (the guide\'s US$15 non-resident fee is dated March 2024 and hedged accordingly).\n\nPhotos: six licensed Wikimedia Commons photographs, all distinct from the existing monument collections (Schertzer x2 CC BY 3.0, Bell CC BY-SA 4.0, Moore CC BY-SA 2.0, Realtino CC BY-SA 4.0, MaiTynoe CC BY-SA 4.0), credits on-page.\n\nBlockers: owner Gmail still signed out — this report is a draft in docs/editorial-progress.json; one sign-in ships it (plus earlier stored drafts). CMS mirror pending by design (publishable-key reads: travel_articles 200 but seeded rows only, local_destinations 404, editorial_documents 400/RLS) — owner-side CMS check recommended to confirm travel_articles/plan-great-zimbabwe-monument-days-from-masvingo.\n\nNote: the routine brief\'s old checkout path (C:\\Users\\TECH DEAL\\...) no longer exists on this machine; this run and its receipts live in C:\\Users\\FOSCOD\\.codex\\artifacts\\trek-photo-site.\n\nNext rotation: destinations.',
};

fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
console.log('progress file updated');
