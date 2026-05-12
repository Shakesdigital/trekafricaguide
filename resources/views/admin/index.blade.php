@extends('layouts.site')

@php
    $tabs = [
        'overview' => 'Overview',
        'regions' => 'Regions',
        'countries' => 'Destinations',
        'attractions' => 'Attractions',
        'accommodations' => 'Accommodations',
        'restaurants' => 'Restaurants',
        'tour-operators' => 'Tour Operators',
        'page-sections' => 'Homepage',
        'settings' => 'Settings',
    ];

    $resourceLabels = [
        'regions' => 'Region',
        'countries' => 'Destination Country',
        'attractions' => 'Attraction',
        'accommodations' => 'Accommodation',
        'restaurants' => 'Restaurant',
        'tour-operators' => 'Tour Operator',
        'page-sections' => 'Homepage Section',
        'settings' => 'Setting',
    ];
@endphp

@section('content')
<section class="admin-shell">
    <div class="container">
        <div class="admin-header">
            <div>
                <p class="eyebrow">CMS</p>
                <h1>Trek Africa Guide Content Manager</h1>
                <p>The forms below now mirror the public website. Each section tells the editor exactly which front-end component they are updating: listing card, hero, detail content, booking panel, gallery, and related planning content.</p>
            </div>
            <div class="admin-header__actions">
                @if(session('status'))
                    <div class="admin-status">{{ session('status') }}</div>
                @endif
                <div class="admin-muted">
                    Signed in as <strong>{{ $adminUser?->email }}</strong>
                </div>
                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf
                    <button class="button button--ghost" type="submit">Log out</button>
                </form>
            </div>
        </div>

        <div class="admin-tabs">
            @foreach($tabs as $key => $label)
                <a href="{{ route('admin.index', ['tab' => $key]) }}" class="{{ $tab === $key ? 'is-active' : '' }}">{{ $label }}</a>
            @endforeach
        </div>

        @if($tab === 'overview')
            <div class="admin-overview-grid">
                <div class="admin-stat"><strong>{{ $regions->count() }}</strong><span>Regions</span></div>
                <div class="admin-stat"><strong>{{ $countries->count() }}</strong><span>Countries</span></div>
                <div class="admin-stat"><strong>{{ $attractions->count() }}</strong><span>Attractions</span></div>
                <div class="admin-stat"><strong>{{ $accommodations->count() }}</strong><span>Accommodations</span></div>
                <div class="admin-stat"><strong>{{ $restaurants->count() }}</strong><span>Restaurants</span></div>
                <div class="admin-stat"><strong>{{ $tourOperators->count() }}</strong><span>Tour operators</span></div>
            </div>

            <div class="admin-overview-layout">
                <div class="info-panel">
                    <h3>How this CMS is now organized</h3>
                    <ul class="bullet-list">
                        <li><strong>Listing Card</strong> fields control the thumbnail card users see in attraction, stay, and restaurant listings.</li>
                        <li><strong>Hero / Main Image</strong> fields control the large public image seen on the detail page and in the listing card.</li>
                        <li><strong>Detail Page Content</strong> fields control the descriptive sections shown after a user clicks “View Details”.</li>
                        <li><strong>Booking Panel</strong> fields control the right-side call to action with price text, location text, and the external partner link.</li>
                        <li><strong>Gallery / Supporting Images</strong> fields let editors upload or paste image URLs for any visual slots shown on the public site.</li>
                    </ul>
                </div>
                <div class="info-panel">
                    <h3>Editor guidance</h3>
                    <ul class="bullet-list">
                        <li>Use upload fields whenever possible so the backend directly manages the public visuals.</li>
                        <li>Each labeled section matches a visible front-end block, which should make training editors much easier.</li>
                        <li>The country tab acts as the destination manager for country landing pages.</li>
                    </ul>
                </div>
            </div>
        @endif

        @foreach([
            'regions' => $regions,
            'countries' => $countries,
            'attractions' => $attractions,
            'accommodations' => $accommodations,
            'restaurants' => $restaurants,
            'tour-operators' => $tourOperators,
            'page-sections' => $pageSections,
            'settings' => $settings,
        ] as $resource => $collection)
            @if($tab === $resource)
                <div class="admin-panel">
                    <div class="admin-panel__head">
                        <div>
                            <h2>{{ $tabs[$resource] ?? \Illuminate\Support\Str::headline($resource) }}</h2>
                            <p class="admin-section-note">
                                @if($resource === 'attractions')
                                    Mirrors the attraction listing cards and attraction detail pages on the front end.
                                @elseif($resource === 'accommodations')
                                    Mirrors the accommodation listing cards and full stay detail pages on the front end.
                                @elseif($resource === 'restaurants')
                                    Mirrors the restaurant listing cards and full restaurant detail pages on the front end.
                                @elseif($resource === 'countries')
                                    Mirrors the destination country landing pages, including the page hero and planning sections.
                                @elseif($resource === 'regions')
                                    Mirrors each regional landing page and its hero presentation.
                                @elseif($resource === 'page-sections')
                                    Mirrors the homepage section blocks, headings, body copy, and supporting visuals.
                                @else
                                    Edit content in a structure that mirrors the public website layout.
                                @endif
                            </p>
                        </div>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Context</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($collection as $item)
                                    <tr>
                                        <td>
                                            <strong>{{ $item->name ?? $item->title ?? $item->key }}</strong>
                                            <div class="admin-muted">{{ $item->slug ?? $item->section_key ?? $item->group_name }}</div>
                                        </td>
                                        <td>
                                            @if($resource === 'countries')
                                                {{ $item->region->name }}
                                            @elseif($resource === 'attractions')
                                                {{ $item->country->name }}
                                            @elseif($resource === 'accommodations' || $resource === 'restaurants')
                                                {{ $item->country->name }} @if($item->attraction) | {{ $item->attraction->name }} @endif
                                            @elseif($resource === 'tour-operators')
                                                {{ $item->country->name }}
                                            @elseif($resource === 'page-sections')
                                                {{ $item->page_key }}
                                            @elseif($resource === 'settings')
                                                {{ $item->group_name }}
                                            @else
                                                --
                                            @endif
                                        </td>
                                        <td class="admin-actions">
                                            <button
                                                class="button button--ghost"
                                                type="button"
                                                data-modal-open="{{ $resource }}"
                                                data-record='@json($item)'
                                            >Edit</button>
                                            <form action="{{ route('admin.destroy', [$resource, $item->id]) }}" method="POST">
                                                @csrf
                                                @method('DELETE')
                                                <button class="button button--danger" type="submit">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <button class="button" type="button" data-modal-open="{{ $resource }}">Add {{ $resourceLabels[$resource] ?? \Illuminate\Support\Str::headline(\Illuminate\Support\Str::singular($resource)) }}</button>
                </div>
            @endif
        @endforeach
    </div>
