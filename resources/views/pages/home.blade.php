@extends('layouts.travel')

@section('content')
@php
    $focusCountries = [
        ['name' => 'Uganda', 'description' => 'For Murchison Falls, Bwindi gorilla trekking, chimp tracking, and classic overland value.', 'route' => route('destinations.index', ['country' => 'Uganda'])],
        ['name' => 'Kenya', 'description' => 'For first-time safaris, migration circuits, Amboseli elephants, and fast access from Nairobi.', 'route' => route('destinations.index', ['country' => 'Kenya'])],
        ['name' => 'Tanzania', 'description' => 'For Serengeti scale, northern circuit drama, and strong safari-plus-beach combinations.', 'route' => route('destinations.index', ['country' => 'Tanzania'])],
        ['name' => 'Rwanda', 'description' => 'For premium gorilla trekking, short country transfers, and polished conservation-led itineraries.', 'route' => route('destinations.index', ['country' => 'Rwanda'])],
    ];

    $journeySteps = [
        ['title' => 'Choose a region', 'copy' => 'Start with East Africa if you want the most intuitive first safari planning path.'],
        ['title' => 'Compare countries', 'copy' => 'Move from regional inspiration into Uganda, Kenya, Tanzania, or Rwanda depending on your goals.'],
        ['title' => 'Open a destination', 'copy' => 'See the area brief, how to get there, activities, stays, dining, and affiliate booking options in one place.'],
    ];

    $launchDestinations = collect($featuredDestinations)->filter(fn ($destination) => in_array($destination['country'], ['Uganda', 'Kenya', 'Tanzania', 'Rwanda'], true))->values();
@endphp

<section class="hero-section hero-section--minimal" style="--hero-image:url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80');">
    <div class="hero-overlay"></div>
    <div class="container hero-content reveal">
        <p class="eyebrow">Africa Travel Guide</p>
        <h1>Discover Africa one region, country, and destination at a time.</h1>
        <p class="tagline">Trek Africa Guide is evolving into a Supabase-powered travel CMS and directory designed around how travelers really plan: start broad, compare countries, open a destination, then explore what to do, where to stay, where to eat, and where to book.</p>

        <form action="{{ route('destinations.index') }}" method="GET" class="hero-search hero-search--wide">
            <label class="sr-only" for="hero-search">Search destinations, countries, or parks</label>
            <input id="hero-search" name="q" list="global-search-suggestions" placeholder="Search Murchison Falls, Maasai Mara, Uganda, Kenya..." required>
            <select name="region" class="hero-region-select">
                <option value="">All regions</option>
                @foreach($regions as $region)
                    <option value="{{ $region['slug'] }}">{{ $region['name'] }}</option>
                @endforeach
            </select>
            <button type="submit">Start exploring</button>
        </form>

        <div class="page-stats">
            <div class="page-stat">
                <strong>{{ collect($regions)->count() }}</strong>
                <span>Regions</span>
            </div>
            <div class="page-stat">
                <strong>4</strong>
                <span>Launch countries</span>
            </div>
            <div class="page-stat">
                <strong>{{ collect($featuredTours)->count() + collect($featuredStays)->count() + collect($featuredRestaurants)->count() }}</strong>
                <span>Seeded listings</span>
            </div>
            <div class="page-stat">
                <strong>3</strong>
                <span>Partner channels</span>
            </div>
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Planning Flow</p>
            <h2>A simpler structure for a comprehensive travel directory</h2>
            <p>The site now prioritizes East Africa as the launch path, then narrows from country to destination to practical planning details and affiliate booking calls to action.</p>
        </div>

        <div class="card-grid cards-3">
            @foreach($journeySteps as $step)
                <article class="content-card reveal">
                    <div class="content-card-body">
                        <p class="meta">Step {{ $loop->iteration }}</p>
                        <h3>{{ $step['title'] }}</h3>
                        <p>{{ $step['copy'] }}</p>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>

