<?php

namespace Tests\Feature;

use Tests\TestCase;

class TravelPagesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_primary_pages_are_accessible(): void
    {
        $pages = [
            '/',
            '/regions',
            '/destinations',
            '/destinations/maasai-mara',
            '/safaris-tours',
            '/accommodations',
            '/travel-guides',
            '/local-experiences',
            '/about',
            '/contact',
        ];

        foreach ($pages as $page) {
            $this->get($page)->assertOk();
        }
    }

    public function test_homepage_contains_core_branding_and_hero_copy(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('Trek Africa Guide')
            ->assertSee('Discover Africa Differently')
            ->assertSee('From Sahara to Serengeti');
    }

    public function test_partner_booking_call_to_action_is_visible_on_commercial_pages(): void
    {
        $commercialPages = [
            '/destinations/maasai-mara',
            '/safaris-tours',
            '/accommodations',
            '/local-experiences',
        ];

        foreach ($commercialPages as $page) {
            $this->get($page)
                ->assertOk()
                ->assertSee('Book via Partner');
        }
    }

    public function test_safaris_filters_apply_by_region_and_type(): void
    {
        $this->get('/safaris-tours?region=east-africa&safari_type=game-drive')
            ->assertOk()
            ->assertSee('Great Migration Game Drive')
            ->assertDontSee('Sahara Nomad Desert Camp');
    }
}
