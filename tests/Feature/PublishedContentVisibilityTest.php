<?php

namespace Tests\Feature;

use App\Models\Attraction;
use App\Models\Country;
use App\Models\Region;
use App\Models\MediaAsset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublishedContentVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_draft_and_future_listings_are_not_publicly_visible(): void
    {
        $region = Region::create(['slug' => 'east-africa', 'name' => 'East Africa', 'hero_title' => 'East Africa', 'hero_text' => 'Guide', 'overview' => 'Overview']);
        $country = Country::create(['region_id' => $region->id, 'slug' => 'uganda', 'name' => 'Uganda', 'hero_title' => 'Uganda', 'hero_text' => 'Guide', 'overview' => 'Overview']);
        $attributes = ['region_id' => $region->id, 'country_id' => $country->id, 'slug' => 'test-attraction', 'name' => 'Test Attraction', 'listing_summary' => 'Summary', 'detail_intro' => 'Intro'];
        $draft = Attraction::create($attributes + ['status' => 'draft']);
        $future = Attraction::create(array_merge($attributes, ['slug' => 'future-attraction', 'status' => 'published', 'published_at' => now()->addDay()]));

        $this->assertFalse(Attraction::publiclyVisible()->whereKey($draft)->exists());
        $this->assertFalse(Attraction::publiclyVisible()->whereKey($future)->exists());
    }

    public function test_draft_and_future_media_are_not_publicly_visible(): void
    {
        $region = Region::create(['slug' => 'east-africa', 'name' => 'East Africa', 'hero_title' => 'East Africa', 'hero_text' => 'Guide', 'overview' => 'Overview']);
        $country = Country::create(['region_id' => $region->id, 'slug' => 'uganda', 'name' => 'Uganda', 'hero_title' => 'Uganda', 'hero_text' => 'Guide', 'overview' => 'Overview']);
        $attraction = Attraction::create(['region_id' => $region->id, 'country_id' => $country->id, 'slug' => 'test-attraction', 'name' => 'Test Attraction', 'listing_summary' => 'Summary', 'detail_intro' => 'Intro', 'status' => 'published']);
        $draft = $attraction->mediaAssets()->create(['role' => 'hero', 'local_path' => '/images/stock/destinations/maasai-mara.jpg', 'alt_text' => 'Draft', 'status' => 'draft']);
        $future = $attraction->mediaAssets()->create(['role' => 'hero', 'local_path' => '/images/stock/destinations/maasai-mara.jpg', 'alt_text' => 'Future', 'status' => 'published', 'published_at' => now()->addDay(), 'sort_order' => 1]);

        $this->assertFalse(MediaAsset::publiclyVisible()->whereKey($draft)->exists());
        $this->assertFalse(MediaAsset::publiclyVisible()->whereKey($future)->exists());
        $this->assertNull($attraction->heroMedia()->first());
    }
}
