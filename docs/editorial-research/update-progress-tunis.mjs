// Ledger update for the Tunis destination run.
import fs from "node:fs";
const p = "docs/editorial-progress.json";
const d = JSON.parse(fs.readFileSync(p, "utf8"));
d.destination_tunis = {
  id: "tunis",
  category: "local-destinations",
  started: "2026-11-11",
  latest_run_note: "Scheduled 15:00 UTC routine run; executed on schedule.",
  selection_evidence:
    "Live /countries/tunisia/ (HTTP 200, 32,509 B, 11 Nov 2026) renders no Destinations in Tunisia rail while content/local-destinations.json held 16 records with no tunis slug; the live Tunisia cluster (country guide, tunis-and-sidi-bou-said attraction, dar-said stay, choose-first-night-tunis-medina-or-coast insight) was otherwise complete, so the capital had no anchor and the country page never rendered a destination rail. Duplicate check passed.",
  scope:
    "New local destination Tunis under Tunisia: UNESCO Medina of Tunis ref 36 framing (inscribed 1979, criteria ii/iii/v, 296.41 ha, founded 698 A.D., ~700 monuments, 88 nationally listed), the TGM corridor from Tunis Marine, FCDO entry rules, Ramadan festival note, confirm-provider hedges. Zero-image honest publish; six-subject backlog in the ledger.",
  files: [
    "content/local-destinations.json",
    "docs/editorial-research/2026-11-11-tunis-local-destination.md",
    "docs/editorial-research/add-tunis-destination.cjs",
    "docs/editorial-research/check-tunis-dist.mjs",
    "docs/editorial-research/verify-live-tunis.mjs",
    "docs/editorial-progress.json"
  ],
  images: 0,
  image_followup:
    "Six distinct licensed Tunis subjects, not reusable from the attraction/stay collections: Zitouna Mosque courtyard, Souq el-Attarine lane with sabat shade, Bab El-Bhar gate square, Tunis Marine TGM platform, Ville Nouvelle boulevard, rooftop view over medina minarets. Licensed-reuse review only; no substitutes.",
  booking_cta:
    "None by design: destination pages carry no hotel-booking surrogate; the stay surface is the published Dar Said guide and the insight links the exact Dar El Medina listing.",
  relationships: {
    country_slug: "tunisia",
    attraction_slugs: ["tunis-and-sidi-bou-said"],
    activity_slugs: [],
    accommodation_slugs: ["dar-said"],
    travel_insight_slugs: ["choose-first-night-tunis-medina-or-coast"]
  },
  key_facts_checked:
    "UNESCO ref 36 (whc.unesco.org/en/list/36/ fetched 11 Nov 2026) and the Urban Heritage Atlas page (fetched): 296.41 ha, buffer 190.19 ha, criteria (ii)(iii)(v), 698 A.D., 8th-century medina + 13th-century north/south suburbs, ~700 monuments, 88 nationally listed, Law 35-1994, over one million inhabitants / 212 km2 metro, Creative City of Crafts and Folk Art 2017, Ramadan festival per site-manager contribution. UK FCDO Tunisia entry requirements fetched 11 Nov 2026 (passport valid for duration of stay, 90-day visa-free, stamp, overstay fine, parts-of-Tunisia advisory). TRANSTU TGM + AMVPPC seasonal hours carried from the live insight with its 8 Nov 2026 check dates (transtu.com.tn did not resolve this run). On-site continuity: Tunisia country, Tunis And Sidi Bou Said attraction, Dar Said stay, first-night insight, all live 11 Nov.",
  build_checks:
    "check:build-inputs passed; production build 159 pages; readability guard passed on 164; dist verified pre-push (title, 8-section h2 flow per empty-activity house pattern, 10/10 facts, three cards, no CTA anchors, no markup leak).",
  cms:
    "Publishable-key REST reads 2026-11-11: travel_articles 200 (seeded rows only), local_destinations 404 (schema cache), editorial_documents 400 (RLS). Mirror pending; no writes attempted; owner-side CMS check to confirm local_destinations/tunis.",
  status: "published_live_confirmed",
  commit: "fcfa9d1 (content) + this receipt commit",
  publication: {
    content_commit: "fcfa9d1",
    pushed_to: "main",
    push_result: "success (1552927..fcfa9d1)",
    pushed_at: "2026-11-11",
    live_url: "https://trekafricaguide.com/countries/tunisia/tunis/",
    live_http_status: 200,
    checked_at: "2026-11-11",
    live_distinctive_text: "Tunis, Tunisia | Trek Africa Guide",
    live_checks: {
      detail:
        "HTTP 200 (35,233 B) ~60 s after push (first checks 404 pre-deploy); 8-section destination h2 flow; distinctive copy renders (296.41 ha, 698 A.D., 700 monuments, 88 listed, Creative City 2017, 90 days, Tunis Marine, Ramadan); no exposed markup.",
      cards:
        "Attractions (tunis-and-sidi-bou-said), Where to stay (dar-said), Travel insights (choose-first-night-tunis-medina-or-coast) render; all three targets HTTP 200.",
      country_rail:
        "Tunisia country page now renders Destinations in Tunisia with the Tunis card (was absent before this publish).",
      archive_home: "Homepage search lists /countries/tunisia/tunis.",
      cms: "Publishable-key reads as recorded under cms; mirror pending."
    }
  },
  next_category: "accommodations",
  next_action:
    "Rotate to accommodations next run; six-subject photo backlog tracked in the ledger; CMS owner-side check pending (standard)."
};
d.latest_run_checkpoint = {
  date: "2026-11-11 (15:00 UTC scheduled run)",
  run: "editorial content run (destinations - Tunis local destination)",
  status: "published_pushed_live_confirmed",
  live_url: "https://trekafricaguide.com/countries/tunisia/tunis/",
  deliverable_summary:
    "New destination guide Tunis, Tunisia — the first Tunisia destination page; facts from UNESCO ref 36, the Urban Heritage Atlas and fresh UK FCDO reads; Dar Said stay card and the first-night insight card added.",
  evidence:
    "Live Tunisia country page rendered no Destinations rail on 11 Nov 2026 while the country cluster was otherwise published; 16 local-destination records with no tunis slug.",
  cms: "Publishable-key reconcile 2026-11-11: travel_articles 200 (seeded rows only), local_destinations 404, editorial_documents 400 (RLS); mirror pending; no writes attempted.",
  owner_email:
    "Draft prepared and stored in this file (owner_email_draft); owner Gmail sign-in state re-checked during the run.",
  next_category: "accommodations"
};
fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
console.log("progress updated");
