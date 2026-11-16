const fs = require('fs');
const path = 'docs/editorial-progress.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const deliverableKey = 'destination_serengeti_tanzania';
if (!data[deliverableKey]) {
  data[deliverableKey] = {
    id: 'serengeti',
    category: 'destinations',
    started: '2026-11-16',
    status: 'published_live_confirmed',
    run: 'scheduled-2h-2026-11-16T13:00Z',
    selection_evidence: "No Tanzania mainland destination existed live: /countries/tanzania/serengeti/ 404 on 16 Nov 2026 while the Serengeti National Park attraction, the Serengeti Serena Safari Lodge accommodation (enriched 16 Nov), the Serengeti balloon safari activity and the pair-Tanzania-Zanzibar insight were all live HTTP 200; candidate flagged in the 15 Nov run ledger.",
    scope: 'New local-destination guide for Serengeti: region-and-season planning copy (UNESCO property 156 facts and TANAPA planning patterns carried with dates), transfer and charge-separation guidance, in-park stay relationship via the published Serengeti Serena Safari Lodge guide, balloon excursion and Zanzibar-pairing cross-links. No booking CTA: no exact verified product attached and destinations carry none in the house flow.',
    files: [
      'content/local-destinations.json',
      'src/lib/photo-library.js',
      'public/photo-library.js',
      'public/images/editorial/serengeti-local-destination/',
      'docs/editorial-research/2026-11-16-serengeti-destination.md',
      'docs/editorial-research/add-serengeti-destination.mjs',
      'docs/editorial-progress.json'
    ],
    images: 6,
    photo_summary: 'Six distinct licensed exact-subject Wikimedia Commons photographs: open plains panorama (EmelineSG, CC BY-SA 4.0), Great Migration herds in Kogatende (Reginald Victor Runyoro, CC BY-SA 4.0), zebras among acacias (Agness Abubakar Saidi, CC0), cheetah resting in shade (Agness Abubakar Saidi, CC0), lioness atop a kopje (Richard Mortel, CC BY 2.0), Masai giraffe (Giles Laurent, CC BY-SA 4.0). Full records with sha256, dates, edits and reuse notes in photo-library.js; CC BY/BY-SA creators render on /photo-credits.',
    key_facts_checked: 'UNESCO WHC record 156 (inscribed 1981, criteria vii/x, 1,476,300 ha, 1.5M ha savannah, 1,000-km migration, Mara as the only perennial river) fetched 16 Nov 2026. TANAPA planning facts carried from the in-repo attraction record with its 2026-10-11 verification date (tanzaniaparks.go.tz unreachable 16 Nov). Serena lodge transfer facts (335 km Arusha, 27 km Seronera airstrip) from its published guide. Live slugs checked: serengeti-national-park, serengeti-balloon-safari, serengeti-serena-safari-lodge, pair-tanzania-safari-with-zanzibar-coast, countries/tanzania.',
    quality_bar: 'Rendered and live HTML compared with the activities/volcanoes-golden-monkey-trekking reference: six-photo gallery with per-photo alt from the library, house destination h2 flow (Explore, Highlights, Getting there and around, Best time to visit, Planning your stay) plus directory card sections, clean copy, no markup leak; booking CTA not in the destination house flow (none attached).',
    build_checks: 'check-build-inputs passed; production build (EDITORIAL_CMS_SYNC=false) 184 pages; readability guard passed on 189; dist page rendered full flow with six images and all cards pre-push.',
    publication: {
      content_commit: 'fe495dd',
      pushed_to: 'main',
      push_result: 'success (5bf45c3..fe495dd)',
      pushed_at: '2026-11-16',
      live_url: 'https://trekafricaguide.com/countries/tanzania/serengeti/',
      live_http_status: 200,
      checked_at: '2026-11-16',
      live_checks: {
        detail: 'HTTP 200 (46,049 bytes); distinctive copy renders (hero title, UNESCO 1,476,300 ha, Mara perennial-river framing, 335 km lodge transfer); all six gallery subjects present; no escaped markup.',
        cards: 'Tanzania country page links /countries/tanzania/serengeti; destination page renders Attractions to explore, Things to do, Where to stay, Travel insights and More-destinations card rails.',
        assets: 'Spot-checked gallery asset HTTP 200 image/jpeg (lioness-atop-kopje.jpg).',
        credits: '/photo-credits live with EmelineSG, Richard Mortel and Giles Laurent.'
      },
      cms_source_commit: 'fe495dd'
    },
    cms: 'Publishable-key REST read: travel_articles 200; local_destinations 404 (schema cache, unchanged); editorial_documents 400 (service-role data not readable, by design). No writes attempted. Owner-side CMS check pending for the serengeti destination record.',
    booking_cta: 'None: no exact verified current product attached; destination house flow carries no CTA. The Serengeti Serena Safari Lodge guide keeps its explicit no-verified-booking-link state.',
    next_category: 'accommodations',
    next_action: 'Rotate to accommodations next run. Open items: six-photo backlogs (Amboseli Serena, Serengeti Serena, Ouidah-Ganvie subjects, Lalibela insight subjects), President Hotel Stay22-wrap recheck, owner Gmail sign-in.',
    email_status: 'draft_pending_gmail_signin',
    owner_email_draft: {
      to: 'fsddanmugisa@gmail.com',
      subject: 'Trek Africa Guide progress — Serengeti destination guide live (16 Nov)',
      body: "Hi Dan,\n\nToday's run shipped a Serengeti destination guide — the first Tanzania mainland destination, closing the gap flagged after the Serengeti Serena Lodge work.\n\nWhat shipped: https://trekafricaguide.com/countries/tanzania/serengeti/ (HTTP 200, verified live). Region-and-season planning copy sourced from the UNESCO World Heritage record (property 156, inscribed 1981) and the existing TANAPA-based attraction guide, cross-linked to the Serengeti Serena Safari Lodge guide, the balloon safari activity and the Serengeti-Zanzibar pairing insight. Tanzania's country page now lists it.\n\nPhotos: six distinct licensed Wikimedia Commons subjects (open plains, Great Migration in Kogatende, zebras among acacias, cheetah in shade, lioness on a kopje, Masai giraffe). Attribution-required creators (EmelineSG, Richard Mortel, Giles Laurent) render on /photo-credits.\n\nCommit fe495dd pushed to main (5bf45c3..fe495dd); push worked this run. CMS mirror: publishable-key reads unchanged (travel_articles 200, local_destinations schema-cache 404, editorial_documents service-role blocked); owner-side check for the serengeti record appreciated.\n\nOne sign-in would ship several progress emails: the owner Gmail in the OpenBot browser is still signed out, so this and the earlier pending drafts are stored in docs/editorial-progress.json.\n\nNext run: accommodations rotation.\n\n— Trek editorial automation"
    }
  };
}

