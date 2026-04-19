<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourOperator extends Model
{
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
}
