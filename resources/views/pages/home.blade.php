@extends('layouts.travel')

@section('content')
{{-- ═══════ HERO ═══════ --}}
<section class="hero-section">
    <video class="hero-video" autoplay muted loop playsinline poster="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80">
        <source src="{{ $heroVideo }}" type="video/mp4">
    </video>
    <div class="hero-overlay"></div>
    <div class="container hero-content reveal">
        <p class="eyebrow">Your African Travel Directory</p>
        <h1>Trek Africa Guide</h1>
        <p class="tagline">Your complete directory to safaris, lodges, local guides &amp; authentic experiences across Africa.</p>

        <form action="{{ route('destinations.index') }}" method="GET" class="hero-search hero-search--wide">
            <label class="sr-only" for="hero-search">Search destinations, safaris or lodges</label>
            <input id="hero-search" name="q" list="global-search-suggestions" placeholder="Search destinations, safaris or lodges…" required>
            <select name="region" class="hero-region-select">
                <option value="">All Regions</option>
                @foreach($regions as $region)
                    <option value="{{ $region['slug'] }}">{{ $region['name'] }}</option>
                @endforeach
            </select>
            <button type="submit">Explore Africa →</button>
        </form>

        <div class="page-stats">
            <div class="page-stat">
                <strong>5</strong>
                <span>Regions</span>
            </div>
            <div class="page-stat">
                <strong>{{ collect($regions)->pluck('countries')->flatten()->unique()->count() }}</strong>
                <span>Countries</span>
            </div>
            <div class="page-stat">
                <strong>{{ count($featuredDestinations) }}+</strong>
                <span>Destinations</span>
            </div>
            <div class="page-stat">
                <strong>3</strong>
                <span>Booking Partners</span>
            </div>
        </div>
    </div>
</section>

{{-- ═══════ EXPLORE BY REGION ═══════ --}}
<section class="section-block patterned" id="regions-preview">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Explore by Region</p>
            <h2>Five regions, five unforgettable journeys</h2>
            <p>Each region offers distinct landscapes, wildlife, cultures, and travel experiences. Choose a region to start your adventure.</p>
        </div>

        <div class="region-showcase reveal">
            @php
                $regionHighlights = [
                    'north-africa' => 'Sahara & Pyramids',
                    'west-africa' => 'Beaches & Culture',
                    'east-africa' => 'Great Migration',
                    'central-africa' => 'Rainforests & Gorillas',
                    'southern-africa' => 'Big 5 & Victoria Falls',
                ];
            @endphp
            @foreach($regions as $region)
                <a href="{{ route('regions.index') }}#{{ $region['slug'] }}" class="region-showcase-card" data-region-card="{{ $region['slug'] }}">
                    <img src="{{ $region['image'] }}" alt="{{ $region['name'] }}">
                    <div class="region-showcase-overlay"></div>
                    <div class="region-showcase-content">
                        <span class="region-highlight-tag">{{ $regionHighlights[$region['slug']] ?? '' }}</span>
                        <h3>{{ $region['name'] }}</h3>
                        <p>{{ $region['description'] }}</p>
                        <span class="region-showcase-cta">View {{ $region['name'] }} →</span>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════ POPULAR DESTINATIONS (Horizontal Scroller) ═══════ --}}
<section class="section-block" id="popular-destinations">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Popular Destinations</p>
            <h2>Where travelers are heading now</h2>
            <p>Scroll through Africa's most sought-after parks, cities, and hidden gems — from the Maasai Mara to the Namibian dunes.</p>
        </div>
    </div>
    <div class="destination-scroller reveal">
        <div class="destination-scroller-track">
            @foreach($featuredDestinations as $destination)
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

{{-- ═══════ FEATURED SAFARIS ═══════ --}}
<section class="section-block accent-block" id="featured-safaris">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Featured Safaris</p>
            <h2>Handpicked safari experiences across Africa</h2>
            <p>Compare top-rated tours from our trusted partners — TravelPayouts, Viator, and GetYourGuide.</p>
        </div>

        <div class="card-grid cards-2 cards-lg-4">
            @foreach($featuredTours as $tour)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $tour['image'] }}" alt="{{ $tour['title'] }}">
                        <span class="card-badge">{{ ucwords(str_replace('-', ' ', $tour['type'])) }}</span>
                        <span class="card-badge price">{{ $tour['price_from'] }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ ucwords(str_replace('-', ' ', $tour['region'])) }} • {{ $tour['country'] }} • {{ $tour['duration'] }} days</p>
                        <h3>{{ $tour['title'] }}</h3>
                        <div class="pill-row">
                            <span>{{ ucfirst($tour['budget']) }}</span>
                            <span>{{ ucfirst($tour['travel_style']) }}</span>
                        </div>
                        <p class="card-partner">via {{ $tour['partner'] }}</p>
                        <a href="{{ $tour['affiliate_link'] }}" class="btn-primary" target="_blank" rel="noopener">View on {{ $tour['partner'] }} <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @endforeach
        </div>

        <div class="section-cta reveal">
            <a href="{{ route('safaris.index') }}" class="btn-outline btn-outline--light">Browse All Safaris & Tours <span class="btn-icon">→</span></a>
        </div>
    </div>
</section>

