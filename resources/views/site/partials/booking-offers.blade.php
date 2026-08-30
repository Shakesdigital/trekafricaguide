@php
    $offers = $listing->bookingOffers ?? collect();
    $symbols = ['USD' => '$', 'EUR' => '€', 'GBP' => '£', 'ZAR' => 'R', 'UGX' => 'UGX '];
@endphp
@if($offers->isNotEmpty())
    <section class="section section--alt section--booking">
        <div class="container">
            <h2>Compare booking options</h2>
            <div class="booking-offers">
                @foreach($offers as $offer)
                    @php $fresh = $offer->price_amount !== null && $offer->price_currency && $offer->price_unit && $offer->price_checked_at && $offer->price_basis && $offer->price_checked_at->greaterThanOrEqualTo(now()->subDays(config('services.travel.indicative_price_max_age_days', 90))); @endphp
                    <p class="booking-offers__price">@if($fresh) From {{ $symbols[$offer->price_currency] ?? $offer->price_currency.' ' }}{{ number_format((float)$offer->price_amount, 2) }} per {{ $offer->price_unit }} @elseif($listing instanceof \App\Models\Restaurant) Check menu and reservation details @else Check live price @endif</p>
                    <a class="button button--ghost" href="{{ app(\App\Services\Stay22LinkBuilder::class)->forOffer($listing, $offer, $searchContext ?? []) }}" target="_blank" rel="nofollow {{ $offer->affiliate_supported ? 'sponsored ' : '' }}noopener">{{ $offer->label }}</a>
                    @if(!$offer->affiliate_supported)<small>External provider link; Trek Africa Guide does not process this booking.</small>@endif
                    @if($fresh)<small>Indicative price. Price checked {{ $offer->price_checked_at->toFormattedDateString() }}. {{ $offer->price_basis }}</small>@endif
                @endforeach
                @if(($searchContext['rooms'] ?? null) && ($searchContext['mode'] ?? '') === 'accommodations')<small>Your room count is kept on this results page only. Reconfirm rooms, rates, and availability on the provider.</small>@endif
            </div>
        </div>
    </section>
@endif
