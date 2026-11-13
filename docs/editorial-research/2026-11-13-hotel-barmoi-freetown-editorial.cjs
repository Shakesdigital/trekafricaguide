// 2026-11-13 accommodations rotation: Hotel Barmoi, Freetown (Sierra Leone).
// Adds the accommodation record, the verified Booking.com booking destination,
// six Wikimedia Commons contextual images to the curated photo library, and
// fixes the stale "no verified nearby property" copy on the Jozani Forest
// attraction (its nearby-stays rail has rendered Zanzibar White Sand since
// 9bed0ff, so that sentence contradicted the card below it).
const fs = require('fs');

const OVERRIDES = 'content/editorial-overrides.json';
const BOOKING = 'content/booking-destinations.json';
const PHOTO_LIB = 'src/lib/photo-library.js';

const today = '2026-11-13';

const gallery = [
  '/images/editorial/hotel-barmoi-freetown/lumley-beach-kefel.jpg',
  '/images/editorial/hotel-barmoi-freetown/aberdeen-freetown-mroue.jpg',
  '/images/editorial/hotel-barmoi-freetown/lumley-shore-mroue.jpg',
  '/images/editorial/hotel-barmoi-freetown/cotton-tree-freetown-trede.jpg',
  '/images/editorial/hotel-barmoi-freetown/freetown-aerial-hond.jpg',
  '/images/editorial/hotel-barmoi-freetown/central-freetown-night-bangura.jpg',
];

