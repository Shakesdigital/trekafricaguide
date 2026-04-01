<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ? $title . ' | Trek Africa Guide' : 'Trek Africa Guide — Safari & Travel Directory' }}</title>
    <meta name="description" content="{{ $metaDescription ?? 'Trek Africa Guide helps travelers discover destinations, tours, stays, restaurants, and practical travel insight across Africa.' }}">
    <meta name="theme-color" content="#13342b">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="scroll-progress" aria-hidden="true"></div>

    <div class="site-shell">
        <div class="site-topbar">
            <div class="container site-topbar-inner">
                <p>Travel directory, editorial guidance, and affiliate booking pathways for African adventures.</p>
                <span>Compare first, then book on trusted partner landing pages.</span>
            </div>
        </div>

        <header class="site-header">
            <div class="container header-search-strip">
                <form class="header-search" action="{{ route('destinations.index') }}" method="GET">
                    <label class="sr-only" for="global-search">Search destinations</label>
                    <input id="global-search" name="q" list="global-search-suggestions" type="text" placeholder="Search destinations, stays, or countries" value="{{ request('q') }}">
                    <button type="submit">Find</button>
                </form>
            </div>
            <div class="container nav-wrap">
                <a href="{{ route('home') }}" class="logo-mark">
                    <span class="logo-knot" aria-hidden="true">TA</span>
                    <span>
                        <strong>Trek Africa Guide</strong>
                        <small>Africa travel guide and booking directory</small>
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
                    <p class="footer-tagline">A minimalist but comprehensive Africa travel directory built to help travelers discover where to go, what to do, where to stay, and where to eat before they book with verified partners.</p>
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
                        <li><a href="{{ route('accommodations.index') }}">Stays</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Plan Better</h4>
                    <ul>
                        <li><a href="{{ route('restaurants.index') }}">Eat & Drink</a></li>
                        <li><a href="{{ route('experiences.index') }}">Experiences</a></li>
                        <li><a href="{{ route('blog.index') }}?category=Planning+Tips">Planning Tips</a></li>
                        <li><a href="{{ route('blog.index') }}?category=Culture">Culture</a></li>
                        <li><a href="{{ route('blog.index') }}?category=Safety">Safety</a></li>
                    </ul>
                </div>
                <div>
                    <h4>How It Works</h4>
                    <ul>
                        <li><a href="{{ route('about') }}">About Us</a></li>
                        <li><a href="{{ route('contact') }}">Contact</a></li>
                        <li><a href="{{ route('blog.index') }}">Travel Insights</a></li>
                        <li><a href="{{ route('destinations.index') }}">Compare before booking</a></li>
                    </ul>
                </div>
            </div>
            <div class="container disclaimer-row">
                <p><strong>Affiliate Notice:</strong> Trek Africa Guide is a directory and editorial research platform. Booking buttons redirect to partner landing pages such as TravelPayouts-powered offers, Viator, and GetYourGuide.</p>
            </div>
            <div class="container footer-bottom">
                <p>&copy; {{ date('Y') }} Trek Africa Guide. All rights reserved.</p>
            </div>
        </footer>
    </div>

    <button class="back-to-top" aria-label="Back to top">↑</button>
</body>
</html>
