<?php

namespace Tests\Feature;

use Tests\TestCase;

class MediaAssignmentAuditTest extends TestCase
{
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
}
