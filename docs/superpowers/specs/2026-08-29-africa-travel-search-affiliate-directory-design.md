# Trek Africa Guide Search Ribbon and Affiliate Listings Design

## Objective

Preserve Trek Africa Guide's current visual design while improving its attraction and accommodation discovery and its outbound booking flow. Travelers should be able to find a country, district, destination, attraction, or accommodation from focused search ribbons; understand the option from the existing-style listing card; and continue to a clearly labeled external provider through Trek Africa Guide's Stay22 affiliate tracking where supported.

The public experience must present Trek Africa Guide as a travel-planning platform, not as a CMS or content-management demonstration.

## Design-preservation rule

The existing public website design is the baseline and must not be broadly redesigned. Preserve its typography, color palette, header, navigation, hero treatments, page structure, spacing rhythm, card character, galleries, region and country landing pages, and responsive visual identity.

New search controls, provider actions, stock photography, and revised copy must look native to the existing design. Refactoring is permitted only where necessary to support the requested behavior and must not visibly replace the current experience with a generic metasearch interface.

## Audience and primary journey

The primary audience is an international or African traveler planning leisure travel within Africa who wants to reduce the number of websites they must search.

The core journey is:

1. Choose Attractions or Accommodations in the search ribbon.
2. Enter a country, destination, district or city, attraction, or accommodation name.
3. Select an exact suggestion or submit a broader search to the appropriate existing landing page.
4. Review concise, useful listings in the site's existing visual style.
5. Choose a clearly named external booking provider from the listing card.
6. Leave Trek Africa Guide only after choosing a provider and seeing that the reservation will be completed there.

## Scope

The first implementation covers every existing public attraction, accommodation, and restaurant listing, expands the geographic structure toward all African countries and major visitor districts, and makes future additions scalable through the existing administrative system.

"Every listing" means every record published by Trek Africa Guide, not every business physically operating in Africa. Where Trek Africa Guide has not yet curated an exact accommodation, a Stay22 accommodation-search fallback will still let the traveler continue searching booking partners for the requested place.

In scope:

- Attraction and accommodation search ribbons with type-ahead suggestions.
- Country, destination, district or city, attraction, and accommodation discovery.
- Existing attraction, accommodation, country, and destination landing pages enhanced without visual replacement.
- Listing cards in the current design that contain enough information to make an outbound booking decision.
- Multiple provider choices for supported listings.
- Stay22 affiliate routing and campaign attribution.
- Removal of ordinary navigation from listing cards to internal detail pages.
- Redirect behavior for legacy detail-page URLs.
- Free, license-verified stock photography replacing generated imagery.
- Focused public-copy updates around Africa travel discovery, comparison, and booking choice.
- Expansion of researched destination and listing content in a maintainable format.
- Automated tests, local build verification, and browser verification of primary flows.

Out of scope for this release:

- Processing reservations or payments directly on Trek Africa Guide.
- Claiming real-time prices or availability without a licensed live inventory feed.
- Claiming affiliate commission for restaurant reservations when Stay22 does not support that transaction category.
- Removing the private administrative system used to maintain public records.
- Scraping booking websites or republishing restricted OTA content.
- Replacing the current public design system or restructuring well-designed landing pages without a functional need.
- Adding restaurant search to the new ribbon in this release.

## Product positioning and copy

Trek Africa Guide will communicate four ideas:

- Explore Africa through practical geography and travel intent.
- Compare relevant places to stay, things to do, and places to eat in one organized platform.
- Understand the option before leaving the site.
- Complete a reservation on the travel provider selected by the user.

The writing may borrow the product principles used by travel metasearch platforms—choice, transparency, comparison, fewer separate searches, and clearly labeled booking sources—but must be original and specific to Africa. Public pages must not mention image slots, placeholders, CMS internals, generated content, seed data, or implementation details.

The interface must never imply that Trek Africa Guide processes the final reservation. Copy such as "Choose a booking site" and "You will complete your reservation with the selected provider" will be used near outbound actions.

## Information architecture

The existing public hierarchy remains:

```text
Africa
  Region
    Country
      District, city, park area, or visitor zone
        Attraction
        Accommodation
        Restaurant
```

Regions and countries remain editorial landing pages with their current design. Districts or visitor zones become a searchable attribute for attractions and accommodations. Attractions, accommodations, and restaurants remain distinct listing types and retain their existing page contexts.

