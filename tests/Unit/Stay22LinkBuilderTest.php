<?php
namespace Tests\Unit;
use App\Models\Accommodation;
use App\Models\BookingOffer;
use App\Services\Stay22LinkBuilder;
use Tests\TestCase;
class Stay22LinkBuilderTest extends TestCase
{
    public function test_named_provider_link_contains_affiliate_source_and_campaigns(): void
    {
        config()->set('services.stay22.affiliate_id', 'aid-test');
        $stay = new Accommodation(['name'=>'Sanctuary Gorilla Forest Camp','slug'=>'sanctuary-gorilla-forest-camp','location_name'=>'Bwindi','country_id'=>1]);
        $offer = new BookingOffer(['stay22_provider'=>'booking','source_url'=>'https://booking.example/stay']);
        $url = app(Stay22LinkBuilder::class)->forOffer($stay, $offer, ['checkin'=>'2026-11-10','checkout'=>'2026-11-12','adults'=>2,'children'=>0,'rooms'=>1]);
        $this->assertStringStartsWith('https://www.stay22.com/allez/booking?', $url);
        $this->assertStringContainsString('aid=aid-test', $url);
        $this->assertStringContainsString('checkin=2026-11-10', $url);
        $this->assertStringContainsString('campaign=accommodation_', $url);
        $this->assertStringContainsString('link=', $url);
    }
    public function test_roam_searchbar_encodes_address_and_optional_dates(): void
    {
        config()->set('services.stay22.affiliate_id', 'aid-test');
        $url = app(Stay22LinkBuilder::class)->searchbar('Kigali, Rwanda', ['adults'=>2]);
        $this->assertStringStartsWith('https://www.stay22.com/allez/searchbar?', $url);
        $this->assertStringContainsString('address=Kigali%2C+Rwanda', $url);
        $this->assertStringNotContainsString('checkin=', $url);
    }

    public function test_rooms_are_not_sent_to_stay22_and_unsupported_provider_stays_direct(): void
    {
        $stay = new Accommodation(['name'=>'Camp','slug'=>'camp','location_name'=>'Uganda']);
        $url = app(Stay22LinkBuilder::class)->forOffer($stay, new BookingOffer(['stay22_provider'=>'mystery','source_url'=>'https://example.test/deal']), ['rooms'=>2]);
        $this->assertSame('https://example.test/deal', $url);
    }
}
