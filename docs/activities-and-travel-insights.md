# Activities and Travel Insights

Implemented in the active Astro source and the Supabase CMS on 30 September 2026. The project disk is currently available at `E:\TrekAfricaGuide`; the saved `D:` location was unavailable.

## Implemented

- Main navigation: Destinations, Attractions, Activities, Accommodations, Travel Insights. Regions and Contact routes are retained but removed from the main navigation.
- `/activities` uses the existing ListingCard component and a functional country filter. Archive CTA: **View Activity Detail**.
- `/activities/[slug]` uses the attraction detail structure, with description, highlights, timing, planning notes, external booking link, source link, gallery and attraction-linked nearby stays.
- Attraction pages display **Activities done here** before nearby stays, using the shared listing card and **View Activity Details** CTA.
- `/travel-insights` contains a featured article, topic filter, sidebar reading list, image stories and a video section. Detail pages render sanitized rich text. YouTube/Vimeo embeds and direct MP4/WebM URLs are supported without autoplay; other HTTP(S) video URLs open externally.
- CMS includes Activities and Travel Insights resources, attraction relationships, editable content and images, activity galleries, optional videos, external links, featured/order controls, publishing times and SEO.
- The journal masthead and activity archive hero are editable in Page Sections using page keys `travel-insights` or `activities` and section key `hero`.

## Database rollout — pending access

Apply `supabase/migrations/20260930000100_add_activities_and_travel_articles.sql` to the existing website project **rftoaaehhenhnziukgpl**, then rebuild/deploy the Astro site through the established release workflow. Do not apply it to a different project.

The connected Supabase account listed only **pmskfhfxnhkpiaykgnra**. A direct read against the intended project returned “You do not have permission to perform this action.” No remote database changes or deployment were made.

The migration expects the existing CMS migrations, including `private.has_cms_role` and `public.set_updated_at`. It adds two tables with publication filtering, staff/editor/admin policies, and seed content. Editor access remains draft-only; admins can publish. Existing seed slugs are not overwritten. Activities are linked using existing attraction slugs rather than hardcoded database IDs.

Eleven initial activities span Uganda, Kenya, Tanzania, Morocco, South Africa, Ghana, Zimbabwe, Botswana, Egypt and Rwanda. The live public catalogue has 24 attractions; this is an initial researched selection, and editors can add more using the same CMS. Activities attached to unpublished/missing attractions are excluded from public pages. Nearby stays are the existing stays linked to that attraction, not invented proximity results.

Ten legacy editorial titles/topics are retained. The legacy records contained excerpts rather than full articles; the seed provides new short guide bodies. Reading time is calculated from the actual body unless overridden in the CMS. One official South African Tourism video is linked to the Cape Town story.

Until the migration is applied, missing `activities` and `travel_articles` tables are treated as empty only for schema-not-found errors. Other database errors still surface. The new pages show empty states; existing pages can continue to load. CMS edits reach this static site after its next rebuild, using the existing deploy hook when configured. Future publication dates also require a rebuild at or after that time.

## Research and booking sources

Sources were checked through focused web research on 30 September 2026. Listings establish an available provider page, not guaranteed availability on a future date. No live prices, ratings, permit fees or affiliate commission promises were invented. Booking links are editable and may be replaced with a verified Booking.com, GetYourGuide or Stay22-associated listing.

- [Maasai Mara balloon listing](https://www.getyourguide.com/kenya-l169122/maasai-mara-hot-air-balloon-safari-champagne-breakfast-t539006/)
- [UWA gorilla tracking](https://ugandawildlife.org/activities/gorilla-tracking/) and [Bwindi listing](https://www.getyourguide.com/western-region-uganda-l118965/bwindi-impenetrable-national-park-gorilla-trekking-day-trip-t860183/)
- [KWS Amboseli information](https://kws.go.ke/park/amboseli-national-park/) and [Amboseli safari listing](https://www.getyourguide.com/kenya-l169122/from-nairobi-2-day-amboseli-national-park-safari-t849496/)
- [Atlas Mountains listing](https://www.getyourguide.com/marrakech-l208/marrakech-atlas-mountains-5-valleys-day-tour-with-lunch-t11542/)
- [Serengeti operator FAQ](https://www.balloonsafaris.com/faqs) and [balloon booking listing](https://www.getyourguide.com/serengeti-national-park-l123040/serengeti-national-park-balloon-safari-at-dawn-t383490/)
- [SANParks hiking guidance](https://www.sanparks.org/parks/table-mountain/useful-information/safe-hiking) and [Table Mountain listing](https://www.getyourguide.com/en-au/cape-town-l103/table-mountain-immersive-guided-hike-with-an-eco-specialist-t836611/)
- [Cape Coast, Elmina and Kakum listing](https://www.getyourguide.com/de-de/accra-l506/accra-cape-coast-elmina-castles-kakum-park-tagestour-t481074/)
- [Victoria Falls walk listing](https://www.getyourguide.com/victoria-falls-town-l127068/victoria-falls-rainbow-guided-tour-t1182043/)
- [Okavango multi-day safari listing](https://www.getyourguide.com/nl-nl/botswana-l169074/okavango-delta-tour-met-game-drives-mokoro-trips-t853076/)
- [Giza and museum listing](https://www.getyourguide.com/en-gb/giza-l915/cairo-giza-pyramids-the-grand-egyptian-museum-guided-tour-t448326/)
- [Rwanda gorilla trek listing](https://www.getyourguide.com/en-gb/volcanoes-national-park-rwanda-l144502/rwanda-gorilla-trekking-safaris-t890054/)
- [Moroccan National Tourist Office desert route](https://www.visitmorocco.com/en/suggested-tours/desert-break)
- [Official South African Tourism UK video](https://www.youtube.com/watch?v=j38ijU7Kvzg)

## Verification scope

Source inspection only. No tests, builds, browser QA or deployment were run, following the user's usage preference. Database execution remains unverified because the correct project is inaccessible through the connected account.
