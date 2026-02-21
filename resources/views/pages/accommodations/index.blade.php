@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Accommodations</span></li>
        </ul>
        <p class="eyebrow">Accommodations</p>
        <h1>Find lodges, camps, and hotels by region</h1>
        <p>Compare curated stays and route bookings to partner hotel engines.</p>
    </div>
</section>

<section class="section-block patterned">
    <div class="container">
        <div class="widget-placeholder reveal">
            <h2>TravelPayouts Hotel Search Widget</h2>
            <p>Embed the official widget snippet here. Destination and date parameters can be injected from filters.</p>
            <code>@{{travelpayouts-link}}</code>
        </div>

        <form class="filter-bar reveal" method="GET" action="{{ route('accommodations.index') }}">
            <input type="text" name="q" value="{{ $filters['q'] }}" placeholder="Search stay by name, country, style…">
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
            <button type="submit">Apply</button>
            <a href="{{ route('accommodations.index') }}" class="btn-clear">Reset</a>
        </form>

        @php
            $grouped = $accommodations->groupBy('region');
        @endphp

        @foreach($grouped as $region => $regionAccommodations)
            <div class="section-divider reveal">{{ ucwords(str_replace('-', ' ', $region)) }} — {{ $regionAccommodations->count() }} {{ $regionAccommodations->count() === 1 ? 'stay' : 'stays' }}</div>

            <div class="card-grid cards-3">
                @foreach($regionAccommodations as $accommodation)
                    <article class="content-card reveal">
                        <div class="card-image-wrap">
                            <img src="{{ $accommodation['image'] }}" alt="{{ $accommodation['name'] }}">
                            <span class="card-badge">{{ ucwords(str_replace('-', ' ', $accommodation['type'])) }}</span>
                            <span class="card-badge price">{{ ucfirst($accommodation['price']) }}</span>
                        </div>
                        <div class="content-card-body">
                            <p class="meta">{{ $accommodation['country'] }} • {{ ucfirst(str_replace('-', ' ', $accommodation['travel_style'])) }}</p>
                            <h3>{{ $accommodation['name'] }}</h3>
                            <p>{{ $accommodation['nightly_from'] }} / night</p>
                            <a href="{{ $accommodation['affiliate_link'] }}" class="btn-primary" target="_blank" rel="noopener">Book via Partner <span class="btn-icon">→</span></a>
                        </div>
                    </article>
                @endforeach
            </div>
        @endforeach

        @if($accommodations->isEmpty())
            <p class="empty-state">No accommodations match the selected filters.</p>
        @endif
    </div>
</section>
@endsection
