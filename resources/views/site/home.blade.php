@extends('layouts.site')

@section('content')
@php
    $hero = $sections['hero'] ?? null;
    $intro = $sections['intro'] ?? null;
    $heroSlides = collect($hero?->meta['slides'] ?? [])->values();
@endphp

<section class="hero hero--carousel">
    <div class="hero-carousel" data-hero-carousel>
        @forelse($heroSlides as $index => $slide)
            <div class="hero-carousel__slide @if($index === 0) is-active @endif" data-hero-slide>
                @include('site.partials.image-slot', [
                    'image' => 'image-slot:'.($slide['image_slot'] ?? 'home-hero'),
                    'alt' => ($slide['region'] ?? 'Africa').' hero image slot',
                    'class' => 'hero-carousel__slot',
                ])
            </div>
        @empty
            <div class="hero-carousel__slide is-active" data-hero-slide>
                @include('site.partials.image-slot', ['image' => $hero?->image_url, 'alt' => 'Homepage hero image slot', 'class' => 'hero-carousel__slot'])
            </div>
        @endforelse
    </div>
    <div class="hero__overlay"></div>
    <div class="container hero__content">
        <p class="eyebrow" data-hero-region>{{ $heroSlides->first()['region'] ?? $hero?->eyebrow }}</p>
        <h1 data-hero-title>Plan Africa trips by destination, attraction, stay, and dining route.</h1>
        <p class="hero__lead" data-hero-body>{{ $heroSlides->first()['body'] ?? $hero?->body }}</p>
        @include('site.partials.search-ribbon', ['mode' => 'attractions'])

        <div class="hero__actions">
            <a href="{{ route('regions.index') }}" class="button">Explore Regions</a>

        </div>
        @if($heroSlides->count() > 1)
            <div class="hero-carousel__controls" aria-label="Homepage region carousel">
                @foreach($heroSlides as $index => $slide)
                    <button type="button" class="@if($index === 0) is-active @endif" data-hero-dot data-region="{{ $slide['region'] }}" data-title="{{ $slide['title'] }}" data-body="{{ $slide['body'] }}" aria-label="Show {{ $slide['region'] }}"></button>
                @endforeach
            </div>
        @endif
    </div>
</section>

<section class="section section--alt">
    <div class="container trip-finder">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Trip-Fit Finder</p>
            <h2>Start with the decision that shapes the route.</h2>
            <p>Choose a travel style, region, budget level, and realistic trip length before comparing individual listings.</p>
        </div>
        <div class="trip-finder__steps">
            <div class="trip-step">
                <strong>1. Travel style</strong>
                <p>Safari, primates, beach, heritage, desert, food, family, or city-and-coast.</p>
            </div>
            <div class="trip-step">
                <strong>2. Region or country</strong>
                <p>Match the mood first, then open the country guide that fits your time and comfort level.</p>
            </div>
            <div class="trip-step">
                <strong>3. Budget level</strong>
                <p>Compare budget, comfortable mid-range, and luxury choices by route value, not just nightly rate.</p>
            </div>
            <div class="trip-step">
                <strong>4. Trip length</strong>
                <p>Use 3-5 days for one anchor, 7-10 days for a real circuit, and 11+ days for deeper pacing.</p>
            </div>
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
                <li>Begin with the part of Africa that matches your travel style: safari, coast, culture, desert, food, heritage, or a mix of several.</li>
                <li>Open a destination guide to see the attractions, stays, restaurants, and operators that make sense together.</li>
                <li>Compare the practical details first, then continue to an external booking partner when a listing is worth a closer look.</li>
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
                    @include('site.partials.image-slot', ['image' => $region->hero_image_url, 'alt' => $region->hero_image_alt, 'class' => 'region-card__slot'])
                    <div class="region-card__content">
                        <span>{{ $region->countries_count }} destination countries</span>
                        <h3>{{ $region->name }}</h3>
                        <p>{{ \Illuminate\Support\Str::limit(strip_tags($region->overview), 160) }}</p>
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
                    'href' => route('attractions.show', $attraction), 'listing' => $attraction,
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => $attraction->country->name,
                    'rating' => $attraction->rating,
                    'reviews' => $attraction->review_count,
                    'price' => $attraction->price_label,
                    'chips' => [$attraction->location_name, 'Route anchor'],
                    'facts' => [
                        'Time' => '1-3 days',
                        'Demand' => str_contains(strtolower($attraction->detail_intro), 'trek') ? 'Demanding' : 'Moderate',
                        'Season' => \Illuminate\Support\Str::limit(strip_tags($attraction->best_time), 42),
                        'Verify' => 'Permits/rates',
                    ],
                    'cta' => 'Plan visit',
                ])
            @endforeach
        </div>
        <div class="section-cta">
            <a href="{{ route('attractions.index') }}" class="button">View more attractions</a>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Route Collections</p>
            <h2>Planner-friendly routes to compare first.</h2>
            <p>These are not fixed packages. They are practical starting shapes for matching attractions, stays, meals, transfers, and booking checks.</p>
        </div>
        <div class="route-collection-grid">
            @foreach([
                ['title' => '7-10 day Uganda primates and safari', 'body' => 'Entebbe, Kibale, Queen Elizabeth, Bwindi, and a softer final lake or city night.', 'href' => route('countries.show', 'uganda')],
                ['title' => 'Kenya first safari route', 'body' => 'Nairobi, Maasai Mara or a conservancy, Amboseli, and an optional coast extension.', 'href' => route('countries.show', 'kenya')],
                ['title' => 'Tanzania northern circuit and Zanzibar', 'body' => 'Arusha, Serengeti, Ngorongoro, and a beach finish when time allows.', 'href' => route('countries.show', 'tanzania')],
                ['title' => 'Cape Town, Winelands, and safari', 'body' => 'City, coast, food, wine country, and a guided or self-drive safari add-on.', 'href' => route('countries.show', 'south-africa')],
                ['title' => 'Morocco medina, Atlas, and desert', 'body' => 'Marrakech, riad stays, Atlas foothills, and a realistic multi-day Sahara route.', 'href' => route('countries.show', 'morocco')],
            ] as $route)
                <article class="route-card">
                    <h3>{{ $route['title'] }}</h3>
                    <p>{{ $route['body'] }}</p>
                    <a href="{{ $route['href'] }}" class="button button--ghost">Open route guide</a>
                </article>
            @endforeach
        </div>
    </div>
