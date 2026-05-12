@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:regions-index-hero', 'alt' => 'Reserved hero image space for Africa regions', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Regions']]])
        <p class="eyebrow">Regions</p>
        <h1>Find the African region that fits the kind of journey you want.</h1>
        <p>Compare safari circuits, island escapes, heritage routes, desert landscapes, city breaks, and food-led travel before choosing a destination country.</p>
    </div>
</section>

<section class="section">
    <div class="container region-grid">
        @foreach($regions as $region)
            <a href="{{ route('regions.show', $region) }}" class="region-card region-card--tall">
                @include('site.partials.image-slot', ['image' => $region->hero_image_url, 'alt' => $region->hero_image_alt, 'class' => 'region-card__slot'])
                <div class="region-card__content">
                    <span>{{ $region->countries_count }} destination countries</span>
                    <h2>{{ $region->name }}</h2>
                    <p>{{ $region->overview }}</p>
                    <strong>Explore this region</strong>
                </div>
            </a>
        @endforeach
    </div>
</section>
@endsection
