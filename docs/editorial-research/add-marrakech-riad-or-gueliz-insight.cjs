// Insert the Marrakech riad-vs-Gueliz insight record + six photo-library entries (2026-11-10 run)
import fs from 'node:fs';

const EM = '\u2014';  // em dash
const E = (s) => s; // readability helper

const HERO = 'https://trekafricaguide.com/images/editorial/marrakech-riad-or-gueliz/';
const img = (f) => `${HERO}${f}`;

const cap1 = `Jemaa el-Fna in evening light, 24 January 2025 (CC BY 4.0, Jakub Ha\u0142un via Wikimedia Commons). UNESCO records the square's practices running all through the day and well into the night ${EM} an evening rhythm a Gueliz hotel turns into a plan, but a medina riad turns into a walk.`;
const alt1 = 'Jemaa el-Fna square glows in evening light with market stalls, crowds and rooftop caf\u00e9 tiers.';

const body = [
`<p><em>Research checked 10 November 2026. This is an editorial planning story, not a booking channel: rooms, access conditions and rules change, so confirm every detail with the property and official sources before you pay.</em></p>`,
`<p>Morocco is published on this guide as a five-surface cluster ${EM} the <a href="/countries/morocco">country guide</a>, the <a href="/countries/morocco/marrakech">Marrakech destination page</a>, the <a href="/attractions/marrakech-and-atlas">Marrakech And Atlas attraction guide</a>, two city activities (<a href="/activities/marrakech-medina-street-food-tour">medina street-food tour</a>, <a href="/activities/atlas-mountains-day-trip">Atlas Mountains day trip</a>) and the <a href="/accommodations/riad-rosemary">Rosemary Marrakech riad stay</a> ${EM} while the journal's Northern Africa shelf sat empty: eleven published stories, none from the region. That is the gap this run closes, and the decision the cluster leaves unanswered is the one you book first: whether to sleep inside the medina walls, in a riad built around a patio, or outside them in Gueliz's airy avenues. It is not a question of which is nicer. It is the question of where your Marrakech happens.</p>`,
`<h3>Choose the rhythm before the district</h3>`,
`<p>Morocco's national tourism office frames the whole choice in one paragraph: admire the medina's architecture inside a riad ${EM} "small oriental palaces overlooking a beautiful patio" ${EM} then "you just have to leave the ramparts to be immersed in modern Morocco", where the districts of Gueliz and Hivernage offer "the most modern infrastructures, luxury boutiques and international ready-to-wear stores, airy avenues". Two different cities share one name. The medina's rhythm is UNESCO's square at "the entrance of the Medina", performing "all through the day, and well into the night"; the Gueliz rhythm is shops, pavements and taxis with your own key. If a Jemaa el-Fna evening is why you chose Marrakech, sleeping beyond the walls turns every evening into a scheduled return trip. Neither choice is wrong, but only one of them matches your trip.</p>`,
`<figure><img src="${img('jamaa-el-fna-dusk-2025.jpg')}" alt="${alt1}" loading="lazy"><figcaption>${cap1}</figcaption></figure>`,
`<h3>What a riad actually buys you</h3>`,
`<p>A riad is not a boutique-hotel label. <a href="/attractions/marrakech-and-atlas">Our attraction guide</a> puts it exactly: the "courtyard-centered form shapes the atmosphere of many stays in the older city". The patio is the living room; the walls stand a metre or so from the neighbour's windows; breakfast is served in the courtyard, and the roof terrace is where the medina's noise finally recedes. The published <a href="/accommodations/riad-rosemary">Rosemary Marrakech guide</a> shows what the form means in practice: five individually designed rooms by LRNCE, a courtyard pool, hammam, salon and roof terrace, with private hire of the whole house on the menu ${EM} and, deliberately, spaces shared with other guests unless exclusive use is agreed. The national office allows three days for the city; our attraction guide's structure is two unhurried city days and a separately chosen Atlas day.</p>`,
`<figure><img src="${img('riad-courtyard-pool-2007.jpg')}" alt="A Marrakech riad courtyard at night: a lit plunge pool framed by palms, carved arches and stained-glass windows." loading="lazy"><figcaption>A riad courtyard with plunge pool at night, 2007 (CC BY-SA 3.0, L. Antoine via Wikimedia Commons). The patio is the riad's shared living space, the form the whole type is built around ${EM} and the thing most worth asking about before the booking.</figcaption></figure>`,
`<h3>What the new town answers</h3>`,
`<p>Gueliz is not a compromise against Marrakech; it answers different needs. Wider streets, a vehicle at the actual entrance, pharmacies and restaurants that keep evening hours past the medina's early close ${EM} plus, per the tourism office, the districts' "luxury boutiques and international ready-to-wear stores" along "airy avenues". If your days are planned inside the medina but your evenings run later, or you travel with mobility needs, small children or luggage that fights alley carts, the new town pays you back every day. The honest way to compare is the country guide's own rule: "compare specific inclusions rather than labels such as luxury or authentic" ${EM} and the walk it takes to get anywhere after dark is an inclusion.</p>`,
`<figure><img src="${img('gueliz-avenue-2006.jpg')}" alt="A modern corner building on a wide Gueliz avenue with cars, palm trees and Maghreb flags." loading="lazy"><figcaption>A modern block on a Gueliz avenue, July 2006 (CC BY-SA 2.0, mwanasimba via Wikimedia Commons). Wide streets and vehicle access are the trade the new town makes against the walls you left behind.</figcaption></figure>`,
`<h3>The access test that shapes the arrival day</h3>`,
`<p>The medina asks its own fee, and it collects it on arrival night. Our <a href="/attractions/marrakech-and-atlas">attraction guide</a>: "a vehicle may not reach the door", so agree a recognizable meeting point with the hotel. Marrakech Menara airport to a medina door is one taxi ride, then a cart-and-luggage walk through alleys your driver cannot enter. <a href="/accommodations/riad-rosemary">Rosemary's guide</a> shows how to buy that walk calmly: ask for "the nearest vehicle drop-off and luggage assistance, since the final approach in the medina may differ from a conventional hotel arrival". The country guide extends the rule across the whole route: "confirm the final access to medina accommodation and agree the luggage or pickup arrangement". In Gueliz this paragraph does not exist ${EM} and if your flight lands at 23:40 with tired children, that absence is worth a night's rate.</p>`,
`<figure><img src="${img('koutoubia-rooftops-2016.jpg')}" alt="The Koutoubia minaret rises over orange medina rooftops with palms and satellite dishes." loading="lazy"><figcaption>The Koutoubia minaret over medina rooftops, 13 February 2016 (CC BY-SA 4.0, Schorle via Wikimedia Commons). The rooftop horizon a riad guest wakes to ${EM} and the skyline a Gueliz guest admires from beyond the walls.</figcaption></figure>`,
`<h3>Noise, stairs and shared space</h3>`,
`<p>The attraction guide's comparison rule is the shortest useful sentence in the cluster: "Compare stays by walking access, noise, stairs and room facilities; traditional architecture can mean layouts unlike a modern hotel". Unpack it on both sides. A medina house levels vertically instead of horizontally: rooms reached by flights of steps, terraces above bedrooms, a courtyard that carries sound up instead of along a corridor ${EM} pleasing by day, decision-relevant at 01:00. Room categories differ per house: <a href="/accommodations/riad-rosemary">Rosemary's guide</a> instructs you to "request the named room", because a balcony or pool outlook is a category feature, not a default. The modern-hotel mirror is the inverse: lifts, corridors that dampen sound, standardised layouts ${EM} comfort that earns its rate wherever the medina's texture is not the point.</p>`,
`<p>Shared space has rules of its own. In a five-room riad the courtyard pool, hammam and roof terrace are usually house spaces, not private ones: <a href="/accommodations/riad-rosemary">Rosemary's guide</a> says pool and terrace are "shared house spaces unless exclusive hire is agreed", and asks celebration plans to be discussed in advance to preserve the house's calm. And the courtesy runs outward too: the country guide asks visitors to respect "the photography expectations and the privacy of residents", the same pressure UNESCO's square record names as tourism acculturation ${EM} so hold the camera back and ask before photographing people or private spaces.</p>`,
`<figure><img src="${img('souk-haddadine-lanterns-2024.jpg')}" alt="Brass lanterns of many shapes hang together, lit, in the medina souk." loading="lazy"><figcaption>Hanging lanterns in the Haddadine souk, 23 March 2024 (CC BY-SA 4.0, Petar Milo\u0161evi\u0107 via Wikimedia Commons). Souk commerce sits directly beside medina homes ${EM} the vibrant medina is also a residential one, which is what the photography rule protects.</figcaption></figure>`,
`<figure><img src="${img('bahia-palace-court-2016.jpg')}" alt="The large courtyard of the Bahia Palace: tiled floor, central fountain and painted blue-yellow arcades under palms." loading="lazy"><figcaption>The Bahia Palace large courtyard, 8 December 2016 (CC BY-SA 4.0, Val Traveler via Wikimedia Commons). Grand courtyard architecture is the medina's public version of the private riad patio ${EM} and a short walk from a medina base, half a taxi ride from Gueliz.</figcaption></figure>`,
`<h3>The checklist before you pay</h3>`,
`<ul>
<li>Where your evenings happen: the square's night rhythm inside the walls, or the modern districts' late hours and calm streets outside.</li>
<li>The arrival plan in writing: nearest vehicle drop-off, luggage assistance, meeting point ${EM} "a vehicle may not reach the door".</li>
<li>The named room: "request the named room"; a balcony, suite or pool outlook is a category feature confirmed before payment, not a hope.</li>
<li>Shared space rules: courtyard pool, hammam and roof terrace ${EM} who else uses them, when, and whether exclusive hire exists.</li>
<li>Stairs and mobility: traditional layouts often mean steps where a hotel has a lift ${EM} ask before booking if this matters.</li>
<li>Season honesty: March to May and September to November are the office's comfortable months; summer is very hot and winter evenings cool ${EM} whichever side of the ramparts you choose.</li>
</ul>`,
`<p>Where this leaves you: book the walls when the reason to return nightly is the point, book the avenues when daily access outranks the charm, and treat the pair as what they are ${EM} one city with two nervous systems. The cluster behind every claim here is the trip's map: the <a href="/countries/morocco/marrakech">Marrakech destination page</a> for the days, the <a href="/accommodations/riad-rosemary">Rosemary riad guide</a> for the walls, and the <a href="/attractions/marrakech-and-atlas">Marrakech And Atlas guide</a> for the excursions from either side of the ramparts.</p>`,
`<p>Field context lives in the published pages this story is built on: the <a href="/countries/morocco">Morocco country guide</a>, the <a href="/countries/morocco/marrakech">Marrakech destination page</a>, the <a href="/attractions/marrakech-and-atlas">Marrakech And Atlas guide</a>, the <a href="/activities/marrakech-medina-street-food-tour">street-food walk</a>, the <a href="/activities/atlas-mountains-day-trip">Atlas day trip</a> and the <a href="/accommodations/riad-rosemary">Rosemary Marrakech stay</a>.</p>`,
].join('\n');

