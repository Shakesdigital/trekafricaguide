<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Accommodation extends Model
{
    protected $fillable = [
        'region_id',
        'country_id',
        'attraction_id',
        'slug',
        'name',
        'property_type',
        'location_name',
        'hero_image_url',
        'hero_image_alt',
        'listing_summary',
        'detail_intro',
        'practical_info',
        'amenities',
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
            'amenities' => 'array',
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

    public function attraction(): BelongsTo
    {
        return $this->belongsTo(Attraction::class);
    }
}
