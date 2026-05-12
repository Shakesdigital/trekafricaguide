<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Country;
use App\Models\PageSection;
use App\Models\Region;
use App\Models\Restaurant;
use App\Models\SiteSetting;
use App\Models\TourOperator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TrekAfricaGuideSeeder extends Seeder
{
    public function run(): void
    {
        TourOperator::query()->delete();
        Restaurant::query()->delete();
        Accommodation::query()->delete();
        Attraction::query()->delete();
        Country::query()->delete();
        Region::query()->delete();
        PageSection::query()->delete();
        SiteSetting::query()->delete();

        foreach ($this->settings() as $setting) {
            SiteSetting::create($setting);
        }

        foreach ($this->pageSections() as $section) {
            PageSection::create($section);
        }

        $regions = [];
        foreach ($this->regions() as $index => $region) {
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
            unset($record['country_slug'], $record['attraction_slug']);

            Restaurant::create($record + [
                'region_id' => $region->id,
                'country_id' => $country->id,
                'attraction_id' => $attraction->id,
                'sort_order' => $index + 1,
            ]);
        }

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

    private function settings(): array
    {
        return [
            ['group_name' => 'general', 'key' => 'site_name', 'value' => 'Trek Africa Guide'],
            ['group_name' => 'general', 'key' => 'site_tagline', 'value' => 'African travel guide and booking directory for regions, destination countries, attractions, stays, dining, and trusted partner booking paths.'],
            ['group_name' => 'branding', 'key' => 'primary_color', 'value' => '#284932'],
            ['group_name' => 'branding', 'key' => 'secondary_color', 'value' => '#c56b3d'],
            ['group_name' => 'branding', 'key' => 'accent_color', 'value' => '#c5b580'],
            ['group_name' => 'branding', 'key' => 'logo_path', 'value' => '/logo to edit.png'],
            ['group_name' => 'contact', 'key' => 'contact_email', 'value' => 'hello@trekafricaguide.com'],
            ['group_name' => 'contact', 'key' => 'contact_phone', 'value' => '+256 700 000 000'],
            ['group_name' => 'contact', 'key' => 'contact_address', 'value' => 'Kampala, Uganda'],
            ['group_name' => 'contact', 'key' => 'contact_note', 'value' => 'These contact details are placeholders for launch setup and can be updated by the Trek Africa Guide team.'],
            ['group_name' => 'seo', 'key' => 'default_meta_description', 'value' => 'Plan Africa travel by region and destination country, compare attractions, stays, and restaurants, then continue booking with trusted external partners.'],
            ['group_name' => 'seo', 'key' => 'default_og_image', 'value' => 'image-slot:home-hero-east-africa'],
        ];
    }

    private function pageSections(): array
    {
        return [
            [
                'page_key' => 'home',
                'section_key' => 'hero',
                'eyebrow' => 'Discover Africa',
                'title' => 'Explore Africa through regions first, then book with confidence.',
                'body' => 'Trek Africa Guide helps travelers understand the shape of an Africa trip before they commit. Start with East, West, Southern, or Northern Africa, compare destination countries, open a destination, and then continue to trusted booking partners for tours, stays, and dining.',
                'image_url' => 'image-slot:home-hero-east-africa',
                'meta' => [
                    'cta_label' => 'Explore regions',
                    'cta_href' => '/regions',
                    'slides' => [
                        [
                            'region' => 'East Africa',
                            'title' => 'Explore Africa through regions first: safari plains, primate forests, and Indian Ocean extensions.',
                            'body' => 'Plan Kenya, Tanzania, Uganda, Rwanda, and Ethiopia with realistic pacing across wildlife, gorillas, coast, and heritage.',
                            'image_slot' => 'home-hero-east-africa',
                        ],
                        [
                            'region' => 'West Africa',
                            'title' => 'Heritage coastlines, music cities, islands, and slower travel.',
                            'body' => 'Compare Ghana, Senegal, Benin, Sierra Leone, and Cabo Verde through culture, diaspora travel, beaches, and practical logistics.',
                            'image_slot' => 'home-hero-west-africa',
                        ],
                        [
                            'region' => 'Southern Africa',
                            'title' => 'City-and-bush routes, desert roads, waterfalls, and premium wilderness.',
                            'body' => 'Build trips around South Africa, Botswana, Namibia, Zimbabwe, and Zambia without losing sight of routing and seasonality.',
                            'image_slot' => 'home-hero-southern-africa',
                        ],
                        [
                            'region' => 'Northern Africa',
                            'title' => 'Medinas, antiquities, desert camps, and Mediterranean light.',
                            'body' => 'Use Morocco, Egypt, Tunisia, and Algeria as culture-first gateways with clear notes on access, heat, and guide support.',
                            'image_slot' => 'home-hero-northern-africa',
                        ],
                    ],
                ],
                'sort_order' => 1,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'intro',
                'eyebrow' => 'Africa in 2026',
                'title' => 'A continent of different travel rhythms, not one single market.',
                'body' => 'Africa is rebounding strongly, but travelers still need clear guidance. North Africa is aviation-led and culture-rich, East Africa remains the strongest safari-and-primate gateway, Southern Africa combines wilderness with polished urban circuits, and West Africa shines for heritage, coastlines, music, and diaspora travel.',
                'image_url' => 'image-slot:home-intro-africa-map',
                'sort_order' => 2,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_regions',
                'eyebrow' => 'Featured Regions',
                'title' => 'The four major entry points for planning an Africa trip.',
                'body' => 'Each region page leads into destination country guidance and then into bookable attractions, stays, and restaurants.',
                'sort_order' => 3,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_attractions',
                'eyebrow' => 'Featured Attractions',
                'title' => 'Open individual attraction pages built like a modern travel marketplace.',
                'body' => 'Listing cards lead to full independent landing pages with galleries, planning notes, nearby stays, dining, and external booking buttons.',
                'sort_order' => 4,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_accommodations',
                'eyebrow' => 'Featured Stays',
                'title' => 'Accommodation shortlists tied to real attractions.',
                'body' => 'Every stay is linked to a country, region, and nearby attraction so travelers can judge route logic before they leave the site.',
                'sort_order' => 5,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_restaurants',
                'eyebrow' => 'Featured Restaurants',
                'title' => 'Dining recommendations that add local flavor to the trip.',
                'body' => 'Restaurants sit alongside attractions and stays so destination pages feel practical rather than brochure-like.',
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
                'hero_title' => 'East Africa pairs iconic safari landscapes with primate trekking and coast extensions.',
                'hero_text' => 'This is the strongest first stop for travelers who want a classic Africa trip shape: wildlife, gorillas or chimpanzees, and smooth multi-country connections.',
                'overview' => 'East Africa remains one of the continent’s highest-demand regions for safari, gorilla trekking, coast add-ons, and premium conservation travel. Kenya and Tanzania lead the classic plains circuits, while Uganda and Rwanda anchor primate-led journeys.',
                'countries_intro' => 'These countries welcome visitors with well-established safari routes, strong guide networks, and logical connections by road or regional flight.',
                'hero_image_url' => 'image-slot:region-east-africa',
                'hero_image_alt' => 'Reserved image space for East Africa safari plains and forest travel',
            ],
            [
                'slug' => 'west-africa',
                'name' => 'West Africa',
                'hero_title' => 'West Africa is best approached through culture, heritage, coastlines, and slower travel.',
                'hero_text' => 'This region rewards travelers who value music, food, Atlantic history, and diaspora connections more than a checklist safari route.',
                'overview' => 'West Africa is driven by heritage journeys, winter-sun escapes, coastal cities, and community-grounded experiences. Ghana and Senegal are the most polished starting points, while Benin, Sierra Leone, and Cabo Verde broaden the offer considerably.',
                'countries_intro' => 'These countries offer the clearest leisure pathways for heritage, beaches, island breaks, and cultural travel.',
                'hero_image_url' => 'image-slot:region-west-africa',
                'hero_image_alt' => 'Reserved image space for West Africa heritage coast and cultural travel',
            ],
            [
                'slug' => 'southern-africa',
                'name' => 'Southern Africa',
                'hero_title' => 'Southern Africa combines polished infrastructure, big safari names, desert routes, and city-and-bush pairings.',
                'hero_text' => 'Travelers can mix luxury lodges, self-drive landscapes, waterfalls, wine, and long scenic road circuits without losing practical route logic.',
                'overview' => 'Southern Africa is one of the continent’s most versatile travel regions. South Africa acts as the gateway, Botswana and Namibia deliver high-value wilderness and desert landscapes, and Zimbabwe and Zambia deepen the safari-and-Zambezi story.',
                'countries_intro' => 'These countries are the strongest booking and route-building anchors across Southern Africa.',
                'hero_image_url' => 'image-slot:region-southern-africa',
                'hero_image_alt' => 'Reserved image space for Southern Africa wilderness and desert routes',
            ],
            [
                'slug' => 'northern-africa',
                'name' => 'Northern Africa',
                'hero_title' => 'Northern Africa works best for travelers drawn to medinas, antiquities, coastlines, and desert-edge routes.',
                'hero_text' => 'It is less about safari and more about history, architecture, food, and short- to medium-haul itineraries with strong aviation access.',
                'overview' => 'Northern Africa is Africa’s volume engine for tourism, driven by Morocco, Egypt, Tunisia, and a growing wave of renewed interest in Algeria. Travelers come for cities, heritage, desert camps, Mediterranean coastlines, and food-led travel.',
                'countries_intro' => 'These countries are the clearest Northern Africa entry points for culture-forward, desert, and coast itineraries.',
                'hero_image_url' => 'image-slot:region-northern-africa',
                'hero_image_alt' => 'Reserved image space for Northern Africa medinas, antiquities, and desert travel',
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
            'overview' => $overview,
            'access_summary' => $access,
            'best_time' => $bestTime,
            'planning_tips' => 'Use this destination country page to compare attractions, understand how to move between them, and decide whether the trip works best as a standalone route or part of a broader regional circuit.',
            'hero_image_url' => $this->countryImage($slug),
            'hero_image_alt' => 'Reserved image space for '.$name.' travel planning',
        ];
    }

    private function attractions(): array
    {
        return [
            $this->attraction('uganda', 'bwindi-impenetrable-national-park', 'Bwindi Impenetrable National Park', 'Southwestern Uganda', 'Mountain gorilla trekking in one of Africa’s most powerful forest landscapes.', 'Bwindi works best for travelers who understand that the reward is not speed or comfort, but the emotional intensity of one hour with a habituated gorilla family after a demanding forest trek.', 'Most travelers fly into Entebbe and continue by domestic flight or a long but scenic road transfer into southwestern Uganda. Permit logistics should be secured early and matched to the correct trekking sector.', 'Drier months usually make the trails easier, though trekking runs year-round.', 4.9, 842, 'From $700'),
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
        return [
            'country_slug' => $countrySlug,
            'slug' => $slug,
            'name' => $name,
            'location_name' => $location,
            'hero_image_url' => $this->attractionImage($slug),
            'hero_image_alt' => $name,
            'listing_summary' => $summary,
            'detail_intro' => $detailIntro,
            'full_description' => $detailIntro.' Trek Africa Guide positions this as a practical planning page, so travelers can compare route logic, nearby stays, dining, and partner booking options before leaving the site.',
            'getting_there' => $gettingThere,
            'best_time' => $bestTime,
            'practical_info' => 'Use this page to understand arrival logistics, time commitment, where to stay nearby, and which local tour operators are best placed to support the experience.',
            'gallery' => [$this->attractionImage($slug), $this->countryImage($countrySlug), $this->regionAccentImage($countrySlug)],
            'highlights' => [
                'Independent landing page with a clear planning summary',
                'Nearby accommodation and dining recommendations',
                'External booking CTA connected to a partner page',
                'Practical access and timing guidance before booking',
            ],
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
            'hero_image_url' => 'image-slot:stay-'.$slug,
            'hero_image_alt' => 'Reserved image space for '.$name,
            'listing_summary' => $summary,
            'detail_intro' => $detailIntro,
            'practical_info' => $practicalInfo,
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
            'hero_image_url' => 'image-slot:restaurant-'.$slug,
            'hero_image_alt' => 'Reserved image space for '.$name,
            'listing_summary' => $summary,
            'detail_intro' => $summary,
            'practical_info' => $practicalInfo,
            'rating' => $rating,
            'review_count' => $reviews,
            'price_label' => $priceLabel,
            'booking_url' => $bookingUrl,
            'featured' => $featured,
        ];
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
                'summary' => 'A locally grounded tour operator active in '.$country['name'].', helping travelers combine attractions, stays, transport, and realistic route timing rather than selling disconnected components.',
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
        return 'image-slot:country-'.$slug;
    }

    private function attractionImage(string $slug): string
    {
        return 'image-slot:attraction-'.$slug;
    }

    private function stayImage(string $slug): string
    {
        return 'image-slot:stay-'.$slug;
    }

    private function foodImage(string $countrySlug): string
    {
        return 'image-slot:restaurant-'.$countrySlug;
    }

    private function regionAccentImage(string $countrySlug): string
    {
        return match ($countrySlug) {
            'uganda', 'kenya', 'tanzania', 'rwanda', 'ethiopia' => 'image-slot:region-east-africa',
            'ghana', 'senegal', 'benin', 'sierra-leone', 'cabo-verde' => 'image-slot:region-west-africa',
            'south-africa', 'botswana', 'namibia', 'zimbabwe', 'zambia' => 'image-slot:region-southern-africa',
            default => 'image-slot:region-northern-africa',
        };
    }
}
