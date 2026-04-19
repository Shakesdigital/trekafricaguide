@extends('layouts.site')

@section('content')
<section class="admin-shell">
    <div class="container">
        <div class="admin-header">
            <div>
                <p class="eyebrow">CMS</p>
                <h1>Trek Africa Guide Content Manager</h1>
                <p>Minimal, list-first editing for homepage sections, regions, countries, attractions, accommodations, restaurants, tour operators, and global settings.</p>
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
            @foreach([
                'overview' => 'Overview',
                'regions' => 'Regions',
                'countries' => 'Countries',
                'attractions' => 'Attractions',
                'accommodations' => 'Accommodations',
                'restaurants' => 'Restaurants',
                'tour-operators' => 'Tour Operators',
                'page-sections' => 'Homepage',
                'settings' => 'Settings',
            ] as $key => $label)
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
            <div class="info-panel">
                <h3>What is editable here</h3>
                <ul class="bullet-list">
                    <li>Homepage hero, intro text, featured section labels, and site-wide settings.</li>
                    <li>Region and country landing page hero copy, overviews, and images.</li>
                    <li>Listing cards and detail pages for attractions, accommodations, and restaurants.</li>
                    <li>Tour operator profiles and partner booking URLs.</li>
                </ul>
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
                        <h2>{{ \Illuminate\Support\Str::headline($resource) }}</h2>
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
                    <button class="button" type="button" data-modal-open="{{ $resource }}">Add {{ \Illuminate\Support\Str::headline(\Illuminate\Support\Str::singular($resource)) }}</button>
                </div>
            @endif
        @endforeach
    </div>
</section>

