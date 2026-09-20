@extends('layouts.site')

@php($galleryImages = collect($attraction->heroMedia ?? [])->map(fn ($m) => $m->url ?? $m->local_path)->filter()->values())
@php($galleryImages = $galleryImages->isNotEmpty() ? $galleryImages : collect($attraction->hero_image_url)->filter()->values())

@section('content')
<section class="detail-hero">
    <div class="container">
        @include('site.partials.breadcrumbs', ['items' => [
            ['label' => 'Home', 'href' => route('home')],
            ['label' => 'Attractions', 'href' => route('attractions.index')],
            ['label' => $attraction->country->region->name, 'href' => route('regions.show', $attraction->country->region)],
            ['label' => $attraction->country->name, 'href' => route('countries.show', $attraction->country)],
            ['label' => $attraction->name],
        ]])
        <div class="listing-head">
            <p class="eyebrow">{{ $attraction->country->name }} • {{ $attraction->region->name }}</p>
            <h1>{{ $attraction->name }}</h1>
            <p class="detail-hero__summary">{{ $attraction->listing_summary }}</p>
            <div class="listing-meta">
                @if($attraction->price_label)
                    <span class="listing-meta__item">@include('site.partials.icon', ['name' => 'tag']) {{ $attraction->price_label }}</span>
                @endif
            </div>
        </div>
        @if($galleryImages->isNotEmpty())
            <div class="gallery" data-gallery>
                <div class="gallery-grid {{ $galleryImages->count() === 1 ? 'gallery-grid--single' : '' }}">
                    @foreach($galleryImages as $image)
                        @include('site.partials.image-slot', ['image' => $image, 'alt' => $attraction->heroMedia->alt_text ?? $attraction->name, 'class' => 'gallery-grid__slot'])
                    @endforeach
                </div>
                @if($galleryImages->count() > 1)
                    <button type="button" class="gallery-count" data-gallery-open>@include('site.partials.icon', ['name' => 'camera']) {{ $galleryImages->count() }} photos</button>
                @endif
            </div>
        @endif
        @if($attraction->heroMedia)
            <p class="media-credit"><small>
                Photo by {{ $attraction->heroMedia->creator }} /
                <a href="{{ $attraction->heroMedia->license_url }}" rel="license">{{ $attraction->heroMedia->license }}</a>.
                <a href="{{ $attraction->heroMedia->source_page }}" target="_blank" rel="noopener">View source</a>
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
                    <h3>{{ str_contains(strtolower($attraction->detail_intro), 'trek') ? 'Active travelers and specialist nature trips' : 'Travelers building a practical route anchor' }}</h3>
                    <p>{{ $attraction->listing_summary }}</p>
                </article>
                <article class="decision-panel">
                    <p class="decision-panel__label">Suggested time</p>
                    <h3>{{ str_contains(strtolower($attraction->listing_summary), 'city') ? 'Half to full day' : '1-3 days' }}</h3>
                    <p>Allow more time when transfers are long, permits are limited, or nearby stays improve early starts.</p>
                </article>
                <article class="decision-panel">
                    <p class="decision-panel__label">Booking confidence</p>
                    <h3>Check partner options</h3>
                    <p>Use Trek Africa Guide for fit, then verify dates, rates, inclusions, and cancellation on the external booking page.</p>
                </article>
            </div>
            <div class="fact-strip">
                @if($attraction->location_name)
                    <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'pin'])</span><div><p class="fact__label">Where</p><p class="fact__value">{{ $attraction->location_name }}</p></div></div>
                @endif
                <div class="fact"><span class="fact__icon">@include('site.partials.icon', ['name' => 'compass'])</span><div><p class="fact__label">Region</p><p class="fact__value">{{ $attraction->region->name }}</p></div></div>
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
            <div class="verify-box">
                <h3>What to verify before booking</h3>
                <div class="verify-grid">
                    <ul class="bullet-list">
                        <li>Current availability, opening conditions, and weather impact.</li>
                        <li>Permit, guide, conservation, or park-entry requirements.</li>
                        <li>What the listed price includes and excludes.</li>
                    </ul>
                    <ul class="bullet-list">
                        <li>Meeting point, transfer time, and luggage restrictions.</li>
                        <li>Cancellation terms, age rules, and fitness demands.</li>
                        <li>Nearby stay location if an early start is required.</li>
                    </ul>
                </div>
                <p class="source-note">Editorial research reviewed July 13, 2026 using official park, tourism-board, UNESCO, property, and recent visitor-feedback sources. Verify changing permits, fees, access rules, and safety guidance before travel.</p>
            </div>
            <div class="detail-section">
                <h3>Full description</h3>
                <div class="rich-text">{!! $attraction->full_description !!}</div>
            </div>
        </div>
    </div>
    @include('site.partials.booking-offers', ['listing' => $attraction, 'searchContext' => $searchContext ?? []])
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
                    'eyebrow' => trim($stay->location_name.', '.$stay->country->name, ', '),
                    'rating' => $stay->rating,
                    'reviews' => $stay->review_count,
                    'price' => $stay->price_label,
                    'chips' => [$stay->region?->name, $stay->property_type],
                    'facts' => [
                        'Best for' => str_contains(strtolower($stay->practical_info), 'sector') ? 'Permit-day logistics' : 'Route comfort',
                        'Meal plan' => 'Verify basis',
                        'Nearby' => $stay->attraction?->name,
                        'Transfer' => 'Check access',
                    ],
                    'cta' => 'View stay',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
