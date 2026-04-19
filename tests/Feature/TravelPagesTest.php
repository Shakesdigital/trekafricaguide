<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TravelPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed();
    }

    public function test_primary_pages_are_accessible(): void
    {
        $pages = [
            '/',
            '/regions',
            '/regions/east-africa',
            '/countries',
            '/countries/uganda',
            '/attractions',
            '/attractions/bwindi-impenetrable-national-park',
            '/accommodations',
            '/restaurants',
        ];

        foreach ($pages as $page) {
            $this->get($page)->assertOk();
        }
    }

    public function test_admin_requires_login_and_admin_user_can_access_cms(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');

        $admin = User::query()->where('role', 'admin')->firstOrFail();

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertSee('Trek Africa Guide Content Manager');
    }

    public function test_homepage_contains_core_branding_and_region_focus(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('Trek Africa Guide')
            ->assertSee('Explore Africa through regions first')
            ->assertSee('The four major entry points for planning an Africa trip.');
    }

    public function test_country_page_links_attractions_stays_restaurants_and_operators(): void
    {
        $this->get('/countries/uganda')
            ->assertOk()
            ->assertSee('Tour operators active in Uganda')
            ->assertSee('Tourist attractions in Uganda')
            ->assertSee('Recommended restaurants near each attraction');
    }

    public function test_attraction_detail_page_contains_booking_and_practical_sections(): void
    {
        $this->get('/attractions/maasai-mara')
            ->assertOk()
            ->assertSee('How to get there')
            ->assertSee('Book with partner')
            ->assertSee('Accommodations near Maasai Mara');
    }
}