Existing attraction, accommodation, and restaurant cards will no longer use standalone listing-detail pages as the normal browsing path. A legacy detail URL will redirect to the appropriate existing listing landing page with the matching result selected or highlighted, preserving old links without presenting a full standalone listing page.

## Search ribbon

The search ribbon is added to the attraction and accommodation landing pages and to relevant country or destination pages. The homepage's existing search may be upgraded to the same component because it is already part of the current design. The ribbon must use the site's current colors, borders, typography, and spacing rather than introducing a new visual system.

It contains:

- Two modes: Attractions and Accommodations.
- A destination or listing input accepting country, district, city, attraction, or property names.
- Check-in, check-out, and guest fields when Accommodations is selected.
- A search button.

Type-ahead suggestions are grouped as Countries, Districts and destinations, Attractions, and Accommodations. Suggestions include enough geographic context to disambiguate duplicate names.

Submitting Attractions opens the existing attraction listing page with the relevant query and geographic filters. Submitting Accommodations opens the existing accommodation listing page with the relevant query, geographic filters, dates, and guests. Exact local matches appear first, followed by related matches from the same district, country, and region. If no local accommodation matches, the existing accommodation page presents a clearly labeled Stay22 search fallback using the entered destination, dates, and guest count.

Search parameters remain in the URL so results are shareable and browser navigation works naturally.

## Listing cards

Listing cards preserve the current responsive visual design while adding:

- One primary stock photograph and an optional second photograph.
- Listing type and geographic breadcrumb.
- Name and concise editorial summary.
- Category-specific facts.
- Provider actions with recognizable text labels.
- A short outbound-booking notice.

Accommodation facts may include property type, location, nearby attraction, amenities, and a non-live price band. Attraction facts may include experience type, typical visit length, access or permit note, and best season. Restaurant facts may include cuisine, meal role, location, reservation guidance, and nearby attraction.

The image, title, and card body must not silently redirect to an OTA. Outbound navigation occurs only through clearly labeled actions.

No unverified live rates, availability, or review claims will be displayed. Existing editorial rating fields may be retained only if their provenance is clear; otherwise the public card will emphasize descriptive facts rather than presenting them as verified OTA reviews.

## Provider and affiliate routing

Affiliate URLs are generated centrally instead of being assembled in templates.

Stay22 configuration includes:

- Affiliate ID from environment-backed configuration, with the currently installed ID as the configured deployment value.
- A listing-specific destination made from the exact listing name, district or location, and country.
- Stay dates and guest count when supplied by the user.
- Campaign labels for page, listing type, listing slug, and provider.
- Locale and currency hints when available.

Accommodation cards may show:

- Compare booking sites, using Stay22's recommended Roam endpoint.
- Booking.com.
- Expedia.
- Agoda.
- Hotels.com.
- Other Stay22-supported accommodation providers when useful.

A named provider button uses the corresponding Stay22 provider endpoint so the button label matches the likely destination. The generic comparison action uses the Roam endpoint and does not claim a specific provider.

Attraction cards use Stay22-supported activity providers such as GetYourGuide when the destination can be resolved. Unsupported direct or official links remain clearly labeled and are not described as commission-earning.

Restaurant cards use verified official or reservation links where available. Because Stay22's published categories do not establish restaurant-reservation monetization, restaurant cards must not suggest that such reservations generate Stay22 commission. A restaurant may also provide an affiliate-supported "Find stays nearby" action when useful.

All external actions open safely, use appropriate rel attributes, and receive an accessible label. Affiliate disclosure appears near listing results and in the site footer.

## Data model

The implementation adds a district or visitor-zone concept with a stable slug, country relationship, name, optional description, and geographic aliases.

Listings receive a district relationship where research can establish it. Existing `location_name` fields remain as display text and migration fallback.

Provider offers are stored separately from editorial listing content. Each offer records:

- Listing type and listing identifier.
- Provider key.
- Public label.
- Optional direct source URL.
- Stay22 endpoint or routing mode.
- Whether the link is affiliate-supported.
- Sort order and active state.

A shared search service normalizes countries, districts, aliases, attraction names, accommodation names, categories, and nearby places into ranked results. Provider-link generation is handled by a dedicated service so templates do not contain affiliate business logic.

Supabase/static synchronization must include new district, image, and offer fields without breaking the current Laravel source of truth or static deployment workflow.

