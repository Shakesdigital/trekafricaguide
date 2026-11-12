// Progress receipt update for the 2026-11-12 11:00 UTC run (Sal destination).
const fs = require('fs');
const p = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

j.destination_sal = {
  id: 'sal',
  category: 'destinations',
  started: '2026-11-12',
  latest_run_note: 'Scheduled 11:00Z routine run; executed on schedule.',
  selection_evidence: "Live countries/cabo-verde/ (HTTP 200, 12 Nov 2026) rendered NO Destinations rail at all - one of only three countries without a destination guide (Ethiopia, Sierra Leone being the others, same one-attraction/one-stay shape). The island cluster existed with no anchor: /attractions/sal-island/ (HTTP 200, researched guide planning a Santa Maria arrival, north-coast outing and Pedra de Lume visit) and /accommodations/hilton-cabo-verde-sal-resort/ (HTTP 200, attraction_id 64 = sal-island). Homepage destination search (19 entries) listed zero Cabo Verde destinations; local-destinations.json had no sal record.",
  scope: "New local destination Sal under Cabo Verde - the country's first destination guide: the main tourist island (national institute: more than 50% of archipelago overnight stays), Santa Maria beach base, Pedra de Lume salt-crater heritage (protected 2003, heritage 2014), north-coast sights (Murdeira, Rabo de Junco, Buracona Blue Eye, Ponta Preta, Cave of Love), Espargos capital beside Amilcar Cabral airport, official dry/hot season split. Zero-image honest publish; six-subject backlog logged.",
  files: [
    'content/local-destinations.json',
    'docs/editorial-research/2026-11-12-sal-cabo-verde-destination.md',
    'docs/editorial-research/add-sal-destination.cjs',
    'docs/editorial-progress.json'
  ],
  images: 0,
  image_followup: "Six distinct licensed subjects, not reusable from other collections: Santa Maria beach and pier, Pedra de Lume crater salt flats from the rim, Buracona Blue Eye lava cave, Palmeira fishing-village harbour, Ponta Preta dune-and-surf view, Espargos town square/facades. Licensed-reuse review only.",
  booking_cta: "None by design: destination pages carry no hotel-booking surrogate; booking texture flows through the published Hilton Cabo Verde Sal Resort stay guide and the attraction's existing GetYourGuide CTA.",
  relationships: {
    country_slug: 'cabo-verde',
    attraction_slugs: ['sal-island'],
    activity_slugs: [],
    accommodation_slugs: ['hilton-cabo-verde-sal-resort'],
    travel_insight_slugs: []
  },
  key_facts_checked: "Instituto do Turismo de Cabo Verde turismo.cv Sal page (fetched 200, 12 Nov 2026: salt-industry name, flat lunar-like island, dry climate 365 days, >50% of overnight stays, named must-visit sights, international airport) and visit-caboverde.com Sal island page (fetched 200: 215 km2, Monte Grande 406 m, ~35,000 inhabitants, Espargos capital beside the airport, sighted 3 Dec 1460, Pedra de Lume salt works from 1804, Santa Maria 8 km beach stretch, Seven Wonders claim, September music festival) plus Camara Municipal do Sal (fetched 200: four population points, Santa Maria Beach Festival 15 September over two days). Live on-site attraction/country/stay guides re-read for continuity. Not claimed: admission prices, flight/ferry schedules, water-safety guarantees; the two official Santa Maria beach-length statements (4 km bay vs 8 km pier-to-Ponta-Preta stretch) kept attributed rather than reconciled.",
  build_checks: "check:build-inputs passed; production build 163 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 168; dist verified pre-push (7-section destination h2 flow, attraction + stay cards, country rail, homepage search, no markup leak).",
  cms: "Publishable-key reconcile 2026-11-12: travel_articles 200 (seeded rows only), local_destinations 404 (schema cache), editorial_documents 401 (RLS); no writes attempted; owner-side CMS check to confirm local_destinations/sal.",
  status: 'published_live_confirmed',
  content_commit: '21a78fd',
  publication: {
    content_commit: '21a78fd',
    pushed_to: 'main',
    push_result: 'success (1f0c336..21a78fd)',
    pushed_at: '2026-11-12',
    live_url: 'https://trekafricaguide.com/countries/cabo-verde/sal/',
    live_http_status: 200,
    checked_at: '2026-11-12',
    live_distinctive_text: 'Sal, Cabo Verde | Trek Africa Guide',
    live_checks: {
      detail: "HTTP 200 (32,289 bytes) after the Netlify deploy; title correct; destination h2 flow (Explore Sal, Highlights, Getting there and around, Best time to visit, Planning your stay, Attractions to explore, Where to stay); distinctive copy renders (more than 50% of overnight stays, Monte Grande 406 m, 215 square kilometres, ~35,000, Espargos, 365 days a year, 8 km stretch, Pedra de Lume protected national landscape, Blue Eye, Murdeira, Rabo de Junco, Cave of Love, Terra Boa, Santa Maria Beach Festival); no exposed markup.",
      cards: "Attractions to explore renders sal-island; Where to stay renders hilton-cabo-verde-sal-resort (both targets live HTTP 200).",
      country_rail: "Cabo Verde country page now renders 'Destinations in Cabo Verde' with the Sal card (was absent this run).",
      archive_home: "Homepage search lists /countries/cabo-verde/sal."
    },
    cms_source_commit: "imported at source_commit 21a78fd; publishable-key read of local_destinations stays blocked - owner-side CMS check to confirm local_destinations/sal"
  },
  next_category: 'accommodations',
  next_action: "Rotate to accommodations next run; six-subject photo backlog tracked in the ledger; CMS owner-side check pending (standard). Queued destination candidates: Ethiopia (Lalibela - advisory-sensitive, attraction page already carries Smartraveller do-not-travel posture) and Sierra Leone (Tokeh/Freetown peninsula)."
};

