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
            <span>Directory-first planning with partner booking links for Africa travel.</span>
        </div>
    </div>

    <header class="site-header">
        <div class="container site-header__inner">
            <a href="{{ route('home') }}" class="brand">
                <img src="{{ $logoUrl }}" alt="Trek Africa Guide logo">
                <span>
                    <strong>{{ $siteName ?? 'Trek Africa Guide' }}</strong>
                    <small>African travel guide and booking directory</small>
                </span>
            </a>

            <button class="menu-toggle" type="button" data-nav-toggle aria-label="Toggle navigation">
                <span></span><span></span><span></span>
            </button>

            <nav class="site-nav" data-nav-menu>
                @foreach(($navItems ?? []) as $item)
                    <a href="{{ route($item['route']) }}" class="{{ request()->routeIs($item['route']) ? 'is-active' : '' }}">{{ $item['label'] }}</a>
                @endforeach
                @auth
                    @if(auth()->user()?->isAdmin())
                        <a href="{{ route('admin.index') }}" class="{{ request()->routeIs('admin.*') ? 'is-active' : '' }}">CMS</a>
                    @endif
                @else
                    <a href="{{ route('admin.login') }}" class="{{ request()->routeIs('admin.login') ? 'is-active' : '' }}">Admin Login</a>
                @endauth
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
                <p>Travelers can compare the route logic, nearby stays, dining, and practical access notes on Trek Africa Guide before continuing to external booking partners.</p>
            </div>
            <div>
                <h4>Explore</h4>
                <ul>
                    <li><a href="{{ route('regions.index') }}">Regions</a></li>
                    <li><a href="{{ route('countries.index') }}">Countries</a></li>
                    <li><a href="{{ route('attractions.index') }}">Attractions</a></li>
                    <li><a href="{{ route('accommodations.index') }}">Accommodations</a></li>
                    <li><a href="{{ route('restaurants.index') }}">Restaurants</a></li>
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
                <h4>CMS</h4>
                <ul>
                    @auth
                        @if(auth()->user()?->isAdmin())
                            <li><a href="{{ route('admin.index') }}">Manage content</a></li>
                            <li><a href="{{ route('admin.index', ['tab' => 'page-sections']) }}">Edit homepage sections</a></li>
                            <li><a href="{{ route('admin.index', ['tab' => 'settings']) }}">Brand settings</a></li>
                        @endif
                    @else
                        <li><a href="{{ route('admin.login') }}">Admin login</a></li>
                    @endauth
                </ul>
            </div>
        </div>
        <div class="container footer-note">
            <p>Affiliate notice: booking buttons redirect to external partner pages for the selected listing. Always verify live availability, rates, and final booking terms on the partner side.</p>
        </div>
    </footer>
</body>
</html>