@foreach(['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour-operators', 'page-sections', 'settings'] as $resource)
    <div class="admin-modal" data-modal="{{ $resource }}">
        <div class="admin-modal__backdrop" data-modal-close></div>
        <div class="admin-modal__panel">
            <div class="admin-modal__head">
                <h2>{{ \Illuminate\Support\Str::headline(\Illuminate\Support\Str::singular($resource)) }}</h2>
                <button type="button" data-modal-close>&times;</button>
            </div>
            <form action="{{ route('admin.save', $resource) }}" method="POST" class="admin-form" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="record_id">
                @if($resource === 'regions')
                    <input name="name" placeholder="Name" required>
                    <input name="slug" placeholder="Slug" required>
                    <input name="hero_title" placeholder="Hero title" required>
                    <textarea name="hero_text" placeholder="Hero text" required></textarea>
                    <textarea name="overview" placeholder="Overview" required></textarea>
                    <textarea name="countries_intro" placeholder="Countries intro"></textarea>
                    <input name="hero_image_url" placeholder="Hero image URL">
                    <input name="hero_image_file" type="file" accept="image/*">
                    <input name="hero_image_alt" placeholder="Hero image alt">
                    <input name="sort_order" type="number" placeholder="Sort order">
                @elseif($resource === 'countries')
                    <select name="region_id" required>
                        @foreach($regions as $region)
                            <option value="{{ $region->id }}">{{ $region->name }}</option>
                        @endforeach
                    </select>
                    <input name="name" placeholder="Name" required>
                    <input name="slug" placeholder="Slug" required>
                    <input name="hero_title" placeholder="Hero title" required>
                    <textarea name="hero_text" placeholder="Hero text" required></textarea>
                    <textarea name="overview" placeholder="Overview" required></textarea>
                    <textarea name="access_summary" placeholder="Access summary"></textarea>
                    <textarea name="best_time" placeholder="Best time"></textarea>
                    <textarea name="planning_tips" placeholder="Planning tips"></textarea>
                    <input name="hero_image_url" placeholder="Hero image URL">
                    <input name="hero_image_file" type="file" accept="image/*">
                    <input name="hero_image_alt" placeholder="Hero image alt">
                    <input name="sort_order" type="number" placeholder="Sort order">
                @elseif($resource === 'attractions')
                    <select name="region_id" required>
                        @foreach($regions as $region)
                            <option value="{{ $region->id }}">{{ $region->name }}</option>
                        @endforeach
                    </select>
                    <select name="country_id" required>
                        @foreach($countries as $country)
                            <option value="{{ $country->id }}">{{ $country->name }}</option>
                        @endforeach
                    </select>
                    <input name="name" placeholder="Name" required>
                    <input name="slug" placeholder="Slug" required>
                    <input name="location_name" placeholder="Location">
                    <input name="hero_image_url" placeholder="Hero image URL">
                    <input name="hero_image_file" type="file" accept="image/*">
                    <input name="hero_image_alt" placeholder="Hero image alt">
                    <textarea name="listing_summary" placeholder="Listing summary" required></textarea>
                    <textarea name="detail_intro" placeholder="Detail intro" required></textarea>
                    <textarea name="full_description" placeholder="Full description"></textarea>
                    <textarea name="getting_there" placeholder="How to get there"></textarea>
                    <textarea name="best_time" placeholder="Best time"></textarea>
                    <textarea name="practical_info" placeholder="Practical info"></textarea>
                    <textarea name="gallery_text" placeholder="Gallery URLs, one per line"></textarea>
                    <textarea name="highlights_text" placeholder="Highlights, one per line"></textarea>
                    <input name="rating" type="number" min="1" max="5" step="0.1" placeholder="Rating">
                    <input name="review_count" type="number" placeholder="Review count">
                    <input name="price_label" placeholder="Price label">
                    <input name="booking_url" placeholder="Booking URL">
                    <label class="checkbox-row"><input type="checkbox" name="featured" value="1"> Featured</label>
                    <input name="sort_order" type="number" placeholder="Sort order">
                @elseif($resource === 'accommodations')
                    <select name="region_id" required>
                        @foreach($regions as $region)
                            <option value="{{ $region->id }}">{{ $region->name }}</option>
                        @endforeach
                    </select>
                    <select name="country_id" required>
                        @foreach($countries as $country)
                            <option value="{{ $country->id }}">{{ $country->name }}</option>
                        @endforeach
                    </select>
                    <select name="attraction_id">
                        <option value="">No linked attraction</option>
                        @foreach($attractions as $attraction)
                            <option value="{{ $attraction->id }}">{{ $attraction->name }}</option>
                        @endforeach
                    </select>
                    <input name="name" placeholder="Name" required>
                    <input name="slug" placeholder="Slug" required>
                    <input name="property_type" placeholder="Property type">
                    <input name="location_name" placeholder="Location">
                    <input name="hero_image_url" placeholder="Hero image URL">
                    <input name="hero_image_file" type="file" accept="image/*">
                    <input name="hero_image_alt" placeholder="Hero image alt">
                    <textarea name="listing_summary" placeholder="Listing summary" required></textarea>
                    <textarea name="detail_intro" placeholder="Detail intro" required></textarea>
                    <textarea name="practical_info" placeholder="Practical info"></textarea>
                    <textarea name="amenities_text" placeholder="Amenities, one per line"></textarea>
                    <input name="rating" type="number" min="1" max="5" step="0.1" placeholder="Rating">
                    <input name="review_count" type="number" placeholder="Review count">
                    <input name="price_label" placeholder="Price label">
                    <input name="booking_url" placeholder="Booking URL">
                    <label class="checkbox-row"><input type="checkbox" name="featured" value="1"> Featured</label>
                    <input name="sort_order" type="number" placeholder="Sort order">
                @elseif($resource === 'restaurants')
                    <select name="region_id" required>
                        @foreach($regions as $region)
                            <option value="{{ $region->id }}">{{ $region->name }}</option>
                        @endforeach
                    </select>
                    <select name="country_id" required>
                        @foreach($countries as $country)
                            <option value="{{ $country->id }}">{{ $country->name }}</option>
                        @endforeach
                    </select>
                    <select name="attraction_id">
                        <option value="">No linked attraction</option>
                        @foreach($attractions as $attraction)
                            <option value="{{ $attraction->id }}">{{ $attraction->name }}</option>
                        @endforeach
                    </select>
                    <input name="name" placeholder="Name" required>
                    <input name="slug" placeholder="Slug" required>
                    <input name="cuisine" placeholder="Cuisine">
                    <input name="location_name" placeholder="Location">
                    <input name="signature_dish" placeholder="Signature dish">
                    <input name="hero_image_url" placeholder="Hero image URL">
                    <input name="hero_image_file" type="file" accept="image/*">
                    <input name="hero_image_alt" placeholder="Hero image alt">
                    <textarea name="listing_summary" placeholder="Listing summary" required></textarea>
                    <textarea name="detail_intro" placeholder="Detail intro" required></textarea>
                    <textarea name="practical_info" placeholder="Practical info"></textarea>
                    <input name="rating" type="number" min="1" max="5" step="0.1" placeholder="Rating">
                    <input name="review_count" type="number" placeholder="Review count">
                    <input name="price_label" placeholder="Price label">
                    <input name="booking_url" placeholder="Booking URL">
                    <label class="checkbox-row"><input type="checkbox" name="featured" value="1"> Featured</label>
                    <input name="sort_order" type="number" placeholder="Sort order">
                @elseif($resource === 'tour-operators')
                    <select name="region_id" required>
                        @foreach($regions as $region)
                            <option value="{{ $region->id }}">{{ $region->name }}</option>
                        @endforeach
                    </select>
                    <select name="country_id" required>
                        @foreach($countries as $country)
                            <option value="{{ $country->id }}">{{ $country->name }}</option>
                        @endforeach
                    </select>
                    <select name="attraction_id">
                        <option value="">No linked attraction</option>
                        @foreach($attractions as $attraction)
                            <option value="{{ $attraction->id }}">{{ $attraction->name }}</option>
                        @endforeach
                    </select>
                    <input name="name" placeholder="Name" required>
                    <input name="slug" placeholder="Slug" required>
                    <textarea name="summary" placeholder="Summary" required></textarea>
                    <input name="website_url" placeholder="Website URL">
                    <input name="booking_url" placeholder="Booking URL">
                    <input name="hero_image_url" placeholder="Hero image URL">
                    <input name="hero_image_file" type="file" accept="image/*">
                    <input name="hero_image_alt" placeholder="Hero image alt">
                    <textarea name="specialties_text" placeholder="Specialties, one per line"></textarea>
                @elseif($resource === 'page-sections')
                    <input name="page_key" placeholder="Page key" required>
                    <input name="section_key" placeholder="Section key" required>
                    <input name="eyebrow" placeholder="Eyebrow">
                    <input name="title" placeholder="Title">
                    <textarea name="body" placeholder="Body"></textarea>
                    <input name="image_url" placeholder="Image URL">
                    <input name="image_file" type="file" accept="image/*">
                    <textarea name="meta_text" placeholder="Meta as key:value pairs, one per line"></textarea>
                    <input name="sort_order" type="number" placeholder="Sort order">
                @elseif($resource === 'settings')
                    <input name="group_name" placeholder="Group" required>
                    <input name="key" placeholder="Key" required>
                    <textarea name="value" placeholder="Value"></textarea>
                    <input name="logo_file" type="file" accept="image/*">
                @endif
                <button class="button button--full" type="submit">Save</button>
            </form>
        </div>
    </div>
@endforeach
@endsection
