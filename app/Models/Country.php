<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use App\Models\Concerns\HasPublicationState;

class Country extends Model
{
    use HasPublicationState;
    protected $fillable = [
        'region_id',
        'slug',
        'name',
        'hero_title',
        'hero_text',
        'overview',
        'access_summary',
        'best_time',
        'planning_tips',
        'hero_image_url',
        'hero_image_alt',
        'gallery',
        'sort_order',
        'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
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

    public function attractions(): HasMany
    {
        return $this->hasMany(Attraction::class)->orderBy('sort_order');
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
    public function districts(): HasMany { return $this->hasMany(District::class)->orderBy('sort_order'); }
    public function mediaAssets(): MorphMany { return $this->morphMany(MediaAsset::class, 'mediable')->publiclyVisible()->orderBy('sort_order'); }
    public function heroMedia(): MorphOne { return $this->morphOne(MediaAsset::class, 'mediable')->publiclyVisible()->where('role', 'hero')->orderBy('sort_order'); }
}
