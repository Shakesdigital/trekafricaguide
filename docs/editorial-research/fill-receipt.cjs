const fs = require('fs');
const p = 'docs/editorial-progress.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));
const rec = o.activity_south_luangwa_walking_safari;
const pub = o.latest_run_checkpoint;
const commit = 'a09e697a0a34e73b6e1bb5a1ea18ecff9639ba2a';
o.latest_run_checkpoint.content_commit = commit;
o.latest_run_checkpoint.publication = {
  content_commit: 'a09e697 (receipt included in same commit: ledger, probe scripts, progress publication fields',
  pushed_to: 'main',
  push_result: 'success',
  pushed_at: '2026-11-09',
  live_url: 'https://trekafricaguide.com/activities/south-luangwa-walking-safari/',
  live_http_status: 200,
  checked_at: '2026-11-09',
  live_distinctive_text: 'South Luangwa walking safari | Trek Africa Guide',
};
pub.pushed_to = 'main';
pub.push_result = 'success';
o.latest_run_checkpoint.status = 'published_live_confirmed';
o.latest_run_checkpoint.live_verification = 'HTTP 200 (28,119 bytes) checked 2026-11-09 shortly after push: h1 "South Luangwa walking safari"; full h2 flow (About this activity, Highlights, Best time to participate, Planning notes, Booking option, Nearby stays); Zambia Tourism origin claim, qualified-guide + armed-ranger framework and Mfuwe/Chipata access facts render; honest booking rail ("verified booking link ... not yet available"); internal links to /attractions/south-luangwa and /accommodations/mfuwe-lodge live; no exposed markup. Activities archive and homepage search list the guide; the South Luangwa attraction page now renders it in Related activities.';
rec.live_verification = o.latest_run_checkpoint.live_verification;
rec.publication = 'Pushed main 7efe8ce..a09e697; Netlify deployed; live receipt above.';
rec.commit = commit;
rec.next_action = 'Rotate to destinations next run; six-photo backlog in the image pipeline; CMS owner-side check pending.';
fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('publication receipt filled');
