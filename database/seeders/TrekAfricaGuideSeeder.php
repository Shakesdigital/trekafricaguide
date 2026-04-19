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
            ['group_name' => 'general', 'key' => 'site_tagline', 'value' => 'African travel guide and booking directory for regions, countries, attractions, stays, dining, and trusted partner booking paths.'],
            ['group_name' => 'branding', 'key' => 'primary_color', 'value' => '#284932'],
            ['group_name' => 'branding', 'key' => 'secondary_color', 'value' => '#c56b3d'],
            ['group_name' => 'branding', 'key' => 'accent_color', 'value' => '#c5b580'],
            ['group_name' => 'branding', 'key' => 'logo_path', 'value' => '/logo to edit.png'],
            ['group_name' => 'seo', 'key' => 'default_meta_description', 'value' => 'Plan Africa travel by region and country, compare attractions, stays, and restaurants, then continue booking with trusted external partners.'],
            ['group_name' => 'seo', 'key' => 'default_og_image', 'value' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80'],
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
                'body' => 'Trek Africa Guide helps travelers understand the shape of an Africa trip before they commit. Start with East, West, Southern, or Northern Africa, compare countries, open a destination, and then continue to trusted booking partners for tours, stays, and dining.',
                'image_url' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80',
                'meta' => ['cta_label' => 'Explore regions', 'cta_href' => '/regions'],
                'sort_order' => 1,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'intro',
                'eyebrow' => 'Africa in 2026',
                'title' => 'A continent of different travel rhythms, not one single market.',
                'body' => 'Africa is rebounding strongly, but travelers still need clear guidance. North Africa is aviation-led and culture-rich, East Africa remains the strongest safari-and-primate gateway, Southern Africa combines wilderness with polished urban circuits, and West Africa shines for heritage, coastlines, music, and diaspora travel.',
                'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
                'sort_order' => 2,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'featured_regions',
                'eyebrow' => 'Featured Regions',
                'title' => 'The four major entry points for planning an Africa trip.',
                'body' => 'Each region page leads into country-level guidance and then into bookable attractions, stays, and restaurants.',
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
                'hero_image_url' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
                'hero_image_alt' => 'Safari jeeps watching wildlife in East Africa',
            ],
            [
                'slug' => 'west-africa',
                'name' => 'West Africa',
                'hero_title' => 'West Africa is best approached through culture, heritage, coastlines, and slower travel.',
                'hero_text' => 'This region rewards travelers who value music, food, Atlantic history, and diaspora connections more than a checklist safari route.',
                'overview' => 'West Africa is driven by heritage journeys, winter-sun escapes, coastal cities, and community-grounded experiences. Ghana and Senegal are the most polished starting points, while Benin, Sierra Leone, and Cabo Verde broaden the offer considerably.',
                'countries_intro' => 'These countries offer the clearest leisure pathways for heritage, beaches, island breaks, and cultural travel.',
                'hero_image_url' => 'https://images.unsplash.com/photo-1598875706250-21faaf804361?auto=format&fit=crop&w=1600&q=80',
                'hero_image_alt' => 'Colorful fishing boats on a West African coast',
            ],
            [
                'slug' => 'southern-africa',
                'name' => 'Southern Africa',
                'hero_title' => 'Southern Africa combines polished infrastructure, big safari names, desert routes, and city-and-bush pairings.',
                'hero_text' => 'Travelers can mix luxury lodges, self-drive landscapes, waterfalls, wine, and long scenic road circuits without losing practical route logic.',
                'overview' => 'Southern Africa is one of the continent’s most versatile travel regions. South Africa acts as the gateway, Botswana and Namibia deliver high-value wilderness and desert landscapes, and Zimbabwe and Zambia deepen the safari-and-Zambezi story.',
                'countries_intro' => 'These countries are the strongest booking and route-building anchors across Southern Africa.',
                'hero_image_url' => 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80',
                'hero_image_alt' => 'Elephants in a Southern African landscape',
            ],
            [
                'slug' => 'northern-africa',
                'name' => 'Northern Africa',
                'hero_title' => 'Northern Africa works best for travelers drawn to medinas, antiquities, coastlines, and desert-edge routes.',
                'hero_text' => 'It is less about safari and more about history, architecture, food, and short- to medium-haul itineraries with strong aviation access.',
                'overview' => 'Northern Africa is Africa’s volume engine for tourism, driven by Morocco, Egypt, Tunisia, and a growing wave of renewed interest in Algeria. Travelers come for cities, heritage, desert camps, Mediterranean coastlines, and food-led travel.',
                'countries_intro' => 'These countries are the clearest Northern Africa entry points for culture-forward, desert, and coast itineraries.',
                'hero_image_url' => 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
                'hero_image_alt' => 'Desert camp and dunes in North Africa',
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
            'planning_tips' => 'Use this country page to compare attractions, understand how to move between them, and decide whether the trip works best as a standalone route or part of a broader regional circuit.',
            'hero_image_url' => $this->countryImage($slug),
            'hero_image_alt' => $name.' travel scene',
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
        return collect($this->attractions())
            ->map(function (array $attraction, int $index): array {
                $countrySlug = $attraction['country_slug'];
                $name = Str::of($attraction['name'])->before(' &')->before(' National')->before(' Park')->toString();
                $slug = Str::slug($name.' lodge');

                return [
                    'country_slug' => $countrySlug,
                    'attraction_slug' => $attraction['slug'],
                    'slug' => $slug.'-'.($index + 1),
                    'name' => trim($name).' Lodge & Retreat',
                    'property_type' => $this->propertyType($countrySlug),
                    'location_name' => 'Near '.$attraction['name'],
                    'hero_image_url' => $this->stayImage($attraction['slug']),
                    'hero_image_alt' => trim($name).' Lodge & Retreat',
                    'listing_summary' => 'A comfortable base positioned for travelers visiting '.$attraction['name'].', with easy early-start logistics and a travel-friendly atmosphere.',
                    'detail_intro' => 'This stay is designed around attraction access first. It works best for travelers who want practical departure times, a calm return base, and a property that fits the wider route rather than stealing focus from the destination itself.',
                    'practical_info' => 'Typical advantages include early breakfast timing, transfer coordination, and a location that reduces unnecessary backtracking on activity days.',
                    'amenities' => ['Breakfast included', 'Transfer support', 'En-suite rooms', 'Good base for excursions'],
                    'rating' => 4.4 + (($index % 4) * 0.1),
                    'review_count' => 110 + ($index * 17),
                    'price_label' => $this->stayPrice($countrySlug),
                    'booking_url' => 'https://www.booking.com/searchresults.html?ss='.urlencode(trim($name).' Lodge '.$attraction['name']),
                    'featured' => $index < 6,
                ];
            })
            ->all();
    }

    private function restaurants(): array
    {
        return collect($this->attractions())
            ->map(function (array $attraction, int $index): array {
                $base = Str::of($attraction['name'])->before(' National')->before(' Park')->before(' &')->toString();

                return [
                    'country_slug' => $attraction['country_slug'],
                    'attraction_slug' => $attraction['slug'],
                    'slug' => Str::slug($base.' kitchen '.($index + 1)),
                    'name' => trim($base).' Kitchen',
                    'cuisine' => $this->restaurantCuisine($attraction['country_slug']),
                    'location_name' => 'Near '.$attraction['name'],
                    'signature_dish' => $this->signatureDish($attraction['country_slug']),
                    'hero_image_url' => $this->foodImage($attraction['country_slug']),
                    'hero_image_alt' => trim($base).' Kitchen dining room',
                    'listing_summary' => 'A recommended restaurant stop near '.$attraction['name'].' for travelers who want local flavor and a dependable service rhythm between activity windows.',
                    'detail_intro' => 'This restaurant is positioned as a practical and atmospheric stop near '.$attraction['name'].', making it easier for visitors to add one memorable meal without distorting the overall route.',
                    'practical_info' => 'Best used for lunch or dinner around excursion timings. Reservation support and hotel transfer advice usually matter more than formality.',
                    'rating' => 4.3 + (($index % 4) * 0.1),
                    'review_count' => 85 + ($index * 13),
                    'price_label' => $this->restaurantPrice($attraction['country_slug']),
                    'booking_url' => 'https://www.tripadvisor.com/Search?q='.urlencode(trim($base).' Kitchen '.$attraction['name']),
                    'featured' => $index < 6,
                ];
            })
            ->map(function (array $record): array {
                $record['slug'] = Str::slug($record['name'].' '.$record['location_name']);

                return $record;
            })
            ->all();
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
        return match ($slug) {
            'uganda' => 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80',
            'kenya' => 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1400&q=80',
            'tanzania' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80',
            'rwanda' => 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1400&q=80',
            'ethiopia' => 'https://images.unsplash.com/photo-1531168556467-80aacec25a40?auto=format&fit=crop&w=1400&q=80',
            'ghana' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
            'senegal' => 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80',
            'benin' => 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80',
            'sierra-leone' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
            'cabo-verde' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
            'south-africa' => 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1400&q=80',
            'botswana' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
            'namibia' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
            'zimbabwe' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
            'zambia' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
            'morocco' => 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1400&q=80',
            'egypt' => 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1400&q=80',
            'tunisia' => 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1400&q=80',
            'algeria' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80',
            default => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
        };
    }

    private function attractionImage(string $slug): string
    {
        return match ($slug) {
            'bwindi-impenetrable-national-park' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
            'murchison-falls-national-park' => 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80',
            'maasai-mara' => 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1600&q=80',
            'amboseli-national-park' => 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1600&q=80',
            'serengeti-national-park' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80',
            'zanzibar' => 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80',
            'volcanoes-national-park' => 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1600&q=80',
            'lalibela' => 'https://images.unsplash.com/photo-1531168556467-80aacec25a40?auto=format&fit=crop&w=1600&q=80',
            'cape-coast-kakum' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
            'sine-saloum-delta' => 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80',
            'ouidah-and-ganvie' => 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80',
            'tokeh-and-river-no2' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
            'sal-island' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
            'cape-town' => 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1600&q=80',
            'kruger-national-park' => 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
            'okavango-delta' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
            'namib-desert' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
            'victoria-falls' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
            'south-luangwa' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
            'marrakech-and-atlas' => 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=80',
            'sahara-dunes' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
            'cairo-and-giza' => 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1600&q=80',
            'tunis-and-sidi-bou-said' => 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1600&q=80',
            'djanet-and-tassili' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80',
            default => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
        };
    }

    private function stayImage(string $slug): string
    {
        return match ($slug) {
            'zanzibar', 'tokeh-and-river-no2', 'sal-island' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
            'cape-town', 'marrakech-and-atlas', 'cairo-and-giza', 'tunis-and-sidi-bou-said' => 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80',
            default => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
        };
    }

    private function foodImage(string $countrySlug): string
    {
        return match ($countrySlug) {
            'morocco', 'tunisia', 'egypt' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80',
            'ghana', 'senegal', 'benin' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
            default => 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
        };
    }

    private function regionAccentImage(string $countrySlug): string
    {
        return match ($countrySlug) {
            'uganda', 'kenya', 'tanzania', 'rwanda', 'ethiopia' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
            'ghana', 'senegal', 'benin', 'sierra-leone', 'cabo-verde' => 'https://images.unsplash.com/photo-1598875706250-21faaf804361?auto=format&fit=crop&w=1200&q=80',
            'south-africa', 'botswana', 'namibia', 'zimbabwe', 'zambia' => 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
            default => 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
        };
    }
}
