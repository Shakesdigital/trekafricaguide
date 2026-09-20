# Africa Guide Content Expansion and Guide-First Journey Design

## Milestone

Expand Trek Africa Guide into a five-region, 29-country Africa travel guide without changing its established visual language or responsive behavior. The milestone closes only when the researched content is integrated, every public discovery card leads to an internal detail page, restaurant content is disabled, affiliate tracking and affiliate messaging are absent, and relevant detail pages provide verified plain external booking choices.

## Product Objective

Trek Africa Guide helps a traveler move through one clear planning journey:

1. discover an African region;
2. choose a destination country;
3. understand the country's strongest attractions and practical route considerations;
4. open a complete attraction page;
5. identify an appropriate nearby stay;
6. open the stay's complete internal page; and
7. continue, if desired, to a reputable third-party booking platform.

The public product is an independent guide, not a price-comparison or affiliate storefront. It does not process payments, claim live availability, or imply a commercial relationship with an external booking provider.

## Non-Negotiable Experience Constraints

- Preserve the current typography, color palette, spacing system, card shapes, buttons, navigation behavior, templates, and mobile breakpoints.
- Do not introduce a new public layout or redesign an existing component.
- Content additions and the explicitly requested field-order and CTA changes must use the existing card and page components.
- Keep the practical, neutral, route-oriented voice. Avoid hype, unsupported superlatives, and invented prices.
- All public cards link internally. External provider links appear only on the relevant attraction or accommodation detail page.
- Do not display affiliate disclosures, affiliate identifiers, tracking wrappers, commission language, or affiliate-oriented calls to action.
- Do not process bookings on Trek Africa Guide.

## Confirmed Regional and Country Scope

Research and implementation proceed in the requested order. All batches belong to this one milestone and use the same templates and acceptance criteria.

### 1. West Africa

- Existing guides to retain and enrich: Ghana, Senegal, Benin, Sierra Leone, Cabo Verde.
- New guides: Nigeria, The Gambia, Cote d'Ivoire.

### 2. East Africa

- Existing guides to retain and enrich: Uganda, Kenya, Tanzania, Rwanda, Ethiopia.
- New guides: Mauritius, Seychelles.

### 3. Southern Africa

- Existing guides to retain and enrich: South Africa, Botswana, Namibia, Zimbabwe, Zambia.
- New guide: Mozambique.

### 4. Northern Africa

- Existing guides to retain and enrich: Morocco, Egypt, Tunisia, Algeria.

### 5. Central Africa

- New region and guides: Sao Tome and Principe, Cameroon, Gabon, Republic of the Congo.
- The Democratic Republic of the Congo is discussed in the regional planning context but is not launched as a bookable country guide while official closures and high-risk travel advisories remain material.
- The Central African Republic is not launched as a travel-planning guide under current official do-not-travel advice.

The public total is five regions and 29 country guides. Country classifications are fixed by this design so that the same destination cannot appear in multiple regions.

## Research Standard

### Source hierarchy

Each new or materially enriched record must be supported by current sources in this order:

1. national tourism boards, park authorities, transport authorities, UNESCO, government travel portals, and official property websites;
2. UN Tourism, WTTC, and national tourism statistics;
3. established booking and review platforms for traveler-interest and accommodation cross-checks;
4. Lonely Planet and reputable travel media for contextual corroboration.

Safety, closures, permits, access rules, infrastructure, and opening conditions require a current official source. Popularity claims must state the source year when a defensible statistic exists; otherwise the copy uses measured language such as `commonly included in visitor routes` rather than an unsupported ranking.

### Research ledger

A tracked research ledger will map every region, country, attraction, and stay to its supporting URLs, source organization, publication or access date, and verification notes. The public prose remains consistent with the existing editorial style; the ledger provides editorial traceability without turning cards into citation-heavy layouts.

Time-sensitive facts include a verification note in the appropriate planning section. If a fact cannot be verified, it is omitted or clearly qualified.

## Information Architecture

### Regions

Public routes remain `/regions` and `/regions/{slug}`. Add `/regions/central-africa` using the existing region template. Each region page contains:

- overview and tourism character;
- key reasons travelers visit;
- access, seasonality, and changing-condition notes;
- the region's country cards; and
- high-interest attraction cards that open internal attraction detail pages.

No new navigation pattern is introduced. Central Africa is added wherever the existing four regions are enumerated, including the home page, region directory, search/filter data, static output, and CMS content.

### Countries and destinations

Public routes remain `/countries` and `/countries/{slug}`. `Destinations` is the traveler-facing label for the country-guide layer; it does not create a second country content system.

Every country page follows the existing template and contains:

