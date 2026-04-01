<?php

use App\Http\Controllers\TravelController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TravelController::class, 'home'])->name('home');
Route::get('/regions', [TravelController::class, 'regions'])->name('regions.index');
Route::get('/destinations', [TravelController::class, 'destinations'])->name('destinations.index');
Route::get('/destinations/{slug}', [TravelController::class, 'destination'])->name('destinations.show');
Route::get('/safaris-tours', [TravelController::class, 'safaris'])->name('safaris.index');
Route::get('/accommodations', [TravelController::class, 'accommodations'])->name('accommodations.index');
Route::get('/restaurants', [TravelController::class, 'restaurants'])->name('restaurants.index');
Route::get('/travel-guides', [TravelController::class, 'blog'])->name('blog.index');
Route::get('/local-experiences', [TravelController::class, 'experiences'])->name('experiences.index');
Route::get('/about', [TravelController::class, 'about'])->name('about');
Route::get('/contact', [TravelController::class, 'contact'])->name('contact');
