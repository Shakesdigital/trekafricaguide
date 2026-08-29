<?php
namespace Tests\Feature;
use App\Models\Accommodation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class AdminBookingOfferTest extends TestCase
{
    use RefreshDatabase;
    public function test_admin_can_create_offer_with_price_basis(): void
    {
        $this->seed(); $admin = User::query()->where('role','admin')->firstOrFail(); $stay = Accommodation::query()->firstOrFail();
        $this->actingAs($admin)->post('/admin/booking-offers', ['listing_type'=>'accommodations','listing_id'=>$stay->id,'provider'=>'booking','label'=>'Book','price_amount'=>'69','price_currency'=>'USD','price_unit'=>'night','price_checked_at'=>'2026-08-29','price_basis'=>'one night'])->assertRedirect();
        $this->assertDatabaseHas('booking_offers', ['offerable_id'=>$stay->id,'price_basis'=>'one night']);
    }
    public function test_public_user_cannot_create_offer(): void
    {
        $this->post('/admin/booking-offers', [])->assertRedirect('/admin/login');
    }
}
