@extends('layouts.site')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80')">
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Restaurants']]])
        <p class="eyebrow">Restaurants</p>
        <h1>Restaurant listings help travelers understand the wider experience around each attraction.</h1>
        <p>Dining is tied back to place, not treated as an afterthought. Browse by country or region, then open the full landing page for more detail.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <form class="filter-form" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search restaurant or cuisine">
            <select name="region">
                <option value="">All regions</option>
                @foreach($filterRegions as $region)
                    <option value="{{ $region->slug }}" @selected(($filters['region'] ?? '') === $region->slug)>{{ $region->name }}</option>
                @endforeach
            </select>
            <select name="country">
                <option value="">All countries</option>
                @foreach($filterCountries as $country)
                    <option value="{{ $country->slug }}" @selected(($filters['country'] ?? '') === $country->slug)>{{ $country->name }}</option>
                @endforeach
            </select>
            <button class="button" type="submit">Filter</button>
        </form>
        <div class="listing-grid">
            @foreach($restaurants as $restaurant)
                @include('site.partials.listing-card', [
                    'href' => route('restaurants.show', $restaurant),
                    'image' => $restaurant->hero_image_url,
                    'title' => $restaurant->name,
                    'summary' => $restaurant->listing_summary,
                    'eyebrow' => $restaurant->country->name . ' • ' . $restaurant->cuisine,
                    'rating' => $restaurant->rating,
                    'reviews' => $restaurant->review_count,
                    'price' => $restaurant->price_label,
                    'chips' => [$restaurant->signature_dish, $restaurant->attraction?->name],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