const barmoiRecord = {
  region_id: 15,
  country_id: 51,
  attraction_id: 68,
  slug: 'hotel-barmoi-freetown',
  name: 'Hotel Barmoi, Freetown',
  property_type: 'Oceanfront city hotel',
  location_name: 'Cape Road, Aberdeen, Freetown, Sierra Leone',
  listing_summary: 'Oceanfront rooms and suites on Cape Road, Aberdeen, about 400 m from Lumley Beach.',
  detail_intro:
    "Hotel Barmoi sits on the oceanfront at 75C Cape Road in Aberdeen, on the Freetown Peninsula side of Sierra Leone's capital. The property's own site describes a sea-facing hotel with standard rooms and suites, a restaurant, a swimming pool, a gym and event spaces, and the site's gallery centres on ocean-view rooms and a pool terrace above the Atlantic. For a trip that continues to the peninsula beaches, it works as a city-side base: arrival night, meetings or a last evening before the drive to Tokeh and River Number Two.\n\n" +
    'The exact Booking.com detail page for this property (browser-verified 13 November 2026) confirms the address, an outdoor swimming pool, sea views from each accommodation, terraces, free private parking and a continental breakfast, and distances Lumley (Lumbley) Beach at about 400 m and Lungi International Airport at about 35 km. Its review section then showed a score of 8.4 "Very good" from 118 reviews, with staff (9.2) the strongest category. Room categories listed that day were Standard Double (25 m2), Superior Double (30 m2, high floor with balcony), Superior Suite (45 m2) and Penthouse Suite (60 m2). This guide does not copy live rates or availability; check the provider for your dates.',
  practical_info:
    "Arrival planning: Lungi International Airport sits across the harbour from Freetown, about 35 km away by the usual road routing, so agree the full transfer chain (airport, ferry or hopper connection, hotel) with the provider before landing and confirm what the hotel's own shuttle does and does not cover. The hotel's site lists a free shuttle service among its amenities; verify its scope in writing. Check-in opens at 15:00 and check-out is 12:00 per the Booking.com policies section, and the property asks guests to share an expected arrival time in advance.\n\n" +
    "Room choice matters more than category marketing: Booking.com rooms carry sea views, and the Superior and Penthouse categories add balconies and pool views, but an ocean outlook from the public areas is not the same as one from your room, so confirm the specific room. Booking.com's policies section lists cash among accepted payment methods and no pets; confirm card acceptance directly with the hotel before relying on it. The restaurant serves African and international dishes with vegetarian and vegan options, and breakfast is continental; ask about meal charges for non-inclusive rates.\n\n" +
    "Facilities per the two verified sources: outdoor swimming pool, gym/fitness centre, restaurant, free Wi-Fi (rated 9.0 by guests on Booking.com), free private parking, 24-hour front desk, daily housekeeping, room service and sun loungers or beach chairs. The hotel is in a quiet street off Aberdeen beach road; Lumley Beach's bars and restaurants are about a 10-minute walk, per guest reports on the same page. For the peninsula beaches, Tokeh and River Number Two are a separate drive south, so plan them as their own day rather than assuming a casual hop. Cancellation and prepayment terms vary by room and rate; read them before paying. No rating has been assigned to this guide by this site.",
  amenities: [
    'Oceanfront position on Cape Road, Aberdeen, about 400 m from Lumley Beach (Booking.com, checked 13 November 2026)',
    'Outdoor swimming pool with pool-view rooms and a pool terrace',
    'Sea views from every accommodation; Superior and Penthouse rooms add balconies',
    'Restaurant serving African and international cuisine with vegetarian and vegan options; continental breakfast',
    'Gym/fitness centre, free private parking, 24-hour front desk',
    'Free Wi-Fi rated 9.0 by guests on the Booking.com page (checked 13 November 2026)',
  ],
  rating: null,
  review_count: 0,
  price_label: 'Mid-range (rates published by the property and Booking.com; no rate copied into this guide)',
  booking_url: 'https://www.booking.com/hotel/sl/barmoi.en-gb.html',
  source_url: 'https://hotelbarmoi.com/',
  research_sources: [
    { label: 'Hotel Barmoi — official site', url: 'https://hotelbarmoi.com/' },
    { label: 'Booking.com — exact Hotel Barmoi detail page (browser-verified 13 November 2026)', url: 'https://www.booking.com/hotel/sl/barmoi.en-gb.html' },
    { label: 'Booking.com — Freetown city listing page (13 November 2026)', url: 'https://www.booking.com/city/sl/freetown.html' },
  ],
  traveler_feedback:
    'Booking.com showed a guest score of 8.4 "Very good" from 118 reviews when checked 13 November 2026, with sub-scores Staff 9.2, Free WiFi 9.0, Comfort 8.8, Cleanliness 8.6, Location 8.5, Facilities 8.2. Individual review excerpts on the same page praised the staff, breakfast, quiet location and ocean position. These are provider-collected opinions at one moment in time, not a survey by this site, and scores change; no rating is assigned here.',
  last_researched: today,
  status: 'published',
  published_at: '2026-11-13T12:00:00Z',
  hero_image_url: gallery[0],
  hero_image_alt: 'Lumley Beach in Freetown, Sierra Leone, near the Aberdeen oceanfront where Hotel Barmoi stands',
  gallery,
};

// --- 1. editorial-overrides.json ---
const overrides = JSON.parse(fs.readFileSync(OVERRIDES, 'utf8'));
const dupe = overrides.accommodations.find((a) => a.slug === barmoiRecord.slug);
if (dupe) throw new Error('hotel-barmoi-freetown already exists in editorial-overrides.json');
overrides.accommodations.push(barmoiRecord);

// Jozani attraction stale-copy fix (attractions array entry index for slug jozani-forest).
const jozani = overrides.attractions.find((a) => a.slug === 'jozani-forest');
const stale =
  "No verified nearby property has yet been added to this attraction's stay list. Use the Unguja destination guide to compare a Stone Town or coastal base and confirm the transfer with that property; a town hotel is not being represented as accommodation beside Jozani. There is also no verified exact OTA booking option attached to this guide yet.";
