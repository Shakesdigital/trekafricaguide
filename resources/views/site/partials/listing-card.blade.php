<article class="listing-card">
    <a href="{{ $href }}" class="listing-card__image">
        <img src="{{ $image }}" alt="{{ $title }}">
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
        <div class="listing-card__footer">
            @if(!empty($chips))
                <div class="chip-row">
                    @foreach($chips as $chip)
                        <span>{{ $chip }}</span>
                    @endforeach
                </div>
            @endif
            <a href="{{ $href }}" class="button button--ghost">View Details</a>
        </div>
    </div>
</article>
