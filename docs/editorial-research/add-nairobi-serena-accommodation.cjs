// Adds the Nairobi Serena Hotel accommodation deliverable (2026-11-09 run).
// Idempotent: skips when slug already exists. Formatting: 2-space JSON round-trip.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

const overridesPath = path.join(ROOT, 'content', 'editorial-overrides.json');
const bookingPath = path.join(ROOT, 'content', 'booking-destinations.json');
const destinationsPath = path.join(ROOT, 'content', 'local-destinations.json');

const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
const booking = JSON.parse(fs.readFileSync(bookingPath, 'utf8'));
const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));

const RECORD = {
  region_id: 14,
  country_id: 46,
  slug: 'nairobi-serena-hotel',
  name: 'Nairobi Serena Hotel',
  property_type: 'City hotel',
  location_name: 'Central Park, Nairobi, Kenya',
  listing_summary: "A full-service five-star city base beside Central Park on Kenyatta Avenue, with 196 remodeled rooms and suites in nine categories, six food and drink venues, a health club and spa and a heated pool; confirm what your selected rate includes.",
  detail_intro: "Nairobi Serena Hotel is the Serena group's five-star city property in the Kenyan capital, tucked beside Central Park on Kenyatta Avenue. Its operator describes a calm base near the Central Business District and a short drive from Jomo Kenyatta International Airport, with interiors that draw on design traditions from Ethiopia, the Maghreb, West Africa and East Africa. After its five-star positioning, the operator counts 196 remodeled rooms and suites — do not assume every category shares the same view, floor, size or inclusions; confirm the exact room name for your dates.\n\nThe room range is unusually layered for a capital-city hotel. Deluxe rooms (26 sqm) and their twin and accessible variants open onto city, Expressway or canopy views with a complimentary soft-drink minibar, tea and coffee station and high-speed Wi-Fi. Executive Rooms sit on the dedicated fifth floor with Premier Lounge access, a meet-and-greet airport transfer and a 30-minute spa massage included; Premium Rooms (26 sqm, sixth and seventh floors) add an espresso machine and Art Deco styling on top of the lounge access. The 44 sqm Superior Rooms carry a king bed, a private balcony with outdoor seating and a separate bathtub and walk-in shower; the suites climb from 51 sqm Executive Suites to a 115 sqm Lamu Suite with kitchenette and a 167 sqm Chale Presidential Suite on the highest floor with its own fitness studio.\n\nShared facilities match that structure: a heated swimming pool, the Maisha Health Club and Spa (treatments charged separately), 24-hour room service, and six food-and-drink venues — Herbs & Spices (South-East Asian cuisine, 11:00-23:00 daily), Mandhari Fine Dining (a Tuscan-style terrace over the pool with live piano; closed Sundays), the all-day Café Maghreb (buffet with themed dinner nights), the Aksum Bar (Ethiopian-inspired design), the Bambara Lounge (West-African styling) and the Pool Bar. Meeting venues range from the Ballroom to named garden rooms, five minutes from the CBD. For a Kenya trip this makes it a practical rested-city bookend: an arrival or departure night, or a base for a Nairobi day, before or after the park nights in Mara or Amboseli.",
  practical_info: "Use the booking panel to compare room categories and cancellation terms before paying. Rates, breakfast inclusion and airport-transfer arrangements depend on your dates; no live price or availability is quoted here. Executive and lounge-floor categories bundle transfer and lounge perks that standard categories do not — read the inclusions before choosing on size alone.\n\nFor city planning, use <a href=\"/countries/kenya/nairobi\">our Nairobi guide</a>: it covers the national park's black-rhino fame, the Safari Walk and orphanage, Wilson Airport's airstrip logic and the rested first evening the gateway guides assume. If your journey adds a fly-in stay, confirm the correct airstrip against your lodge before confirming park-side nights; local flight details are in the Kenya guides.\n\nThis page has no licensed Nairobi Serena property photographs. The neutral image slot is deliberate; city or park scenery from another source must not stand in for the hotel.",
  amenities: [
    "196 remodeled rooms and suites in nine categories, from 26 sqm Deluxe Rooms to the 167 sqm Chale Presidential Suite",
    "Executive and Premium floors with Premier Lounge access, meet-and-greet transfers and spa or laundry inclusions",
    "Herbs & Spices, Mandhari Fine Dining, Café Maghreb, Aksum Bar, Bambara Lounge and Pool Bar",
    "24-hour room service and 24-hour front desk",
    "Maisha Health Club and Spa (treatments at a fee) with heated swimming pool",
    "Complimentary high-speed Wi-Fi and complimentary soft-drink minibar in room categories",
    "Meeting and event venues from the Ballroom to named garden rooms",
    "Hairdryer, safety-deposit box, electric kettle and in-room TV as listed room amenities"
  ],
  price_label: "Luxury (operator five-star positioning; not a live price comparison)",
  booking_url: "https://www.booking.com/hotel/ke/nairobi-serena.html",
  source_url: "https://www.serenahotels.com/nairobi/",
  research_sources: [
    {
      label: "Nairobi Serena Hotel: official overview, room and suite categories with sizes, floors and inclusions",
      url: "https://www.serenahotels.com/nairobi/"
    },
    {
      label: "Nairobi Serena Hotel: official dining venues, opening hours and meetings-and-events descriptions",
      url: "https://www.serenahotels.com/nairobi/"
    },
    {
      label: "Booking.com: exact Nairobi Serena Hotel property detail (search-verified 9 November 2026; direct platform fetch automation-blocked, so no rate, availability or review-score claims are made)",
      url: "https://www.booking.com/hotel/ke/nairobi-serena.html"
    },
    {
      label: "Trek Africa Guide: Nairobi local destination guide and visit-planning context",
      url: "https://trekafricaguide.com/countries/kenya/nairobi/"
    }
  ],
  last_researched: '2026-11-09',
  rating: null,
  review_count: 0,
  status: 'published',
  published_at: null,
  hero_image_url: '',
  hero_image_alt: 'Nairobi Serena Hotel',
  gallery: []
};

