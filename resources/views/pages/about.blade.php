@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">About</span></li>
        </ul>
        <p class="eyebrow">About Trek Africa Guide</p>
        <h1>We help travelers plan Africa trips with more context and less noise</h1>
        <p>Trek Africa Guide is built as a travel guide and directory for people who want honest destination framing, useful trip-planning structure, and clear booking pathways instead of generic listicles or confusing booking funnels.</p>
    </div>
</section>

<section class="section-block accent-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>What the site is built to do</h2>
            <p>We organize Africa travel the way most people actually plan it: start with a region, compare countries, open a destination guide, then move into tours, stays, dining, and supporting travel insight.</p>
            <ul class="bullet-list">
                <li>Guide travelers from region to country to destination without overwhelming them</li>
                <li>Show what to do, where to stay, where to eat, and what kind of trip each place really suits</li>
                <li>Keep partner booking pathways clear instead of pretending to handle direct checkout</li>
            </ul>
        </article>
        <article class="info-panel reveal">
            <h2>How we think about trust</h2>
            <p>Trek Africa Guide is not a direct booking agency. We review destinations, surface relevant listings, and then redirect users to partner landing pages when they are ready to continue.</p>
            <ul class="bullet-list">
                <li>Affiliate transparency on every commercial call to action</li>
                <li>Destination fit and route logic over hype-heavy selling</li>
                <li>Local context, realistic pacing, and honest travel expectations</li>
            </ul>
            <a class="btn-primary" href="{{ route('blog.index') }}" style="margin-top: 1rem;">Read Travel Guides <span class="btn-icon">→</span></a>
        </article>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Who this is for</h2>
            <ul class="bullet-list">
                <li>First-time safari travelers who need help choosing between East, Southern, North, and West Africa</li>
                <li>Travelers comparing destinations like Murchison Falls, Maasai Mara, Cape Town, or Marrakech before they book</li>
                <li>People who want both inspiration and practical detail in one place</li>
            </ul>
        </article>
        <article class="info-panel reveal">
            <h2>What makes the approach different</h2>
            <ul class="bullet-list">
                <li>We treat food, local experiences, and route logic as part of the trip, not just optional extras</li>
                <li>We keep editorial guidance close to the commercial listings so travelers can compare with context</li>
                <li>We are moving toward a Supabase-powered CMS so content can stay organized and easier to expand across Africa</li>
            </ul>
        </article>
    </div>
</section>
@endsection