if (!jozani || !jozani.practical_info.includes(stale)) throw new Error('Jozani stale sentence not found');
jozani.practical_info = jozani.practical_info.replace(
  stale,
  "Zanzibar White Sand Luxury Villas & Spa at Paje Beach is listed as a nearby stay for this guide; it is a coastal base on Unguja's south-east coast, not accommodation inside the forest, so confirm the transfer from the park with the property. A Stone Town or other coastal base remains an alternative, and no exact OTA booking option is verified for the forest visit itself.",
);
fs.writeFileSync(OVERRIDES, JSON.stringify(overrides, null, 1) + '\n');
console.log('editorial-overrides.json updated:', overrides.accommodations.length, 'accommodations');

// --- 2. booking-destinations.json ---
const booking = JSON.parse(fs.readFileSync(BOOKING, 'utf8'));
if (booking.accommodations['hotel-barmoi-freetown']) throw new Error('booking destination already exists');
booking.accommodations['hotel-barmoi-freetown'] = {
  url: 'https://www.booking.com/hotel/sl/barmoi.en-gb.html',
  provider: 'booking',
  title: 'Hotel Barmoi, Freetown',
  checked_at: today,
  evidence: {
    source_url: 'https://www.booking.com/hotel/sl/barmoi.en-gb.html',
    summary:
      'Browser-verified 13 November 2026: the Booking.com Freetown city page lists Hotel Barmoi with its exact detail URL /hotel/sl/barmoi.html; opening the detail URL renders the full property page (75C Cape Road, Aberdeen, Freetown; 8.4 Very good from 118 reviews; room types, facilities and policies). A Stay22-wrapped test of this URL with the site campaign parameters opens the same exact property detail page, not a searchresults page.',
  },
  notes:
    'Exact OTA product verified in browser (see evidence). No current price, availability or affiliate attribution claim is made; review score quoted on-page with a checked date.',
};
fs.writeFileSync(BOOKING, JSON.stringify(booking, null, 1) + '\n');
console.log('booking-destinations.json updated');

