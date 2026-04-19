@extends('layouts.site')

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Accommodations', 'href' => route('accommodations.index')], ['label' => $accommodation->name]]])
        <div class="detail-hero__header">
            <div>
                <p class="eyebrow">{{ $accommodation->country->name }} • {{ $accommodation->property_type }}</p>
                <h1>{{ $accommodation->name }}</h1>
                <p class="detail-hero__summary">{{ $accommodation->listing_summary }}</p>
                <div class="detail-rating">★ {{ number_format((float) $accommodation->rating, 1) }} <span>{{ number_format($accommodation->review_count) }} reviews</span></div>
            </div>
        </div>
        <div class="gallery-grid gallery-grid--single">
            <img src="{{ $accommodation->hero_image_url }}" alt="{{ $accommodation->name }}">
        </div>
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="detail-section">
                <h2>About this stay</h2>
                <p>{{ $accommodation->detail_intro }}</p>
            </div>
            <div class="detail-section">
                <h3>Why it works for this route</h3>
                <p>{{ $accommodation->practical_info }}</p>
            </div>
            <div class="detail-section">
                <h3>Amenities</h3>
                <ul class="bullet-list">
                    @foreach($accommodation->amenities ?? [] as $amenity)
                        <li>{{ $amenity }}</li>
                    @endforeach
                </ul>
            </div>
            @if($accommodation->attraction)
                <div class="detail-section">
                    <h3>Best nearby attraction</h3>
                    <p><a href="{{ route('attractions.show', $accommodation->attraction) }}">{{ $accommodation->attraction->name }}</a> is the clearest anchor for this stay.</p>
                </div>
            @endif
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">External booking</p>
                <h3>{{ $accommodation->price_label }}</h3>
                <p>{{ $accommodation->location_name }}</p>
                <a href="{{ $accommodation->booking_url }}" class="button button--full" target="_blank" rel="noopener">Book accommodation</a>
            </div>
        </aside>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby attractions</p>
            <h2>Continue planning around this stay</h2>
        </div>
        <div class="listing-grid">
            @foreach($nearbyAttractions as $attraction)
                @include('site.partials.listing-card', [
                    'href' => route('attractions.show', $attraction),
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => $attraction->country->name,
                    'rating' => $attraction->rating,
                    'reviews' => $attraction->review_count,
                    'price' => $attraction->price_label,
                    'chips' => [$attraction->location_name],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
