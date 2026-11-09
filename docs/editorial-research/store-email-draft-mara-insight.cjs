const fs = require('fs');
const p = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.email_status = 'required_signin_owner_gmail';
j.owner_email_draft = {
  prepared_at: '2026-11-09 (evening run)',
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek editorial run: Kenya first-safari travel insight live (run 2026-11-09 evening)',
  body: [
    'Hi,',
    '',
    'Shipped this run: a new published travel insight - Plan a first Kenya safari: reserve or conservancy, road or fly-in. Evidence: the live journal had zero Kenya stories (Uganda x3, South Africa x2, Tunisia/Namibia/Zambia-Zimbabwe x1 each) even though Kenya is now the freshest cluster with the Nairobi guide, and its Kenya pages make the planning demand no story held - the Mara page says no responsible itinerary should promise a river crossing on a fixed day. Two legacy Kenya-safari drafts in the registry were never completed deliverables, so nothing was duplicated.',
    '',
    'Live receipt: https://trekafricaguide.com/travel-insights/plan-first-kenya-safari-mara-reserve-or-conservancy/ - HTTP 200 (26,870 bytes) minutes after push: full article flow renders (gateway / reserve-vs-conservancy / timing-as-pattern / ask-before-pay checklist / route building), all five internal links render, and the travel-insights archive plus homepage search list it.',
    '',
    'Sourcing: maasaimara.com (1,510 km2, 450+ birds, Big 5 year-round, Jul-Oct classic window with Jun-Sep chart-best, live 15 Oct 2026 migration update as the no-fixed-crossing evidence, park fees not included in accommodation rates), Magical Kenya (KTB) Mara page, plus site-internal Kenya country, Mara, Nairobi (+KAA Wilson) and Amboseli pages. KWS still unreachable; no fees reprinted beyond attributed lines.',
    '',
    'Photos: 6 distinct licensed Wikimedia Commons files, all new to the photo library (the six-file Mara attraction and balloon collections were avoided): Mara River wildebeest jump (Danijel Mihajlovic CC BY-SA 4.0, 2020), cheetah past tour van (Michelle Juma CC BY-SA 4.0, 2018), safari vehicle under acacia (Daniel Case CC BY-SA 4.0, 2025), Olare Motorogi Conservancy hyena (Regina Hart CC BY-SA 2.0, 2019), Mara airstrip (Ninara CC BY 2.0, 2022), wildebeest hillside near Sand River Gate (Daniel Case CC BY-SA 4.0, 2025). On-caption attribution everywhere.',
    '',
    'Blockers: owner Gmail still signed out - this is the fifth run report waiting on one sign-in. CMS mirror pending: publishable-key reads return an empty result for the new travel_articles row (import lag) and 404 for local_destinations/editorial_documents; no writes attempted by rule.',
    '',
    'Commits: b15e196 (guide) + daa9f22 (receipt), both pushed to main this run (no 403).',
    '',
    'Next category: destinations.',
    '',
    '- Trek editorial automation',
  ].join('\n'),
};
j.travel_insight_plan_first_kenya_safari.email_status = 'required_signin_owner_gmail';
fs.writeFileSync(p, JSON.stringify(j, null, 2));
console.log('draft stored, email_status', j.email_status);