</section>

<section class="section section--alt">
    <div class="container featured-carousel-section">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">{{ $sections['featured_accommodations']?->eyebrow }}</p>
            <h2>{{ $sections['featured_accommodations']?->title }}</h2>
            <p>{{ $sections['featured_accommodations']?->body }}</p>
        </div>
        <div class="listing-carousel" data-listing-carousel>
            <button class="listing-carousel__button" type="button" data-carousel-prev aria-label="Previous featured stays">&lsaquo;</button>
            <div class="listing-carousel__track" data-carousel-track>
                @foreach($featuredAccommodations as $stay)
                    <div class="listing-carousel__item">
                        @include('site.partials.listing-card', [
                            'href' => route('accommodations.show', $stay), 'listing' => $stay,
                            'image' => $stay->hero_image_url,
                            'title' => $stay->name,
                            'summary' => $stay->listing_summary,
                            'eyebrow' => $stay->country->name,
                            'rating' => $stay->rating,
                            'reviews' => $stay->review_count,
                            'price' => $stay->price_label,
                            'chips' => [$stay->property_type, $stay->attraction?->name],
                            'facts' => [
                                'Best for' => str_contains(strtolower($stay->practical_info), 'sector') ? 'Permit-day logistics' : 'Route comfort',
                                'Meal plan' => 'Verify basis',
                                'Nearby' => $stay->attraction?->name,
                                'Transfer' => 'Check access',
                            ],
                            'cta' => 'View route fit',
                        ])
                    </div>
                @endforeach
            </div>
            <button class="listing-carousel__button" type="button" data-carousel-next aria-label="Next featured stays">&rsaquo;</button>
        </div>
        <div class="section-cta">
            <a href="{{ route('accommodations.index') }}" class="button">View more accommodations</a>
        </div>
    </div>
</section>

<section class="section">
    <div class="container featured-carousel-section">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">{{ $sections['featured_restaurants']?->eyebrow }}</p>
            <h2>{{ $sections['featured_restaurants']?->title }}</h2>
            <p>{{ $sections['featured_restaurants']?->body }}</p>
        </div>
        <div class="listing-carousel" data-listing-carousel>
            <button class="listing-carousel__button" type="button" data-carousel-prev aria-label="Previous featured restaurants">&lsaquo;</button>
            <div class="listing-carousel__track" data-carousel-track>
                @foreach($featuredRestaurants as $restaurant)
                    <div class="listing-carousel__item">
                        @include('site.partials.listing-card', [
                            'href' => route('restaurants.show', $restaurant), 'listing' => $restaurant,
                            'image' => $restaurant->hero_image_url,
                            'title' => $restaurant->name,
                            'summary' => $restaurant->listing_summary,
                            'eyebrow' => $restaurant->country->name,
                            'rating' => $restaurant->rating,
                            'reviews' => $restaurant->review_count,
                            'price' => $restaurant->price_label,
                            'chips' => [$restaurant->cuisine, $restaurant->attraction?->name],
                            'facts' => [
                                'Meal role' => str_contains(strtolower($restaurant->cuisine), 'lodge') || str_contains(strtolower($restaurant->cuisine), 'camp') ? 'Stay-based meal' : 'Dining stop',
                                'Cuisine' => $restaurant->cuisine,
                                'Reserve' => 'Verify hours',
                                'Pairs with' => $restaurant->attraction?->name,
                            ],
                            'cta' => 'View dining',
                        ])
                    </div>
                @endforeach
            </div>
            <button class="listing-carousel__button" type="button" data-carousel-next aria-label="Next featured restaurants">&rsaquo;</button>
        </div>
        <div class="section-cta">
            <a href="{{ route('restaurants.index') }}" class="button">View more restaurants</a>
        </div>
    </div>
</section>

<section class="section section--alt">
    <div class="container trust-band">
        <div>
            <p class="eyebrow">Booking Confidence</p>
            <h2>Use Trek Africa Guide to compare fit before you pay elsewhere.</h2>
            <p>We do not take payment here. Always verify live rates, permit availability, inclusions, cancellation terms, transfers, meal plans, and guide requirements on the partner or provider site.</p>
        </div>
        <div class="chip-row">
            <span>No payment taken here</span>
            <span>Rates checked on partner sites</span>
            <span>Permits and availability must be verified</span>
            <span>Route logic over generic lists</span>
        </div>
    </div>
</section>
@endsection
