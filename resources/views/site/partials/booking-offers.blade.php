@php
    $offers = $listing->bookingOffers ?? collect();
    $symbols = ['USD' => '$', 'EUR' => 'EUR ', 'GBP' => 'GBP ', 'ZAR' => 'R', 'UGX' => 'UGX '];
    $stay22 = app(\App\Services\Stay22LinkBuilder::class);
@endphp

@if($offers->isNotEmpty())
    <section class="section section--alt section--booking">
        <div class="container">
            <h2>Booking and planning links</h2>
            <div class="booking-offers">
                @foreach($offers as $offer)
                    @php
                        $fresh = $offer->price_amount !== null
                            && $offer->price_currency
                            && $offer->price_unit
                            && $offer->price_checked_at
                            && $offer->price_basis
                            && $offer->price_checked_at->greaterThanOrEqualTo(now()->subDays(config('services.travel.indicative_price_max_age_days', 90)));
                    @endphp
                    <p class="booking-offers__price">
                        @if($fresh)
                            From {{ $symbols[$offer->price_currency] ?? $offer->price_currency.' ' }}{{ number_format((float) $offer->price_amount, 2) }} per {{ $offer->price_unit }}
                        @else
                            Check current details on the provider site
                        @endif
                    </p>
                    <a class="button button--ghost" href="{{ $stay22->forOffer($listing, $offer, $searchContext ?? []) }}" target="_blank" rel="nofollow noopener">{{ $offer->label }}</a>
                    <small>External provider link. Trek Africa Guide does not take payment on this page.</small>
                    @if($fresh)
                        <small>Indicative price. Price checked {{ $offer->price_checked_at->toFormattedDateString() }}. {{ $offer->price_basis }}</small>
                    @endif
                @endforeach
                @if(($searchContext['rooms'] ?? null) && ($searchContext['mode'] ?? '') === 'accommodations')
                    <small>Your room count is kept on this results page only. Reconfirm rooms, rates, and availability on the provider site.</small>
                @endif
            </div>
        </div>
    </section>
@endif
