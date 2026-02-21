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
            <h2>Overview</h2>
            <p>{{ $destination['summary'] }}</p>
            <p>Use Trek Africa Guide filters to compare region, country, budget, safari type, and travel style before booking via partner platforms.</p>
            <div class="quick-links">
                <a href="{{ route('safaris.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Filter Safaris & Tours</a>
                <a href="{{ route('accommodations.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Filter Accommodations</a>
                <a href="{{ route('experiences.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Filter Local Experiences</a>
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
            <p class="eyebrow">Safaris & Tours</p>
            <h2>Affiliate tour cards</h2>
            <p>Compare trusted safari packages from our booking partners for {{ $destination['name'] }}.</p>
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
                        <p>From {{ $tour['price_from'] }}</p>
                        <a class="btn-primary" href="{{ $tour['affiliate_link'] }}" target="_blank" rel="noopener">Book via Partner <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">No tour cards configured yet for this destination.</p>
            @endforelse
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Accommodations</p>
            <h2>Hotels and lodges via TravelPayouts</h2>
        </div>
        <div class="widget-placeholder reveal">
            <h3>TravelPayouts Hotel Widget Placeholder</h3>
            <p>Embed your widget script here, then pass destination/country params dynamically.</p>
            <code>@{{travelpayouts-link}}</code>
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
                        <a class="btn-primary" href="{{ $accommodation['affiliate_link'] }}" target="_blank" rel="noopener">Book via Partner <span class="btn-icon">→</span></a>
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
            <h2>Activities & Local Services</h2>
            <div class="stack-list">
                @forelse($activities as $activity)
                    <div class="list-item">
                        <h3>{{ $activity['title'] }}</h3>
                        <p>{{ $activity['type'] }}</p>
                        <a href="{{ $activity['affiliate_link'] }}" target="_blank" rel="noopener">Book via Partner →</a>
                    </div>
                @empty
                    <p>Activity profiles will appear here as your directory grows.</p>
                @endforelse
            </div>
        </article>

        <article class="info-panel reveal">
            <h2>Local Voices</h2>
            <div class="voices-grid">
                @forelse($localVoices as $voice)
                    <div class="voice-card">
                        <img src="{{ $voice['photo'] }}" alt="{{ $voice['name'] }}">
                        <h3>{{ $voice['name'] }}</h3>
                        <p class="meta">{{ $voice['role'] }}</p>
                        <p>{{ $voice['bio'] }}</p>
                    </div>
                @empty
                    <p>Local guide and community profiles will be published here.</p>
                @endforelse
            </div>
        </article>
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
