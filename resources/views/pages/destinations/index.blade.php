@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Destinations</span></li>
        </ul>
        <p class="eyebrow">Destinations</p>
        <h1>Choose a destination only after the region and country fit makes sense</h1>
        <p>Each destination guide is built to answer the planning questions that matter before booking: what the place is really like, how to get there, what to do, where to stay, where to eat, and when it is worth the detour.</p>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Destination Directory</p>
            <h2>Launch focus: East Africa first, then the rest of the continent</h2>
            <p>The strongest launch flow begins with Uganda, Kenya, Tanzania, and Rwanda, then expands into Southern Africa, North Africa, and West Africa so travelers can compare classic safari icons with cities, coastlines, desert routes, and cultural journeys.</p>
        </div>

        <form class="filter-bar reveal" method="GET" action="{{ route('destinations.index') }}">
            <input type="text" name="q" value="{{ $filters['q'] }}" placeholder="Search park, country, city…">
            <select name="region">
                <option value="">All regions</option>
                @foreach($filterOptions['regions'] as $region)
                    <option value="{{ $region['slug'] }}" @selected($filters['region'] === $region['slug'])>{{ $region['name'] }}</option>
                @endforeach
            </select>
            <select name="country">
                <option value="">All countries</option>
                @foreach($filterOptions['countries'] as $country)
                    <option value="{{ $country }}" @selected($filters['country'] === $country)>{{ $country }}</option>
                @endforeach
            </select>
            <select name="price">
                <option value="">Any budget</option>
                @foreach($filterOptions['price'] as $price)
                    <option value="{{ $price }}" @selected($filters['price'] === $price)>{{ ucfirst($price) }}</option>
                @endforeach
            </select>
            <select name="travel_style">
                <option value="">Any travel style</option>
                @foreach($filterOptions['travelStyle'] as $style)
                    <option value="{{ $style }}" @selected($filters['travel_style'] === $style)>{{ ucwords(str_replace('-', ' ', $style)) }}</option>
                @endforeach
            </select>
            <button type="submit">Filter</button>
            <a href="{{ route('destinations.index') }}" class="btn-clear">Reset</a>
        </form>

        <div class="results-count reveal">
            <strong>{{ $destinations->count() }}</strong> destination{{ $destinations->count() === 1 ? '' : 's' }} found
            @if($filters['q'] || $filters['region'] || $filters['country'] || $filters['price'] || $filters['travel_style'])
                — <a href="{{ route('destinations.index') }}" style="color: var(--terracotta); text-decoration: underline;">clear all filters</a>
            @endif
        </div>

        <div class="card-grid cards-3">
            @forelse($destinations as $destination)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $destination['hero_image'] }}" alt="{{ $destination['name'] }}">
                        <span class="card-badge">{{ ucwords(str_replace('-', ' ', $destination['region'])) }}</span>
                        <span class="card-badge price">{{ ucfirst($destination['price']) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $destination['country'] }}</p>
                        <h3>{{ $destination['name'] }}</h3>
                        <p>{{ $destination['brief'] ?? $destination['summary'] }}</p>
                        <div class="pill-row">
                            @foreach($destination['travel_style'] as $style)
                                <span>{{ ucwords(str_replace('-', ' ', $style)) }}</span>
                            @endforeach
                        </div>
                        <div class="quick-links">
                            <a href="{{ route('destinations.show', $destination['slug']) }}">Open guide</a>
                            <a href="{{ route('safaris.index', ['country' => $destination['country']]) }}">Tours in {{ $destination['country'] }}</a>
                            <a href="{{ route('accommodations.index', ['country' => $destination['country']]) }}">Stays in {{ $destination['country'] }}</a>
                        </div>
                    </div>
                </article>
            @empty
                <p class="empty-state">No destinations match this filter set. Try clearing some filters and searching again.</p>
            @endforelse
        </div>
    </div>
</section>
@endsection
