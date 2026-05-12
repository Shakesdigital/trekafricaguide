@extends('layouts.site')

@section('content')
<section class="page-hero">
    @include('site.partials.image-slot', ['image' => 'image-slot:contact-hero', 'alt' => 'Reserved hero image space for Trek Africa Guide contact page', 'class' => 'page-hero__slot'])
    <div class="page-hero__overlay"></div>
    <div class="container page-hero__content">
        @include('site.partials.breadcrumbs', ['items' => [['label' => 'Home', 'href' => route('home')], ['label' => 'Contact']]])
        <p class="eyebrow">Contact</p>
        <h1>Contact Trek Africa Guide about listings, corrections, and partnership routes.</h1>
        <p>Use these details for destination updates, accommodation or restaurant listing corrections, partner booking questions, and practical feedback from travelers on the ground.</p>
    </div>
</section>

<section class="section">
    <div class="container detail-grid">
        <div class="detail-main">
            <div class="detail-section">
                <h2>Send a clear travel or listing note</h2>
                <p>Trek Africa Guide is built to help readers compare Africa by region, then move into destination countries, attractions, stays, dining, and external booking paths with realistic expectations.</p>
                <p>When contacting us, include the destination country, attraction, stay, restaurant, or page URL you are referring to, plus the correction or partnership detail you want reviewed.</p>
            </div>
            <div class="detail-section">
                <h3>Useful reasons to reach out</h3>
                <ul class="bullet-list">
                    <li>Suggest a more accurate accommodation, restaurant, or route note for an attraction area.</li>
                    <li>Flag outdated access, seasonality, price-label, or practical information.</li>
                    <li>Discuss destination partnerships, operator listings, or external booking links.</li>
                </ul>
            </div>
            <div class="detail-section">
                <h3>Booking transparency</h3>
                <p>Trek Africa Guide is a planning and directory site. External booking buttons lead to partner or provider pages, where travelers should verify live rates, availability, inclusions, permits, and final terms before paying.</p>
            </div>
        </div>

        <aside class="detail-rail">
            <div class="booking-panel">
                <p class="booking-panel__eyebrow">Public contact</p>
                <h3>{{ $siteName }}</h3>
                <ul class="bullet-list">
                    <li><a href="mailto:{{ $contact['email'] }}">{{ $contact['email'] }}</a></li>
                    <li><a href="tel:{{ preg_replace('/\s+/', '', $contact['phone']) }}">{{ $contact['phone'] }}</a></li>
                    <li>{{ $contact['address'] }}</li>
                </ul>
                <p>{{ $contact['note'] }}</p>
            </div>
        </aside>
    </div>
</section>
@endsection
