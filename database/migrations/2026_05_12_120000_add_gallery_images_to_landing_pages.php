<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('regions', function (Blueprint $table) {
            $table->json('gallery')->nullable()->after('hero_image_alt');
        });

        Schema::table('countries', function (Blueprint $table) {
            $table->json('gallery')->nullable()->after('hero_image_alt');
        });

        Schema::table('accommodations', function (Blueprint $table) {
            $table->json('gallery')->nullable()->after('hero_image_alt');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->json('gallery')->nullable()->after('hero_image_alt');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn('gallery');
        });

        Schema::table('accommodations', function (Blueprint $table) {
            $table->dropColumn('gallery');
        });

        Schema::table('countries', function (Blueprint $table) {
            $table->dropColumn('gallery');
        });

        Schema::table('regions', function (Blueprint $table) {
            $table->dropColumn('gallery');
        });
    }
};
