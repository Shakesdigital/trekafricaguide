// Update docs/editorial-progress.json for the Marrakech riad-or-Gueliz run (2026-11-10 15:00 UTC scheduled)
import fs from 'node:fs';

const p = 'docs/editorial-progress.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

const now = new Date().toISOString();

data.latest_run_checkpoint = {
  date: `2026-11-10 (15:00 UTC scheduled run)`,
  run: 'editorial content run (travel insights - Marrakech riad or Gueliz hotel)',
  status: 'published_pushed_live_confirmed',
  live_url: 'https://trekafricaguide.com/travel-insights/where-to-sleep-in-marrakech-riad-or-gueliz/',
  deliverable_summary: 'New travel insight "Where to sleep in Marrakech: a medina riad or a Gueliz hotel" (travel-insights rotation): Northern Africa\u2019s first story on the journal, angled as the stay-decision page the Marrakech cluster lacked \u2014 side-of-the-ramparts decision order (evening rhythm, riad form, Gueliz trade, medina arrival test, noise/stairs/shared space, pre-payment checklist). Six distinct licensed Commons photos wired as in-body figures + hero.',
  evidence: 'Live insight archive held 11 published stories with zero Northern Africa coverage while the live Morocco cluster (country, Marrakech destination, Marrakech And Atlas attraction, two activities, Rosemary Marrakech riad) all HTTP 200 on 10 Nov 2026; the destination page carries the city\u2019s pacing guide but answers the stay choice in a single planning bullet. No prior draft or registry entry with the slug.',
  photos: 'Six distinct new Wikimedia Commons files verified on file pages, downloaded sequentially (thumb CDN / original), SHA-256 recorded, visually inspected: Jemaa el-Fna evening (Jakub Ha\u0142un CC BY 4.0, 2025), riad courtyard pool at night (L. Antoine CC BY-SA 3.0, 2007), Haddadine souk lanterns (Petar Milo\u0161evi\u0107 CC BY-SA 4.0, 2024), Bahia Palace court (Val Traveler CC BY-SA 4.0, 2016), Koutoubia over rooftops (Schorle CC BY-SA 4.0, 2016), Gueliz avenue (mwanasimba CC BY-SA 2.0, 2006). Riad/avenue frames illustrate the city typology; no specific property or business named in copy or captions.',
  build_checks: 'check-build-inputs passed; production build 149 pages (production env, EDITORIAL_CMS_SYNC=false); readability guard passed on 154 generated pages; dist inspection pre-push (36/36 record checks: h-flow, quotes, credits, links, no leak, archive+home listing, title single suffix).',
  content_commit: 'f5b0d7c (content); push 4ea679b..f5b0d7c to main succeeded (first push attempt went straight through; pull --rebase was blocked by unstaged dist churn only)',
  quality_bar: 'Compared dist HTML formatting against the golden-monkey activity reference in the same run at the pattern level: clean rendered copy (readability guard 154), single title suffix, figure + figcaption credit blocks, no exposed markup. Insight pages legitimately carry no Booking option h2 (no product CTA by design), matching the Okavango insight precedent.',
  live_verification: '2026-11-10, minutes after push (first check at ~1 min returned 404 pre-deploy; re-check after 3 min): detail URL HTTP 200 (30,617 bytes); title correct; decision-order h3 sections render; verbatim quotes render; 6/6 gallery JPEG assets HTTP 200 image/jpeg; travel-insights archive lists the slug; all six internal links present; no exposed markup.',
  cms: 'Publishable-key reconcile 2026-11-10 (SUPABASE_PUBLISHABLE_KEY in repo .env; task key name TREK_SUPABASE_PUBLISHABLE absent): travel_articles 200 (1 seeded row id:2, no new-slug row \u2014 deploy import pending), editorial_documents 400 to anon, local_destinations 404 (not in schema cache); mirror pending; no writes attempted.',
  owner_email: 'Draft prepared and stored in this file (owner_email_draft); owner Gmail sign-in state re-checked during the run.'
};

