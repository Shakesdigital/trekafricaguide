// Add Accra City Hotel accommodation record. One-off run script (12 Nov 2026).
const fs = require('fs');
const path = 'content/editorial-overrides.json';
const raw = fs.readFileSync(path, 'utf8');
const parsed = JSON.parse(raw);
const before = JSON.stringify(parsed, null, 2) + '\n';
if (parsed.accommodations.some(x => x.slug === 'accra-city-hotel')) { console.log('accra-city-hotel already present; abort'); process.exit(1); }
const rec = {
  region_id: 15,
  country_id: 45,
  attraction_id: "repo:attractions:kwame-nkrumah-memorial-park",
  slug: "accra-city-hotel",
  name: "Accra City Hotel",
  property_type: "Hotel",
  location_name: "Barnes Road, downtown Accra, Ghana",
  listing_summary: "A full-service four-star city hotel on Barnes Road in downtown Accra, with a pool, fitness centre, tennis court and on-site dining; a practical base for the Kwame Nkrumah Memorial Park and Independence Square.",
  detail_intro: "Accra City Hotel is a four-star full-service hotel on Barnes Road in downtown Accra, Ghana. The operator's About page describes it as Ghana's first international-branded hotel, opened in 1988, and says it was the first ISO-certified hotel in West Africa; it lists 196 guest rooms ranging from queen rooms to studio units. Treat those as the operator's own heritage claims, not an independent certification we have verified.\n\nThe official site lists four room categories: Standard, Superior, Twin and Junior Suite. Every category includes a breakfast buffet, and each room is described with air conditioning, an en-suite bath or shower, a work area, a flat-screen TV, WiFi, tea and coffee, an iron and ironing board, a hair dryer and a complimentary minibar. Ask which exact category applies to your dates, because the categories differ in size, TV size and layout rather than in inclusions.\n\nThe property's recreation set-up is substantial for a city hotel: an outdoor swimming pool, a fitness centre and a tennis court, with free private parking and valet service on site. Booking.com's verified property detail also lists a free airport shuttle (the property is about 8 km from Kotoka International Airport) and accessibility features including wheelchair-accessible rooms with grab rails and lowered bathroom fittings. Confirm shuttle timing and any facility schedule with the hotel, since neither source publishes a timetable.\n\nDining runs through THE CITY RESTAURANT, which the operator describes around a Sunday brunch, themed buffet nights and Ghanaian signatures such as jollof and palava sauce alongside continental cooking; a poolside terrace and a lounge and cocktail bar round it out. Guest comments on Booking.com repeatedly single out the breakfast buffet and the staff, but one also notes that menu options can feel repetitive over a long stay, so treat on-site dining as one option in a city full of restaurants.\n\nThe fit is for travelers who want a full-service downtown base rather than a resort: the hotel sits on Barnes Road within easy reach of Accra's High Street, the Kwame Nkrumah Memorial Park and Independence Square, while the beach is roughly 2 km away and the site's own positioning is a business-and-city hotel. If you are ending or starting a Ghana trip here, it pairs naturally with the coast route; our Cape Coast and Elmina guides cover the castle-and-canopy circuit in detail.",
  practical_info: "<p>Arrival and location: the official address is Barnes Road, Accra, Greater Accra Region, GA-107-5500 (GPS code GA-107-5500 on the operator's contact page), with telephone +233 30 263 3863 and email info@accracityhotel.com. Booking.com's property detail lists Barnes Road, PO Box 12720, and places the hotel about 8 km from Kotoka International Airport with a free airport shuttle. Confirm the shuttle and your exact pickup arrangements with the property before arrival; no transfer timetable is published on either source.</p><p>Room choice: compare the four categories by size and layout rather than inclusions, since the operator lists breakfast buffet and the complimentary minibar across all of them. Booking.com's verified detail lists Suite, Twin Room, Standard Queen Room, Superior Queen Room, Standard Double Room, Superior Double Room and Standard Single Room as bookable room types, so ask which of the operator's four categories your selected room corresponds to and how many guests it accommodates.</p><p>Booking path: the exact Booking.com property detail (booking.com/hotel/gh/accra-city-hotel.en-gb.html) was opened and read in a browser session on 12 November 2026, matching the property at Barnes Road, PO Box 12720, Accra. No rate, availability or price claim is reproduced here; compare current rates, meal plans and cancellation terms on the platform's own page for your dates. Payment and check-in rules vary by rate, so read the house rules on the booking page itself.</p><p>Pairing with the memorial: the hotel's downtown position makes it a practical base for the Kwame Nkrumah Memorial Park on Prof. Atta Mills High Street, which our <a href=\"/attractions/kwame-nkrumah-memorial-park\">Kwame Nkrumah Memorial Park attraction guide</a> covers in full, including the park's published hours (Monday–Saturday 9:00 a.m.–7:00 p.m. and Sunday 10:00 a.m.–7:00 p.m.) and current entry categories. The Arts Centre is adjacent to the park and Independence Square is nearby, so a morning park visit can sit comfortably before a late hotel checkout; one Booking.com guest reported being offered a 2 p.m. late checkout, but confirm your own late-checkout terms with the hotel in advance.</p><p>Wider Ghana plans: for the castle-and-canopy circuit, our <a href=\"/attractions/cape-coast-kakum\">Cape Coast and Kakum attraction guide</a> frames the day trip and our <a href=\"/countries/ghana/elmina\">Elmina destination guide</a> covers the coastal overnight option; day tours to Cape Coast, Elmina and Kakum depart from Accra and the drive is long, so plan the timing honestly. For a Cape Coast city base, our <a href=\"/accommodations/ridge-royal-hotel\">Ridge Royal Hotel guide</a> covers the full-service coastal alternative.</p><p>Name and booking engine: the operator's own reservation engine still runs on the former Novotel name (novotel-accra-city-centre.h-rez.com), so older directories and some OTA listings may call the property Novotel Accra City Centre; the current operator brand is Accra City Hotel (accracityhotel.com). Match addresses, not just names, when comparing listings.</p>",
  amenities: [
    "Four room categories (Standard, Superior, Twin, Junior Suite), all with breakfast buffet included per the operator",
    "Air conditioning, en-suite bath or shower, flat-screen TV, refrigerator, tea and coffee, iron and hair dryer",
    "Complimentary minibar in every room category (operator listing)",
    "Outdoor swimming pool",
    "Fitness centre",
    "Tennis court",
    "THE CITY RESTAURANT: Sunday brunch, themed buffet nights, Ghanaian and continental menus",
    "Poolside Terrace and Lounge & Cocktail Bar",
    "Free private parking with valet service",
    "Free airport shuttle (Booking.com lists the service; property about 8 km from Kotoka International Airport)",
    "Wheelchair-accessible rooms with grab rails and lowered bathroom fittings (Booking.com accessibility listing)",
    "Conference venues and event spaces with custom catering"
  ],
  rating: null,
  review_count: 0,
  price_label: "Mid-range full-service city hotel",
  booking_url: "https://www.booking.com/hotel/gh/accra-city-hotel.en-gb.html",
  source_url: "https://www.accracityhotel.com/",
  research_sources: [
    {
      label: "Accra City Hotel — official site: four-star positioning, room categories and inclusions, promotions and contact (Barnes Road, GA-107-5500; +233 30 263 3863)",
      url: "https://www.accracityhotel.com/"
    },
    {
      label: "Accra City Hotel — official rooms page: Standard, Superior, Twin and Junior Suite categories with per-category inclusions (breakfast buffet, complimentary minibar, LCD TV, work area)",
      url: "https://www.accracityhotel.com/rooms.html"
    },
    {
      label: "Accra City Hotel — official dining page: THE CITY RESTAURANT (Sunday brunch, themed buffets, signature jollof and palava sauce), Poolside Terrace, Lounge & Cocktail Bar",
      url: "https://www.accracityhotel.com/food-beverages.html"
    },
    {
      label: "Accra City Hotel — official About page: Ghana's first international-branded hotel (1988), first ISO-certified hotel in West Africa claim, 196 guest rooms",
      url: "https://www.accracityhotel.com/about-us.html"
    },
    {
      label: "Booking.com — exact Accra City Hotel property detail, browser-verified 12 November 2026: Barnes Road PO Box 12720, 8.1 Very good from 116 reviews, facilities (outdoor pool, fitness centre, tennis court, free airport shuttle, free private parking, restaurant, bar), accessibility features, room-type list; no rate or availability claim reproduced",
      url: "https://www.booking.com/hotel/gh/accra-city-hotel.en-gb.html"
    },
    {
      label: "Booking.com — Accra City Hotel guest reviews page, browser-verified 12 November 2026: guest comment cards (staff, breakfast buffet, late checkout, central location; one repetitive-menu caveat), category scores",
      url: "https://www.booking.com/reviews/gh/hotel/accra-city-hotel.en-gb.html"
    },
    {
      label: "Tripadvisor — Accra City Hotel review listing via search index (checked 12 November 2026): 631 traveler reviews, ranked #20 of 144 Accra hotels, rated 3 of 5; direct page bot-walled to automated retrieval, so only the aggregate is recorded",
      url: "https://www.tripadvisor.com/Hotel_Review-g293797-d9762772-Reviews-Accra_City_Hotel-Accra_Greater_Accra.html"
    },
    {
      label: "Trek Africa Guide — Kwame Nkrumah Memorial Park attraction guide (live, HTTP 200): Accra High Street setting, published hours and entry categories, Arts Centre adjacent; renders no Nearby stays section",
      url: "https://trekafricaguide.com/attractions/kwame-nkrumah-memorial-park/"
    }
  ],
  last_researched: "2026-11-12",
  hero_image_url: "",
  hero_image_alt: "No licensed property photograph available",
  gallery: [],
  traveler_feedback: "Booking.com aggregate, browser-verified 12 November 2026: 8.1/10 (Very good) from 116 reviews (Cleanliness 8.5, Comfort 8.6, Facilities 7.7, Location 9.0, Staff 8.9, Value 7.2, Free WiFi 7.2), with the location the standout category (9.0) and value the lowest. Recent guest comment cards: Mark (France) named front-desk, valet, breakfast/bar and laundry staff; Clara (United Kingdom) reported clean rooms and a helpful offer of a 2 p.m. late checkout; Jacqueline (United Kingdom) praised the 'huge breakfast buffet and a nice pool right in the centre of Accra'; Penn (US Virgin Islands) noted that after a while the breakfast and dinner options 'seem repetitive'. Tripadvisor aggregate via search index (checked 12 November 2026): 631 reviews, ranked #20 of 144 Accra hotels, rated 3 of 5. These are individual accounts and platform aggregates, not a guarantee of current service or food."
};
parsed.accommodations.push(rec);
const out = JSON.stringify(parsed, null, 2) + '\n';
fs.writeFileSync(path, out);
console.log('added accra-city-hotel; accommodations now', parsed.accommodations.length);
