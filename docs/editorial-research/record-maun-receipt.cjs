const fs = require('fs');
const p = 'docs/editorial-progress.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
d.updated_at = '2026-11-11T12:30:00+03:00';
d.local_destination_maun = {
  id: 'maun',
  category: 'destinations',
  started: '2026-11-09',
  status: 'complete',
  scope: "New local destination Maun under Botswana — Botswana's first destination guide, answering the live Okavango mokoro activity's Maun-departure promise; related cards limited to the geographically honest delta group (attraction okavango-delta, activity okavango-mokoro-safari, accommodation camp-okavango).",
  files: ['content/local-destinations.json', 'docs/editorial-research/2026-11-09-maun-local-destination.md', 'docs/editorial-research/add-maun-destination.cjs'],
  images: 0,
  image_backlog: 'Six subjects in the ledger: Thamalakane riverside, airport apron, supply-shop stocking scene, poler+mokoro at Maun-side launch area, town-edge everyday life, western-delta-fringe village view. Licensed-reuse review only; never reuse the Okavango attraction, mokoro-activity or Camp Okavango collections.',
  booking_cta: 'None by design: destination pages carry no hotel-booking surrogate, and no Maun-stay guide is published yet.',
  key_facts_checked: 'BTO Maun page (tourism capital on the southern fringes of the Delta, frontier character, direct flights from Johannesburg and Gaborone, Batawana seat of power 1915, district cultural mix, Thamalakane River), BTO Climate + Time to Visit, UNESCO 1432 (inscribed 2014, dry-season flood pulse, Moremi ~40% of property, air-access inner delta), gov.bw airports list — all checked 9 November 2026; on-site continuity re-reads of the Okavango attraction and mokoro activity guides.',
  cms: 'Production deploy imports at source_commit; publishable-key read of editorial_documents remains RLS-blocked — owner-side CMS check to confirm local_destinations/maun after deploy.',
  publish_commit: "b98aa43 (content + ledger + pre-publish checkpoint; rebased through interleaved Governors' Camp/Mfuwe commits by other agents)",
  publication: {
    content_commit: 'b98aa43',
    pushed_to: 'main',
    push_result: 'success',
    live_url: 'https://trekafricaguide.com/countries/botswana/maun/',
    live_http_status: 200,
    checked_at: '2026-11-11',
    live_distinctive_text: "Maun: Botswana's safari capital on the Delta's doorstep",
    live_checks: {
      detail: 'HTTP 200; full h2 flow (Explore Maun, Highlights, Getting there and around, Best time to visit, Planning your stay, Attractions to explore, Things to do, Where to stay); BTO gateway framing, 1915 Batawana history, Thamalakane, Johannesburg/Gaborone flights render; all three related cards live (okavango-delta, okavango-mokoro-safari, camp-okavango); no exposed markup, no escaped prose.',
      parents: "Botswana country page renders Destinations in Botswana with the maun card; countries archive and homepage search list the guide.",
      deploy_note: 'Git push alone did not deploy (NETLIFY_DEPLOY_HOOK placeholder discovered by the image agents on 9 Nov); the page reached production via the CLI-deploy path the other agents used (their deploy of the merged tree); the live verification above confirms the published state.'
    },
    cms_source_commit: 'imported at source_commit of the producing deploy; owner-side CMS check pending',
    email_status: 'required_signin_owner_gmail'
  },
  next_action: 'None open for this deliverable; category rotation tracked in rotation.next_category (owned by the active editorial agents).'
};
fs.writeFileSync(p, JSON.stringify(d, null, 1) + '\n');
console.log('receipt written; top-level keys:', Object.keys(d).length);
