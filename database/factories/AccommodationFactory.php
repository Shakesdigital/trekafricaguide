<?php

namespace Database\Factories;

use App\Models\Accommodation;
use App\Models\Country;
use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccommodationFactory extends Factory
{
    protected $model = Accommodation::class;

    public function definition(): array
    {
        $country = Country::inRandomOrder()->first() ?? Country::create(['slug' => 'test-country', 'name' => 'Test Country', 'hero_title' => 'Test', 'hero_text' => 'Test', 'overview' => 'Test', 'region_id' => Region::inRandomOrder()->first()?->id ?? 1]);

        return [
            'region_id' => $country->region_id,
            'country_id' => $country->id,
            'slug' => $this->faker->unique()->slug,
            'name' => $this->faker->words(3, true),
            'property_type' => $this->faker->word,
            'location_name' => $this->faker->city,
            'hero_image_url' => '/images/stock/destinations/' . $this->faker->word . '.jpg',
            'hero_image_alt' => $this->faker->sentence,
            'listing_summary' => $this->faker->sentence,
            'detail_intro' => $this->faker->paragraph,
            'practical_info' => $this->faker->paragraph,
            'featured' => false,
            'sort_order' => 1,
            'status' => 'published',
            'published_at' => now(),
        ];
    }
}
