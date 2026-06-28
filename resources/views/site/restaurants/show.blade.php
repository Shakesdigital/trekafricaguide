@extends('layouts.site')

@php($galleryImages = collect($restaurant->gallery ?? [])->filter()->values())
@php($galleryImages = $galleryImages->isNotEmpty() ? $galleryImages : collect([$restaurant->hero_image_url])->filter()->values())

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Restaurants', 'href' => route('restaurants.index')], ['label' => $restaurant->name]]])
        <div class="listing-head">
            <p class="eyebrow">{{ $restaurant->country->name }} @if($restaurant->cuisine) • {{ $restaurant->cuisine }} @endif</p>
            <h1>{{ $restaurant->name }}</h1>
            <p class="detail-hero__summary">{{ $restaurant->listing_summary }}</p>
            <div class="listing-meta">
                <span class="listing-meta__rating">@include('site.partials.icon', ['name' => 'star']) {{ number_format((float) $restaurant->rating, 1) }}</span>
                <span class="listing-meta__muted">{{ number_format($restaurant->review_count) }} reviews</span>
                @if($restaurant->cuisine)
                    <span class="listing-meta__sep">·</span>
                    <span class="listing-meta__item">@include('site.partials.icon', ['name' => 'utensils']) {{ $restaurant->cuisine }}</span>
                @endif
                @if($restaurant->price_label)
                    <span class="listing-meta__sep">·</span>
                    <span class="listing-meta__item">@include('site.partials.icon', ['name' => 'tag']) {{ $restaurant->price_label }}</span>
                @endif
            </div>
        </div>
        @if($galleryImages->isNotEmpty())
            <div class="gallery" data-gallery>
                <div class="gallery-grid {{ $galleryImages->count() === 1 ? 'gallery-grid--single' : '' }}">
                    @foreach($galleryImages as $image)
                        @include('site.partials.image-slot', ['image' => $image, 'alt' => $restaurant->name, 'class' => 'gallery-grid__slot'])
                    @endforeach
                </div>
                @if($galleryImages->count() > 1)
                    <button type="button" class="gallery-count" data-gallery-open>@include('site.partials.icon', ['name' => 'camera']) {{ $galleryImages->count() }} photos</button>
                @endif
            </div>
        @endif
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="fact-strip">
                @if($restaurant->cuisine)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'utensils'])</span><div><p class="fact__label">Cuisine</p><p class="fact__value">{{ $restaurant->cuisine }}</p></div></div>
                @endif
                @if($restaurant->location_name)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'pin'])</span><div><p class="fact__label">Location</p><p class="fact__value">{{ $restaurant->location_name }}</p></div></div>
                @endif
                <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'star'])</span><div><p class="fact__label">Diner rating</p><p class="fact__value">{{ number_format((float) $restaurant->rating, 1) }} / 5</p></div></div>
                @if($restaurant->price_label)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'tag'])</span><div><p class="fact__label">Price</p><p class="fact__value">{{ $restaurant->price_label }}</p></div></div>
                @endif
            </div>
            <div class="detail-section">
                <h2>About this restaurant</h2>
                <div class="rich-text">{!! $restaurant->detail_intro !!}</div>
            </div>
            @if($restaurant->signature_dish)
                <div class="detail-section">
                    <div class="signature">
                        <span class="signature__icon">@include('site.partials.icon', ['name' => 'sparkle'])</span>
                        <div>
                            <p class="signature__label">Signature dish</p>
                            <p class="signature__name">{{ $restaurant->signature_dish }}</p>
                        </div>
                    </div>
                </div>
            @endif
            <div class="detail-section">
                <h3>Practical information</h3>
                <div class="rich-text">{!! $restaurant->practical_info !!}</div>
            </div>
            @if($restaurant->attraction)
                <div class="detail-section">
                    <h3>Nearby attraction</h3>
                    <p>This restaurant is recommended for travelers visiting <a href="{{ route('attractions.show', $restaurant->attraction) }}">{{ $restaurant->attraction->name }}</a>.</p>
                </div>
            @endif
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Plan a visit</p>
                <p class="booking-panel__price">{{ $restaurant->price_label ?? 'See menu' }}</p>
                @if($restaurant->location_name)
                    <p class="booking-panel__where">@include('site.partials.icon', ['name' => 'pin']) {{ $restaurant->location_name }}</p>
                @endif
                <a href="{{ $restaurant->booking_url }}" class="button button--full" target="_blank" rel="noopener">View dining details</a>
                <ul class="booking-trust">
                    <li>@include('site.partials.icon', ['name' => 'shield']) Reservations on the venue's own page</li>
                    <li>@include('site.partials.icon', ['name' => 'clock']) Confirm current hours before you go</li>
                    <li>@include('site.partials.icon', ['name' => 'info']) No payment is taken on this page</li>
                </ul>
            </div>
        </aside>
    </div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby stays</p>
            <h2>Accommodations that pair well</h2>
        </div>
        <div class="listing-grid">
            @foreach($nearbyAccommodations as $stay)
                @include('site.partials.listing-card', [
                    'href' => route('accommodations.show', $stay),
                    'image' => $stay->hero_image_url,
                    'title' => $stay->name,
                    'summary' => $stay->listing_summary,
                    'eyebrow' => $stay->property_type,
                    'rating' => $stay->rating,
                    'reviews' => $stay->review_count,
                    'price' => $stay->price_label,
                    'chips' => [$stay->location_name],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
