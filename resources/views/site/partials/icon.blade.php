@php
    // Inline icon set (kept in sync with the icon() helper in public/cms-sync.js).
    $paths = [
        'star' => '<path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.9 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z"/>',
        'pin' => '<path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.3"/>',
        'tag' => '<path d="M3.5 11.5l8-8H20a.5.5 0 0 1 .5.5v8.5l-8 8a1 1 0 0 1-1.4 0L3.5 13a1 1 0 0 1 0-1.5z"/><circle cx="16.5" cy="7.5" r="1.1"/>',
        'bed' => '<path d="M3 18v-9M3 13h18v5M21 18v-3M3 13l1.5-3.5a2 2 0 0 1 1.8-1.2h11.4a2 2 0 0 1 1.8 1.2L21 13"/><circle cx="7.5" cy="11" r="1.2"/>',
        'utensils' => '<path d="M7 3v8m0 0v10M4.5 3v5a2.5 2.5 0 0 0 5 0V3M17 14v7m0-7s4-1 4-7c0-3-1.5-4-2.5-4S16 4 16 7c0 6 1 7 1 7z"/>',
        'clock' => '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
        'calendar' => '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
        'check' => '<path d="M20 6.5L9.5 17.5 4 12"/>',
        'shield' => '<path d="M12 3l7 2.5v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V5.5z"/><path d="M9 12l2 2 4-4"/>',
        'route' => '<circle cx="6" cy="18" r="2.3"/><circle cx="18" cy="6" r="2.3"/><path d="M8 17h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7"/>',
        'sparkle' => '<path d="M12 3l1.7 5.1L19 9.8l-5.3 1.7L12 17l-1.7-5.5L5 9.8l5.3-1.7z"/>',
        'camera' => '<path d="M4 8.5A2 2 0 0 1 6 6.5h1.5l1-2h5l1 2H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.2"/>',
        'info' => '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.6v.1"/>',
        'compass' => '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    ];
    $name = $name ?? 'check';
@endphp
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{!! $paths[$name] ?? $paths['check'] !!}</svg>
