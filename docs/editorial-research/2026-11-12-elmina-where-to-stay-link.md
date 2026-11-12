# Elmina destination — "Where to stay" rail gap (2026-11-12)

Run: scheduled editorial run, 2026-11-12 09:00 UTC. Category: accommodations rotation.

## Evidence (live, 12 Nov 2026)
- https://trekafricaguide.com/countries/ghana/elmina/ returned HTTP 200 and rendered NO "Where to stay" section at all — the only one of the 18 live local destinations without one (all others carry at least one accommodation card).
- The site's own accommodation page https://trekafricaguide.com/accommodations/lemon-beach-resort-elmina/ is live (HTTP 200), published, same country (Ghana, country_id 45), explicitly pitches itself as "a practical base for Elmina Castle, Cape Coast and Kakum", and already links to the Elmina destination guide — the link was one-directional.
- Reader impact: a reader on the Elmina page finished with no stay recommendation even though the site has a researched Elmina beachfront property page with operator-stated rates, amenities and Booking.com detail.

## Change
- content/local-destinations.json: elmina record `accommodation_slugs: ["lemon-beach-resort-elmina"]` (single, exact same-country property; no proximity guesses).
- No copy, prices, ratings or images invented. Zero-image honest state unchanged for both pages.

## Exact-property photo review for Lemon Beach Resort (quality-bar target: 6 photos)
Pool searched 12 Nov 2026; exact-property identity required (owner standard 2026-11-07):
- Wikimedia Commons (API, File ns): "Lemon Beach Resort Elmina" / "lemon beach Elmina" = 0 property files (only unrelated PDF text matches). "Elmina beach resort" returns Coconut Grove Beach Resort files — a different property; excluded.
- Flickr (licence-filtered CC BY / BY-SA / CC0 / PDM, browser session): "lemon beach resort elmina" = no matches; "elmina beach resort" = no matches.
- Openverse API: q=lemon beach resort elmina → result_count 0.
- Unsplash (browser session): "lemon-beach-resort-elmina" → 0 photos.
- Pexels: results are generic Elmina/Ghana/Brazil scenery only — scenery-as-property, excluded.
- Pixabay (browser session): only tag-expanded generic results (lemon fruit, beach tea, etc.) — excluded.
- Operator gallery (lemonbeachresort.com) and Booking.com imagery: rights-reserved; excluded per standard.
Result: rights-clean exact-property pool empty; no image downloaded, assigned or published. Missing subjects recorded for reopening: exterior/signage, room categories (Chalet, Villa, Family Villa, Continental), pool, spa, Lemon Restaurant, private beach.
