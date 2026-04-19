<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Region extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'hero_title',
        'hero_text',
        'overview',
        'countries_intro',
        'hero_image_url',
        'hero_image_alt',
        'sort_order',
    ];

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
}
