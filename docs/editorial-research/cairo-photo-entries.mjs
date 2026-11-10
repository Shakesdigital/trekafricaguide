// Append Cairo photo-library entries to src/lib/photo-library.js
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const file = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/src/lib/photo-library.js';
const dir = 'C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/public/images/editorial/cairo-local-destination';
const sha = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const entries = {
  "/images/editorial/cairo-local-destination/late-evening-qasr-al-nil-tower-2012.jpg": {
    slug: "late-evening-qasr-al-nil-tower-2012",
    source_page: "https://commons.wikimedia.org/wiki/File:Late_evening_in_Cairo.jpg",
    creator: "Frank Schulenburg", license: "CC BY-SA 3.0",
    license_url: "https://creativecommons.org/licenses/by-sa/3.0",
    source_published_at: "2012-07-03",
    subject: "Central Cairo at dusk: Qasr al-Nil bridge across the Nile, Gezira island and the Cairo Tower",
    alt: "Evening falls over the Nile in central Cairo: the Qasr al-Nil bridge carries traffic toward Gezira island and the lit Cairo Tower.",
    caption: "Central Cairo at dusk: the Qasr al-Nil bridge and the Cairo Tower. Frank Schulenburg (CC BY-SA 3.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons description: \"Late evening in Cairo: view of the Qasr al-Nil Bridge and the Cairo Tower at sunset\"; author Frank Schulenburg.",
    description_verified: "Visually inspected 2026-11-10 after resize: bridge light trails, tower silhouette, pink dusk sky — matches.",
  },
  "/images/editorial/cairo-local-destination/cairo-tower-daytime-lemay-2019.jpg": {
    slug: "cairo-tower-daytime-lemay-2019",
    source_page: "https://commons.wikimedia.org/wiki/File:Cairo_Tower,_al-Q%C4%81hirah,_CG,_EGY_(40942425723).jpg",
    creator: "Warren LeMay", license: "CC0 1.0",
    license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
    source_published_at: "2019-05-12",
    subject: "The Cairo Tower rising over Gezira island, seen from across the Nile",
    alt: "The Cairo Tower rises above Gezira island's tree line under a hazy daytime sky.",
    caption: "The Cairo Tower over Gezira island. Warren LeMay (CC0 1.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons description: \"Standing tall on the city's skyline, the Cairo Tower...\"; author Warren LeMay.",
    description_verified: "Visually inspected 2026-11-10: lattice tower with lotus form prominent; matches.",
  },
  "/images/editorial/cairo-local-destination/saladin-citadel-lascar-2012.jpg": {
    slug: "saladin-citadel-lascar-2012",
    source_page: "https://commons.wikimedia.org/wiki/File:Cairo_Citadel_(14795773755).jpg",
    creator: "Jorge Láscar", license: "CC BY 2.0",
    license_url: "https://creativecommons.org/licenses/by/2.0/",
    source_published_at: "2012-09-12",
    subject: "The Saladin Citadel's outer walls on the Mokattam hill",
    alt: "The mediaeval Saladin Citadel walls stand above landscaped parkland on the Mokattam hill.",
    caption: "The Saladin Citadel walls on the Mokattam hill. Jorge Láscar (CC BY 2.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons description: \"The Saladin Citadel of Cairo is a medieval Islamic fortification in Cairo, Egypt. The location, on Mokattam hill near the center of Cairo\"; author Jorge Láscar.",
    description_verified: "Visually inspected 2026-11-10 after resize: circular bastions and stone walls, matches.",
  },
  "/images/editorial/cairo-local-destination/muizz-street-market-argenberg-2007.jpg": {
    slug: "muizz-street-market-argenberg-2007",
    source_page: "https://commons.wikimedia.org/wiki/File:Egypt,_Cairo,_Muizz_Market_Street,_Islamic_Cairo.jpg",
    creator: "Vyacheslav Argenberg", license: "CC BY 4.0",
    license_url: "https://creativecommons.org/licenses/by/4.0/",
    source_published_at: "2007-06-15",
    subject: "Muizz Street market, Islamic Cairo",
    alt: "Shoppers and market stalls crowd Muizz Street in Islamic Cairo under bright sun.",
    caption: "Market street in Islamic Cairo near Muizz Street. Vyacheslav Argenberg (CC BY 4.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons description: \"Cairo, Egypt: Cairo locals walk the market street of Islamic Cairo. The area around Muizz Street\"; author Vyacheslav Argenberg.",
    description_verified: "Visually inspected 2026-11-10 after resize: crowded market street with umbrellas and souvenirs, matches.",
  },
  "/images/editorial/cairo-local-destination/talaat-harb-street-argenberg-2007.jpg": {
    slug: "talaat-harb-street-argenberg-2007",
    source_page: "https://commons.wikimedia.org/wiki/File:Cairo,_Talaat_Harb_Street,_Egypt.jpg",
    creator: "Vyacheslav Argenberg", license: "CC BY 4.0",
    license_url: "https://creativecommons.org/licenses/by/4.0/",
    source_published_at: "2007-06-15",
    subject: "Talaat Harb street in downtown Cairo",
    alt: "A wide street with early-20th-century apartment buildings runs through downtown Cairo.",
    caption: "Downtown Cairo on Talaat Harb street. Vyacheslav Argenberg (CC BY 4.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons description: \"This avenue was a center for activity... A remnant of its former 'Paris on the Nile'\"; author Vyacheslav Argenberg.",
    description_verified: "Visually inspected 2026-11-10 after resize: downtown avenue with period buildings and parked cars, matches.",
  },
  "/images/editorial/cairo-local-destination/hanging-church-courtyard-mayer-2008.jpg": {
    slug: "hanging-church-courtyard-mayer-2008",
    source_page: "https://commons.wikimedia.org/wiki/File:Cairo_-_Coptic_area_-_Hanging_Church_from_courtyard.JPG",
    creator: "Daniel Mayer", license: "CC BY-SA 4.0",
    license_url: "https://creativecommons.org/licenses/by-sa/4.0",
    source_published_at: "2008-07",
    subject: "The Hanging Church in Old Cairo seen from its courtyard",
    alt: "The twin bell towers and facade of the Hanging Church rise above its palm-lined courtyard steps.",
    caption: "The Hanging Church from its courtyard, Old Cairo. Daniel Mayer (CC BY-SA 4.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons title and description identify the Hanging Church from the courtyard in Cairo's Coptic area; author Daniel Mayer (cromos).",
    description_verified: "Visually inspected 2026-11-10 after resize: two white towers, courtyard garden and stair, matches.",
  },
  "/images/editorial/cairo-local-destination/egyptian-museum-tahrir-facade-delso-2011.jpg": {
    slug: "egyptian-museum-tahrir-facade-delso-2011",
    source_page: "https://commons.wikimedia.org/wiki/File:Facade_of_the_Egyptian_Museum,_Tahrir_Square,_Cairo,_Egypt1.jpg",
    creator: "Diego Delso", license: "CC BY-SA 3.0",
    license_url: "https://creativecommons.org/licenses/by-sa/3.0",
    source_published_at: "2011-09-25",
    subject: "The Egyptian Museum's salmon-pink facade on Tahrir Square",
    alt: "The salmon-pink facade and main arch of the Egyptian Museum on Tahrir Square.",
    caption: "The Egyptian Museum facade on Tahrir Square. Diego Delso (CC BY-SA 3.0) via Wikimedia Commons",
    exact_subject_evidence: "Commons description: \"Facade of the Egyptian Museum, Tahrir Square, Cairo, Egypt\"; author Diego Delso.",
    description_verified: "Visually inspected 2026-11-10 after resize: pink facade, arched entrance, statues at the door, matches.",
  },
};
let txt = fs.readFileSync(file, 'utf8');
if (txt.includes('cairo-local-destination')) { console.log('already present'); process.exit(0); }
for (const [path, e] of Object.entries(entries)) {
  const buf = fs.readFileSync('C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/public' + path);
  const rec = {
    slug: e.slug, local_path: path, source_page: e.source_page,
    source_revision: "Commons file; checked 2026-11-10",
    creator: e.creator, license: e.license, license_url: e.license_url,
    source_published_at: e.source_published_at,
    sha256: createHash('sha256').update(buf).digest('hex'),
    exact_subject: true, subject: e.subject, alt: e.alt, property: false, kind: "photograph",
    requires_attribution: true,
    attribution_notice: e.creator + " (" + e.license + ") via Wikimedia Commons; the page gallery credits the creator and licence.",
    changes: "Downloaded from the Wikimedia Commons 1920-pixel thumbnail; resized to max 1,800 px wide (JPEG q85); no other edits.",
    checked_at: "2026-11-10",
    exact_subject_evidence: e.exact_subject_evidence + " " + e.description_verified,
    caption: e.caption,
  };
  // insert before final closing of images object
  const idx = txt.indexOf('\n  },\n  "listings"');
  const insert = '\n    "' + path + '": ' + JSON.stringify(rec, null, 6).replace(/\n/g, '\n    ');
  txt = txt.slice(0, idx) + ',' + insert + txt.slice(idx);
}
fs.writeFileSync(file, txt);
console.log('inserted', Object.keys(entries).length, 'entries');
