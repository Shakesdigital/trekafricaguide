<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ? $title . ' | Trek Africa Guide' : 'Trek Africa Guide — Safari & Travel Directory' }}</title>
    <meta name="description" content="{{ $metaDescription ?? 'Trek Africa Guide helps travelers discover safaris, local experiences, and authentic stays across Africa.' }}">
    <meta name="theme-color" content="#284932">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="scroll-progress" aria-hidden="true"></div>

    <div class="site-shell">
        <header class="site-header">
            <div class="container nav-wrap">
                <a href="{{ route('home') }}" class="logo-mark">
                    <span class="logo-knot" aria-hidden="true">TA</span>
                    <span>
                        <strong>Trek Africa Guide</strong>
                        <small>People, Places & Authentic Adventures</small>
                    </span>
                </a>

                <button type="button" class="menu-toggle" data-nav-toggle aria-label="Toggle navigation">
                    <span></span><span></span><span></span>
                </button>

                <nav class="primary-nav" data-nav-menu>
                    @foreach($navItems as $item)
                        <a href="{{ route($item['route']) }}" class="{{ request()->routeIs($item['route']) ? 'active' : '' }}">{{ $item['label'] }}</a>
                    @endforeach
                </nav>

                <form class="header-search" action="{{ route('destinations.index') }}" method="GET">
                    <label class="sr-only" for="global-search">Search destinations</label>
                    <input id="global-search" name="q" list="global-search-suggestions" type="text" placeholder="Search countries or parks…" value="{{ request('q') }}">
                    <button type="submit">Search</button>
                </form>
            </div>
            <datalist id="global-search-suggestions">
                @foreach($searchSuggestions as $suggestion)
                    <option value="{{ $suggestion }}"></option>
                @endforeach
            </datalist>
        </header>

        <main>
            @yield('content')
        </main>

        <footer class="site-footer">
            <div class="container footer-grid">
                <div>
                    <h3>Trek Africa Guide</h3>
                    <p class="footer-tagline">Directory-first travel inspiration connecting travelers with trusted booking partners and local hosts across all five African regions.</p>
                    <div class="footer-socials">
                        <a href="#" aria-label="Facebook">f</a>
                        <a href="#" aria-label="Instagram">in</a>
                        <a href="#" aria-label="Twitter / X">x</a>
                        <a href="#" aria-label="YouTube">yt</a>
                    </div>
                </div>
                <div>
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="{{ route('regions.index') }}">Regions</a></li>
                        <li><a href="{{ route('destinations.index') }}">Destinations</a></li>
                        <li><a href="{{ route('safaris.index') }}">Safaris & Tours</a></li>
                        <li><a href="{{ route('accommodations.index') }}">Accommodations</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Travel Guides</h4>
                    <ul>
                        <li><a href="{{ route('blog.index') }}?category=Planning+Tips">Planning Tips</a></li>
                        <li><a href="{{ route('blog.index') }}?category=Safety">Safety</a></li>
                        <li><a href="{{ route('blog.index') }}?category=Culture">Culture</a></li>
                        <li><a href="{{ route('experiences.index') }}">Local Experiences</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="{{ route('about') }}">About Us</a></li>
                        <li><a href="{{ route('contact') }}">Contact</a></li>
                        <li><a href="{{ route('blog.index') }}">Blog</a></li>
                    </ul>
                </div>
            </div>
            <div class="container disclaimer-row">
                <p><strong>Affiliate Notice:</strong> Trek Africa Guide is a directory and research platform. We redirect bookings to trusted partners including TravelPayouts, Viator, and GetYourGuide.</p>
            </div>
            <div class="container footer-bottom">
                <p>&copy; {{ date('Y') }} Trek Africa Guide. All rights reserved.</p>
            </div>
        </footer>
    </div>

    <button class="back-to-top" aria-label="Back to top">↑</button>
</body>
</html>
