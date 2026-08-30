-- Local development catalogue only. This seed creates no Auth users or credentials.

insert into public.regions (slug, name, hero_title, hero_text, overview, sort_order, status, published_at)
values
    ('east-africa', 'East Africa', 'East Africa travel guide', 'Safari, primates, highlands, and coast.', 'A practical regional starting point for wildlife and culture.', 1, 'published', now()),
    ('west-africa', 'West Africa', 'West Africa travel guide', 'Heritage, coast, music, and food.', 'A regional starting point for culture-forward routes.', 2, 'published', now()),
    ('southern-africa', 'Southern Africa', 'Southern Africa travel guide', 'City, bush, desert, and falls.', 'A regional starting point for wilderness and road travel.', 3, 'published', now()),
    ('northern-africa', 'Northern Africa', 'Northern Africa travel guide', 'Medinas, antiquities, desert, and coast.', 'A regional starting point for history and food-led travel.', 4, 'published', now())
on conflict (slug) do update set
    name = excluded.name, hero_title = excluded.hero_title, hero_text = excluded.hero_text,
    overview = excluded.overview, sort_order = excluded.sort_order, status = excluded.status,
    published_at = excluded.published_at, updated_at = now();

with catalogue as (
    select * from jsonb_to_recordset($countries$
        [{"region_slug":"east-africa","slug":"uganda"},{"region_slug":"east-africa","slug":"kenya"},{"region_slug":"east-africa","slug":"tanzania"},{"region_slug":"east-africa","slug":"rwanda"},{"region_slug":"east-africa","slug":"ethiopia"},{"region_slug":"west-africa","slug":"ghana"},{"region_slug":"west-africa","slug":"senegal"},{"region_slug":"west-africa","slug":"benin"},{"region_slug":"west-africa","slug":"sierra-leone"},{"region_slug":"west-africa","slug":"cabo-verde"},{"region_slug":"southern-africa","slug":"south-africa"},{"region_slug":"southern-africa","slug":"botswana"},{"region_slug":"southern-africa","slug":"namibia"},{"region_slug":"southern-africa","slug":"zimbabwe"},{"region_slug":"southern-africa","slug":"zambia"},{"region_slug":"northern-africa","slug":"morocco"},{"region_slug":"northern-africa","slug":"egypt"},{"region_slug":"northern-africa","slug":"tunisia"},{"region_slug":"northern-africa","slug":"algeria"}]
    $countries$::jsonb) as row(region_slug text, slug text)
)
insert into public.countries (region_id, slug, name, hero_title, hero_text, overview, sort_order, status, published_at)
select region.id, catalogue.slug, initcap(replace(catalogue.slug, '-', ' ')), initcap(replace(catalogue.slug, '-', ' ')) || ' Travel Guide', 'Plan a considered route with local context.', 'A catalogue country record for local CMS development.', row_number() over (order by catalogue.slug), 'published', now()
from catalogue join public.regions as region on region.slug = catalogue.region_slug
on conflict (slug) do update set region_id = excluded.region_id, name = excluded.name, hero_title = excluded.hero_title, hero_text = excluded.hero_text, overview = excluded.overview, sort_order = excluded.sort_order, status = excluded.status, published_at = excluded.published_at, updated_at = now();

insert into public.districts (country_id, slug, name, overview, sort_order)
select country.id, 'primary-district', country.name || ' primary district', 'Local catalogue district for route planning.', 1
from public.countries as country
where not exists (select 1 from public.districts as district where district.country_id = country.id and district.slug = 'primary-district');

