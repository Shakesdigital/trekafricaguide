@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:attractions-index-hero', 'alt' => 'Reserved hero image space for attraction listings', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Attractions']]])
        <p class="eyebrow">Listings</p>
        <h1>Explore the attractions that can anchor a memorable Africa trip.</h1>
        <p>Search safaris, coastlines, heritage sites, city gateways, deserts, and cultural routes, then open each listing for nearby stays, dining, timing, access, and partner booking links.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="intent-strip">
            <div>
                <p class="eyebrow">Filter by traveler intent</p>
                <h2>Compare attractions by the practical decision, not only the name.</h2>
                <p>Start with the style of trip, then use the country and region filters to narrow the route.</p>
            </div>
            <div class="intent-strip__chips">
                @foreach(['safari', 'primates', 'beach', 'heritage', 'city', 'desert', 'food', 'adventure', 'family', 'first-time'] as $intent)
                    <a href="{{ route('attractions.index', ['q' => $intent]) }}">{{ \Illuminate\Support\Str::headline($intent) }}</a>
                @endforeach
            </div>
        </div>
        <form class="filter-form filter-form--chips" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search attraction or destination">
            <select name="region">
                <option value="">All regions</option>
                @foreach($filterRegions as $region)
                    <option value="{{ $region->slug }}" @selected(($filters['region'] ?? '') === $region->slug)>{{ $region->name }}</option>
                @endforeach
            </select>
            <select name="country">
                <option value="">All destination countries</option>
                @foreach($filterCountries as $country)
                    <option value="{{ $country->slug }}" @selected(($filters['country'] ?? '') === $country->slug)>{{ $country->name }}</option>
                @endforeach
            </select>
            <button class="button" type="submit">Search</button>
        </form>
        <div class="listing-grid">
            @foreach($attractions as $attraction)
                @include('site.partials.listing-card', [
                    'href' => route('attractions.show', $attraction),
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => $attraction->country->name . ' • ' . $attraction->region->name,
                    'rating' => $attraction->rating,
                    'reviews' => $attraction->review_count,
                    'price' => $attraction->price_label,
                    'chips' => [$attraction->location_name, 'Plan visit'],
                    'facts' => [
                        'Time' => str_contains(strtolower($attraction->listing_summary), 'city') ? 'Half to full day' : '1-3 days',
                        'Demand' => str_contains(strtolower($attraction->detail_intro), 'trek') ? 'Demanding' : 'Moderate',
                        'Season' => \Illuminate\Support\Str::limit(strip_tags($attraction->best_time), 42),
                        'Route fit' => $attraction->country->name.' anchor',
                    ],
                    'cta' => 'Plan visit',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
