// Records the Nairobi destination run in docs/editorial-progress.json.
const fs = require('fs');
const file = 'docs/editorial-progress.json';
const p = JSON.parse(fs.readFileSync(file, 'utf8'));

p.updated_at = new Date().toISOString();

p.local_destination_nairobi = {
  id: 'nairobi',
  category: 'destinations',
  started: '2026-11-09',
  scope: "New local destination Nairobi under Kenya - the first Kenyan city guide, answering the country page's 'smooth access from Nairobi / Use Nairobi as a common planning gateway' instruction with no guide behind it. Relationships limited to the geographically honest Nairobi-gateway group.",
  files: [
    'content/local-destinations.json',
    'docs/editorial-research/add-nairobi-destination.cjs',
    'docs/editorial-research/2026-11-09-nairobi-local-destination.md'
  ],
  images: 0,
  image_followup: 'Six distinct subjects not reusable from Kenya attraction/activity collections: Nairobi skyline with hills, Nairobi National Park skyline-backdrop game view, Animal Orphanage/Safari Walk boardwalk, JKIA kerb, Wilson Airport Langata strip, nyama choma grill court.',
  booking_cta: 'None by design: destination pages carry no hotel-booking surrogate and no Nairobi-stay guide is published yet (the three Kenya stays are in-park).',
  relationships: {
    country_slug: 'kenya',
    attraction_slugs: ['maasai-mara', 'amboseli-national-park'],
    activity_slugs: ['amboseli-game-drive-safari'],
    accommodation_slugs: [],
    travel_insight_slugs: []
  },
  key_facts_checked: 'Magical Kenya (KTB) Nairobi city page (name meaning, city texture) and Nairobi NP page (117 sq km, densest black-rhino claim attributed, big four, 500+ birds, Orphanage, Safari Walk); KAA Wilson Airport page (domestic safari hub, routes to Mara/Amboseli, Langata Road 5 km), both checked 9 November 2026 and held in the ledger; KWS unreachable (no fees reprinted; page defers to operator/current KWS); on-site continuity from Kenya country + Mara/Amboseli attraction + Amboseli activity guides.',
  build_checks: 'Full production build 137 pages; readability guard passed on 142; local dist render verified h2 flow, both attraction links, Amboseli activity card, Kenya country "Destinations in Kenya" card, homepage search, no exposed markup; dist churn discarded before commit as before.',
  cms: 'Publishable-key read of the Supabase schema cache returns 404 for local_destinations (and destinations/articles); editorial_documents stays 400 for the publishable key (service-role only). Mirror status pending - owner-side CMS check to confirm local_destinations/nairobi.',
  publication: 'See live_verification after deploy; content commit pushed to main.',
  commit: '1c3cf91 (content, rebased onto parallel push baa031b)',
  live_verification: 'HTTP 200 (30,264 bytes) checked minutes after push: title "Nairobi | Trek Africa Guide"; KTB/National Park, 117 sq km, Wilson Airport, densest-rhino attributed claim, both attraction links and the Amboseli Nairobi-departure activity card render; Kenya country page renders the Nairobi destination card; no exposed markup.',
  next_category: 'accommodations',
  next_action: 'Rotate to accommodations next run; re-verify the accommodation archive; makean progress-email send depends on owner Gmail sign-in.'
};

p.latest_run_checkpoint = {
  date: '2026-11-09',
  run: 'editorial content run (destinations - Nairobi local destination)',
  status: 'published_live_confirmed',
  content_commit: '1c3cf91 (rebased onto parallel main work baa031b; pushed baa031b..1c3cf91)',
  live_url: 'https://trekafricaguide.com/countries/kenya/nairobi/',
  live_verification: 'HTTP 200 checked after Netlify deploy: title correct; destination h2 flow renders (Explore Nairobi / Highlights / Getting there and around / Best time to visit / Planning your stay / Attractions to explore / Things to do); KTB city portrait and Nairobi National Park facts render with attributed claims; both Kenya attraction links + the Nairobi-departure Amboseli activity card render; honest empty stays rail; no exposed markup. Kenya country page now renders the Nairobi destination card under Destinations in Kenya; homepage search lists Nairobi.',
  ledger: 'docs/editorial-research/2026-11-09-nairobi-local-destination.md',
  environment_note: 'Working copy re-created at C:\\Users\\FOSCOD\\.codex\\artifacts\\trek-photo-site after the machine transfer (old TECH DEAL paths gone); brief recovered from the OpenBot transfer bundle; build .env restored untracked from the workspace copy .env.netlify as before.',
  mirror_status: 'pending',
  cms_mirror_note: 'Publishable-key read: local_destinations 404 (not in schema cache exposed to anon), destinations/articles 404, editorial_documents 400; activities table (200) still lacks the 9 Nov legged slugs kruger-national-park-game-drive / nyungwe-canopy-walk / south-luangwa-walking-safari at check time - server-side import lag persists. No writes attempted (rule).',
  next_category: 'accommodations',
  next_action: 'Next run: accommodations category per rotation (re-verify 32/32 archive live); owner email still requires Gmail sign-in (three run drafts now stored).'
};

fs.writeFileSync(file, JSON.stringify(p, null, 1) + '\n');
console.log('progress updated: nairobi record + checkpoint');
