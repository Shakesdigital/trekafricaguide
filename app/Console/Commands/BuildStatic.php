<?php

namespace App\Console\Commands;

use App\Models\Accommodation;
use App\Models\Attraction;
use App\Models\Country;
use App\Models\Region;
use App\Models\Restaurant;
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

        if (File::isDirectory($distPath)) {
            File::deleteDirectory($distPath);
        }

        File::makeDirectory($distPath, 0755, true);

        $this->info('Building static site into /dist ...');

        if (File::isDirectory(public_path('build'))) {
            File::copyDirectory(public_path('build'), $distPath.'/build');
        }

        foreach ([
            'favicon.ico',
            'robots.txt',
            'logo to edit.png',
            'listing style.png',
            'Tourist Attraction individual listing style.PNG',
            'Tourist Attraction listing style.png',
        ] as $file) {
            if (File::exists(public_path($file))) {
                File::copy(public_path($file), $distPath.'/'.$file);
            }
        }

        $routes = [
            '/' => 'index.html',
            '/regions' => 'regions/index.html',
            '/countries' => 'countries/index.html',
            '/attractions' => 'attractions/index.html',
            '/accommodations' => 'accommodations/index.html',
            '/restaurants' => 'restaurants/index.html',
        ];

        foreach (Region::query()->get() as $region) {
            $routes["/regions/{$region->slug}"] = "regions/{$region->slug}/index.html";
        }

        foreach (Country::query()->get() as $country) {
            $routes["/countries/{$country->slug}"] = "countries/{$country->slug}/index.html";
        }

        foreach (Attraction::query()->get() as $attraction) {
            $routes["/attractions/{$attraction->slug}"] = "attractions/{$attraction->slug}/index.html";
        }

        foreach (Accommodation::query()->get() as $accommodation) {
            $routes["/accommodations/{$accommodation->slug}"] = "accommodations/{$accommodation->slug}/index.html";
        }

        foreach (Restaurant::query()->get() as $restaurant) {
            $routes["/restaurants/{$restaurant->slug}"] = "restaurants/{$restaurant->slug}/index.html";
        }

        $kernel = app(\Illuminate\Contracts\Http\Kernel::class);
        $rendered = 0;
        $failed = 0;

        foreach ($routes as $uri => $outputFile) {
            $this->line("  -> {$uri}");

            try {
                $request = Request::create($uri, 'GET');
                $response = $kernel->handle($request);

                if ($response->getStatusCode() !== 200) {
                    $this->error("    x HTTP {$response->getStatusCode()}");
                    $failed++;
                    $kernel->terminate($request, $response);
                    continue;
                }

                $html = $response->getContent();
                $appUrl = rtrim(config('app.url', 'http://localhost'), '/');
                $html = str_replace($appUrl, '', $html);
                $html = str_replace('http://localhost', '', $html);
                $html = str_replace('https://localhost', '', $html);
                $html = str_replace('href=""', 'href="/"', $html);
                $html = str_replace("href=''", "href='/'", $html);
                $html = str_replace('action=""', 'action="/"', $html);

                $outputPath = $distPath.'/'.$outputFile;
                File::ensureDirectoryExists(dirname($outputPath));
                File::put($outputPath, $html);

                $rendered++;
                $kernel->terminate($request, $response);
            } catch (\Throwable $exception) {
                $this->error("    x {$exception->getMessage()}");
                $failed++;
            }

            app()->forgetInstance(\Illuminate\Contracts\Http\Kernel::class);
        }

        File::put($distPath.'/_redirects', <<<'REDIRECTS'
# Netlify redirects for clean URL routing
/regions            /regions/index.html         200
/countries          /countries/index.html       200
/attractions        /attractions/index.html     200
/accommodations     /accommodations/index.html  200
/restaurants        /restaurants/index.html     200
/*                  /index.html                  404
REDIRECTS);

        $this->newLine();
        $this->info('Static build complete.');
        $this->info("Rendered: {$rendered} pages");

        if ($failed > 0) {
            $this->warn("Failed: {$failed} pages");
        }

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
