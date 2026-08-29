<?php

namespace Tests\Feature;

use App\Models\Accommodation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingOfferModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_accommodation_has_ordered_active_booking_offers(): void
    {
        $this->seed();
        $stay = Accommodation::query()->firstOrFail();
        $stay->bookingOffers()->create([
            'provider' => 'booking', 'label' => 'View deal on Booking.com',
            'source_url' => 'https://www.booking.com/hotel/ug/example.html',
            'stay22_provider' => 'booking', 'affiliate_supported' => true,
            'price_amount' => 69, 'price_currency' => 'USD', 'price_unit' => 'night',
            'price_checked_at' => '2026-08-29',
            'price_basis' => '1 night, 2 adults, 1 room; taxes confirmed on provider',
            'active' => true, 'sort_order' => 1,
        ]);
        $offer = $stay->bookingOffers()->firstOrFail();
        $this->assertSame('69.00', $offer->price_amount);
        $this->assertTrue($offer->affiliate_supported);
        $this->assertSame('2026-08-29', $offer->price_checked_at->toDateString());
    }
}
