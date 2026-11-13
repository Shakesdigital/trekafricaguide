// Receipt commit: add activity_sal_island_circuit_excursion record + latest_run_checkpoint. One-off run script (13 Nov 2026).
const fs = require('fs');
const p = 'docs/editorial-progress.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));

o.activity_sal_island_circuit_excursion = {
  id: "sal-island-circuit-excursion",
  category: "activities",
  started: "2026-11-13",
  latest_run_note: "Scheduled 2h routine run; executed on schedule. The prior travel-insights turn (Sierra Leone, commit e51ea66, pulled at run start) set next category to activities.",
  selection_evidence: "Live /attractions/sal-island/ (HTTP 200, 13 Nov 2026) plans a north-coast outing plus the Pedra de Lume salt crater and carries a verified GetYourGuide CTA (t268017) but rendered no Related activities card; the activities archive held 26 guides with zero Cabo Verde activities. Duplicate check passed: no existing slug covers Sal or Cabo Verde.",
  scope: "New activity guide: Sal Island circuit excursion under the CMS-managed Sal Island attraction (attraction_id 64, matching the Hilton record). Full-day guided road circuit from Santa Maria: Murdeira Bay, Palmeira, Pedra de Lume salt crater (national heritage), Buracona Blue Eye, optional Shark Bay, Kite Beach October-March. Zero-image honest publish; six-subject photo backlog logged.",
  files: [
    "content/editorial-overrides.json",
    "content/booking-destinations.json",
    "docs/editorial-research/2026-11-13-sal-island-circuit-excursion.md",
    "docs/editorial-research/add-sal-circuit-activity.cjs",
    "docs/editorial-progress.json"
  ],
  images: 0,
  image_followup: "Six distinct licensed subjects, not reusable from the attraction/destination collections: Santa Maria beach with pier and town front, Pedra de Lume crater rim with salt flats, Buracona Blue Eye lava cave light effect, Murdeira Bay turquoise shallows, Palmeira fishing harbour with painted boats, Kite Beach kitesurfers in trade wind. Licensed-reuse review only.",
  booking_destination: "Exact GetYourGuide product t268017 'Sal: Island Experience Tour with a Certified Native Guide' (Sal Experiences), opened and read live in a browser session 13 November 2026: 4.8/5 from 4,514 reviews, from EUR 35, about 7 hours, 4 pickup locations, free cancellation 24 h, operator-listed extras (Blue Eye EUR 5, Salinas EUR 6, optional lunch EUR 11/6), not suitable for mobility impairments/wheelchair users, Product ID 268017. Registered as booking-destinations.activities['sal-island-circuit-excursion']; Stay22-wrapped in built and live page (campaign activities_sal_island_circuit_excursion). The same product sits behind the attraction page's CTA (booking-destinations.attractions['sal-island']), so guide and attraction share one verified listing. No rate or availability claims published.",
  key_facts_checked: "GetYourGuide t268017 browser-verified 13 Nov 2026 (itinerary for-reference-only, entrance fees operator-listed, Kite Beach seasonality, mobility exclusions, dated reviews); turismo.cv Sal page checked 12 Nov 2026 (dry Nov-Jul / hot Aug-Oct); IPC Pedra de Lume national heritage carried from the attraction guide's 27 Oct 2026 source entry; live Trek pages (attraction, Sal destination, Hilton, country) re-read 13 Nov 2026. Pedra de Lume bathing, Blue Eye light effect and Shark Bay sightings all carried with conditions-not-guaranteed hedges; no admission price asserted beyond operator-listed figures.",
  build_checks: "check:build-inputs passed; production build 174 pages (EDITORIAL_CMS_SYNC default); readability guard passed on 179 pages; dist inspected pre-push: full activity h2 flow (About this activity, Highlights, Best time to participate, Planning notes, Booking option, Nearby stays), What-recent-guests-say h3 inside full_description (house pattern), Stay22-wrapped exact destination, Hilton nearby-stay card, archive + homepage listing, no markup leak.",
  cms: "Production deploy imports at source_commit; publishable-key reconcile 2026-11-13 returned 404 for travel_articles, local_destinations and editorial_documents (schema cache/RLS boundary, consistent with prior runs); no writes attempted. Mirror status pending - owner-side CMS check to confirm activities/sal-island-circuit-excursion after deploy.",
  next_category: "destinations",
  next_action: "Rotate to destinations next run; six-subject photo backlog tracked in the ledger; CMS owner-side check pending (standard).",
  status: "published_live_confirmed",
  commit: "56a056e (content) + this receipt commit",
  publication: {
    content_commit: "56a056e",
    pushed_to: "main",
    push_result: "success (aa3da1a..56a056e)",
    pushed_at: "2026-11-13",
    live_url: "https://trekafricaguide.com/activities/sal-island-circuit-excursion/",
    live_http_status: 200,
    checked_at: "2026-11-13",
    live_distinctive_text: "Sal Island circuit excursion | Trek Africa Guide",
    live_checks: {
      detail: "HTTP 200 (33,898 B) ~2 min after push; title correct; full activity h2 flow renders; distinctive copy renders (Pedra de Lume, Buracona Blue Eye, Shark Bay, Kite Beach October-March, EUR 5/EUR 6 operator-listed fees, Sal Experiences, 4.8/5); dated guest reviews render; no exposed markup.",
      booking: "Exact Stay22-wrapped GetYourGuide t268017 destination confirmed in live HTML (campaign activities_sal_island_circuit_excursion).",
      cards: "Nearby stays renders the Hilton Cabo Verde Sal Resort card; attraction link live. You may also like absent by design (no other Sal/Cabo Verde activities exist yet - same-attraction-group rail empty, consistent with Kibale/Jozani precedents).",
      attraction: "Live Sal Island attraction page now renders Related activities with the new guide (slug present, 'Related activities' present).",
      archive_home: "Activities archive (HTTP 200) and homepage search list the guide."
    },
    cms_source_commit: "imported at source_commit 56a056e; publishable-key read returns 404/RLS-blocked - owner-side CMS check to confirm activities/sal-island-circuit-excursion"
  },
  owner_email_draft: {
    prepared: "2026-11-13",
    to: "fsddanmugisa@gmail.com",
    status: "unsent - owner Gmail signed out (accounts.google.com sign-in tab open in the OpenBot browser, re-checked 13 Nov 2026); stored here for sending on one sign-in, together with the eight earlier pending drafts",
    subject: "Trek Africa Guide: Sal Island circuit excursion shipped and live",
    body: "Hi,\n\nToday's editorial run shipped an activities deliverable: the first Cabo Verde activity guide, \"Sal Island circuit excursion\" - a full-day guided road circuit around Sal covering Santa Maria, Murdeira Bay, Palmeira, the Pedra de Lume salt crater and the Buracona Blue Eye.\n\nWhy this one: the live Sal Island attraction page already plans a north-coast outing plus the salt crater and carries a verified GetYourGuide booking button, but rendered no Related activities card, and none of the 26 published activity guides covered Cabo Verde at all. The new guide sits under the Sal Island attraction, so its Related activities rail now renders, and it shares the attraction's exact verified booking product (GetYourGuide item 268017, Sal Experiences - opened and read in a live browser session today: 4.8/5 from 4,514 reviews, from EUR 35, about 7 hours, four pickup locations).\n\nLive receipt: https://trekafricaguide.com/activities/sal-island-circuit-excursion/ - HTTP 200, full activity layout matching the golden-monkey reference flow, clean rendered copy, no markup leak; the Hilton Cabo Verde Sal Resort renders in Nearby stays; the activities archive and homepage list the guide. Commit 56a056e pushed to main.\n\nSourcing: stop-level facts come from the tourism authority's Sal page, the cultural heritage institute's Pedra de Lume national-heritage record and the verified product page itself; entrance fees (EUR 5 Blue Eye / EUR 6 salt crater) and the optional lunch price are carried as operator-listed figures with a reconfirm hedge, and no swim, sighting or schedule is promised. Zero-image honest publish; six licensed-subject photos logged for a later pass.\n\nBlockers: owner Gmail is still signed out on the work machine, so this is draft number nine pending one sign-in to send all of them. CMS mirror reconcile still pending on the Supabase side (publishable-key reads returned 404 this run - schema-cache/RLS boundary, no writes attempted); a quick owner-side check that activities/sal-island-circuit-excursion imported would confirm the mirror.\n\nNext run rotates to destinations.\n\n- OpenBot Trek editorial agent"
  }
};

