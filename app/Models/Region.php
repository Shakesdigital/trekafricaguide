<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use App\Models\Concerns\HasPublicationState;

class Region extends Model
{
    use HasPublicationState;
    protected $fillable = [
        'slug',
        'name',
        'hero_title',
        'hero_text',
        'overview',
        'countries_intro',
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

    public function countries(): HasMany
    {
        return $this->hasMany(Country::class)->orderBy('sort_order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function attractions(): HasMany
    {
        return $this->hasMany(Attraction::class)->orderBy('sort_order');
    }
    public function mediaAssets(): MorphMany { return $this->morphMany(MediaAsset::class, 'mediable')->orderBy('sort_order'); }
    public function heroMedia(): MorphOne { return $this->morphOne(MediaAsset::class, 'mediable')->where('role', 'hero')->orderBy('sort_order'); }
}
