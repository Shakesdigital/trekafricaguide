<?php
namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;
class StaticBuildRoutesTest extends TestCase
{
    use RefreshDatabase;
    public function test_static_build_accepts_safe_output_and_omits_detail_pages(): void
    {
        $this->seed();
        $output = storage_path('app/static-verify');
        if (File::isDirectory($output)) File::deleteDirectory($output);
        $this->artisan('static:build', ['--output' => 'storage/app/static-verify'])->assertExitCode(0);
        $this->assertFileExists($output.'/index.html');
        $this->assertFileDoesNotExist($output.'/attractions/zanzibar/index.html');
        $redirects = File::get($output.'/_redirects');
        $this->assertStringContainsString('/attractions/zanzibar /attractions/index.html?q=Zanzibar&focus=listing-zanzibar#listing-zanzibar 301', $redirects);
        File::deleteDirectory($output);
    }
    public function test_static_build_rejects_output_outside_storage_app(): void
    {
        $this->artisan('static:build', ['--output' => 'storage/elsewhere'])->assertExitCode(1);
    }
}