const record = {
  slug: 'where-to-sleep-in-marrakech-riad-or-gueliz',
  title: 'Where to sleep in Marrakech: a medina riad or a Gueliz hotel',
  category: 'City planning',
  region: 'Northern Africa',
  country: 'Morocco',
  excerpt: 'Choose the side of the ramparts before the hotel: the medina riad that keeps its courtyard nights, the Gueliz base that answers late evenings and access ${EM} from the arrival test to the noise-and-stairs reality.',
};

// fix excerpt EM placeholder properly
record.excerpt = 'Choose the side of the ramparts before the hotel: the medina riad that keeps its courtyard nights, the Gueliz base that answers late evenings and access \u2014 from the arrival test to the noise-and-stairs reality.';

Object.assign(record, {
  read_time: '7 min read',
  hero_image_url: img('jamaa-el-fna-dusk-2025.jpg'),
  hero_image_alt: alt1,
  source_url: 'https://www.visitmorocco.com/en/travel/marrakesh',
  research_sources: [
    {
      label: "ONMT visitmorocco.com Marrakech page (checked 10 November 2026) \u2014 riads described as \"small oriental palaces overlooking a beautiful patio\"; \"you just have to leave the ramparts to be immersed in modern Morocco\"; Gueliz/Hivernage districts with \"the most modern infrastructures, luxury boutiques and international ready-to-wear stores, airy avenues\"; three-day allowance; March\u2013May / September\u2013November comfort window",
      url: 'https://www.visitmorocco.com/en/travel/marrakesh',
      checked_at: '2026-11-10',
    },
    {
      label: "UNESCO Intangible Cultural Heritage record 00014, Cultural space of Jemaa el-Fna Square (checked 10 November 2026) \u2014 square at the entrance of the Medina, performances all through the day and well into the night, protected as Morocco's artistic heritage since 1922, proclaimed 2001 and inscribed on the Representative List in 2008, urbanization and widespread tourism named as acculturation threats",
      url: 'https://ich.unesco.org/en/RL/cultural-space-of-jemaa-el-fna-square-00014?RL=00014',
      checked_at: '2026-11-10',
    },
    {
      label: "Trek Africa Guide internal pages (live 10 November 2026, verbatim quotes carried with backlinks) \u2014 /accommodations/riad-rosemary (five-room adults-only LRNCE riad near Rue de la Bahia; request the named room; nearest vehicle drop-off and luggage assistance; pool/hammam/salon/roof terrace shared unless exclusive hire; verified booking link for the listing not yet available), /attractions/marrakech-and-atlas (courtyard-centered riad form; a vehicle may not reach the door \u2014 agree a recognizable meeting point; compare stays by walking access, noise, stairs and room facilities; two unhurried city days + separately chosen Atlas day), /countries/morocco (location and access matter as much as design; compare specific inclusions rather than labels; privacy of residents), /countries/morocco/marrakech (official three-day frame, FCDO entry formalities: 90 tourist days, passport valid 3 months, entry stamp, closed dirham), /activities/marrakech-medina-street-food-tour (arrive hungry; dietary needs flagged)",
      url: 'https://trekafricaguide.com/accommodations/riad-rosemary/',
      checked_at: '2026-11-10',
    },
    {
      label: 'Wikimedia Commons file pages for all six photographs (checked 10 November 2026) \u2014 creators, capture dates and CC BY / CC BY-SA status recorded in the photo-library entries and figure captions',
      url: 'https://commons.wikimedia.org/wiki/File:Jamaa_El_Fna,_Marrakesh,_Morocco,_20250124_1804_7017.jpg',
      checked_at: '2026-11-10',
    },
  ],
  last_researched: '2026-11-10',
  status: 'published',
  published_at: new Date().toISOString(),
  sort_order: null,
  featured: false,
  meta_title: 'Where to sleep in Marrakech: a medina riad or a Gueliz hotel',
  meta_description: 'Decide the side of the ramparts before the booking: courtyard nights vs airy avenues, the medina arrival test, noise and stairs, and the checklist that settles the riad-or-Gueliz question.',
  body,
});

