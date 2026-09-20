@php
    $imageValue = $image ?? null;
    $isSlot = is_string($imageValue) && \Illuminate\Support\Str::startsWith($imageValue, 'image-slot:');
    $slotKey = $isSlot ? \Illuminate\Support\Str::of($imageValue)->after('image-slot:')->toString() : null;
    $slotName = $isSlot ? \Illuminate\Support\Str::of($slotKey)->replace('-', ' ')->title() : null;
    $classes = trim('image-slot '.($class ?? ''));

    // Landing and geographic slots reuse a licensed destination photograph.
    $landingImages = [
        'home-hero-east-africa' => 'maasai-mara',
        'home-hero-west-africa' => 'cape-coast-kakum',
        'home-hero-southern-africa' => 'namib-desert',
        'home-hero-northern-africa' => 'marrakech-and-atlas',
        'home-intro-africa-map' => 'okavango-delta',
        'regions-index-hero' => 'serengeti-national-park',
        'destinations-index-hero' => 'cape-town',
        'attractions-index-hero' => 'maasai-mara',
        'accommodations-index-hero' => 'maasai-mara',
        'contact-hero' => 'bwindi-impenetrable-national-park',
        'region-east-africa' => 'serengeti-national-park',
        'region-west-africa' => 'sine-saloum-delta',
        'region-southern-africa' => 'namib-desert',
        'region-northern-africa' => 'marrakech-and-atlas',
        'region-central-africa' => 'odzala-kokoua-national-park',
    ];
    $countryDestinations = [
        'uganda' => 'bwindi-impenetrable-national-park', 'kenya' => 'maasai-mara',
        'tanzania' => 'serengeti-national-park', 'rwanda' => 'volcanoes-national-park',
        'ethiopia' => 'lalibela', 'mauritius' => 'black-river-gorges',
        'seychelles' => 'vallee-de-mai', 'ghana' => 'cape-coast-kakum',
        'senegal' => 'sine-saloum-delta', 'benin' => 'ouidah-and-ganvie',
        'sierra-leone' => 'tokeh-and-river-no2', 'cabo-verde' => 'sal-island',
        'nigeria' => 'lagos-and-lekki', 'the-gambia' => 'river-gambia-national-park',
        'cote-divoire' => 'grand-bassam',
        'south-africa' => 'cape-town', 'botswana' => 'okavango-delta',
        'namibia' => 'namib-desert', 'zimbabwe' => 'victoria-falls',
        'zambia' => 'south-luangwa', 'mozambique' => 'bazaruto-archipelago',
        'morocco' => 'marrakech-and-atlas',
        'egypt' => 'cairo-and-giza', 'tunisia' => 'tunis-and-sidi-bou-said',
        'algeria' => 'djanet-and-tassili',
        'sao-tome-and-principe' => 'obo-natural-park', 'cameroon' => 'mount-cameroon',
        'gabon' => 'loango-national-park', 'republic-of-the-congo' => 'odzala-kokoua-national-park',
    ];

    $localRelative = $isSlot ? ($landingImages[$slotKey] ?? null) : null;
    if ($isSlot && !$localRelative && str_starts_with($slotKey, 'country-')) {
        $countrySlug = str($slotKey)->after('country-')->toString();
        $localRelative = $countryDestinations[$countrySlug] ?? null;
    }
    foreach (['attraction-' => 'attractions', 'stay-' => 'accommodations'] as $prefix => $folder) {
        if ($isSlot && !$localRelative && str_starts_with($slotKey, $prefix)) {
            $localRelative = str($slotKey)->after($prefix)->toString();
        }
    }
    $resolvedUrl = $localRelative && file_exists(public_path('images/stock/destinations/'.$localRelative.'.jpg'))
        ? asset('images/stock/destinations/'.$localRelative.'.jpg')
        : null;
    $imageSrc = $resolvedUrl ?: $imageValue;
    $imgClass = trim($class ?? '');
@endphp

@if(!blank($imageSrc))
    <img src="{{ $imageSrc }}" alt="{{ $alt ?? $slotName ?? '' }}" @if($imgClass) class="{{ $imgClass }}" @endif loading="lazy" decoding="async">
@else
    <div class="{{ $classes }}" role="img" aria-label="{{ $alt ?? $slotName ?? 'Destination photograph unavailable' }}">
        <strong>{{ $slotName ?? ($alt ?? 'Destination photograph unavailable') }}</strong>
    </div>
@endif