with catalogue(slug, country_slug) as (values
    ('bwindi-impenetrable-national-park','uganda'),('murchison-falls-national-park','uganda'),('maasai-mara','kenya'),('amboseli-national-park','kenya'),('serengeti-national-park','tanzania'),('zanzibar','tanzania'),('volcanoes-national-park','rwanda'),('lalibela','ethiopia'),('cape-coast-kakum','ghana'),('sine-saloum-delta','senegal'),('ouidah-and-ganvie','benin'),('tokeh-and-river-no2','sierra-leone'),('sal-island','cabo-verde'),('cape-town','south-africa'),('kruger-national-park','south-africa'),('okavango-delta','botswana'),('namib-desert','namibia'),('victoria-falls','zimbabwe'),('south-luangwa','zambia'),('marrakech-and-atlas','morocco'),('sahara-dunes','morocco'),('cairo-and-giza','egypt'),('tunis-and-sidi-bou-said','tunisia'),('djanet-and-tassili','algeria')
)
insert into public.attractions (region_id, country_id, slug, name, location_name, hero_image_url, hero_image_alt, listing_summary, detail_intro, full_description, sort_order, status, published_at)
select region.id, country.id, catalogue.slug, initcap(replace(catalogue.slug, '-', ' ')), country.name, '/images/stock/destinations/' || catalogue.slug || '.jpg', initcap(replace(catalogue.slug, '-', ' ')), 'A destination anchor for the local CMS catalogue.', 'A practical introduction for trip planning.', 'Confirm current access, permits, pricing, and operating conditions directly before booking.', row_number() over (order by catalogue.slug), 'published', now()
from catalogue join public.countries as country on country.slug = catalogue.country_slug join public.regions as region on region.id = country.region_id
on conflict (slug) do update set region_id = excluded.region_id, country_id = excluded.country_id, name = excluded.name, location_name = excluded.location_name, hero_image_url = excluded.hero_image_url, hero_image_alt = excluded.hero_image_alt, listing_summary = excluded.listing_summary, detail_intro = excluded.detail_intro, full_description = excluded.full_description, sort_order = excluded.sort_order, status = excluded.status, published_at = excluded.published_at, updated_at = now();

with catalogue(slug, country_slug, attraction_slug) as (values
    ('sanctuary-gorilla-forest-camp','uganda','bwindi-impenetrable-national-park'),('paraa-safari-lodge','uganda','murchison-falls-national-park'),('governors-camp','kenya','maasai-mara'),('ol-tukai-lodge-amboseli','kenya','amboseli-national-park'),('serengeti-serena-safari-lodge','tanzania','serengeti-national-park'),('emerson-spice','tanzania','zanzibar'),('sabyinyo-silverback-lodge','rwanda','volcanoes-national-park'),('maribela-hotel','ethiopia','lalibela'),('ridge-royal-hotel','ghana','cape-coast-kakum'),('les-paletuviers','senegal','sine-saloum-delta'),('casa-del-papa','benin','ouidah-and-ganvie'),('the-place-resort-tokeh','sierra-leone','tokeh-and-river-no2'),('hilton-cabo-verde-sal-resort','cabo-verde','sal-island'),('mount-nelson-a-belmond-hotel','south-africa','cape-town'),('kruger-shalati','south-africa','kruger-national-park'),('camp-okavango','botswana','okavango-delta'),('sossusvlei-lodge','namibia','namib-desert'),('victoria-falls-hotel','zimbabwe','victoria-falls'),('mfuwe-lodge','zambia','south-luangwa'),('riad-rosemary','morocco','marrakech-and-atlas'),('desert-luxury-camp','morocco','sahara-dunes'),('marriott-mena-house-cairo','egypt','cairo-and-giza'),('dar-said','tunisia','tunis-and-sidi-bou-said'),('terres-touareg-guest-house','algeria','djanet-and-tassili')
)
insert into public.accommodations (region_id, country_id, attraction_id, slug, name, location_name, hero_image_url, hero_image_alt, listing_summary, detail_intro, practical_info, sort_order, status, published_at)
select region.id, country.id, attraction.id, catalogue.slug, initcap(replace(catalogue.slug, '-', ' ')), attraction.location_name, attraction.hero_image_url, attraction.hero_image_alt, 'A stay that supports the local catalogue route.', 'A practical stay introduction for route planning.', 'Confirm current rooms, terms, transfers, and availability directly before booking.', row_number() over (order by catalogue.slug), 'published', now()
from catalogue join public.countries as country on country.slug = catalogue.country_slug join public.regions as region on region.id = country.region_id join public.attractions as attraction on attraction.slug = catalogue.attraction_slug
on conflict (slug) do update set region_id = excluded.region_id, country_id = excluded.country_id, attraction_id = excluded.attraction_id, name = excluded.name, location_name = excluded.location_name, hero_image_url = excluded.hero_image_url, hero_image_alt = excluded.hero_image_alt, listing_summary = excluded.listing_summary, detail_intro = excluded.detail_intro, practical_info = excluded.practical_info, sort_order = excluded.sort_order, status = excluded.status, published_at = excluded.published_at, updated_at = now();

