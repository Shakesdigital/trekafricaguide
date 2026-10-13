# Card sections and discovery — 13 October 2026

Implemented shared card carousels on the homepage and accommodation, attraction, activity, country and region detail pages, plus reusable nearby-stay notes. Archive templates remain grids. Existing ListingCard styling and breakpoint widths are retained; region cards keep their two-column desktop width. Previous/next controls wrap at boundaries, keyboard arrows operate the focused track, and touch scrolling remains native. Controls are hidden when all cards fit; reduced-motion preferences are respected. No autoplay or duplicate cloned cards.

Accommodation pages now show Other Nearby Accommodations before Nearby Attractions, replacing Related attraction. Recommendations resolve published canonical relationships; the current stay is excluded. A country match alone no longer labels an attraction nearby. Empty related-stay sets show a short explanation until more verified guides are published.

The homepage retains featured attractions/stays, adds featured travel insights, and uses View More archive links. Home is now in the main navigation. Recurring automation preserves its six-hour schedule and includes these layout rules plus OTA discovery through TripAdvisor, Expedia, Kayak, Booking.com, Hotels.com and Safari.com, with factual, geographic and licensing checks.

This batch changes presentation and relationship handling; no new travel listings or images were added. Existing image backlogs and draft requirements remain. Code changes received brief manual diff inspection; no tests, browser QA or local build were run, per owner preference. Deployment verification is recorded separately after push.

## Publication evidence

Code commit 0588e72 pushed to main. Public HTTP 200 HTML subsequently confirmed four carousel containers and Featured Travel Insights on the homepage, the new accommodation section and removal of Related attraction on /accommodations/ridge-royal-hotel, and a carousel on /attractions/elmina-castle. This confirms deployment of the markup, not a browser interaction test. Ridge Royal currently has no other completed nearby accommodation in the canonical relationships; its section uses the empty-state message. No new content/photo collections were added in this batch.
