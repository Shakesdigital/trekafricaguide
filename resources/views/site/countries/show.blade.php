@extends('layouts.site')

@php($galleryImages = collect($country->gallery ?? [])->filter()->values())

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => $country->hero_image_url, 'alt' => $country->hero_image_alt, 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Destinations', 'href' => route('countries.index')], ['label' => $country->name]]])
        <p class="eyebrow">{{ $country->region->name }}</p>
        <h1>{{ $country->hero_title }}</h1>
        <p>{{ $country->hero_text }}</p>
    </div>
</section>

@if($galleryImages->isNotEmpty())
    <section class="section section--alt">
        <div class="container">
            <div class="section-heading section-heading--compact">
                <p class="eyebrow">Hero Gallery</p>
                <h2>More visuals from {{ $country->name }}</h2>
            </div>
            <div class="gallery-grid">
                @foreach($galleryImages as $image)
                    @include('site.partials.image-slot', ['image' => $image, 'alt' => $country->name, 'class' => 'gallery-grid__slot'])
                @endforeach
            </div>
        </div>
    </section>
@endif

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <h2>Destination guide to {{ $country->name }}</h2>
            <div class="rich-text">{!! $country->overview !!}</div>
            <div class="detail-section">
                <h3>Getting around</h3>
                <div class="rich-text">{!! $country->access_summary !!}</div>
            </div>
            <div class="detail-section">
                <h3>Best time to visit</h3>
                <div class="rich-text">{!! $country->best_time !!}</div>
            </div>
            <div class="detail-section">
                <h3>Planning notes</h3>
                <div class="rich-text">{!! $country->planning_tips !!}</div>
            </div>
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Destination at a glance</p>
                <h3>{{ $country->name }}</h3>
                <ul class="bullet-list">
                    <li>{{ $country->attractions->count() }} featured attractions listed</li>
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
            <p>Open the places that catch your eye, then compare the practical details: how to get there, when to go, where to stay nearby, and which booking path makes sense.</p>
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
                <h2>Operators that can help shape the route</h2>
            </div>
            <div class="stack-grid">
                @foreach($country->tourOperators as $operator)
                    <article class="mini-card">
                        <h3>{{ $operator->name }}</h3>
                        <div class="rich-text">{!! $operator->summary !!}</div>
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
                <h2>Stays that keep you close to the experience</h2>
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
            <h2>Dining ideas that add flavor to the journey</h2>
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
