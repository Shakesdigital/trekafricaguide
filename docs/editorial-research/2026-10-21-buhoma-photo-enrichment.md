# Buhoma destination photo enrichment — 21 October 2026

Status: three distinct, source-verified photographs added to the published Buhoma destination guide (previous gallery 0; prepared gallery 3). The collection is a useful partial set, not a complete six-photo destination package. No factual prose was changed. Exact-place identity, creator, reuse status, capture date, evidence, local SHA-256, alt text and restrictions are recorded here and in `src/lib/photo-library.js`.

Guide reviewed: [Buhoma: a base for northern Bwindi](https://trekafricaguide.com/countries/uganda/buhoma/), updated from `content/local-destinations.json`. The article frames Buhoma as a northern Bwindi base, with sector-specific gorilla tracking, locally arranged forest walks and hosted experiences, and an onward road transfer from Kihihi or the Queen Elizabeth area. Selected photographs support the park departure / visitor context and a clearly documented Buhoma wildlife example; they do not represent lodging or guarantee a sighting.

## Selected photographs

### `trek-departure-2017.jpg`

- Commons file page: https://commons.wikimedia.org/wiki/File:USAID_Measuring_Impact_Conservation_Enterprise_Retrospective_(Uganda;_International_Gorilla_Conservation_Program)_(25422585587).jpg
- Original source/version: USAID Biodiversity & Forestry Flickr file `25422585587`, transferred to Commons; Commons file history shows transfer on 13 July 2018. File description identifies the location as Buhoma and the capture as 10 September 2017, 08:58.
- Creator: Jason Houston for USAID; source account USAID Biodiversity & Forestry.
- Rights evidence checked 21 October 2026: Commons identifies this as a U.S. federal government work and records a Public Domain Mark review by FlickreviewR on 13 July 2018. License reference: https://creativecommons.org/publicdomain/mark/1.0/ .
- Subject evidence: the original description identifies visitors starting a gorilla-tracking hike in Buhoma. Visually reviewed. Alt: “Visitors setting out for gorilla tracking from Buhoma in September 2017; archival image, not current departure information.”
- Local file SHA-256: `cca8478835712d77bb668e2e3aad71b5741ab5219d328408806fae2e3c148d3b`.
- Restrictions/context: archival documentary image only. It does not identify the current operator, current participants, current schedule or endorsement. Share the underlying Public Domain Mark status; do not infer releases for identifiable visitors.

### `mubare-female-gorilla.jpg`

- Commons file page: https://commons.wikimedia.org/wiki/File:Mountain_gorilla_(Gorilla_beringei_beringei)_female_eating_root.jpg
- Original version: Commons file revision 1237614896; capture date 23 October 2016, 11:37:18.
- Creator: Charles J. Sharp; source is the photographer’s own work, with the linked Sharp Photography source.
- License: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/ . Rights and creator checked 21 October 2026.
- Subject evidence: Commons description names a female mountain gorilla in the Mubare Group, Buhoma sector; coordinates `-0.975000, 29.636000`. Visually reviewed. Alt: “Female mountain gorilla eating a root in the Mubare Group, Buhoma sector; illustrative, not a sighting guarantee.”
- Local file SHA-256: `8fe8489648ecbb246f9cbd8e204bb38f5a035ba00eea1e9eb1b20a654b6600fc`.
- Restrictions/context: retain creator attribution and share-alike terms for the resized copy. A separate 2-year-old Mubare Group image already appears on the Bwindi sector-planning insight; this is a different Commons source, different image and different local hash. The Buhoma gallery makes no sighting promise.

### `park-headquarters-briefing-2017.jpg`

- Commons file page: https://commons.wikimedia.org/wiki/File:USAID_Measuring_Impact_Conservation_Enterprise_Retrospective_(Uganda;_International_Gorilla_Conservation_Program)_(40248679412).jpg
- Original source/version: USAID Biodiversity & Forestry Flickr file `40248679412`, transferred to Commons; Commons file history shows transfer on 13 July 2018. File description identifies Buhoma park headquarters and capture on 10 September 2017, 08:28.
- Creator: Jason Houston for USAID; source account USAID Biodiversity & Forestry.
- Rights evidence checked 21 October 2026: Commons identifies this as a U.S. federal government work and records a Public Domain Mark review by FlickreviewR on 13 July 2018. License reference: https://creativecommons.org/publicdomain/mark/1.0/ .
- Subject evidence: the source description identifies a Bwindi ranger briefing visitors before a gorilla-tracking tour at the park headquarters in Buhoma. Visually reviewed. Alt: “A Bwindi ranger briefs visitors at park headquarters in Buhoma in September 2017; archival image.”
- Local file SHA-256: `26770cad2ff14db6e61855aa7220f955fa260d6bc53a16224def6348f5352dc8`.
- Restrictions/context: archival documentary image, not current staffing or departure information. No endorsement is implied; identifiable visitors are not named or presented as Trek Africa Guide customers.

## Verification and source selection

The three chosen source pages and images were visually inspected. Image SHA-256 values were compared against all local public image assets; source page URLs were searched against the full photo library and page assignments. No match was found. Neither the five existing Buhoma Community Rest Camp photographs nor the Bwindi insight’s Charles J. Sharp gorilla source was reused.

Excluded candidates: the Batwa dance image is an archival 2003 cultural performance frame that could misleadingly imply a current visitor offering; the Buhoma visitor-center image visibly documents a building under construction, not current visitor facilities; a HUGO association image shows identifiable community members in a human-wildlife-conflict context; PLOS figures package several everyday-life images into collages and would require extracting panels. Those subjects are not used in this destination gallery.

Remaining photo gaps: a current, non-property Buhoma village/forest-edge overview; a distinct approach-road or landscape view verified to be in Buhoma; a locally relevant forest-walk or birding setting; and a consent-appropriate contemporary community-hosted setting. Do not fill these gaps with another property, a generic Bwindi landscape labeled as Buhoma, or an archival performance image. No accommodation image is added to this destination page.

## Publication record

Commit `f2ae5be` pushed to the existing Git-triggered Netlify deployment path. The repository build-input syntax, JSON and photo-library mirror check passed; no test suite or full build was run. At 19:54 Africa/Kampala on 21 October 2026, the production Buhoma page returned HTTP 200, displayed “See all 3,” and referenced all three new image paths; each plain JPEG URL returned HTTP 200 `image/jpeg`. Publication report sent to the configured recipient; Gmail receipt ID `1a15f6378371b81c`.
