# Bwindi gorilla trekking photo enrichment — 28 October 2026

## Scope and baseline

The production detail `https://trekafricaguide.com/activities/bwindi-gorilla-trekking/` returned HTTP 200 before editing and displayed exactly two photo-library gallery assignments: the Bwindi starter and destination defaults. Its article has no inline photographs; other main-page image tags repeat gallery markup and include linked-card imagery. The full guide was reviewed. It describes Uganda Wildlife Authority-guided trekking across four distinct sectors, the variable forest walk and observation period, and a linked Kigali day trip with border crossings. It does not promise a sighting, identify a specific gorilla family or claim that a pictured visitor joined the tour. Existing default-image credit text names Diego Delso and Thomas Fuhrmann under CC BY-SA 4.0. Those defaults and public credits remain unchanged.

## Selected photographs

The four source pages were checked on 28 October 2026 for creator, exact Bwindi location, description and publication details. Unsplash’s current license allows free commercial and non-commercial use without required attribution. The downloaded photos and rendered local files were visually inspected. All portray mountain gorillas at Bwindi; they are illustrative wildlife imagery, not guaranteed sightings or a record of a Trek Africa Guide outing, operator, group or guest. No Rwanda/Volcanoes material is included.

| Local file | Creator | Exact-subject evidence and available date | Source page | License | SHA-256 |
|---|---|---|---|---|---|
| `bwindi-gorilla-nathalie-lays.jpg` | Nathalie Lays | Source identifies Bwindi Impenetrable Forest, Uganda; published 11 Jan 2025. A gorilla rests among dense forest vegetation. | Unsplash photo `Lb65e5jMBMo`, checked 2026-10-28: https://unsplash.com/photos/a-gorilla-standing-in-the-middle-of-a-forest-Lb65e5jMBMo | Unsplash License; no public attribution required | `30170fbf6a92f40c5d6d4f50a7ffbb3049e0fbeec8661acadddd090a97823c6f` |
| `bwindi-mother-juvenile-2h-media.jpg` | 2H Media | Source identifies a mother mountain gorilla and juvenile in Bwindi Impenetrable Forest, Uganda; published 30 Nov 2022. | Unsplash photo `FKcRXTOHG8M`, checked 2026-10-28: https://unsplash.com/photos/a-gorilla-in-the-forest-FKcRXTOHG8M | Unsplash License; no public attribution required | `7d0c5d2b52d790d6c0bb7a00b29d83d3c608dac0f6e0ee51e2936fb6d6111799` |
| `bwindi-gorilla-closeup-gabriel-schumacher.jpg` | Gabriel Schumacher | Source describes an endangered mountain gorilla in Bwindi Impenetrable Forest and locates the photo in Bwindi Impenetrable National Park, Uganda; published 23 Mar 2024. | Unsplash photo `6JKdaD3soBc`, checked 2026-10-28: https://unsplash.com/photos/a-close-up-of-a-gorilla-near-a-tree-6JKdaD3soBc | Unsplash License; no public attribution required | `b454e03e29df7fec376b692337efb63380cee587b48bb20fd2567821124d2813` |
| `bwindi-gorillas-2017-ylenia-vimercati-molano.jpg` | Ylenia Vimercati Molano | Source identifies gorillas in Bwindi Impenetrable Forest, Uganda, and describes them as photographed in 2017; published 4 May 2021. | Unsplash photo `NrrzGBcU6aM`, checked 2026-10-28: https://unsplash.com/photos/black-gorilla-on-green-grass-during-daytime-NrrzGBcU6aM | Unsplash License; no public attribution required | `3be196fd5600ea4d717d6bc5228000c285048e8e15d010dbd4fde0fdf7331295` |

Each source URL, creator, license URL, available date, location evidence, descriptive alt text, restriction/context, CDN transformation, local path and hash are recorded in `src/lib/photo-library.js`. Source IDs are distinct from the prior library entries. SHA-256 comparison across all local public image assets found no duplicate; the four new files also have distinct hashes. Files were fetched from the Unsplash CDN at width up to 1800px, preserving aspect ratio, with no other edits.

## Publication record

Initial collection change adds four images to the two defaults, for six total. No guide text, linked product, credits, layout or tracking behavior was altered. The narrow photo-library sync/build-input check, safe push, production deployment, live gallery/assets, source-free owner email and receipt are recorded below after confirmation.
