@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Safaris & Tours</span></li>
        </ul>
        <p class="eyebrow">Safaris & Tours</p>
        <h1>Compare tours after you understand the destination fit</h1>
        <p>This section now works as the commercial comparison layer beneath regions, countries, and destination guides, with each CTA redirecting to a booking partner.</p>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Partner Offers</p>
            <h2>Browse the bookable side of the directory</h2>
            <p>Use the filters to narrow by geography, experience type, travel style, and trip length before moving out to partner landing pages.</p>
        </div>

        <form class="filter-bar reveal" method="GET" action="{{ route('safaris.index') }}">
            <input type="text" name="q" value="{{ $filters['q'] }}" placeholder="Search safari by title or country…">
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
            <select name="safari_type">
                <option value="">Any safari type</option>
                @foreach($filterOptions['safariType'] as $type)
                    <option value="{{ $type }}" @selected($filters['safari_type'] === $type)>{{ ucwords(str_replace('-', ' ', $type)) }}</option>
                @endforeach
            </select>
            <select name="travel_style">
                <option value="">Any travel style</option>
                @foreach($filterOptions['travelStyle'] as $style)
                    <option value="{{ $style }}" @selected($filters['travel_style'] === $style)>{{ ucwords(str_replace('-', ' ', $style)) }}</option>
                @endforeach
            </select>
            <select name="duration">
                <option value="">Any duration</option>
                <option value="short" @selected($filters['duration'] === 'short')>Short (1–3 days)</option>
                <option value="medium" @selected($filters['duration'] === 'medium')>Medium (4–6 days)</option>
                <option value="long" @selected($filters['duration'] === 'long')>Long (7+ days)</option>
            </select>
            <button type="submit">Apply</button>
            <a href="{{ route('safaris.index') }}" class="btn-clear">Reset</a>
        </form>

        <div class="results-count reveal">
            <strong>{{ $tours->count() }}</strong> tour{{ $tours->count() === 1 ? '' : 's' }} available
        </div>

        <div class="card-grid cards-3">
            @forelse($tours as $tour)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $tour['image'] }}" alt="{{ $tour['title'] }}">
                        <span class="card-badge">{{ ucwords(str_replace('-', ' ', $tour['type'])) }}</span>
                        <span class="card-badge price">{{ ucfirst($tour['budget']) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ ucwords(str_replace('-', ' ', $tour['region'])) }} • {{ $tour['country'] }}</p>
                        <h3>{{ $tour['title'] }}</h3>
                        <div class="pill-row">
                            <span>{{ $tour['duration'] }} days</span>
                            <span>{{ ucfirst($tour['travel_style']) }}</span>
                        </div>
                        <p>From {{ $tour['price_from'] }} via {{ $tour['partner'] }}</p>
                        <div class="quick-links">
                            <a href="{{ route('destinations.show', $tour['destination_slug']) }}">Open destination guide</a>
                            <a href="{{ $tour['affiliate_link'] }}" target="_blank" rel="noopener">View partner offer</a>
                        </div>
                    </div>
                </article>
            @empty
                <p class="empty-state">No tours match these filters. Try broadening budget or region.</p>
            @endforelse
        </div>
    </div>
</section>
@endsection