data.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-16T13:00Z',
  category_rotation: 'destinations',
  deliverable: deliverableKey,
  inventory_note: 'Rolling inventory maintained 16 November 2026: destinations directory (24 published local destinations, Tanzania had none), country pages re-swept for attraction/stay clusters without a destination (Serengeti chosen as the ledger-flagged candidate; other evidenced gaps remain: Okavango Delta, South Luangwa, Kruger, Murchison, Amboseli, Maasai Mara), activities and insights archives re-checked for duplicates.',
  next_category: 'accommodations',
  next_action: 'Rotate to accommodations next run. Open items: six-photo backlogs (Amboseli Serena, Serengeti Serena, Ouidah-Ganvie, Lalibela insight), President Hotel Stay22-wrap recheck, owner Gmail sign-in.',
  commit: 'fe495dd (content) + this receipt commit',
  push: 'success (5bf45c3..fe495dd)',
  live_receipt: 'https://trekafricaguide.com/countries/tanzania/serengeti/ HTTP 200 — see ' + deliverableKey + '.publication.live_checks',
  cms: 'Publishable-key reconcile: travel_articles 200; local_destinations 404 (schema cache); editorial_documents 400 (service-role, by design). No writes. Owner-side CMS check pending for the serengeti destination.',
  email: 'Owner email prepared as draft (Gmail signed out in the OpenBot browser, re-checked 16 Nov 2026); stored in ' + deliverableKey + '.owner_email_draft. One sign-in ships it plus the earlier pending drafts.'
};

data.updated_at = new Date().toISOString();
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('progress updated');