- best for;
- gateway;
- suggested trip length;
- destination guide;
- getting around;
- best time to visit;
- planning notes;
- what to verify;
- four to eight prioritized attraction cards;
- nearby stay cards linked to the relevant attractions; and
- tour-operator guidance where already supported by the template.

The country summary and counts mention attractions and stays only. Dining and restaurant sections are removed from the public rendering.

### Attractions

Public routes remain `/attractions` and `/attractions/{slug}`. Each selected country receives four to eight prioritized attractions unless research quality or current access conditions require a smaller explicitly documented set.

Each attraction detail page contains:

- a concise factual description;
- why travelers include it;
- country and specific locality or subregion;
- access from a practical gateway, typical transport modes, and realistic transfer guidance;
- seasonal, permit, conservation, or safety notes where relevant;
- planning and live-verification notes;
- nearby budget, mid-range, and luxury stay recommendations when those categories can be responsibly supported; and
- a plain external booking/exploration panel containing only verified applicable providers.

Potential attraction providers include GetYourGuide and Tripadvisor. A provider is omitted when no accurate destination or attraction page can be verified.

### Accommodations

Public routes remain `/accommodations` and `/accommodations/{slug}`. Each attraction is associated with useful nearby stay choices across budget, mid-range, and luxury tiers where the destination market supports those distinctions. A stay may be related to more than one nearby attraction when geographically accurate, avoiding artificial duplicate properties.

Each stay detail page contains:

- property name and type;
- country, locality, and relationship to the attraction;
- official star category or clearly labeled traveler-equivalent category when no official classification is available;
- what makes the stay distinctive;
- why it suits the route or traveler;
- key amenities that can be verified;
- practical access and booking considerations;
- related internal attraction links; and
- plain external booking links for verified applicable providers.

Potential accommodation providers include Booking.com, Tripadvisor, Agoda, Kayak, and Hotels.com. A provider is omitted rather than replaced with a vague or misleading link when the exact property or a useful provider result cannot be verified.

## Card Content and CTA Contract

The existing visual card component remains in place. Its content order and internal CTA are made explicit by listing type.

### Attraction cards

Every featured, regional, country, directory, related-content, and search-result attraction card displays, in this order:

1. attraction name as the primary heading;
2. location, including country;
3. a brief factual description;
4. the specific in-country region, district, park sector, island, or locality when known; and
5. the internal CTA `View attraction detail`.

The card never starts with the country name when an attraction name is available. It never contains `Compare tours on GetYourGuide` or another external provider CTA. Clicking the image, title, or CTA opens `/attractions/{slug}`.

### Stay cards

Every featured, country, directory, related-content, and search-result stay card displays, in this order:

1. property name as the primary heading;
2. locality and country;
3. a brief practical description;
4. the specific in-country region or nearby attraction context; and
5. the internal CTA `View stay`.

The card never contains a provider CTA. Clicking the image, title, or CTA opens `/accommodations/{slug}`.

### Region and destination cards

Region and country cards keep their current structure and open their corresponding internal guide pages. Their language is updated only where required to remove restaurant, comparison, or affiliate-oriented wording.

## Detail-Page External Link Policy

External choices are contextual next steps, not card actions.

- Attraction pages may show `Explore on GetYourGuide` and `Review on Tripadvisor` when verified.
- Stay pages may show `Book via Booking.com`, `Review on Tripadvisor`, `Book via Agoda`, `Compare on Kayak`, and `View on Hotels.com` when verified.
- Links use the provider's direct URL, open as external links, and include safe `noopener`/`noreferrer` behavior.
- No Stay22 or other affiliate wrapper is used.
- No affiliate ID, campaign parameter, commission disclosure, affiliate badge, or `sponsored` relationship is emitted by Trek Africa Guide.
- Existing affiliate-support fields may remain dormant in storage for reversibility, but public rendering and generated output do not read or expose them.
- Prices are not displayed unless the existing product can support a directly sourced, date-stamped value. The default wording asks travelers to check current rates, availability, permits, cancellation terms, and taxes on the provider site.
- A detail page remains complete and useful when no provider link is available.

## Restaurant Deactivation

Restaurants are disabled throughout the public and editorial product for this milestone.

- Remove Restaurants/Eat & Drink from desktop navigation, mobile navigation, footer navigation, contact shortcuts, landing-page copy, search suggestions, featured sections, country pages, attraction pages, route collections, and counts.
- Do not render a restaurant directory, restaurant detail pages, restaurant cards, or restaurant-related booking choices.
- Remove restaurant routes from public Laravel routing and static generation. Direct legacy restaurant paths return the normal not-found response and are not included in the generated site or sitemap.
- Remove restaurant resources from the visible CMS/admin navigation and new-content workflow so editors do not accidentally publish dormant restaurant content.
- Preserve existing restaurant tables and records without destructive migration. They remain dormant and can be reconsidered in a future milestone.
- Tests, schema contracts, and media audits distinguish between a dormant retained data structure and an enabled public product surface.

