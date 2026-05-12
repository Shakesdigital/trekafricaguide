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
            '/contact',
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
            ->assertSee('Safari plains, primate forests')
            ->assertSee('Four useful starting points for a smarter Africa trip.');
    }

    public function test_country_page_links_attractions_stays_restaurants_and_operators(): void
    {
        $this->get('/countries/uganda')
            ->assertOk()
            ->assertSee('Operators that can help shape the route')
            ->assertSee('Tourist attractions in Uganda')
            ->assertSee('Dining ideas that add flavor to the journey');
    }

    public function test_attraction_detail_page_contains_booking_and_practical_sections(): void
    {
        $this->get('/attractions/maasai-mara')
            ->assertOk()
            ->assertSee('How to get there')
            ->assertSee('Check partner options')
            ->assertSee('Accommodations near Maasai Mara');
    }
}