// --- 3. photo library (curated source; public copy regenerated by sync script) ---
const images = [
  {
    file: 'lumley-beach-kefel.jpg',
    slug: 'lumley-beach-kefel-2005',
    source_page: 'https://commons.wikimedia.org/wiki/File:Lumley_Beach_Freetown.JPG',
    source_revision: 'Wikimedia Commons file File:Lumley_Beach_Freetown.JPG, checked 2026-11-13',
    creator: 'Hussein Kefel',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2005-12-26',
    sha256: '1c49eae9718472a2791d72acd51a9a617966c482b3b5e5fc09ce4e6d36cba77d',
    subject: 'Lumley Beach shoreline, Freetown, Sierra Leone',
    alt: 'Lumley Beach in Freetown, Sierra Leone, with the Atlantic shoreline near the Aberdeen oceanfront where Hotel Barmoi stands.',
    caption: 'Lumley Beach, Freetown (Hussein Kefel, CC BY-SA 3.0 via Wikimedia Commons). Contextual image of the beach about 400 m from Hotel Barmoi; not the property.',
    checked_at: today,
    exact_subject_evidence: 'Commons description "Lumley Beach of Freetown in Sierra Leone"; DateTimeOriginal 26 December 2005; cc-by-sa-3.0.',
  },
  {
    file: 'aberdeen-freetown-mroue.jpg',
    slug: 'aberdeen-freetown-mroue-2011',
    source_page: 'https://commons.wikimedia.org/wiki/File:Aberdeen,_Freetown,_Sierra_Leone_-_panoramio_-_Ghassan_Mroue.jpg',
    source_revision: 'Wikimedia Commons file File:Aberdeen,_Freetown,_Sierra_Leone_-_panoramio_-_Ghassan_Mroue.jpg, checked 2026-11-13',
    creator: 'Ghassan Mroue',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2011-07-20',
    sha256: '06dc43ae54b08971f94fc9eb3be12a162a8e16fdbcd47981169a0a7c34352ef7',
    subject: 'Aberdeen district waterfront, Freetown, Sierra Leone',
    alt: 'The Aberdeen district waterfront in Freetown, Sierra Leone, near Cape Road where Hotel Barmoi is located.',
    caption: 'Aberdeen, Freetown (Ghassan Mroue, CC BY-SA 3.0 via Wikimedia Commons). Contextual image of the district where the hotel stands; not the property.',
    checked_at: today,
    exact_subject_evidence: 'Commons description "Aberdeen, Freetown, Sierra Leone"; GPS 8.493256,-13.278319; Taken on 20 July 2011; cc-by-sa-3.0.',
  },
  {
    file: 'lumley-shore-mroue.jpg',
    slug: 'lumley-shore-mroue-2009',
    source_page: 'https://commons.wikimedia.org/wiki/File:Lumley_Shore_-_panoramio.jpg',
    source_revision: 'Wikimedia Commons file File:Lumley_Shore_-_panoramio.jpg, checked 2026-11-13',
    creator: 'Ghassan Mroue',
    license: 'CC BY-SA 3.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    captured_at: '2009-11-16',
    sha256: '90042ec1338d3d56b8597fbcd2abfae5a94eb4a12cb6c5e612cde27ad4f20cf0',
    subject: 'Lumley shore on the Freetown Peninsula Atlantic coast',
    alt: 'The Atlantic shore at Lumley, Freetown, Sierra Leone, a short walk from the Aberdeen oceanfront.',
    caption: 'Lumley shore, Freetown (Ghassan Mroue, CC BY-SA 3.0 via Wikimedia Commons). Contextual shoreline image; not the property.',
    checked_at: today,
    exact_subject_evidence: 'Commons description "lumley Shore"; GPS 8.476787,-13.284874 (Lumley/Aberdeen area); Taken on 16 November 2009; cc-by-sa-3.0.',
  },
  {
    file: 'cotton-tree-freetown-trede.jpg',
    slug: 'cotton-tree-freetown-trede-2007',
    source_page: 'https://commons.wikimedia.org/wiki/File:Cotton_Tree_(Sierra_Leone).jpg',
    source_revision: 'Wikimedia Commons file File:Cotton_Tree_(Sierra_Leone).jpg, checked 2026-11-13',
    creator: 'Christian Trede',
    license: 'CC BY-SA 2.0 DE',
    license_url: 'https://creativecommons.org/licenses/by-sa/2.0/de/deed.en',
    captured_at: '2007-04',
    sha256: '27a7d7527b3142a2e7eb3e59973e7b7c322e0dcabe01476474d126b3759fd2b8',
    subject: 'The Cotton Tree landmark in central Freetown, Sierra Leone',
    alt: 'The historic Cotton Tree standing in central Freetown, Sierra Leone, the city landmark most visitors see on a Freetown stay.',
    caption: 'The Cotton Tree, central Freetown (Christian Trede, CC BY-SA 2.0 DE via Wikimedia Commons). City-context image for a Freetown hotel guide; not the property.',
    checked_at: today,
    exact_subject_evidence: 'Commons description "Cotton Tree, das Wahrzeichen von Freetown, Sierra Leone"; DateTimeOriginal April 2007; cc-by-sa-2.0-de.',
  },
  {
    file: 'freetown-aerial-hond.jpg',
    slug: 'freetown-aerial-hond-2004',
    source_page: 'https://commons.wikimedia.org/wiki/File:Freetown-aerialview.jpg',
    source_revision: 'Wikimedia Commons file File:Freetown-aerialview.jpg, checked 2026-11-13',
    creator: 'David Hond',
    license: 'CC BY 2.0',
    license_url: 'https://creativecommons.org/licenses/by/2.0',
    captured_at: '2004-10-04',
    sha256: '13ae49aacec724d89fd20b09519e47cb208a2712ad4a8d7a457c755e87aa8112',
    subject: 'Aerial view over Freetown harbour, Sierra Leone',
    alt: 'Aerial view over Freetown and its harbour, Sierra Leone, the arrival city for a stay at Hotel Barmoi in Aberdeen.',
    caption: 'Freetown from the air (David Hond, CC BY 2.0 via Wikimedia Commons). Arrival-city context image; not the property.',
    checked_at: today,
    exact_subject_evidence: 'Commons description "Aerial view of Freetown, Sierra Leone, a helicopter expedition to Lungii airport, over the Freetown Harbour"; GPS 8.498391,-13.260841; DateTimeOriginal 2004-10-04; cc-by-2.0.',
  },
  {
    file: 'central-freetown-night-bangura.jpg',
    slug: 'central-freetown-night-bangura-2014',
    source_page: 'https://commons.wikimedia.org/wiki/File:Central_Freetown_at_night,_Sierra_Leone._January1_2014_(3).jpg',
    source_revision: 'Wikimedia Commons file File:Central_Freetown_at_night,_Sierra_Leone._January1_2014_(3).jpg, checked 2026-11-13',
    creator: 'Patrick S. Bangura',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    captured_at: '2014-01-01',
    sha256: 'a59f899de6543f359005bb464fc1aaecd7e2f15d7388df36a1d706553c1c2e81',
    subject: 'Central Freetown at night, Sierra Leone',
    alt: 'Central Freetown in the evening, Sierra Leone, city context for the last night of a Sierra Leone trip.',
    caption: 'Central Freetown at night, 1 January 2014 (Patrick S. Bangura, CC BY-SA 4.0 via Wikimedia Commons). City-context image; not the property.',
    checked_at: today,
    exact_subject_evidence: 'Commons description "A view of Central Freetown at night"; title dates it January 2014; cc-by-sa-4.0.',
  },
];

