<?php
namespace App\Services;
use App\Models\BookingOffer;
use Illuminate\Database\Eloquent\Model;

class Stay22LinkBuilder
{
    private const SUPPORTED = ['booking','expedia','hotelscom','vrbo','agoda','tripadvisor','kayak','getyourguide','roam','searchbar'];
    public function forOffer(Model $listing, BookingOffer $offer, array $search = []): string
    {
        if (! $offer->affiliate_supported) {
            return $offer->source_url ?: ($listing->booking_url ?? '#');
        }

        $provider = $offer->stay22_provider ?: 'roam';
        if (! in_array(strtolower($provider), self::SUPPORTED, true)) {
            return $offer->source_url ?: ($listing->booking_url ?? '#');
        }
        $params = $this->baseParams($listing, $search);
        $params['campaign'] = strtolower(class_basename($listing)).'_'.($listing->slug ?? $listing->getKey());
        if ($offer->source_url) {
            $params['link'] = $offer->source_url;
            unset($params['address'], $params['hotelname']);
        }
        return 'https://www.stay22.com/allez/'.rawurlencode($provider).'?'.http_build_query($params);
    }

    public function searchbar(string $address, array $search = []): string
    {
        $params = ['aid' => config('services.stay22.affiliate_id'), 'address' => $address, 'campaign' => 'searchbar'];
        foreach (['checkin','checkout','adults','children'] as $key) if (array_key_exists($key, $search) && $search[$key] !== '') $params[$key] = $search[$key];
        return 'https://www.stay22.com/allez/searchbar?'.http_build_query($params);
    }

    private function baseParams(Model $listing, array $search): array
    {
        $params = ['aid' => config('services.stay22.affiliate_id'), 'hotelname' => $listing->name];
        if ($listing->location_name) $params['address'] = $listing->location_name;
        foreach (['checkin','checkout','adults','children'] as $key) if (array_key_exists($key, $search) && $search[$key] !== '') $params[$key] = $search[$key];
        return $params;
    }
}
