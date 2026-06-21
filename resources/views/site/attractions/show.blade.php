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
                <div class="detail-rating">&#9733; {{ number_format((float) $attraction->rating, 1) }} <span>{{ number_format($attraction->review_count) }} reviews</span></div>
            </div>
        </div>
        <div class="gallery-grid">
            @foreach($attraction->gallery ?? [$attraction->hero_image_url] as $image)
                @include('site.partials.image-slot', ['image' => $image, 'alt' => $attraction->name, 'class' => 'gallery-grid__slot'])
            @endforeach
        </div>
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="detail-section">
                <h2>About this attraction</h2>
                <div class="rich-text">{!! $attraction->detail_intro !!}</div>
            </div>
            <div class="detail-section">
                <h3>How to get there</h3>
                <div class="rich-text">{!! $attraction->getting_there !!}</div>
            </div>
            <div class="detail-section">
                <h3>Best time to visit</h3>
                <div class="rich-text">{!! $attraction->best_time !!}</div>
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
                <div class="rich-text">{!! $attraction->practical_info !!}</div>
            </div>
            <div class="detail-section">
                <h3>Full description</h3>
                <div class="rich-text">{!! $attraction->full_description !!}</div>
            </div>
            <div class="detail-section">
                <h3>Tour operators active here</h3>
                <div class="stack-grid">
                    @foreach($attraction->tourOperators as $operator)
                        <article class="mini-card">
                            <h4>{{ $operator->name }}</h4>
                            <div class="rich-text">{!! $operator->summary !!}</div>
                            <a href="{{ $operator->booking_url }}" class="button button--ghost" target="_blank" rel="noopener">Operator booking page</a>
                        </article>
                    @endforeach
                </div>
            </div>
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Booking path</p>
                <h3>{{ $attraction->price_label }}</h3>
                <p>{{ $attraction->location_name }}</p>
                <a href="{{ $attraction->booking_url }}" class="button button--full" target="_blank" rel="noopener">Check partner options</a>
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
