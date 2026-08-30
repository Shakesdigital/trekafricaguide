<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class MediaAsset extends Model
{
    protected $fillable = [
        'mediable_type', 'mediable_id', 'role', 'local_path', 'url', 'alt_text',
        'source_page', 'creator', 'license', 'license_url', 'exact_subject_match',
        'attribution_text', 'status', 'published_at', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['exact_subject_match' => 'boolean', 'published_at' => 'datetime'];
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
