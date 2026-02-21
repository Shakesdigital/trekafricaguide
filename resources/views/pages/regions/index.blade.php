@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Regions</span></li>
        </ul>
        <p class="eyebrow">Regions of Africa</p>
        <h1>North, West, East, Central & Southern Africa</h1>
        <p>Browse all five regions, compare countries, and jump directly to destinations, tours, and local experiences.</p>
        <div class="page-stats">
            <div class="page-stat">
                <strong>{{ count($regions) }}</strong>
                <span>Regions</span>
            </div>
            <div class="page-stat">
                <strong>{{ collect($regions)->pluck('countries')->flatten()->unique()->count() }}</strong>
                <span>Countries</span>
            </div>
        </div>
    </div>
</section>

<section class="section-block patterned">
    <div class="container">
        <form class="filter-bar reveal" method="GET" action="{{ route('regions.index') }}">
            <select name="region">
                <option value="">All regions</option>
                @foreach($regionsList as $regionOption)
                    <option value="{{ $regionOption['slug'] }}" @selected(request('region') === $regionOption['slug'])>{{ $regionOption['name'] }}</option>
                @endforeach
            </select>
            <select name="country">
                <option value="">All countries</option>
                @foreach($countriesList as $country)
                    <option value="{{ $country }}" @selected(request('country') === $country)>{{ $country }}</option>
                @endforeach
            </select>
            <select name="price">
                <option value="">Any budget</option>
                <option value="budget" @selected(request('price') === 'budget')>Budget</option>
                <option value="midrange" @selected(request('price') === 'midrange')>Midrange</option>
                <option value="luxury" @selected(request('price') === 'luxury')>Luxury</option>
            </select>
            <select name="safari_type">
                <option value="">Any safari type</option>
                <option value="game-drive" @selected(request('safari_type') === 'game-drive')>Game Drive</option>
                <option value="adventure" @selected(request('safari_type') === 'adventure')>Adventure</option>
                <option value="cultural" @selected(request('safari_type') === 'cultural')>Cultural</option>
            </select>
            <select name="travel_style">
                <option value="">Any travel style</option>
                <option value="wildlife" @selected(request('travel_style') === 'wildlife')>Wildlife</option>
                <option value="community" @selected(request('travel_style') === 'community')>Community</option>
                <option value="adventure" @selected(request('travel_style') === 'adventure')>Adventure</option>
            </select>
            <button type="submit">Apply filters</button>
            <a href="{{ route('regions.index') }}" class="btn-clear">Reset</a>
        </form>

        @php
            $visibleCount = 0;
            foreach ($regions as $region) {
                $countryFilter = request('country');
                $regionFilter = request('region');
                $showRegion = (! $regionFilter || $regionFilter === $region['slug'])
                    && (! $countryFilter || in_array($countryFilter, $region['countries'], true));
                if ($showRegion) $visibleCount++;
            }
        @endphp

        <div class="results-count reveal">
            Showing <strong>{{ $visibleCount }}</strong> region{{ $visibleCount === 1 ? '' : 's' }}
            @if(request('region') || request('country'))
                — <a href="{{ route('regions.index') }}" style="color: var(--terracotta); text-decoration: underline;">clear filters</a>
            @endif
        </div>

        <div class="card-grid cards-2">
            @foreach($regions as $region)
                @php
                    $countryFilter = request('country');
                    $regionFilter = request('region');
                    $showRegion = (! $regionFilter || $regionFilter === $region['slug'])
                        && (! $countryFilter || in_array($countryFilter, $region['countries'], true));
                @endphp
                @if($showRegion)
                    <article class="region-detail-card reveal" id="{{ $region['slug'] }}">
                        <div class="card-image-wrap">
                            <img src="{{ $region['image'] }}" alt="{{ $region['name'] }}">
                            <span class="card-badge">{{ count($region['countries']) }} countries</span>
                        </div>
                        <div class="region-detail-content">
                            <h2>{{ $region['name'] }}</h2>
                            <p>{{ $region['description'] }}</p>
                            <h3>Countries in this region</h3>
                            <ul class="pill-list">
                                @foreach($region['countries'] as $country)
                                    <li>{{ $country }}</li>
                                @endforeach
                            </ul>
                            <a href="{{ route('destinations.index', ['region' => $region['slug']]) }}" class="btn-primary">Explore {{ $region['name'] }} <span class="btn-icon">→</span></a>
                        </div>
                    </article>
                @endif
            @endforeach
        </div>
    </div>
</section>
@endsection
