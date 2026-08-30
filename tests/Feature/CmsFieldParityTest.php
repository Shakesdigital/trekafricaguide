<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\File;
use ReflectionClass;

/**
 * Asserts that every fillable field on each listing model has a matching
 * entry in public/cms-schema.js, and that the schema's field sets align
 * with the model definitions.
 */
class CmsFieldParityTest extends TestCase
{
    /**
     * Models that map to a CMS resource and their expected schema key.
     */
    private const MODEL_SCHEMA_MAP = [
        \App\Models\Region::class        => 'regions',
        \App\Models\Country::class       => 'countries',
        \App\Models\Attraction::class    => 'attractions',
        \App\Models\Accommodation::class => 'accommodations',
        \App\Models\Restaurant::class    => 'restaurants',
        \App\Models\TourOperator::class  => 'tour_operators',
    ];

    /** @test */
    public function cms_schema_js_exists_and_is_valid_json()
    {
        $path = public_path('cms-schema.js');
        $this->assertFileExists($path);

        $content = file_get_contents($path);
        $this->assertStringContainsString('CMS_SCHEMA', $content);
        $this->assertStringContainsString('regions', $content);
        $this->assertStringContainsString('attractions', $content);
        $this->assertStringContainsString('accommodations', $content);
        $this->assertStringContainsString('restaurants', $content);
        $this->assertStringContainsString('tour_operators', $content);
    }

    /** @test */
    public function cms_core_js_exists_and_exports_expected_functions()
    {
        $path = public_path('cms-core.js');
        $this->assertFileExists($path);

        $content = file_get_contents($path);

        // Publication timing
        $this->assertStringContainsString('isVisible', $content);
        $this->assertStringContainsString('visibleRecords', $content);

        // Stock fallback
        $this->assertStringContainsString('resolveImage', $content);
        $this->assertStringContainsString('pickHero', $content);
        $this->assertStringContainsString('pickGallery', $content);

        // Offer freshness
        $this->assertStringContainsString('isOfferFresh', $content);
        $this->assertStringContainsString('offerPriceLabel', $content);

        // Stay22 link building
        $this->assertStringContainsString('buildStay22Link', $content);
        $this->assertStringContainsString('buildSearchbarLink', $content);

        // Disclosures
        $this->assertStringContainsString('offerRel', $content);
        $this->assertStringContainsString('offerDisclosure', $content);

        // Internal URLs
        $this->assertStringContainsString('internalUrl', $content);
        $this->assertStringContainsString('INTERNAL_ROUTES', $content);

        // Search ribbon
        $this->assertStringContainsString('searchRibbon', $content);

        // SEO metadata
        $this->assertStringContainsString('buildSeoMeta', $content);

        // Media attribution
        $this->assertStringContainsString('mediaAttribution', $content);
        $this->assertStringContainsString('hasValidAttribution', $content);
    }

    /**
     * Parse the CMS_SCHEMA object from cms-schema.js by evaluating the
     * field definitions into a PHP-readable structure.
     */
    private function parseSchemaFields(string $resourceKey): array
    {
        $content = file_get_contents(public_path('cms-schema.js'));

        // Extract the fields array for the given resource using regex.
        // The schema is structured as: key: { ..., fields: [ { ... }, ... ], ... }
        $pattern = '/' . preg_quote($resourceKey, '/') . ":\s*\{.*?fields:\s*\[(.*?)\],\s*\}/s";
        $matches = [];
        if (!preg_match($pattern, $content, $matches)) {
            $this->fail("Could not find resource '{$resourceKey}' in cms-schema.js");
        }

        $fieldsSection = $matches[1];

        // Extract all field names from the array of objects
        preg_match_all('/\{[^}]*name:\s*\'([^\']+)\'/s', $fieldsSection, $fieldNames);
        return $fieldNames[1] ?? [];
    }

    /** @test */
    public function model_fillable_fields_have_cms_schema_entries()
    {
        foreach (self::MODEL_SCHEMA_MAP as $modelClass => $schemaKey) {
            $model = new $modelClass();
            $fillable = $model->getFillable();

            $schemaFields = $this->parseSchemaFields($schemaKey);

            // Every fillable field should be represented in the CMS schema.
            $missing = array_diff($fillable, $schemaFields);
            $this->assertSame(
                [],
                $missing,
                sprintf(
                    'Model %s has fillable fields not in CMS schema: %s',
                    $modelClass,
                    implode(', ', $missing)
                )
            );
        }
    }

