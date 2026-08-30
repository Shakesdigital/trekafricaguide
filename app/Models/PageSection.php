<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\HasPublicationState;

class PageSection extends Model
{
    use HasPublicationState;
    protected $fillable = [
        'page_key',
        'section_key',
        'module_type',
        'eyebrow',
        'title',
        'body',
        'image_url',
        'meta',
        'sort_order',
        'status', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }
}
