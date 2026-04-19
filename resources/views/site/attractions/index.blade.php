@extends('layouts.site')

@section('content')
<section class="page-hero" style="--hero-image:url('{{ asset('listing style.png') }}')">
    <div class="page-hero__overlay page-hero__overlay--light"></div>
    <div class="container page-hero__content page-hero__content--dark">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Attractions']]])
        <p class="eyebrow">Listings</p>
        <h1>Browse attractions in a clean, marketplace-style listing layout.</h1>
        <p>Cards are intentionally structured after GetYourGuide and TripAdvisor patterns: thumbnail, location context, rating, price cue, and a direct path into a full landing page.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <form class="filter-form filter-form--chips" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search attraction or destination">
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
                    'chips' => [$attraction->location_name],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
