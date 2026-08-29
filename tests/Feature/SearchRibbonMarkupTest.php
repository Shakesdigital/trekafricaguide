<?php
namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class SearchRibbonMarkupTest extends TestCase
{
    use RefreshDatabase;
    public function test_accommodation_page_has_dates_travelers_and_rooms(): void
    {
        $response = $this->get('/accommodations');
        $response->assertOk()->assertSee('data-search-ribbon', false)->assertSee('name="checkin"', false)->assertSee('name="checkout"', false)->assertSee('name="adults"', false)->assertSee('name="rooms"', false);
    }
    public function test_attraction_page_has_two_modes_and_combobox(): void
    {
        $this->get('/attractions')->assertOk()->assertSee('data-search-mode="attractions"', false)->assertSee('data-search-mode="accommodations"', false)->assertSee('role="combobox"', false);
    }
}