const photos = [
  {
    key: '/images/editorial/marrakech-riad-or-gueliz/jamaa-el-fna-dusk-2025.jpg',
    entry: {
      slug: 'jamaa-el-fna-dusk-2025-jakub-halun',
      local_path: '/images/editorial/marrakech-riad-or-gueliz/jamaa-el-fna-dusk-2025.jpg',
      source_page: 'https://commons.wikimedia.org/wiki/File:Jamaa_El_Fna,_Marrakesh,_Morocco,_20250124_1804_7017.jpg',
      source_revision: 'Wikimedia Commons file File:Jamaa_El_Fna,_Marrakesh,_Morocco,_20250124_1804_7017.jpg, checked 2026-11-10',
      creator: 'Jakub Ha\u0142un',
      license: 'CC BY 4.0',
      license_url: 'https://creativecommons.org/licenses/by/4.0',
      source_published_at: null,
      captured_at: '2025-01-24',
      sha256: '9f9921f2de96bc2fb91e49a6d5a8efd378d3e132c82cf3adede6d5e81428c69a',
      exact_subject: true,
      subject: 'Jemaa el-Fnaa square in Marrakesh in evening light',
      alt: alt1,
      caption: cap1,
      property: false,
      kind: 'photograph',
      requires_attribution: true,
      changes: 'Downloaded from the Wikimedia Commons thumb CDN at 1,920 pixels wide, aspect ratio preserved; no other edits.',
      checked_at: '2026-11-10',
      exact_subject_evidence: 'Commons description "Jemaa el-Fnaa square in Marrakesh, Morocco"; DateTimeOriginal 2025-01-24; cc-by-4.0.',
      reuse_note: 'Attribution required: credit Jakub Ha\u0142un, CC BY 4.0, source file page. Attribution appears on-page in the figure caption.',
    },
  },
  {
    key: '/images/editorial/marrakech-riad-or-gueliz/riad-courtyard-pool-2007.jpg',
    entry: {
      slug: 'riad-courtyard-pool-2007-l-antoine',
      local_path: '/images/editorial/marrakech-riad-or-gueliz/riad-courtyard-pool-2007.jpg',
      source_page: 'https://commons.wikimedia.org/wiki/File:Riad_monceau.jpg',
      source_revision: 'Wikimedia Commons file File:Riad_monceau.jpg, checked 2026-11-10',
      creator: 'L. Antoine',
      license: 'CC BY-SA 3.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
      source_published_at: null,
      captured_at: '2007',
      sha256: 'e0c591af64b6aef7a6be2978d1616e7061451bfd88bd8c84608be7e193b1185e',
      exact_subject: true,
      subject: 'A Marrakech riad courtyard with garden and pool at night (medina riad typology illustration)',
      alt: 'A Marrakech riad courtyard at night: a lit plunge pool framed by palms, carved arches and stained-glass windows.',
      caption: "A riad courtyard with plunge pool at night, 2007 (CC BY-SA 3.0, L. Antoine via Wikimedia Commons). The patio is the riad's shared living space, the form the whole type is built around \u2014 and the thing most worth asking about before the booking.",
      property: false,
      kind: 'photograph',
      requires_attribution: true,
      changes: 'Downloaded from the Wikimedia Commons original, aspect ratio preserved; no other edits.',
      checked_at: '2026-11-10',
      exact_subject_evidence: 'Commons description "A Riad or Moroccan courtyard, with garden and pool. Located in Marrakech."; date 2007; cc-by-sa-3.0.',
      reuse_note: 'Attribution required: credit L. Antoine, CC BY-SA 3.0, source file page; share-alike terms continue to apply. Attribution appears on-page in the figure caption. Illustrates the medina riad typology; no specific property named in this story.',
    },
  },
  {
    key: '/images/editorial/marrakech-riad-or-gueliz/souk-haddadine-lanterns-2024.jpg',
    entry: {
      slug: 'souk-haddadine-lanterns-2024-petar-milosevic',
      local_path: '/images/editorial/marrakech-riad-or-gueliz/souk-haddadine-lanterns-2024.jpg',
      source_page: 'https://commons.wikimedia.org/wiki/File:Oriental_hanging_lanterns._Souk_Haddadine,_Marrakech_Medina,_Morocco.jpg',
      source_revision: 'Wikimedia Commons file File:Oriental_hanging_lanterns._Souk_Haddadine,_Marrakech_Medina,_Morocco.jpg, checked 2026-11-10',
      creator: 'Petar Milo\u0161evi\u0107',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
      source_published_at: null,
      captured_at: '2024-03-23',
      sha256: '829072fcba287362044f8c4aa485d03b2ae735947e8f6ad7e5a9129e803d1b7b',
      exact_subject: true,
      subject: 'Oriental hanging lanterns in the Souk Haddadine, Marrakech Medina',
      alt: 'Brass lanterns of many shapes hang together, lit, in the medina souk.',
      caption: 'Hanging lanterns in the Haddadine souk, 23 March 2024 (CC BY-SA 4.0, Petar Milo\u0161evi\u0107 via Wikimedia Commons). Souk commerce sits directly beside medina homes \u2014 the vibrant medina is also a residential one, which is what the photography rule protects.',
      property: false,
      kind: 'photograph',
      requires_attribution: true,
      changes: 'Downloaded from the Wikimedia Commons thumb CDN at 1,920 pixels wide, aspect ratio preserved; no other edits.',
      checked_at: '2026-11-10',
      exact_subject_evidence: 'Commons description "Oriental hanging lanterns. Souk Haddadine, Marrakech Medina, Morocco"; DateTimeOriginal 2024-03-23; cc-by-sa-4.0.',
      reuse_note: 'Attribution required: credit Petar Milo\u0161evi\u0107, CC BY-SA 4.0, source file page; share-alike terms continue to apply. Attribution appears on-page in the figure caption.',
    },
  },
  {
    key: '/images/editorial/marrakech-riad-or-gueliz/bahia-palace-court-2016.jpg',
    entry: {
      slug: 'bahia-palace-court-2016-val-traveler',
      local_path: '/images/editorial/marrakech-riad-or-gueliz/bahia-palace-court-2016.jpg',
      source_page: 'https://commons.wikimedia.org/wiki/File:Bahia_Palace_large_court.jpg',
      source_revision: 'Wikimedia Commons file File:Bahia_Palace_large_court.jpg, checked 2026-11-10',
      creator: 'Val Traveler',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
      source_published_at: null,
      captured_at: '2016-12-08',
      sha256: '597bafbb9f2a014c19207088365b829b4980aca9c25bbd19e9ef90e4250a78a6',
      exact_subject: true,
      subject: 'The large courtyard of the Bahia Palace, Marrakech',
      alt: 'The large courtyard of the Bahia Palace: tiled floor, central fountain and painted blue-yellow arcades under palms.',
      caption: "The Bahia Palace large courtyard, 8 December 2016 (CC BY-SA 4.0, Val Traveler via Wikimedia Commons). Grand courtyard architecture is the medina's public version of the private riad patio \u2014 and a short walk from a medina base, half a taxi ride from Gueliz.",
      property: false,
      kind: 'photograph',
      requires_attribution: true,
      changes: 'Downloaded from the Wikimedia Commons thumb CDN at 1,920 pixels wide, aspect ratio preserved; no other edits.',
      checked_at: '2026-11-10',
      exact_subject_evidence: 'Commons description "Marrakesh, Morocco - December 8, 2016: Inside the beautiful Bahia palace with the fountain in Marrakesh, Morocco, Africa."; DateTimeOriginal 2016-12-08; cc-by-sa-4.0.',
      reuse_note: 'Attribution required: credit Val Traveler, CC BY-SA 4.0, source file page; share-alike terms continue to apply. Attribution appears on-page in the figure caption.',
    },
  },
  {
    key: '/images/editorial/marrakech-riad-or-gueliz/koutoubia-rooftops-2016.jpg',
    entry: {
      slug: 'koutoubia-rooftops-2016-schorle',
      local_path: '/images/editorial/marrakech-riad-or-gueliz/koutoubia-rooftops-2016.jpg',
      source_page: 'https://commons.wikimedia.org/wiki/File:Koutoubia_minaret_from_the_city.JPG',
      source_revision: 'Wikimedia Commons file File:Koutoubia_minaret_from_the_city.JPG, checked 2026-11-10',
      creator: 'Schorle',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
      source_published_at: null,
      captured_at: '2016-02-13',
      sha256: '1a52d81895d679fd236dca9f95f234a1ba92a51dd85f86cb34e1b91757b19492',
      exact_subject: true,
      subject: 'The Koutoubia minaret seen over Marrakech medina rooftops',
      alt: 'The Koutoubia minaret rises over orange medina rooftops with palms and satellite dishes.',
      caption: 'The Koutoubia minaret over medina rooftops, 13 February 2016 (CC BY-SA 4.0, Schorle via Wikimedia Commons). The rooftop horizon a riad guest wakes to \u2014 and the skyline a Gueliz guest admires from beyond the walls.',
      property: false,
      kind: 'photograph',
      requires_attribution: true,
      changes: 'Downloaded from the Wikimedia Commons thumb CDN at 1,920 pixels wide, aspect ratio preserved; no other edits.',
      checked_at: '2026-11-10',
      exact_subject_evidence: 'Commons description "The minaret of the Koutoubia Mosque - view over the rooftops of the city of Marrakech."; DateTimeOriginal 2016-02-13; cc-by-sa-4.0.',
      reuse_note: 'Attribution required: credit Schorle, CC BY-SA 4.0, source file page; share-alike terms continue to apply. Attribution appears on-page in the figure caption.',
    },
  },
  {
    key: '/images/editorial/marrakech-riad-or-gueliz/gueliz-avenue-2006.jpg',
    entry: {
      slug: 'gueliz-avenue-2006-mwanasimba',
      local_path: '/images/editorial/marrakech-riad-or-gueliz/gueliz-avenue-2006.jpg',
      source_page: 'https://commons.wikimedia.org/wiki/File:Gueliz_Marrakech_(2845727772).jpg',
      source_revision: 'Wikimedia Commons file File:Gueliz_Marrakech_(2845727772).jpg, checked 2026-11-10',
      creator: 'mwanasimba (La R\u00e9union)',
      license: 'CC BY-SA 2.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/2.0',
      source_published_at: null,
      captured_at: '2006-07-31',
      sha256: '0a834e8ba71adbbcadaa551ea6f93fe34e49a7a5caaabe54f4fab063268a5225',
      exact_subject: true,
      subject: 'A modern avenue with a corner building in the Gueliz district of Marrakech',
      alt: 'A modern corner building on a wide Gueliz avenue with cars, palm trees and Maghreb flags.',
      caption: 'A modern block on a Gueliz avenue, July 2006 (CC BY-SA 2.0, mwanasimba via Wikimedia Commons). Wide streets and vehicle access are the trade the new town makes against the walls you left behind.',
      property: false,
      kind: 'photograph',
      requires_attribution: true,
      changes: 'Downloaded from the Wikimedia Commons original, aspect ratio preserved; no other edits.',
      checked_at: '2026-11-10',
      exact_subject_evidence: 'Commons description "Gueliz Marrakech"; DateTimeOriginal 2006-07-31; cc-by-sa-2.0.',
      reuse_note: 'Attribution required: credit mwanasimba, CC BY-SA 2.0, source file page; share-alike terms continue to apply. Attribution appears on-page in the figure caption. Avenue scene; no business named in this story.',
    },
  },
];

// --- travel_articles record ---
{
  const p = 'content/editorial-overrides.json';
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (data.travel_articles.some((t) => t.slug === record.slug)) {
    console.log('travel_articles record already exists; skipping');
  } else {
    const orders = data.travel_articles.map((t) => t.sort_order || 0);
    record.sort_order = Math.max(0, ...orders) + 1;
    data.travel_articles.push(record);
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
    console.log('travel_articles record added, sort_order', record.sort_order);
  }
}

// --- photo-library entries (both copies), inserted at top of the images object ---
for (const p of ['src/lib/photo-library.js', 'public/photo-library.js']) {
  let changed = 0;
  for (const { key, entry } of photos) {
    const source = fs.readFileSync(p, 'utf8');
    if (source.includes(`"${key}"`)) { continue; }
    const idx = source.indexOf('= {');
    if (idx === -1) { console.log(p, 'NO INSERT POINT'); break; }
    const insertAt = idx + 3;
    const block = `\n    ${JSON.stringify(key)}: ${JSON.stringify(entry, null, 2)},`;
    fs.writeFileSync(p, source.slice(0, insertAt) + block + source.slice(insertAt));
    changed++;
  }
  console.log(p, 'entries added:', changed);
}
console.log('done');
