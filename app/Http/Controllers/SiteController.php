<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Country;
use App\Models\PageSection;
use App\Models\Region;
use App\Models\Restaurant;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function home()
    {
        $sections = PageSection::query()
            ->where('page_key', 'home')
            ->orderBy('sort_order')
            ->get()
            ->keyBy('section_key');

        return view('site.home', $this->shared([
            'title' => 'Home',
            'sections' => $sections,
            'featuredRegions' => Region::query()->orderBy('sort_order')->take(4)->get(),
            'featuredAttractions' => Attraction::query()->with('country')->where('featured', true)->orderBy('sort_order')->take(8)->get(),
            'featuredAccommodations' => Accommodation::query()->with(['country', 'attraction'])->where('featured', true)->orderBy('sort_order')->take(4)->get(),
            'featuredRestaurants' => Restaurant::query()->with(['country', 'attraction'])->where('featured', true)->orderBy('sort_order')->take(4)->get(),
        ]));
    }

    public function regions()
    {
        $regions = Region::query()->withCount('countries')->orderBy('sort_order')->get();

        return view('site.regions.index', $this->shared([
            'title' => 'Regions',
            'regions' => $regions,
        ]));
    }

    public function region(Region $region)
    {
        $region->load(['countries' => fn ($query) => $query->orderBy('sort_order')]);

        return view('site.regions.show', $this->shared([
            'title' => $region->name,
            'region' => $region,
            'featuredAttractions' => Attraction::query()->where('region_id', $region->id)->orderBy('featured', 'desc')->orderBy('sort_order')->take(6)->get(),
        ]));
    }

    public function countries(Request $request)
    {
        $countries = Country::query()
            ->with('region')
            ->when($request->string('region')->toString(), function ($query, $regionSlug) {
                $query->whereHas('region', fn ($regionQuery) => $regionQuery->where('slug', $regionSlug));
            })
            ->when($request->string('q')->toString(), function ($query, $search) {
                $query->where(function ($countryQuery) use ($search) {
                    $countryQuery
                        ->where('name', 'like', '%'.$search.'%')
                        ->orWhere('overview', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('sort_order')
            ->get();

        return view('site.countries.index', $this->shared([
            'title' => 'Countries',
            'countries' => $countries,
            'filters' => $request->only(['region', 'q']),
        ]));
    }

    public function country(Country $country)
    {
        $country->load([
            'region',
            'attractions' => fn ($query) => $query->orderByDesc('featured')->orderBy('sort_order'),
            'tourOperators',
        ]);

        return view('site.countries.show', $this->shared([
            'title' => $country->name,
            'country' => $country,
            'accommodations' => Accommodation::query()->where('country_id', $country->id)->with('attraction')->orderByDesc('featured')->orderBy('sort_order')->take(6)->get(),
            'restaurants' => Restaurant::query()->where('country_id', $country->id)->with('attraction')->orderByDesc('featured')->orderBy('sort_order')->take(6)->get(),
        ]));
    }

    public function attractions(Request $request)
    {
        $attractions = Attraction::query()
            ->with(['country', 'region'])
            ->when($request->string('region')->toString(), function ($query, $regionSlug) {
                $query->whereHas('region', fn ($regionQuery) => $regionQuery->where('slug', $regionSlug));
            })
            ->when($request->string('country')->toString(), function ($query, $countrySlug) {
                $query->whereHas('country', fn ($countryQuery) => $countryQuery->where('slug', $countrySlug));
            })
            ->when($request->string('q')->toString(), function ($query, $search) {
                $query->where(function ($attractionQuery) use ($search) {
                    $attractionQuery
                        ->where('name', 'like', '%'.$search.'%')
                        ->orWhere('listing_summary', 'like', '%'.$search.'%')
                        ->orWhere('location_name', 'like', '%'.$search.'%');
                });
            })
            ->orderByDesc('featured')
            ->orderBy('sort_order')
            ->get();

        return view('site.attractions.index', $this->shared([
            'title' => 'Attractions',
            'attractions' => $attractions,
            'filters' => $request->only(['region', 'country', 'q']),
        ]));
    }

    public function attraction(Attraction $attraction)
    {
        $attraction->load(['country.region', 'tourOperators']);

        return view('site.attractions.show', $this->shared([
            'title' => $attraction->name,
            'attraction' => $attraction,
            'accommodations' => Accommodation::query()->where('attraction_id', $attraction->id)->take(4)->get(),
            'restaurants' => Restaurant::query()->where('attraction_id', $attraction->id)->take(4)->get(),
            'relatedAttractions' => Attraction::query()
                ->where('country_id', $attraction->country_id)
                ->whereKeyNot($attraction->id)
                ->orderByDesc('featured')
                ->take(4)
                ->get(),
        ]));
    }

    public function accommodations(Request $request)
    {
        $accommodations = Accommodation::query()
            ->with(['country', 'region', 'attraction'])
            ->when($request->string('region')->toString(), function ($query, $regionSlug) {
                $query->whereHas('region', fn ($regionQuery) => $regionQuery->where('slug', $regionSlug));
            })
            ->when($request->string('country')->toString(), function ($query, $countrySlug) {
                $query->whereHas('country', fn ($countryQuery) => $countryQuery->where('slug', $countrySlug));
            })
            ->when($request->string('q')->toString(), function ($query, $search) {
                $query->where(function ($accommodationQuery) use ($search) {
                    $accommodationQuery
                        ->where('name', 'like', '%'.$search.'%')
                        ->orWhere('listing_summary', 'like', '%'.$search.'%')
                        ->orWhere('location_name', 'like', '%'.$search.'%');
                });
            })
            ->orderByDesc('featured')
            ->orderBy('sort_order')
            ->get();

        return view('site.accommodations.index', $this->shared([
            'title' => 'Accommodations',
            'accommodations' => $accommodations,
            'filters' => $request->only(['region', 'country', 'q']),
        ]));
    }

    public function accommodation(Accommodation $accommodation)
    {
        $accommodation->load(['country.region', 'attraction']);

        return view('site.accommodations.show', $this->shared([
            'title' => $accommodation->name,
            'accommodation' => $accommodation,
            'nearbyAttractions' => Attraction::query()->where('country_id', $accommodation->country_id)->take(4)->get(),
        ]));
    }

    public function restaurants(Request $request)
    {
        $restaurants = Restaurant::query()
            ->with(['country', 'region', 'attraction'])
            ->when($request->string('region')->toString(), function ($query, $regionSlug) {
                $query->whereHas('region', fn ($regionQuery) => $regionQuery->where('slug', $regionSlug));
            })
            ->when($request->string('country')->toString(), function ($query, $countrySlug) {
                $query->whereHas('country', fn ($countryQuery) => $countryQuery->where('slug', $countrySlug));
            })
            ->when($request->string('q')->toString(), function ($query, $search) {
                $query->where(function ($restaurantQuery) use ($search) {
                    $restaurantQuery
                        ->where('name', 'like', '%'.$search.'%')
                        ->orWhere('listing_summary', 'like', '%'.$search.'%')
                        ->orWhere('cuisine', 'like', '%'.$search.'%');
                });
            })
            ->orderByDesc('featured')
            ->orderBy('sort_order')
            ->get();

        return view('site.restaurants.index', $this->shared([
            'title' => 'Restaurants',
            'restaurants' => $restaurants,
            'filters' => $request->only(['region', 'country', 'q']),
        ]));
    }

    public function restaurant(Restaurant $restaurant)
    {
        $restaurant->load(['country.region', 'attraction']);

        return view('site.restaurants.show', $this->shared([
            'title' => $restaurant->name,
            'restaurant' => $restaurant,
            'nearbyAttractions' => Attraction::query()->where('country_id', $restaurant->country_id)->take(4)->get(),
            'nearbyAccommodations' => Accommodation::query()->where('country_id', $restaurant->country_id)->take(4)->get(),
        ]));
    }

    private function shared(array $payload = []): array
    {
        $settings = SiteSetting::query()->get()->pluck('value', 'key');
        $regions = Region::query()->orderBy('sort_order')->get();

        return array_merge([
            'siteName' => $settings['site_name'] ?? 'Trek Africa Guide',
            'siteTagline' => $settings['site_tagline'] ?? '',
            'metaDescription' => $settings['default_meta_description'] ?? '',
            'branding' => [
                'primary' => $settings['primary_color'] ?? '#284932',
                'secondary' => $settings['secondary_color'] ?? '#c56b3d',
                'accent' => $settings['accent_color'] ?? '#c5b580',
                'logo' => $settings['logo_path'] ?? '/logo to edit.png',
            ],
            'navItems' => [
                ['label' => 'Home', 'route' => 'home'],
                ['label' => 'Regions', 'route' => 'regions.index'],
                ['label' => 'Countries', 'route' => 'countries.index'],
                ['label' => 'Attractions', 'route' => 'attractions.index'],
                ['label' => 'Accommodations', 'route' => 'accommodations.index'],
                ['label' => 'Restaurants', 'route' => 'restaurants.index'],
            ],
            'regionsNav' => $regions,
            'filterRegions' => $regions,
            'filterCountries' => Country::query()->with('region')->orderBy('name')->get(),
        ], $payload);
    }
}
