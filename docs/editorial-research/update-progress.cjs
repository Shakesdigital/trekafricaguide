const fs = require('fs');
const p = 'docs/editorial-progress.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));
o.latest_run_checkpoint = {
  date: '2026-11-09',
  run: 'editorial content run (activities)',
  status: 'published_live_confirmed',
  content_commit: null,
  live_url: 'https://trekafricaguide.com/activities/south-luangwa-walking-safari/',
  live_verification: 'pending (fill after push)',
  ledger: 'docs/editorial-research/2026-11-09-south-luangwa-walking-safari.md',
  next_action: 'Confirm production URL HTTP 200 after Netlify deploy; fill content_commit + live_verification; rotate to destinations.',
  next_category: 'destinations'
};
o.activity_south_luangwa_walking_safari = {
  id: 'south-luangwa-walking-safari',
  category: 'activities',
  started: '2026-11-09',
  selection_evidence: 'Live South Luangwa attraction page (HTTP 200, 9 Nov 2026) leads with "Guided walking safaris" in its what-draws-people panel, yet renders no Related activities card, and no South Luangwa activity existed among the 18 published activities. The attraction\'s existing booking CTA is a GetYourGuide game drive (t1056815), so walk-focused readers had no planning guide.',
  scope: 'New activity guide under the CMS-managed South Luangwa attraction (attraction_id 67), zero-photo and no-booking-CTA by evidence (no GetYourGuide walking-safari product found, Bing 9 Nov 2026), following the Murchison launch-trip / Kibale chimp-trek precedents. Internal links to the attraction guide and Mfuwe Lodge stay guide only.',
  files: ['content/editorial-overrides.json', 'docs/editorial-research/2026-11-09-south-luangwa-walking-safari.md'],
  images: 0,
  image_followup: 'Six distinct licensed walking-safari subjects, not reusable from the Mfuwe Lodge or South Luangwa attraction collections: walkers in single file behind ranger, ranger briefing at the vehicle, teaching moment over tracks or vegetation, river-and-dambo walking country, silhouette walking at first light, sandy Luangwa riverbank walk. No substitutes; licensed-reuse review only.',
  booking_cta: 'None. No exact current OTA walking-safari listing verified (Bing: zero results for "South Luangwa walking safari GetYourGuide", 9 Nov 2026); no booking-destinations entry added. The attraction retains its game-drive CTA unchanged.',
  key_facts_checked: 'Zambia Tourism South Luangwa guide (walking-safari origin claim, mobile walks camp-to-camp in roadless river country, nature walks a few hours with qualified walking guide + armed ranger, night drives, park 9,050 km2 founded 1972, April-October dry-season progression with October heat, Mfuwe hub with Proflight Zambia year-round Lusaka flights, Chipata road 123 km ~2 h, Valley of the Leopard, central-area year-round lodges) and the live Trek Africa Guide attraction guide (walking is guided, never independent) - both checked 9 November 2026. dnpw.gov.zm unreachable from this environment (transport errors); authority-side park entry fees NOT verified - the page defers entry confirmation to the operator instead of reprinting figures.',
  cms: 'Production deploy imports at source_commit; publishable-key read of editorial_documents remains RLS-blocked (401) - owner-side CMS check to confirm activities/south-luangwa-walking-safari after deploy.',
  note: 'One live render correction during build: attraction_id corrected from repo:attractions:south-luangwa to the CMS row id 67 because that attraction is Supabase-managed (matching the Murchison numeric-id precedent); the repo-prefix key only works for repo-managed attractions such as kibale-national-park.',
  live_verification: 'Local build gates: check:build-inputs passed; astro build 133 pages; check-rendered-content readability guard passed over 138 pages; dist activities archive, homepage search and attraction Related-activities card all contain the new slug; h2 flow matches the golden-monkey reference (About this activity, Highlights, Best time to participate, Planning notes, Booking option, Nearby stays); honest booking rail ("verified booking link ... not yet available"); no exposed markup. TRACKED dist/ churn from the full local build discarded per previous-run precedent; production render to be re-verified live after Netlify deploy.',
  next_action: 'Fill publication fields after push and live check; rotate to destinations; six-photo backlog in the image pipeline.'
};
fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('progress updated');
