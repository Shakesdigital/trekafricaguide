@extends('layouts.site')

@php
    $regionDestination = [
        'east-africa' => 'serengeti-national-park',
        'west-africa' => 'sine-saloum-delta',
        'southern-africa' => 'namib-desert',
        'northern-africa' => 'marrakech-and-atlas',
    ][$region->slug] ?? null;
    $localGallery = $regionDestination ? collect([asset('images/stock/destinations/'.$regionDestination.'.jpg')]) : collect();
    $galleryImages = $localGallery->isNotEmpty() ? $localGallery : collect($region->gallery ?? [])->filter()->values();
@endphp

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => $region->hero_image_url, 'alt' => $region->hero_image_alt, 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Regions', 'href' => route('regions.index')], ['label' => $region->name]]])
        <p class="eyebrow">{{ $region->name }}</p>
        <h1>{{ $region->hero_title }}</h1>
        <p>{{ $region->hero_text }}</p>
    </div>
</section>

@if($galleryImages->isNotEmpty())
    <section class="section section--alt">
        <div class="container">
            <div class="section-heading section-heading--compact">
                <p class="eyebrow">Hero Gallery</p>
                <h2>More visuals from {{ $region->name }}</h2>
            </div>
            <div class="gallery-grid">
                @foreach($galleryImages as $image)
                    @include('site.partials.image-slot', ['image' => $image, 'alt' => $region->name, 'class' => 'gallery-grid__slot'])
                @endforeach
            </div>
        </div>
    </section>
@endif

<section class="section">
    <div class="container two-column">
        <div>
            <h2>Regional overview</h2>
            <div class="rich-text">{!! $region->overview !!}</div>
            <div class="rich-text">{!! $region->countries_intro !!}</div>
        </div>
        <div class="info-panel">
            <h3>Use this page to</h3>
            <ul class="bullet-list">
                <li>See which destination countries match your preferred pace, budget, season, and travel style.</li>
                <li>Understand what each country is strongest for before you start comparing individual listings.</li>
                <li>Move from broad inspiration into attractions, stays, restaurants, and booking paths that fit the route.</li>
            </ul>
        </div>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Destinations</p>
            <h2>Destination countries in {{ $region->name }}</h2>
            <p>Each destination guide brings the essentials together: why go, how the route works, what to see, where to stay, and where to eat nearby.</p>
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
                    'chips' => ['Destination guide', $country->region->name],
                    'facts' => [
                        'Best for' => \Illuminate\Support\Str::limit(strip_tags($country->hero_text), 42),
                        'Gateway' => \Illuminate\Support\Str::limit(strip_tags($country->access_summary), 38),
                        'Season' => \Illuminate\Support\Str::limit(strip_tags($country->best_time), 42),
                        'Listings' => $country->attractions()->count().' attractions',
                    ],
                    'cta' => 'Open guide',
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
                    'chips' => [$attraction->location_name, 'Route anchor'],
                    'facts' => [
                        'Time' => '1-3 days',
                        'Demand' => str_contains(strtolower($attraction->detail_intro), 'trek') ? 'Demanding' : 'Moderate',
                        'Season' => \Illuminate\Support\Str::limit(strip_tags($attraction->best_time), 42),
                        'Verify' => 'Rates and access',
                    ],
                    'cta' => 'Plan visit',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
