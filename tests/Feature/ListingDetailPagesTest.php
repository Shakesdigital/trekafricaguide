<?php

namespace Tests\Feature;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingDetailPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed();
    }

    public function test_representative_detail_urls_return_200(): void
    {
        $this->get('/attractions/bwindi-impenetrable-national-park')->assertOk();
        $this->get('/accommodations/sanctuary-gorilla-forest-camp')->assertOk();
        $this->get('/restaurants/the-rock-restaurant-zanzibar')->assertOk();
    }

    public function test_full_catalogue_detail_urls_return_200(): void
    {
        foreach (Attraction::query()->pluck('slug') as $slug) {
            $this->get('/attractions/'.$slug)->assertOk();
        }
        foreach (Accommodation::query()->pluck('slug') as $slug) {
            $this->get('/accommodations/'.$slug)->assertOk();
        }
        foreach (Restaurant::query()->pluck('slug') as $slug) {
            $this->get('/restaurants/'.$slug)->assertOk();
        }
    }

    public function test_draft_and_future_listings_return_404(): void
    {
        $draft = Attraction::factory()->create(['status' => 'draft']);
        $future = Attraction::factory()->create(['status' => 'published', 'published_at' => now()->addDay()]);

        $this->get('/attractions/'.$draft->slug)->assertNotFound();
        $this->get('/attractions/'.$future->slug)->assertNotFound();
    }

    public function test_cards_contain_view_details_and_no_provider_offer_text(): void
    {
        $response = $this->get('/countries/uganda');

        $response->assertOk()
            ->assertSee('View details')
            ->assertDontSee('View deal on')
            ->assertDontSee('From $');
    }

    public function test_detail_responses_contain_active_offers(): void
    {
        $stay = Accommodation::query()->firstOrFail();
        $stay->bookingOffers()->create([
            'provider' => 'booking',
            'label' => 'Compare on Booking.com',
            'stay22_provider' => 'booking',
            'source_url' => 'https://booking.example',
            'price_amount' => 89,
            'price_currency' => 'USD',
            'price_unit' => 'night',
            'price_checked_at' => now()->toDateString(),
            'price_basis' => '1 night, 2 adults',
        ]);

        $response = $this->get('/accommodations/'.$stay->slug);

        $response->assertOk()
            ->assertSee('Compare booking options')
            ->assertSee('From $89.00 per night')
            ->assertSee('Compare on Booking.com', false);
    }

    public function test_detail_breadcrumbs_link_through_region_country_and_type(): void
    {
        $response = $this->get('/attractions/bwindi-impenetrable-national-park');

        $response->assertOk()
            ->assertSee('Home')
            ->assertSee('Attractions')
            ->assertSee('Bwindi Impenetrable National Park');
    }
}
