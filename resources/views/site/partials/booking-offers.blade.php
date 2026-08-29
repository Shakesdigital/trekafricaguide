@php
    $offer = $listing->bookingOffers->first();
    $fresh = $offer && $offer->price_amount !== null && $offer->price_currency && $offer->price_unit && $offer->price_checked_at && $offer->price_basis && $offer->price_checked_at->greaterThanOrEqualTo(now()->subDays(30));
    $symbols = ['USD' => '$', 'EUR' => '€', 'GBP' => '£', 'ZAR' => 'R', 'UGX' => 'UGX '];
@endphp
@if($offer)
    <div class="booking-offers">
        <p class="booking-offers__price">@if($fresh) From {{ $symbols[$offer->price_currency] ?? $offer->price_currency.' ' }}{{ number_format((float)$offer->price_amount, 2) }} per {{ $offer->price_unit }} @else Check live price @endif</p>
        <a class="button button--ghost" href="{{ app(\App\Services\Stay22LinkBuilder::class)->forOffer($listing, $offer, $searchContext ?? []) }}" target="_blank" rel="nofollow sponsored noopener">{{ $offer->label }}</a>
        @if($fresh)<small>Indicative price. Price checked {{ $offer->price_checked_at->toFormattedDateString() }}. {{ $offer->price_basis }}</small>@endif
    </div>
@endif
