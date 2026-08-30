<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use App\Models\Concerns\HasPublicationState;

class Attraction extends Model
{
    use HasPublicationState;
    protected $fillable = [
        'region_id',
        'district_id',
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
        'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url',
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
    public function district(): BelongsTo { return $this->belongsTo(District::class); }
    public function bookingOffers(): MorphMany { return $this->morphMany(BookingOffer::class, 'offerable')->where('active', true)->orderBy('sort_order'); }
    public function mediaAssets(): MorphMany { return $this->morphMany(MediaAsset::class, 'mediable')->orderBy('sort_order'); }
    public function heroMedia(): MorphOne { return $this->morphOne(MediaAsset::class, 'mediable')->where('role', 'hero')->orderBy('sort_order'); }
}
