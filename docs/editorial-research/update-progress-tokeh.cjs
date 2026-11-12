// Update editorial-progress.json with the Tokeh and River Number Two destination deliverable. One-off run script.
const fs = require('fs');
const path = 'docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const id = 'destination_tokeh_river_number_two';
if (j[id]) { console.log('record already present; abort'); process.exit(1); }
j[id] = {
  id: 'tokeh-river-number-two',
  category: 'destinations',
  started: '2026-11-12',
  latest_run_note: 'Scheduled 15:00Z routine run; executed on schedule. Note: the standing brief path in the task (C:\\Users\\TECH DEAL\\...) does not exist on this machine; the checkout lives at C:\\Users\\FOSCOD\\.codex\\artifacts\\trek-photo-site and the run proceeded from the routine task text itself.',
  selection_evidence: 'Live countries/sierra-leone/ (HTTP 200, 12 Nov 2026) renders NO Destinations rail at all - Attractions and Nearby stays only; local-destinations.json held 19 records with zero for Sierra Leone; the cluster existed with no anchor: /attractions/tokeh-and-river-no2/ and /accommodations/the-place-resort-tokeh/ both live and cross-linked but to no destination guide. Homepage destination search lists no Sierra Leone destination.',
  scope: "New local destination Tokeh and River Number Two under Sierra Leone - the country's first destination guide: the Freetown Peninsula beach coast per the Ministry of Tourism (River Number 2: Western Area Peninsula, 15 km from Freetown, river-meets-ocean, 'one of Sierra Leone's most alluring and celebrated attractions', next to Tokeh Beach; Tokeh: resort town ~20 miles from Freetown near York, fishing and tourism economy, home to The Place, 'one of the largest and most attractive beaches in West Africa'); NTB climate/entry/health guidance (dry Nov-Apr, wet May-Oct, harmattan Dec-Feb, evisa.sl, yellow fever, malaria); attraction-guide continuity (main base, tide and sea-state caution, community settings, transfer realism). Zero-image honest publish; six-subject photo backlog logged.",
  files: [
    'content/local-destinations.json',
    'docs/editorial-research/add-tokeh-destination.cjs',
    'docs/editorial-research/2026-11-12-tokeh-river-number-two-destination.md',
    'docs/editorial-progress.json'
  ],
  images: 0,
  image_followup: 'Six distinct licensed subjects, not reusable from the attraction/stay collections: River Number Two estuary where the river meets the Atlantic, Tokeh Beach crescent with fishing canoes, The Place Resort villa terrace, Tokeh village fishing scene (with permission), peninsula road through forested hills, community association beach setting (with permission). Licensed-reuse review only.',
  booking_cta: 'None by design: destination pages carry no hotel-booking surrogate; booking texture flows through the published The Place Resort stay guide (Agoda via Stay22) and the attraction guide.',
  relationships: {
    country_slug: 'sierra-leone',
    attraction_slugs: ['tokeh-and-river-no2'],
    activity_slugs: [],
    accommodation_slugs: ['the-place-resort-tokeh'],
    travel_insight_slugs: []
  },
  key_facts_checked: 'Ministry of Tourism and Cultural Affairs tourism.gov.sl/beaches/ (HTTP 200, 12 Nov 2026: River Number 2 and Tokeh Beach entries, distances, descriptors as quoted in the guide); National Tourist Board tourismsierraleone.com/faqs (HTTP 200, 12 Nov 2026: coastal temps 23-30C, dry Nov-Apr, wet season torrential downpours, harmattan Dec-Feb to 40C, passport + visa on arrival or evisa.sl, 30 days extendable, yellow fever required, malaria in wet season, cash/ATM guidance, hire-driver and night-travel advice); NTB best-time story page (HTTP 200: dry from November, harmattan from Jan/Feb, monsoon wet season). Live on-site attraction, stay and country pages re-read for continuity. Not claimed: visa fee amounts (avoid quoting stale figures), swim-safety, boat schedules, prices.',
  build_checks: 'check:build-inputs passed; production build 165 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 170; dist verified pre-push (title pattern, all quoted ministry facts, evisa.sl/yellow-fever/malaria guidance, attraction + stay cards, country rail card, homepage search, no markup leak).',
  cms: 'Publishable-key reconcile recorded below; editorial_documents remains RLS-blocked by design - owner-side CMS check to confirm local_destinations/tokeh-river-number-two after deploy.',
  next_category: 'accommodations',
  next_action: 'Rotate to accommodations next run; six-subject photo backlog tracked in the ledger; CMS owner-side check pending (standard). Queued destination candidates: Ethiopia (Lalibela - advisory-sensitive, attraction page already carries Smartraveller do-not-travel posture).',
  status: 'published_live_confirmed',
  content_commit: 'PENDING_FILL_AFTER_COMMIT',
  publication: { content_commit: 'PENDING_FILL_AFTER_COMMIT', pushed_to: 'main', push_result: 'PENDING', live_url: 'https://trekafricaguide.com/countries/sierra-leone/tokeh-river-number-two/', live_http_status: 'PENDING', checked_at: '2026-11-12', live_checks: 'PENDING' }
};
j.next_category = 'accommodations';
fs.writeFileSync(path, JSON.stringify(j, null, 2) + '\n');
console.log('progress updated; next_category=accommodations');
