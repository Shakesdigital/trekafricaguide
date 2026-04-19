@extends('layouts.site')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80')">
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Regions']]])
        <p class="eyebrow">Regions</p>
        <h1>Compare Africa by region before narrowing into countries and listings.</h1>
        <p>Each region page leads into country-level landing pages and then into attractions, accommodations, restaurants, and external partner booking links.</p>
    </div>
</section>

<section class="section">
    <div class="container region-grid">
        @foreach($regions as $region)
            <a href="{{ route('regions.show', $region) }}" class="region-card region-card--tall">
                <img src="{{ $region->hero_image_url }}" alt="{{ $region->hero_image_alt }}">
                <div class="region-card__content">
                    <span>{{ $region->countries_count }} countries</span>
                    <h2>{{ $region->name }}</h2>
                    <p>{{ $region->overview }}</p>
                    <strong>Open region page</strong>
                </div>
            </a>
        @endforeach
    </div>
</section>
@endsection
