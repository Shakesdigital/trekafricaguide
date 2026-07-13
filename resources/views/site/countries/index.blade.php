@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:destinations-index-hero', 'alt' => 'Reserved hero image space for destination country guides', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Destinations']]])
        <p class="eyebrow">Destinations</p>
        <h1>Choose the country that gives your Africa trip the right shape.</h1>
        <p>Search by destination or filter by region to compare travel styles, access, seasonality, attractions, stays, restaurants, and booking options.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="intent-strip">
            <div>
                <p class="eyebrow">Destination Finder</p>
                <h2>Pick the country that matches the trip style and logistics.</h2>
                <p>Compare first-time friendliness, route type, best months, budget feel, and gateway access before opening a destination guide.</p>
            </div>
            <div class="intent-strip__chips">
                @foreach(['first-time safari', 'primates', 'beach', 'heritage', 'desert', 'self-drive', 'family', 'luxury', 'budget'] as $intent)
                    <a href="{{ route('countries.index', ['q' => $intent]) }}">{{ \Illuminate\Support\Str::headline($intent) }}</a>
                @endforeach
            </div>
        </div>
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
                    'summary' => \Illuminate\Support\Str::limit(strip_tags($country->overview), 200),
                    'eyebrow' => $country->region->name,
                    'rating' => null,
                    'reviews' => null,
                    'price' => null,
                    'chips' => ['Destination country', $country->region->name],
                    'facts' => [
                        'Best for' => \Illuminate\Support\Str::limit(strip_tags($country->hero_text), 42),
                        'Gateway' => \Illuminate\Support\Str::limit(strip_tags($country->access_summary), 38),
                        'Best months' => \Illuminate\Support\Str::limit(strip_tags($country->best_time), 42),
                        'Route type' => str_contains(strtolower($country->overview), 'safari') ? 'Guided safari' : 'Culture/coast',
                    ],
                    'cta' => 'Open destination guide',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
