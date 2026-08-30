<?php

namespace Tests\Feature;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\MediaAsset;
use App\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaAssignmentAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_media_assignments_are_complete_and_use_verified_stock_assets(): void
    {
        $assignments = json_decode(file_get_contents(base_path('database/data/media-assignments.json')), true, flags: JSON_THROW_ON_ERROR);
        $credits = json_decode(file_get_contents(base_path('database/data/image-credits.json')), true, flags: JSON_THROW_ON_ERROR);
        $creditsByPath = collect($credits['images'])->keyBy('local_path');

        $this->assertCount(72, $assignments);
        foreach ($assignments as $assignment) {
            $this->assertFileExists(public_path(ltrim($assignment['local_path'], '/')));
            $this->assertStringStartsWith('/images/stock/destinations/', $assignment['local_path']);
            $this->assertArrayHasKey($assignment['local_path'], $creditsByPath->all());
            $credit = $creditsByPath[$assignment['local_path']];
            $this->assertSame($credit['sha256'], hash_file('sha256', public_path(ltrim($assignment['local_path'], '/'))));
            $this->assertSame($credit['license'], $assignment['license']);
            $this->assertSame($credit['license_url'], $assignment['license_url']);
            $this->assertNotEmpty($assignment['attribution_text']);
            $this->assertStringNotContainsString('/images/generated/', $assignment['local_path']);
        }
    }

    public function test_real_seeder_associates_all_media_and_is_idempotent(): void
    {
        $this->seed();
        $this->assertSame(72, MediaAsset::count());
        foreach (['attractions' => Attraction::class, 'accommodations' => Accommodation::class, 'restaurants' => Restaurant::class] as $table => $model) {
            foreach ($model::query()->get() as $owner) {
                $this->assertSame(1, $owner->mediaAssets()->count(), $table.':'.$owner->slug);
                $this->assertTrue($owner->mediaAssets()->first()->mediable->is($owner));
            }
        }

        $this->seed();
        $this->assertSame(72, MediaAsset::count());
    }
}
