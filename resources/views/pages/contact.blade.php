@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Contact</span></li>
        </ul>
        <p class="eyebrow">Contact</p>
        <h1>Reach out about listings, partnerships, content, or traveler support</h1>
        <p>Use this page if you want to contribute a listing, discuss affiliate integrations, suggest content updates, or get help finding the right part of the site for your trip planning needs.</p>
    </div>
</section>

<section class="section-block">
    <div class="container split-layout">
        <article class="info-panel reveal">
            <h2>Send a message</h2>
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
                        <option>Destination or listing partnership</option>
                        <option>TravelPayouts affiliate setup</option>
                        <option>Local guide listing</option>
                        <option>Content correction or update</option>
                        <option>Traveler support</option>
                    </select>
                </label>
                <label>
                    Message
                    <textarea name="message" rows="5" placeholder="Tell us what you need, which page or destination it relates to, and what outcome you are trying to achieve."></textarea>
                </label>
                <button type="button" class="btn-primary">Send message <span class="btn-icon">→</span></button>
            </form>
        </article>

        <article class="info-panel reveal">
            <h2>Best reasons to contact us</h2>
            <ul class="bullet-list">
                <li>Submit or improve a safari, stay, restaurant, or experience listing</li>
                <li>Flag outdated travel information or suggest a better route recommendation</li>
                <li>Ask about affiliate CTA placement or TravelPayouts-linked inventory flow</li>
            </ul>

            <h2 style="margin-top: 1.4rem;">Quick links</h2>
            <ul class="bullet-list">
                <li><a href="{{ route('safaris.index') }}">Browse Safaris & Tours</a></li>
                <li><a href="{{ route('accommodations.index') }}">Find Accommodations</a></li>
                <li><a href="{{ route('restaurants.index') }}">Browse Restaurants</a></li>
                <li><a href="{{ route('experiences.index') }}">Explore Local Experiences</a></li>
            </ul>
            <p style="margin-top: 1.4rem;"><strong>Affiliate operations note:</strong> replace every <code>@{{travelpayouts-link}}</code> placeholder with your active tracking URLs before launch so the live CTAs send users to the right booking path.</p>
        </article>
    </div>
</section>
@endsection
