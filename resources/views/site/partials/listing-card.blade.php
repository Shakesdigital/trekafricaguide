<article class="listing-card">
    <a href="{{ $href }}" class="listing-card__image">
        @include('site.partials.image-slot', ['image' => $image ?? null, 'alt' => $title, 'class' => 'listing-card__slot'])
    </a>
    <div class="listing-card__body">
        @if(!empty($eyebrow))
            <p class="listing-card__eyebrow">{{ $eyebrow }}</p>
        @endif
        <h3><a href="{{ $href }}">{{ $title }}</a></h3>
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
            <a href="{{ $href }}" class="button button--ghost">{{ $cta ?? 'View Details' }}</a>
        </div>
    </div>
</article>