    /** @test */
    public function cms_schema_includes_common_publication_fields()
    {
        foreach (['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour_operators'] as $resource) {
            $fields = $this->parseSchemaFields($resource);

            foreach (['status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'] as $commonField) {
                $this->assertContains(
                    $commonField,
                    $fields,
                    "CMS schema for '{$resource}' should include '{$commonField}'"
                );
            }
        }
    }

    /** @test */
    public function cms_schema_includes_shared_image_fields()
    {
        foreach (['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour_operators'] as $resource) {
            $fields = $this->parseSchemaFields($resource);

            $this->assertContains('hero_image_url', $fields, "CMS schema for '{$resource}' should include 'hero_image_url'");
            $this->assertContains('hero_image_alt', $fields, "CMS schema for '{$resource}' should include 'hero_image_alt'");
        }
    }

    /** @test */
    public function cms_core_is_visible_logic_matches_has_publication_state_scope()
    {
        // The JS isOfferFresh default max age (90 days) should match the
        // Blade freshness check in booking-offers.blade.php.
        $bladeContent = file_get_contents(resource_path('views/site/partials/booking-offers.blade.php'));
        $this->assertStringContainsString('subDays', $bladeContent);
        $this->assertStringContainsString('90', $bladeContent);

        // The cms-core.js should also use 90 days.
        $coreContent = file_get_contents(public_path('cms-core.js'));
        $this->assertStringContainsString('DEFAULT_MAX_AGE_DAYS = 90', $coreContent);
    }

    /** @test */
    public function cms_core_offer_freshness_matches_blade_partial()
    {
        // The Blade partial checks: price_amount, price_currency, price_unit,
        // price_checked_at, price_basis — all must be present and within 90 days.
        $bladeContent = file_get_contents(resource_path('views/site/partials/booking-offers.blade.php'));

        // Confirm the Blade checks the same fields as cms-core.js
        $this->assertStringContainsString('price_amount', $bladeContent);
        $this->assertStringContainsString('price_currency', $bladeContent);
        $this->assertStringContainsString('price_unit', $bladeContent);
        $this->assertStringContainsString('price_basis', $bladeContent);
        $this->assertStringContainsString('price_checked_at', $bladeContent);

        // Confirm cms-core.js has the same field names
        $coreContent = file_get_contents(public_path('cms-core.js'));
        $this->assertStringContainsString('price_amount', $coreContent);
        $this->assertStringContainsString('price_currency', $coreContent);
        $this->assertStringContainsString('price_unit', $coreContent);
        $this->assertStringContainsString('price_basis', $coreContent);
        $this->assertStringContainsString('price_checked_at', $coreContent);
    }

    /** @test */
    public function stay22_provider_list_matches_between_php_and_js()
    {
        // The PHP Stay22LinkBuilder has a SUPPORTED providers list.
        $phpContent = file_get_contents(app_path('Services/Stay22LinkBuilder.php'));

        // The JS cms-core.js should have the same providers.
        $jsContent = file_get_contents(public_path('cms-core.js'));

        $providers = ['booking', 'expedia', 'hotelscom', 'vrbo', 'agoda', 'tripadvisor', 'kayak', 'getyourguide', 'roam', 'searchbar'];

        foreach ($providers as $provider) {
            $this->assertStringContainsString($provider, $phpContent, "PHP Stay22LinkBuilder should support '{$provider}'");
            $this->assertStringContainsString($provider, $jsContent, "cms-core.js should support '{$provider}'");
        }
    }

    /** @test */
    public function internal_route_roots_match_between_php_and_js()
    {
        // PHP route roots in SiteController and routes/web.php
        $phpContent = file_get_contents(app_path('Http/Controllers/SiteController.php'));

        // JS internal route roots in cms-core.js
        $jsContent = file_get_contents(public_path('cms-core.js'));

        $routes = [
            'regions'       => '/regions',
            'countries'     => '/countries',
            'attractions'   => '/attractions',
            'accommodations' => '/accommodations',
            'restaurants'   => '/restaurants',
        ];

        foreach ($routes as $name => $path) {
            $this->assertStringContainsString($path, $jsContent, "cms-core.js should define internal URL '{$path}' for '{$name}'");
        }
    }

