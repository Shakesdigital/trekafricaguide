@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">About</span></li>
        </ul>
        <p class="eyebrow">About Us</p>
        <h1>Why Trek Africa Guide exists</h1>
        <p>We curate travel opportunities across Africa while directing bookings to trusted partners and spotlighting local communities.</p>
    </div>
</section>

<section class="section-block accent-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Directory-first model</h2>
            <p>We are not a direct booking agency. Trek Africa Guide helps travelers compare options and then redirects to partner checkout pages.</p>
            <ul class="bullet-list">
                <li>Affiliate transparency on every booking CTA</li>
                <li>Local host visibility and cultural context</li>
                <li>Practical filters to reduce planning friction</li>
            </ul>
        </article>
        <article class="info-panel reveal">
            <h2>What we prioritize</h2>
            <ul class="bullet-list">
                <li>Authentic experiences over generic packages</li>
                <li>Respectful travel and local economic impact</li>
                <li>Clear planning information for first-time and repeat travelers</li>
            </ul>
            <a class="btn-primary" href="{{ route('blog.index') }}" style="margin-top: 1rem;">Read Travel Guides <span class="btn-icon">→</span></a>
        </article>
    </div>
</section>
@endsection
