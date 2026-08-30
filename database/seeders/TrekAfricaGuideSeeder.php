<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\BookingOffer;
use App\Models\Country;
use App\Models\PageSection;
use App\Models\Region;
use App\Models\Restaurant;
use App\Models\SiteSetting;
use App\Models\TourOperator;
use App\Models\MediaAsset;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class TrekAfricaGuideSeeder extends Seeder
{
    public function run(): void
    {
        if (Schema::hasTable('media_assets')) MediaAsset::query()->delete();
        if (Schema::hasTable('booking_offers')) BookingOffer::query()->delete();
        TourOperator::query()->delete();
        Restaurant::query()->delete();
        Accommodation::query()->delete();
        Attraction::query()->delete();
        Country::query()->delete();
        Region::query()->delete();
        PageSection::query()->delete();
        SiteSetting::query()->delete();

        foreach ($this->settings() as $setting) {
            SiteSetting::create($setting + ['is_public' => true]);
        }

        foreach ($this->pageSections() as $section) {
            PageSection::create($section);
        }

        $regions = [];
        foreach ($this->regions() as $index => $region) {
            $region['overview'] .= ' '.$this->regionResearchNote($region['slug']);
            $regions[$region['slug']] = Region::create($region + ['sort_order' => $index + 1]);
        }

        $countries = [];
        foreach ($this->countries() as $index => $country) {
            $region = $regions[$country['region_slug']];
            unset($country['region_slug']);
            $countries[$country['slug']] = Country::create($country + [
                'region_id' => $region->id,
                'sort_order' => $index + 1,
            ]);
        }

        $attractions = [];
        foreach ($this->attractions() as $index => $attraction) {
            $country = $countries[$attraction['country_slug']];
            $region = $country->region;
            unset($attraction['country_slug']);
            $attractions[$attraction['slug']] = Attraction::create($attraction + [
                'region_id' => $region->id,
                'country_id' => $country->id,
                'sort_order' => $index + 1,
            ]);
        }

        foreach ($this->accommodations() as $index => $record) {
            $country = $countries[$record['country_slug']];
            $region = $country->region;
            $attraction = $attractions[$record['attraction_slug']];
            $record['hero_image_url'] = $this->attractionImage($record['attraction_slug']);
            unset($record['country_slug'], $record['attraction_slug']);

            Accommodation::create($record + [
                'region_id' => $region->id,
                'country_id' => $country->id,
                'attraction_id' => $attraction->id,
                'sort_order' => $index + 1,
            ]);
        }

        foreach ($this->restaurants() as $index => $record) {
            $country = $countries[$record['country_slug']];
            $region = $country->region;
            $attraction = $attractions[$record['attraction_slug']];
            $record['hero_image_url'] = $this->attractionImage($record['attraction_slug']);
            unset($record['country_slug'], $record['attraction_slug']);

            Restaurant::create($record + [
                'region_id' => $region->id,
                'country_id' => $country->id,
                'attraction_id' => $attraction->id,
                'sort_order' => $index + 1,
            ]);
        }

        $this->seedBookingOffers();
        $this->seedMediaAssets();

        foreach ($this->tourOperators() as $record) {
            $country = $countries[$record['country_slug']];
            $region = $country->region;
            $attraction = ! empty($record['attraction_slug']) ? $attractions[$record['attraction_slug']] : null;
            unset($record['country_slug'], $record['attraction_slug']);

            TourOperator::create($record + [
                'region_id' => $region->id,
                'country_id' => $country->id,
                'attraction_id' => $attraction?->id,
            ]);
        }

        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@trekafricaguide.com')],
            [
                'name' => env('ADMIN_NAME', 'Trek Africa Guide Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'ChangeMe123!')),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }

    private function seedMediaAssets(): void
    {
        if (! Schema::hasTable('media_assets')) return;
        $models = ['attraction' => Attraction::class, 'accommodation' => Accommodation::class, 'restaurant' => Restaurant::class];
        $assignments = json_decode(file_get_contents(database_path('data/media-assignments.json')), true, flags: JSON_THROW_ON_ERROR);
        foreach ($assignments as $assignment) {
            $model = $models[$assignment['entity_type']] ?? null;
            if (! $model) continue;
            $owner = $model::query()->where('slug', $assignment['entity_slug'])->first();
            if (! $owner) continue;
            $values = collect($assignment)->except(['entity_type', 'entity_slug'])->all();
            $values['url'] = $assignment['local_path'];
            $values['status'] = 'published';
            $owner->mediaAssets()->updateOrCreate(
                ['role' => $assignment['role'], 'source_page' => $assignment['source_page']],
                $values
            );
        }
    }

    private function seedBookingOffers(): void
    {
        if (! Schema::hasTable('booking_offers')) return;
        $booking = [
            'paraa-safari-lodge' => 'https://www.booking.com/hotel/ug/paraa-safari-lodge.en-gb.html',
            'ol-tukai-lodge-amboseli' => 'https://www.booking.com/hotel/ke/ol-tukai-lodge-amboseli.html',
            'serengeti-serena-safari-lodge' => 'https://www.booking.com/hotel/tz/serengeti-serena-safari-lodge.html',
            'emerson-spice' => 'https://www.booking.com/hotel/tz/emersonspice.en-gb.html',
            'maribela-hotel' => 'https://www.booking.com/hotel/et/maribela-lalibela.en-gb.html',
            'ridge-royal-hotel' => 'https://www.booking.com/hotel/gh/ridge-royal-cape-coast.html',
            'les-paletuviers' => 'https://www.booking.com/hotel/sn/les-pala-c-tuviers.es.html',
            'casa-del-papa' => 'https://www.booking.com/hotel/bj/casa-del-papa.en-gb.html',
            'hilton-cabo-verde-sal-resort' => 'https://www.booking.com/hotel/cv/hilton-cabo-verde-sal-resort.html',
            'mount-nelson-a-belmond-hotel' => 'https://www.booking.com/hotel/za/belmond-mount-nelson.en-gb.html',
            'kruger-shalati' => 'https://www.booking.com/hotel/za/kruger-shalati-the-train-on-the-bridge.de.html',
            'sossusvlei-lodge' => 'https://www.booking.com/hotel/na/sossusvlei-lodge.en-gb.html',
            'desert-luxury-camp' => 'https://www.booking.com/hotel/ma/desert-luxury-camp.en-gb.html',
            'marriott-mena-house-cairo' => 'https://www.booking.com/hotel/eg/mena-house-oberoi.en-gb.html',
            'dar-said' => 'https://www.booking.com/hotel/tn/dar-said.fr.html',
        ];
        foreach (Accommodation::query()->get() as $stay) {
            $hasExactBookingPage = isset($booking[$stay->slug]);
            $url = $booking[$stay->slug] ?? 'https://www.booking.com/searchresults.html?ss='.urlencode($stay->name.', '.$stay->location_name);
            $snapshot = match ($stay->name) {
                'Serengeti Serena Safari Lodge' => ['price_amount'=>680, 'price_currency'=>'USD', 'price_unit'=>'night', 'price_checked_at'=>'2026-08-29', 'price_basis'=>'Aug 21–22 2026; 2 adults, 1 room; full board; non-refundable; excludes 18% VAT'],
                'Ridge Royal Hotel' => ['price_amount'=>125, 'price_currency'=>'USD', 'price_unit'=>'night', 'price_checked_at'=>'2026-08-29', 'price_basis'=>'Aug 26–29 2026; 2 adults, 1 room; breakfast; excludes 17.5% VAT and 10% city tax'],
                default => [],
            };
            $stay->bookingOffers()->create(array_merge(['provider'=>'booking','label'=>$hasExactBookingPage ? 'View deal on Booking.com' : 'Compare on Booking.com','source_url'=>$url,'stay22_provider'=>'booking','affiliate_supported'=>true,'active'=>true,'sort_order'=>10], $snapshot));
        }
        $gyg = [
            'bwindi-impenetrable-national-park'=>'https://www.getyourguide.com/en-gb/western-region-uganda-l118965/bwindi-impenetrable-national-park-gorilla-trekking-day-trip-t860183/',
            'murchison-falls-national-park'=>'https://www.getyourguide.com/murchison-falls-l161860/', 'amboseli-national-park'=>'https://www.getyourguide.com/amboseli-national-park-l83994/', 'serengeti-national-park'=>'https://www.getyourguide.com/serengeti-national-park-l123040/', 'zanzibar'=>'https://www.getyourguide.com/zanzibar-l871/', 'volcanoes-national-park'=>'https://www.getyourguide.com/volcanoes-national-park-rwanda-l144502/', 'lalibela'=>'https://www.getyourguide.com/lalibela-l1095/',
        ];
        foreach (Attraction::query()->get() as $item) {
            $item->bookingOffers()->create(['provider'=>'getyourguide','label'=>'Compare tours on GetYourGuide','source_url'=>$gyg[$item->slug] ?? 'https://www.getyourguide.com/s/?q='.urlencode($item->name),'stay22_provider'=>'getyourguide','affiliate_supported'=>true,'active'=>true,'sort_order'=>10]);
        }
        foreach (Restaurant::query()->get() as $restaurant) {
            if ($restaurant->booking_url) {
                $restaurant->bookingOffers()->create(['provider'=>'direct','label'=>'Visit official site','source_url'=>$restaurant->booking_url,'affiliate_supported'=>false,'active'=>true,'sort_order'=>10]);
            }
        }
    }

    private function settings(): array
    {
        return [
            ['group_name' => 'general', 'key' => 'site_name', 'value' => 'Trek Africa Guide'],
            ['group_name' => 'general', 'key' => 'site_tagline', 'value' => 'Africa travel listings, destination insight, stays, restaurants, and partner booking paths for better-planned journeys.'],
            ['group_name' => 'branding', 'key' => 'primary_color', 'value' => '#284932'],
            ['group_name' => 'branding', 'key' => 'secondary_color', 'value' => '#c56b3d'],
            ['group_name' => 'branding', 'key' => 'accent_color', 'value' => '#c5b580'],
            ['group_name' => 'branding', 'key' => 'logo_path', 'value' => '/logo to edit.png'],
            ['group_name' => 'contact', 'key' => 'contact_email', 'value' => 'hello@trekafricaguide.com'],
            ['group_name' => 'contact', 'key' => 'contact_phone', 'value' => '+256 700 000 000'],
            ['group_name' => 'contact', 'key' => 'contact_address', 'value' => 'Kampala, Uganda'],
            ['group_name' => 'contact', 'key' => 'contact_note', 'value' => 'Contact Trek Africa Guide with destination updates, partnership enquiries, or practical traveler feedback.'],
            ['group_name' => 'seo', 'key' => 'default_meta_description', 'value' => 'Compare African destinations, attractions, accommodations, and restaurants with practical travel context before continuing to external booking partners.'],
            ['group_name' => 'seo', 'key' => 'default_og_image', 'value' => '/images/stock/destinations/maasai-mara.jpg'],
        ];
    }

    private function pageSections(): array
    {
        return [
            [
                'page_key' => 'home',
                'section_key' => 'hero',
                'eyebrow' => 'Discover Africa',
                'title' => 'Explore Africa with the context to choose well.',
                'body' => 'Trek Africa Guide brings destinations, attractions, accommodations, restaurants, and practical planning notes into one place, so travelers can compare what fits their route before continuing to external booking partners.',
                'image_url' => '/images/stock/destinations/maasai-mara.jpg',
                'meta' => [
                    'cta_label' => 'Explore regions',
                    'cta_href' => '/regions',
                    'slides' => [
                        [
                            'region' => 'East Africa',
                            'title' => 'Safari plains, primate forests, highland culture, and Indian Ocean extensions.',
                            'body' => 'Compare Kenya, Tanzania, Uganda, Rwanda, and Ethiopia through the experiences they do best, from gorilla trekking and migration safaris to coast and heritage routes.',
                            'image_slot' => 'home-hero-east-africa',
                        ],
                        [
                            'region' => 'West Africa',
                            'title' => 'Heritage coastlines, music cities, Atlantic islands, and slower travel.',
                            'body' => 'Explore Ghana, Senegal, Benin, Sierra Leone, and Cabo Verde through culture, diaspora journeys, beaches, food, and the practical details that shape each route.',
                            'image_slot' => 'home-hero-west-africa',
                        ],
                        [
                            'region' => 'Southern Africa',
                            'title' => 'City-and-bush routes, desert roads, waterfalls, and premium wilderness.',
                            'body' => 'Shape trips around South Africa, Botswana, Namibia, Zimbabwe, and Zambia with clearer context on distances, seasons, lodges, and route pairings.',
                            'image_slot' => 'home-hero-southern-africa',
                        ],
                        [
                            'region' => 'Northern Africa',
                            'title' => 'Medinas, antiquities, desert camps, and Mediterranean light.',
                            'body' => 'Compare Morocco, Egypt, Tunisia, and Algeria as culture-first gateways with notes on access, heat, guide support, food, and desert logistics.',
                            'image_slot' => 'home-hero-northern-africa',
                        ],
                    ],
                ],
                'sort_order' => 1,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'intro',
                'eyebrow' => 'Start with fit',
                'title' => 'Africa is not one travel style. It is many strong choices.',
                'body' => 'Some travelers come for wildlife and primates, others for food, coast, history, design, desert silence, family-friendly resorts, or a meaningful heritage journey. The best trip starts by matching the region, country, attraction, stay, and dining scene to the kind of experience you actually want.',
                'image_url' => '/images/stock/destinations/okavango-delta.jpg',
                'sort_order' => 2,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_regions',
                'eyebrow' => 'Featured Regions',
                'title' => 'Four useful starting points for a smarter Africa trip.',
                'body' => 'Use the regions to compare travel moods first, then narrow into destination countries, attractions, nearby stays, restaurants, and booking paths.',
                'sort_order' => 3,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_attractions',
                'eyebrow' => 'Featured Attractions',
                'title' => 'Attractions that can become the anchor of the journey.',
                'body' => 'Compare place-specific summaries, location context, indicative pricing where verified, and clearly named provider options without leaving the directory first.',
                'sort_order' => 4,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_accommodations',
                'eyebrow' => 'Featured Stays',
                'title' => 'Stays chosen for how they support the route.',
                'body' => 'Compare verified property settings, route position, defining facilities, transfer realities, and the current terms that should be checked directly before booking.',
                'sort_order' => 5,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_restaurants',
                'eyebrow' => 'Featured Restaurants',
                'title' => 'Restaurants and lodge dining that make the place feel complete.',
                'body' => 'Dining listings explain the actual setting, cuisine, signature dishes, access constraints, reservation needs, and how the meal fits the destination.',
                'sort_order' => 6,
            ],
        ];
    }

    private function regions(): array
    {
        return [
            [
                'slug' => 'east-africa',
                'name' => 'East Africa',
                'hero_title' => 'East Africa is where classic safari meets primate forests, highlands, and coast.',
                'hero_text' => 'Start here if your ideal trip includes big wildlife, gorilla or chimpanzee trekking, strong guide networks, and a route that can still end with Indian Ocean calm.',
                'overview' => 'East Africa remains one of the continent’s highest-demand regions for safari, gorilla trekking, coast add-ons, and premium conservation travel. Kenya and Tanzania lead the classic plains circuits, while Uganda and Rwanda anchor primate-led journeys.',
                'countries_intro' => 'These countries work well for travelers who want a strong planning structure: established parks, practical guide support, regional flights, and enough variety to build a trip around wildlife, culture, or coast.',
                'hero_image_url' => '/images/stock/destinations/serengeti-national-park.jpg',
                'hero_image_alt' => 'Serengeti landscape representing East Africa travel',
            ],
            [
                'slug' => 'west-africa',
                'name' => 'West Africa',
                'hero_title' => 'West Africa is rich in heritage, coast, music, food, and slower discovery.',
                'hero_text' => 'Choose this region if you are drawn to Atlantic history, contemporary culture, diaspora travel, warm coastal cities, and trips that feel less packaged.',
                'overview' => 'West Africa is driven by heritage journeys, winter-sun escapes, coastal cities, and community-grounded experiences. Ghana and Senegal are the most polished starting points, while Benin, Sierra Leone, and Cabo Verde broaden the offer considerably.',
                'countries_intro' => 'These countries offer clear pathways into heritage travel, coastal downtime, island breaks, local food, and cultural routes that benefit from thoughtful pacing.',
                'hero_image_url' => '/images/stock/destinations/sine-saloum-delta.jpg',
                'hero_image_alt' => 'Sine-Saloum Delta landscape representing West Africa travel',
            ],
            [
                'slug' => 'southern-africa',
                'name' => 'Southern Africa',
                'hero_title' => 'Southern Africa is built for city-and-bush travel, desert roads, waterfalls, and refined wilderness.',
                'hero_text' => 'This region suits travelers who want choice: luxury lodges, self-drive landscapes, wine country, wildlife, coast, design-led cities, and dramatic natural icons.',
                'overview' => 'Southern Africa is one of the continent’s most versatile travel regions. South Africa acts as the gateway, Botswana and Namibia deliver high-value wilderness and desert landscapes, and Zimbabwe and Zambia deepen the safari-and-Zambezi story.',
                'countries_intro' => 'These countries are strong anchors for travelers comparing infrastructure, lodge quality, road-trip potential, safari depth, and easy add-ons before booking.',
                'hero_image_url' => '/images/stock/destinations/namib-desert.jpg',
                'hero_image_alt' => 'Namib Desert landscape representing Southern Africa travel',
            ],
            [
                'slug' => 'northern-africa',
                'name' => 'Northern Africa',
                'hero_title' => 'Northern Africa is made for medinas, antiquities, desert routes, coast, and food-led travel.',
                'hero_text' => 'Come here for history, architecture, markets, museums, Mediterranean light, Sahara edges, and shorter itineraries with strong aviation access.',
                'overview' => 'Northern Africa is Africa’s volume engine for tourism, driven by Morocco, Egypt, Tunisia, and a growing wave of renewed interest in Algeria. Travelers come for cities, heritage, desert camps, Mediterranean coastlines, and food-led travel.',
                'countries_intro' => 'These countries are useful entry points for travelers comparing culture-forward routes, desert logistics, coast extensions, heat, guide support, and city access.',
                'hero_image_url' => '/images/stock/destinations/marrakech-and-atlas.jpg',
                'hero_image_alt' => 'Marrakech cityscape representing Northern Africa travel',
            ],
        ];
    }

    private function countries(): array
    {
        return [
            $this->country('east-africa', 'uganda', 'Uganda', 'Uganda is one of Africa’s best-value wildlife countries, blending gorilla trekking, chimpanzee tracking, Nile landscapes, and savannah safari parks into one route.', 'Best for travelers who want primates plus classic safari without the price pressure of East Africa’s most premium circuits.', 'Access is strongest through Entebbe with onward road circuits and selective domestic flights into southwestern or northern safari sectors.', 'Dryer months are usually easiest for gorilla trekking trails and game viewing, though Uganda remains rewarding year-round thanks to its mix of forest and river-based experiences.'),
            $this->country('east-africa', 'kenya', 'Kenya', 'Kenya remains the clearest first-time safari gateway thanks to strong guide networks, the Maasai Mara, private conservancies, and smooth access from Nairobi.', 'Best for first safari travelers, migration season planning, and itineraries that combine wildlife with a short coast extension.', 'Nairobi is the main hub for domestic bush flights, private transfers, and overland loops into the Mara, Amboseli, Laikipia, and the coast.', 'July to October is peak migration season, while January to March is excellent for clearer weather and strong game viewing.'),
            $this->country('east-africa', 'tanzania', 'Tanzania', 'Tanzania delivers some of Africa’s most cinematic safari landscapes, from Serengeti migration scenes to the Ngorongoro Crater and Zanzibar’s coast.', 'Best for travelers who want classic northern circuit icons, high-impact wildlife, and a beach finish.', 'Most trips flow through Arusha, Kilimanjaro International Airport, or Dar es Salaam depending on whether the route is inland safari or coast-first.', 'June to October is the cleanest safari season for much of the north, while January to March works well for southern Serengeti calving and beach add-ons.'),
            $this->country('east-africa', 'rwanda', 'Rwanda', 'Rwanda offers a premium, compact travel experience with gorilla trekking, polished logistics, and Kigali as one of Africa’s easiest arrival cities.', 'Best for travelers prioritizing a short, premium primate journey with limited transfer fatigue.', 'Kigali is the entry point for most itineraries, with easy road transfers to Volcanoes National Park and Akagera.', 'Dryer months offer easier trekking conditions, though Rwanda’s appeal is year-round due to its compact distances and managed tourism model.'),
            $this->country('east-africa', 'ethiopia', 'Ethiopia', 'Ethiopia appeals to travelers seeking history, ancient religious sites, mountain scenery, and a very different East African experience from safari-led routes.', 'Best for heritage-focused travelers who want rock-hewn churches, highland scenery, and older civilizational narratives.', 'Addis Ababa functions as the main aviation hub, with onward domestic flights and road transfers to heritage circuits.', 'October to February is often the most comfortable period for cultural touring thanks to drier conditions and major festival dates.'),
            $this->country('west-africa', 'ghana', 'Ghana', 'Ghana is one of West Africa’s easiest entry points, combining strong hospitality, heritage travel, Atlantic coast sites, and a vibrant contemporary cultural scene.', 'Best for diaspora journeys, first-time West Africa travel, and routes that combine history with beaches and rainforest.', 'Accra is the main hub, with road connections to Cape Coast, Kakum, and northern parks.', 'November to March is usually the easiest dry-season window, with December especially busy for cultural events and diaspora travel.'),
            $this->country('west-africa', 'senegal', 'Senegal', 'Senegal offers one of the region’s most polished cultural travel experiences, balancing Dakar’s urban energy with coastal heritage and softer delta landscapes.', 'Best for travelers who want music, art, Atlantic history, and a francophone city-and-coast route.', 'Dakar anchors most itineraries, with onward day trips or short road journeys to Gorée, Sine-Saloum, Saint-Louis, and Petite Côte.', 'November to March is the strongest period for climate comfort, birdlife, and general road conditions.'),
            $this->country('west-africa', 'benin', 'Benin', 'Benin is small but rich in heritage, especially for travelers interested in Ouidah, Ganvié, royal history, and the living traditions of Vodun culture.', 'Best for culturally curious travelers building a Ghana-Benin-Togo heritage route.', 'Most visitors arrive through Cotonou and move by road to Ouidah, Abomey, and Ganvié.', 'Dry-season months from November to February are typically easiest for movement and festival timing.'),
            $this->country('west-africa', 'sierra-leone', 'Sierra Leone', 'Sierra Leone is an emerging leisure destination known for uncrowded beaches, warm hospitality, and a still-lightly-developed coastline.', 'Best for travelers who want a quieter West African beach route with room for local interaction.', 'Most routes begin in Freetown, with ferry or road logistics depending on airport arrival and beach positioning.', 'November to April is the clearest dry-season window for beach travel and easier internal movement.'),
            $this->country('west-africa', 'cabo-verde', 'Cabo Verde', 'Cabo Verde combines island leisure, winter sun, water sports, and relatively easy resort logistics for travelers who want a lighter Atlantic break.', 'Best for sun-and-sea travel, remote work escapes, and easy winter warmth.', 'International arrivals typically connect through Sal or Praia depending on the island focus.', 'November to June is reliable for dry sunshine, while July to October is warmer and can be more humid.'),
            $this->country('southern-africa', 'south-africa', 'South Africa', 'South Africa is the region’s most varied travel gateway, offering city design, wine, beaches, and major safari access within one country.', 'Best for travelers who want broad choice, high infrastructure quality, and easy pre- or post-safari urban time.', 'Cape Town and Johannesburg are the main gateways for city, Winelands, and bush circuits.', 'September to April suits the Cape best, while winter dry months in the north work well for safari.'),
            $this->country('southern-africa', 'botswana', 'Botswana', 'Botswana is a high-value safari market built around the Okavango Delta, Chobe, and low-impact conservation-led travel.', 'Best for travelers prioritizing exclusivity, strong guiding, and wilderness over checklist volume.', 'Routes often move through Maun, Kasane, and fly-in camp links rather than long public road circuits.', 'May to October is the clearest safari season, with flood dynamics shaping the Delta experience.'),
            $this->country('southern-africa', 'namibia', 'Namibia', 'Namibia is one of Africa’s strongest road-trip countries, defined by desert scale, low-density landscapes, and exceptional scenery.', 'Best for self-drive travelers, photographers, and those who prefer landscapes as much as wildlife.', 'Windhoek is the main arrival point, with onward movement by rental 4x4, guided overland journey, or selective fly-in lodges.', 'May to October is especially comfortable for long drives, while shoulder seasons can be superb for light and space.'),
            $this->country('southern-africa', 'zimbabwe', 'Zimbabwe', 'Zimbabwe delivers Victoria Falls, Hwange, and some of Africa’s strongest guiding traditions in a more lightly crowded setting.', 'Best for travelers who value excellent bush guiding and balanced Zambezi-and-wildlife routes.', 'Most routes connect through Victoria Falls town or Harare depending on whether the trip starts with the falls or safari parks.', 'Dry months generally make wildlife viewing easiest, while Victoria Falls changes character dramatically between high and low water.'),
            $this->country('southern-africa', 'zambia', 'Zambia', 'Zambia is revered for walking safaris, strong wildlife density, and a rugged sense of authenticity on the Zambezi and Luangwa systems.', 'Best for travelers who want deeper safari immersion and less processed camp experiences.', 'Livingstone and Lusaka are the most practical gateways for Zambezi and Luangwa-based circuits.', 'June to October is the classic dry-season safari window, especially for South Luangwa and Lower Zambezi.'),
            $this->country('northern-africa', 'morocco', 'Morocco', 'Morocco remains one of Africa’s easiest culture-forward destinations, blending medinas, design hotels, mountain routes, Atlantic surf, and desert camps.', 'Best for short cultural breaks, food-led travel, and travelers wanting a polished entry into Africa.', 'Marrakech, Casablanca, and Tangier are the main gateways, with onward movement by rail, private transfer, or domestic flight.', 'Spring and autumn are the most balanced seasons for city touring and desert-edge travel.'),
            $this->country('northern-africa', 'egypt', 'Egypt', 'Egypt delivers some of the world’s most iconic heritage travel, from Cairo and Giza to Nile cities and Red Sea resorts.', 'Best for travelers focused on antiquities, museums, and a structured city-to-monument route.', 'Cairo is the main gateway, with onward flights, rail, and private touring links to Luxor, Aswan, and the coast.', 'October to April is the most comfortable season for long monument days and city walking.'),
            $this->country('northern-africa', 'tunisia', 'Tunisia', 'Tunisia combines Mediterranean resort ease with Roman ruins, medinas, and Sahara-edge routes at a relatively accessible price point.', 'Best for value-conscious travelers who want coast plus heritage without a very long route.', 'Tunis, Djerba, and the east-coast resort airports shape most visitor access patterns.', 'Spring and autumn are ideal for balancing beaches, old towns, and inland excursions.'),
            $this->country('northern-africa', 'algeria', 'Algeria', 'Algeria remains under-visited compared with its neighbors, but it offers major Saharan and archaeological rewards for travelers seeking a less conventional North Africa route.', 'Best for seasoned travelers interested in saharan landscapes, archaeology, and lower-tourism density.', 'Algiers and Djanet are the most practical gateways depending on whether the trip centers on coast or desert.', 'Cooler months are essential for Sahara travel, with winter offering the most practical desert conditions.'),
        ];
    }

    private function country(
        string $regionSlug,
        string $slug,
        string $name,
        string $overview,
        string $heroText,
        string $access,
        string $bestTime
    ): array {
        return [
            'region_slug' => $regionSlug,
            'slug' => $slug,
            'name' => $name,
            'hero_title' => $name.' Travel Guide',
            'hero_text' => $heroText,
            'overview' => $overview.' '.$this->countryResearchNote($slug),
            'access_summary' => $access,
            'best_time' => $bestTime,
            'planning_tips' => $this->countryPlanningTips($slug),
            'hero_image_url' => $this->countryImage($slug),
            'hero_image_alt' => $name.' destination landscape',
            'gallery' => [$this->countryImage($slug)],
        ];
    }

    private function attractions(): array
    {
        return [
            $this->attraction('uganda', 'bwindi-impenetrable-national-park', 'Bwindi Impenetrable National Park', 'Southwestern Uganda', 'Mountain gorilla trekking in one of Africa’s most powerful forest landscapes.', 'Bwindi works best for travelers who understand that the reward is not speed or comfort, but the emotional intensity of one hour with a habituated gorilla family after a demanding forest trek.', 'Most travelers fly into Entebbe and continue by domestic flight or a long but scenic road transfer into southwestern Uganda. Permit logistics should be secured early and matched to the correct trekking sector.', 'Drier months usually make the trails easier, though trekking runs year-round.', 4.9, 842, 'From $800'),
            $this->attraction('uganda', 'murchison-falls-national-park', 'Murchison Falls National Park', 'Northern Uganda', 'Uganda’s flagship Nile-and-savannah park with boat safaris, game drives, and the dramatic falls.', 'Murchison is one of the easiest Uganda parks to understand: game drives on the northern bank, a Nile launch to the falls, and strong value for travelers who want wildlife without a very complex route.', 'Drive north from Entebbe or Kampala, or fly to Pakuba or Bugungu and transfer into a lodge near the river or the northern game-drive circuit.', 'Dryer months concentrate wildlife and simplify game drives, but the boat excursion remains rewarding throughout the year.', 4.7, 615, 'From $45'),
            $this->attraction('kenya', 'maasai-mara', 'Maasai Mara', 'Southwestern Kenya', 'Kenya’s classic safari icon for migration drama, predators, and broad savannah horizons.', 'The Mara is the clearest first safari fit for many travelers because wildlife density is strong, private conservancy options are well developed, and the product ranges from fly-in luxury to more accessible lodge circuits.', 'Most travelers connect through Nairobi and continue by bush flight or road via Narok depending on budget and time.', 'July to October is most famous for migration crossings, but January to March is also excellent for game viewing.', 4.9, 1384, 'From $95'),
            $this->attraction('kenya', 'amboseli-national-park', 'Amboseli National Park', 'Southern Kenya', 'Big-elephant country with unforgettable Kilimanjaro backdrops.', 'Amboseli is a strong complement to the Mara because it is visually distinctive, especially for elephant viewing and photography.', 'Reach Amboseli by road from Nairobi or by short bush flight into the greater Kimana and Amboseli airstrip network.', 'June to October and January to March are usually the clearest windows for visibility and wildlife concentration.', 4.8, 724, 'From $70'),
            $this->attraction('tanzania', 'serengeti-national-park', 'Serengeti National Park', 'Northern Tanzania', 'Vast migration landscapes, apex predators, and one of Africa’s strongest safari names.', 'The Serengeti suits travelers who want classic safari scale and are willing to structure the trip around wildlife movement and internal flight timing.', 'Most northern circuit trips start around Arusha and use scheduled flights or long overland transfers depending on which Serengeti zone is in focus.', 'June to October suits dry-season game viewing, while January to March is best for southern calving season.', 4.9, 1196, 'From $110'),
            $this->attraction('tanzania', 'zanzibar', 'Zanzibar', 'Indian Ocean coast of Tanzania', 'A safari-and-coast favorite built around Stone Town, beaches, and slower Indian Ocean pacing.', 'Zanzibar is less about a single sight and more about how the island softens the rhythm after safari with heritage streets, spice history, beach time, and food-forward evenings.', 'Most travelers arrive by short flight from safari hubs or Dar es Salaam, then transfer onward to Stone Town or the beach coast that best fits their pace.', 'June to October and December to February are the most reliable beach seasons.', 4.7, 983, 'From $35'),
            $this->attraction('rwanda', 'volcanoes-national-park', 'Volcanoes National Park', 'Northern Rwanda', 'Premium gorilla trekking with short transfer times from Kigali.', 'Volcanoes is ideal for travelers who want a high-end primate experience without committing to a long overland safari route.', 'Most visitors arrive in Kigali and continue by road in roughly two and a half hours to Musanze and the park edge.', 'Dryer months are easiest for steep forest hiking.', 4.8, 538, 'From $1,500'),
            $this->attraction('ethiopia', 'lalibela', 'Lalibela', 'Northern Ethiopia', 'Rock-hewn churches and one of Africa’s most compelling heritage landscapes.', 'Lalibela is a core stop for travelers interested in sacred architecture, Ethiopian Christianity, and history-led itineraries.', 'Reach Lalibela by domestic flight from Addis Ababa or build it into a longer northern historical circuit.', 'October to February is especially comfortable and often aligns with key religious events.', 4.6, 311, 'From $28'),
            $this->attraction('ghana', 'cape-coast-kakum', 'Cape Coast & Kakum', 'Central Ghana', 'Atlantic heritage castles paired with rainforest canopy walks.', 'This pairing works because it combines Ghana’s most emotionally significant heritage sites with easy-access nature in a manageable two- to three-day route.', 'Drive west from Accra toward Cape Coast, then continue inland to Kakum for the canopy walk and forest reserve.', 'November to March usually offers the easiest road conditions and strongest general comfort.', 4.7, 429, 'From $18'),
            $this->attraction('senegal', 'sine-saloum-delta', 'Sine-Saloum Delta', 'Coastal Senegal', 'A softer Senegal route of waterways, birdlife, and lodge-based slow travel.', 'Sine-Saloum suits travelers who want to move at a gentler pace, combining boat movement, village context, and lighter wildlife rather than a city-heavy itinerary.', 'Most travelers continue south by road from Dakar or Petite Côte and transfer by boat into delta lodges.', 'November to March is the easiest season for water movement, birding, and general weather balance.', 4.6, 202, 'From $40'),
            $this->attraction('benin', 'ouidah-and-ganvie', 'Ouidah & Ganvié', 'Southern Benin', 'A compact heritage route linking Atlantic history with the famous stilt village.', 'The strongest Benin route usually combines Ouidah’s history and spiritual culture with Ganvié’s watery village landscape.', 'Base through Cotonou and move by road to Ouidah and by organized boat excursion toward Ganvié.', 'Dry-season months make movement simpler and improve reliability for combined day touring.', 4.5, 176, 'From $26'),
            $this->attraction('sierra-leone', 'tokeh-and-river-no2', 'Tokeh & River No. 2 Beach', 'Freetown Peninsula', 'An easy Sierra Leone coast escape with striking beaches and a laid-back mood.', 'These beaches are the clearest leisure entry points for travelers who want to understand Sierra Leone’s upside as an emerging coastal destination.', 'Most visitors base through Freetown and continue by road to the peninsula beaches.', 'November to April is best for sunshine, lower humidity, and smoother road conditions.', 4.6, 148, 'From $14'),
            $this->attraction('cabo-verde', 'sal-island', 'Sal Island', 'Cabo Verde', 'Reliable winter sun, beaches, and water sports.', 'Sal works well for travelers who want a simple Atlantic island break with dependable resort logistics and a wide range of packaged travel options.', 'International flights arrive directly into Sal, making transfers to the hotel zone simple.', 'November to June is the strongest period for dry sunshine and wind sports.', 4.5, 564, 'From $22'),
            $this->attraction('south-africa', 'cape-town', 'Cape Town', 'Western Cape', 'A design-led city with ocean views, wine access, and easy day trips.', 'Cape Town is one of the continent’s best urban anchors, particularly for travelers who want city life, food, and a softer landing before or after safari.', 'Fly into Cape Town International Airport and base in the city bowl, Atlantic Seaboard, or Winelands edge depending on the pace you want.', 'October to April is ideal for city, coast, and wine country combinations.', 4.8, 1675, 'From $20'),
            $this->attraction('south-africa', 'kruger-national-park', 'Kruger National Park', 'Mpumalanga and Limpopo', 'A major Big Five safari zone with wide lodge choice and strong self-drive or guided options.', 'Kruger is one of Africa’s most flexible safari products because travelers can choose public park camps, private reserves, or high-end concessions.', 'Most routes begin via Johannesburg and continue by road or regional flight to Skukuza, Hoedspruit, or Nelspruit.', 'May to September is the classic dry-season safari window.', 4.8, 913, 'From $85'),
            $this->attraction('botswana', 'okavango-delta', 'Okavango Delta', 'Northern Botswana', 'One of Africa’s most exclusive safari ecosystems with mokoro channels and floodplain camps.', 'The Delta is best for travelers who value wilderness intimacy, guiding quality, and a low-density safari atmosphere.', 'Most itineraries route through Maun and continue by charter or light aircraft into camps.', 'July to October is the classic flood-and-dry-season viewing period, though timing varies by concession.', 4.9, 341, 'From $550'),
            $this->attraction('namibia', 'namib-desert', 'Namib Desert', 'Sossusvlei and Namib-Naukluft', 'Towering dunes, cinematic desert light, and an unmatched sense of open space.', 'The Namib Desert is fundamentally a landscape destination, ideal for photographers, couples, and self-drive travelers who want space and visual drama.', 'Travel via Windhoek by road or fly into nearby lodge airstrips depending on route style.', 'May to October usually gives the easiest conditions for long drives and desert exploration.', 4.8, 402, 'From $65'),
            $this->attraction('zimbabwe', 'victoria-falls', 'Victoria Falls', 'Zimbabwe', 'The classic waterfall gateway for rainforest walks, river activities, and onward safari routing.', 'Victoria Falls works as both a stand-alone short break and a transition point into Hwange, Chobe, or Zambia.', 'Most travelers arrive through Victoria Falls Airport and transfer into the town hotel zone.', 'Water levels change the mood dramatically, but the destination functions year-round.', 4.7, 882, 'From $28'),
            $this->attraction('zambia', 'south-luangwa', 'South Luangwa National Park', 'Eastern Zambia', 'One of Africa’s strongest walking safari landscapes.', 'South Luangwa is best for travelers who want guiding depth, intimate game viewing, and a more serious bush atmosphere.', 'Most itineraries move through Lusaka and continue by regional flight into Mfuwe, followed by a lodge transfer.', 'June to October is the clearest safari period, especially later in the dry season.', 4.8, 273, 'From $120'),
            $this->attraction('morocco', 'marrakech-and-atlas', 'Marrakech & Atlas Gateway', 'Morocco', 'A flexible route of medina culture, gardens, riads, and day trips into the Atlas foothills.', 'Marrakech is a strong first North Africa stop because it compresses architecture, food, design, and easy onward movement into one accessible base.', 'Most travelers fly directly into Marrakech and branch out by private transfer or guided day trip toward the mountains and desert edge.', 'Spring and autumn offer the most balanced temperatures for city and mountain travel.', 4.7, 1222, 'From $16'),
            $this->attraction('morocco', 'sahara-dunes', 'Sahara Dunes', 'Merzouga and Erg Chebbi', 'Desert camps, camel routes, and one of Morocco’s most iconic landscape experiences.', 'The Sahara section works best for travelers prepared for long road transfers in exchange for cinematic desert scenery and an overnight camp experience.', 'Most routes reach the dunes by private overland itinerary through the Atlas or by combining flights and transfers via Ouarzazate or Errachidia.', 'November to March is the most comfortable time for desert nights and daytime touring.', 4.6, 611, 'From $55'),
            $this->attraction('egypt', 'cairo-and-giza', 'Cairo & Giza', 'Egypt', 'Pyramids, museums, and Egypt’s most powerful urban heritage gateway.', 'This is the highest-impact starting point for Egypt, but it rewards structured planning and often works best with a driver or guide for day efficiency.', 'Fly into Cairo, then build out the route with guided touring, private transfers, or onward domestic connections to Luxor and the Red Sea.', 'October to April is most comfortable for long sightseeing days.', 4.7, 1535, 'From $18'),
            $this->attraction('tunisia', 'tunis-and-sidi-bou-said', 'Tunis & Sidi Bou Said', 'Tunisia', 'A manageable blend of medina heritage, sea views, and easy cultural touring.', 'This pairing gives travelers a quick sense of Tunisia’s strengths: historic texture, Mediterranean light, and accessible city-scale touring.', 'Arrive via Tunis and continue by short transfer to the medina, coastal neighborhoods, and nearby heritage sites such as Carthage.', 'Spring and autumn are ideal for mixed city and coast sightseeing.', 4.5, 245, 'From $12'),
            $this->attraction('algeria', 'djanet-and-tassili', 'Djanet & Tassili n’Ajjer', 'Southeastern Algeria', 'A saharan expedition route of rock art, desert geology, and extreme remoteness.', 'This is not a casual add-on. It suits seasoned travelers who want a true desert immersion with specialist local logistics.', 'Most journeys connect via Algiers and onward air links or specialist desert operators into Djanet.', 'Winter is essential for workable Sahara conditions.', 4.8, 97, 'From $180'),
        ];
    }

    private function attraction(
        string $countrySlug,
        string $slug,
        string $name,
        string $location,
        string $summary,
        string $detailIntro,
        string $gettingThere,
        string $bestTime,
        float $rating,
        int $reviews,
        string $priceLabel
    ): array {
        $research = $this->attractionResearch($slug);

        return [
            'country_slug' => $countrySlug,
            'slug' => $slug,
            'name' => $name,
            'location_name' => $location,
            'hero_image_url' => $this->attractionImage($slug),
            'hero_image_alt' => $name,
            'listing_summary' => $research['summary'] ?? $summary,
            'detail_intro' => $research['detail_intro'] ?? $detailIntro,
            'full_description' => $research['full_description'] ?? $detailIntro,
            'getting_there' => $research['getting_there'] ?? $gettingThere,
            'best_time' => $research['best_time'] ?? $bestTime,
            'practical_info' => $research['practical_info'],
            'gallery' => $this->galleryImages('attractions', $slug),
            'highlights' => $research['highlights'],
            'rating' => $rating,
            'review_count' => $reviews,
            'price_label' => $priceLabel,
            'booking_url' => 'https://www.getyourguide.com/s/?q='.urlencode($name),
            'featured' => in_array($slug, [
                'bwindi-impenetrable-national-park',
                'maasai-mara',
                'serengeti-national-park',
                'marrakech-and-atlas',
                'cape-town',
                'victoria-falls',
            ], true),
        ];
    }

    private function attractionResearch(string $slug): array
    {
        return match ($slug) {
            'bwindi-impenetrable-national-park' => [
                'full_description' => 'Bwindi is an ancient, steep-sided Albertine Rift rainforest and a UNESCO World Heritage landscape. Its signature experience is tracking a habituated mountain-gorilla family from one of four UWA entry sectors: Buhoma, Ruhija, Rushaga, or Nkuringo. The forest also rewards birders with Albertine Rift endemics, waterfalls, primates, and community-led cultural walks.',
                'practical_info' => 'A permit is tied to a date and entry sector, so confirm the sector before choosing a lodge. Expect mud, tangled vegetation, altitude, and a trek that may last from a short walk to several hours. Visitor feedback most often celebrates the gorilla encounter and expert trackers while warning that fitness, rain gear, gloves, and porter support materially improve the day.',
                'highlights' => ['One closely managed hour with a habituated mountain-gorilla family', 'Buhoma, Ruhija, Rushaga, and Nkuringo forest sectors with distinct access logistics', 'Albertine Rift birds, primates, butterflies, waterfalls, and dense montane forest', 'Community walks and cultural interpretation around the park boundary'],
            ],
            'murchison-falls-national-park' => [
                'full_description' => 'Murchison is Uganda’s largest national park, where the Victoria Nile is forced through a narrow rock gorge before dropping into the Rift Valley. The classic visit combines northern-bank game drives with a boat journey to the base of the falls, where hippos, crocodiles, elephants, buffalo, and waterbirds gather. A delta cruise toward Lake Albert is especially attractive for birders seeking shoebill.',
                'practical_info' => 'Plan activities by river bank and departure point; unnecessary crossings consume wildlife-viewing time. Dry months generally improve roads and concentrate game, while the river remains productive year-round. Visitors commonly praise the boat approach and force of the falls, with heat, long drives, and changing road conditions the main cautions.',
                'highlights' => ['The top-of-falls viewpoint and the Nile compressed through the gorge', 'Boat safari to the base with hippos, crocodiles, and riverbank wildlife', 'Northern-bank drives for giraffe, elephant, buffalo, lion, and Uganda kob', 'Delta birding toward Lake Albert, including the possibility of shoebill'],
            ],
            'maasai-mara' => [
                'full_description' => 'The Maasai Mara is the Kenyan section of the Serengeti-Mara ecosystem, known for open grasslands, exceptional predator density, and seasonal wildebeest movement across the Mara and Talek rivers. Resident wildlife makes it rewarding beyond migration months, while neighboring conservancies add lower vehicle density, night drives, walking, and closer links with Maasai landowners.',
                'practical_info' => 'July through October is associated with river-crossing season, but crossings are never scheduled or guaranteed. Decide whether you want the reserve, a conservancy, or both because activity rules and crowd levels differ. Visitors value big-cat sightings and broad savannah views; peak-season vehicle congestion and long road transfers are recurring trade-offs.',
                'highlights' => ['Lion, cheetah, leopard, hyena, elephant, and plains-game viewing', 'Seasonal wildebeest herds and possible Mara River crossings', 'Sunrise and sunset across open savannah and riverine woodland', 'Conservancy night drives, walks, and Maasai-led interpretation'],
            ],
            'amboseli-national-park' => [
                'full_description' => 'Amboseli is a compact ecosystem of open plains, acacia woodland, seasonal lakebed, and permanent swamps fed by underground water from Kilimanjaro. Large, well-studied elephant families are the signature sight. Observation Hill gives wide views over wetlands and plains, while more than 400 recorded bird species make the park stronger than its famous mountain photographs alone suggest.',
                'practical_info' => 'Kilimanjaro is often clearest soon after dawn, but cloud can hide it in any season; choose Amboseli for elephants and wetlands first. KWS lists road access from Nairobi and light-aircraft access through Kimana airstrip. Visitors praise close elephant encounters and the mountain backdrop, while dust, heat, and busy sightings are common cautions.',
                'highlights' => ['Close viewing of large elephant herds and known family groups', 'Mount Kilimanjaro views across the plains when skies are clear', 'Observation Hill panorama over swamps, lakebed, and wildlife corridors', 'Wetland birdlife, flamingos when conditions suit, and Maasai context'],
            ],
            'serengeti-national-park' => [
                'full_description' => 'Serengeti National Park covers 14,763 square kilometres at the heart of the wider Serengeti-Mara ecosystem. TANAPA highlights the movement of more than 1.5 million wildebeest with zebra and gazelles, alongside an exceptional concentration of lions, leopards, cheetahs, and hyenas. Kopjes, short-grass plains, river corridors, and woodland make each zone feel different.',
                'practical_info' => 'Choose the zone by month: southern plains for calving early in the year, western corridors later, northern Serengeti for dry-season herds and possible river crossings, and Seronera for resident game. Visitors praise scale and predator encounters; long drives, seasonal camp moves, and crowded crossing points require realistic planning and ethical guides.',
                'highlights' => ['The Great Migration across different park zones through the year', 'High concentrations of lion, cheetah, leopard, and spotted hyena', 'Granite kopjes, endless plains, riverine woodland, and more than 500 bird species', 'Balloon safaris, game drives, and carefully managed migration viewing'],
            ],
            'zanzibar' => [
                'full_description' => 'Zanzibar combines a living Swahili trading culture with Indian Ocean beaches. Stone Town’s coral-stone lanes, carved doors, markets, mosques, and waterfront reveal centuries of African, Arab, Indian, and European exchange. Beyond town, spice farms, Jozani forest, dhow trips, reef excursions, and distinct beach coasts make the island far more varied than a resort extension.',
                'practical_info' => 'Match the coast to the trip: northern beaches have less dramatic tides and more activity, while the east coast offers wide tidal flats and quieter stays. Respect local dress away from resorts and check marine conditions. Visitors praise Stone Town atmosphere and warm water; persistent beach selling, tide-dependent swimming, and transfer times are common caveats.',
                'highlights' => ['UNESCO-listed Stone Town lanes, carved doors, markets, and waterfront history', 'Spice farms explaining cloves, vanilla, cinnamon, and island agriculture', 'Jozani forest and the endemic Zanzibar red colobus', 'Dhow sailing, snorkeling, reef trips, and beaches with different tidal rhythms'],
            ],
            'volcanoes-national-park' => [
                'full_description' => 'Volcanoes National Park protects Rwanda’s section of the Virunga volcanic range, with bamboo and montane forest beneath peaks such as Karisimbi, Bisoke, and Sabyinyo. Gorilla trekking is the main draw, complemented by golden-monkey tracking, volcano hikes, and the conservation history associated with Dian Fossey.',
                'practical_info' => 'Gorilla days begin with an early briefing near Kinigi, and the hike can be steep, muddy, and affected by altitude. Confirm permits and rules through official Rwanda channels. Visitors praise efficient organization and intimate gorilla encounters; the high permit cost and physical effort are the principal trade-offs.',
                'highlights' => ['Mountain-gorilla trekking in Rwanda’s Virunga forest', 'Golden-monkey tracking through high-altitude bamboo', 'Views and hikes around the Virunga volcano chain', 'Dian Fossey conservation history and the nearby research campus'],
            ],
            'lalibela' => [
                'full_description' => 'Lalibela is a living Ethiopian Orthodox pilgrimage centre built around eleven medieval churches carved from volcanic rock. The churches form northern and southern groups linked by trenches, passages, courtyards, and symbolic references to Jerusalem; cross-shaped Biete Ghiorgis stands apart as the most recognizable structure.',
                'practical_info' => 'This is an active sacred site, not an archaeological park alone. Dress modestly, remove shoes where required, and expect worshippers, processions, and uneven rock passages. Visitors describe the architecture and living devotion as extraordinary, while protective shelters, altitude, and the need for a knowledgeable guide shape the experience.',
                'highlights' => ['Eleven rock-hewn churches forming a symbolic New Jerusalem', 'The cruciform Biete Ghiorgis viewed from its surrounding trench', 'Biete Medhani Alem, ceremonial passages, courtyards, and hermit spaces', 'Daily worship and major Ethiopian Orthodox pilgrimage festivals'],
            ],
            'cape-coast-kakum' => [
                'full_description' => 'Cape Coast pairs Atlantic forts that document the transatlantic slave trade with Kakum’s tropical forest canopy. Cape Coast Castle’s guided route through dungeons, courtyards, museum displays, and the Door of No Return requires time and emotional space; Kakum shifts the journey into forest ecology and elevated walkways.',
                'practical_info' => 'Avoid compressing the castle and canopy into a rushed half day. The heritage visit is emotionally demanding, and Kakum’s suspended walkway requires comfort with heights and humidity. Visitors value strong guides and the contrast between history and rainforest; canopy crowds and the intensity of the castle narrative are common cautions.',
                'highlights' => ['Cape Coast Castle dungeons, museum, courtyards, and Door of No Return', 'Guided interpretation of the Atlantic slave trade and its human impact', 'Kakum’s suspended canopy walkway above the rainforest', 'Forest birds, butterflies, medicinal plants, and early-morning walks'],
            ],
            'sine-saloum-delta' => [
                'full_description' => 'The Saloum Delta is a cultural and ecological landscape of tidal channels, mangroves, islands, shell mounds, fishing villages, and bird colonies. UNESCO recognizes the long relationship between communities and the estuarine environment, including shell accumulations and burial mounds recording centuries of occupation.',
                'practical_info' => 'A pirogue trip is central, and routes depend on tide, wind, season, and lodge location. Dry months are comfortable and strong for migratory birds. Visitors value quiet waterways, sunsets, and birdlife; mosquitoes, slow road transfers, and limited independent dining are the expected trade-offs.',
                'highlights' => ['Pirogue journeys through mangrove-lined bolongs and tidal channels', 'Pelican, heron, flamingo, raptor, and migratory-bird colonies', 'Historic shell mounds and island cultural landscapes', 'Fishing villages, salt gathering, oysters, and lodge-based sunsets'],
            ],
            'ouidah-and-ganvie' => [
                'full_description' => 'Ouidah and Ganvié reveal distinct parts of southern Benin. Ouidah’s museums, sacred sites, and memorial route interpret Vodun traditions and the violence of the transatlantic slave trade. Ganvié, reached by boat across Lake Nokoué, is a living waterside community with homes, schools, worship spaces, transport, and commerce organized around the lake.',
                'practical_info' => 'Use trained local guides and approach both places as living communities, not staged attractions. Ask before photographing ceremonies or residents, and allow separate time for Ouidah’s difficult history and Ganvié’s daily life. Visitors value cultural depth and boat movement; intrusive photography and rushed tours are the main ethical risks.',
                'highlights' => ['Ouidah’s Route of Enslaved People and Door of No Return memorial', 'Portuguese Fort museum, sacred forest, and living Vodun heritage', 'Boat journey across Lake Nokoué to Ganvié', 'Waterside homes, markets, schools, fishing, and lake transport'],
            ],
            'tokeh-and-river-no2' => [
                'full_description' => 'The Freetown Peninsula combines forested hills with broad Atlantic beaches. Tokeh is known for a long pale-sand bay and resort stays, while River No. 2 is distinguished by its river mouth, community tourism model, seafood lunches, and a dramatic sweep of beach backed by green slopes.',
                'practical_info' => 'Road time from Freetown varies with traffic and weather, and heavy rains affect beach conditions. Confirm swimming safety locally because currents change. Visitors praise uncrowded scenery, warm hospitality, and fresh seafood; service speed, road conditions, and limited evening infrastructure require a relaxed schedule.',
                'highlights' => ['Tokeh’s long beach framed by the Freetown Peninsula hills', 'River No. 2’s estuary, sandbar, and community-managed facilities', 'Fresh grilled fish, lobster, and relaxed beach lunches', 'Boat, fishing, village, and coastal walks arranged locally'],
            ],
            'sal-island' => [
                'full_description' => 'Sal is Cabo Verde’s easiest resort island, but its landscape extends beyond Santa Maria. Pedra de Lume occupies an extinct volcanic crater with historic salt pans, Buracona is known for lava pools and a seasonal Blue Eye light effect, and the trade winds support kitesurfing, windsurfing, and other water sports.',
                'practical_info' => 'The island is dry, windy, and exposed, so sun and wind protection matter. Sea conditions vary by beach and month. Visitors praise reliable winter sunshine and easy resort logistics; the barren landscape, persistent wind, and less cultural depth than Santiago or São Vicente can surprise first-time guests.',
                'highlights' => ['Santa Maria beach, pier activity, cafés, and water sports', 'Pedra de Lume salt pans inside a volcanic crater', 'Buracona lava formations and the seasonal Blue Eye effect', 'Kitesurfing, windsurfing, diving, and turtle excursions in season'],
            ],
            'cape-town' => [
                'full_description' => 'Cape Town is a nature-wrapped city centered on Table Mountain and the Cape Peninsula. A strong visit balances mountain and coast with layered history: Table Mountain or Lion’s Head, Kirstenbosch, Cape Point, penguins at Boulders, Robben Island, District Six, the Bo-Kaap, and food or wine experiences.',
                'practical_info' => 'Weather can close the cableway or ferries with little notice, so keep mountain and Robben Island plans flexible. Use established transport after dark and follow local safety guidance on hikes. Visitors praise scenery, food, and variety; wind, traffic, inequality, and neighborhood-specific safety are recurring realities.',
                'highlights' => ['Table Mountain views, cableway, and hiking routes', 'Cape Peninsula route through Cape Point and Boulders penguins', 'Robben Island and District Six history', 'Kirstenbosch, Atlantic beaches, Cape food, and nearby Winelands'],
            ],
            'kruger-national-park' => [
                'full_description' => 'Kruger is a vast public national park with an extensive road network, rest camps, hides, picnic sites, and ecosystems ranging from southern woodland to the drier north. It supports the Big Five, wild dog, cheetah, abundant antelope, and exceptional birdlife, offering both independent self-drive and guided safari options at scale.',
                'practical_info' => 'Choose a region rather than trying to cover the whole park. Gate times, speed limits, fuel, rest-camp bookings, and distances matter. Visitors value self-drive freedom and wildlife variety; busy southern roads, long distances, and unpredictable sightings reward patience and early starts.',
                'highlights' => ['Self-drive game viewing on a large signed road network', 'Big Five, wild dog, cheetah, hyena, and diverse antelope', 'River viewpoints, dams, hides, picnic sites, and rest-camp loops', 'More than 500 bird species and strong seasonal birding'],
            ],
            'okavango-delta' => [
                'full_description' => 'The Okavango is a rare inland delta where water from the Angolan highlands spreads into Kalahari sands instead of reaching the sea. Its dry-season flood pulse transforms channels, lagoons, islands, and grasslands, concentrating elephant, buffalo, red lechwe, predators, and prolific birdlife.',
                'practical_info' => 'No single camp delivers every activity: permanent-water areas emphasize mokoro and boating, while drier concessions may be stronger for drives. Flood timing varies annually and by location. Visitors praise silence, skilled guides, and water-level perspectives; high fly-in costs, small aircraft, and seasonal activity limits are the trade-offs.',
                'highlights' => ['Mokoro travel through papyrus channels and clear shallow water', 'Floodplains, lagoons, islands, and dry Kalahari woodland in one ecosystem', 'Elephant, red lechwe, buffalo, lion, leopard, wild dog, and birdlife', 'Low-density fly-in camps, guided walks, boating, and concession drives'],
            ],
            'namib-desert' => [
                'full_description' => 'The Sossusvlei section of the Namib is a landscape of towering red dunes, pale clay pans, dark camel-thorn skeletons, and shifting light. Deadvlei’s tree silhouettes, climbable dunes, Sesriem Canyon, and vast gravel plains create one of Africa’s most recognizable photographic environments.',
                'practical_info' => 'Enter early for cooler temperatures and low-angle light, carry water, and understand the final sand-road or shuttle arrangement. Gravel-road distances are slow and punctures are possible. Visitors praise sunrise color and Deadvlei’s scale; heat, crowds at famous dunes, and long drives are common cautions.',
                'highlights' => ['Deadvlei’s white pan, blackened camel-thorn trees, and red dune walls', 'Sunrise or early-morning dune climbs near Sossusvlei', 'Sesriem Canyon and changing desert geology', 'Night skies, open gravel plains, and landscape photography'],
            ],
            'victoria-falls' => [
                'full_description' => 'Mosi-oa-Tunya/Victoria Falls forms the world’s largest curtain of falling water, spanning about 1.7 kilometres across the Zambezi gorge. Spray, rainbows, basalt gorges, rainforest vegetation, and viewpoints on both Zimbabwean and Zambian sides change dramatically with river level.',
                'practical_info' => 'High water brings immense spray and limited visibility at some viewpoints; lower water reveals rock and supports more white-water activities. Check border and activity rules live. Visitors praise the scale and sound, while getting soaked, seasonal visibility, and activity costs are frequent comments.',
                'highlights' => ['Rainforest walk and multiple viewpoints on the Zimbabwean side', 'Main Falls, Rainbow Falls, Devil’s Cataract, and basalt gorges', 'Rainbows, possible lunar rainbows, and immense spray', 'Zambezi cruises, seasonal rafting, scenic flights, and cross-border views'],
            ],
            'south-luangwa' => [
                'full_description' => 'South Luangwa is a wildlife-rich valley shaped by the Luangwa River, oxbow lagoons, ebony groves, and seasonal floodplains. It is closely associated with guided walking safaris and is noted for leopard, lion, elephant, hippo, crocodile, and dense game around shrinking dry-season water.',
                'practical_info' => 'Many camps are seasonal, and walking depends on guide qualifications, age limits, weather, and wildlife. Late dry season is productive but very hot. Visitors value expert guiding, leopard sightings, and intimate bush atmosphere; heat, insects, small aircraft, and remote logistics are the main cautions.',
                'highlights' => ['Guided walking safaris with trained field guides and scouts', 'Strong leopard viewing and active predator ecology', 'Luangwa River, lagoons, hippo pools, and dry-season concentrations', 'Seasonal carmine bee-eaters, elephants, and night drives'],
            ],
            'marrakech-and-atlas' => [
                'full_description' => 'Marrakech combines a nearly thousand-year-old medina with Jemaa el-Fna, dense souks, riad courtyards, Islamic architecture, gardens, and contemporary design. The nearby High Atlas adds villages, valleys, waterfalls, and trailheads, but mountain trips should be chosen for depth rather than treated as quick photo stops.',
                'practical_info' => 'The medina is walkable but disorienting; agree taxi terms, use licensed guides, and verify mountain-road or trail conditions. Summer heat limits sightseeing. Visitors praise sensory energy, riads, food, and craft; sales pressure, traffic, navigation, and rushed Atlas tours are common frustrations.',
                'highlights' => ['Jemaa el-Fna storytellers, musicians, food stalls, and evening atmosphere', 'Medina souks, artisan workshops, riads, and historic funduqs', 'Koutoubia, Ben Youssef Madrasa, Saadian Tombs, and gardens', 'High Atlas valleys, village walks, waterfalls, and mountain scenery'],
            ],
            'sahara-dunes' => [
                'full_description' => 'Erg Chebbi is a compact but dramatic field of wind-shaped dunes beside Merzouga. The experience is defined by changing light, ridge walks, camel or four-wheel-drive approaches, desert camps, and clear night skies. Nearby oases, fossil landscapes, and Gnawa music in Khamlia add context.',
                'practical_info' => 'Merzouga is a long overland journey from Marrakech and belongs in a multi-day route. Confirm camp location, bathroom claims, vehicle transfer, camel duration, meals, and temperatures. Visitors love sunset, stars, and silence; long driving, cold winter nights, heat, and camp-quality variation are recurring cautions.',
                'highlights' => ['Sunrise and sunset across the high ridges of Erg Chebbi', 'Camel, walking, or four-wheel-drive approaches to camps', 'Clear night skies, campfire evenings, and dune silence', 'Khamlia Gnawa music, oasis landscapes, fossils, and nomadic context'],
            ],
            'cairo-and-giza' => [
                'full_description' => 'Cairo and Giza place more than 4,500 years of monumental history beside one of Africa’s largest modern cities. The Giza Plateau contains the pyramids of Khufu, Khafre, and Menkaure, associated temples, smaller pyramids, and the Great Sphinx. The nearby Grand Egyptian Museum brings major collections, including Tutankhamun, into direct conversation with the plateau.',
                'practical_info' => 'Use official tickets and a clear transport plan; heat, distances, traffic, and persistent offers can make an unstructured day tiring. Opening arrangements change. Visitors praise the scale of the pyramids and museum collections, while crowds, traffic, touts, and midday heat are recurring concerns.',
                'highlights' => ['Great Pyramid of Khufu, last surviving Wonder of the Ancient World', 'Khafre and Menkaure complexes, viewpoints, and the Great Sphinx', 'Grand Egyptian Museum galleries, Grand Staircase, and Tutankhamun collection', 'Islamic Cairo, Coptic Cairo, the Egyptian Museum, and Nile context'],
            ],
            'tunis-and-sidi-bou-said' => [
                'full_description' => 'Greater Tunis layers three experiences: the UNESCO-listed medina, the archaeological landscape of Punic and Roman Carthage, and the blue-and-white hill village of Sidi Bou Said. The medina contains souqs, mosques, madrasas, palaces, and gates; Carthage spreads across multiple sites; Sidi Bou Said adds sea views and cafés.',
                'practical_info' => 'Carthage is not one enclosed ruin, so use a route or guide and allow transport between components. The TGM train links Tunis, Carthage, and Sidi Bou Said, though taxis save time. Visitors praise the variety and Mediterranean atmosphere; fragmented ruins, heat, and busy cafés are common caveats.',
                'highlights' => ['Tunis medina souqs, Zitouna surroundings, palaces, and gates', 'Carthage sites including Antonine Baths, Byrsa Hill, ports, and Tophet area', 'Bardo Museum mosaics when open and accessible', 'Sidi Bou Said lanes, traditional doors, cafés, and Gulf views'],
            ],
            'djanet-and-tassili' => [
                'full_description' => 'Tassili n’Ajjer is a vast Saharan plateau of eroded sandstone rock forests, arches, canyons, and more than 15,000 recorded paintings and engravings. The art documents changing climates, wildlife, pastoral life, horses, and camels across millennia, while the geology preserves a lunar landscape carved by water and wind.',
                'practical_info' => 'This is specialist expedition travel. UNESCO notes that tourism is strictly controlled and visitors are accompanied by official guides. Verify permits, routing, security advice, water, camp equipment, vehicle support, and emergency plans. Visitors value silence, rock art, and night skies; remoteness, cold nights, heat, and basic camping demand preparation.',
                'highlights' => ['Prehistoric paintings and engravings spanning thousands of years', 'Eroded sandstone arches, canyons, pillars, and rock forests', 'Evidence of former green-Sahara wildlife and pastoral cultures', 'Multi-day guided trekking or four-wheel-drive expeditions and dark skies'],
            ],
            default => [
                'full_description' => 'This listing is built around the place itself: its landscape, heritage, wildlife, and the experience a traveler will encounter on the ground.',
                'practical_info' => 'Verify current access, opening rules, permits, local guidance, and seasonal conditions before travel.',
                'highlights' => ['Distinctive landscape or cultural setting', 'Signature experiences specific to the place', 'Local interpretation and responsible visitor practices', 'Seasonal conditions that materially shape the visit'],
            ],
        };
    }

    private function regionResearchNote(string $slug): string
    {
        return match ($slug) {
            'east-africa' => 'The region spans migration ecosystems, Albertine Rift forests, volcanic highlands, Swahili coastlines, and major living heritage sites; routes should be built around season, altitude, park zone, and realistic transfer time rather than country counts.',
            'west-africa' => 'Its strongest directory value lies in specific cultural landscapes: Atlantic slave-trade heritage, living Vodun traditions, Sahel and delta ecology, music cities, community-managed beaches, and island cultures that require thoughtful local interpretation.',
            'southern-africa' => 'The region includes highly developed self-drive networks, low-density fly-in wilderness, seasonal inland deltas, desert geology, major river systems, and transboundary conservation areas, so the right transport style matters as much as the destination.',
            'northern-africa' => 'The region connects Mediterranean cities, Islamic urban heritage, ancient Egyptian and Roman sites, Atlas and Saharan landscapes, and living craft and food traditions; heat, sacred-site etiquette, and specialist desert logistics materially shape the trip.',
            default => '',
        };
    }

    private function countryResearchNote(string $slug): string
    {
        return match ($slug) {
            'uganda' => 'Its standout combination is unusually concentrated: mountain gorillas and Albertine Rift endemics in the southwest, chimpanzee forests, Nile-based wildlife at Murchison, and savannah circuits linked by road or domestic flight.',
            'kenya' => 'Beyond the Maasai Mara, Kenya’s planning advantages include conservancies, varied public and private safari models, Amboseli’s wetland-elephant ecosystem, Laikipia, Rift Valley lakes, and direct Indian Ocean extensions.',
            'tanzania' => 'The northern circuit links Tarangire, Ngorongoro, and distinct Serengeti zones, while the south offers lower-density parks and Zanzibar adds a living Swahili heritage landscape rather than beach time alone.',
            'rwanda' => 'Volcanoes, Akagera, Nyungwe, and Kigali combine with relatively short road transfers, but premium permit pricing and limited high-demand lodge inventory make advance sequencing essential.',
            'ethiopia' => 'The destination’s rock-hewn churches, highland landscapes, Islamic and Christian heritage, and regional cultures are exceptional, but flight reliability, regional access, and current official travel advice must be checked close to departure.',
            'ghana' => 'Cape Coast and Elmina demand sensitive heritage interpretation, while Kakum, Accra’s arts and food, Kumasi’s Asante heritage, and northern landscapes reward a route longer than a simple castle day trip.',
            'senegal' => 'Dakar, Gorée, Saint-Louis, the Petite Côte, and the Saloum Delta offer distinct urban, heritage, music, and wetland experiences connected by road and, in the delta, pirogue.',
            'benin' => 'Ouidah, Abomey, Ganvié, Cotonou, and contemporary Vodun practice should be understood as living cultural landscapes; qualified local guides and respectful photography are central to a responsible visit.',
            'sierra-leone' => 'The Freetown Peninsula’s beaches, Tacugama, Bunce Island, and capital history offer a meaningful route, but road, ferry, weather, and service timing require flexible planning.',
            'cabo-verde' => 'The islands differ sharply: Sal and Boa Vista favor resort beaches and wind sports, Santiago carries deeper history, São Vicente centers music and Mindelo, and Santo Antão offers dramatic hiking.',
            'south-africa' => 'Its strength is contrast: Cape Town and the Winelands, self-drive national parks, private reserves, the Garden Route, KwaZulu-Natal, and Johannesburg history can be combined without treating the country as one uniform product.',
            'botswana' => 'Okavango flood levels, Chobe river ecology, Makgadikgadi seasons, concession rules, and light-aircraft logistics determine the experience more than a generic wet-versus-dry calendar.',
            'namibia' => 'Sossusvlei, Swakopmund, Damaraland, Etosha, and the far south are separated by long gravel-road distances; fewer bases and longer stays produce a safer, more rewarding itinerary.',
            'zimbabwe' => 'Victoria Falls, Hwange, Matobo, Mana Pools, and Great Zimbabwe offer far more than a waterfall stop, supported by a strong professional guiding tradition.',
            'zambia' => 'South Luangwa walking safaris, Lower Zambezi river activities, Kafue’s scale, and the Zambian side of Victoria Falls are highly seasonal and best matched to camp-opening dates and transport links.',
            'morocco' => 'Marrakech and Fez medinas, Atlantic cities, the High Atlas, desert-edge valleys, and Erg Chebbi require different pacing; a Sahara overnight from Marrakech is a multi-day overland journey.',
            'egypt' => 'The Giza Plateau and Grand Egyptian Museum now form a powerful paired visit, while Luxor, Aswan, the Nile, Islamic Cairo, Coptic Cairo, and Red Sea routes need structured transport and heat-aware scheduling.',
            'tunisia' => 'Tunis medina, Carthage, Sidi Bou Said, Roman sites such as Dougga and El Jem, Djerba, and Sahara-edge oases create a compact but historically dense route.',
            'algeria' => 'Roman cities, the Kasbah of Algiers, M’Zab, and the Tassili plateau offer exceptional heritage with low visitor density, but visa, guide, permit, flight, and security requirements demand specialist planning.',
            default => '',
        };
    }

    private function accommodations(): array
    {
        return [
            $this->stay('uganda', 'bwindi-impenetrable-national-park', 'sanctuary-gorilla-forest-camp', 'Sanctuary Gorilla Forest Camp', 'Forest safari camp', 'Bwindi Impenetrable National Park, Buhoma sector', 'A long-established forest camp positioned inside the Bwindi area for early gorilla-trekking starts and a quieter rainforest stay.', 'This is a premium choice for travelers who want the lodge itself to feel connected to the gorilla trekking landscape. It suits guests who value forest atmosphere, guide coordination, and avoiding unnecessary transfers on permit days.', 'Confirm the trekking sector before booking. Bwindi permits are sector-specific, so the best lodge is the one that matches the assigned gorilla family departure point.', ['Forest setting', 'Gorilla trekking logistics', 'All-inclusive camp style', 'Guide coordination'], 'From $800 / night', 'https://www.sanctuaryretreats.com/uganda-camps-gorilla-forest-camp', true, 4.8, 318),
            $this->stay('uganda', 'murchison-falls-national-park', 'paraa-safari-lodge', 'Paraa Safari Lodge', 'Safari lodge', 'North bank of the Victoria Nile, Murchison Falls National Park', 'A practical Nile-side lodge for travelers combining boat safaris, falls visits, and northern-bank game drives.', 'Paraa works because it sits close to the main Murchison activity rhythm: early game drives, river launches, and short hops to the ferry and park tracks.', 'Ask whether your itinerary needs the north or south bank. The wrong bank can add avoidable ferry timing and road transfer pressure.', ['Nile-side base', 'Game-drive access', 'Boat safari access', 'Swimming pool'], 'From $220 / night', 'https://paraalodge.com/', true, 4.5, 521),
            $this->stay('kenya', 'maasai-mara', 'governors-camp', "Governors' Camp", 'Safari tented camp', 'Mara River area, Maasai Mara National Reserve', 'A historic tented camp in a strong game-viewing zone, often used by travelers who want classic Mara atmosphere without losing comfort.', "Governors' Camp is a realistic Mara anchor because it is inside the reserve and has a long reputation for wildlife access, guiding, and safari logistics.", 'Peak migration dates sell early. Shoulder seasons can feel calmer while still delivering strong predator and plains game viewing.', ['Tented safari style', 'Game drives', 'Mara River setting', 'Family-friendly options'], 'From $620 / person', 'https://governorscamp.com/', true, 4.7, 684),
            $this->stay('kenya', 'amboseli-national-park', 'ol-tukai-lodge-amboseli', 'Ol Tukai Lodge Amboseli', 'Safari lodge', 'Inside Amboseli National Park', 'A well-known Amboseli base for elephant viewing and Kilimanjaro-facing safari days.', 'Ol Tukai is useful for travelers who want to sleep close to the park action and keep early-morning photography simple when Kilimanjaro is clear.', 'Cloud cover can hide Kilimanjaro even in good seasons. Plan for elephants and wetlands first, with mountain views as a bonus.', ['Inside-park location', 'Elephant viewing', 'Kilimanjaro views', 'Game-drive access'], 'From $300 / night', 'https://oltukailodge.com/', true, 4.6, 477),
            $this->stay('tanzania', 'serengeti-national-park', 'serengeti-serena-safari-lodge', 'Serengeti Serena Safari Lodge', 'Safari lodge', 'Central Serengeti, Tanzania', 'A central Serengeti lodge that fits classic northern-circuit itineraries and travelers who want reliable lodge infrastructure.', 'This stay works for travelers who need a dependable base in the Seronera area, where wildlife density and airstrip access make the logistics easier than more remote seasonal camps.', 'Migration viewing depends on month and zone. Use central Serengeti for all-round wildlife, then move north or south if the migration is the priority.', ['Central Serengeti base', 'Game drives', 'Airstrip access', 'Lodge facilities'], 'From $360 / night', 'https://www.serenahotels.com/serengeti', true, 4.6, 593),
            $this->stay('tanzania', 'zanzibar', 'emerson-spice', 'Emerson Spice', 'Boutique heritage hotel', 'Stone Town, Zanzibar', 'A characterful Stone Town hotel for travelers who want Zanzibar heritage and food culture before or after beach time.', 'Emerson Spice makes sense when Zanzibar is more than a beach stop. It places travelers in the old town texture, close to evening dining, spice history, and walking-scale exploration.', 'Stone Town works best for one or two nights before moving to the beach. Travelers wanting quiet resort space should not base the entire island stay here.', ['Stone Town location', 'Heritage rooms', 'Rooftop dining nearby', 'Walkable old town'], 'From $180 / night', 'https://emersonzanzibar.com/emerson-spice/', true, 4.5, 356),
            $this->stay('rwanda', 'volcanoes-national-park', 'sabyinyo-silverback-lodge', 'Sabyinyo Silverback Lodge', 'Luxury gorilla lodge', 'Near Volcanoes National Park headquarters, Musanze', 'A conservation-linked luxury lodge close to Rwanda gorilla trekking departure points.', 'This lodge is a strong fit for short, premium Rwanda primate itineraries because transfer times from Kigali and park access are both manageable.', 'Rwanda gorilla permits are expensive and limited. Secure permits first, then match the lodge nights around trekking dates.', ['Gorilla trekking base', 'Community ownership model', 'Mountain views', 'Short Kigali transfer'], 'From $1,000 / night', 'https://www.governorscamp.com/properties/sabyinyo-silverback-lodge/', false, 4.8, 241),
            $this->stay('ethiopia', 'lalibela', 'maribela-hotel', 'Maribela Hotel', 'Boutique hotel', 'Lalibela hillside, Northern Ethiopia', 'A hillside hotel option for visitors who want views and straightforward access to Lalibela church touring.', 'Maribela fits a heritage itinerary because it is practical rather than resort-like: comfortable rooms, local views, and easy coordination with guides for the rock-hewn churches.', 'Check current regional travel advice and flight reliability before confirming Ethiopia itineraries, especially outside Addis Ababa.', ['Church touring base', 'Hillside views', 'Guide coordination', 'Restaurant access'], 'From $95 / night', 'https://maribelahotel.com/', false, 4.4, 187),
            $this->stay('ghana', 'cape-coast-kakum', 'ridge-royal-hotel', 'Ridge Royal Hotel', 'City hotel', 'Cape Coast, Central Region', 'A practical Cape Coast base for combining castle visits with a Kakum canopy walkway day.', 'Ridge Royal works for travelers who want comfort near Cape Coast rather than a remote beach resort, especially when the itinerary includes heritage touring and an early Kakum start.', 'Cape Coast and Kakum are best planned with a driver or guided day structure from Accra or a one-night local stay.', ['Cape Coast base', 'Castle access', 'Kakum day trip access', 'Pool'], 'From $140 / night', 'https://ridgeroyalhotel.com/', false, 4.3, 214),
            $this->stay('senegal', 'sine-saloum-delta', 'les-paletuviers', 'Les Paletuviers', 'Delta lodge', 'Toubacouta, Sine-Saloum Delta', 'A delta lodge base for boat trips, birdlife, mangroves, and slower Senegal travel.', 'Les Paletuviers is a better fit than a Dakar hotel for the Sine-Saloum experience because the appeal is water movement, lodge pacing, and access to islands and mangroves.', 'Road time from Dakar is significant. Treat the delta as an overnight or two-night stay rather than a casual city day trip.', ['Boat excursions', 'Birding', 'Mangrove setting', 'Pool'], 'From $160 / night', 'https://www.les-paletuviers.com/', false, 4.4, 168),
            $this->stay('benin', 'ouidah-and-ganvie', 'casa-del-papa', 'Casa del Papa Resort & Spa', 'Coastal resort', 'Between Cotonou and Ouidah, Benin', 'A lagoon-and-coast resort that works as a comfortable base for Ouidah heritage touring.', 'Casa del Papa is realistic for travelers who want more comfort than a basic city hotel while visiting Ouidah, the Route des Esclaves, and nearby coastal communities.', 'Ganvie is usually easier as a separate organized excursion from Cotonou or Abomey-Calavi, so do not assume one hotel is perfect for both Ouidah and Ganvie.', ['Coastal base', 'Ouidah access', 'Pool and spa', 'Driver-friendly location'], 'From $170 / night', 'https://casadelpapa.com/', false, 4.3, 191),
            $this->stay('sierra-leone', 'tokeh-and-river-no2', 'the-place-resort-tokeh', 'The Place Resort at Tokeh Beach', 'Beach resort', 'Tokeh Beach, Freetown Peninsula', 'A beachfront resort option for travelers focusing on Sierra Leone coastline time.', 'The Place is positioned for visitors who want the Freetown Peninsula beach experience with enough structure for a first trip to Sierra Leone.', 'Road transfers from Freetown can vary with traffic and weather. Build in buffer time around airport transfers and beach days.', ['Beachfront setting', 'Peninsula base', 'Restaurant', 'Transfer support'], 'From $190 / night', 'https://www.theplaceatsierra.com/', false, 4.4, 203),
            $this->stay('cabo-verde', 'sal-island', 'hilton-cabo-verde-sal-resort', 'Hilton Cabo Verde Sal Resort', 'Beach resort', 'Santa Maria, Sal Island', 'A polished Santa Maria resort for travelers who want reliable beach logistics and a comfortable Atlantic island base.', 'This is a realistic Sal choice because it sits close to the main visitor zone while still feeling more independent than a full mega-resort package.', 'Sal is strongest for beach, wind sports, and winter sun. Travelers wanting culture-heavy Cabo Verde should add Santiago or Sao Vicente.', ['Beach access', 'Spa', 'Pool', 'Santa Maria base'], 'From $230 / night', 'https://www.hilton.com/en/hotels/sidcvhi-hilton-cabo-verde-sal-resort/', false, 4.5, 624),
            $this->stay('south-africa', 'cape-town', 'mount-nelson-a-belmond-hotel', 'Mount Nelson, A Belmond Hotel', 'Luxury city hotel', 'Gardens, Cape Town', 'A landmark Cape Town hotel that works well for city, coast, food, and Winelands planning.', 'Mount Nelson is a strong urban anchor because it gives travelers a calm base near the city bowl while keeping access practical for Table Mountain, restaurants, and day trips.', 'Cape Town is best planned neighborhood by neighborhood. Choose lodging based on whether the trip prioritizes restaurants, beaches, Winelands, or mountain access.', ['City bowl access', 'Gardens location', 'Pool', 'Classic hotel service'], 'From $650 / night', 'https://www.belmond.com/hotels/africa/south-africa/cape-town/belmond-mount-nelson/', true, 4.8, 882),
            $this->stay('south-africa', 'kruger-national-park', 'kruger-shalati', 'Kruger Shalati - The Train on the Bridge', 'Luxury safari hotel', 'Skukuza, Kruger National Park', 'A distinctive Kruger stay built around restored train carriages on the Selati Bridge over the Sabie River.', 'Kruger Shalati is a realistic high-impact choice for travelers who want the lodge to be part of the experience, not just a bed between game drives.', 'It is premium and highly specific. Budget-focused travelers may prefer SANParks rest camps or lodges outside the park.', ['Bridge setting', 'Game drives', 'Sabie River views', 'Pool'], 'From $800 / night', 'https://www.krugershalati.com/', true, 4.7, 519),
            $this->stay('botswana', 'okavango-delta', 'camp-okavango', 'Camp Okavango', 'Delta safari camp', 'Nxaragha Island, Okavango Delta', 'A water-and-wilderness camp for travelers prioritizing mokoro channels, guided walks, and low-density Delta safari.', 'Camp Okavango works because it reflects the Delta properly: access is usually by light aircraft and the experience is built around water levels, islands, and specialist guiding.', 'Okavango pricing and access are highly seasonal. Confirm flood conditions and activity mix before booking.', ['Mokoro excursions', 'Walking safaris', 'Fly-in access', 'Island setting'], 'From $900 / night', 'https://desertdelta.com/camps/camp-okavango/', false, 4.8, 164),
            $this->stay('namibia', 'namib-desert', 'sossusvlei-lodge', 'Sossusvlei Lodge', 'Desert lodge', 'Near Sesriem Gate, Sossusvlei', 'A practical desert lodge near the Sesriem entrance for early access to Sossusvlei and Deadvlei.', 'Sossusvlei Lodge is a route-logical choice because desert photography depends on early starts, cool mornings, and minimizing the drive to the gate.', 'Self-drive travelers should fuel carefully and avoid underestimating gravel-road distances in Namibia.', ['Sesriem Gate access', 'Desert views', 'Pool', 'Guided excursions'], 'From $260 / night', 'https://sossusvleilodge.com/', false, 4.5, 438),
            $this->stay('zimbabwe', 'victoria-falls', 'victoria-falls-hotel', 'The Victoria Falls Hotel', 'Heritage hotel', 'Victoria Falls town, Zimbabwe', 'A historic hotel within easy reach of the falls rainforest entrance and town activities.', 'This hotel is a classic Victoria Falls base because it makes the waterfall, town, and activity desks easy to combine in a short stay.', 'Falls spray and water volume vary dramatically by month. Match the stay to rafting, photography, or full-flow waterfall priorities.', ['Falls access', 'Heritage setting', 'Activity desks', 'Restaurants'], 'From $420 / night', 'https://www.victoria-falls-hotels.net/', true, 4.7, 731),
            $this->stay('zambia', 'south-luangwa', 'mfuwe-lodge', 'Mfuwe Lodge', 'Safari lodge', 'Mfuwe sector, South Luangwa National Park', 'A well-known South Luangwa lodge for game drives and walking safari access near Mfuwe.', 'Mfuwe Lodge is a realistic first South Luangwa base because it balances strong wildlife access with easier logistics than some deeper seasonal bush camps.', 'Late dry season can be superb for wildlife but hot. Walking safari availability and age rules should be confirmed before booking.', ['Game drives', 'Walking safari access', 'Mfuwe logistics', 'Wildlife-rich setting'], 'From $580 / night', 'https://www.bushcampcompany.com/mfuwe-lodge/', false, 4.7, 255),
            $this->stay('morocco', 'marrakech-and-atlas', 'riad-rosemary', 'Riad Rosemary', 'Boutique riad', 'Marrakech medina', 'A design-led riad choice for travelers who want the medina experience without giving up comfort and calm.', 'Riad Rosemary fits Marrakech because the strongest stays are often courtyard riads that offer a quiet retreat after dense souk and food touring.', 'Medina access can involve walking from vehicle drop-off points. Pack light if staying inside the old city.', ['Medina setting', 'Riad courtyard', 'Rooftop terrace', 'Hammam-style calm'], 'From $240 / night', 'https://riad-rosemary.com/', true, 4.6, 219),
            $this->stay('morocco', 'sahara-dunes', 'desert-luxury-camp', 'Desert Luxury Camp', 'Desert camp', 'Erg Chebbi dunes, Merzouga area', 'A desert camp option for travelers who want the Sahara overnight without presenting it as a quick city excursion.', 'This style of stay is about the landscape: sunset dunes, a camp dinner, stargazing, and a long road journey that must be planned honestly.', 'The Sahara is far from Marrakech. Consider it a multi-day route, not a same-day add-on.', ['Dune setting', 'Camp dinner', 'Stargazing', 'Camel or 4x4 access'], 'From $220 / night', 'https://www.desertluxurycamp.com/', false, 4.5, 286),
            $this->stay('egypt', 'cairo-and-giza', 'marriott-mena-house-cairo', 'Marriott Mena House, Cairo', 'Heritage luxury hotel', 'Giza, Cairo', 'A Giza-side hotel known for pyramid views and easy access to the plateau.', 'Mena House is route-logical for travelers prioritizing Giza, the Grand Egyptian Museum area, and structured Cairo touring with a driver or guide.', 'Cairo traffic is real. Staying near Giza helps pyramid days but does not remove the need for planned transfers to central Cairo sights.', ['Giza location', 'Pyramid views', 'Pool', 'Guided touring base'], 'From $360 / night', 'https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo/overview/', false, 4.7, 1284),
            $this->stay('tunisia', 'tunis-and-sidi-bou-said', 'dar-said', 'Dar Said', 'Boutique hotel', 'Sidi Bou Said, Greater Tunis', 'A boutique base in Sidi Bou Said for travelers pairing Tunis medina, Carthage, and sea-view village time.', 'Dar Said makes sense when the visitor wants a softer, more atmospheric base than a standard city business hotel while staying close to Tunis cultural sites.', 'Use drivers or taxis for efficient movement between Tunis medina, Carthage, and Sidi Bou Said.', ['Sidi Bou Said setting', 'Sea-view village access', 'Pool', 'Carthage nearby'], 'From $190 / night', 'https://www.darsaid.com.tn/', false, 4.4, 251),
            $this->stay('algeria', 'djanet-and-tassili', 'terres-touareg-guest-house', 'Terres Touareg Guest House & Desert Camp', 'Guest house and desert camp', 'Djanet and Tassili n Ajjer routes', 'A specialist Djanet base combining traditional guest-house nights with guided desert camping routes.', 'This is more realistic than listing a conventional hotel because Tassili travel is expedition-led. Accommodation may shift between a Djanet guest house and mobile camps arranged by the operator.', 'Foreign travelers should verify permits, guide requirements, routing, and current security advice before committing to desert travel in southeastern Algeria.', ['Guided desert logistics', 'Guest house nights', 'Mobile camping', 'Rock-art route support'], 'Tour quoted on request', 'https://www.terres-touareg.com/en/home/', false, 4.6, 76),
        ];
    }

    private function restaurants(): array
    {
        return [
            $this->restaurant('uganda', 'bwindi-impenetrable-national-park', 'sanctuary-gorilla-forest-camp-dining', 'Sanctuary Gorilla Forest Camp Dining', 'Lodge dining', 'Buhoma sector, Bwindi', 'Seasonal camp menus and packed trekking lunches', 'A realistic dining option for Bwindi because most visitors eat at their lodge before and after trekking rather than browsing standalone restaurants.', 'Use lodge dining around permit timing. Early breakfasts and packed lunches matter more than restaurant choice on gorilla trekking days.', '$$$', 'https://www.sanctuaryretreats.com/uganda-camps-gorilla-forest-camp', true, 4.5, 126),
            $this->restaurant('uganda', 'murchison-falls-national-park', 'paraa-safari-lodge-dining', 'Paraa Safari Lodge Dining', 'Lodge dining', 'North bank of the Victoria Nile', 'Buffet meals and Nile-view lodge dining', 'Murchison dining is usually lodge-based because game drives and boat departures shape the day. Paraa is practical for travelers staying near the river.', 'Confirm meal times around boat schedules and ferry crossings.', '$$', 'https://paraalodge.com/', true, 4.3, 218),
            $this->restaurant('kenya', 'maasai-mara', 'governors-camp-dining', "Governors' Camp Dining", 'Safari camp dining', 'Mara River area, Maasai Mara', 'Camp breakfasts, bush meals, and classic safari dinners', 'The Mara is not a city restaurant destination; dining is usually tied to camp quality, guide timing, and whether bush meals are included.', 'Check whether drinks, bush meals, and private dining are included in the camp rate.', '$$$', 'https://governorscamp.com/', true, 4.6, 311),
            $this->restaurant('kenya', 'amboseli-national-park', 'ol-tukai-lodge-dining', 'Ol Tukai Lodge Dining', 'Safari lodge dining', 'Inside Amboseli National Park', 'Lodge buffet meals with Amboseli wetland and mountain context', 'Ol Tukai dining works because visitors are usually inside the park for early and late game drives, making lodge meals more realistic than off-site restaurant runs.', 'Plan lunch around game-drive timing and weather; clear-mountain mornings often start early.', '$$', 'https://oltukailodge.com/', true, 4.4, 205),
            $this->restaurant('tanzania', 'serengeti-national-park', 'serengeti-serena-dining', 'Serengeti Serena Safari Lodge Dining', 'Safari lodge dining', 'Central Serengeti', 'Lodge meals and packed safari lunches', 'In the Serengeti, dining realism is about reliable camp meals and packed lunches because wildlife movement and distances dominate the day.', 'Ask your operator which meals are packed, which are at lodge, and whether bush dining has extra cost.', '$$$', 'https://www.serenahotels.com/serengeti', true, 4.4, 244),
            $this->restaurant('tanzania', 'zanzibar', 'the-rock-restaurant-zanzibar', 'The Rock Restaurant Zanzibar', 'Zanzibari seafood', 'Michamvi Pingwe, Zanzibar', 'Seafood platters and ocean-view dining', 'The Rock is a recognizable Zanzibar dining stop for travelers who want one memorable meal between Stone Town culture and beach time.', 'Book ahead and check tides because access and atmosphere change through the day.', '$$$', 'https://www.therockrestaurantzanzibar.com/', true, 4.3, 1028),
            $this->restaurant('rwanda', 'volcanoes-national-park', 'sabyinyo-silverback-lodge-dining', 'Sabyinyo Silverback Lodge Dining', 'Luxury lodge dining', 'Near Volcanoes National Park', 'Multi-course lodge meals and trekking-day breakfasts', 'Volcanoes dining is normally lodge-based because gorilla trekking starts early and travelers return tired from steep forest trails.', 'Coordinate meals with trekking briefings, permit timing, and transfers to or from Kigali.', '$$$$', 'https://www.governorscamp.com/properties/sabyinyo-silverback-lodge/', false, 4.6, 143),
            $this->restaurant('ethiopia', 'lalibela', 'ben-abeba', 'Ben Abeba', 'Ethiopian and international', 'Lalibela hillside', 'Injera platters, local stews, and sunset-view dining', 'Ben Abeba is one of Lalibela s best-known traveler restaurants and pairs well with church touring because it adds landscape and evening atmosphere.', 'Reserve for sunset if possible and arrange transport back to the hotel after dark.', '$$', 'https://benabeba.com/', false, 4.5, 389),
            $this->restaurant('ghana', 'cape-coast-kakum', 'oasis-beach-resort-restaurant', 'Oasis Beach Resort Restaurant', 'Ghanaian and seafood', 'Cape Coast beachfront', 'Grilled fish, jollof rice, and casual beachfront meals', 'Cape Coast dining is casual and practical. Oasis works as a traveler-friendly stop after castle touring or before a Kakum day.', 'Service pace can be relaxed. Build in time rather than squeezing it between guided tours.', '$$', 'https://www.oasisbeach-ghana.com/', false, 4.2, 274),
            $this->restaurant('senegal', 'sine-saloum-delta', 'les-paletuviers-restaurant', 'Les Paletuviers Restaurant', 'Senegalese and seafood lodge dining', 'Toubacouta, Sine-Saloum Delta', 'Fresh fish, Senegalese sauces, and lodge meals', 'In the delta, the best dining is often at the lodge because boat transfers and evening light shape the experience.', 'Ask about half-board or full-board terms because independent dining choices are limited once based in the delta.', '$$', 'https://www.les-paletuviers.com/', false, 4.3, 112),
            $this->restaurant('benin', 'ouidah-and-ganvie', 'casa-del-papa-restaurant', 'Casa del Papa Restaurant', 'Beninese and coastal dining', 'Lagoon coast near Ouidah', 'Grilled fish, local sauces, and resort meals', 'This is a practical meal stop for travelers using Casa del Papa as a comfortable Ouidah-area base rather than hunting for nightlife-style dining.', 'For Ganvie excursions, eat before or after the boat trip and carry water.', '$$', 'https://casadelpapa.com/', false, 4.2, 138),
            $this->restaurant('sierra-leone', 'tokeh-and-river-no2', 'the-place-resort-restaurant', 'The Place Resort Restaurant', 'Beach seafood', 'Tokeh Beach', 'Grilled lobster, fish, rice dishes, and beach meals', 'Beach dining on the peninsula is strongest when tied to the resort or beach base, especially for travelers who want predictable service and transfers.', 'Confirm road transfer timing before dinner if staying outside Tokeh.', '$$', 'https://www.theplaceatsierra.com/', false, 4.3, 167),
            $this->restaurant('cabo-verde', 'sal-island', 'barracuda-restaurant-sal', 'Barracuda Restaurant', 'Cabo Verdean seafood', 'Santa Maria, Sal Island', 'Grilled tuna, lobster, cachupa, and beach-town seafood', 'Santa Maria has a real independent dining scene, and Barracuda fits travelers who want seafood outside the resort buffet rhythm.', 'Reserve during peak winter-sun months and ask about daily fish availability.', '$$', 'https://www.tripadvisor.com/Search?q=Barracuda%20Restaurant%20Santa%20Maria%20Sal%20Cabo%20Verde', false, 4.3, 421),
            $this->restaurant('south-africa', 'cape-town', 'seebamboes-cape-town', 'Seebamboes', 'Contemporary South African seafood', 'Cape Town', 'Cape seafood, local produce, and modern South African flavors', 'Seebamboes reflects Cape Town s current food appeal: local produce, seafood, and a more contemporary expression of South African dining.', 'Cape Town restaurants book up quickly in summer. Reserve ahead and choose transport carefully for evening meals.', '$$$', 'https://seebamboes.co.za/', true, 4.6, 96),
            $this->restaurant('south-africa', 'kruger-national-park', 'kruger-shalati-dining', 'Kruger Shalati Dining', 'Safari hotel dining', 'Skukuza, Kruger National Park', 'Bridge hotel meals, bush breakfasts, and South African lodge dinners', 'Dining at Kruger Shalati is part of the stay, with meals shaped around game drives and the Sabie River setting.', 'If not staying at the property, verify visitor dining access before planning around it.', '$$$$', 'https://www.krugershalati.com/', true, 4.5, 188),
            $this->restaurant('botswana', 'okavango-delta', 'camp-okavango-dining', 'Camp Okavango Dining', 'Delta camp dining', 'Nxaragha Island, Okavango Delta', 'Camp meals, high tea, and safari-day dining', 'Okavango dining is normally included in the camp stay because there are no casual standalone restaurant circuits inside the Delta.', 'Confirm full-board inclusions, dietary needs, and the activity schedule before arrival.', '$$$$', 'https://desertdelta.com/camps/camp-okavango/', false, 4.5, 91),
            $this->restaurant('namibia', 'namib-desert', 'sossusvlei-lodge-restaurant', 'Sossusvlei Lodge Restaurant', 'Desert lodge dining', 'Near Sesriem Gate', 'Grill dinners, breakfast before dune excursions, and lodge buffets', 'This restaurant is practical because desert days start early and travelers need dependable meals close to the Sossusvlei access gate.', 'Pre-book breakfast packs or early meals for Deadvlei sunrise departures.', '$$', 'https://sossusvleilodge.com/', false, 4.3, 284),
            $this->restaurant('zimbabwe', 'victoria-falls', 'lookout-cafe-victoria-falls', 'Lookout Cafe', 'Casual Zambezi gorge dining', 'Victoria Falls, Zimbabwe', 'Lunches, cocktails, and gorge views', 'Lookout Cafe is a realistic Victoria Falls stop because it pairs easily with town-based activities and views over the Batoka Gorge.', 'Book around activity times; weather and high-demand periods can affect seating.', '$$', 'https://www.wildhorizons.co.za/lookout-cafe/', true, 4.5, 743),
            $this->restaurant('zambia', 'south-luangwa', 'mfuwe-lodge-dining', 'Mfuwe Lodge Dining', 'Safari lodge dining', 'Mfuwe sector, South Luangwa', 'Lodge meals and safari-day dining', 'South Luangwa meals are usually attached to camps and lodges because activities start early and the park is not a casual restaurant destination.', 'Tell the lodge about dietary needs before arrival and confirm meal timing around walking safaris.', '$$$', 'https://www.bushcampcompany.com/mfuwe-lodge/', false, 4.5, 133),
            $this->restaurant('morocco', 'marrakech-and-atlas', 'kabana-rooftop', 'Kabana Rooftop', 'Modern Moroccan and international', 'Marrakech medina', 'Tagines, mezze, seafood, and rooftop sunset drinks', 'Kabana works for Marrakech because it gives visitors a polished rooftop meal near the medina after dense souk and garden touring.', 'Reserve for sunset and use a reliable taxi or walking route from your riad.', '$$$', 'https://www.kabana-marrakech.com/', true, 4.4, 812),
            $this->restaurant('morocco', 'sahara-dunes', 'desert-luxury-camp-dining', 'Desert Luxury Camp Dining', 'Moroccan camp dining', 'Erg Chebbi dunes', 'Tagine, couscous, mint tea, and campfire dinners', 'In the dunes, the honest dining experience is camp-based rather than a standalone restaurant. The meal is part of the overnight Sahara rhythm.', 'Confirm whether dinner, breakfast, bottled water, and transfers are included in the camp rate.', '$$$', 'https://www.desertluxurycamp.com/', false, 4.4, 176),
            $this->restaurant('egypt', 'cairo-and-giza', '9-pyramids-lounge', '9 Pyramids Lounge', 'Egyptian and international', 'Giza Plateau, Cairo', 'Mezze, grilled dishes, and pyramid-view dining', '9 Pyramids Lounge is a practical Giza dining option because it keeps travelers close to the plateau rather than adding a cross-city transfer.', 'Access and timing can depend on site operations, so pair it with a guided Giza day rather than an improvised taxi run.', '$$$', 'https://www.tripadvisor.com/Search?q=9%20Pyramids%20Lounge%20Giza', false, 4.3, 685),
            $this->restaurant('tunisia', 'tunis-and-sidi-bou-said', 'dar-zarrouk', 'Dar Zarrouk', 'Tunisian Mediterranean', 'Sidi Bou Said', 'Couscous, seafood, brik, and sea-view dining', 'Dar Zarrouk is a logical Sidi Bou Said meal for travelers pairing Tunis, Carthage, and the blue-and-white village in one cultural circuit.', 'Reserve for terrace seating in good weather and plan transport back to Tunis if not staying in Sidi Bou Said.', '$$$', 'https://www.tripadvisor.com/Search?q=Dar%20Zarrouk%20Sidi%20Bou%20Said', false, 4.3, 477),
            $this->restaurant('algeria', 'djanet-and-tassili', 'terres-touareg-camp-dining', 'Terres Touareg Camp Dining', 'Tuareg desert camp dining', 'Djanet and Tassili n Ajjer routes', 'Camp meals, tea, couscous, and simple desert expedition food', 'For Tassili, dining is part of the guided expedition. A camp cook and simple meals are more realistic than a restaurant listing in the rock-art zones.', 'Verify food, water, permits, guide support, and emergency planning with the operator before departure.', '$$$', 'https://www.terres-touareg.com/en/home/', false, 4.4, 68),
        ];
    }

    private function stayResearchInsight(string $slug): string
    {
        return match ($slug) {
            'sanctuary-gorilla-forest-camp' => 'The defining strengths are Buhoma-sector convenience, forest immersion, attentive trekking support, and occasional gorilla activity near camp; its premium cost only makes sense when the permit sector and inclusions align.',
            'paraa-safari-lodge' => 'Nile views, pool downtime, and access to launches and northern-bank drives are the practical advantages; room category and the atmosphere of a larger lodge should be considered.',
            'governors-camp' => 'Its reserve location, classic tented atmosphere, wildlife around camp, and experienced guiding drive its reputation; peak-season density and differences between Governors properties matter.',
            'ol-tukai-lodge-amboseli' => 'The inside-park position, elephant-rich setting, lawns, and possible Kilimanjaro views are the strengths; it is a traditional full-service lodge rather than a small private camp.',
            'serengeti-serena-safari-lodge' => 'Travelers value the central Seronera position, broad views, pool, and dependable infrastructure; those following a specific migration stage may need a seasonal camp elsewhere.',
            'emerson-spice' => 'Historic Stone Town character, theatrical interiors, rooftop atmosphere, and old-city access define the stay; stairs, street noise, and heritage-building quirks are part of it.',
            'sabyinyo-silverback-lodge' => 'Warm service, spacious cottages, volcano views, fireplaces, and careful trekking support stand out; an early vehicle transfer to the park briefing point is still required.',
            'maribela-hotel' => 'Its value is as a comfortable Lalibela base with local assistance and views; current power, water, transport, room standard, and operating status should be confirmed directly.',
            'ridge-royal-hotel' => 'The property works as a practical Cape Coast base for castle and Kakum days; expectations should focus on location and dependable essentials rather than destination-resort luxury.',
            'les-paletuviers' => 'The delta setting, pool, pirogue excursions, birdlife, and sunsets are the main draw; meal-plan terms and boat activities matter because alternatives are limited in Toubacouta.',
            'casa-del-papa' => 'Guests choose the lagoon-and-beach setting, pools, grounds, and Ouidah access; the resort sits outside the historic centre, making transport planning important.',
            'the-place-resort-tokeh' => 'Beach frontage, pools, quiet surroundings, and seafood are the strongest features; road-transfer time, service pace, and seasonal operating details should be checked.',
            'hilton-cabo-verde-sal-resort' => 'Direct beach access, pools, spa, and reliable resort service near Santa Maria are the advantages; travelers seeking island culture should deliberately spend time outside the property.',
            'mount-nelson-a-belmond-hotel' => 'Gardens, heritage service, afternoon tea, pool, and city-bowl location make it a destination hotel rather than merely a sightseeing base.',
            'kruger-shalati' => 'Train carriages, Selati Bridge position, Sabie River views, and design create the appeal; it is a premium architectural experience that should be compared with simpler park camps.',
            'camp-okavango' => 'Water activities, guiding, island quiet, and an all-inclusive fly-in rhythm define the camp; wildlife and activity mix depend on flood conditions and this is not primarily a vehicle-safari base.',
            'sossusvlei-lodge' => 'Proximity to Sesriem gate, early excursions, desert views, and dependable meals are the practical strengths; compare gate timing with properties located inside the park boundary.',
            'victoria-falls-hotel' => 'Heritage architecture, lawns, falls access, and classic atmosphere attract guests; room categories vary and the choice is strongest for travelers who value history over contemporary design.',
            'mfuwe-lodge' => 'Easy Mfuwe access, productive drives, lagoon wildlife, and seasonal elephant movement through the lodge area are the signatures; it is larger and more permanent than remote bush camps.',
            'riad-rosemary' => 'Intimate design, courtyard calm, roof terrace, and medina position shape the experience; luggage handling and walking access from the nearest vehicle point should be arranged.',
            'desert-luxury-camp' => 'Dune proximity, sunset, stars, private tents, and camp hospitality are the reasons to stay; verify the exact operator, location, bathroom standard, and transfer because similar camp names cause confusion.',
            'marriott-mena-house-cairo' => 'Pyramid views, gardens, pool, and Giza access are the advantages; central Cairo remains a substantial drive away and only specific room categories deliver the best views.',
            'dar-said' => 'Sidi Bou Said atmosphere, traditional architecture, garden, pool, and sea glimpses are the strengths; stairs, vehicle access, and room variation are normal in a historic conversion.',
            'terres-touareg-guest-house' => 'The value lies in specialist Djanet logistics, local guides, guest-house staging, and supported mobile camping rather than conventional hotel amenities.',
            default => 'Judge the property by current route value, operating standard, and verified inclusions rather than a generic star label.',
        };
    }

    private function restaurantResearchInsight(string $slug): string
    {
        return match ($slug) {
            'sanctuary-gorilla-forest-camp-dining' => 'Early breakfasts, packed trekking food, warm post-trek meals, and dietary coordination matter more here than à-la-carte choice.',
            'paraa-safari-lodge-dining' => 'The Nile outlook and convenience between park activities are the strengths; buffet variety and timing vary with occupancy.',
            'governors-camp-dining' => 'Bush breakfasts, sundowners, communal meals, and flexible safari timing define the experience rather than a conventional restaurant menu.',
            'ol-tukai-lodge-dining' => 'The open dining setting and inside-park convenience are the draw, with meals structured around early and late game drives.',
            'serengeti-serena-dining' => 'Dependable breakfasts, buffets, and packed lunches support long wildlife days; expectations should center on safari logistics rather than city-style dining.',
            'the-rock-restaurant-zanzibar' => 'The photogenic offshore setting and tide-changing arrival are as important as the seafood; advance booking, price, and variable tide access recur in visitor feedback.',
            'sabyinyo-silverback-lodge-dining' => 'Thoughtful trekking-day timing, multi-course meals, fireplaces, and attentive dietary service are the defining strengths.',
            'ben-abeba' => 'The sculptural building, hillside panorama, sunset, and Ethiopian dishes make it memorable; transport after dark and a relaxed service pace should be planned.',
            'oasis-beach-resort-restaurant' => 'Beachfront position, grilled fish, Ghanaian staples, and relaxed atmosphere are the appeal; allow generous time for service.',
            'les-paletuviers-restaurant' => 'Fresh local fish, Senegalese flavors, and lodge convenience fit the delta rhythm; half-board and full-board terms should be clarified.',
            'casa-del-papa-restaurant' => 'Lagoon views, grilled seafood, and resort convenience work well after Ouidah touring; menu availability may depend on occupancy and catch.',
            'the-place-resort-restaurant' => 'Beach views and seafood are the core appeal; confirm dinner service and transport if not staying at the resort.',
            'barracuda-restaurant-sal' => 'Fresh fish, lobster, tuna, cachupa, and a Santa Maria atmosphere offer an alternative to hotel buffets; daily catch and reservation demand vary.',
            'seebamboes-cape-town' => 'A concise seafood-led tasting experience and South African ingredients are the focus; reserve well ahead and verify the current menu and venue details.',
            'kruger-shalati-dining' => 'Bridge views, design, and meals integrated with the hotel stay are the draw; access for outside diners should never be assumed.',
            'camp-okavango-dining' => 'Meals, high tea, and activity food are part of the all-inclusive camp rhythm; dietary requirements must be shared before the fly-in.',
            'sossusvlei-lodge-restaurant' => 'Early-breakfast logistics, grill dinners, and Sesriem proximity are the practical strengths; request breakfast packs before dawn departures.',
            'lookout-cafe-victoria-falls' => 'The Batoka Gorge view, open-air deck, cocktails, and activity-centre convenience are widely valued; weather and peak demand affect the best tables.',
            'mfuwe-lodge-dining' => 'Flexible lodge meals and safari timing matter most; communicate dietary needs and walking-safari schedules before arrival.',
            'kabana-rooftop' => 'Rooftop setting, music, sunset atmosphere, and a modern menu attract visitors; reservations and a clear medina route are advisable.',
            'desert-luxury-camp-dining' => 'Tagine, couscous, tea, and campfire service are part of the overnight desert experience; confirm included food and water.',
            '9-pyramids-lounge' => 'The direct pyramid panorama is the primary attraction; access rules, reservations, shade, and current hours should be checked before building a day around it.',
            'dar-zarrouk' => 'Terrace views, Tunisian seafood, couscous, and Sidi Bou Said atmosphere are the strengths; reserve a view table and plan transport back to Tunis.',
            'terres-touareg-camp-dining' => 'Simple expedition meals, bread, tea, and camp cooking support the journey; water, dietary needs, and food storage are safety-critical logistics.',
            default => 'Current menus, operating hours, access rules, and recent diner feedback should be verified directly.',
        };
    }

    private function stay(
        string $countrySlug,
        string $attractionSlug,
        string $slug,
        string $name,
        string $propertyType,
        string $location,
        string $summary,
        string $detailIntro,
        string $practicalInfo,
        array $amenities,
        string $priceLabel,
        string $bookingUrl,
        bool $featured,
        float $rating,
        int $reviews
    ): array {
        return [
            'country_slug' => $countrySlug,
            'attraction_slug' => $attractionSlug,
            'slug' => $slug,
            'name' => $name,
            'property_type' => $propertyType,
            'location_name' => $location,
            'hero_image_url' => $this->stayImage($slug),
            'hero_image_alt' => 'Destination landscape near '.$name,
            'gallery' => $this->galleryImages('accommodations', $slug),
            'listing_summary' => $summary,
            'detail_intro' => $detailIntro.' '.$this->stayResearchInsight($slug),
            'practical_info' => $practicalInfo.' Verify the current room or tent category, meal plan, transfers, activity inclusions, cancellation terms, operating status, and recent guest feedback directly with the property before payment.',
            'amenities' => $amenities,
            'rating' => $rating,
            'review_count' => $reviews,
            'price_label' => $priceLabel,
            'booking_url' => $bookingUrl,
            'featured' => $featured,
        ];
    }

    private function restaurant(
        string $countrySlug,
        string $attractionSlug,
        string $slug,
        string $name,
        string $cuisine,
        string $location,
        string $signatureDish,
        string $summary,
        string $practicalInfo,
        string $priceLabel,
        string $bookingUrl,
        bool $featured,
        float $rating,
        int $reviews
    ): array {
        return [
            'country_slug' => $countrySlug,
            'attraction_slug' => $attractionSlug,
            'slug' => $slug,
            'name' => $name,
            'cuisine' => $cuisine,
            'location_name' => $location,
            'signature_dish' => $signatureDish,
            'hero_image_url' => $this->restaurantImage($slug),
            'hero_image_alt' => 'Destination landscape near '.$name,
            'gallery' => $this->galleryImages('restaurants', $slug),
            'listing_summary' => $summary,
            'detail_intro' => $summary.' '.$this->restaurantResearchInsight($slug),
            'practical_info' => $practicalInfo.' Verify the current menu, prices, opening hours, reservation policy, dietary support, and whether non-resident diners are accepted before travel.',
            'rating' => $rating,
            'review_count' => $reviews,
            'price_label' => $priceLabel,
            'booking_url' => $bookingUrl,
            'featured' => $featured,
        ];
    }

    private function countryPlanningTips(string $slug): string
    {
        return match ($slug) {
            'uganda' => 'Build Uganda around route logic: Entebbe entry, then Kibale, Queen Elizabeth, Bwindi, and Lake Bunyonyi or Lake Mburo when time allows. Gorilla and chimp permits should be secured before lodge choice, and Bwindi accommodation must match the trekking sector.',
            'kenya' => 'Use Nairobi as the gateway, then decide between Maasai Mara reserve access, private conservancy style, Amboseli elephant-and-Kilimanjaro photography, Laikipia variety, and a coast finish. Peak migration dates need early lodge and flight planning.',
            'tanzania' => 'Most first-time routes flow through Arusha, Tarangire or Lake Manyara, Ngorongoro, Serengeti, and Zanzibar. Migration goals should decide the Serengeti zone, while beach nights work best after the safari rather than between park transfers.',
            'rwanda' => 'Rwanda suits compact premium itineraries. Kigali, Volcanoes National Park, and optional Akagera or Nyungwe can work in 3-7 days, but gorilla permits and luxury lodge availability should be verified before confirming dates.',
            'ethiopia' => 'Plan Ethiopia as a flight-supported heritage route. Addis, Lalibela, Gondar, Axum, and the Simien Mountains reward extra days, but regional conditions, domestic flight reliability, and guide support should be checked close to travel.',
            'ghana' => 'Ghana works well as Accra, Cape Coast, Kakum, Kumasi, and beach rest days. Heritage travel benefits from sensitive guiding, realistic road pacing, and enough time to process castle visits rather than rushing them as photo stops.',
            'senegal' => 'Shape Senegal around Dakar, Goree, Saint-Louis or Sine-Saloum, and music or food-led city time. Delta and coast nights should be treated as proper overnights because transfer time can reduce day-trip value.',
            'benin' => 'Benin is strongest with a guide who can interpret Ouidah, Abomey, Ganvie, and Vodun culture respectfully. Avoid treating sacred or heritage sites as casual attractions; plan the route with cultural context and permission.',
            'sierra-leone' => 'Sierra Leone rewards travelers who accept emerging-destination logistics. Keep the route simple around Freetown, Tacugama, Tokeh, River No. 2, and buffer time for road and boat transfers.',
            'cabo-verde' => 'Choose the island before choosing the hotel. Sal is easiest for beach and wind sports, Santiago gives more culture, and Sao Vicente works for music and a different urban feel.',
            'south-africa' => 'South Africa is modular: Cape Town, Winelands, Garden Route, Kruger, private reserves, and KwaZulu-Natal all work differently. Decide whether the trip is self-drive, guided, luxury, family, food-led, or safari-first.',
            'botswana' => 'Botswana is a high-value, low-density safari destination. Okavango, Moremi, Chobe, and Makgadikgadi planning depends on water levels, camp access, light aircraft routes, and whether the budget supports fly-in logistics.',
            'namibia' => 'Namibia is a distance-management destination. Windhoek, Sossusvlei, Swakopmund, Damaraland, and Etosha are rewarding, but self-drivers need fuel planning, gravel-road time, and fewer one-night stops than the map suggests.',
            'zimbabwe' => 'Victoria Falls pairs naturally with Hwange, Matobo, Mana Pools, or a Chobe add-on. Waterfall spray, rafting season, visas, borders, and dry-season wildlife timing should shape the plan.',
            'zambia' => 'Zambia is best for serious safari travelers who value guiding depth. South Luangwa, Lower Zambezi, and Victoria Falls pair well, but seasonal camp closures and walking-safari rules need live confirmation.',
            'morocco' => 'Morocco needs honest distance planning. Marrakech, Fes, the Atlas, Essaouira, and Sahara camps are excellent, but the desert is a multi-day route, not a quick same-day excursion from the medina.',
            'egypt' => 'Egypt is strongest with structured guiding and transfer planning. Cairo and Giza, Luxor, Aswan, Nile cruise sections, and Red Sea time should be sequenced around heat, museum priorities, and flight or rail timing.',
            'tunisia' => 'Tunisia works as a culture-and-coast value route: Tunis, Carthage, Sidi Bou Said, Kairouan, Tozeur, Djerba, and resort nights. Spring and autumn are best for mixing ruins, medinas, and Sahara-edge travel.',
            'algeria' => 'Algeria is a specialist destination. Algiers, Tipaza, Ghardaia, and Djanet require up-to-date checks on permits, guides, regional access, and safety advice, especially for Sahara routes.',
            default => 'Use this guide to compare what the country does best, how its main attractions connect, where stays and restaurants fit into the route, and which details to verify before committing to a booking.',
        };
    }

    private function tourOperators(): array
    {
        $operators = [];

        foreach ($this->countries() as $country) {
            $operators[] = [
                'country_slug' => $country['slug'],
                'attraction_slug' => collect($this->attractions())->firstWhere('country_slug', $country['slug'])['slug'] ?? null,
                'slug' => Str::slug($country['name'].' journey studio'),
                'name' => $country['name'].' Journey Studio',
                'summary' => 'A locally grounded tour operator active in '.$country['name'].', useful for travelers who want attractions, stays, transfers, guide support, and timing shaped into one coherent route.',
                'website_url' => 'https://www.viator.com/searchResults/all?text='.urlencode($country['name'].' tours'),
                'booking_url' => 'https://www.viator.com/searchResults/all?text='.urlencode($country['name'].' tours'),
                'hero_image_url' => $this->countryImage($country['slug']),
                'hero_image_alt' => $country['name'].' tour planning',
                'specialties' => ['Country tours', 'Transfers', 'Private guiding', 'Attraction booking support'],
            ];
        }

        return $operators;
    }

    private function propertyType(string $countrySlug): string
    {
        return match ($countrySlug) {
            'uganda', 'kenya', 'tanzania', 'botswana', 'zambia', 'zimbabwe' => 'Safari lodge',
            'cabo-verde', 'sierra-leone', 'zanzibar' => 'Beach resort',
            'morocco', 'tunisia', 'egypt', 'ethiopia' => 'Boutique hotel',
            default => 'Travel lodge',
        };
    }

    private function stayPrice(string $countrySlug): string
    {
        return match ($countrySlug) {
            'botswana', 'rwanda' => 'From $420 / night',
            'south-africa', 'namibia', 'zambia', 'morocco', 'egypt' => 'From $190 / night',
            default => 'From $110 / night',
        };
    }

    private function restaurantPrice(string $countrySlug): string
    {
        return match ($countrySlug) {
            'botswana', 'rwanda', 'south-africa' => '$$$',
            'morocco', 'egypt', 'tunisia', 'kenya', 'tanzania' => '$$',
            default => '$',
        };
    }

    private function restaurantCuisine(string $countrySlug): string
    {
        return match ($countrySlug) {
            'morocco' => 'Moroccan',
            'egypt' => 'Egyptian & Middle Eastern',
            'tunisia' => 'Tunisian Mediterranean',
            'ghana' => 'Ghanaian',
            'senegal' => 'Senegalese & Atlantic seafood',
            'benin' => 'Beninese',
            'south-africa' => 'Contemporary South African',
            default => 'Regional house cuisine',
        };
    }

    private function signatureDish(string $countrySlug): string
    {
        return match ($countrySlug) {
            'ghana' => 'Jollof rice and grilled fish',
            'senegal' => 'Thieboudienne',
            'morocco' => 'Lamb tagine',
            'egypt' => 'Koshari and mezze',
            'uganda' => 'Luwombo and seasonal produce',
            'south-africa' => 'Braai platters and Cape produce',
            default => 'Chef’s seasonal local plate',
        };
    }

    private function countryImage(string $slug): string
    {
        return $this->attractionImage($this->countryDestination($slug));
    }

    private function attractionImage(string $slug): string
    {
        return $this->stockImage($slug) ?? '/images/generated/attractions/'.$slug.'/01.jpg';
    }

    private function stayImage(string $slug): string
    {
        return $this->stockImage($slug) ?? '/images/generated/accommodations/'.$slug.'/01.jpg';
    }

    private function restaurantImage(string $slug): string
    {
        return $this->stockImage($slug) ?? '/images/generated/restaurants/'.$slug.'/01.jpg';
    }

    private function stockImage(string $slug): ?string
    {
        $base = public_path('images/stock/destinations');
        foreach (glob($base.'/*.jpg') ?: [] as $path) {
            $destination = pathinfo($path, PATHINFO_FILENAME);
            if (Str::contains($slug, $destination) || Str::contains($destination, $slug)) return '/images/stock/destinations/'.$destination.'.jpg';
        }
        return null;
    }

    private function foodImage(string $countrySlug): string
    {
        return $this->attractionImage($this->countryDestination($countrySlug));
    }

    private function regionAccentImage(string $countrySlug): string
    {
        return $this->countryImage($countrySlug);
    }

    private function galleryImages(string $type, string $slug): array
    {
        return [$this->attractionImage($slug)];
    }

    private function countryDestination(string $slug): string
    {
        return match ($slug) {
            'uganda' => 'bwindi-impenetrable-national-park',
            'kenya' => 'maasai-mara',
            'tanzania' => 'serengeti-national-park',
            'rwanda' => 'volcanoes-national-park',
            'ethiopia' => 'lalibela',
            'ghana' => 'cape-coast-kakum',
            'senegal' => 'sine-saloum-delta',
            'benin' => 'ouidah-and-ganvie',
            'sierra-leone' => 'tokeh-and-river-no2',
            'cabo-verde' => 'sal-island',
            'south-africa' => 'cape-town',
            'botswana' => 'okavango-delta',
            'namibia' => 'namib-desert',
            'zimbabwe' => 'victoria-falls',
            'zambia' => 'south-luangwa',
            'morocco' => 'marrakech-and-atlas',
            'egypt' => 'cairo-and-giza',
            'tunisia' => 'tunis-and-sidi-bou-said',
            'algeria' => 'djanet-and-tassili',
            default => 'maasai-mara',
        };
    }
}
