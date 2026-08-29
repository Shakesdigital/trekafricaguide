@php
    $ribbonMode = $searchContext['mode'] ?? ($mode ?? 'accommodations');
    $isStay = $ribbonMode === 'accommodations';
    $action = $isStay ? route('accommodations.index') : route('attractions.index');
@endphp
<form class="search-ribbon" data-search-ribbon method="GET" action="{{ $action }}">
    <div class="search-ribbon__modes" role="tablist" aria-label="Search type">
        <button type="button" data-search-mode="attractions" class="{{ !$isStay ? 'is-active' : '' }}">Attractions</button>
        <button type="button" data-search-mode="accommodations" class="{{ $isStay ? 'is-active' : '' }}">Accommodations</button>
    </div>
    <label class="search-ribbon__query">Find a place
        <input data-search-input name="q" type="search" value="{{ $searchContext['q'] ?? '' }}" role="combobox" aria-autocomplete="list" aria-controls="search-ribbon-listbox" aria-expanded="false" placeholder="Country, city, park, or property">
        <ul id="search-ribbon-listbox" data-search-listbox role="listbox" hidden></ul>
    </label>
    <div class="search-ribbon__stay-fields" data-stay-fields @if(!$isStay) hidden @endif>
        <label>Check in<input name="checkin" type="date" value="{{ $searchContext['checkin'] ?? '' }}"></label>
        <label>Check out<input name="checkout" type="date" value="{{ $searchContext['checkout'] ?? '' }}"></label>
        <label>Adults<input name="adults" type="number" min="1" max="12" value="{{ $searchContext['adults'] ?? 2 }}"></label>
        <label>Children<input name="children" type="number" min="0" max="8" value="{{ $searchContext['children'] ?? 0 }}"></label>
        <label>Rooms<input name="rooms" type="number" min="1" max="8" value="{{ $searchContext['rooms'] ?? 1 }}"></label>
    </div>
    @if(!$isStay)
        <label>Travel date<input name="travel_date" type="date" value="{{ $searchContext['travel_date'] ?? '' }}"></label>
        <label>Travelers<input name="adults" type="number" min="1" max="12" value="{{ $searchContext['adults'] ?? 2 }}"></label>
    @endif
    <button class="button" type="submit">Search</button>
</form>
<script>window.trekSearchSuggestions = @json($searchSuggestions ?? []);</script>
