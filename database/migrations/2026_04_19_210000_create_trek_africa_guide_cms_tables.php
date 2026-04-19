<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('group_name')->default('general');
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->timestamps();
        });

        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page_key');
            $table->string('section_key');
            $table->string('eyebrow')->nullable();
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->string('image_url')->nullable();
            $table->json('meta')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('hero_title');
            $table->text('hero_text');
            $table->text('overview');
            $table->text('countries_intro')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('hero_title');
            $table->text('hero_text');
            $table->text('overview');
            $table->text('access_summary')->nullable();
            $table->text('best_time')->nullable();
            $table->text('planning_tips')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('attractions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('location_name')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->text('listing_summary');
            $table->longText('detail_intro');
            $table->longText('full_description')->nullable();
            $table->text('getting_there')->nullable();
            $table->text('best_time')->nullable();
            $table->text('practical_info')->nullable();
            $table->json('gallery')->nullable();
            $table->json('highlights')->nullable();
            $table->decimal('rating', 3, 1)->default(4.6);
            $table->unsignedInteger('review_count')->default(0);
            $table->string('price_label')->nullable();
            $table->string('booking_url')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attraction_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('property_type')->nullable();
            $table->string('location_name')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->text('listing_summary');
            $table->longText('detail_intro');
            $table->text('practical_info')->nullable();
            $table->json('amenities')->nullable();
            $table->decimal('rating', 3, 1)->default(4.5);
            $table->unsignedInteger('review_count')->default(0);
            $table->string('price_label')->nullable();
            $table->string('booking_url')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attraction_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('cuisine')->nullable();
            $table->string('location_name')->nullable();
            $table->string('signature_dish')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->text('listing_summary');
            $table->longText('detail_intro');
            $table->text('practical_info')->nullable();
            $table->decimal('rating', 3, 1)->default(4.4);
            $table->unsignedInteger('review_count')->default(0);
            $table->string('price_label')->nullable();
            $table->string('booking_url')->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('tour_operators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attraction_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('summary');
            $table->string('website_url')->nullable();
            $table->string('booking_url')->nullable();
            $table->string('hero_image_url')->nullable();
            $table->string('hero_image_alt')->nullable();
            $table->json('specialties')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_operators');
        Schema::dropIfExists('restaurants');
        Schema::dropIfExists('accommodations');
        Schema::dropIfExists('attractions');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('regions');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('site_settings');
    }
};
