@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:attractions-index-hero', 'alt' => 'Maasai Mara landscape representing Africa attractions', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Attractions']]])
        <p class="eyebrow">Listings</p>
        <h1>Explore the attractions that can anchor a memorable Africa trip.</h1>
        <p>Search safaris, coastlines, heritage sites, city gateways, deserts, and cultural routes, then open each listing for the practical details and booking options.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="intent-strip">
            <div>
                <p class="eyebrow">Filter by traveler intent</p>
                <h2>Compare attractions by the practical decision, not only the name.</h2>
                <p>Start with the style of trip, then use the country and region filters to narrow the route.</p>
            </div>
            <div class="intent-strip__chips">
                @foreach(['safari', 'primates', 'beach', 'heritage', 'city', 'desert', 'food', 'adventure', 'family', 'first-time'] as $intent)
                    <a href="{{ route('attractions.index', ['q' => $intent]) }}">{{ \Illuminate\Support\Str::headline($intent) }}</a>
                @endforeach
            </div>
        </div>
        @include('site.partials.search-ribbon', ['mode' => 'attractions'])
        <div class="listing-grid">
            @foreach($attractions as $attraction)
                @include('site.partials.listing-card', [
                    'href' => route('attractions.show', $attraction),
                    'listing' => $attraction,
                    'image' => $attraction->hero_image_url,
                    'title' => $attraction->name,
                    'summary' => $attraction->listing_summary,
                    'eyebrow' => trim($attraction->location_name.', '.$attraction->country->name, ', '),
                    'rating' => $attraction->rating,
                    'reviews' => $attraction->review_count,
                    'price' => $attraction->price_label,
                    'chips' => [$attraction->region?->name, 'Plan visit'],
                    'facts' => [
                        'Time' => str_contains(strtolower($attraction->listing_summary), 'city') ? 'Half to full day' : '1-3 days',
                        'Demand' => str_contains(strtolower($attraction->detail_intro), 'trek') ? 'Demanding' : 'Moderate',
                        'Season' => \Illuminate\Support\Str::limit(strip_tags($attraction->best_time), 42),
                        'Route fit' => $attraction->country->name.' anchor',
                    ],
                    'cta' => 'View attraction detail',
                ])
            @endforeach
        </div>
    </div>
</section>
@endsection
