<?php

use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [SiteController::class, 'home'])->name('home');

Route::get('/regions', [SiteController::class, 'regions'])->name('regions.index');
Route::get('/regions/{region:slug}', [SiteController::class, 'region'])->name('regions.show');

Route::get('/countries', [SiteController::class, 'countries'])->name('countries.index');
Route::get('/countries/{country:slug}', [SiteController::class, 'country'])->name('countries.show');

Route::get('/attractions', [SiteController::class, 'attractions'])->name('attractions.index');
Route::get('/attractions/{attraction:slug}', [SiteController::class, 'attraction'])->name('attractions.show');

Route::get('/accommodations', [SiteController::class, 'accommodations'])->name('accommodations.index');
Route::get('/accommodations/{accommodation:slug}', [SiteController::class, 'accommodation'])->name('accommodations.show');

Route::get('/restaurants', [SiteController::class, 'restaurants'])->name('restaurants.index');
Route::get('/restaurants/{restaurant:slug}', [SiteController::class, 'restaurant'])->name('restaurants.show');

Route::redirect('/destinations', '/attractions', 301);
Route::redirect('/safaris-tours', '/attractions', 301);
Route::redirect('/travel-guides', '/countries', 301);
Route::redirect('/local-experiences', '/countries', 301);
Route::redirect('/about', '/', 301);
Route::redirect('/contact', '/', 301);

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AdminAuthController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AdminAuthController::class, 'store'])->name('admin.login.store');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/{resource}', [AdminController::class, 'save'])->name('admin.save');
    Route::delete('/admin/{resource}/{record}', [AdminController::class, 'destroy'])->name('admin.destroy');
    Route::post('/admin/logout', [AdminAuthController::class, 'destroy'])->name('admin.logout');
});