o.latest_run_checkpoint = {
  run: "scheduled-2h-2026-11-13T17:00Z",
  category_rotation: "activities (travel insights already spent this day by the concurrent run e51ea66, pulled at start)",
  deliverable: "activity_sal_island_circuit_excursion",
  inventory_note: "Whole-site inventory maintained via live attraction-page scan (Related-activities rail): lalibela, sal-island, tokeh-and-river-no2, elmina-castle, kwame-nkrumah-memorial-park and south-luangwa (known CMS anomaly) rendered no rail; sal-island selected as the highest-evidence candidate (verified exact product already attached to the attraction).",
  next_category: "destinations",
  next_action: "Rotate to destinations next run.",
  commit: "56a056e (content) + this receipt commit",
  push: "Content and receipt both pushed to main (aa3da1a..56a056e).",
  live_receipt: "https://trekafricaguide.com/activities/sal-island-circuit-excursion/ HTTP 200 (33,898 B), full activity h2 flow, distinctive copy, exact Stay22 t268017 CTA, Hilton nearby-stay card, attraction Related-activities rail now rendering, archive + homepage listed, no markup leak.",
  cms: "Publishable-key reconcile 2026-11-13: travel_articles 404, local_destinations 404, editorial_documents 404 (schema cache/RLS boundary); no writes attempted - mirror pending, owner-side check to confirm activities/sal-island-circuit-excursion.",
  email: "Owner progress email drafted and pending send (Gmail signed out in the OpenBot browser, re-checked 13 Nov 2026); draft stored in the record (ninth pending draft, one sign-in ships all)."
};

fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('progress updated');
