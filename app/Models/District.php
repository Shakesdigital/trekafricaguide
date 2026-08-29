<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class District extends Model
{
    protected $fillable = ['country_id','slug','name','overview','aliases','sort_order'];
    protected function casts(): array { return ['aliases' => 'array']; }
    public function country(): BelongsTo { return $this->belongsTo(Country::class); }
    public function attractions(): HasMany { return $this->hasMany(Attraction::class)->orderBy('sort_order'); }
    public function accommodations(): HasMany { return $this->hasMany(Accommodation::class)->orderBy('sort_order'); }
    public function restaurants(): HasMany { return $this->hasMany(Restaurant::class)->orderBy('sort_order'); }
    public function getRouteKeyName(): string { return 'slug'; }
}
