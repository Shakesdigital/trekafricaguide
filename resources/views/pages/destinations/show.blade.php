@extends('layouts.travel')

@section('content')
<section class="destination-hero" style="--hero-image:url('{{ $destination['hero_image'] }}');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><a href="{{ route('destinations.index') }}">Destinations</a></li>
            <li><span class="current">{{ $destination['name'] }}</span></li>
        </ul>
        <p class="eyebrow">Destination</p>
        <h1>{{ $destination['name'] }}</h1>
        <p>{{ $destination['summary'] }}</p>
        <div class="hero-chips">
            <a href="{{ route('destinations.index', ['region' => $destination['region']]) }}">{{ ucwords(str_replace('-', ' ', $destination['region'])) }}</a>
            <a href="{{ route('destinations.index', ['country' => $destination['country']]) }}">{{ $destination['country'] }}</a>
            <a href="{{ route('destinations.index', ['price' => $destination['price']]) }}">{{ ucfirst($destination['price']) }}</a>
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Destination brief</h2>
            <p>{{ $destination['brief'] ?? $destination['summary'] }}</p>
            <p><strong>How to get there:</strong> {{ $destination['getting_there'] ?? 'Travel details will be added here as the CMS rollout expands.' }}</p>
            <p><strong>Best time:</strong> {{ $destination['best_time'] ?? 'Seasonal guidance coming soon.' }}</p>
            <div class="quick-links">
                <a href="{{ route('safaris.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Filter Safaris & Tours</a>
                <a href="{{ route('accommodations.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Filter Accommodations</a>
                <a href="{{ route('restaurants.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Filter Restaurants</a>
            </div>
        </article>
        <article class="map-panel reveal">
            <h2>Map</h2>
            <iframe title="{{ $destination['name'] }} map" src="{{ $destination['map_embed_url'] }}" loading="lazy"></iframe>
        </article>
    </div>
</section>

<section class="section-block patterned">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Planning snapshot</p>
            <h2>What this destination is best for</h2>
        </div>
        <div class="card-grid cards-3">
            @forelse($insights as $insight)
                <article class="content-card reveal">
                    <div class="content-card-body">
                        <p class="meta">{{ $insight['label'] }}</p>
                        <h3>{{ $insight['value'] }}</h3>
                    </div>
                </article>
            @empty
                <p class="empty-state">Destination insight cards will appear here as the CMS dataset expands.</p>
            @endforelse
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Safaris & Tours</p>
            <h2>Compare bookable safari and activity options</h2>
            <p>Each CTA redirects to a partner landing page so the traveler can review live inventory and continue with booking on the provider side.</p>
        </div>
        <div class="card-grid cards-3">
            @forelse($tours as $tour)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $tour['image'] }}" alt="{{ $tour['title'] }}">
                        <span class="card-badge">{{ strtoupper($tour['type']) }}</span>
                        <span class="card-badge price">{{ ucfirst($tour['budget']) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $tour['duration'] }} days • {{ $tour['partner'] }}</p>
                        <h3>{{ $tour['title'] }}</h3>
                        <p>From {{ $tour['price_from'] }} • {{ ucfirst($tour['budget']) }} budget</p>
                        <a class="btn-primary" href="{{ $tour['affiliate_link'] }}" target="_blank" rel="noopener">View partner offer <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">No tour cards configured yet for this destination.</p>
            @endforelse
        </div>
    </div>
</section>

<section class="section-block accent-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Where to stay</p>
            <h2>Shortlist lodges, camps, and hotels</h2>
            <p>These listings are organized to help travelers compare style and budget before they leave Trek Africa Guide.</p>
        </div>
        <div class="card-grid cards-3">
            @forelse($accommodations as $accommodation)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $accommodation['image'] }}" alt="{{ $accommodation['name'] }}">
                        <span class="card-badge">{{ ucfirst($accommodation['type']) }}</span>
                        <span class="card-badge price">{{ ucfirst($accommodation['price']) }}</span>
                    </div>
                    <div class="content-card-body">
                        <h3>{{ $accommodation['name'] }}</h3>
                        <p>Nightly from {{ $accommodation['nightly_from'] }}</p>
                        <a class="btn-primary" href="{{ $accommodation['affiliate_link'] }}" target="_blank" rel="noopener">Open stay listing <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">No accommodation cards configured yet for this destination.</p>
            @endforelse
        </div>
    </div>
</section>

<section class="section-block accent-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>What to do</h2>
            <div class="stack-list">
                @forelse($activities as $activity)
                    <div class="list-item">
                        <h3>{{ $activity['title'] }}</h3>
                        <p>{{ $activity['type'] }}</p>
                        <a href="{{ $activity['affiliate_link'] }}" target="_blank" rel="noopener">See booking path →</a>
                    </div>
                @empty
                    <p>Activity profiles will appear here as your directory grows.</p>
                @endforelse
            </div>
        </article>

        <article class="info-panel reveal">
            <h2>Where to eat</h2>
            <div class="stack-list">
                @forelse($restaurants as $restaurant)
                    <div class="list-item">
                        <h3>{{ $restaurant['name'] }}</h3>
                        <p>{{ $restaurant['cuisine'] }} • {{ $restaurant['signature'] }}</p>
                        <a href="{{ $restaurant['affiliate_link'] }}" target="_blank" rel="noopener">Open dining listing →</a>
                    </div>
                @empty
                    <p>Dining recommendations will appear here as the destination dataset expands.</p>
                @endforelse
            </div>
        </article>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Local perspective</p>
            <h2>People and community context</h2>
            <p>Travel works better when travelers understand who is behind the experience, not only what the brochure headline says.</p>
        </div>
        <div class="voices-grid">
            @forelse($localVoices as $voice)
                <div class="voice-card reveal">
                    <img src="{{ $voice['photo'] }}" alt="{{ $voice['name'] }}">
                    <h3>{{ $voice['name'] }}</h3>
                    <p class="meta">{{ $voice['role'] }}</p>
                    <p>{{ $voice['bio'] }}</p>
                </div>
            @empty
                <p class="empty-state">Local guide and community profiles will be published here.</p>
            @endforelse
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Nearby inspiration</p>
            <h2>More in this region</h2>
            <p>Discover other destinations in {{ ucwords(str_replace('-', ' ', $destination['region'])) }} that pair well with {{ $destination['name'] }}.</p>
        </div>
        <div class="card-grid cards-3">
            @foreach($relatedDestinations as $related)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $related['hero_image'] }}" alt="{{ $related['name'] }}">
                    </div>
                    <div class="content-card-body">
                        <h3>{{ $related['name'] }}</h3>
                        <p>{{ $related['summary'] }}</p>
                        <a href="{{ route('destinations.show', $related['slug']) }}" class="btn-outline">View destination <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
@endsection
