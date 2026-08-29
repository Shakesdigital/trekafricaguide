<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
class TravelSearchTest extends TestCase
{
    use RefreshDatabase;
    public function test_accommodation_search_retains_normalized_stay_context(): void
    {
        $this->seed();
        $response = $this->get('/accommodations?q=Uganda&checkin=2026-11-10&checkout=2026-11-12&adults=20&rooms=0');
        $response->assertOk()->assertSee('Sanctuary Gorilla Forest Camp');
        $response->assertViewHas('searchContext', fn ($context) => $context['adults'] === 12 && $context['rooms'] === 1 && $context['checkin'] === '2026-11-10');
    }
    public function test_legacy_accommodation_route_redirects_to_focused_index(): void
    {
        $this->seed();
        $this->get('/accommodations/sanctuary-gorilla-forest-camp')->assertRedirectContains('/accommodations?q=Sanctuary');
    }
}
