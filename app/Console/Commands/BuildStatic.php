<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class BuildStatic extends Command
{
    protected $signature = 'static:build {--base-url= : Base URL for the static site}';

    protected $description = 'Pre-render all routes to static HTML for Netlify deployment';

    public function handle(): int
    {
        $distPath = base_path('dist');

        // Clean dist folder
        if (File::isDirectory($distPath)) {
            File::deleteDirectory($distPath);
        }
        File::makeDirectory($distPath, 0755, true);

        $this->info('🏗  Building static site into /dist …');

        // ── 1. Copy public assets ────────────────────────────────────────
        $this->info('📦 Copying public assets…');

        // Copy Vite build output
        if (File::isDirectory(public_path('build'))) {
            File::copyDirectory(public_path('build'), $distPath . '/build');
        }

        // Copy favicon & robots
        foreach (['favicon.ico', 'robots.txt'] as $file) {
            if (File::exists(public_path($file))) {
                File::copy(public_path($file), $distPath . '/' . $file);
            }
        }

        // ── 2. Define all routes to render ───────────────────────────────
        $destinations = collect(config('travel.destinations'));

        $routes = [
            '/'                   => 'index.html',
            '/regions'            => 'regions/index.html',
            '/destinations'       => 'destinations/index.html',
            '/safaris-tours'      => 'safaris-tours/index.html',
            '/accommodations'     => 'accommodations/index.html',
            '/travel-guides'      => 'travel-guides/index.html',
            '/local-experiences'  => 'local-experiences/index.html',
            '/about'              => 'about/index.html',
            '/contact'            => 'contact/index.html',
        ];

        // Add each destination detail page
        foreach ($destinations as $destination) {
            $slug = $destination['slug'];
            $routes["/destinations/{$slug}"] = "destinations/{$slug}/index.html";
        }

        // ── 3. Render each route ─────────────────────────────────────────
        $kernel = app(\Illuminate\Contracts\Http\Kernel::class);
        $rendered = 0;
        $failed  = 0;

        foreach ($routes as $uri => $outputFile) {
            $this->line("  → {$uri}");

            try {
                $request = Request::create($uri, 'GET');
                $response = $kernel->handle($request);

                if ($response->getStatusCode() !== 200) {
                    $this->error("    ✗ HTTP {$response->getStatusCode()}");
                    $failed++;
                    $kernel->terminate($request, $response);
                    continue;
                }

                $html = $response->getContent();

                // Strip APP_URL / localhost from all URLs so they become root-relative
                $appUrl = rtrim(config('app.url', 'http://localhost'), '/');
                $html = str_replace($appUrl, '', $html);
                // Also catch any leftover http://localhost variants
                $html = str_replace('http://localhost', '', $html);
                $html = str_replace('https://localhost', '', $html);
                // Fix empty hrefs (home route becomes empty after stripping)
                $html = str_replace('href=""', 'href="/"', $html);
                $html = str_replace("href=''", "href='/'", $html);
                $html = str_replace('action=""', 'action="/"', $html);

                $outputPath = $distPath . '/' . $outputFile;
                File::ensureDirectoryExists(dirname($outputPath));
                File::put($outputPath, $html);

                $rendered++;
                $kernel->terminate($request, $response);
            } catch (\Throwable $e) {
                $this->error("    ✗ {$e->getMessage()}");
                $failed++;
            }

            // Reset the app between requests to avoid stale state
            app()->forgetInstance(\Illuminate\Contracts\Http\Kernel::class);
        }

        // ── 4. Generate _redirects for Netlify clean URLs ────────────────
        $redirects = <<<'REDIRECTS'
# Netlify redirects for clean URL routing
/safaris-tours      /safaris-tours/index.html   200
/travel-guides      /travel-guides/index.html   200
/local-experiences  /local-experiences/index.html 200

# SPA-style catch-all for any unmatched path → 404 page (or home)
/*                  /index.html                  404
REDIRECTS;

        File::put($distPath . '/_redirects', $redirects);

        // ── 5. Summary ──────────────────────────────────────────────────
        $this->newLine();
        $this->info("✅ Static build complete!");
        $this->info("   Rendered: {$rendered} pages");
        if ($failed > 0) {
            $this->warn("   Failed:   {$failed} pages");
        }
        $this->info("   Output:   /dist");
        $this->newLine();

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
