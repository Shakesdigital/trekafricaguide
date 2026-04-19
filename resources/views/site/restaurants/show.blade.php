@extends('layouts.site')

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Restaurants', 'href' => route('restaurants.index')], ['label' => $restaurant->name]]])
        <div class="detail-hero__header">
            <div>
                <p class="eyebrow">{{ $restaurant->country->name }} • {{ $restaurant->cuisine }}</p>
                <h1>{{ $restaurant->name }}</h1>
                <p class="detail-hero__summary">{{ $restaurant->listing_summary }}</p>
                <div class="detail-rating">★ {{ number_format((float) $restaurant->rating, 1) }} <span>{{ number_format($restaurant->review_count) }} reviews</span></div>
            </div>
        </div>
        <div class="gallery-grid gallery-grid--single">
            <img src="{{ $restaurant->hero_image_url }}" alt="{{ $restaurant->name }}">
        </div>
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="detail-section">
                <h2>About this restaurant</h2>
                <p>{{ $restaurant->detail_intro }}</p>
            </div>
            <div class="detail-section">
                <h3>Signature dish</h3>
                <p>{{ $restaurant->signature_dish }}</p>
            </div>
            <div class="detail-section">
                <h3>Practical information</h3>
                <p>{{ $restaurant->practical_info }}</p>
            </div>
            @if($restaurant->attraction)
                <div class="detail-section">
                    <h3>Nearby attraction</h3>
                    <p>This restaurant is recommended for travelers visiting <a href="{{ route('attractions.show', $restaurant->attraction) }}">{{ $restaurant->attraction->name }}</a>.</p>
                </div>
            @endif
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">External booking</p>
                <h3>{{ $restaurant->price_label }}</h3>
                <p>{{ $restaurant->location_name }}</p>
                <a href="{{ $restaurant->booking_url }}" class="button button--full" target="_blank" rel="noopener">Open restaurant partner page</a>
            </div>
        </aside>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby stays</p>
            <h2>Accommodations that pair well</h2>
        </div>
        <div class="listing-grid">
            @foreach($nearbyAccommodations as $stay)
                @include('site.partials.listing-card', [
                    'href' => route('accommodations.show', $stay),
                    'image' => $stay->hero_image_url,
                    'title' => $stay->name,
                    'summary' => $stay->listing_summary,
                    'eyebrow' => $stay->property_type,
                    'rating' => $stay->rating,
                    'reviews' => $stay->review_count,
                    'price' => $stay->price_label,
                    'chips' => [$stay->location_name],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
