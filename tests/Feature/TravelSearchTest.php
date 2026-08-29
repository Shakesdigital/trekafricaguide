<?php
namespace Tests\Feature;
use App\Models\Accommodation;
use App\Models\Country;
use App\Models\District;
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

    public function test_exact_listing_name_ranks_before_featured_substring_and_district_is_searchable(): void
    {
        $this->seed();
        $country = Country::where('slug', 'kenya')->firstOrFail();
        $district = District::create(['country_id' => $country->id, 'name' => 'Narok', 'slug' => 'narok']);

        Accommodation::where('slug', 'governors-camp')->update(['name' => 'Mara River Camp', 'featured' => true]);
        Accommodation::where('slug', 'ol-tukai-lodge-amboseli')->update([
            'name' => 'Mara',
            'featured' => false,
            'district_id' => $district->id,
        ]);

        $response = $this->get('/accommodations?q=Mara')->assertOk();
        $names = $response->viewData('accommodations')->pluck('name')->values();
        $this->assertSame('Mara', $names->first());

        $districtResults = $this->get('/accommodations?q=Narok')->assertOk()->viewData('accommodations');
        $this->assertTrue($districtResults->contains('name', 'Mara'));
    }
}
