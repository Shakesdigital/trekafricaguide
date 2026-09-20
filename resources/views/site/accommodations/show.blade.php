@extends('layouts.site')

@php($galleryImages = collect($accommodation->heroMedia ?? [])->map(fn ($m) => $m->url ?? $m->local_path)->filter()->values())
@php($galleryImages = $galleryImages->isNotEmpty() ? $galleryImages : collect($accommodation->hero_image_url)->filter()->values())
@php($primaryBookingUrl = app(\App\Services\Stay22LinkBuilder::class)->forProvider($accommodation, 'booking', $accommodation->booking_url, $searchContext ?? []))

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [
            ['label' => 'Home', 'href' => route('home')],
            ['label' => 'Accommodations', 'href' => route('accommodations.index')],
            ['label' => $accommodation->country->region->name, 'href' => route('regions.show', $accommodation->country->region)],
            ['label' => $accommodation->country->name, 'href' => route('countries.show', $accommodation->country)],
            ['label' => $accommodation->name],
        ]])
        <div class="listing-head">
            <p class="eyebrow">{{ $accommodation->country->name }} @if($accommodation->property_type) • {{ $accommodation->property_type }} @endif</p>
            <h1>{{ $accommodation->name }}</h1>
            <p class="detail-hero__summary">{{ $accommodation->listing_summary }}</p>
            <div class="listing-meta">
                @if($accommodation->price_label)
                    <span class="listing-meta__item">@include('site.partials.icon', ['name' => 'tag']) {{ $accommodation->price_label }}</span>
                @endif
            </div>
        </div>
        @if($galleryImages->isNotEmpty())
            <div class="gallery" data-gallery>
                <div class="gallery-grid {{ $galleryImages->count() === 1 ? 'gallery-grid--single' : '' }}">
                    @foreach($galleryImages as $image)
                        @include('site.partials.image-slot', ['image' => $image, 'alt' => $accommodation->heroMedia->alt_text ?? $accommodation->name, 'class' => 'gallery-grid__slot'])
                    @endforeach
                </div>
                @if($galleryImages->count() > 1)
                    <button type="button" class="gallery-count" data-gallery-open>@include('site.partials.icon', ['name' => 'camera']) {{ $galleryImages->count() }} photos</button>
                @endif
            </div>
        @endif
        @if($accommodation->heroMedia)
            <p class="media-credit"><small>
                Photo by {{ $accommodation->heroMedia->creator }} /
                <a href="{{ $accommodation->heroMedia->license_url }}" rel="license">{{ $accommodation->heroMedia->license }}</a>.
                <a href="{{ $accommodation->heroMedia->source_page }}" target="_blank" rel="noopener">View source</a>
            </small></p>
        @endif
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="decision-grid">
                <article class="decision-panel">
                    <p class="decision-panel__label">Best for</p>
                    <h3>{{ str_contains(strtolower($accommodation->practical_info), 'sector') ? 'Permit-day convenience' : 'Route comfort and easier logistics' }}</h3>
                    <p>{{ $accommodation->listing_summary }}</p>
                </article>
                <article class="decision-panel">
                    <p class="decision-panel__label">Route fit</p>
                    <h3>{{ $accommodation->attraction?->name ?? $accommodation->country->name }}</h3>
                    <p>Check that the stay matches your attraction timing, transfer route, and meal rhythm.</p>
                </article>
                <article class="decision-panel">
                    <p class="decision-panel__label">Rate confidence</p>
                    <h3>{{ $accommodation->price_label ?? 'Rates on request' }}</h3>
                    <p>Use this as a planning cue only. Live rates depend on season, room type, board basis, and availability.</p>
                </article>
            </div>
            <div class="fact-strip">
                @if($accommodation->property_type)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'bed'])</span><div><p class="fact__label">Property</p><p class="fact__value">{{ $accommodation->property_type }}</p></div></div>
                @endif
                @if($accommodation->location_name)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'pin'])</span><div><p class="fact__label">Location</p><p class="fact__value">{{ $accommodation->location_name }}</p></div></div>
                @endif
                @if($accommodation->price_label)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'tag'])</span><div><p class="fact__label">From</p><p class="fact__value">{{ $accommodation->price_label }}</p></div></div>
                @endif
            </div>
            <div class="detail-section">
                <h2>About this stay</h2>
                <div class="rich-text">{!! $accommodation->detail_intro !!}</div>
            </div>
            <div class="detail-section">
                <h3>Why it works for this route</h3>
                <div class="rich-text">{!! $accommodation->practical_info !!}</div>
            </div>
            @if(!empty($accommodation->amenities))
                <div class="detail-section">
                    <h3>Amenities</h3>
                    <ul class="amenity-grid">
                        @foreach($accommodation->amenities as $amenity)
                            <li class="amenity">@include('site.partials.icon', ['name' => 'check']) {{ $amenity }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            @if($accommodation->attraction)
                <div class="detail-section">
                    <h3>Best nearby attraction</h3>
                    <p><a href="{{ route('attractions.show', $accommodation->attraction) }}">{{ $accommodation->attraction->name }}</a> is the clearest anchor for this stay.</p>
                </div>
            @endif
            <div class="verify-box">
                <h3>What to verify before booking this stay</h3>
                <div class="verify-grid">
                    <ul class="bullet-list">
                        <li>Live room availability, rate basis, taxes, and seasonal supplements.</li>
                        <li>Cancellation terms, child policy, and single supplement if relevant.</li>
                        <li>Meal plan: breakfast, half-board, full-board, packed lunches, and drinks.</li>
                    </ul>
                    <ul class="bullet-list">
                        <li>Transfer time, road conditions, airstrip or ferry requirements.</li>
                        <li>Park fees, permits, and activity fees that are not in the room rate.</li>
                        <li>Whether the location matches your trekking sector or activity departure point.</li>
                    </ul>
                </div>
                <p class="source-note">Editorial research reviewed July 13, 2026. Confirm current room standards, inclusions, transfers, operating status, and recent guest feedback directly with the property before payment.</p>
            </div>
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Where to book</p>
                <p class="booking-panel__price">{{ $accommodation->price_label ?? 'Rates on request' }}</p>
                @if($accommodation->location_name)
                    <p class="booking-panel__where">@include('site.partials.icon', ['name' => 'pin']) {{ $accommodation->location_name }}</p>
                @endif
                <a href="{{ $primaryBookingUrl }}" class="button button--full" target="_blank" rel="nofollow noopener">Open booking options</a>
                <ul class="booking-trust">
                    <li>@include('site.partials.icon', ['name' => 'shield']) Opens an external provider page</li>
                    <li>@include('site.partials.icon', ['name' => 'check']) Live availability and rates are checked off-site</li>
                    <li>@include('site.partials.icon', ['name' => 'info']) No payment is taken on this page</li>
                </ul>
            </div>
        </aside>
    @include('site.partials.booking-offers', ['listing' => $accommodation, 'searchContext' => $searchContext ?? []])
</div>
</section>

<section class="section section--alt">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby attractions</p>
            <h2>Continue planning around this stay</h2>
        </div>
        <div class="listing-grid">
            @foreach($nearbyAttractions as $attraction)
                @include('site.partials.listing-card', [
                    'href' => route('attractions.show', $attraction),
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => trim($attraction->location_name.', '.$attraction->country->name, ', '),
                    'rating' => $attraction->rating,
                    'reviews' => $attraction->review_count,
                    'price' => $attraction->price_label,
                    'chips' => [$attraction->region?->name, 'Route anchor'],
                    'facts' => [
                        'Time' => '1-3 days',
                        'Demand' => str_contains(strtolower($attraction->detail_intro), 'trek') ? 'Demanding' : 'Moderate',
                        'Season' => \Illuminate\Support\Str::limit(strip_tags($attraction->best_time), 42),
                        'Verify' => 'Rates and access',
                    ],
                    'cta' => 'View attraction detail',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