## Home Page Messaging

The home page keeps its present layout but communicates a guide-first purpose:

- discover regions and destination countries across Africa;
- understand attractions before planning a visit;
- compare route fit, access, seasonality, permits, and practical considerations;
- find appropriate stays near the attractions; and
- continue to a reputable external provider only from a complete detail page.

Remove language centered on comparing tours, restaurants, deals, affiliate partners, or leaving the site quickly. The featured attraction and featured stay sections use the card contracts above. The restaurant section is removed without replacing it with a new layout block.

## Content and Data Integration

The existing Laravel models, Blade templates, Supabase-backed CMS, seeded fallback content, and static-site builder remain the publishing system.

- Add and enrich records through the existing structured content fields wherever possible.
- Add only the minimal relationship/data fields needed to represent locality, property tier, official-versus-traveler star basis, multiple nearby attractions, and verified direct provider URLs.
- Do not flatten attraction and accommodation records into generic page blobs.
- New content must appear in the correct region, country, directory, related-listing, and relevant featured collections.
- Central Africa and all new countries must participate in filters and search using the same behaviors as existing entries.
- Licensed media and complete attribution metadata are required for every published record. Existing assets are reused only when they accurately represent the subject or are clearly identified as destination context.
- Static generation must emit every published region, country, attraction, and accommodation detail route as a real page.

## Publication Sequence

Implementation is organized into five content batches - West, East, Southern, Northern, and Central Africa - followed by a complete cross-region integration pass. A batch is not treated as a separate finished milestone; the full 29-country acceptance decision remains open until all batches pass.

Within each batch:

1. finalize the source ledger and country roster;
2. write and verify region/country content;
3. write and verify attraction content;
4. write and verify stay content and relationships;
5. verify media and direct provider links;
6. integrate records into existing collections and static routes; and
7. run content, route, link, and responsive checks.

## Error and Freshness Behavior

- When a permit, park, attraction, or route is closed or uncertain, the guide states the last verified condition and directs the traveler to the responsible official source.
- When a provider URL cannot be verified, the provider button is omitted.
- When a property category or star rating is not official, the wording cannot imply an official classification.
- When a live rate is unknown, no amount is invented.
- When content synchronization fails, the complete pre-rendered guide remains usable.
- Draft records never appear publicly or in static output.

## Acceptance Criteria

### Public experience

- The site presents five regions and 29 complete country guides in the confirmed classifications.
- Each country contains four to eight prioritized attractions or a documented research-based exception.
- Each attraction contains practical access, draw, seasonality/permit notes where relevant, and nearby stay recommendations across meaningful tiers.
- Every featured and directory attraction card starts with the attraction name and ends with `View attraction detail`.
- Every featured and directory stay card starts with the stay name and ends with `View stay`.
- Card images, titles, and CTAs resolve to real internal detail pages.
- External provider links appear only on attraction and stay detail pages and use verified direct URLs.
- No public page or generated file contains Stay22, an affiliate ID, affiliate disclosure, affiliate CTA, `aid-test`, or a restaurant-facing link or section.
- No on-site payment or booking flow is introduced.

### Technical and editorial validation

- Automated tests cover card field order and CTA text for every context using the shared component.
- Route tests prove every published region, country, attraction, and accommodation detail page returns successfully and restaurant routes do not.
- Static-build tests prove every published guide/detail page is emitted and restaurant pages are omitted.
- Link auditing proves internal card targets exist and external provider URLs are direct, safe, and restricted to detail pages.
- Content audits prove each record has the required source ledger entries, locality, concise summary, practical detail, media attribution, and freshness notes for changing conditions.
- Search and filter tests prove all five regions and 29 countries are discoverable without reintroducing restaurants.
- The full available PHP and JavaScript test suites, production asset build, static render, and internal-link audit pass.
- Responsive browser checks at mobile, tablet, and desktop widths confirm that the existing visual system and interactions remain intact.

## Delivery Boundary

The repository will contain the researched structured content, research ledger, media and attribution records, CMS/seeder updates, templates and controllers needed for the requested guide-first behavior, and deployment-ready static output. Existing unrelated or untracked user files remain untouched.

No production deployment, hosted Supabase mutation, domain change, or destructive restaurant-data deletion is part of this milestone without separate explicit authorization.
