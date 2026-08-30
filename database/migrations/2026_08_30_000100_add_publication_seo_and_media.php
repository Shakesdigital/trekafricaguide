<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour_operators'] as $table) {
            Schema::table($table, function (Blueprint $table): void {
                $table->string('status')->default('published')->index();
                $table->timestamp('published_at')->nullable()->index();
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->string('meta_image_url')->nullable();
            });
        }

        Schema::table('page_sections', function (Blueprint $table): void {
            $table->string('module_type')->nullable()->after('section_key');
            $table->string('status')->default('published')->index();
            $table->timestamp('published_at')->nullable()->index();
        });

        Schema::table('site_settings', function (Blueprint $table): void {
            $table->boolean('is_public')->default(false)->index();
        });

        Schema::create('media_assets', function (Blueprint $table): void {
            $table->id();
            $table->morphs('mediable');
            $table->string('role')->default('hero');
            $table->string('local_path')->nullable();
            $table->string('url')->nullable();
            $table->string('alt_text');
            $table->text('source_page')->nullable();
            $table->string('creator')->nullable();
            $table->string('license')->nullable();
            $table->text('license_url')->nullable();
            $table->boolean('exact_subject_match')->default(false);
            $table->text('attribution_text')->nullable();
            $table->string('status')->default('published')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['mediable_type', 'mediable_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
        Schema::table('site_settings', fn (Blueprint $table) => $table->dropColumn('is_public'));
        Schema::table('page_sections', fn (Blueprint $table) => $table->dropColumn(['module_type', 'status', 'published_at']));
        foreach (['regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour_operators'] as $tableName) {
            Schema::table($tableName, fn (Blueprint $table) => $table->dropColumn(['status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url']));
        }
    }
};
