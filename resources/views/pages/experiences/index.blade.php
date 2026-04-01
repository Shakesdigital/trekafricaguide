@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Local Experiences</span></li>
        </ul>
        <p class="eyebrow">Local Experiences</p>
        <h1>Keep the human context close to the destination guide</h1>
        <p>These pages bring in the human layer of the trip, with hosted walks, food experiences, community visits, and slower moments that help the destination feel more complete.</p>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="section-head reveal">
            <p class="eyebrow">Experience Layer</p>
            <h2>Community tours, hosted walks, food trails, and local encounters</h2>
            <p>Well-planned Africa trips are rarely just game drives. This section helps travelers find meaningful half-day and full-day experiences that fit naturally before, between, or after major safari legs.</p>
        </div>

        <form class="filter-bar reveal" method="GET" action="{{ route('experiences.index') }}">
            <input type="text" name="q" value="{{ $filters['q'] }}" placeholder="Search host, experience, or style…">
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
                <option value="">Any type</option>
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
            <a href="{{ route('experiences.index') }}" class="btn-clear">Reset</a>
        </form>

        <div class="results-count reveal">
            <strong>{{ count($experiences) }}</strong> experience{{ count($experiences) === 1 ? '' : 's' }} available
        </div>

        <div class="card-grid cards-3">
            @forelse($experiences as $experience)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $experience['image'] }}" alt="{{ $experience['name'] }}">
                        <span class="card-badge">{{ ucwords(str_replace('-', ' ', $experience['type'])) }}</span>
                        <span class="card-badge price">{{ ucfirst($experience['price']) }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ ucwords(str_replace('-', ' ', $experience['region'])) }} • {{ $experience['country'] }}</p>
                        <h3>{{ $experience['name'] }}</h3>
                        <p>{{ $experience['bio'] }}</p>
                        <div class="pill-row">
                            <span>{{ ucwords(str_replace('-', ' ', $experience['travel_style'])) }}</span>
                        </div>
                        <p class="host-line">Hosted by {{ $experience['host'] }}</p>
                        <div class="quick-links">
                            <a href="{{ route('destinations.index', ['country' => $experience['country']]) }}">See destination context</a>
                            <a href="{{ $experience['affiliate_link'] }}" target="_blank" rel="noopener">Open partner path</a>
                        </div>
                    </div>
                </article>
            @empty
                <p class="empty-state">No local experiences match these filters yet.</p>
            @endforelse
        </div>
    </div>
</section>
@endsection
