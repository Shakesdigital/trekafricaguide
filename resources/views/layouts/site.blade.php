<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ ($title ?? null) ? $title . ' | ' . ($siteName ?? 'Trek Africa Guide') : ($siteName ?? 'Trek Africa Guide') }}</title>
    @php
        $logoPath = $branding['logo'] ?? '/logo to edit.png';
        $logoUrl = \Illuminate\Support\Str::startsWith($logoPath, ['http://', 'https://'])
            ? $logoPath
            : asset(ltrim($logoPath, '/'));
    @endphp
    <meta name="description" content="{{ $metaDescription ?? 'Trek Africa Guide' }}">
    <link rel="icon" type="image/png" href="{{ $logoUrl }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    <style>
        :root {
            --brand-primary: {{ $branding['primary'] ?? '#284932' }};
            --brand-secondary: {{ $branding['secondary'] ?? '#c56b3d' }};
            --brand-accent: {{ $branding['accent'] ?? '#c5b580' }};
        }
    </style>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="site-topline">
        <div class="container site-topline__inner">
            <span>{{ $siteTagline ?? 'African travel guide and booking directory' }}</span>
            <span>Compare where to go, where to stay, and where to eat before you book.</span>
        </div>
    </div>

    <header class="site-header">
        <div class="container site-header__inner">
            <a href="{{ route('home') }}" class="brand">
                <img src="{{ $logoUrl }}" alt="Trek Africa Guide logo">
                <span>
                    <strong>{{ $siteName ?? 'Trek Africa Guide' }}</strong>
                    <small>Africa travel listings, stays, dining, and planning insight</small>
                </span>
            </a>

            <button class="menu-toggle" type="button" data-nav-toggle aria-label="Toggle navigation" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>

            <span class="site-nav-cta site-nav-cta--disabled" aria-disabled="true">Add a Travel Service</span>

            <nav class="site-nav" data-nav-menu>
                @foreach(($navItems ?? []) as $item)
                    <a href="{{ route($item['route']) }}" class="{{ request()->routeIs($item['route']) ? 'is-active' : '' }}">{{ $item['label'] }}</a>
                @endforeach
            </nav>
        </div>
    </header>

    <main>
        @yield('content')
    </main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <div>
                <h3>{{ $siteName ?? 'Trek Africa Guide' }}</h3>
                <p>{{ $siteTagline ?? 'African travel guide and booking directory' }}</p>
                <p>Use each guide to understand the destination, compare nearby stays and restaurants, and follow through to trusted external booking pages when the fit feels right.</p>
            </div>
            <div>
                <h4>Explore</h4>
                <ul>
                    <li><a href="{{ route('regions.index') }}">Regions</a></li>
                    <li><a href="{{ route('countries.index') }}">Destinations</a></li>
                    <li><a href="{{ route('attractions.index') }}">Attractions</a></li>
                    <li><a href="{{ route('accommodations.index') }}">Accommodations</a></li>
                    <li><a href="{{ route('restaurants.index') }}">Restaurants</a></li>
                    <li><a href="{{ route('contact') }}">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4>Planning Focus</h4>
                <ul>
                    @foreach(($regionsNav ?? collect()) as $region)
                        <li><a href="{{ route('regions.show', $region) }}">{{ $region->name }}</a></li>
                    @endforeach
                </ul>
            </div>
            <div>
                <h4>Contact</h4>
                <ul>
                    <li><a href="mailto:{{ $contact['email'] ?? 'hello@trekafricaguide.com' }}">{{ $contact['email'] ?? 'hello@trekafricaguide.com' }}</a></li>
                    <li>{{ $contact['phone'] ?? '+256 700 000 000' }}</li>
                    <li>{{ $contact['address'] ?? 'Kampala, Uganda' }}</li>
                    <li><a href="{{ route('contact') }}">Contact page</a></li>
                </ul>
            </div>
        </div>
        <div class="container footer-note">
            <p>Affiliate notice: booking buttons may redirect to external partner or provider pages. Always verify live availability, rates, inclusions, permits, and final booking terms before paying.</p>
        </div>
    </footer>
</body>
</html>
