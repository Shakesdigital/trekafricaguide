@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:accommodations-index-hero', 'alt' => 'Reserved hero image space for accommodation listings', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Accommodations']]])
        <p class="eyebrow">Accommodations</p>
        <h1>Find places to stay that make the journey feel easier.</h1>
        <p>Compare safari lodges, riads, desert camps, beach resorts, guest houses, and city hotels by the attraction or destination they support.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <form class="filter-form" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search accommodation">
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
            @foreach($accommodations as $stay)
                @include('site.partials.listing-card', [
                    'href' => route('accommodations.show', $stay),
                    'image' => $stay->hero_image_url,
                    'title' => $stay->name,
                    'summary' => $stay->listing_summary,
                    'eyebrow' => $stay->country->name . ' • ' . $stay->property_type,
                    'rating' => $stay->rating,
                    'reviews' => $stay->review_count,
                    'price' => $stay->price_label,
                    'chips' => [$stay->attraction?->name],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
