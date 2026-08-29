<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
class ImageCreditsAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_stock_destination_credits_have_existing_licensed_hashes(): void
    {
        $credits = json_decode(file_get_contents(base_path('database/data/image-credits.json')), true);
        $this->assertCount(24, $credits['images']);
        foreach ($credits['images'] as $image) {
            $this->assertFileExists(public_path(ltrim($image['local_path'], '/')));
            $this->assertNotEmpty($image['source_page']); $this->assertNotEmpty($image['license']);
            $this->assertSame(strtolower($image['sha256']), hash_file('sha256', public_path(ltrim($image['local_path'], '/'))));
        }
    }

    public function test_public_directory_pages_render_only_licensed_stock_images(): void
    {
        $this->withoutVite();
        $this->seed();

        foreach (['/', '/regions', '/regions/east-africa', '/countries', '/countries/uganda', '/attractions', '/accommodations', '/restaurants'] as $path) {
            $html = $this->get($path)->assertOk()->getContent();

            $this->assertStringNotContainsString('/images/generated/', $html, $path);
            $this->assertStringNotContainsString('Reserved image', $html, $path);
            $this->assertStringNotContainsString('Image slot', $html, $path);
            $this->assertStringContainsString('/images/stock/destinations/', $html, $path);
        }
    }

    public function test_provider_research_manifest_records_sources_and_complete_price_basis(): void
    {
        $research = json_decode(file_get_contents(base_path('database/data/provider-research.json')), true, flags: JSON_THROW_ON_ERROR);

        $this->assertNotEmpty($research['stay22']['parameters']);
        $this->assertGreaterThanOrEqual(15, count($research['accommodations']));
        $this->assertGreaterThanOrEqual(7, count($research['attractions']));

        foreach (array_filter($research['accommodations'], fn ($item) => isset($item['indicative_price'])) as $item) {
            $this->assertArrayHasKey('stay_dates', $item['indicative_price']);
            $this->assertArrayHasKey('adults', $item['indicative_price']);
            $this->assertArrayHasKey('rooms', $item['indicative_price']);
            $this->assertArrayHasKey('tax_note', $item['indicative_price']);
        }
    }
}
