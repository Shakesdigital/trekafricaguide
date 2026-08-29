@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:accommodations-index-hero', 'alt' => 'Reserved hero image space for accommodation listings', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Accommodations']]])
        <p class="eyebrow">Accommodations</p>
        <h1>Find places to stay that make the journey feel easier.</h1>
        <p>Compare safari lodges, riads, desert camps, beach resorts, guest houses, and city hotels by the attraction or destination they support.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="intent-strip">
            <div>
                <p class="eyebrow">Stay Finder</p>
                <h2>Choose stays by route fit, not just room style.</h2>
                <p>Use the quick intents below for safari lodges, permit-day convenience, beach resets, city gateways, and family-friendly comfort.</p>
            </div>
            <div class="intent-strip__chips">
                @foreach(['safari lodge', 'tented camp', 'city hotel', 'riad', 'beach resort', 'guesthouse', 'desert camp', 'family', 'luxury', 'budget'] as $intent)
                    <a href="{{ route('accommodations.index', ['q' => $intent]) }}">{{ \Illuminate\Support\Str::headline($intent) }}</a>
                @endforeach
            </div>
        </div>
        @include('site.partials.search-ribbon', ['mode' => 'accommodations'])
        <div class="listing-grid">
            @foreach($accommodations as $stay)
                @include('site.partials.listing-card', [
                    'href' => route('accommodations.show', $stay),
                    'listing' => $stay,
                    'image' => $stay->hero_image_url,
                    'title' => $stay->name,
                    'summary' => $stay->listing_summary,
                    'eyebrow' => $stay->country->name . ' • ' . $stay->property_type,
                    'rating' => $stay->rating,
                    'reviews' => $stay->review_count,
                    'price' => $stay->price_label,
                    'chips' => [$stay->attraction?->name, $stay->property_type],
                    'facts' => [
                        'Best for' => str_contains(strtolower($stay->practical_info), 'sector') ? 'Permit-day logistics' : 'Route comfort',
                        'Meal plan' => str_contains(strtolower(implode(' ', $stay->amenities ?? [])), 'all-inclusive') ? 'Often bundled' : 'Verify basis',
                        'Nearby' => $stay->attraction?->name,
                        'Transfer' => str_contains(strtolower($stay->practical_info), 'road') ? 'Check road time' : 'Confirm access',
                    ],
                    'cta' => 'View route fit',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