data.travel_insight_marrakech_riad_or_gueliz = {
  id: 'where-to-sleep-in-marrakech-riad-or-gueliz',
  category: 'travel_insights',
  slug: 'where-to-sleep-in-marrakech-riad-or-gueliz',
  title: 'Where to sleep in Marrakech: a medina riad or a Gueliz hotel',
  started: '2026-11-10',
  latest_run_note: 'Scheduled 15:00 UTC routine run; executed on schedule.',
  selection_evidence: 'Live travel-insights archive (HTTP 200, 10 Nov 2026): 11 published stories, zero Northern Africa. Live Morocco cluster (all HTTP 200): country guide, Marrakech destination page, Marrakech And Atlas attraction, two activities (street-food tour, Atlas day trip), Rosemary Marrakech riad stay. The destination page\u2019s stay guidance is a single planning bullet; no story answers the book-first decision of medina walls vs modern district.',
  scope: 'New travel insight under the published Marrakech cluster; decision-order city-planning story (City planning category, matching the Cape Town/Tunis precedents); no booking CTA by design; internal links to the six published cluster pages.',
  files: [
    'content/editorial-overrides.json',
    'src/lib/photo-library.js',
    'public/photo-library.js',
    'public/images/editorial/marrakech-riad-or-gueliz/ (6 files)',
    'docs/editorial-research/2026-11-10-marrakech-riad-or-gueliz-insight.md',
    'docs/editorial-research/add-marrakech-riad-or-gueliz-insight.mjs',
    'docs/editorial-research/check-marrakech-dist.mjs',
    'docs/editorial-research/verify-live-marrakech.mjs',
    'docs/editorial-research/commons-search-marrakech.mjs',
    'docs/editorial-research/commons-meta-marrakech.mjs',
    'docs/editorial-research/download-marrakech-photos.mjs',
    'docs/editorial-research/fetch-marrakech-internals.mjs',
    'docs/editorial-progress.json',
  ],
  images: 6,
  booking_cta: 'None by design: insight pages carry no product CTA; revenue surface goes to the two published Marrakech activity cards (Atlas day trip, street-food tour) and the Rosemary stay rail via cross-links. Rosemary\u2019s own page documents that a verified booking link for the listing is not yet available \u2014 none substituted or attached.',
  key_facts_checked: 'ONMT visitmorocco.com Marrakech page (HTTP 200, 10 Nov 2026): riads "small oriental palaces overlooking a beautiful patio"; "you just have to leave the ramparts to be immersed in modern Morocco"; Gueliz/Hivernage "the most modern infrastructures, luxury boutiques and international ready-to-wear stores, airy avenues"; three-day allowance; March\u2013May / September\u2013November window. UNESCO ICH record 00014 (HTTP 200): square at the entrance of the Medina, performances all through the day and well into the night, protection since 1922, proclaimed 2001 and inscribed 2008, urbanization and widespread tourism as threats. Internal pages (live 10 Nov 2026): riad-rosemary (request the named room; nearest vehicle drop-off and luggage assistance; shared house spaces unless exclusive hire), marrakech-and-atlas (courtyard-centered riad form; "a vehicle may not reach the door"; the walking-access/noise/stairs comparison rule; two unhurried city days + separate Atlas day), countries/morocco (location and access matter as much as design; compare specific inclusions rather than labels; privacy of residents), countries/morocco/marrakech (official three-day frame; FCDO entry formalities), medina street-food tour (arrive hungry; dietary needs). No rates, star counts or review counts published.',
  pre_push_verification: 'dist check all PASS (36/36: title, six h3 sections, verbatim quotes, 6 figure images + credits, archive + home listing, no booking anchors, no markup leak, single title suffix); check-build-inputs passed; production build 149 pages; readability guard 154 pages.',
  internal_links: [
    '/countries/morocco/marrakech',
    '/countries/morocco',
    '/attractions/marrakech-and-atlas',
    '/activities/marrakech-medina-street-food-tour',
    '/activities/atlas-mountains-day-trip',
    '/accommodations/riad-rosemary',
  ],
  status: 'published_pushed_live_confirmed',
  content_commit: 'f5b0d7c',
  publication: {
    content_commit: 'f5b0d7c',
    pushed_to: 'main',
    push_result: 'success (4ea679b..f5b0d7c)',
    pushed_at: '2026-11-10',
    live_url: 'https://trekafricaguide.com/travel-insights/where-to-sleep-in-marrakech-riad-or-gueliz/',
    live_http_status: 200,
    checked_at: '2026-11-10',
    live_checks: {
      detail: 'HTTP 200 (30,617 bytes) after Netlify deploy lag; title "Where to sleep in Marrakech: a medina riad or a Gueliz hotel | Trek Africa Guide"; decision-order h3 sections and verbatim quotes render; no exposed markup.',
      assets: '6/6 /images/editorial/marrakech-riad-or-gueliz/*.jpg live HTTP 200 image/jpeg.',
      archive_home: 'Travel-insights archive lists the slug; internal links to the six cluster pages present.',
      cms: 'Production deploy imports the record at source_commit f5b0d7c; publishable-key read of editorial_documents stays blocked \u2014 owner-side CMS check to confirm travel_insights/where-to-sleep-in-marrakech-riad-or-gueliz.',
    },
  },
  cms_status: 'pending (anon read blocked/lagging by design; source_commit f5b0d7c)',
  next_action: 'Rotate to accommodations next run; six-subject photo follow-ups already tracked in the ledger (Rosemary property photos require owner-side imagery rights decision); CMS owner-side check pending (standard).',
  next_category: 'accommodations',
};

data.updated_at = now;

// Owner email draft (inbox-side; to be sent when Gmail is signed in)
data.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  prepared_at: now,
  subject: 'Trek Africa Guide \u2014 new travel insight live: Marrakech stay decision (run 10 Nov 15:00 UTC)',
  body: 'Shipped this run: a new travel insight, "Where to sleep in Marrakech: a medina riad or a Gueliz hotel" \u2014 Northern Africa\u2019s first story on the site, aimed at the stay decision the Marrakech cluster (destination page, attraction guide, two activities, Rosemary riad) was missing. Decision order: where your evenings happen, what a riad buys you, what Gueliz answers, the medina arrival test, noise/stairs/shared space, and a pre-payment checklist.\n\nLive receipt: https://trekafricaguide.com/travel-insights/where-to-sleep-in-marrakech-riad-or-gueliz/ \u2014 HTTP 200, all six gallery photos (Wikimedia Commons, CC-sourced: Jakub Ha\u0142un, L. Antoine, Petar Milo\u0161evi\u0107, Val Traveler, Schorle, mwanasimba) serving 200, archive listing confirmed, no markup leak.\n\nBuild: commit f5b0d7c pushed to main (4ea679b..f5b0d7c), clean production build (149 pages), readability guard passed.\n\nBlockers: CMS mirror still pending \u2014 editorial_documents/travel_articles remain unreadable/seed-only to the publishable key; owner-side CMS check recommended. Owner Gmail was signed out this run, so this report was stored and sent manually/later. Booking note: Rosemary Marrakech still has no verified booking link; none was substituted.\n\nNext rotation: accommodations.',
};

fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
console.log('progress updated, updated_at', now);