j.latest_run_checkpoint = {
  date: '2026-11-12 (11:00 UTC scheduled run)',
  run: 'editorial content run (destinations - Sal, Cabo Verde destination guide)',
  status: 'published_pushed_live_confirmed',
  live_url: 'https://trekafricaguide.com/countries/cabo-verde/sal/',
  deliverable_summary: "Destinations rotation: new Sal island destination guide under Cabo Verde - the country's first destination page, closing its empty destinations rail. Evidence: Cabo Verde was one of only three countries rendering no Destinations rail (Ethiopia, Sierra Leone being the others) while its researched Sal Island attraction guide and same-island Hilton stay guide had no anchor page. Zero-image honest publish; six-subject photo backlog.",
  evidence: "Live cabo-verde country page HTTP 200 with no Destinations rail (12 Nov); sal-island attraction and hilton-cabo-verde-sal-resort stay live with no destination anchor; no sal slug in local-destinations.json.",
  photos: "Zero-image; wanted subjects ledgered (Santa Maria beach/pier, Pedra de Lume crater, Buracona Blue Eye, Palmeira harbour, Ponta Preta, Espargos square).",
  cms: "Publishable-key reconcile 2026-11-12: travel_articles 200 (seeded only), local_destinations 404 (schema cache), editorial_documents 401 (RLS); mirror pending; no writes attempted.",
  owner_email: "Draft prepared; owner Gmail sign-in state re-checked during the run (accounts.google.com tab, signed out).",
  next_category: 'accommodations',
  content_commit: '21a78fd'
};

j.rotation = {
  last_completed_category: 'destinations',
  next_category: 'accommodations',
  next_deliverable: 'Sal destination guide published 2026-11-12 (destinations rotation); next: one evidenced accommodations gap.'
};

j.email_status = {
  run: '2026-11-12 (11:00 UTC run, Sal destination)',
  status: 'blocked_owner_gmail_signed_out',
  detail: 'Owner Gmail tab re-checked this run: accounts.google.com sign-in page only; no active owner session in the OpenBot browser. Draft saved; no takeover requested per routine rule.'
};

j.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  prepared_at: '2026-11-12T11:00:00.000Z',
  subject: 'Trek Africa Guide - Sal destination published, Cabo Verde rail closed (run 12 Nov 11:00 UTC)',
  body: "Shipped this run: the Sal destination guide - the first destination page for Cabo Verde, closing the country's empty destinations rail.\n\nEvidence: Cabo Verde was one of only three countries on the site with no destination guide at all (Ethiopia and Sierra Leone are the other two), even though its researched Sal Island attraction guide and the same-island Hilton Cabo Verde Sal Resort stay guide were live with no anchor page behind them. Sal was the cleanest evidenced gap of the three; Ethiopia's Lalibela cluster sits under an active do-not-travel advisory and is queued for a future destinations run with the advisory posture carried.\n\nAll facts sourced from the national tourism institute (turismo.cv and visit-caboverde.com Sal pages, both fetched today) plus the Sal municipal site: more than 50% of the archipelago's overnight stays, 215 km2 with Monte Grande at 406 m, the Pedra de Lume salt flats protected since 2003 and national heritage since 2014, the Santa Maria 8 km beach stretch and the September festival. No rates, schedules or safety guarantees printed; confirm-before-you-book hedges kept.\n\nLive receipt: trekafricaguide.com/countries/cabo-verde/sal/ - HTTP 200 after the deploy, full destination layout, attraction and stay cards render, the country page now shows Destinations in Cabo Verde, homepage search lists the guide, no markup leak. Commit pushed to main (21a78fd).\n\nPhotos: honest zero-photo state; six wanted subjects logged (Santa Maria beach and pier, Pedra de Lume crater, Buracona Blue Eye, Palmeira harbour, Ponta Preta, Espargos square).\n\nBlockers: owner Gmail sign-in still pending (this and earlier progress drafts stored, including the Elmina one from the 09:00 run); CMS editorial mirror still pending owner-side check."
};

j.updated_at = '2026-11-12T12:05:00Z';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
console.log('progress updated');
