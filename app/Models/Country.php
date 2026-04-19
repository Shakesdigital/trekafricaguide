<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
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
        'sort_order',
    ];

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
}
