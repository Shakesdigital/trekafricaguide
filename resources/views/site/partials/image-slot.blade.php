@php
    $imageValue = $image ?? null;
    $isSlot = is_string($imageValue) && \Illuminate\Support\Str::startsWith($imageValue, 'image-slot:');
    $slotKey = $isSlot ? \Illuminate\Support\Str::of($imageValue)->after('image-slot:')->toString() : null;
    $slotName = $isSlot ? \Illuminate\Support\Str::of($slotKey)->replace('-', ' ')->title() : null;
    $classes = trim('image-slot '.($class ?? ''));

    // Every CMS image slot resolves to a reviewed, project-local generated asset.
    // Country and region slots deliberately reuse a real destination within that area.
    $landingImages = [
        'home-hero-east-africa' => 'attractions/maasai-mara/01.jpg',
        'home-hero-west-africa' => 'attractions/cape-coast-kakum/01.jpg',
        'home-hero-southern-africa' => 'attractions/namib-desert/01.jpg',
        'home-hero-northern-africa' => 'attractions/marrakech-and-atlas/01.jpg',
        'home-intro-africa-map' => 'attractions/okavango-delta/05.jpg',
        'regions-index-hero' => 'attractions/serengeti-national-park/01.jpg',
        'destinations-index-hero' => 'attractions/cape-town/01.jpg',
        'attractions-index-hero' => 'attractions/maasai-mara/01.jpg',
        'accommodations-index-hero' => 'accommodations/governors-camp/01.jpg',
        'restaurants-index-hero' => 'restaurants/the-rock-restaurant-zanzibar/01.jpg',
        'contact-hero' => 'attractions/bwindi-impenetrable-national-park/03.jpg',
        'region-east-africa' => 'attractions/serengeti-national-park/01.jpg',
        'region-west-africa' => 'attractions/sine-saloum-delta/01.jpg',
        'region-southern-africa' => 'attractions/namib-desert/01.jpg',
        'region-northern-africa' => 'attractions/marrakech-and-atlas/01.jpg',
    ];
    $countryDestinations = [
        'uganda' => 'bwindi-impenetrable-national-park', 'kenya' => 'maasai-mara',
        'tanzania' => 'serengeti-national-park', 'rwanda' => 'volcanoes-national-park',
        'ethiopia' => 'lalibela', 'ghana' => 'cape-coast-kakum',
        'senegal' => 'sine-saloum-delta', 'benin' => 'ouidah-and-ganvie',
        'sierra-leone' => 'tokeh-and-river-no2', 'cabo-verde' => 'sal-island',
        'south-africa' => 'cape-town', 'botswana' => 'okavango-delta',
        'namibia' => 'namib-desert', 'zimbabwe' => 'victoria-falls',
        'zambia' => 'south-luangwa', 'morocco' => 'marrakech-and-atlas',
        'egypt' => 'cairo-and-giza', 'tunisia' => 'tunis-and-sidi-bou-said',
        'algeria' => 'djanet-and-tassili',
    ];

    $localRelative = $isSlot ? ($landingImages[$slotKey] ?? null) : null;
    if ($isSlot && !$localRelative && str_starts_with($slotKey, 'country-')) {
        $countrySlug = str($slotKey)->after('country-')->toString();
        $localRelative = isset($countryDestinations[$countrySlug]) ? 'attractions/'.$countryDestinations[$countrySlug].'/01.jpg' : null;
    }
    foreach (['attraction-' => 'attractions', 'stay-' => 'accommodations', 'restaurant-' => 'restaurants'] as $prefix => $folder) {
        if ($isSlot && !$localRelative && str_starts_with($slotKey, $prefix)) {
            $localRelative = $folder.'/'.str($slotKey)->after($prefix)->toString().'/01.jpg';
        }
    }
    $resolvedUrl = $localRelative && file_exists(public_path('images/generated/'.$localRelative))
        ? asset('images/generated/'.$localRelative)
        : null;
    $imageSrc = $resolvedUrl ?: $imageValue;
    $imgClass = trim($class ?? '');
@endphp

@if(!blank($imageSrc))
    <img src="{{ $imageSrc }}" alt="{{ $alt ?? $slotName ?? '' }}" @if($imgClass) class="{{ $imgClass }}" @endif loading="lazy" decoding="async">
@else
    <div class="{{ $classes }}" role="img" aria-label="{{ $alt ?? $slotName ?? 'Reserved image space' }}">
        <span>Image slot</span>
        <strong>{{ $slotName ?? ($alt ?? 'Reserved visual') }}</strong>
    </div>
@endif
