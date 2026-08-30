<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use App\Models\Concerns\HasPublicationState;

class TourOperator extends Model
{
    use HasPublicationState;
    protected $fillable = [
        'region_id',
        'country_id',
        'attraction_id',
        'slug',
        'name',
        'summary',
        'website_url',
        'booking_url',
        'hero_image_url',
        'hero_image_alt',
        'specialties',
        'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url',
    ];

    protected function casts(): array
    {
        return [
            'specialties' => 'array',
        ];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function attraction(): BelongsTo
    {
        return $this->belongsTo(Attraction::class);
    }
    public function mediaAssets(): MorphMany { return $this->morphMany(MediaAsset::class, 'mediable')->orderBy('sort_order'); }
    public function heroMedia(): MorphOne { return $this->morphOne(MediaAsset::class, 'mediable')->where('role', 'hero')->orderBy('sort_order'); }
}
