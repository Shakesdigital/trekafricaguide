<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\Concerns\HasPublicationState;

class MediaAsset extends Model
{
    use HasPublicationState;
    protected $fillable = [
        'mediable_type', 'mediable_id', 'role', 'media_type', 'source_type', 'local_path', 'url', 'alt_text',
        'mime_type', 'file_size', 'width', 'height', 'duration_seconds', 'poster_url', 'caption', 'transcript',
        'source_page', 'creator', 'license', 'license_url', 'exact_subject_match',
        'attribution_text', 'status', 'published_at', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'exact_subject_match' => 'boolean',
            'published_at' => 'datetime',
            'file_size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'duration_seconds' => 'decimal:2',
        ];
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
