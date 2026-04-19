@extends('layouts.site')

@section('content')
@php
    $hero = $sections['hero'] ?? null;
    $intro = $sections['intro'] ?? null;
@endphp

<section class="hero" style="--hero-image:url('{{ $hero?->image_url }}')">
    <div class="hero__overlay"></div>
    <div class="container hero__content">
        <p class="eyebrow">{{ $hero?->eyebrow }}</p>
        <h1>{{ $hero?->title }}</h1>
        <p class="hero__lead">{{ $hero?->body }}</p>
        <div class="hero__actions">
            <a href="{{ route('regions.index') }}" class="button">Explore Regions</a>
            <a href="{{ route('attractions.index') }}" class="button button--ghost-light">Browse Listings</a>
        </div>
    </div>
</section>

<section class="section">
    <div class="container two-column">
        <div>
            <p class="eyebrow">{{ $intro?->eyebrow }}</p>
            <h2>{{ $intro?->title }}</h2>
            <p>{{ $intro?->body }}</p>
        </div>
        <div class="info-panel">
            <h3>How Trek Africa Guide works</h3>
            <ul class="bullet-list">
                <li>Start with a region and compare the countries that welcome visitors.</li>
                <li>Open a country page to see attractions, tour operators, stays, and restaurants in one place.</li>
                <li>Use listing pages styled like modern travel marketplaces, then continue to an external booking partner when ready.</li>
            </ul>
        </div>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">{{ $sections['featured_regions']?->eyebrow }}</p>
            <h2>{{ $sections['featured_regions']?->title }}</h2>
            <p>{{ $sections['featured_regions']?->body }}</p>
        </div>
        <div class="region-grid">
            @foreach($featuredRegions as $region)
                <a href="{{ route('regions.show', $region) }}" class="region-card">
                    <img src="{{ $region->hero_image_url }}" alt="{{ $region->hero_image_alt }}">
                    <div class="region-card__content">
                        <span>{{ $region->countries_count }} countries</span>
                        <h3>{{ $region->name }}</h3>
                        <p>{{ $region->overview }}</p>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">{{ $sections['featured_attractions']?->eyebrow }}</p>
            <h2>{{ $sections['featured_attractions']?->title }}</h2>
            <p>{{ $sections['featured_attractions']?->body }}</p>
        </div>
        <div class="listing-grid">
            @foreach($featuredAttractions as $attraction)
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

<section class="section section--alt">
    <div class="container triptych">
        <div>
            <div class="section-heading section-heading--compact">
                <p class="eyebrow">{{ $sections['featured_accommodations']?->eyebrow }}</p>
                <h2>{{ $sections['featured_accommodations']?->title }}</h2>
                <p>{{ $sections['featured_accommodations']?->body }}</p>
            </div>
            <div class="stack-grid">
                @foreach($featuredAccommodations as $stay)
                    @include('site.partials.listing-card', [
                        'href' => route('accommodations.show', $stay),
                        'image' => $stay->hero_image_url,
                        'title' => $stay->name,
                        'summary' => $stay->listing_summary,
                        'eyebrow' => $stay->country->name,
                        'rating' => $stay->rating,
                        'reviews' => $stay->review_count,
                        'price' => $stay->price_label,
                        'chips' => [$stay->property_type, $stay->attraction?->name],
                    ])
                @endforeach
            </div>
        </div>
        <div>
            <div class="section-heading section-heading--compact">
                <p class="eyebrow">{{ $sections['featured_restaurants']?->eyebrow }}</p>
                <h2>{{ $sections['featured_restaurants']?->title }}</h2>
                <p>{{ $sections['featured_restaurants']?->body }}</p>
            </div>
            <div class="stack-grid">
                @foreach($featuredRestaurants as $restaurant)
                    @include('site.partials.listing-card', [
                        'href' => route('restaurants.show', $restaurant),
                        'image' => $restaurant->hero_image_url,
                        'title' => $restaurant->name,
                        'summary' => $restaurant->listing_summary,
                        'eyebrow' => $restaurant->country->name,
                        'rating' => $restaurant->rating,
                        'reviews' => $restaurant->review_count,
                        'price' => $restaurant->price_label,
                        'chips' => [$restaurant->cuisine, $restaurant->attraction?->name],
                    ])
                @endforeach
            </div>
        </div>
    </div>
</section>
@endsection
