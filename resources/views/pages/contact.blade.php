@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Contact</span></li>
        </ul>
        <p class="eyebrow">Contact</p>
        <h1>Partner, contribute, or ask for trip planning guidance</h1>
        <p>Use this contact form to reach us about partnerships, listings, or traveler support.</p>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Get in touch</h2>
            <form class="contact-form" action="#" method="POST">
                <label>
                    Full name
                    <input type="text" name="name" placeholder="Jane Doe">
                </label>
                <label>
                    Email
                    <input type="email" name="email" placeholder="jane@example.com">
                </label>
                <label>
                    Topic
                    <select name="topic">
                        <option value="">Select a topic</option>
                        <option>Destination partnership</option>
                        <option>Local guide listing</option>
                        <option>Traveler support</option>
                    </select>
                </label>
                <label>
                    Message
                    <textarea name="message" rows="5" placeholder="Tell us what you need…"></textarea>
                </label>
                <button type="button" class="btn-primary">Send message <span class="btn-icon">→</span></button>
            </form>
        </article>

        <article class="info-panel reveal">
            <h2>Quick links</h2>
            <ul class="bullet-list">
                <li><a href="{{ route('safaris.index') }}">Browse Safaris & Tours</a></li>
                <li><a href="{{ route('accommodations.index') }}">Find Accommodations</a></li>
                <li><a href="{{ route('experiences.index') }}">Explore Local Experiences</a></li>
            </ul>
            <p style="margin-top: 1.4rem;"><strong>Affiliate operations:</strong> replace every <code>@{{travelpayouts-link}}</code> placeholder with your active tracking URLs before launch.</p>
        </article>
    </div>
</section>
@endsection
