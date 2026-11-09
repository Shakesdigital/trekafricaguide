const fs = require('fs');
const p = 'docs/editorial-progress.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
const today = '2026-11-09';

d.latest_run_checkpoint = {
  date: today,
  run: 'editorial content run (activities — Kruger National Park game drive)',
  status: 'published_live_confirmed',
  content_commit: 'dcd779a (rebased onto concurrent main work 472b1ab; pushed 472b1ab..dcd779a)',
  live_url: 'https://trekafricaguide.com/activities/kruger-national-park-game-drive/',
  live_verification: 'HTTP 200 (39,756 bytes, x-nf-request-id 01M6ZN1821QCW2BCNA763RYJNY) checked 2026-11-09 after deploy: title "Kruger National Park game drive | Trek Africa Guide"; full h2 flow (About this activity, Highlights, Best time to participate, Planning notes, Booking option, You may also like, Nearby stays); 5 gallery tiles + lightbox ("See all 6 images") exactly like the golden-monkey reference grid--5 pattern; all six kruger-game-drive JPGs HTTP 200; Stay22/GetYourGuide exact product CTA (t433574) resolves with "Book this activity via GetYourGuide"; SANParks facts render incl. Skukuza Main Gate closure notice 2 Nov\u20134 Dec 2026; no exposed markup. Categories/credits render Chris Eason x4 (CC BY 2.0), flowcomm (CC BY 2.0), Bernard DUPONT (CC BY-SA 2.0). Activities archive lists the guide; the Kruger attraction page Related-activities rail now renders it.',
  ledger: 'docs/editorial-research/2026-11-09-kruger-game-drive.md',
  next_action: 'Verify CMS mirror import server-side (activities table did not yet carry kruger-national-park-game-drive or nyungwe-canopy-walk at check time); send stored owner email after Gmail sign-in; accommodations inventory is full \u2014 next run verifies 32/32 live and rotates.',
  next_category: 'accommodations',
  publication: {
    content_commit: 'dcd779a',
    pushed_to: 'main',
    push_result: 'success (after rebase onto concurrent Nyungwe canopy-walk run; conflicts resolved by union)',
    pushed_at: today,
    live_url: 'https://trekafricaguide.com/activities/kruger-national-park-game-drive/',
    live_http_status: 200,
    checked_at: today,
    live_distinctive_text: 'Kruger National Park game drive | Trek Africa Guide'
  },
  pushed_to: 'main',
  push_result: 'success',
  mirror_status: 'pending',
  cms_mirror_note: 'Publishable-key read of the activities table (project rftoaaehhenhnziukgpl) returned neither new slug at check time; editorial_documents remains 400 for publishable key (service-role only, held by Netlify). Import runs server-side; owner-side CMS check recommended. No writes attempted (by rule).'
};

const rec = {
  date: today,
  category: 'activities',
  deliverable: 'Kruger National Park game drive — first Kruger activity guide; SANParks flagship park had no site activity (attraction page headlined self-drive + guided activities with only a third-party CTA booking and an empty related-activities rail).',
  evidence: 'Live /attractions/kruger-national-park/ had no related activity and none of 19 published activities covered Kruger; verified 2026-11-09 pre-publication.',
  sources: 'SANParks park overview + day-visits pages (fetched); SANParks game-drives framework via official-URL search snippet after 403; GetYourGuide exact product search-verified; site Kruger attraction + Kruger Shalati stay guides cross-linked.',
  photos: '6 distinct Wikimedia Commons CC images (Chris Eason x4, flowcomm, Bernard DUPONT) downloaded, resized 1,800px, SHA-256 recorded; one candidate (Skukuza stone clock tower) rejected as off-subject.',
  booking: 'booking-destinations.activities[kruger-national-park-game-drive] exact GetYourGuide t433574, verification_note records the 2026-11-09 search verification; rating data kept from 2026-10-11 record.',
  live: 'HTTP 200, all checks green 2026-11-09.',
  commit: 'dcd779a'
};
d.activity_kruger_national_park_game_drive = rec;

d.rotation = {
  last_completed_category: 'activities',
  next_category: 'accommodations',
  next_deliverable: 'Accommodations inventory re-checked this run: all 32 ledger accommodations render live \u2014 next run verifies the archive and, absent a newly evidenced gap, rotates into destinations/attractions/travel-insights or deepens an existing page; Nyungwe canopy walk (other run) and Kruger game drive (this run) published same day.',
  rule: 'Finish the individual deliverable and report its live state, then rotate.'
};

d.email_status = 'required_signin_owner_gmail';
d.owner_email_draft = {
  prepared_at: today,
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek editorial run: Kruger National Park game drive live (2 guides shipped today)',
  body: 'Hi,\n\nTwo editorial runs shipped today.\n\n1) This run \u2014 Kruger National Park game drive (activities): https://trekafricaguide.com/activities/kruger-national-park-game-drive/ \u2014 HTTP 200, full reference-page format (About / Highlights / Best time / Planning notes / Booking option / You may also like / Nearby stays), six licensed Wikimedia Commons photographs (Chris Eason x4, flowcomm, Bernard DUPONT) with an on-page credits line, exact GetYourGuide booking product ("Full-Day Game Drive with Pick-up", search-verified) served through the affiliate resolver, and the Kruger attraction page now lists it under related activities.\n\n2) The parallel Nyungwe canopy-walk run also shipped and is live.\n\nBlockers:\n- Owner Gmail is signed out, so this progress email could not be sent from the connected account; it is stored in docs/editorial-progress.json (owner_email_draft).\n- CMS mirror: the activities table had not received the two new guides at check time; the import runs server-side \u2014 a quick look at the Supabase CMS for slug kruger-national-park-game-drive is recommended.\n\nCommit: dcd779a on main.\n'
};

fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
console.log('progress updated');
