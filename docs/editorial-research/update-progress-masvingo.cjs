// Update editorial-progress.json: add destination_masvingo deliverable + latest_run_checkpoint + owner_email_draft.
const fs = require("fs");
const path = "docs/editorial-progress.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

data.destination_masvingo = {
  id: "masvingo",
  category: "local-destinations",
  started: "2026-11-11",
  latest_run_note: "Scheduled 11:00Z routine run; executed on schedule. Accommodations rotation was filled this round by another agent's Great Zimbabwe Hotel guide (0e8c748); this run took the destinations category per that guide's own ledger gap.",
  selection_evidence:
    "Live /countries/zimbabwe/masvingo/ returned HTTP 404 (11 Nov 2026) while the live Zimbabwe country page renders no Destinations rail and homepage search lists zero Zimbabwe destinations; the live Great Zimbabwe National Monument attraction guide instructs readers to 'Plan the visit from Masvingo' and the same-day Great Zimbabwe Hotel guide's ledger records the missing Masvingo destination page.",
  scope:
    "New local destination Masvingo under Zimbabwe: province capital and nearest town to Great Zimbabwe National Monument (~27-30 km, UNESCO ID 364), Lake Mutirikwi and the Kyle Recreational Park, Chesvingo Karanga Village; confirm-provider hedges for fees/transport. Zero-image honest publish; six-subject backlog in the ledger.",
  files: [
    "content/local-destinations.json",
    "docs/editorial-research/2026-11-11-masvingo-destination.md",
    "docs/editorial-research/add-masvingo-destination.cjs",
    "docs/editorial-research/check-masvingo-dist.mjs",
    "docs/editorial-progress.json"
  ],
  images: 0,
  image_followup:
    "Six distinct licensed Masvingo subjects, not reusable from monument/hotel collections: Masvingo town centre streetscape, Great Zimbabwe Enclosure wall (if not already covered by the monument collection), Lake Mutirikwi from the dam wall, Kyle Recreational Park white rhino, Chesvingo Karanga Village cultural scene, Beza Range landscape. Licensed-reuse review only; no substitutes.",
  booking_cta:
    "None by design: destination pages carry no hotel-booking surrogate; the stay surface is the published Great Zimbabwe Hotel guide (no verified exact OTA listing for that property).",
  relationships: {
    country_slug: "zimbabwe",
    attraction_slugs: ["great-zimbabwe-national-monument"],
    activity_slugs: ["great-zimbabwe-guided-monument-visit"],
    accommodation_slugs: ["great-zimbabwe-hotel"],
    travel_insight_slugs: []
  },
  key_facts_checked:
    "UNESCO ID 364 (inscribed 1986, criteria i/iii/vi, 722 ha, ~30 km from Masvingo, 14th-century population >10,000, abandoned ~1450, Zimbabwe Birds, NMMZ, living sacred site); ZimParks Lake Kyle Recreational Park (169 sq km, ~30 km east, Beza Range 1,455 m, 25+ mammals incl white rhino, 35+ birds); Masvingo Publicity Association (27 km, city of almost 20,000 Shona 12th-15th C, Lake Mutirikwi formed 1961 ~25 km, Chesvingo Karanga Village 40 km); greatzimbabwewhs.com (founded 1890, name sequence Fort Victoria/Victoria 1929/Nyanda 1982/Masvingo 'fortifications'); greatzimbabweguide.com (A4 freight corridor, ~4 h Harare/Bulawayo, no reliable public transport to monument, charter-only airport) — all checked 11 November 2026. Carried conflicts with attribution (lake size, distance, city population).",
  build_checks:
    "check:build-inputs passed; production build 157 pages (EDITORIAL_CMS_SYNC=false); readability guard passed on 162 pages; dist verified pre-push (title, 8-section h2 flow, all facts and three cards, country rail, homepage search, no markup leak).",
  status: "published_live_confirmed",
  commit: "e5b88c0 (content) + this receipt commit",
  publication: {
    content_commit: "e5b88c0",
    pushed_to: "main",
    push_result: "success (0e8c748..e5b88c0)",
    pushed_at: "2026-11-11",
    live_url: "https://trekafricaguide.com/countries/zimbabwe/masvingo/",
    live_http_status: 200,
    checked_at: "2026-11-11",
    live_distinctive_text: "Masvingo, Zimbabwe | Trek Africa Guide",
    live_checks: {
      detail:
        "HTTP 200 (35,312 bytes) ~60 s after push; title correct; 8-section destination h2 flow (Explore Masvingo, Highlights, Getting there and around, Best time to visit, Planning your stay, Attractions to explore, Things to do, Where to stay); distinctive copy renders (fortifications name origin, Lake Mutirikwi, Chesvingo Karanga Village, Beza Range, 1986, 722 hectares, white rhino, UNESCO 30 km vs association 27 km attribution); no exposed markup.",
      cards:
        "Attractions to explore renders Great Zimbabwe National Monument; Things to do renders the guided monument visit; Where to stay renders Great Zimbabwe Hotel; all three targets HTTP 200.",
      country_rail:
        "Zimbabwe country page now renders 'Destinations in Zimbabwe' with the Masvingo card (was absent before this publish).",
      archive_home: "Homepage search lists /countries/zimbabwe/masvingo.",
      cms: "Publishable-key REST reads 2026-11-11: travel_articles 404, local_destinations 404, editorial_documents 404 (schema cache; previous runs travel_articles 200 seeded / editorial_documents 401). Mirror pending; no writes attempted; owner-side CMS check to confirm local_destinations/masvingo."
    }
  },
  next_category: "travel_insights",
  next_action:
    "Rotate to travel insights next run; six-subject photo backlog tracked in the ledger; CMS owner-side check pending (standard)."
};

