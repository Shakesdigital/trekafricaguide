<article class="listing-card @if(isset($listing) && request('focus') === $listing->slug) listing-card--focused @endif" @if(isset($listing)) id="{{ $listing->slug }}" @endif>
    <div class="listing-card__image">
        @include('site.partials.image-slot', ['image' => $image ?? null, 'alt' => $title, 'class' => 'listing-card__slot'])
    </div>
    <div class="listing-card__body">
        @if(!empty($eyebrow))
            <p class="listing-card__eyebrow">{{ $eyebrow }}</p>
        @endif
        <h3>{{ $title }}</h3>
        <p>{{ \Illuminate\Support\Str::limit(strip_tags($summary), 125) }}</p>

        <div class="listing-card__footer">
            @if(!empty($chips))
                <div class="chip-row">
                    @foreach(collect($chips)->filter()->take(1) as $chip)
                        @if(filled($chip))
                            <span>{{ $chip }}</span>
                        @endif
                    @endforeach
                </div>
            @endif
            @if(isset($listing))
                @include('site.partials.booking-offers', ['listing' => $listing, 'searchContext' => $searchContext ?? []])
            @else
                <a href="{{ $href }}" class="button button--ghost">{{ $cta ?? 'View Details' }}</a>
            @endif
        </div>
    </div>
</article>
