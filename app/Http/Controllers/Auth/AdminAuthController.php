<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AdminAuthController extends Controller
{
    public function create(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('admin.index');
        }

        $settings = SiteSetting::query()->get()->pluck('value', 'key');

        return view('auth.admin-login', [
            'title' => 'Admin Login',
            'siteName' => $settings['site_name'] ?? 'Trek Africa Guide',
            'siteTagline' => $settings['site_tagline'] ?? 'African travel guide and booking directory',
            'metaDescription' => $settings['default_meta_description'] ?? 'Admin login',
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
            'regionsNav' => Region::query()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            return back()
                ->withErrors(['email' => 'The provided credentials do not match our records.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        if (! $request->user()?->isAdmin()) {
            Auth::logout();

            return back()
                ->withErrors(['email' => 'This account does not have admin access.'])
                ->onlyInput('email');
        }

        return redirect()->intended(route('admin.index'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
