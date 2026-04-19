<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Country;
use App\Models\PageSection;
use App\Models\Region;
use App\Models\Restaurant;
use App\Models\SiteSetting;
use App\Models\TourOperator;
use App\Services\SupabaseStorageService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function __construct(
        private readonly SupabaseStorageService $storage
    ) {}

    public function index(Request $request)
    {
        $settings = SiteSetting::query()->get()->pluck('value', 'key');

        return view('admin.index', [
            'title' => 'CMS',
            'siteName' => $settings['site_name'] ?? 'Trek Africa Guide',
            'siteTagline' => $settings['site_tagline'] ?? 'African travel guide and booking directory',
            'metaDescription' => $settings['default_meta_description'] ?? 'Manage Trek Africa Guide content',
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
            'adminUser' => $request->user(),
            'tab' => $request->query('tab', 'overview'),
            'regions' => Region::query()->orderBy('sort_order')->get(),
            'countries' => Country::query()->with('region')->orderBy('name')->get(),
            'attractions' => Attraction::query()->with(['region', 'country'])->orderByDesc('featured')->orderBy('name')->get(),
            'accommodations' => Accommodation::query()->with(['country', 'attraction'])->orderByDesc('featured')->orderBy('name')->get(),
            'restaurants' => Restaurant::query()->with(['country', 'attraction'])->orderByDesc('featured')->orderBy('name')->get(),
            'tourOperators' => TourOperator::query()->with(['country', 'attraction'])->orderBy('name')->get(),
            'pageSections' => PageSection::query()->orderBy('page_key')->orderBy('sort_order')->get(),
            'settings' => SiteSetting::query()->orderBy('group_name')->orderBy('key')->get(),
            'regionsNav' => Region::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function save(Request $request, string $resource): RedirectResponse
    {
        $definition = $this->definition($resource);
        abort_unless($definition, 404);

        $recordId = $request->input('record_id');
        $modelClass = $definition['model'];
        $record = $recordId ? $modelClass::query()->findOrFail($recordId) : new $modelClass();
        $validated = $request->validate($this->rules($resource, $record));
        $validated = $this->mergeUploads($request, $resource, $validated, $record);
        $payload = $this->normalizePayload($resource, $validated);

        $record->fill($payload)->save();

        return redirect()
            ->route('admin.index', ['tab' => $resource])
            ->with('status', Str::headline($resource).' saved.');
    }

    public function destroy(string $resource, int $record): RedirectResponse
    {
        $definition = $this->definition($resource);
        abort_unless($definition, 404);

        $modelClass = $definition['model'];
        $item = $modelClass::query()->findOrFail($record);
        $item->delete();

        return redirect()
            ->route('admin.index', ['tab' => $resource])
            ->with('status', Str::headline($resource).' deleted.');
    }

    private function definition(string $resource): ?array
    {
        return [
            'regions' => ['model' => Region::class],
            'countries' => ['model' => Country::class],
            'attractions' => ['model' => Attraction::class],
            'accommodations' => ['model' => Accommodation::class],
            'restaurants' => ['model' => Restaurant::class],
            'tour-operators' => ['model' => TourOperator::class],
            'page-sections' => ['model' => PageSection::class],
            'settings' => ['model' => SiteSetting::class],
        ][$resource] ?? null;
    }

    private function rules(string $resource, Model $record): array
    {
        return match ($resource) {
            'regions' => [
                'slug' => ['required', 'max:255', Rule::unique('regions', 'slug')->ignore($record->getKey())],
                'name' => ['required', 'max:255'],
                'hero_title' => ['required'],
                'hero_text' => ['required'],
                'overview' => ['required'],
                'countries_intro' => ['nullable'],
                'hero_image_url' => ['nullable', 'url'],
                'hero_image_file' => ['nullable', 'image', 'max:5120'],
                'hero_image_alt' => ['nullable', 'max:255'],
                'sort_order' => ['nullable', 'integer'],
            ],
            'countries' => [
                'region_id' => ['required', 'exists:regions,id'],
                'slug' => ['required', 'max:255', Rule::unique('countries', 'slug')->ignore($record->getKey())],
                'name' => ['required', 'max:255'],
                'hero_title' => ['required'],
                'hero_text' => ['required'],
                'overview' => ['required'],
                'access_summary' => ['nullable'],
                'best_time' => ['nullable'],
                'planning_tips' => ['nullable'],
                'hero_image_url' => ['nullable', 'url'],
                'hero_image_file' => ['nullable', 'image', 'max:5120'],
                'hero_image_alt' => ['nullable', 'max:255'],
                'sort_order' => ['nullable', 'integer'],
            ],
            'attractions' => [
                'region_id' => ['required', 'exists:regions,id'],
                'country_id' => ['required', 'exists:countries,id'],
                'slug' => ['required', 'max:255', Rule::unique('attractions', 'slug')->ignore($record->getKey())],
                'name' => ['required', 'max:255'],
                'location_name' => ['nullable', 'max:255'],
                'hero_image_url' => ['nullable', 'url'],
                'hero_image_file' => ['nullable', 'image', 'max:5120'],
                'hero_image_alt' => ['nullable', 'max:255'],
                'listing_summary' => ['required'],
                'detail_intro' => ['required'],
                'full_description' => ['nullable'],
                'getting_there' => ['nullable'],
                'best_time' => ['nullable'],
                'practical_info' => ['nullable'],
                'gallery_text' => ['nullable'],
                'highlights_text' => ['nullable'],
                'rating' => ['nullable', 'numeric', 'between:1,5'],
                'review_count' => ['nullable', 'integer'],
                'price_label' => ['nullable', 'max:255'],
                'booking_url' => ['nullable', 'url'],
                'sort_order' => ['nullable', 'integer'],
            ],
            'accommodations' => [
                'region_id' => ['required', 'exists:regions,id'],
                'country_id' => ['required', 'exists:countries,id'],
                'attraction_id' => ['nullable', 'exists:attractions,id'],
                'slug' => ['required', 'max:255', Rule::unique('accommodations', 'slug')->ignore($record->getKey())],
                'name' => ['required', 'max:255'],
                'property_type' => ['nullable', 'max:255'],
                'location_name' => ['nullable', 'max:255'],
                'hero_image_url' => ['nullable', 'url'],
                'hero_image_file' => ['nullable', 'image', 'max:5120'],
                'hero_image_alt' => ['nullable', 'max:255'],
                'listing_summary' => ['required'],
                'detail_intro' => ['required'],
                'practical_info' => ['nullable'],
                'amenities_text' => ['nullable'],
                'rating' => ['nullable', 'numeric', 'between:1,5'],
                'review_count' => ['nullable', 'integer'],
                'price_label' => ['nullable', 'max:255'],
                'booking_url' => ['nullable', 'url'],
                'sort_order' => ['nullable', 'integer'],
            ],
            'restaurants' => [
                'region_id' => ['required', 'exists:regions,id'],
                'country_id' => ['required', 'exists:countries,id'],
                'attraction_id' => ['nullable', 'exists:attractions,id'],
                'slug' => ['required', 'max:255', Rule::unique('restaurants', 'slug')->ignore($record->getKey())],
                'name' => ['required', 'max:255'],
                'cuisine' => ['nullable', 'max:255'],
                'location_name' => ['nullable', 'max:255'],
                'signature_dish' => ['nullable', 'max:255'],
                'hero_image_url' => ['nullable', 'url'],
                'hero_image_file' => ['nullable', 'image', 'max:5120'],
                'hero_image_alt' => ['nullable', 'max:255'],
                'listing_summary' => ['required'],
                'detail_intro' => ['required'],
                'practical_info' => ['nullable'],
                'rating' => ['nullable', 'numeric', 'between:1,5'],
                'review_count' => ['nullable', 'integer'],
                'price_label' => ['nullable', 'max:255'],
                'booking_url' => ['nullable', 'url'],
                'sort_order' => ['nullable', 'integer'],
            ],
            'tour-operators' => [
                'region_id' => ['required', 'exists:regions,id'],
                'country_id' => ['required', 'exists:countries,id'],
                'attraction_id' => ['nullable', 'exists:attractions,id'],
                'slug' => ['required', 'max:255', Rule::unique('tour_operators', 'slug')->ignore($record->getKey())],
                'name' => ['required', 'max:255'],
                'summary' => ['required'],
                'website_url' => ['nullable', 'url'],
                'booking_url' => ['nullable', 'url'],
                'hero_image_url' => ['nullable', 'url'],
                'hero_image_file' => ['nullable', 'image', 'max:5120'],
                'hero_image_alt' => ['nullable', 'max:255'],
                'specialties_text' => ['nullable'],
            ],
            'page-sections' => [
                'page_key' => ['required', 'max:255'],
                'section_key' => ['required', 'max:255'],
                'eyebrow' => ['nullable', 'max:255'],
                'title' => ['nullable', 'max:255'],
                'body' => ['nullable'],
                'image_url' => ['nullable', 'url'],
                'image_file' => ['nullable', 'image', 'max:5120'],
                'meta_text' => ['nullable'],
                'sort_order' => ['nullable', 'integer'],
            ],
            'settings' => [
                'group_name' => ['required', 'max:255'],
                'key' => ['required', 'max:255', Rule::unique('site_settings', 'key')->ignore($record->getKey())],
                'value' => ['nullable'],
                'logo_file' => ['nullable', 'image', 'max:5120'],
            ],
            default => [],
        };
    }

    private function normalizePayload(string $resource, array $validated): array
    {
        return match ($resource) {
            'attractions' => $this->withArrays($validated, [
                'gallery' => 'gallery_text',
                'highlights' => 'highlights_text',
            ]),
            'accommodations' => $this->withArrays($validated, [
                'amenities' => 'amenities_text',
            ]),
            'tour-operators' => $this->withArrays($validated, [
                'specialties' => 'specialties_text',
            ]),
            'page-sections' => array_merge(
                Arr::except($validated, ['meta_text']),
                ['meta' => $this->toKeyValueArray($validated['meta_text'] ?? '')]
            ),
            default => $validated,
        };
    }

    private function mergeUploads(Request $request, string $resource, array $validated, Model $record): array
    {
        $imageResources = ['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour-operators'];

        if (in_array($resource, $imageResources, true) && $request->hasFile('hero_image_file')) {
            $validated['hero_image_url'] = $this->storage->upload(
                $request->file('hero_image_file'),
                $resource,
                $validated['slug'] ?? $record->getAttribute('slug') ?? $validated['name'] ?? 'image'
            );
        }

        if ($resource === 'page-sections' && $request->hasFile('image_file')) {
            $validated['image_url'] = $this->storage->upload(
                $request->file('image_file'),
                'page-sections',
                ($validated['page_key'] ?? $record->getAttribute('page_key') ?? 'page').'-'.($validated['section_key'] ?? $record->getAttribute('section_key') ?? 'section')
            );
        }

        if (
            $resource === 'settings'
            && ($validated['key'] ?? $record->getAttribute('key')) === 'logo_path'
            && $request->hasFile('logo_file')
        ) {
            $validated['value'] = $this->storage->upload(
                $request->file('logo_file'),
                'branding',
                'trek-africa-guide-logo'
            );
        }

        return Arr::except($validated, ['hero_image_file', 'image_file', 'logo_file']);
    }

    private function withArrays(array $validated, array $maps): array
    {
        $payload = $validated;

        foreach ($maps as $target => $source) {
            $payload[$target] = $this->toLineArray($validated[$source] ?? '');
            unset($payload[$source]);
        }

        $payload['featured'] = request()->boolean('featured');

        return $payload;
    }

    private function toLineArray(string $value): array
    {
        return collect(preg_split('/\r\n|\r|\n/', $value))
            ->map(fn ($line) => trim($line))
            ->filter()
            ->values()
            ->all();
    }

    private function toKeyValueArray(string $value): array
    {
        return collect(preg_split('/\r\n|\r|\n/', $value))
            ->map(fn ($line) => trim($line))
            ->filter()
            ->mapWithKeys(function ($line) {
                [$key, $item] = array_pad(explode(':', $line, 2), 2, '');

                return [trim($key) => trim($item)];
            })
            ->all();
    }
}
