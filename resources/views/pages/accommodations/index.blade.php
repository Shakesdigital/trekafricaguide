@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Accommodations</span></li>
        </ul>
        <p class="eyebrow">Stays</p>
        <h1>Compare stays as part of the destination planning journey</h1>
        <p>Stays now sit inside the same planning structure as destination guides, tours, and dining, rather than feeling like a separate booking silo.</p>
    </div>
</section>

<section class="section-block patterned">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Stay Directory</p>
            <h2>Browse camps, lodges, and boutique hotels</h2>
            <p>Each listing supports comparison inside Trek Africa Guide before the user clicks through to a partner path or destination page.</p>
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
                            <div class="quick-links">
                                <a href="{{ route('destinations.show', $accommodation['destination_slug']) }}">Open destination guide</a>
                                <a href="{{ $accommodation['affiliate_link'] }}" target="_blank" rel="noopener">Open stay listing</a>
                            </div>
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
