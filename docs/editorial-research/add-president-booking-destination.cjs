const fs = require('fs');
const p = 'content/booking-destinations.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.accommodations = j.accommodations || {};
j.accommodations['president-hotel-bantry-bay'] = {
  url: 'https://www.booking.com/hotel/za/president-cape-town.en-gb.html',
  provider: 'booking',
  title: 'President Hotel',
  checked_at: '2026-11-16',
  status: 'hold',
  hold_reason: "16 November 2026 audit: the direct Booking.com exact property detail page resolves correctly in a browser session (8.5/10, 2,822 reviews, full detail), but the Stay22 wrap of the same URL lands on searchresults.html with dest_id=15195, dest_type=hotel twice in a row - a single-destination result page, not the exact detail landing. CTA suppressed per the kibale-forest-camp precedent until the wrapper lands exact; recheck the wrap before reactivating.",
  evidence: {
    source_url: 'https://www.booking.com/hotel/za/president-cape-town.en-gb.html',
    summary: 'Browser session 16 November 2026: exact property detail page resolves directly (not searchresults). Confirmed: President Hotel, 4 Alexander Road, Bantry Bay, Sea Point, 8001 Cape Town; 8.5/10 from 2,822 reviews; location 9.4; check-in 14:00-00:00, check-out 06:00-11:00; 16 room types across Classic, Suite, One/Two-Bedroom Apartment, Presidential Two Bedroom Apartment and Studio families; Green Key certification; Queens Beach 150 m; airport 24 km. Same URL the live Cape Town base-by-outings insight has linked since 18 October 2026.',
  },
};
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
console.log('booking destination registered');
