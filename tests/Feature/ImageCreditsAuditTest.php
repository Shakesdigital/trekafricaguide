<?php
namespace Tests\Feature;
use Tests\TestCase;
class ImageCreditsAuditTest extends TestCase
{
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
}
