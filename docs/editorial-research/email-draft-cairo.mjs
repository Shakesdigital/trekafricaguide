import fs from 'node:fs';
const file = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/docs/editorial-progress.json';
const c = JSON.parse(fs.readFileSync(file, 'utf8'));
c.email_status = {
  run: '2026-11-10 (morning run, Cairo destination)',
  status: 'blocked_owner_gmail_signed_out',
  detail: 'Owner Gmail tab shows the signed-out Google Workspace marketing page (and an accounts.google.com sign-in identifier tab); no sendable session this run. Draft saved below; no takeover requested per routine rule. Sixth+ run awaiting one sign-in.',
};
c.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek Africa Guide run 10 Nov: Cairo city destination published and verified live',
  body: [
    'Hi,',
    '',
    'This run shipped the site\'s first Egypt destination page: https://trekafricaguide.com/countries/egypt/cairo/ — the city anchor the published Cairo/Giza attraction, day-tour and Marriott Mena House pages all assumed.',
    '',
    'What\'s on it: area-grouping guide (Giza-side vs central-city vs Old/Islamic Cairo), the Mena House stay as the worked example of the base decision, transfer/traffic planning, itemised-inclusion questions, 7 licensed Wikimedia Commons photos (hero: Qasr al-Nil bridge at dusk, Frank Schulenburg CC BY-SA 3.0; all creators and licences credited in the gallery and the photo library).',
    '',
    'Live receipt: detail HTTP 200 minutes after push; all 8 sections render; 7/7 image assets HTTP 200; the Egypt country page now renders a "Destinations in Egypt" rail. Commits 702c069 (content) and bdfdb3b (receipt) pushed to main — push is working again, no 403.',
    '',
    'Blockers: owner Gmail still signed out (this report is the drafted copy, not yet sent from your account); CMS editorial mirror still pending by design (anon reads blocked, no writes attempted). Note: the withdrawn cairo-giza travel insight stays unavailable — the new page does not reference it.',
    '',
    'Next rotation: accommodations.',
  ].join('\n'),
};
fs.writeFileSync(file, JSON.stringify(c, null, 1));
console.log('email draft saved');
