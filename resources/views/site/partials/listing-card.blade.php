<article class="listing-card">
    <a href="{{ $href }}" class="listing-card__image">
        @include('site.partials.image-slot', ['image' => $image ?? null, 'alt' => $title, 'class' => 'listing-card__slot'])
    </a>
    <div class="listing-card__body">
        @if(!empty($eyebrow))
            <p class="listing-card__eyebrow">{{ $eyebrow }}</p>
        @endif
        <h3><a href="{{ $href }}">{{ $title }}</a></h3>
        <p>{{ $summary }}</p>
        <div class="listing-card__meta">
            @if(!empty($rating))
                <span>★ {{ number_format((float) $rating, 1) }} @if(!empty($reviews))({{ number_format($reviews) }})@endif</span>
            @endif
            @if(!empty($price))
                <span>{{ $price }}</span>
            @endif
        </div>
        <p class="listing-card__source">Planning-guide rating and rate cue. Verify live terms before paying.</p>
        @if(!empty($facts))
            <dl class="listing-card__facts">
                @foreach($facts as $label => $value)
                    @if(filled($value))
                        <div>
                            <dt>{{ $label }}</dt>
                            <dd>{{ $value }}</dd>
                        </div>
                    @endif
                @endforeach
            </dl>
        @endif
        <div class="listing-card__footer">
            @if(!empty($chips))
                <div class="chip-row">
                    @foreach($chips as $chip)
                        @if(filled($chip))
                            <span>{{ $chip }}</span>
                        @endif
                    @endforeach
                </div>
            @endif
            <a href="{{ $href }}" class="button button--ghost">{{ $cta ?? 'View Details' }}</a>
        </div>
    </div>
</article>
