<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class TravelController extends Controller
{
    public function home(Request $request)
    {
        $regions = collect(config('travel.regions'));
        $destinations = collect(config('travel.destinations'));
        $featuredDestinations = $destinations->take(7)->values();
        $featuredTours = collect(config('travel.tours'))->take(4)->values();
        $latestPosts = collect(config('travel.blog_posts'))->take(3)->values();
        $localExperiences = collect(config('travel.local_experiences'))->take(3)->values();

        return view('pages.home', $this->sharedData($request, [
            'title' => 'Home',
            'regions' => $regions,
            'featuredDestinations' => $featuredDestinations,
            'featuredTours' => $featuredTours,
            'latestPosts' => $latestPosts,
            'localExperiences' => $localExperiences,
            'trustSignals' => config('travel.trust_signals', []),
            'heroVideo' => 'https://cdn.coverr.co/videos/coverr-sunset-giraffe-1571848276?download=1080p.mp4',
        ]));
    }

    public function regions(Request $request)
    {
        return view('pages.regions.index', $this->sharedData($request, [
            'title' => 'Regions',
            'regions' => collect(config('travel.regions')),
        ]));
    }

    public function destinations(Request $request)
    {
        $destinations = $this->filterDestinations(collect(config('travel.destinations')), $request)->values();

        return view('pages.destinations.index', $this->sharedData($request, [
            'title' => 'Destinations',
            'destinations' => $destinations,
            'filters' => $this->extractFilters($request),
            'filterOptions' => $this->filterOptions(),
        ]));
    }

    public function destination(Request $request, string $slug)
    {
        $destinations = collect(config('travel.destinations'));
        $destination = $destinations->firstWhere('slug', $slug);

        abort_unless($destination, 404);

        $tours = collect(config('travel.tours'))
            ->where('destination_slug', $slug)
            ->values();

        $accommodations = collect(config('travel.accommodations'))
            ->where('destination_slug', $slug)
            ->values();

        $activities = collect(config('travel.activities.'.$slug, []));
        $localVoices = collect(config('travel.local_voices.'.$slug, []));

        $relatedDestinations = $destinations
            ->where('region', $destination['region'])
            ->where('slug', '!=', $destination['slug'])
            ->take(3)
            ->values();

        return view('pages.destinations.show', $this->sharedData($request, [
            'title' => $destination['name'],
            'destination' => $destination,
            'tours' => $tours,
            'accommodations' => $accommodations,
            'activities' => $activities,
            'localVoices' => $localVoices,
            'relatedDestinations' => $relatedDestinations,
        ]));
    }

    public function safaris(Request $request)
    {
        $tours = $this->filterTours(collect(config('travel.tours')), $request)->values();

        return view('pages.safaris.index', $this->sharedData($request, [
            'title' => 'Safaris & Tours',
            'tours' => $tours,
            'filters' => $this->extractFilters($request),
            'filterOptions' => $this->filterOptions(),
        ]));
    }

    public function accommodations(Request $request)
    {
        $accommodations = $this->filterAccommodations(collect(config('travel.accommodations')), $request)->values();

        return view('pages.accommodations.index', $this->sharedData($request, [
            'title' => 'Accommodations',
            'accommodations' => $accommodations,
            'filters' => $this->extractFilters($request),
            'filterOptions' => $this->filterOptions(),
        ]));
    }

    public function blog(Request $request)
    {
        $posts = $this->filterBlogPosts(collect(config('travel.blog_posts')), $request)->values();

        return view('pages.blog.index', $this->sharedData($request, [
            'title' => 'Travel Guides',
            'categories' => collect(config('travel.blog_categories')),
            'posts' => $posts,
            'filters' => $this->extractFilters($request),
            'filterOptions' => $this->filterOptions(),
        ]));
    }

    public function experiences(Request $request)
    {
        $experiences = $this->filterExperiences(collect(config('travel.local_experiences')), $request)->values();

        return view('pages.experiences.index', $this->sharedData($request, [
            'title' => 'Local Experiences',
            'experiences' => $experiences,
            'filters' => $this->extractFilters($request),
            'filterOptions' => $this->filterOptions(),
        ]));
    }

    public function about(Request $request)
    {
        return view('pages.about', $this->sharedData($request, [
            'title' => 'About',
        ]));
    }

    public function contact(Request $request)
    {
        return view('pages.contact', $this->sharedData($request, [
            'title' => 'Contact',
        ]));
    }

    private function sharedData(Request $request, array $payload = []): array
    {
        $regions = collect(config('travel.regions'));
        $destinations = collect(config('travel.destinations'));
        $countries = $regions->pluck('countries')->flatten()->unique()->sort()->values();
        $parks = $destinations->pluck('name')->unique()->sort()->values();

        return array_merge([
            'siteName' => 'Trek Africa Guide',
            'navItems' => [
                ['label' => 'Home', 'route' => 'home'],
                ['label' => 'Regions', 'route' => 'regions.index'],
                ['label' => 'Destinations', 'route' => 'destinations.index'],
                ['label' => 'Safaris & Tours', 'route' => 'safaris.index'],
                ['label' => 'Accommodations', 'route' => 'accommodations.index'],
                ['label' => 'Travel Guides', 'route' => 'blog.index'],
                ['label' => 'Local Experiences', 'route' => 'experiences.index'],
                ['label' => 'About', 'route' => 'about'],
                ['label' => 'Contact', 'route' => 'contact'],
            ],
            'regionsList' => $regions,
            'countriesList' => $countries,
            'searchSuggestions' => $parks->merge($countries)->unique()->values(),
            'selectedRegion' => $request->query('region'),
            'selectedCountry' => $request->query('country'),
        ], $payload);
    }

    private function filterOptions(): array
    {
        $regions = collect(config('travel.regions'))->map(function (array $region): array {
            return ['slug' => $region['slug'], 'name' => $region['name']];
        })->values();

        $countries = collect(config('travel.regions'))
            ->pluck('countries')
            ->flatten()
            ->unique()
            ->sort()
            ->values();

        return [
            'regions' => $regions,
            'countries' => $countries,
            'price' => ['budget', 'midrange', 'luxury'],
            'safariType' => ['game-drive', 'water-safari', 'desert', 'trekking', 'adventure', 'community', 'cultural'],
            'travelStyle' => ['wildlife', 'photography', 'family', 'adventure', 'culture', 'slow-travel', 'community', 'conservation', 'romantic', 'food'],
            'duration' => ['short', 'medium', 'long'],
        ];
    }

    private function extractFilters(Request $request): array
    {
        return [
            'region' => $request->query('region', ''),
            'country' => $request->query('country', ''),
            'price' => $request->query('price', ''),
            'safari_type' => $request->query('safari_type', ''),
            'travel_style' => $request->query('travel_style', ''),
            'duration' => $request->query('duration', ''),
            'q' => $request->query('q', ''),
            'category' => $request->query('category', ''),
        ];
    }

    private function filterDestinations(Collection $destinations, Request $request): Collection
    {
        $filters = $this->extractFilters($request);

        return $destinations->filter(function (array $destination) use ($filters): bool {
            if ($filters['region'] && $destination['region'] !== $filters['region']) {
                return false;
            }

            if ($filters['country'] && $destination['country'] !== $filters['country']) {
                return false;
            }

            if ($filters['price'] && $destination['price'] !== $filters['price']) {
                return false;
            }

            if ($filters['travel_style'] && ! in_array($filters['travel_style'], $destination['travel_style'], true)) {
                return false;
            }

            if ($filters['q']) {
                $haystack = strtolower($destination['name'].' '.$destination['country'].' '.$destination['summary']);
                if (! str_contains($haystack, strtolower($filters['q']))) {
                    return false;
                }
            }

            return true;
        });
    }

    private function filterTours(Collection $tours, Request $request): Collection
    {
        $filters = $this->extractFilters($request);

        return $tours->filter(function (array $tour) use ($filters): bool {
            if ($filters['region'] && $tour['region'] !== $filters['region']) {
                return false;
            }

            if ($filters['country'] && $tour['country'] !== $filters['country']) {
                return false;
            }

            if ($filters['price'] && $tour['budget'] !== $filters['price']) {
                return false;
            }

            if ($filters['safari_type'] && $tour['type'] !== $filters['safari_type']) {
                return false;
            }

            if ($filters['travel_style'] && $tour['travel_style'] !== $filters['travel_style']) {
                return false;
            }

            if ($filters['duration'] && ! $this->matchDurationBucket((int) $tour['duration'], $filters['duration'])) {
                return false;
            }

            if ($filters['q']) {
                $haystack = strtolower($tour['title'].' '.$tour['country'].' '.$tour['type']);
                if (! str_contains($haystack, strtolower($filters['q']))) {
                    return false;
                }
            }

            return true;
        });
    }

    private function filterAccommodations(Collection $accommodations, Request $request): Collection
    {
        $filters = $this->extractFilters($request);

        return $accommodations->filter(function (array $accommodation) use ($filters): bool {
            if ($filters['region'] && $accommodation['region'] !== $filters['region']) {
                return false;
            }

            if ($filters['country'] && $accommodation['country'] !== $filters['country']) {
                return false;
            }

            if ($filters['price'] && $accommodation['price'] !== $filters['price']) {
                return false;
            }

            if ($filters['travel_style'] && $accommodation['travel_style'] !== $filters['travel_style']) {
                return false;
            }

            if ($filters['q']) {
                $haystack = strtolower($accommodation['name'].' '.$accommodation['country'].' '.$accommodation['type']);
                if (! str_contains($haystack, strtolower($filters['q']))) {
                    return false;
                }
            }

            return true;
        });
    }

    private function filterBlogPosts(Collection $posts, Request $request): Collection
    {
        $filters = $this->extractFilters($request);

        return $posts->filter(function (array $post) use ($filters): bool {
            if ($filters['category'] && $post['category'] !== $filters['category']) {
                return false;
            }

            if ($filters['region'] && $post['region'] !== $filters['region']) {
                return false;
            }

            if ($filters['country'] && $post['country'] !== $filters['country']) {
                return false;
            }

            if ($filters['q']) {
                $haystack = strtolower($post['title'].' '.$post['excerpt']);
                if (! str_contains($haystack, strtolower($filters['q']))) {
                    return false;
                }
            }

            return true;
        });
    }

    private function filterExperiences(Collection $experiences, Request $request): Collection
    {
        $filters = $this->extractFilters($request);

        return $experiences->filter(function (array $experience) use ($filters): bool {
            if ($filters['region'] && $experience['region'] !== $filters['region']) {
                return false;
            }

            if ($filters['country'] && $experience['country'] !== $filters['country']) {
                return false;
            }

            if ($filters['price'] && $experience['price'] !== $filters['price']) {
                return false;
            }

            if ($filters['safari_type'] && $experience['type'] !== $filters['safari_type']) {
                return false;
            }

            if ($filters['travel_style'] && $experience['travel_style'] !== $filters['travel_style']) {
                return false;
            }

            if ($filters['q']) {
                $haystack = strtolower($experience['name'].' '.$experience['bio'].' '.$experience['host']);
                if (! str_contains($haystack, strtolower($filters['q']))) {
                    return false;
                }
            }

            return true;
        });
    }

    private function matchDurationBucket(int $days, string $bucket): bool
    {
        return match ($bucket) {
            'short' => $days <= 3,
            'medium' => $days >= 4 && $days <= 6,
            'long' => $days >= 7,
            default => true,
        };
    }
}
