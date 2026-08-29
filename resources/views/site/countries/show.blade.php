@extends('layouts.site')

@php
    $countryDestination = [
        'uganda' => 'bwindi-impenetrable-national-park', 'kenya' => 'maasai-mara',
        'tanzania' => 'serengeti-national-park', 'rwanda' => 'volcanoes-national-park',
        'ethiopia' => 'lalibela', 'ghana' => 'cape-coast-kakum', 'senegal' => 'sine-saloum-delta',
        'benin' => 'ouidah-and-ganvie', 'sierra-leone' => 'tokeh-and-river-no2', 'cabo-verde' => 'sal-island',
        'south-africa' => 'cape-town', 'botswana' => 'okavango-delta', 'namibia' => 'namib-desert',
        'zimbabwe' => 'victoria-falls', 'zambia' => 'south-luangwa', 'morocco' => 'marrakech-and-atlas',
        'egypt' => 'cairo-and-giza', 'tunisia' => 'tunis-and-sidi-bou-said', 'algeria' => 'djanet-and-tassili',
    ][$country->slug] ?? null;
    $localGallery = $countryDestination ? collect([asset('images/stock/destinations/'.$countryDestination.'.jpg')]) : collect();
    $galleryImages = $localGallery->isNotEmpty() ? $localGallery : collect($country->gallery ?? [])->filter()->values();
@endphp

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
            <div class="decision-grid">
                <article class="decision-panel">
                    <p class="decision-panel__label">Best for</p>
                    <h3>{{ \Illuminate\Support\Str::limit(strip_tags($country->hero_text), 80) }}</h3>
                    <p>Use this as the first fit check before comparing listings.</p>
                </article>
                <article class="decision-panel">
                    <p class="decision-panel__label">Gateway</p>
                    <h3>{{ \Illuminate\Support\Str::limit(strip_tags($country->access_summary), 88) }}</h3>
                    <p>Confirm flight routing, transfer time, and road versus fly-in tradeoffs.</p>
                </article>
                <article class="decision-panel">
                    <p class="decision-panel__label">Suggested trip length</p>
                    <h3>{{ $country->attractions->count() > 1 ? '7-10 days for a fuller route' : '3-5 days for one anchor' }}</h3>
                    <p>Add nights only when they reduce backtracking or improve activity timing.</p>
                </article>
            </div>
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
            <div class="verify-box">
                <h3>What to verify before booking {{ $country->name }}</h3>
                <div class="verify-grid">
                    <ul class="bullet-list">
                        <li>Current visa, entry, and passport rules.</li>
                        <li>Live park, permit, conservation, or museum fees.</li>
                        <li>Domestic flight schedules, road conditions, and transfer times.</li>
                    </ul>
                    <ul class="bullet-list">
                        <li>Seasonal closures, rainfall, heat, and wildlife movement.</li>
                        <li>Accommodation location against the attraction or trekking sector.</li>
                        <li>Cancellation terms, inclusions, meal plans, and guide requirements.</li>
                    </ul>
                </div>
                <p class="source-note">Editorial research reviewed July 13, 2026 using official tourism, heritage, park, and transport sources. Live permits, fees, access conditions, and official travel guidance can change.</p>
            </div>
        </div>
        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Destination at a glance</p>
                <h3>{{ $country->name }}</h3>
                <ul class="bullet-list">
                    <li>{{ $country->attractions->count() }} featured attractions listed</li>
                    <li>{{ $accommodations->count() }} accommodations nearby</li>
                    <li>{{ $restaurants->count() }} recommended restaurants</li>
                </ul>
            </div>
        </aside>
    </div>
</section>

<section class="section section--compact">
    <div class="container">
        @include('site.partials.search-ribbon', ['mode' => 'accommodations', 'searchContext' => ['mode' => 'accommodations', 'q' => $country->name]])
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
                    'href' => route('attractions.show', $attraction), 'listing' => $attraction,
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => $country->name,
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

<section class="section">
    <div class="container">
        <div class="section-heading section-heading--compact">
            <p class="eyebrow">Nearby stays</p>
            <h2>Stays that keep you close to the experience</h2>
        </div>
        <div class="listing-grid">
            @foreach($accommodations as $stay)
                @include('site.partials.listing-card', [
                    'href' => route('accommodations.show', $stay), 'listing' => $stay,
                    'image' => $stay->hero_image_url,
                    'title' => $stay->name,
                    'summary' => $stay->listing_summary,
                    'eyebrow' => $stay->attraction?->name,
                    'rating' => $stay->rating,
                    'reviews' => $stay->review_count,
                    'price' => $stay->price_label,
                    'chips' => [$stay->property_type, 'Route fit'],
                    'facts' => [
                        'Best for' => str_contains(strtolower($stay->practical_info), 'sector') ? 'Permit-day logistics' : 'Route comfort',
                        'Meal plan' => 'Verify basis',
                        'Nearby' => $stay->attraction?->name,
                        'Transfer' => 'Check access',
                    ],
                    'cta' => 'View route fit',
                ])
            @endforeach
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
                    'href' => route('restaurants.show', $restaurant), 'listing' => $restaurant,
                    'image' => $restaurant->hero_image_url,
                    'title' => $restaurant->name,
                    'summary' => $restaurant->listing_summary,
                    'eyebrow' => $restaurant->attraction?->name,
                    'rating' => $restaurant->rating,
                    'reviews' => $restaurant->review_count,
                    'price' => $restaurant->price_label,
                    'chips' => [$restaurant->cuisine, 'Dining detail'],
                    'facts' => [
                        'Meal role' => str_contains(strtolower($restaurant->cuisine), 'lodge') || str_contains(strtolower($restaurant->cuisine), 'camp') ? 'Stay-based meal' : 'Dining stop',
                        'Cuisine' => $restaurant->cuisine,
                        'Reserve' => 'Verify hours',
                        'Pairs with' => $restaurant->attraction?->name,
                    ],
                    'cta' => 'View dining',
                ])
            @endforeach
        </div>
    </div>
</section>

@if($country->tourOperators->isNotEmpty())
<section class="section">
    <div class="container">
        <div class="section-heading section-heading--compact"><p class="eyebrow">Tour operators</p><h2>Operators that can help shape the route</h2></div>
        <div class="operator-grid">@foreach($country->tourOperators as $operator)<article class="operator-card"><h3>{{ $operator->name }}</h3><p>{{ $operator->summary }}</p></article>@endforeach</div>
    </div>
</section>
@endif
@endsection
