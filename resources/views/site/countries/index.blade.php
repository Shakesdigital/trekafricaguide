@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:destinations-index-hero', 'alt' => 'Reserved hero image space for destination country guides', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Destinations']]])
        <p class="eyebrow">Destinations</p>
        <h1>Destination country pages connect regional research to bookable trip components.</h1>
        <p>Filter by region or search directly to open the destination country page that best fits the trip you are planning.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <form class="filter-form" method="GET">
            <input type="text" name="q" value="{{ $filters['q'] ?? '' }}" placeholder="Search destination country">
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
                    'chips' => ['Destination country'],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
