const fs = require('fs');

// ---- 1. Accommodation record into editorial-overrides.json ----
const p = 'content/editorial-overrides.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));
if (o.accommodations.some(a => a.slug === 'nyungwe-top-view-hill-hotel')) throw new Error('accommodation exists');
const maxSort = Math.max(...o.accommodations.map(a => a.sort_order || 0));
const rec = {
  region_id: 14,
  country_id: 49,
  slug: 'nyungwe-top-view-hill-hotel',
  attraction_id: 'repo:attractions:nyungwe-national-park',
  name: 'Nyungwe Top View Hill Hotel',
  property_type: 'Hotel',
  location_name: 'Buvungira Cell, Bushekeri Sector, Nyamasheke District, Western Province, Rwanda',
  listing_summary: "A hilltop 12-cottage hotel outside the Nyungwe forest edge, with a rondavel restaurant, a bottle-top bar and named cottages facing Lake Kivu, the forest or the sunrise and sunset wings.",
  detail_intro: "Nyungwe Top View Hill Hotel is a hilltop stay near the Nyungwe National Park edge in Nyamasheke District, in operation since February 2011 and owned, by its operator's account, by a Rwandan entrepreneur and conservationist. The operator places it in Buvungira Cell of Bushekeri Sector, about five minutes' drive uphill from the Kigali\u2013Bukavu main road (under two kilometres on its account, so a paved-road turn-off rather than a cross-country track). Its main building is a two-tiered modern rondavel: reception on the ground floor with traditional Rwandan murals, and a mezzanine dining area and bar with a sweeping veranda above \u2014 decorated, on the property's own description, entirely from bottle tops \u2014 with 360-degree hilltop views that, on clear days, its account says reach Lake Kivu and the chain of volcanoes of far-north Rwanda and eastern Democratic Republic of Congo (Karisimbi, Mikeno, Nyamuragira and Nyiragongo).\n\nTwelve red-brick cottages stand in two rows \u2014 a sunrise side and a sunset side, six each \u2014 each double or twin, with a front lounge of terracotta-tiled floors, sofa, coffee table and a fireplace lit on cold evenings, plus a bedroom with a decorated bathroom. Every cottage faces a particular view and takes its name from it: the Kivu cottage for the lake breeze, the Nyungwe cottage for the forest. Campfires and cultural dances by local artists happen on special days, the operator adds.\n\nNeither the operator nor a current platform rating is published on this page: the hotel is listed as a 3-star property on Google's hotel panel (152 reviews there at our 9 November 2026 check), and we treat that as positioning rather than a score we print. It suits Nyungwe visitors who want a mid-market base with in-house meals and views, pairing chimp-tracking and canopy-walk mornings with quiet evenings \u2014 see our <a href=\"/activities/nyungwe-canopy-walk\">Nyungwe canopy walk guide</a> and the <a href=\"/attractions/nyungwe-national-park\">Nyungwe National Park guide</a> for what those days involve and what they cost.",
  practical_info: "Positioning for park days is the point of the choice. The operator places the hotel about 45 minutes' drive from Kamembe airport (it claims a daily RwandAir schedule there), about 30 minutes from the Lake Kivu shore with the thrice-weekly Rusizi\u2013Rubavu lake boat as a link, and 45 minutes from Bukavu in the DRC. Treat all of those as the operator's own estimates and confirm current road and transfer times when booking. Inside the park, the signature outings \u2014 the Uwinka canopy walkway and early chimpanzee tracking \u2014 are described in our <a href=\"/attractions/nyungwe-national-park\">Nyungwe National Park guide</a> and their fees and timing in the <a href=\"/activities/nyungwe-canopy-walk\">canopy walk guide</a>; ask the hotel's ticketing desk to cross-check start times and transport for your dates.\n\nBook direct or through your operator by phone or email (+250 787 109 335, reservations@nyungwehotel.com). At our 9 November 2026 check the hotel's own site had no working online reservation form \u2014 its accommodation page returned a server error \u2014 and no exact booking-platform product page we could verify as current, so the booking panel on this page stays deliberately empty rather than pointing at an unverified listing. Ask the property in writing to confirm room category (double or twin cottage, sunrise or sunset wing), meal basis, fireplace evenings and shuttle or transfer costs before paying.\n\nThe facilities list also covers a ground shuttle within Rwanda, a conference room, front-desk services and the ticketing-and-reservation desk that handles Nyungwe attractions, gorilla permits and the Lake Kivu circuit.\n\nThis page has no licensed Top View Hill property photographs. The neutral image slot is deliberate; forest, lake or volcano scenery from another source must not stand in for the hotel.",
  amenities: [
    "Twelve double or twin cottages in sunrise and sunset wings, named for the view they face",
    "Two-tiered rondavel main building with mezzanine dining area, bar and veranda",
    "Front lounges with terracotta floors, fireplace lit on cold evenings",
    "Restaurant and bar (bar decorated from bottle tops)",
    "Ground shuttle within Rwanda (confirm arrangements and costs)",
    "Conference room and front-desk services",
    "Ticketing and reservations desk for Nyungwe attractions, including gorilla permits",
    "Campfires and cultural dances by local artists on special days (per the operator)"
  ],
  price_label: "Mid-range (operator positioning plus Google's 3-star listing; not a live rate comparison)",
  booking_url: null,
  source_url: 'https://nyungwehotel.com/',
  research_sources: [
    {
      label: 'Nyungwe Top View Hill Hotel official site (home page) \u2014 brand, contacts (+250 787 109 335, reservations@nyungwehotel.com), park context (primates, orchids, birds, canopy walkway, falls, trails); the hotel panellists its official website at this domain; checked 9 November 2026',
      url: 'https://nyungwehotel.com/',
      checked_at: '2026-11-09'
    },
    {
      label: 'Official About Us page \u2014 Buvungira Cell, Bushekeri Sector, Nyamasheke District; in operation since February 2011; Rwandese entrepreneur/conservationist owner; two-tiered rondavel with murals, mezzanine dining and bottle-top bar; clear-day views of Lake Kivu and north-Rwanda/DRC volcanoes; 12 cottages in sunrise/sunset rows of six with front lounges and fireplaces; under 2 km from the Kigali\u2013Bukavu road; ~30 min to Lake Kivu shore (thrice-weekly boat context), ~45 min to Kamembe airport (RwandAir schedule claimed), 45 min to Bukavu; checked 9 November 2026',
      url: 'https://nyungwehotel.com/AboutUs',
      checked_at: '2026-11-09'
    },
    {
      label: 'Official Facilities page \u2014 ground shuttle, conference room, front desk services, ticketing/reservation desk incl. gorilla permits and Lake Kivu circuit, restaurant and bar; checked 9 November 2026',
      url: 'https://nyungwehotel.com/Facilities',
      checked_at: '2026-11-09'
    },
    {
      label: 'Official Contact page \u2014 phone and reservations email confirmed; checked 9 November 2026',
      url: 'https://nyungwehotel.com/ContactUs',
      checked_at: '2026-11-09'
    },
    {
      label: 'Negative booking-channel checks 2026-11-09 \u2014 Google/DuckDuckGo live index: no current Booking.com property-detail listing; direct Booking.com fetch redirected to an empty search page; guessed One&Only Nyungwe House slug returned "Page not found"; official accommodation page returned a Laravel database error, so no working reservation endpoint exists. No booking CTA published by rule.',
      url: 'https://www.booking.com/hotel/rw/nyungwe-top-view-hill-hotel.en-gb.html',
      checked_at: '2026-11-09'
    },
    {
      label: 'Google Search hotel panel snapshot 2026-11-09 \u2014 listed as a 3-star hotel with 152 Google reviews, website linked to nyungwehotel.com; used as positioning/attribution only, no score or quote reprinted',
      url: 'https://www.google.com/search?hl=en&q=Nyungwe+Top+View+Hill+Hotel',
      checked_at: '2026-11-09'
    },
    {
      label: 'Visit Rwanda hotel page \u2014 broken template (lorem-ipsum placeholder content) at our 2026-11-09 fetch, mirroring the park portal disclosure; no facts drawn',
      url: 'https://visitrwanda.com/explore/nyungwe-top-view-hill-hotel/',
      checked_at: '2026-11-09'
    },
    {
      label: 'Live Trek Africa Guide context \u2014 Nyungwe attraction guide and Nyungwe canopy walk activity guide (empty nearby-stays rail at this run check) for pairing copy; checked on live pages this run',
      url: 'https://trekafricaguide.com/attractions/nyungwe-national-park/',
      checked_at: '2026-11-09'
    }
  ],
  traveler_feedback: "Google's hotel panel showed 152 reviews for the property at our 9 November 2026 check, but no overall score was visible in that snapshot and no review excerpts were transcribed \u2014 so no quoting, rating or count beyond that panel attribution is published here.",
  last_researched: '2026-11-09',
  rating: null,
  review_count: 0,
  status: 'published',
  published_at: null,
  hero_image_url: '',
  hero_image_alt: 'Nyungwe Top View Hill Hotel',
  featured: false,
  sort_order: maxSort + 1,
  gallery: []
};
o.accommodations.push(rec);
fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('accommodation added, total', o.accommodations.length);
