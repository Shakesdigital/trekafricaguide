@extends('layouts.travel')

@section('content')
@php
    $planningNotes = $editorial['planning_notes'] ?? [];
    $samplePlan = $editorial['sample_plan'] ?? [];
    $quickFacts = $editorial['quick_facts'] ?? [];
    $watchouts = $editorial['watchouts'] ?? [];
    $gettingThere = $destination['getting_there'] ?? 'Most travelers reach this stop through '.$destination['country'].' connections and continue by regional flight or road depending on the route shape.';
    $bestTime = $destination['best_time'] ?? 'Timing depends on weather, route logic, and what kind of trip experience you want most, so use the planning notes below to judge fit.';
@endphp

<section class="destination-hero" style="--hero-image:url('{{ $destination['hero_image'] }}');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><a href="{{ route('destinations.index') }}">Destinations</a></li>
            <li><span class="current">{{ $destination['name'] }}</span></li>
        </ul>
        <p class="eyebrow">Destination Guide</p>
        <h1>{{ $destination['name'] }}</h1>
        <p>{{ $destination['summary'] }}</p>
        <div class="hero-chips">
            <a href="{{ route('destinations.index', ['region' => $destination['region']]) }}">{{ ucwords(str_replace('-', ' ', $destination['region'])) }}</a>
            <a href="{{ route('destinations.index', ['country' => $destination['country']]) }}">{{ $destination['country'] }}</a>
            <a href="{{ route('destinations.index', ['price' => $destination['price']]) }}">{{ ucfirst($destination['price']) }}</a>
            @foreach($destination['travel_style'] as $style)
                <a href="{{ route('destinations.index', ['travel_style' => $style]) }}">{{ ucwords(str_replace('-', ' ', $style)) }}</a>
            @endforeach
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Why travelers choose {{ $destination['name'] }}</h2>
            <p>{{ $destination['brief'] ?? $destination['summary'] }}</p>
            <p><strong>How to get there:</strong> {{ $gettingThere }}</p>
            <p><strong>Best time to visit:</strong> {{ $bestTime }}</p>
            <p><strong>How long to stay:</strong> {{ $editorial['stay_length'] ?? 'Plan at least 2 nights if you want the destination to feel worthwhile rather than rushed.' }}</p>
            <div class="quick-links">
                <a href="{{ route('safaris.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Compare tours</a>
                <a href="{{ route('accommodations.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Browse stays</a>
                <a href="{{ route('restaurants.index', ['region' => $destination['region'], 'country' => $destination['country']]) }}">Find dining</a>
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
            <p>Use this section to decide whether {{ $destination['name'] }} really fits the trip you want, or whether it is better as part of a wider route.</p>
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
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Route logic and trip fit</h2>
            <p><strong>Ideal for:</strong> {{ $editorial['ideal_for'] ?? 'Travelers who want a destination with a clear identity and enough substance to shape part of the itinerary.' }}</p>
            <p><strong>Pairs well with:</strong> {{ $editorial['pairs_with'] ?? 'Nearby destinations in the same region, plus one city or coast stop for balance.' }}</p>
            <p><strong>Stay strategy:</strong> {{ $editorial['stay_strategy'] ?? 'Choose your base around transfer times, dawn starts, and what you most want to do early or late in the day.' }}</p>
            <p><strong>Food and atmosphere:</strong> {{ $editorial['food_note'] ?? 'Look beyond the headline activity and use meals, markets, or lodge dining to understand the place more fully.' }}</p>
        </article>
        <article class="info-panel reveal">
            <h2>Quick planning notes</h2>
            <div class="stack-list">
                @forelse($planningNotes as $note)
                    <div class="list-item">
                        <h3>{{ $note['title'] }}</h3>
                        <p>{{ $note['copy'] }}</p>
                    </div>
                @empty
                    <p>Practical notes will appear here as the guide library grows.</p>
                @endforelse
            </div>
        </article>
    </div>
</section>

