@extends('layouts.site')

@section('content')
<section class="page-hero" style="--hero-image:url('{{ $country->hero_image_url }}')">
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Regions', 'href' => route('regions.index')], ['label' => $country->region->name, 'href' => route('regions.show', $country->region)], ['label' => $country->name]]])
        <p class="eyebrow">{{ $country->region->name }}</p>
        <h1>{{ $country->hero_title }}</h1>
        <p>{{ $country->hero_text }}</p>
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <h2>General information about {{ $country->name }}</h2>
            <p>{{ $country->overview }}</p>
            <div class="detail-section">
                <h3>Getting around</h3>
                <p>{{ $country->access_summary }}</p>
            </div>
            <div class="detail-section">
                <h3>Best time to visit</h3>
                <p>{{ $country->best_time }}</p>
            </div>
            <div class="detail-section">
                <h3>Planning notes</h3>
                <p>{{ $country->planning_tips }}</p>
            </div>
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Country at a glance</p>
                <h3>{{ $country->name }}</h3>
                <ul class="bullet-list">
                    <li>{{ $country->attractions->count() }} featured attractions seeded</li>
                    <li>{{ $country->tourOperators->count() }} active tour operator profiles</li>
                    <li>{{ $accommodations->count() }} accommodations nearby</li>
                    <li>{{ $restaurants->count() }} recommended restaurants</li>
                </ul>
            </div>
        </aside>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Attractions</p>
            <h2>Tourist attractions in {{ $country->name }}</h2>
            <p>Each listing opens into a full independent attraction page with gallery, practical information, how to get there, nearby stays, restaurants, and booking links.</p>
        </div>
        <div class="listing-grid">
            @foreach($country->attractions as $attraction)
                @include('site.partials.listing-card', [
                    'href' => route('attractions.show', $attraction),
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => $country->name,
                    'rating' => $attraction->rating,
                    'reviews' => $attraction->review_count,
                    'price' => $attraction->price_label,
                    'chips' => [$attraction->location_name],
                ])
            @endforeach
        </div>
    </div>
</section>

<section class="section">
    <div class="container two-column">
        <div>
            <div class="section-heading section-heading--compact">
                <p class="eyebrow">Tour operators</p>
                <h2>Tour operators active in {{ $country->name }}</h2>
            </div>
            <div class="stack-grid">
                @foreach($country->tourOperators as $operator)
                    <article class="mini-card">
                        <h3>{{ $operator->name }}</h3>
                        <p>{{ $operator->summary }}</p>
                        <div class="chip-row">
                            @foreach($operator->specialties ?? [] as $specialty)
                                <span>{{ $specialty }}</span>
                            @endforeach
                        </div>
                        <a href="{{ $operator->booking_url }}" class="button button--ghost" target="_blank" rel="noopener">Visit operator</a>
                    </article>
                @endforeach
            </div>
        </div>
        <div>
            <div class="section-heading section-heading--compact">
                <p class="eyebrow">Nearby stays</p>
                <h2>Accommodations near the main attractions</h2>
            </div>
            <div class="stack-grid">
                @foreach($accommodations as $stay)
                    @include('site.partials.listing-card', [
                        'href' => route('accommodations.show', $stay),
                        'image' => $stay->hero_image_url,
                        'title' => $stay->name,
                        'summary' => $stay->listing_summary,
                        'eyebrow' => $stay->attraction?->name,
                        'rating' => $stay->rating,
                        'reviews' => $stay->review_count,
                        'price' => $stay->price_label,
                        'chips' => [$stay->property_type],
                    ])
                @endforeach
            </div>
        </div>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading">
            <p class="eyebrow">Dining</p>
            <h2>Recommended restaurants near each attraction</h2>
        </div>
        <div class="listing-grid">
            @foreach($restaurants as $restaurant)
                @include('site.partials.listing-card', [
                    'href' => route('restaurants.show', $restaurant),
                    'image' => $restaurant->hero_image_url,
                    'title' => $restaurant->name,
                    'summary' => $restaurant->listing_summary,
                    'eyebrow' => $restaurant->attraction?->name,
                    'rating' => $restaurant->rating,
                    'reviews' => $restaurant->review_count,
                    'price' => $restaurant->price_label,
                    'chips' => [$restaurant->cuisine],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
