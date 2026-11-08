# Tunis first-night base choice insight — 8 November 2026

## Selection and scope

Rotation: travel insights. The 6 November queue still marks the Tunisia country page as offering "little help choosing the first overnight," and the published pages have since gained route detail (Tunis Marine boarding sequence on the country page, the two-stop Antonine Baths/Magon Quarter suggestion on the attraction page) while the **decision that binds the whole trip — medina city night vs Sidi Bou Saïd village night — remains unpublished**. New insight `choose-first-night-tunis-medina-or-coast` answers that decision, its effect on arrival day and the Carthage day, and the confirm-before-booking items. No changes to existing records; no booking-destinations change (the insight carries one exact-property link on the city side; the coast side points at the published Dar Saïd guide).

## Current official evidence (checked 8 November 2026)

- TRANSTU (public transport operator): [FAQ](https://www.transtu.tn/fr/faq) and [network map](https://www.transtu.tn/fr/carte) — Tunis Marine and La Marsa named as principal TGM stations; TGM ticket product and a published winter timetable 2026-2027 exist. Same-day stop service deliberately not asserted.
- AMVPPC: [Antoninian Baths](https://www.patrimoinedetunisie.com.tn/en/monuments/the-antoninian-baths/overview/) — waterfront complex; listed winter 08:30–17:00, summer 08:00–18:00, Ramadan 08:00–17:00; grouped ticket; check-date cost card listed 12 DT non-resident. [Magon Quarter](https://www.patrimoinedetunisie.com.tn/en/monuments/the-magon-quarter/overview/) — Punic residential quarter, narrow-corridor access. Hours/ticket figures are quoted with attribution and the check date; the first-ticket-office confirmation caveat is retained.
- UK FCDO [Tunisia entry requirements](https://www.gov.uk/foreign-travel-advice/tunisia/entry-requirements): British-citizen framing ("valid for the duration of your stay"), authorities set rules, embassy pointer; the page's regional advisory is referenced but not paraphrased into content.
- Dar El Médina official site: 4-star residence in the medina with restaurant. Its Booking.com listing (`/hotel/tn/dar-el-medina-tunis.html`) was matched as an exact-property destination from search-verified evidence naming the La Medina district; direct platform fetch returned automation verification (202), the same evidence standard recorded for Ridge Royal in October. No rating, review count, availability or rate claims are made.
- No dated third-party traveler review was verified for either property in this run, so no traveler_feedback claims were published.

## Editorial notes

- Body follows the established insight depth: research-check hedge, decision-led structure, transport + season/archaeology evidence, suitability guidance, confirm list, packing list, three FAQs, sources-and-scope with explicit editorial-vs-evidence distinction.
- The Stay22 resolver transforms the booking link server-side at build; verified in the generated HTML (`stay22.com/allez/booking?aid=trekafricaguide&link=.../dar-el-medina-tunis.html`).
- Meta title carries the site-suffix pattern used by the existing published insights (template also appends the suffix on some pages — consistent with the Sossusvlei page as shipped; flagged as a future site-wide title cleanup, not changed here).

## Build and rendered checks (local, production data)

- `check-build-inputs` passed; full production build: **129 pages built**, readability guard passed on **134 generated pages**.
- Generated page inspected: correct title/meta, all eight planned sections render, three internal links (country, attraction, Dar Saïd guide) and one Stay22-transformed exact-property link; no invented prices beyond the attributed AMVPPC figures; check date present; archive lists the insight.

## Images

Zero-image publication with the empty-hero state used by prior insights. Six-subject image backlog for the separate automation, distinct from the Tunisia gallery backlog recorded on 6 November: Tunis Marine platform, medina lane at first light, airport-arrival kerb, Antonine Baths colonnade, Magon Quarter corridor, Sidi Bou Saïd stairway view.

## Publication record

- Commit: this deliverable commit, pushed to `main`; Netlify production build follows; live verification to be recorded in the progress ledger at the next receipt commit.
- CMS mirror: production deploy imports the document at source_commit (EDITORIAL_CMS_SYNC=true); publishable-key read of `editorial_documents` remains blocked by RLS — owner-side CMS check recommended.