## Image sourcing and licensing

Generated listing and landing-page imagery will be replaced with authentic, free stock photography.

Source priority:

1. Exact-location photography from a reputable stock library or commercially reusable Wikimedia Commons file.
2. Exact district, park, city, or landscape photography.
3. A representative accommodation or dining photograph from the correct destination context when an exact property image is not safely reusable.

Every selected image must have a primary source page, a license compatible with commercial website use, a recorded creator, and a recorded attribution requirement. Images with unclear terms, editorial-only restrictions, obvious AI generation, embedded watermarks, or problematic third-party branding will not be used.

Images are downloaded into the project and referenced locally so layouts remain stable. A machine-readable credits manifest records listing association, source page, creator, license, and attribution text. Where an image is representative rather than exact, alt text and nearby copy must not claim that it depicts the precise property or restaurant.

Landing pages receive broad horizontal images suitable for cropping. Listing cards receive consistent landscape crops, with an optional second image used only where it materially improves recognition.

## Research and expansion

Research is organized by region, then country, then major visitor districts. Each country expansion captures:

- Official tourism and administrative geography.
- Major attractions and realistic route relationships.
- Accommodation options that can be resolved on supported booking providers.
- Restaurants useful to travelers in the selected districts.
- Official or reputable evidence for names, locations, and current operating identity.
- Stock-image source and license evidence.

Official tourism boards, park authorities, heritage bodies, property sites, and provider listing pages are preferred. Third-party travel publications may supplement but not replace primary verification.

The initial expansion prioritizes quality and travel usefulness across all African regions. The schema and research manifest allow further district-by-district growth without redesigning the product.

## Error and empty states

- No local results: keep the current landing-page design, show spelling guidance and nearby geographic matches, and add the Stay22 accommodation-search fallback when relevant.
- Unsupported provider: omit the provider button instead of sending the user to a misleading page.
- Missing image: use a licensed destination-level fallback recorded in the credits manifest, never a generated placeholder.
- Missing district: retain the existing location label and flag the record for research rather than guessing.
- Missing dates: allow accommodation comparison without dates and explain that live availability is confirmed by the provider.
- External booking failure: preserve other provider choices and avoid claiming availability.

## Accessibility and responsive behavior

- The complete search ribbon is keyboard accessible and has visible focus states.
- Type-ahead suggestions use appropriate combobox and listbox semantics.
- Mobile search reduces to a compact stacked panel without hiding essential filters.
- Provider buttons remain large enough for touch and use text, not logos alone.
- Images include truthful, useful alt text.
- Color is not the only indication of listing type, selection, or external navigation.

## Verification and acceptance checks

The work is accepted when:

1. The current site design remains recognizably unchanged across the homepage, region pages, country pages, and listing landing pages.
2. Searching an exact country, district, attraction, and accommodation returns the expected record type and geographic context.
3. Attraction and accommodation search works from the relevant existing landing pages, country or destination pages, and the homepage where the existing search is upgraded, including keyboard selection and mobile layout.
4. Existing listing cards no longer navigate to standalone detail pages.
5. Legacy listing-detail URLs resolve to the matching result on the appropriate existing landing page rather than a broken page.
6. Accommodation provider buttons generate valid Stay22 URLs containing the affiliate ID, accurate listing context, and campaign attribution.
7. Named provider buttons use matching Stay22 provider endpoints; the generic comparison button uses Roam.
8. Dates and guest counts reach applicable Stay22 links.
9. Attraction and restaurant buttons accurately disclose whether a link is affiliate-supported.
10. Generated listing and landing-page images are no longer used publicly.
11. Every replacement image has source and license metadata, and representative images do not pretend to be exact-property photographs.
12. Public copy contains no CMS, placeholder, image-slot, or generated-content language.
13. The site clearly states that final reservations and payments are completed with external providers.
14. Automated application tests and the production asset build pass.
15. Primary search, filtering, outbound-link, empty-state, and responsive flows pass browser verification.

## Permissions and stopping conditions

Authorized work includes local code, database migrations, content seeds, public copy, free stock-image downloads, tests, and local verification inside the Trek Africa Guide project.

The implementation must stop and request direction before purchasing data or imagery, enrolling in a new affiliate program, changing the Stay22 account, publishing externally, deleting the private administrative system, or using an external data source whose commercial reuse terms are unclear.
