<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
class BookingOffer extends Model
{
    protected $fillable = ['provider','label','source_url','stay22_provider','affiliate_supported','price_amount','price_currency','price_unit','price_checked_at','price_basis','active','sort_order'];
    protected function casts(): array { return ['affiliate_supported'=>'boolean','active'=>'boolean','price_amount'=>'decimal:2','price_checked_at'=>'date']; }
    public function offerable(): MorphTo { return $this->morphTo(); }
}