if (!overrides.accommodations.some(a => a.slug === 'nairobi-serena-hotel')) {
  overrides.accommodations.push(RECORD);
  fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2) + '\n');
  console.log('accommodation record added');
} else {
  console.log('accommodation record already present — skipped');
}

const bk = booking.accommodations['nairobi-serena-hotel'];
if (!bk) {
  booking.accommodations['nairobi-serena-hotel'] = {
    url: 'https://www.booking.com/hotel/ke/nairobi-serena.html',
    provider: 'booking',
    title: 'Nairobi Serena Hotel',
    checked_at: '2026-11-09',
    evidence: {
      source_url: 'https://www.booking.com/hotel/ke/nairobi-serena.html',
      summary: 'Search results (checked 9 November 2026) identify the exact Booking.com detail page "Nairobi Serena Hotel, Kenyatta Avenue, 00100 Nairobi" matching the official Serena property. Direct Booking.com detail fetch was automation-blocked (Ridge Royal standard), so no live rate, availability, numerical rating or review-count claim is made. Identity cross-checked against the official Serena Hotels site.'
    }
  };
  fs.writeFileSync(bookingPath, JSON.stringify(booking, null, 2) + '\n');
  console.log('booking destination added');
} else {
  console.log('booking destination already present — skipped');
}

const list = Array.isArray(destinations) ? destinations : destinations.destinations;
const nairobiEntry = list.find(d => d && d.slug === 'nairobi');
if (!nairobiEntry) throw new Error('nairobi destination entry not found');
if (!nairobiEntry.accommodation_slugs.includes('nairobi-serena-hotel')) {
  nairobiEntry.accommodation_slugs.push('nairobi-serena-hotel');
  fs.writeFileSync(destinationsPath, JSON.stringify(destinations, null, 2) + '\n');
  console.log('nairobi destination accommodation_slugs updated');
} else {
  console.log('nairobi destination already linked — skipped');
}
