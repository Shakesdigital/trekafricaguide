# Core implementation ledger

## Red/green evidence

- `phpunit BookingOfferModelTest.php` — RED: `Accommodation::bookingOffers()` was undefined; GREEN: 1 test, 3 assertions passed.
- `phpunit Stay22LinkBuilderTest.php` — RED: service class was absent; GREEN: 2 tests, 8 assertions passed.
- `phpunit SearchRibbonMarkupTest.php TravelSearchTest.php` — GREEN after implementation: 4 tests, 15 assertions passed.
- `phpunit AdminBookingOfferTest.php` — GREEN: 2 tests, 4 assertions passed.
- `phpunit StaticBuildRoutesTest.php ListingOfferCardTest.php` — GREEN: 3 tests, 8 assertions passed.
- `npm run build` — initial RED because `node_modules/vite` was absent; after `npm install`, GREEN with Vite 7.3.1.
- Full PHPUnit: 16 passed, 3 failures. Two are expected outdated detail-page assertions after the approved 301 legacy redirect contract; one is the pre-existing country wording assertion documented in the implementation brief.

## Scope and limitations

Implemented district/booking-offer persistence, Stay22 URL construction, normalized geographic search, shared search ribbons, provider offer cards, admin offer creation, safe static output, and Supabase parity. Existing user-owned CMS and `dist/**` changes were preserved. Static verification uses `storage/app/static-verify`; no deployment or remote Supabase write was performed. Browser verification was not available in this worker.

## Focused hardening pass

- `Stay22LinkBuilderTest.php` RED for unsupported provider/rooms behavior; GREEN: 3 tests, 9 assertions.
- Offer cards now render all active sorted offers, enforce a configurable 90-day freshness window, and disclose direct/non-affiliate links.
- Seeder creates honest Booking.com/GetYourGuide comparison offers for every accommodation and attraction, with only verified complete price snapshots.
- Added additive Supabase migration `20260829000200_add_districts_booking_offers.sql` and typed suggestions/ribbon context.
- Focused hardening suite: 5 tests, 16 assertions passed.
