const fs = require('fs');
const p = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/docs/editorial-progress.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

j.updated_at = new Date().toISOString();
j.last_run = new Date(Date.now() + 0).toISOString();

j.latest_run_checkpoint = {
  date: '2026-11-09 (evening run)',
  run: 'editorial content run (travel insights - Plan a first Kenya safari)',
  status: 'published_pushed_live_confirmed',
  content_commit: 'b15e196 (content) — pushed to main 39543ef..b15e196; push worked this run, no 403',
  live_url: 'https://trekafricaguide.com/travel-insights/plan-first-kenya-safari-mara-reserve-or-conservancy/',
  live_verification: 'HTTP 200 (26,870 bytes) minutes after push, verified 2026-11-09: title correct; full article h2/h3 flow renders (gateway / reserve-vs-conservancy / timing-as-pattern / ask-before-pay checklist / route building); all 6 figure captions with creator+license attribution render; hero asset HTTP 200 (513,232 bytes = local dist size); the 5 internal links render as site-standard hrefs; /travel-insights/ archive (HTTP 200, 31,941 bytes) lists the new slug; no exposed markup.',
  evidence: 'Live travel-insights archive holds 8 published stories with zero Kenya coverage (Uganda x3, South Africa x2, Tunisia/Namibia/Zambia-Zimbabwe x1 each), while the site\'s freshest cluster is Kenya (Nairobi destination shipped today) and its Kenya pages demand the planning decision no story holds: country page "distinguish a migration pattern from a guaranteed crossing"; Mara page "no responsible itinerary should promise a river crossing on a fixed day". Registry: plan-first-east-africa-safari and uganda-vs-kenya-first-time-safari exist only as legacy drafts, never completed deliverables, so no duplication.',
  deliverable_summary: 'New travel insight "Plan a first Kenya safari: reserve or conservancy, road or fly-in" (Practical travel / East Africa / Kenya, 7 min read): gateway decision (Nairobi planning gateway, road via Narok vs fly-in Wilson Airport + airstrip-camp match), reserve vs conservancy trade (access models, park fees not included in accommodation rates per maasaimara.com), timing as pattern not appointment (Jul-Oct classic window per maasaimara.com month chart, live 15 Oct 2026 migration update as evidence, Mar-May low season sourced), ask-before-pay checklist, route building (one base, Amboseli pairing, balloon morning cross-link).',
  photos: '6 distinct licensed Wikimedia Commons files, all new to the library (6 prior Mara attraction/balloon collection files avoided): wildebeest Mara River jump (Danijel Mihajlovic CC BY-SA 4.0, 2020-09-14), cheetah past tour van (Michelle Juma CC BY-SA 4.0, 2018-12-10), safari vehicle under acacia (Daniel Case CC BY-SA 4.0, 2025-08-21), Olare Motorogi Conservancy hyena (Regina Hart CC BY-SA 2.0, 2019-12-19), Mara airstrip lapas (Ninara CC BY 2.0, 2022-09-29), wildebeest hillside near Sand River Gate (Daniel Case CC BY-SA 4.0, 2025-08-21). Downloaded via API after an initial 429 rate-limit burst, re-verified on Commons file pages, resized to 1800px JPEG q85, SHA-256 recorded in photo-library entries, on-caption attribution (licenses require it).',
  build_checks: 'Production build 139 pages; readability guard passed on 144; local dist verified: article renders hero + 6 figures, all 6 local assets exist, archive + homepage search list the slug, all 5 internal links render as site-standard hrefs, zero JSON/markup leak in article body.',
  cms: 'Publishable-key reconcile 2026-11-09: travel_articles filtered query returns 200 but empty for the new slug (server-side import lag, mirror pending); local_destinations and editorial_documents return 404 to anon (editorial_documents was 400 in earlier runs). No writes attempted by rule.',
  next_category: 'destinations',
};
j.next_task_selection = 'Rotate to destinations next run; re-verify the destination archive; owner-email send still blocked on Gmail sign-in.';

j.travel_insight_plan_first_kenya_safari = {
  id: 'plan-first-kenya-safari-mara-reserve-or-conservancy',
  category: 'travel_insights',
  started: '2026-11-09',
  scope: 'New published travel insight planning a first Kenya safari; gap: zero published Kenya stories while Uganda has three; Kenya pages hold demands (migration-not-promise language) no published story answers.',
  files: [
    'content/editorial-overrides.json',
    'src/lib/photo-library.js',
    'public/photo-library.js',
    'public/images/editorial/plan-first-kenya-safari-mara/ (6 files)',
    'docs/editorial-research/2026-11-09-plan-first-kenya-safari-insight.md',
    'docs/editorial-research/add-first-kenya-safari-insight.cjs',
    'docs/editorial-research/verify-mara-insight.cjs',
    'docs/editorial-research/fetch-mara-insight-photos.ps1',
  ],
  images: 6,
  booking_cta: 'None by design: insight pages carry no product CTA (house pattern); revenue surface goes to the Mara balloon activity card + stays rails via cross-links.',
  key_facts_checked: 'maasaimara.com homepage (1,510 km2, 450+ birds, Big 5 year-round, Jun-Sep best / Jul-Oct classic / Mar-May low month chart, live migration update 15 Oct 2026, fees not included in accommodation rates, Mara as northern extension of Serengeti); magicalkenya.com Mara page (Maasai + Mara River naming, Big Five, balloon/walks/night-drive menu); site-internal Kenya country, Mara, Nairobi (+KAA Wilson 5 km Langata Road), Amboseli pages recovered live; KWS still unreachable, no fees reprinted beyond attributions to maasaimara.com.',
  commit: 'b15e196',
  cms: 'mirror pending (see latest_run_checkpoint)',
  live_verification: 'HTTP 200 (26,870 bytes) confirmed minutes after push; hero asset 200 = local size; archive and homepage search list slug; all figures + attributions render; no markup leak.',
  email_status: 'required_signin_owner_gmail',
  push_status: 'pushed (39543ef..b15e196) — no 403 this run',
  next_category: 'destinations',
};

fs.writeFileSync(p, JSON.stringify(j, null, 2));
console.log('progress updated; checkpoint status:', j.latest_run_checkpoint.status);
