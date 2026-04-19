@extends('layouts.site')

@section('content')
<section class="page-hero" style="--hero-image:url('{{ $region->hero_image_url }}')">
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Regions', 'href' => route('regions.index')], ['label' => $region->name]]])
        <p class="eyebrow">{{ $region->name }}</p>
        <h1>{{ $region->hero_title }}</h1>
        <p>{{ $region->hero_text }}</p>
    </div>
</section>

<section class="section">
    <div class="container two-column">
        <div>
            <h2>Regional overview</h2>
            <p>{{ $region->overview }}</p>
            <p>{{ $region->countries_intro }}</p>
        </div>
        <div class="info-panel">
            <h3>Use this page to</h3>
            <ul class="bullet-list">
                <li>Compare the countries in {{ $region->name }} that are most suitable for visitors.</li>
                <li>Open a country landing page for practical travel context.</li>
                <li>Jump onward into attractions, stays, and restaurants from the right country base.</li>
            </ul>
        </div>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Countries</p>
            <h2>Countries in {{ $region->name }}</h2>
            <p>Every country links to its own landing page with a general overview, featured attractions, tour operators, stays, and restaurants.</p>
        </div>
        <div class="listing-grid">
            @foreach($region->countries as $country)
                @include('site.partials.listing-card', [
                    'href' => route('countries.show', $country),
                    'image' => $country->hero_image_url,
                    'title' => $country->name,
                    'summary' => $country->overview,
                    'eyebrow' => $region->name,
                    'rating' => null,
                    'reviews' => null,
                    'price' => null,
                    'chips' => ['Country guide'],
                ])
            @endforeach
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Featured attractions</p>
            <h2>High-interest attractions in {{ $region->name }}</h2>
        </div>
        <div class="listing-grid">
            @foreach($featuredAttractions as $attraction)
                @include('site.partials.listing-card', [
                    'href' => route('attractions.show', $attraction),
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => $attraction->country->name,
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