<section class="section-block accent-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Sample trip shape</p>
            <h2>How this destination usually works best</h2>
            <p>These are not rigid itineraries. They are honest pacing notes to help travelers avoid under-planning or forcing too much into one stop.</p>
        </div>
        <div class="card-grid cards-3">
            @forelse($samplePlan as $stop)
                <article class="content-card reveal">
                    <div class="content-card-body">
                        <p class="meta">{{ $stop['day'] }}</p>
                        <h3>{{ $stop['title'] }}</h3>
                        <p>{{ $stop['copy'] }}</p>
                    </div>
                </article>
            @empty
                <p class="empty-state">A suggested day-by-day rhythm will appear here as the CMS dataset expands.</p>
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
                        <a class="btn-primary" href="{{ $tour['affiliate_link'] }}" target="_blank" rel="noopener">View partner offer <span class="btn-icon">?</span></a>
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
                        <a class="btn-primary" href="{{ $accommodation['affiliate_link'] }}" target="_blank" rel="noopener">Open stay listing <span class="btn-icon">?</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">No accommodation cards configured yet for this destination.</p>
            @endforelse
        </div>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>What to do</h2>
            <div class="stack-list">
                @forelse($activities as $activity)
                    <div class="list-item">
                        <h3>{{ $activity['title'] }}</h3>
                        <p>{{ $activity['type'] }}</p>
                        <a href="{{ $activity['affiliate_link'] }}" target="_blank" rel="noopener">See booking path ?</a>
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
                        <a href="{{ $restaurant['affiliate_link'] }}" target="_blank" rel="noopener">Open dining listing ?</a>
                    </div>
                @empty
                    <p>Dining recommendations will appear here as the destination dataset expands.</p>
                @endforelse
            </div>
        </article>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Need-to-know before booking</h2>
            <div class="stack-list">
                @forelse($quickFacts as $fact)
                    <div class="list-item">
                        <h3>{{ $fact['label'] }}</h3>
                        <p>{{ $fact['copy'] }}</p>
                    </div>
                @empty
                    <p>Practical booking notes will appear here as this destination guide expands.</p>
                @endforelse
            </div>
        </article>
        <article class="info-panel reveal">
            <h2>Common watchouts</h2>
            <div class="stack-list">
                @forelse($watchouts as $watchout)
                    <div class="list-item">
                        <h3>{{ $watchout['title'] }}</h3>
                        <p>{{ $watchout['copy'] }}</p>
                    </div>
                @empty
                    <p>Watchouts on seasonality, transfer times, and booking fit will appear here.</p>
                @endforelse
            </div>
        </article>
    </div>
</section>

<section class="section-block patterned">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Add a local layer</p>
            <h2>Experiences in {{ $destination['country'] }} that pair well with this stop</h2>
            <p>These experiences help travelers add more human context, food, or community-led moments around the main destination.</p>
        </div>
        <div class="card-grid cards-3">
            @forelse($countryExperiences as $experience)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $experience['image'] }}" alt="{{ $experience['name'] }}">
                        <span class="card-badge">{{ ucwords(str_replace('-', ' ', $experience['type'])) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $experience['host'] }}</p>
                        <h3>{{ $experience['name'] }}</h3>
                        <p>{{ $experience['bio'] }}</p>
                        <a class="btn-outline" href="{{ $experience['affiliate_link'] }}" target="_blank" rel="noopener">Open partner path <span class="btn-icon">?</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">Country-level experiences will be listed here as the directory grows.</p>
            @endforelse
        </div>
    </div>
</section>

@if($localVoices->isNotEmpty())
<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Local perspective</p>
            <h2>People and community context</h2>
            <p>Travel works better when travelers understand who is behind the experience, not only what the brochure headline says.</p>
        </div>
        <div class="voices-grid">
            @foreach($localVoices as $voice)
                <div class="voice-card reveal">
                    <img src="{{ $voice['photo'] }}" alt="{{ $voice['name'] }}">
                    <h3>{{ $voice['name'] }}</h3>
                    <p class="meta">{{ $voice['role'] }}</p>
                    <p>{{ $voice['bio'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Read before you book</p>
            <h2>Related travel guides</h2>
            <p>Editorial guidance helps travelers decide whether to route this stop on its own, combine it with another destination, or shift it to a better season.</p>
        </div>
        <div class="card-grid cards-3">
            @forelse($relatedPosts as $post)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $post['image'] }}" alt="{{ $post['title'] }}">
                        <span class="card-badge">{{ $post['category'] }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $post['read_time'] }}</p>
                        <h3>{{ $post['title'] }}</h3>
                        <p>{{ $post['excerpt'] }}</p>
                        <a href="{{ route('blog.index', ['country' => $post['country']]) }}" class="btn-outline">Browse related guides <span class="btn-icon">?</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">Related editorial guides will appear here as the content library expands.</p>
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
                        <a href="{{ route('destinations.show', $related['slug']) }}" class="btn-outline">View destination <span class="btn-icon">?</span></a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
@endsection



