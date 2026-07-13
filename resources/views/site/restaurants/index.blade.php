@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:restaurants-index-hero', 'alt' => 'Reserved hero image space for dining listings', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Restaurants']]])
        <p class="eyebrow">Restaurants</p>
        <h1>Plan the meals that make a destination linger.</h1>
        <p>Browse lodge dining, coastal seafood, rooftop tables, camp meals, and local restaurants near the attractions and stays you are already considering.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="intent-strip">
            <div>
                <p class="eyebrow">Dining Finder</p>
                <h2>Plan meals around the day you are actually taking.</h2>
                <p>Separate lodge dining, city restaurants, coastal seafood, scenic dinners, and camp meals before adding them to a route.</p>
            </div>
            <div class="intent-strip__chips">
                @foreach(['lodge dining', 'city restaurant', 'coastal seafood', 'scenic dinner', 'camp meals', 'local casual', 'vegetarian', 'family'] as $intent)
                    <a href="{{ route('restaurants.index', ['q' => $intent]) }}">{{ \Illuminate\Support\Str::headline($intent) }}</a>
                @endforeach
            </div>
        </div>
        <form class="filter-form" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search restaurant or cuisine">
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
                    'facts' => [
                        'Meal role' => str_contains(strtolower($restaurant->cuisine), 'lodge') || str_contains(strtolower($restaurant->cuisine), 'camp') ? 'Stay-based meal' : 'Planned dining stop',
                        'Cuisine' => $restaurant->cuisine,
                        'Reserve' => str_contains(strtolower($restaurant->practical_info), 'reserve') || str_contains(strtolower($restaurant->practical_info), 'book') ? 'Recommended' : 'Verify hours',
                        'Pairs with' => $restaurant->attraction?->name,
                    ],
                    'cta' => 'View dining details',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