with catalogue(slug, country_slug, attraction_slug) as (values
    ('sanctuary-gorilla-forest-camp-dining','uganda','bwindi-impenetrable-national-park'),('paraa-safari-lodge-dining','uganda','murchison-falls-national-park'),('governors-camp-dining','kenya','maasai-mara'),('ol-tukai-lodge-dining','kenya','amboseli-national-park'),('serengeti-serena-dining','tanzania','serengeti-national-park'),('the-rock-restaurant-zanzibar','tanzania','zanzibar'),('sabyinyo-silverback-lodge-dining','rwanda','volcanoes-national-park'),('ben-abeba','ethiopia','lalibela'),('oasis-beach-resort-restaurant','ghana','cape-coast-kakum'),('les-paletuviers-restaurant','senegal','sine-saloum-delta'),('casa-del-papa-restaurant','benin','ouidah-and-ganvie'),('the-place-resort-restaurant','sierra-leone','tokeh-and-river-no2'),('barracuda-restaurant-sal','cabo-verde','sal-island'),('seebamboes-cape-town','south-africa','cape-town'),('kruger-shalati-dining','south-africa','kruger-national-park'),('camp-okavango-dining','botswana','okavango-delta'),('sossusvlei-lodge-restaurant','namibia','namib-desert'),('lookout-cafe-victoria-falls','zimbabwe','victoria-falls'),('mfuwe-lodge-dining','zambia','south-luangwa'),('kabana-rooftop','morocco','marrakech-and-atlas'),('desert-luxury-camp-dining','morocco','sahara-dunes'),('9-pyramids-lounge','egypt','cairo-and-giza'),('dar-zarrouk','tunisia','tunis-and-sidi-bou-said'),('terres-touareg-camp-dining','algeria','djanet-and-tassili')
)
insert into public.restaurants (region_id, country_id, attraction_id, slug, name, location_name, hero_image_url, hero_image_alt, listing_summary, detail_intro, practical_info, sort_order, status, published_at)
select region.id, country.id, attraction.id, catalogue.slug, initcap(replace(catalogue.slug, '-', ' ')), attraction.location_name, attraction.hero_image_url, attraction.hero_image_alt, 'A dining listing that completes the local catalogue route.', 'A practical dining introduction for route planning.', 'Confirm current menus, opening hours, reservations, and dietary support directly before travel.', row_number() over (order by catalogue.slug), 'published', now()
from catalogue join public.countries as country on country.slug = catalogue.country_slug join public.regions as region on region.id = country.region_id join public.attractions as attraction on attraction.slug = catalogue.attraction_slug
on conflict (slug) do update set region_id = excluded.region_id, country_id = excluded.country_id, attraction_id = excluded.attraction_id, name = excluded.name, location_name = excluded.location_name, hero_image_url = excluded.hero_image_url, hero_image_alt = excluded.hero_image_alt, listing_summary = excluded.listing_summary, detail_intro = excluded.detail_intro, practical_info = excluded.practical_info, sort_order = excluded.sort_order, status = excluded.status, published_at = excluded.published_at, updated_at = now();

insert into public.tour_operators (region_id, country_id, attraction_id, slug, name, summary, hero_image_url, hero_image_alt)
select region.id, country.id, min(attraction.id), country.slug || '-journey-studio', country.name || ' Journey Studio', 'A locally grounded route-planning operator for the catalogue country.', min(attraction.hero_image_url), country.name || ' tour planning'
from public.countries as country join public.regions as region on region.id = country.region_id left join public.attractions as attraction on attraction.country_id = country.id
group by region.id, country.id, country.slug, country.name
on conflict (slug) do update set region_id = excluded.region_id, country_id = excluded.country_id, attraction_id = excluded.attraction_id, name = excluded.name, summary = excluded.summary, hero_image_url = excluded.hero_image_url, hero_image_alt = excluded.hero_image_alt, updated_at = now();

insert into public.site_settings (group_name, key, value, is_public)
values ('general','site_name','Trek Africa Guide',true),('general','site_tagline','African travel catalogue and planning guide.',true),('branding','primary_color','#284932',true),('branding','secondary_color','#c56b3d',true),('seo','default_meta_description','Practical African travel catalogue and planning context.',true)
on conflict (key) do update set group_name = excluded.group_name, value = excluded.value, is_public = excluded.is_public, updated_at = now();