data.latest_run_checkpoint = {
  date: "2026-11-11 (11:00 UTC scheduled run)",
  run: "editorial content run (destinations - Masvingo local destination)",
  status: "published_pushed_live_confirmed",
  live_url: "https://trekafricaguide.com/countries/zimbabwe/masvingo/",
  deliverable_summary:
    "New local destination Masvingo, Zimbabwe (destinations rotation; accommodations was filled this round by another agent's Great Zimbabwe Hotel guide pulled in 0e8c748): first Zimbabwe destination, the planning base behind the Great Zimbabwe monument cluster. Zero-image honest publish.",
  evidence:
    "/countries/zimbabwe/masvingo/ live 404 on 11 Nov 2026 while the Zimbabwe country page rendered no Destinations rail and the live attraction guide says 'Plan the visit from Masvingo'.",
  photos:
    "Zero-image; six-subject backlog in the ledger (town centre streetscape, Great Zimbabwe Enclosure wall, Lake Mutirikwi from the dam wall, Kyle Park white rhino, Chesvingo Karanga Village, Beza Range landscape).",
  cms:
    "Publishable-key reconcile 2026-11-11: travel_articles 404, local_destinations 404, editorial_documents 404 (schema cache this run); mirror pending; no writes attempted.",
  owner_email: "Draft prepared and stored in this file (owner_email_draft); owner Gmail sign-in state re-checked during the run (still signed out).",
  next_category: "travel_insights"
};

data.email_status = {
  run: "2026-11-11 (11:00 UTC run, Masvingo destination)",
  status: "blocked_owner_gmail_signed_out",
  detail:
    "Owner Gmail tab still shows the accounts.google.com sign-in page (no active owner session in the OpenBot browser), re-checked 11 Nov 2026; no sendable session this run. Draft saved below; no takeover requested per routine rule."
};

data.owner_email_draft = {
  to: "fsddanmugisa@gmail.com",
  prepared_at: "2026-11-11T14:30:00+03:00",
  subject: "Trek Africa Guide — new Masvingo destination guide live (run 11 Nov 11:00 UTC)",
  body: "Shipped this run: a new local destination guide, Masvingo, Zimbabwe — the first Zimbabwe destination on the site, closing the gap the same-morning Great Zimbabwe Hotel guide created: it sits at the monument with no city page behind it.\n\nEvidence: the live /countries/zimbabwe/masvingo/ URL returned 404 before this run while Zimbabwe's country page rendered no Destinations rail at all, the live Great Zimbabwe National Monument attraction guide tells readers to 'Plan the visit from Masvingo', and the homepage search listed zero Zimbabwe destinations.\n\nLive receipt: https://trekafricaguide.com/countries/zimbabwe/masvingo/ — HTTP 200 verified about a minute after push (commit e5b88c0). The full destination flow renders with official facts: UNESCO's record (inscribed 1986, criteria i/iii/vi, 722 ha, ~30 km from Masvingo, 14th-century population over 10,000, abandoned ~1450, the Zimbabwe Birds), ZimParks' Lake Kyle Recreational Park (169 sq km, white rhino, 35+ bird species), the Masvingo Publicity Association's Lake Mutirikwi and Chesvingo Karanga Village entries, and the town's Fort Victoria-to-Masvingo name history. Cards: Great Zimbabwe National Monument, the guided monument visit, and the Great Zimbabwe Hotel; the Zimbabwe country page now renders 'Destinations in Zimbabwe'; homepage search lists it. No exposed markup.\n\nPhotos: zero-image honest publish; six licensed Masvingo subjects logged for the backlog.\n\nBlockers: owner Gmail still signed out — this report is a draft in docs/editorial-progress.json; one sign-in ships it (plus earlier stored drafts). CMS mirror pending by design (publishable-key reads returned 404 for all three tables this run — schema cache; owner-side CMS check recommended to confirm local_destinations/masvingo).\n\nNote: the accommodations rotation was filled this round by the Great Zimbabwe Hotel guide published from another workstation; this run took destinations.\n\nNext rotation: travel insights."
};

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("progress updated");
