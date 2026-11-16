const fs = require('fs');
const p = 'content/editorial-overrides.json';
let s = fs.readFileSync(p, 'utf8');

const dir = '/images/editorial/president-hotel-bantry-bay/';
const gallery = [
  dir + 'bantry-bay-coastline.jpg',
  dir + 'sea-point-promenade-coast.jpg',
  dir + 'sea-point-promenade-sunset.jpg',
  dir + 'green-point-lighthouse.jpg',
  dir + 'sea-point-view.jpg',
  dir + 'sea-point-aerial.jpg',
];

const rec = {
  region_id: 16,
  country_id: 52,
  attraction_id: 53,
  slug: 'president-hotel-bantry-bay',
  name: 'President Hotel',
  property_type: 'Full-service hotel',
  location_name: '4 Alexander Road, Bantry Bay (Sea Point), Cape Town, South Africa',
  listing_summary: 'A full-service Atlantic Seaboard hotel in Bantry Bay on the Sea Point shore, with an infinity pool, five on-site dining venues, a spa and direct promenade access; a practical base for mixing coast time with central Cape Town days.',
  detail_intro: `The President Hotel stands at 4 Alexander Road in Bantry Bay, on the Atlantic edge between Sea Point and Clifton, where Victoria Road follows the shoreline below Lion's Head. This is the Sea Point base from our Cape Town planning guides: promenade time and coast evenings sit at the door, while central-city days, Table Mountain and the V&A Waterfront need deliberate transfers rather than a short walk.\n\nThe operator's room range runs across three families. Classic Rooms (about 31 sqm, from R4,000 per person per night as listed 16 November 2026) come in ocean, mountain or urban view variants with queen or twin beds and semi-catering kitchenettes (microwave, bar fridge, tea and coffee). Suites (about 49 sqm, from R5,000 per person per night) add living areas and ocean-facing variants; Ocean Suites sleep up to four adults or two adults and two children. Apartments (about 49 sqm, from R7,000 per person per night) suit families and longer stays with a separate living area, and a Presidential two-bedroom apartment with sea view tops the range. Children 12 and under stay and eat breakfast free when sharing with a paying adult, subject to occupancy limits.\n\nFive food-and-drink venues operate on site: Restaurant & Terrace (breakfast through dinner), Botany Caf\u00e9, The Senate bar, The Base (wood-fired pizza) and The Deck. The Cove Wellness Spa offers treatments, and the infinity pool has a pool bar and heated water. The hotel holds Green Key sustainability certification.\n\nAccessibility and inclusion are unusually well documented here: accessible rooms sit near the guest elevators with large entryways, Deafgard alert devices serve deaf and hard-of-hearing guests, guide dogs are welcome, the kitchen has experience with kosher requirements (Sabbath stairwells stay open), and Crescent Rating audits Muslim-friendly services at 5 of 7, with prayer-direction indicators in rooms and prayer mats, Qurans and local mosque lists on request. The staff have also completed Autism SA-backed neurodiversity training. Confirm specific needs with the hotel before booking.`,
  practical_info: `Location and setting: 4 Alexander Road, Bantry Bay, Cape Town, 8001. The operator places the hotel five minutes from the V&A Waterfront, ten minutes from the city centre and about 25 minutes from Cape Town International Airport by car (Booking.com lists the airport at 24 km). Saunders' Rock and its tidal pool sit about 100 m from the door; Queen's Beach is roughly 150 m (per Booking.com), the MyCiTi Queens Beach station about 250 m, Clifton's beaches are a short drive south, and Camps Bay about 8 minutes by car. The hop-on hop-off bus stops at the hotel, and bicycle and e-scooter hire is available at reception.\n\nGetting around: this is a coast-and-city base, not a central one. Central-city days, Table Mountain and winelands outings each need their own transfer plan; check the current MyCiTi route map and service times against your dates, and confirm pickup points with any operator. Paid on-site parking is about R100; street parking is also available along the promenade.\n\nPracticalities: check-in from 14:00, check-out by 11:00. Pets are allowed with charges and pet baskets and bowls listed. The minimum age for check-in is 18, photo identification and a credit card are required at check-in, and all rooms and facilities are strictly non-smoking with designated ground-floor areas.\n\nBooking: an exact Booking.com property detail page (booking.com/hotel/za/president-cape-town.en-gb.html) was opened and read live on 16 November 2026; it lists the property at 8.5/10 from 2,822 reviews with a 9.4 location score and the room families described above. Rates change with season and view category; compare the exact view, board basis and cancellation window for your dates before paying. Cancellation and prepayment terms vary by rate type.`,
  amenities: [
    "Classic Rooms (~31 sqm), Suites (~49 sqm) and Apartments (~49 sqm) with semi-catering kitchenettes (microwave, bar fridge, tea and coffee)",
    "Ocean, mountain or urban view categories; suites add living areas, Ocean Suites sleep up to four adults",
    "Children 12 and under stay and eat breakfast free sharing with a paying adult (subject to occupancy limits)",
    "Five on-site venues: Restaurant & Terrace, Botany Caf\u00e9, The Senate, The Base (wood-fired pizza), The Deck",
    "Cove Wellness Spa; heated outdoor infinity pool with pool bar",
    "Direct Sea Point promenade access; Saunders' Rock tidal pool ~100 m; hop-on hop-off bus stop at the hotel",
    "Bicycle and e-scooter hire at reception; paid on-site parking (~R100) and promenade street parking",
    "Accessible rooms near elevators, Deafgard alert devices, guide dogs welcome",
    "Kosher-experienced kitchen with Sabbath-open stairwells; Crescent Rating 5/7 Muslim-friendly services; Autism SA neurodiversity-trained staff",
    "Green Key sustainability certification",
  ],
  rating: null,
  review_count: 0,
  price_label: 'Full-service Atlantic Seaboard hotel',
  booking_url: 'https://www.booking.com/hotel/za/president-cape-town.en-gb.html',
  source_url: 'https://www.presidenthotel.co.za/',
  research_sources: [
    {
      label: 'The President Hotel official site (home, rooms, suites, apartments, location, guest information)',
      url: 'https://www.presidenthotel.co.za/',
    },
    {
      label: 'Booking.com exact property detail -- President Hotel, browser-verified 16 November 2026: 4 Alexander Road, Bantry Bay, Sea Point, 8001; 8.5/10 from 2,822 reviews; location 9.4; check-in 14:00, check-out 11:00; Green Key certification; Queens Beach 150 m',
      url: 'https://www.booking.com/hotel/za/president-cape-town.en-gb.html',
    },
    {
      label: 'UK FCDO South Africa travel advice, entry requirements -- checked 16 November 2026',
      url: 'https://www.gov.uk/foreign-travel-advice/south-africa/entry-requirements',
    },
    {
      label: 'Trek Africa Guide -- Cape Town base-by-outings travel insight (names the President Hotel as the Sea Point-area pick; only Mount Nelson had a site guide)',
      url: 'https://trekafricaguide.com/travel-insights/choose-cape-town-base-by-outings/',
    },
  ],
  traveler_feedback: 'Booking.com guest reviews (2,822, checked 2026-11-16) repeatedly highlight the location on the beach, the poolside, the restaurant, breakfast and the staff; one recent guest wrote "We liked everything about this hotel - its location on the beach, the poolside, the restaurant, the breakfast and the rooms. Very good location and a short walk to many shops and restaurants in vibey Sea Point." These are individual traveler accounts, not a site rating or service guarantee. No OTA rating or review count is published in this guide.',
  last_researched: '2026-11-16',
  status: 'published',
  published_at: '2026-11-16T11:00:00Z',
  hero_image_url: dir + 'bantry-bay-coastline.jpg',
  hero_image_alt: 'Rocky Bantry Bay coastline beneath the slopes of Lion\u2019s Head, Cape Town, where the President Hotel stands. Destination setting; not a photograph of the accommodation.',
  gallery,
};

const marker = '  ],\n  "activities": [';
if (!s.includes(marker)) throw new Error('accommodations array close not found');
s = s.replace(marker, ',\n  ' + JSON.stringify(rec, null, 2).replace(/\n/g, '\n  ').trim() + '\n  ],\n  "activities": [');
fs.writeFileSync(p, s);
JSON.parse(s);
console.log('record inserted, json valid, bytes', s.length);
