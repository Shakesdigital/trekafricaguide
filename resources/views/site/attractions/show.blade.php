@extends('layouts.site')

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Attractions', 'href' => route('attractions.index')], ['label' => $attraction->name]]])
        <div class="detail-hero__header">
            <div>
                <p class="eyebrow">{{ $attraction->country->name }} • {{ $attraction->region->name }}</p>
                <h1>{{ $attraction->name }}</h1>
                <p class="detail-hero__summary">{{ $attraction->listing_summary }}</p>
                <div class="detail-rating">★ {{ number_format((float) $attraction->rating, 1) }} <span>{{ number_format($attraction->review_count) }} reviews</span></div>
            </div>
        </div>
        <div class="gallery-grid">
            @foreach($attraction->gallery ?? [$attraction->hero_image_url] as $image)
                <img src="{{ $image }}" alt="{{ $attraction->name }}">
            @endforeach
        </div>
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="detail-section">
                <h2>About this attraction</h2>
                <p>{{ $attraction->detail_intro }}</p>
            </div>
            <div class="detail-section">
                <h3>How to get there</h3>
                <p>{{ $attraction->getting_there }}</p>
            </div>
            <div class="detail-section">
                <h3>Best time to visit</h3>
                <p>{{ $attraction->best_time }}</p>
            </div>
            <div class="detail-section">
                <h3>Highlights</h3>
                <ul class="bullet-list">
                    @foreach($attraction->highlights ?? [] as $highlight)
                        <li>{{ $highlight }}</li>
                    @endforeach
                </ul>
            </div>
            <div class="detail-section">
                <h3>Practical information</h3>
                <p>{{ $attraction->practical_info }}</p>
            </div>
            <div class="detail-section">
                <h3>Full description</h3>
                <p>{{ $attraction->full_description }}</p>
            </div>
            <div class="detail-section">
                <h3>Tour operators active here</h3>
                <div class="stack-grid">
                    @foreach($attraction->tourOperators as $operator)
                        <article class="mini-card">
                            <h4>{{ $operator->name }}</h4>
                            <p>{{ $operator->summary }}</p>
                            <a href="{{ $operator->booking_url }}" class="button button--ghost" target="_blank" rel="noopener">Operator booking page</a>
                        </article>
                    @endforeach
                </div>
            </div>
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Partner booking</p>
                <h3>{{ $attraction->price_label }}</h3>
                <p>{{ $attraction->location_name }}</p>
                <a href="{{ $attraction->booking_url }}" class="button button--full" target="_blank" rel="noopener">Book with partner</a>
            </div>
        </aside>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby stays</p>
            <h2>Accommodations near {{ $attraction->name }}</h2>
        </div>
        <div class="listing-grid">
            @foreach($accommodations as $stay)
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

<section class="section">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby dining</p>
            <h2>Restaurants near {{ $attraction->name }}</h2>
        </div>
        <div class="listing-grid">
            @foreach($restaurants as $restaurant)
                @include('site.partials.listing-card', [
                    'href' => route('restaurants.show', $restaurant),
                    'image' => $restaurant->hero_image_url,
                    'title' => $restaurant->name,
                    'summary' => $restaurant->listing_summary,
                    'eyebrow' => $restaurant->cuisine,
                    'rating' => $restaurant->rating,
                    'reviews' => $restaurant->review_count,
                    'price' => $restaurant->price_label,
                    'chips' => [$restaurant->signature_dish],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
