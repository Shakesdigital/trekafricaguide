@extends('layouts.site')

@php($galleryImages = collect($attraction->gallery ?? [])->filter()->values())
@php($galleryImages = $galleryImages->isNotEmpty() ? $galleryImages : collect([$attraction->hero_image_url])->filter()->values())

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Attractions', 'href' => route('attractions.index')], ['label' => $attraction->name]]])
        <div class="listing-head">
            <p class="eyebrow">{{ $attraction->country->name }} • {{ $attraction->region->name }}</p>
            <h1>{{ $attraction->name }}</h1>
            <p class="detail-hero__summary">{{ $attraction->listing_summary }}</p>
            <div class="listing-meta">
                <span class="listing-meta__rating">@include('site.partials.icon', ['name' => 'star']) {{ number_format((float) $attraction->rating, 1) }}</span>
                <span class="listing-meta__muted">{{ number_format($attraction->review_count) }} reviews</span>
                @if($attraction->location_name)
                    <span class="listing-meta__sep">·</span>
                    <span class="listing-meta__item">@include('site.partials.icon', ['name' => 'pin']) {{ $attraction->location_name }}</span>
                @endif
                @if($attraction->price_label)
                    <span class="listing-meta__sep">·</span>
                    <span class="listing-meta__item">@include('site.partials.icon', ['name' => 'tag']) {{ $attraction->price_label }}</span>
                @endif
            </div>
        </div>
        @if($galleryImages->isNotEmpty())
            <div class="gallery" data-gallery>
                <div class="gallery-grid {{ $galleryImages->count() === 1 ? 'gallery-grid--single' : '' }}">
                    @foreach($galleryImages as $image)
                        @include('site.partials.image-slot', ['image' => $image, 'alt' => $attraction->name, 'class' => 'gallery-grid__slot'])
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
                @if($attraction->location_name)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'pin'])</span><div><p class="fact__label">Where</p><p class="fact__value">{{ $attraction->location_name }}</p></div></div>
                @endif
                <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'compass'])</span><div><p class="fact__label">Region</p><p class="fact__value">{{ $attraction->region->name }}</p></div></div>
                <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'star'])</span><div><p class="fact__label">Traveler rating</p><p class="fact__value">{{ number_format((float) $attraction->rating, 1) }} / 5</p></div></div>
                @if($attraction->price_label)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'tag'])</span><div><p class="fact__label">Typical cost</p><p class="fact__value">{{ $attraction->price_label }}</p></div></div>
                @endif
            </div>
            <div class="detail-section">
                <h2>About this attraction</h2>
                <div class="rich-text">{!! $attraction->detail_intro !!}</div>
            </div>
            @if(!empty($attraction->highlights))
                <div class="detail-section">
                    <h3>Highlights</h3>
                    <ul class="check-list">
                        @foreach($attraction->highlights as $highlight)
                            <li>@include('site.partials.icon', ['name' => 'check']) {{ $highlight }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="detail-section">
                <h3>How to get there</h3>
                <div class="rich-text">{!! $attraction->getting_there !!}</div>
            </div>
            <div class="detail-section">
                <h3>Best time to visit</h3>
                <div class="rich-text">{!! $attraction->best_time !!}</div>
            </div>
            <div class="detail-section">
                <h3>Practical information</h3>
                <div class="rich-text">{!! $attraction->practical_info !!}</div>
            </div>
            <div class="detail-section">
                <h3>Full description</h3>
                <div class="rich-text">{!! $attraction->full_description !!}</div>
            </div>
            @if($attraction->tourOperators->isNotEmpty())
                <div class="detail-section">
                    <h3>Tour operators active here</h3>
                    <div class="stack-grid">
                        @foreach($attraction->tourOperators as $operator)
                            <article class="operator-card">
                                <h4>{{ $operator->name }}</h4>
                                <div class="rich-text">{!! $operator->summary !!}</div>
                                <a href="{{ $operator->booking_url }}" class="button button--ghost" target="_blank" rel="noopener">Operator booking page</a>
                            </article>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Plan your visit</p>
                <p class="booking-panel__price">{{ $attraction->price_label ?? 'Free to explore' }}</p>
                @if($attraction->location_name)
                    <p class="booking-panel__where">@include('site.partials.icon', ['name' => 'pin']) {{ $attraction->location_name }}</p>
                @endif
                <a href="{{ $attraction->booking_url }}" class="button button--full" target="_blank" rel="noopener">Check tours &amp; tickets</a>
                <ul class="booking-trust">
                    <li>@include('site.partials.icon', ['name' => 'shield']) Booked through vetted local operators</li>
                    <li>@include('site.partials.icon', ['name' => 'check']) Live dates and pricing on the partner site</li>
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
            <h2>Accommodations near {{ $attraction->name }}</h2>
        </div>
        <div class="listing-grid">
            @foreach($accommodations as $stay)
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

<section class="section">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby dining</p>
            <h2>Restaurants near {{ $attraction->name }}</h2>
        </div>
        <div class="listing-grid">
            @foreach($restaurants as $restaurant)
                @include('site.partials.listing-card', [
                    'href' => route('restaurants.show', $restaurant),
                    'image' => $restaurant->hero_image_url,
                    'title' => $restaurant->name,
                    'summary' => $restaurant->listing_summary,
                    'eyebrow' => $restaurant->cuisine,
                    'rating' => $restaurant->rating,
                    'reviews' => $restaurant->review_count,
                    'price' => $restaurant->price_label,
                    'chips' => [$restaurant->signature_dish],
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
