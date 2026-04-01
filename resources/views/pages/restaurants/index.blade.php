@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Eat & Drink</span></li>
        </ul>
        <p class="eyebrow">Restaurants & Dining</p>
        <h1>Find dining that adds context to the trip, not just a meal stop</h1>
        <p>Use destination-aware dining recommendations to help travelers understand local food culture, lodge dining, and practical places to eat between activities.</p>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <form class="filter-bar reveal" method="GET" action="{{ route('restaurants.index') }}">
            <input type="text" name="q" value="{{ $filters['q'] }}" placeholder="Search restaurant, cuisine, or country...">
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
            <button type="submit">Apply</button>
            <a href="{{ route('restaurants.index') }}" class="btn-clear">Reset</a>
        </form>

        <div class="results-count reveal">
            <strong>{{ $restaurants->count() }}</strong> dining listing{{ $restaurants->count() === 1 ? '' : 's' }} available
        </div>

        <div class="card-grid cards-3">
            @forelse($restaurants as $restaurant)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $restaurant['image'] }}" alt="{{ $restaurant['name'] }}">
                        <span class="card-badge">{{ $restaurant['country'] }}</span>
                        <span class="card-badge price">{{ ucfirst($restaurant['price']) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ ucwords(str_replace('-', ' ', $restaurant['region'])) }} • {{ $restaurant['cuisine'] }}</p>
                        <h3>{{ $restaurant['name'] }}</h3>
                        <p>{{ $restaurant['summary'] }}</p>
                        <div class="pill-row">
                            <span>{{ $restaurant['signature'] }}</span>
                        </div>
                        <a href="{{ route('destinations.show', $restaurant['destination_slug']) }}" class="btn-outline">Open destination page <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">No restaurant listings match the current filters.</p>
            @endforelse
        </div>
    </div>
</section>
@endsection