{{-- ═══════ INTERACTIVE MAP ═══════ --}}
<section class="section-block patterned" id="africa-map">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Interactive Map</p>
            <h2>Explore Africa's regions at a glance</h2>
            <p>Hover or tap any zone to discover regional highlights, then click to dive deeper.</p>
        </div>

        <div class="region-map-panel reveal">
            <svg class="africa-svg" viewBox="0 0 760 540" aria-labelledby="africa-map-title" role="img">
                <title id="africa-map-title">Interactive map of Africa regions</title>
                <a xlink:href="{{ route('regions.index', ['region' => 'north-africa']) }}#north-africa" class="map-region" data-region="north-africa">
                    <path d="M205 52 L420 54 L505 138 L432 186 L268 168 L180 108 Z"></path>
                    <text x="320" y="122">North</text>
                </a>
                <a xlink:href="{{ route('regions.index', ['region' => 'west-africa']) }}#west-africa" class="map-region" data-region="west-africa">
                    <path d="M131 179 L247 173 L278 311 L200 378 L104 323 L88 242 Z"></path>
                    <text x="177" y="273">West</text>
                </a>
                <a xlink:href="{{ route('regions.index', ['region' => 'east-africa']) }}#east-africa" class="map-region" data-region="east-africa">
                    <path d="M320 190 L466 201 L519 306 L437 377 L351 342 L314 258 Z"></path>
                    <text x="410" y="282">East</text>
                </a>
                <a xlink:href="{{ route('regions.index', ['region' => 'central-africa']) }}#central-africa" class="map-region" data-region="central-africa">
                    <path d="M256 200 L336 194 L356 325 L285 346 L245 301 Z"></path>
                    <text x="293" y="274">Central</text>
                </a>
                <a xlink:href="{{ route('regions.index', ['region' => 'southern-africa']) }}#southern-africa" class="map-region" data-region="southern-africa">
                    <path d="M247 341 L433 383 L394 492 L277 505 L184 429 Z"></path>
                    <text x="308" y="435">Southern</text>
                </a>
            </svg>
            <p>Tap any zone to jump into regional guides, countries, tours, and stays.</p>
        </div>
    </div>
</section>

{{-- ═══════ TRAVEL INSPIRATION (Blog) ═══════ --}}
<section class="section-block" id="travel-inspiration">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Travel Inspiration</p>
            <h2>Planning guides and insider stories</h2>
            <p>Practical advice from experienced travelers and local experts to help you plan smarter Africa trips.</p>
        </div>

        <div class="card-grid cards-3">
            @foreach($latestPosts as $post)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $post['image'] }}" alt="{{ $post['title'] }}">
                        <span class="card-badge">{{ $post['category'] }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $post['read_time'] }} • {{ $post['category'] }}</p>
                        <h3>{{ $post['title'] }}</h3>
                        <p>{{ $post['excerpt'] }}</p>
                        <a href="{{ route('blog.index', ['category' => $post['category']]) }}" class="btn-outline">Read More <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @endforeach
        </div>

        <div class="section-cta reveal">
            <a href="{{ route('blog.index') }}" class="btn-outline">Browse All Travel Guides <span class="btn-icon">→</span></a>
        </div>
    </div>
</section>

{{-- ═══════ LOCAL VOICES ═══════ --}}
<section class="section-block accent-block" id="local-voices">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Local Voices</p>
            <h2>Meet the people behind the experiences</h2>
            <p>African guides, community leaders, and local hosts sharing their stories and welcoming you to their world.</p>
        </div>

        <div class="voices-showcase">
            @foreach($localExperiences as $experience)
                <article class="voice-profile-card reveal">
                    <div class="voice-profile-image">
                        <img src="{{ $experience['image'] }}" alt="{{ $experience['host'] }}">
                    </div>
                    <div class="voice-profile-body">
                        <h3>{{ $experience['host'] }}</h3>
                        <p class="voice-profile-role">{{ ucwords(str_replace('-', ' ', $experience['type'])) }} • {{ $experience['country'] }}</p>
                        <blockquote class="voice-profile-quote">
                            "{{ $experience['bio'] }}"
                        </blockquote>
                        <p class="voice-profile-experience">{{ $experience['name'] }}</p>
                        <a href="{{ route('experiences.index') }}" class="btn-outline btn-outline--sm">Meet {{ explode(' ', $experience['host'])[0] }} <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════ TRUST BAR ═══════ --}}
<section class="trust-bar-section">
    <div class="container">
        <div class="trust-bar reveal">
            <div class="trust-bar-item">
                <div class="trust-bar-icon">🤝</div>
                <div>
                    <strong>Partnered with TravelPayouts</strong>
                    <p>We connect you to globally-trusted booking platforms.</p>
                </div>
            </div>
            <div class="trust-bar-divider"></div>
            <div class="trust-bar-item">
                <div class="trust-bar-icon">🔗</div>
                <div>
                    <strong>We redirect to trusted partners</strong>
                    <p>Every booking button links to verified partner sites.</p>
                </div>
            </div>
            <div class="trust-bar-divider"></div>
            <div class="trust-bar-item">
                <div class="trust-bar-icon">🛡️</div>
                <div>
                    <strong>No direct bookings</strong>
                    <p>We're a directory — you always book safely with the operator.</p>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