insert into public.page_sections (page_key, section_key, module_type, eyebrow, title, body, sort_order, status, published_at)
select page_key, section_key, module_type, eyebrow, title, body, sort_order, 'published', now()
from (values ('home','hero','hero','Discover Africa','Explore Africa with context.','Compare destinations before continuing to booking partners.',1),('home','intro','rich_text','Start with fit','Africa is many travel styles.','Choose a route that matches the experience you want.',2),('home','featured_regions','collection','Featured Regions','Regional starting points.','Compare regions, countries, and listings.',3),('home','featured_attractions','collection','Featured Attractions','Attractions that anchor a journey.','Use destination context to plan well.',4),('home','featured_accommodations','collection','Featured Stays','Stays that support the route.','Check terms directly before booking.',5),('home','featured_restaurants','collection','Featured Dining','Dining that completes the place.','Confirm current menus and reservations directly.',6)) as section(page_key, section_key, module_type, eyebrow, title, body, sort_order)
where not exists (select 1 from public.page_sections as existing where existing.page_key = section.page_key and existing.section_key = section.section_key);

insert into public.booking_offers (offerable_type, offerable_id, provider, label, source_url, affiliate_supported, active, sort_order)
select 'accommodation', accommodation.id, 'booking', 'Compare on Booking.com', 'https://www.booking.com/searchresults.html?ss=' || accommodation.slug, true, true, 10
from public.accommodations as accommodation
where not exists (select 1 from public.booking_offers as offer where offer.offerable_type = 'accommodation' and offer.offerable_id = accommodation.id and offer.provider = 'booking');

insert into public.booking_offers (offerable_type, offerable_id, provider, label, source_url, affiliate_supported, active, sort_order)
select 'attraction', attraction.id, 'getyourguide', 'Find activities', 'https://www.getyourguide.com/s/?q=' || attraction.slug, true, true, 10
from public.attractions as attraction
where not exists (select 1 from public.booking_offers as offer where offer.offerable_type = 'attraction' and offer.offerable_id = attraction.id and offer.provider = 'getyourguide');

insert into public.media_assets (mediable_type, mediable_id, role, local_path, url, alt_text, source_page, creator, license, license_url, exact_subject_match, attribution_text, status, published_at, sort_order)
select 'attraction', attraction.id, 'hero', attraction.hero_image_url, attraction.hero_image_url, attraction.hero_image_alt, 'catalogue://attractions/' || attraction.slug, 'Trek Africa Guide catalogue', 'See associated public asset credit', null, true, 'Catalogue media assignment; see public image credits.', 'published', now(), 1 from public.attractions as attraction
union all select 'accommodation', accommodation.id, 'hero', accommodation.hero_image_url, accommodation.hero_image_url, accommodation.hero_image_alt, 'catalogue://accommodations/' || accommodation.slug, 'Trek Africa Guide catalogue', 'See associated public asset credit', null, false, 'Catalogue media assignment; see public image credits.', 'published', now(), 1 from public.accommodations as accommodation
union all select 'restaurant', restaurant.id, 'hero', restaurant.hero_image_url, restaurant.hero_image_url, restaurant.hero_image_alt, 'catalogue://restaurants/' || restaurant.slug, 'Trek Africa Guide catalogue', 'See associated public asset credit', null, false, 'Catalogue media assignment; see public image credits.', 'published', now(), 1 from public.restaurants as restaurant
on conflict (mediable_type, mediable_id, role, source_page) do update set local_path = excluded.local_path, url = excluded.url, alt_text = excluded.alt_text, creator = excluded.creator, license = excluded.license, license_url = excluded.license_url, exact_subject_match = excluded.exact_subject_match, attribution_text = excluded.attribution_text, status = excluded.status, published_at = excluded.published_at, sort_order = excluded.sort_order, updated_at = now();

do $$
begin
    if (select count(*) from public.attractions) < 24 then raise exception 'catalogue incomplete: attractions'; end if;
    if (select count(*) from public.accommodations) < 24 then raise exception 'catalogue incomplete: accommodations'; end if;
    if (select count(*) from public.restaurants) < 24 then raise exception 'catalogue incomplete: restaurants'; end if;
    if (select count(*) from public.media_assets) < 72 then raise exception 'catalogue incomplete: media_assets'; end if;
end;
$$;
