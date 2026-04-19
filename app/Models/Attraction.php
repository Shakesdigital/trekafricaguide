<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attraction extends Model
{
    protected $fillable = [
        'region_id',
        'country_id',
        'slug',
        'name',
        'location_name',
        'hero_image_url',
        'hero_image_alt',
        'listing_summary',
        'detail_intro',
        'full_description',
        'getting_there',
        'best_time',
        'practical_info',
        'gallery',
        'highlights',
        'rating',
        'review_count',
        'price_label',
        'booking_url',
        'featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'highlights' => 'array',
            'featured' => 'boolean',
            'rating' => 'decimal:1',
        ];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class)->orderBy('sort_order');
    }

    public function restaurants(): HasMany
    {
        return $this->hasMany(Restaurant::class)->orderBy('sort_order');
    }

    public function tourOperators(): HasMany
    {
        return $this->hasMany(TourOperator::class)->orderBy('name');
    }
}
