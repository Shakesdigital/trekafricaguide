@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:regions-index-hero', 'alt' => 'Reserved hero image space for Africa regions', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Regions']]])
        <p class="eyebrow">Regions</p>
        <h1>Compare Africa by region before narrowing into destination countries and listings.</h1>
        <p>Each region page leads into destination country landing pages and then into attractions, accommodations, restaurants, and external partner booking links.</p>
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
                    <strong>Open region page</strong>
                </div>
            </a>
        @endforeach
    </div>
</section>
@endsection
