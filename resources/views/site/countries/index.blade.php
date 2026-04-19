@extends('layouts.site')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')">
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Countries']]])
        <p class="eyebrow">Countries</p>
        <h1>Country landing pages connect regional research to bookable trip components.</h1>
        <p>Filter by region or search directly to open the country landing page that best fits the trip you are planning.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <form class="filter-form" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search country">
            <select name="region">
                <option value="">All regions</option>
                @foreach($filterRegions as $region)
                    <option value="{{ $region->slug }}" @selected(($filters['region'] ?? '') === $region->slug)>{{ $region->name }}</option>
                @endforeach
            </select>
            <button class="button" type="submit">Filter</button>
        </form>

        <div class="listing-grid">
            @foreach($countries as $country)
                @include('site.partials.listing-card', [
                    'href' => route('countries.show', $country),
                    'image' => $country->hero_image_url,
                    'title' => $country->name,
                    'summary' => $country->overview,
                    'eyebrow' => $country->region->name,
                    'rating' => null,
                    'reviews' => null,
                    'price' => null,
                    'chips' => ['Country page'],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
