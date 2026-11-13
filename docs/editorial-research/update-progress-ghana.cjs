const fs = require('fs');
const p = JSON.parse(fs.readFileSync('docs/editorial-progress.json', 'utf8'));

p.latest_run_checkpoint = {
  run: 'scheduled-2h-2026-11-13T11:00Z',
  category_rotation: 'travel_insights',
  deliverable: 'travel_insight_plan_first_ghana_trip',
  inventory_note: "Travel-insights index (live HTTP 200, 13 Nov 2026) covered 14 countries with no dedicated Ghana planning story, while Ghana now has the site's densest West Africa cluster (Elmina destination, Cape Coast Kakum / Elmina Castle / Kwame Nkrumah Memorial Park attractions, three stay guides). New insight plan-first-ghana-trip-accra-and-the-castle-coast fills the gap and cross-links the whole cluster.",
  next_category: 'accommodations',
  next_action: 'Rotate to accommodations next run. Stay-guide backlog and country coverage checks per progress ledger.',
  live_receipt: 'https://trekafricaguide.com/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/ HTTP 200, 10 h2s, 6 distinct licensed photos all HTTP 200 image/jpeg, no markup leak.',
  commit: '5eaf7d1',
  push: 'Pushed to main (612e380..5eaf7d1) — push worked, the earlier 403 read-only-token blocker did not reproduce.',
  cms: "Publishable-key reconcile 2026-11-13: travel_articles 200 (10 rows), local_destinations 404 (schema cache), editorial_documents 400 to anon (RLS); no writes attempted — owner-side CMS check to confirm travel_articles/plan-first-ghana-trip-accra-and-the-castle-coast imported.",
  email: 'Owner progress email drafted and pending send (Gmail sign-in still pending on the work machine); draft stored below as owner_email_draft.'
};

p.travel_insight_plan_first_ghana_trip = {
  date: '2026-11-13',
  run: 'scheduled-2h-2026-11-13T11:00Z',
  slug: 'plan-first-ghana-trip-accra-and-the-castle-coast',
  title: 'Plan a first Ghana trip: Accra arrival and the Cape Coast–Elmina castle circuit',
  url: 'https://trekafricaguide.com/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/',
  evidence: 'Live /travel-insights/ (HTTP 200, 13 Nov 2026) had no dedicated Ghana planning insight while the live Ghana cluster (country guide, Elmina destination, three attraction guides, three stay guides) was fully published. Insight index covered SA, Uganda, Zambia/Zim, Namibia, Tunisia, Rwanda, Kenya, Tanzania, Botswana, Morocco, Egypt, Zimbabwe, Cabo Verde and multi-country pieces only.',
  sources: ['UK FCDO Ghana travel advice (updated 4 Nov 2026, checked 13 Nov 2026): entry requirements, safety and security', 'Ghana Tourism Authority visitghana.com travel information and getting-around pages (checked 13 Nov 2026)', "Site's own Ghana country and Cape Coast Kakum attraction pages (verbatim quotes carried with backlinks)"],
  photos: 'Six distinct licensed photographs downloaded into public/images/editorial/plan-first-ghana-trip/ and registered in both photo-library files: Independence Arch sunset (Kwameghana, CC0), Cape Coast Castle 2011 (Rjruiziii, CC BY-SA 3.0), Kakum canopy walkway 2022 (daSupremo, CC BY-SA 4.0), Elmina Castle 2023 (Matti Blume, CC BY-SA 4.0), Kwame Nkrumah Memorial Park 2008 (Erik B. Anderson, CC BY-SA 4.0), Jamestown Lighthouse 2017 (Gereon K., CC BY-SA 4.0). All six verified HTTP 200 image/jpeg live.',
  quality_bar: 'Rendered page checked against the insight-article layout of the site (hero cover, in-body figure cards with creator/licence captions, 10-h2 decision flow ending Confirm before you book / Three questions / Continue planning / Sources and scope). Built with the readability guard passing (176 pages).',
  blockers: 'Owner Gmail sign-in pending; CMS editorial mirror pending owner-side import check.'
};

p.owner_email_draft = {
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek editorial run 13 Nov: Ghana first-trip insight shipped and live',
  body: "Hi,\n\nToday's editorial run shipped a travel-insights deliverable: a new planning story, \"Plan a first Ghana trip: Accra arrival and the Cape Coast–Elmina castle circuit\".\n\nWhy this one: the live Travel Insights index covered 14 countries but had no dedicated Ghana planning story, while Ghana is now the site's densest West Africa cluster — the Ghana country guide, the Elmina destination, Cape Coast Kakum, Elmina Castle and Kwame Nkrumah Memorial Park attraction guides, and three stay guides. The new insight ties the cluster together with the decisions that actually shape a first trip: the visa timeline (10–15 days standard, express in-person), the yellow fever certificate and online health declaration, the first-night Accra base, and the paced castle circuit with Kakum on its own morning.\n\nLive receipt: https://trekafricaguide.com/travel-insights/plan-first-ghana-trip-accra-and-the-castle-coast/ — HTTP 200, 10-section decision flow, no markup leak. Commit 5eaf7d1 pushed to main (push worked this run; the earlier 403 blocker did not reproduce).\n\nPhotos: six distinct licensed photographs from Wikimedia Commons (CC0 and CC BY-SA 2.0–4.0), each with creator and licence credited in captions and registered in the photo-credits library — Independence Arch, Kwame Nkrumah Memorial Park, Jamestown Lighthouse, Cape Coast Castle, the Kakum canopy walkway and Elmina Castle. All six verified live.\n\nBlockers: owner Gmail is signed out on the work machine, so this progress email is stored as a draft pending one sign-in (alongside earlier drafts: Accra, Elmina, Sal, Tokeh, Maun); CMS editorial mirror reconcile still pending on the Supabase side — worth a quick owner-side check that the CMS imported source_commit 5eaf7d1.\n\nNext run rotates to accommodations.\n\n- OpenBot Trek editorial agent"
};
fs.writeFileSync('docs/editorial-progress.json', JSON.stringify(p, null, 1) + '\n');
console.log('progress updated');