</section>

@foreach(['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour-operators', 'page-sections', 'settings'] as $resource)
    <div class="admin-modal" data-modal="{{ $resource }}">
        <div class="admin-modal__backdrop" data-modal-close></div>
        <div class="admin-modal__panel admin-modal__panel--wide">
            <div class="admin-modal__head">
                <div>
                    <h2>{{ $resourceLabels[$resource] ?? \Illuminate\Support\Str::headline(\Illuminate\Support\Str::singular($resource)) }}</h2>
                    <p class="admin-section-note">Every block below maps to a visible front-end component.</p>
                </div>
                <button type="button" data-modal-close>&times;</button>
            </div>

            <form action="{{ route('admin.save', $resource) }}" method="POST" class="admin-form" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="record_id">

                @if($resource === 'regions')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Page Identity</h3>
                            <p>Used to identify the regional landing page in the backend and URL structure.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Region name</span><input name="name" placeholder="East Africa" required></label>
                            <label class="admin-field"><span>URL slug</span><input name="slug" placeholder="east-africa" required></label>
                            <label class="admin-field"><span>Sort order</span><input name="sort_order" type="number" placeholder="1"></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Hero Section</h3>
                            <p>Mirrors the large hero block at the top of the region landing page.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="hero_image_url">
                                <p class="admin-image-preview__label">Current hero image</p>
                                <img alt="Current hero image preview" hidden>
                                <div class="admin-image-preview__empty">No hero image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Hero headline</span><input name="hero_title" placeholder="Hero headline" required></label>
                                <label class="admin-field admin-field--full"><span>Hero supporting text</span><textarea name="hero_text" placeholder="Short intro shown in the hero" required></textarea></label>
                                <label class="admin-field admin-field--full"><span>Hero image URL</span><input name="hero_image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload hero image</span><input name="hero_image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Hero image alt text</span><input name="hero_image_alt" placeholder="Describe the region image for accessibility"></label>
                                <label class="admin-field admin-field--full"><span>Hero gallery image URLs</span><textarea name="gallery_text" placeholder="One image URL per line. Remove a line here if you want that image removed from the front end."></textarea></label>
                                <label class="admin-field admin-field--full"><span>Upload more hero/gallery images</span><input name="gallery_files[]" type="file" accept="image/*" multiple></label>
                            </div>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Landing Page Content</h3>
                            <p>Mirrors the overview and country introduction sections on the public region page.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>Region overview</span><textarea name="overview" placeholder="Main region overview shown on the landing page" required></textarea></label>
                            <label class="admin-field admin-field--full"><span>Countries introduction</span><textarea name="countries_intro" placeholder="Intro text above the country list"></textarea></label>
                        </div>
                    </section>
                @elseif($resource === 'countries')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Page Identity</h3>
                            <p>Mirrors the destination country page identity and route placement.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Region</span>
                                <select name="region_id" required>
                                    @foreach($regions as $region)
                                        <option value="{{ $region->id }}">{{ $region->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Country name</span><input name="name" placeholder="Uganda" required></label>
                            <label class="admin-field"><span>URL slug</span><input name="slug" placeholder="uganda" required></label>
                            <label class="admin-field"><span>Sort order</span><input name="sort_order" type="number" placeholder="1"></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Hero Section</h3>
                            <p>Mirrors the large destination hero shown at the top of the country page.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="hero_image_url">
                                <p class="admin-image-preview__label">Current hero image</p>
                                <img alt="Current destination image preview" hidden>
                                <div class="admin-image-preview__empty">No destination image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Hero headline</span><input name="hero_title" placeholder="Country hero title" required></label>
                                <label class="admin-field admin-field--full"><span>Hero supporting text</span><textarea name="hero_text" placeholder="Short intro shown below the country title" required></textarea></label>
                                <label class="admin-field admin-field--full"><span>Hero image URL</span><input name="hero_image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload hero image</span><input name="hero_image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Hero image alt text</span><input name="hero_image_alt" placeholder="Describe the country image"></label>
                                <label class="admin-field admin-field--full"><span>Hero gallery image URLs</span><textarea name="gallery_text" placeholder="One image URL per line. Remove a line here if you want that image removed from the front end."></textarea></label>
                                <label class="admin-field admin-field--full"><span>Upload more hero/gallery images</span><input name="gallery_files[]" type="file" accept="image/*" multiple></label>
                            </div>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Destination Landing Page Content</h3>
                            <p>Mirrors the overview and planning sections on the country destination page.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>Country overview</span><textarea name="overview" placeholder="Main destination overview" required></textarea></label>
                            <label class="admin-field admin-field--full"><span>Access summary</span><textarea name="access_summary" placeholder="How travelers reach this country"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Best time to visit</span><textarea name="best_time" placeholder="Seasonality guidance"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Planning tips</span><textarea name="planning_tips" placeholder="Travel planning advice for this destination"></textarea></label>
                        </div>
                    </section>
                @elseif($resource === 'attractions')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Page Identity</h3>
                            <p>Used across the listing page, detail page, and URL structure for this attraction.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Region</span>
                                <select name="region_id" required>
                                    @foreach($regions as $region)
                                        <option value="{{ $region->id }}">{{ $region->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Country / destination</span>
                                <select name="country_id" required>
                                    @foreach($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Attraction name</span><input name="name" placeholder="Bwindi Impenetrable National Park" required></label>
                            <label class="admin-field"><span>URL slug</span><input name="slug" placeholder="bwindi-impenetrable-national-park" required></label>
                            <label class="admin-field"><span>Location label</span><input name="location_name" placeholder="Southwestern Uganda"></label>
                            <label class="admin-field"><span>Sort order</span><input name="sort_order" type="number" placeholder="1"></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Listing Card</h3>
                            <p>Mirrors the attraction card that appears on the front-end listing pages.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>Listing summary</span><textarea name="listing_summary" placeholder="Short summary shown on the attraction card and at the top of the detail page" required></textarea></label>
                            <label class="admin-field"><span>Rating</span><input name="rating" type="number" min="1" max="5" step="0.1" placeholder="4.8"></label>
                            <label class="admin-field"><span>Review count</span><input name="review_count" type="number" placeholder="250"></label>
                            <label class="admin-field"><span>Price / booking label</span><input name="price_label" placeholder="From $120"></label>
                            <label class="admin-field checkbox-row"><input type="checkbox" name="featured" value="1"> <span>Show in featured front-end sections</span></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Hero and Gallery</h3>
                            <p>Mirrors the main attraction image plus the gallery grid shown near the top of the detail page.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="hero_image_url">
                                <p class="admin-image-preview__label">Current main attraction image</p>
                                <img alt="Current attraction image preview" hidden>
                                <div class="admin-image-preview__empty">No attraction image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Main image URL</span><input name="hero_image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload main image</span><input name="hero_image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Main image alt text</span><input name="hero_image_alt" placeholder="Describe the attraction image"></label>
                                <label class="admin-field admin-field--full"><span>Gallery image URLs</span><textarea name="gallery_text" placeholder="One image URL per line. Remove a line here if you want that image removed from the front end gallery."></textarea></label>
                                <label class="admin-field admin-field--full"><span>Upload more hero/gallery images</span><input name="gallery_files[]" type="file" accept="image/*" multiple></label>
                            </div>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Detail Page Content</h3>
                            <p>Mirrors the “About this attraction”, “How to get there”, “Best time”, and “Full description” blocks.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>About this attraction</span><textarea name="detail_intro" placeholder="Main attraction introduction shown first on the detail page" required></textarea></label>
                            <label class="admin-field admin-field--full"><span>How to get there</span><textarea name="getting_there" placeholder="How travelers reach this attraction"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Best time to visit</span><textarea name="best_time" placeholder="Seasonality guidance for this attraction"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Practical information</span><textarea name="practical_info" placeholder="Planning notes shown in the practical info block"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Full description</span><textarea name="full_description" placeholder="Longer detailed description"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Highlights list</span><textarea name="highlights_text" placeholder="One highlight per line"></textarea></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Booking Panel</h3>
                            <p>Mirrors the sticky booking card on the right side of the attraction detail page.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>External booking URL</span><input name="booking_url" placeholder="https://partner-site.com/booking"></label>
                        </div>
                    </section>
                @elseif($resource === 'accommodations')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Page Identity</h3>
                            <p>Used across the stay listing card, detail page, and route placement.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Region</span>
                                <select name="region_id" required>
                                    @foreach($regions as $region)
                                        <option value="{{ $region->id }}">{{ $region->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Country / destination</span>
                                <select name="country_id" required>
                                    @foreach($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Linked attraction</span>
                                <select name="attraction_id">
                                    <option value="">No linked attraction</option>
                                    @foreach($attractions as $attraction)
                                        <option value="{{ $attraction->id }}">{{ $attraction->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Accommodation name</span><input name="name" placeholder="Bwindi Lodge & Retreat" required></label>
                            <label class="admin-field"><span>URL slug</span><input name="slug" placeholder="bwindi-lodge-retreat" required></label>
                            <label class="admin-field"><span>Property type</span><input name="property_type" placeholder="Safari lodge"></label>
                            <label class="admin-field"><span>Location label</span><input name="location_name" placeholder="Near Bwindi"></label>
                            <label class="admin-field"><span>Sort order</span><input name="sort_order" type="number" placeholder="1"></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Listing Card</h3>
                            <p>Mirrors the front-end accommodation card used in stay listings and nearby stay sections.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>Listing summary</span><textarea name="listing_summary" placeholder="Short summary shown on the accommodation card" required></textarea></label>
                            <label class="admin-field"><span>Rating</span><input name="rating" type="number" min="1" max="5" step="0.1" placeholder="4.6"></label>
                            <label class="admin-field"><span>Review count</span><input name="review_count" type="number" placeholder="180"></label>
                            <label class="admin-field"><span>Price / booking label</span><input name="price_label" placeholder="From $220 / night"></label>
                            <label class="admin-field checkbox-row"><input type="checkbox" name="featured" value="1"> <span>Show in featured stay sections</span></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Hero / Main Image</h3>
                            <p>Mirrors the main image shown on both the front-end listing card and stay detail page.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="hero_image_url">
                                <p class="admin-image-preview__label">Current stay image</p>
                                <img alt="Current stay image preview" hidden>
                                <div class="admin-image-preview__empty">No accommodation image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Main image URL</span><input name="hero_image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload main image</span><input name="hero_image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Main image alt text</span><input name="hero_image_alt" placeholder="Describe the stay image"></label>
                                <label class="admin-field admin-field--full"><span>Hero gallery image URLs</span><textarea name="gallery_text" placeholder="One image URL per line. Remove a line here if you want that image removed from the front end."></textarea></label>
                                <label class="admin-field admin-field--full"><span>Upload more hero/gallery images</span><input name="gallery_files[]" type="file" accept="image/*" multiple></label>
                            </div>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Detail Page Content</h3>
                            <p>Mirrors the “About this stay”, “Why it works for this route”, and “Amenities” sections.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>About this stay</span><textarea name="detail_intro" placeholder="Main introduction shown on the stay detail page" required></textarea></label>
                            <label class="admin-field admin-field--full"><span>Why it works for this route</span><textarea name="practical_info" placeholder="Explain why this stay fits the route"></textarea></label>
                            <label class="admin-field admin-field--full"><span>Amenities list</span><textarea name="amenities_text" placeholder="One amenity per line"></textarea></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Booking Panel</h3>
                            <p>Mirrors the right-side booking call to action on the stay detail page.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>External booking URL</span><input name="booking_url" placeholder="https://partner-site.com/stay"></label>
                        </div>
                    </section>
                @elseif($resource === 'restaurants')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Page Identity</h3>
                            <p>Used across the restaurant listing card, detail page, and related planning sections.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Region</span>
                                <select name="region_id" required>
                                    @foreach($regions as $region)
                                        <option value="{{ $region->id }}">{{ $region->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Country / destination</span>
                                <select name="country_id" required>
                                    @foreach($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Linked attraction</span>
                                <select name="attraction_id">
                                    <option value="">No linked attraction</option>
                                    @foreach($attractions as $attraction)
                                        <option value="{{ $attraction->id }}">{{ $attraction->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Restaurant name</span><input name="name" placeholder="Savannah Kitchen" required></label>
                            <label class="admin-field"><span>URL slug</span><input name="slug" placeholder="savannah-kitchen" required></label>
                            <label class="admin-field"><span>Cuisine label</span><input name="cuisine" placeholder="Regional cuisine"></label>
                            <label class="admin-field"><span>Location label</span><input name="location_name" placeholder="Near Maasai Mara"></label>
                            <label class="admin-field"><span>Signature dish label</span><input name="signature_dish" placeholder="Chef's grilled tilapia"></label>
                            <label class="admin-field"><span>Sort order</span><input name="sort_order" type="number" placeholder="1"></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Listing Card</h3>
                            <p>Mirrors the front-end restaurant card used in listing pages and nearby dining sections.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>Listing summary</span><textarea name="listing_summary" placeholder="Short summary shown on the restaurant card" required></textarea></label>
                            <label class="admin-field"><span>Rating</span><input name="rating" type="number" min="1" max="5" step="0.1" placeholder="4.5"></label>
                            <label class="admin-field"><span>Review count</span><input name="review_count" type="number" placeholder="140"></label>
                            <label class="admin-field"><span>Price / booking label</span><input name="price_label" placeholder="$$"></label>
                            <label class="admin-field checkbox-row"><input type="checkbox" name="featured" value="1"> <span>Show in featured restaurant sections</span></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Hero / Main Image</h3>
                            <p>Mirrors the main dining image shown on both the listing card and restaurant detail page.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="hero_image_url">
                                <p class="admin-image-preview__label">Current restaurant image</p>
                                <img alt="Current restaurant image preview" hidden>
                                <div class="admin-image-preview__empty">No restaurant image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Main image URL</span><input name="hero_image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload main image</span><input name="hero_image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Main image alt text</span><input name="hero_image_alt" placeholder="Describe the restaurant image"></label>
                                <label class="admin-field admin-field--full"><span>Hero gallery image URLs</span><textarea name="gallery_text" placeholder="One image URL per line. Remove a line here if you want that image removed from the front end."></textarea></label>
                                <label class="admin-field admin-field--full"><span>Upload more hero/gallery images</span><input name="gallery_files[]" type="file" accept="image/*" multiple></label>
                            </div>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Detail Page Content</h3>
                            <p>Mirrors the “About this restaurant”, “Signature dish”, and “Practical information” sections.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>About this restaurant</span><textarea name="detail_intro" placeholder="Main restaurant introduction shown on the detail page" required></textarea></label>
                            <label class="admin-field admin-field--full"><span>Practical information</span><textarea name="practical_info" placeholder="Useful planning details for this dining stop"></textarea></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Booking Panel</h3>
                            <p>Mirrors the right-side dining call to action on the detail page.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field admin-field--full"><span>External booking or information URL</span><input name="booking_url" placeholder="https://partner-site.com/restaurant"></label>
                        </div>
                    </section>
                @elseif($resource === 'tour-operators')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Operator Identity</h3>
                            <p>Mirrors the operator cards displayed inside attraction and destination planning sections.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Region</span>
                                <select name="region_id" required>
                                    @foreach($regions as $region)
                                        <option value="{{ $region->id }}">{{ $region->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Country / destination</span>
                                <select name="country_id" required>
                                    @foreach($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Linked attraction</span>
                                <select name="attraction_id">
                                    <option value="">No linked attraction</option>
                                    @foreach($attractions as $attraction)
                                        <option value="{{ $attraction->id }}">{{ $attraction->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <label class="admin-field"><span>Operator name</span><input name="name" placeholder="Kenya Journey Studio" required></label>
                            <label class="admin-field"><span>URL slug</span><input name="slug" placeholder="kenya-journey-studio" required></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Operator Card Content</h3>
                            <p>Mirrors the operator card content shown inside public attraction pages.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="hero_image_url">
                                <p class="admin-image-preview__label">Current operator image</p>
                                <img alt="Current operator image preview" hidden>
                                <div class="admin-image-preview__empty">No operator image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Operator summary</span><textarea name="summary" placeholder="Summary shown on the operator card" required></textarea></label>
                                <label class="admin-field admin-field--full"><span>Specialties list</span><textarea name="specialties_text" placeholder="One specialty per line"></textarea></label>
                                <label class="admin-field admin-field--full"><span>Image URL</span><input name="hero_image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload image</span><input name="hero_image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Image alt text</span><input name="hero_image_alt" placeholder="Describe the operator image"></label>
                                <label class="admin-field admin-field--full"><span>Website URL</span><input name="website_url" placeholder="https://operator-site.com"></label>
                                <label class="admin-field admin-field--full"><span>Booking URL</span><input name="booking_url" placeholder="https://operator-site.com/book"></label>
                            </div>
                        </div>
                    </section>
                @elseif($resource === 'page-sections')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Homepage Block Identity</h3>
                            <p>Identifies which front-end homepage section this content powers.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Page key</span><input name="page_key" placeholder="home" required></label>
                            <label class="admin-field"><span>Section key</span><input name="section_key" placeholder="featured_attractions" required></label>
                            <label class="admin-field"><span>Sort order</span><input name="sort_order" type="number" placeholder="1"></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Homepage Copy</h3>
                            <p>Mirrors the eyebrow, title, and body copy shown on the front-end homepage section.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Eyebrow</span><input name="eyebrow" placeholder="Featured Attractions"></label>
                            <label class="admin-field admin-field--full"><span>Section title</span><input name="title" placeholder="Section heading"></label>
                            <label class="admin-field admin-field--full"><span>Section body</span><textarea name="body" placeholder="Supporting copy shown in this homepage block"></textarea></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Homepage Image</h3>
                            <p>Mirrors any supporting image slot used by this homepage section.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="image_url">
                                <p class="admin-image-preview__label">Current homepage image</p>
                                <img alt="Current homepage section image preview" hidden>
                                <div class="admin-image-preview__empty">No homepage image selected yet.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Image URL</span><input name="image_url" placeholder="Paste image URL or upload below"></label>
                                <label class="admin-field admin-field--full"><span>Upload image</span><input name="image_file" type="file" accept="image/*"></label>
                                <label class="admin-field admin-field--full"><span>Meta settings</span><textarea name="meta_text" placeholder="Use key:value pairs, one per line. Example: cta_label: Explore Regions"></textarea></label>
                            </div>
                        </div>
                    </section>
                @elseif($resource === 'settings')
                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Setting Identity</h3>
                            <p>Controls global front-end branding and site-wide text.</p>
                        </div>
                        <div class="admin-form-grid">
                            <label class="admin-field"><span>Group</span><input name="group_name" placeholder="branding" required></label>
                            <label class="admin-field"><span>Key</span><input name="key" placeholder="logo_path" required></label>
                        </div>
                    </section>

                    <section class="admin-form-section">
                        <div class="admin-form-section__head">
                            <h3>Setting Value</h3>
                            <p>Mirrors a global value used on the public site, such as the logo, brand colors, or default copy.</p>
                        </div>
                        <div class="admin-image-panel">
                            <div class="admin-image-preview" data-preview-target="value">
                                <p class="admin-image-preview__label">Current image-based setting preview</p>
                                <img alt="Current setting image preview" hidden>
                                <div class="admin-image-preview__empty">If this value is an image path, it will preview here.</div>
                            </div>
                            <div class="admin-form-grid">
                                <label class="admin-field admin-field--full"><span>Value</span><textarea name="value" placeholder="Setting value"></textarea></label>
                                <label class="admin-field admin-field--full"><span>Upload logo / image</span><input name="logo_file" type="file" accept="image/*"></label>
                            </div>
                        </div>
                    </section>
                @endif

                <button class="button button--full" type="submit">Save</button>
            </form>
        </div>
    </div>
@endforeach
@endsection