<section class="section-block patterned">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Launch Region</p>
            <h2>Begin with East Africa</h2>
            <p>East Africa is the strongest starting point for first-time safari planning and for travelers who want a mix of wildlife, culture, and accessible routing.</p>
        </div>

        <div class="region-showcase reveal">
            @foreach($focusCountries as $country)
                <a href="{{ $country['route'] }}" class="region-showcase-card">
                    <div class="region-showcase-overlay"></div>
                    <div class="region-showcase-content">
                        <span class="region-highlight-tag">Most visited</span>
                        <h3>{{ $country['name'] }}</h3>
                        <p>{{ $country['description'] }}</p>
                        <span class="region-showcase-cta">Open {{ $country['name'] }} guides →</span>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<section class="section-block" id="popular-destinations">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Launch Destinations</p>
            <h2>Open destination pages with real planning context</h2>
            <p>Each destination page is designed to lead with the essentials: what makes the place special, how to get there, what to do, where to stay, where to eat, and where to click when you are ready to book.</p>
        </div>
    </div>
    <div class="destination-scroller reveal">
        <div class="destination-scroller-track">
            @foreach($launchDestinations as $destination)
                <a href="{{ route('destinations.show', $destination['slug']) }}" class="destination-scroller-card">
                    <img src="{{ $destination['hero_image'] }}" alt="{{ $destination['name'] }}">
                    <div class="destination-scroller-overlay"></div>
                    <div class="destination-scroller-info">
                        <span class="destination-scroller-country">{{ $destination['country'] }}</span>
                        <h3>{{ $destination['name'] }}</h3>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<section class="section-block accent-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Bookable Layers</p>
            <h2>Compare tours, stays, and dining before leaving the site</h2>
            <p>The content model now supports layered directory exploration rather than a single flat list of affiliate cards.</p>
        </div>

        <div class="card-grid cards-3">
            @foreach($featuredTours as $tour)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $tour['image'] }}" alt="{{ $tour['title'] }}">
                        <span class="card-badge">{{ ucwords(str_replace('-', ' ', $tour['type'])) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $tour['country'] }} • {{ $tour['duration'] }} days</p>
                        <h3>{{ $tour['title'] }}</h3>
                        <p>From {{ $tour['price_from'] }} via {{ $tour['partner'] }}</p>
                        <a href="{{ $tour['affiliate_link'] }}" class="btn-primary" target="_blank" rel="noopener">View partner offer <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @endforeach
        </div>

        <div class="card-grid cards-2" style="margin-top: 1.2rem;">
            @foreach($featuredStays as $stay)
                <article class="content-card reveal">
                    <div class="content-card-body">
                        <p class="meta">{{ $stay['country'] }} • {{ ucwords(str_replace('-', ' ', $stay['type'])) }}</p>
                        <h3>{{ $stay['name'] }}</h3>
                        <p>Nightly from {{ $stay['nightly_from'] }}</p>
                        <a href="{{ $stay['affiliate_link'] }}" class="btn-outline" target="_blank" rel="noopener">Open stay listing <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Where to eat matters too</h2>
            <p>Destination pages now support restaurant and dining recommendations so travelers can understand the broader experience, not just the headline safari product.</p>
            <div class="stack-list">
                @foreach($featuredRestaurants as $restaurant)
                    <div class="list-item">
                        <h3>{{ $restaurant['name'] }}</h3>
                        <p>{{ $restaurant['country'] }} • {{ $restaurant['cuisine'] }}</p>
                        <a href="{{ route('restaurants.index', ['country' => $restaurant['country']]) }}">See dining in {{ $restaurant['country'] }} →</a>
                    </div>
                @endforeach
            </div>
        </article>

        <article class="info-panel reveal">
            <h2>Editorial insight stays close to the booking path</h2>
            <p>Travel guides are no longer an isolated blog. They are part of the planning workflow, helping travelers choose a region, compare countries, and avoid weak-fit itineraries before they click out to a partner.</p>
            <div class="stack-list">
                @foreach($latestPosts as $post)
                    <div class="list-item">
                        <h3>{{ $post['title'] }}</h3>
                        <p>{{ $post['excerpt'] }}</p>
                        <a href="{{ route('blog.index', ['category' => $post['category']]) }}">Read {{ $post['category'] }} guides →</a>
                    </div>
                @endforeach
            </div>
        </article>
    </div>
</section>

<section class="trust-bar-section">
    <div class="container">
        <div class="trust-bar reveal">
            <div class="trust-bar-item">
                <div>
                    <strong>Supabase CMS direction</strong>
                    <p>The new content architecture is organized for a CMS-backed rollout with regions, countries, destinations, listings, and guides.</p>
                </div>
            </div>
            <div class="trust-bar-divider"></div>
            <div class="trust-bar-item">
                <div>
                    <strong>Affiliate-first transparency</strong>
                    <p>Calls to action send users to partner landing pages after they compare options inside Trek Africa Guide.</p>
                </div>
            </div>
            <div class="trust-bar-divider"></div>
            <div class="trust-bar-item">
                <div>
                    <strong>Honest travel context</strong>
                    <p>Destination pages are built to explain fit, access, and tradeoffs rather than push generic packages.</p>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
