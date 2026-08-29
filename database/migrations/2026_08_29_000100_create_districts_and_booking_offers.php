<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('name');
            $table->text('overview')->nullable();
            $table->json('aliases')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['country_id', 'slug']);
        });
        foreach (['attractions', 'accommodations', 'restaurants'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('district_id')->nullable()->constrained()->nullOnDelete();
            });
        }
        Schema::create('booking_offers', function (Blueprint $table) {
            $table->id();
            $table->morphs('offerable');
            $table->string('provider');
            $table->string('label');
            $table->string('source_url', 2048)->nullable();
            $table->string('stay22_provider')->nullable();
            $table->boolean('affiliate_supported')->default(false);
            $table->decimal('price_amount', 10, 2)->nullable();
            $table->char('price_currency', 3)->nullable();
            $table->string('price_unit')->nullable();
            $table->date('price_checked_at')->nullable();
            $table->text('price_basis')->nullable();
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['provider', 'active']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('booking_offers');
        foreach (['attractions', 'accommodations', 'restaurants'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) { $table->dropConstrainedForeignId('district_id'); });
        }
        Schema::dropIfExists('districts');
    }
};
