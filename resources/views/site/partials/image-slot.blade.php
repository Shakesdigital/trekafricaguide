@php
    $imageValue = $image ?? null;
    $isSlot = is_string($imageValue) && \Illuminate\Support\Str::startsWith($imageValue, 'image-slot:');
    $slotName = $isSlot ? \Illuminate\Support\Str::of($imageValue)->after('image-slot:')->replace('-', ' ')->title() : null;
    $classes = trim('image-slot '.($class ?? ''));
@endphp

@if($isSlot || blank($imageValue))
    <div class="{{ $classes }}" role="img" aria-label="{{ $alt ?? $slotName ?? 'Reserved image space' }}">
        <span>Image slot</span>
        <strong>{{ $slotName ?? ($alt ?? 'Reserved visual') }}</strong>
    </div>
@else
    <img src="{{ $imageValue }}" alt="{{ $alt ?? '' }}">
@endif