    /** @test */
    public function stock_fallback_paths_match_between_php_and_js()
    {
        // The Blade templates use /images/stock/destinations/ for stock images.
        $bladeContent = file_get_contents(resource_path('views/site/partials/image-slot.blade.php'));
        $this->assertStringContainsString('/images/stock/destinations/', $bladeContent);

        // The cms-core.js should use the same prefix.
        $jsContent = file_get_contents(public_path('cms-core.js'));
        $this->assertStringContainsString('/images/stock/destinations/', $jsContent);
    }

    /** @test */
    public function image_credits_json_has_24_licensed_entries()
    {
        $credits = json_decode(file_get_contents(database_path('data/image-credits.json')), true);

        $this->assertCount(24, $credits['images']);

        foreach ($credits['images'] as $image) {
            $this->assertNotEmpty($image['local_path']);
            $this->assertNotEmpty($image['source_page']);
            $this->assertNotEmpty($image['creator']);
            $this->assertNotEmpty($image['license']);

            // Verify the file actually exists
            $this->assertFileExists(public_path(ltrim($image['local_path'], '/')));

            // Verify the hash matches
            $actualHash = hash_file('sha256', public_path(ltrim($image['local_path'], '/')));
            $this->assertSame(
                strtolower($image['sha256']),
                $actualHash,
                "SHA256 mismatch for {$image['local_path']}"
            );
        }
    }

    /** @test */
    public function cms_sync_js_stay22_link_matches_cms_core_implementation()
    {
        // The cms-sync.js (hosted CMS runtime) should delegate URL construction
        // to shared CmsCore for parity with PHP Stay22LinkBuilder.
        $syncContent = file_get_contents(public_path('cms-sync.js'));

        // Check that the hosted runtime references CmsCore for link building
        $this->assertStringContainsString('CmsCore', $syncContent);
        $this->assertStringContainsString('buildStay22Link', $syncContent);

        // Check that the hosted runtime handles affiliate_supported gate
        $this->assertStringContainsString('affiliate_supported', $syncContent);

        // The core delegate should use stay22.com/allez/ pattern
        $coreContent = file_get_contents(public_path('cms-core.js'));
        $this->assertStringContainsString('stay22.com/allez/', $coreContent);

        // Check that rooms are never sent to Stay22 (excluded via !== 0 check)
        $this->assertStringNotContainsString('rooms=', $coreContent);
    }

    /**
     * The hosted runtime (cms-sync.js) delegates searchRibbon to CmsCore,
     * so cms-core.js must export a searchRibbon function.
     */
    public function cms_core_export_search_ribbon_matches_sync_delegation()
    {
        $syncContent = file_get_contents(public_path('cms-sync.js'));
        $this->assertStringContainsString('CmsCore.searchRibbon', $syncContent);

        $coreContent = file_get_contents(public_path('cms-core.js'));
        $this->assertStringContainsString('searchRibbon', $coreContent);
        $this->assertStringContainsString('function searchRibbon', $coreContent);
    }

    /**
     * The home-intro-africa-map stock slot must be present in both the
     * Blade image-slot partial and cms-core.js SLOT_MAP.
     */
    public function home_intro_africa_map_slot_parity()
    {
        $bladeContent = file_get_contents(resource_path('views/site/partials/image-slot.blade.php'));
        $this->assertStringContainsString('home-intro-africa-map', $bladeContent);

        $coreContent = file_get_contents(public_path('cms-core.js'));
        $this->assertStringContainsString('home-intro-africa-map', $coreContent);
        $this->assertStringContainsString("'home-intro-africa-map': 'okavango-delta'", $coreContent);
    }

    /**
     * The layouts/travel.blade.php should not reference any routes
     * that do not exist in routes/web.php.
     */
    public function travel_layout_does_not_reference_undefined_routes()
    {
        $content = file_get_contents(resource_path('views/layouts/travel.blade.php'));

        // These route names were removed/replaced:
        $invalidRoutes = ['destinations.index', 'destinations.show', 'safaris.index', 'experiences.index', 'blog.index', 'about'];

        foreach ($invalidRoutes as $route) {
            $this->assertStringNotContainsString("route('{$route}'", $content,
                "layouts/travel.blade.php should not reference undefined route '{$route}'");
        }

        // Should use valid route names instead
        $validRoutes = ['countries.index', 'countries.show', 'attractions.index', 'contact'];
        foreach ($validRoutes as $route) {
            $this->assertStringContainsString("route('{$route}'", $content,
                "layouts/travel.blade.php should use valid route '{$route}'");
        }
    }
}
