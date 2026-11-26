# Sahara Dunes Desert Safari Activity — Research Ledger

**Date:** 2026-11-19
**Category:** activities
**Slug:** sahara-dunes-desert-safari
**Attraction:** sahara-dunes (Morocco)
**Booking Product:** GetYourGuide t52681 "From Marrakech: Merzouga 3-Day Desert Safari with Food" (Ando Travel Ltd)

---

## Evidenced Gap

Live `/attractions/sahara-dunes/` (HTTP 200, 19 Nov 2026) carries a verified GetYourGuide booking CTA for a 3-day Merzouga desert safari but renders **no Related activities section**. The attraction's "What draws people here" lists:
- Dune landscapes and changing light
- A slower route through southern Morocco
- Camp stays with clearly defined facilities
- Guided walks and optional activities matched to conditions

The activities archive (28 published) holds zero Morocco desert safari activities. The two existing Morocco activities are Atlas Mountains day trip and Marrakech Medina street-food tour — neither covers the classic Erg Chebbi desert experience.

---

## Verified Booking Product

**GetYourGuide t52681** — "From Marrakech: Merzouga 3-Day Desert Safari with Food"
- **Operator:** Ando Travel Ltd
- **Rating:** 4.6/5 from 15,718 reviews (checked 2026-11-19, browser-verified)
- **Duration:** 3 days, Marrakech round trip
- **Destination:** Merzouga / Erg Chebbi dunes
- **Inclusions per listing:** Food, camp accommodation (category selectable), camel trek, vehicle transfers
- **Key planning notes from listing:** Select camp category carefully; check meal, camel and vehicle-transfer arrangements; confirm pickup details

Registered in `content/booking-destinations.json` as `sahara-dunes` (attraction-level). Activity-level campaign: `activities_sahara_dunes_desert_safari`.

---

## Source Facts Checked (2026-11-19)

| Source | Claim | Checked |
|--------|-------|---------|
| GetYourGuide t52681 (browser) | Product title, operator, rating, review count, duration, destination, inclusions | 2026-11-19 |
| Sahara Dunes attraction (live) | What draws people here, planning notes, best time, how to get there | 2026-11-19 |
| Moroccan National Tourist Office (visitmorocco.com) | Desert itinerary framing, seasonal guidance | 2026-10-11 (in-repo) |
| UK FCDO Morocco travel advice | Entry requirements, safety | 2026-10-11 (in-repo) |
| ONMT desert journey page | "Escale du désert" official itinerary concept | 2026-10-11 (in-repo) |

---

## Activity Scope

New activity guide under attraction `sahara-dunes` covering the classic 3-day Marrakech–Merzouga round trip:
- Erg Chebbi dune landscapes and changing light
- Overnight desert camp stay (category selection critical)
- Camel trek experience (welfare considerations)
- Guided walks and optional activities matched to conditions
- Vehicle transfers: Marrakech → Merzouga → Marrakech (long driving days)
- Planning practicalities: camp category, bathroom privacy, meals, transfers, animal welfare, photography etiquette

Zero-image honest publish; six-subject exact/licensed photo backlog logged.

---

## Six-Subject Photo Backlog (Licensed Reuse Review Only)

1. Erg Chebbi dune field at sunrise/sunset (changing light)
2. Desert camp exterior with private tents (camp category reference)
3. Camel caravan on dunes with handler (welfare-aware framing)
4. Guided walk on dune ridge with guide (activity matched to conditions)
5. Vehicle transfer through southern Morocco landscape (route context)
6. Night sky / camp dinner setting (overnight experience)

No substitutes; official operator imagery is copyrighted.

---

## Cross-Links (All Live HTTP 200 Verified 2026-11-19)

- Attraction: `/attractions/sahara-dunes/`
- Stay: `/accommodations/desert-luxury-camp/`
- Country: `/countries/morocco/`
- Related activities: `/activities/atlas-mountains-day-trip/`, `/activities/marrakech-medina-street-food-tour/`

---

## Quality Bar Reference

Match formatting/layout of https://trekafricaguide.com/activities/volcanoes-golden-monkey-trekking/
- h2 sections: About this activity, Highlights, Best time to participate, Planning notes, Booking option, Nearby stays
- Short scannable paragraphs (2–4 sentences)
- Honest booking rail with exact Stay22-wrapped GetYourGuide URL
- No exposed markup
- Internal links render as live cards

---

## Booking CTA

Exact GetYourGuide t52681 URL Stay22-wrapped in built page. No rate, availability, or review-count-as-guarantee claims. Rating published with checked date hedge.

---

## Research Sources for Article

1. GetYourGuide t52681 product page (browser-verified 2026-11-19)
2. Sahara Dunes attraction guide (live, checked 2026-11-19)
3. Moroccan National Tourist Office: desert journey (visitmorocco.com, checked 2026-10-11)
4. UK FCDO Morocco entry requirements (checked 2026-10-11)
5. ONMT destination planning guidance (checked 2026-10-11)

---

## Next Steps

1. Write activity entry into `content/editorial-overrides.json`
2. Run `node scripts/check-build-inputs.mjs`
3. Full production build with `EDITORIAL_CMS_SYNC=false`
4. Readability guard pass
5. Commit and push to origin/main
6. Verify live HTTP 200
7. Update `docs/editorial-progress.json` with receipt