@extends('layouts.travel')

@section('content')
<section class="page-hero" style="--hero-image:url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80');">
    <div class="container reveal">
        <ul class="breadcrumb">
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><span class="current">Travel Guides</span></li>
        </ul>
        <p class="eyebrow">Travel Guides / Blog</p>
        <h1>Practical guides for planning smarter Africa trips</h1>
        <p>Editorial categories ready for future posts: planning, timing, itineraries, safety, and culture.</p>
    </div>
</section>

<section class="section-block">
    <div class="container">
        <div class="category-grid reveal">
            @foreach($categories as $category)
                <a href="{{ route('blog.index', ['category' => $category]) }}" class="category-chip {{ $filters['category'] === $category ? 'active' : '' }}">{{ $category }}</a>
            @endforeach
        </div>

        <form class="filter-bar reveal" method="GET" action="{{ route('blog.index') }}">
            <input type="text" name="q" value="{{ $filters['q'] }}" placeholder="Search guides…">
            <select name="category">
                <option value="">All categories</option>
                @foreach($categories as $category)
                    <option value="{{ $category }}" @selected($filters['category'] === $category)>{{ $category }}</option>
                @endforeach
            </select>
            <select name="region">
                <option value="">All regions</option>
                @foreach($filterOptions['regions'] as $region)
                    <option value="{{ $region['slug'] }}" @selected($filters['region'] === $region['slug'])>{{ $region['name'] }}</option>
                @endforeach
            </select>
            <select name="country">
                <option value="">All countries</option>
                @foreach($filterOptions['countries'] as $country)
                    <option value="{{ $country }}" @selected($filters['country'] === $country)>{{ $country }}</option>
                @endforeach
            </select>
            <select name="price">
                <option value="">Any budget</option>
                @foreach($filterOptions['price'] as $price)
                    <option value="{{ $price }}" @selected($filters['price'] === $price)>{{ ucfirst($price) }}</option>
                @endforeach
            </select>
            <select name="safari_type">
                <option value="">Any safari type</option>
                @foreach($filterOptions['safariType'] as $type)
                    <option value="{{ $type }}" @selected($filters['safari_type'] === $type)>{{ ucwords(str_replace('-', ' ', $type)) }}</option>
                @endforeach
            </select>
            <select name="travel_style">
                <option value="">Any travel style</option>
                @foreach($filterOptions['travelStyle'] as $style)
                    <option value="{{ $style }}" @selected($filters['travel_style'] === $style)>{{ ucwords(str_replace('-', ' ', $style)) }}</option>
                @endforeach
            </select>
            <button type="submit">Apply</button>
            <a href="{{ route('blog.index') }}" class="btn-clear">Reset</a>
        </form>

        <div class="results-count reveal">
            <strong>{{ count($posts) }}</strong> article{{ count($posts) === 1 ? '' : 's' }}
            @if($filters['category'])
                in <strong>{{ $filters['category'] }}</strong>
            @endif
        </div>

        <div class="card-grid cards-3">
            @forelse($posts as $post)
                <article class="content-card reveal">
                    <div class="card-image-wrap">
                        <img src="{{ $post['image'] }}" alt="{{ $post['title'] }}">
                        <span class="card-badge">{{ $post['category'] }}</span>
                    </div>
                    <div class="content-card-body">
                        <p class="meta">{{ $post['read_time'] }}</p>
                        <h3>{{ $post['title'] }}</h3>
                        <p>{{ $post['excerpt'] }}</p>
                        <a href="#" class="btn-outline" aria-disabled="true">Read article <span class="btn-icon">→</span></a>
                    </div>
                </article>
            @empty
                <p class="empty-state">No blog cards match the selected filters.</p>
            @endforelse
        </div>
    </div>
</section>
@endsection
