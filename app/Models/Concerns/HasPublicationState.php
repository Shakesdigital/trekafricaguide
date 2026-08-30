<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait HasPublicationState
{
    public function scopePubliclyVisible(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where(function (Builder $query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            });
    }
}