const lib = fs.readFileSync(PHOTO_LIB, 'utf8');
for (const img of images) {
  const key = `/images/editorial/hotel-barmoi-freetown/${img.file}`;
  if (lib.includes(key)) throw new Error('photo library already has ' + key);
}
let libOut = lib;
const entries = images.map((img) => {
  const key = `/images/editorial/hotel-barmoi-freetown/${img.file}`;
  return (
    `    "${key}": {\n` +
    `      "kind": "photograph", "slug": "${img.slug}", "local_path": "${key}",\n` +
    `      "source_page": "${img.source_page}", "source_revision": "${img.source_revision}",\n` +
    `      "creator": "${img.creator}",\n` +
    `      "license": "${img.license}", "license_url": "${img.license_url}",\n` +
    `      "source_published_at": null, "captured_at": ${JSON.stringify(img.captured_at)}, "sha256": "${img.sha256}",\n` +
    `      "exact_subject": false, "subject": ${JSON.stringify(img.subject)},\n` +
    `      "alt": ${JSON.stringify(img.alt)},\n` +
    `      "caption": ${JSON.stringify(img.caption)},\n` +
    `      "property": false, "requires_attribution": true, "checked_at": "${img.checked_at}",\n` +
    `      "changes": "Wikimedia Commons scaled JPEG (1280px thumb or original), aspect ratio preserved; no other edits.",\n` +
    `      "exact_subject_evidence": ${JSON.stringify(img.exact_subject_evidence)},\n` +
    `      "reuse_note": "Attribution required: credit ${img.creator}, ${img.license}, source file page; share-alike terms continue to apply where applicable. Attribution appears on-page in the figure caption. Contextual ${img.subject.toLowerCase().startsWith('lumley') || img.subject.toLowerCase().startsWith('aberdeen') ? 'location' : 'city'} image; not Hotel Barmoi or any property interior."\n` +
    `    }`
  );
}).join(',\n');
// Insert before the closing of the images object.
const anchor = libOut.lastIndexOf('\n  }');
if (anchor < 0) throw new Error('photo library images closing brace not found');
libOut = libOut.slice(0, anchor) + ',\n' + entries + '\n' + libOut.slice(anchor);
fs.writeFileSync(PHOTO_LIB, libOut);
console.log('src/lib/photo-library.js updated with', images.length, 'images');

// --- 4. destination stay list unchanged (Barmoi is city-side; not added to tokeh-river-number-two) ---
console.log('done');
