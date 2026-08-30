<?php
namespace Tests\Feature;
use App\Models\Accommodation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class ListingOfferCardTest extends TestCase
{
    use RefreshDatabase;
    public function test_stay_card_shows_dated_from_price_and_named_provider_link(): void
    {
        $this->seed(); $stay = Accommodation::query()->firstOrFail();
        $stay->bookingOffers()->create(['provider'=>'booking','label'=>'View deal on Booking.com','stay22_provider'=>'booking','source_url'=>'https://booking.example','affiliate_supported'=>true,'price_amount'=>69,'price_currency'=>'USD','price_unit'=>'night','price_checked_at'=>now()->toDateString(),'price_basis'=>'1 night, 2 adults']);
        $this->get('/accommodations/'.$stay->slug)->assertOk()->assertSee('From $69.00 per night')->assertSee('View deal on Booking.com')->assertSee('stay22.com/allez/booking', false);
    }
}
