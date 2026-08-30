insert into public.regions (slug, name, hero_title, hero_text, overview, sort_order, status, published_at)
values ('east-africa', 'East Africa', 'East Africa travel guide', 'Plan an East Africa journey with practical destination guidance.', 'A regional starting point for wildlife, culture, and coastline travel planning.', 1, 'published', now())
on conflict (slug) do update
set name = excluded.name,
    hero_title = excluded.hero_title,
    hero_text = excluded.hero_text,
    overview = excluded.overview,
    sort_order = excluded.sort_order,
    status = excluded.status,
    published_at = excluded.published_at,
    updated_at = now();

insert into public.countries (region_id, slug, name, hero_title, hero_text, overview, sort_order, status, published_at)
select id, 'uganda', 'Uganda', 'Uganda travel guide', 'Plan a Uganda journey around forests, wildlife, and lake country.', 'Uganda is a practical starting point for primate trekking and safari planning.', 1, 'published', now()
from public.regions
where slug = 'east-africa'
on conflict (slug) do update
set region_id = excluded.region_id,
    name = excluded.name,
    hero_title = excluded.hero_title,
    hero_text = excluded.hero_text,
    overview = excluded.overview,
    sort_order = excluded.sort_order,
    status = excluded.status,
    published_at = excluded.published_at,
    updated_at = now();

insert into public.attractions (region_id, country_id, slug, name, location_name, listing_summary, detail_intro, full_description, sort_order, status, published_at)
select region.id, country.id, 'bwindi-impenetrable-national-park', 'Bwindi Impenetrable National Park', 'Southwestern Uganda', 'A forest destination for responsibly planned gorilla trekking.', 'Bwindi combines guided trekking with a high-biodiversity forest setting.', 'Confirm permits, guides, transport, and fitness requirements before booking.', 1, 'published', now()
from public.regions as region
join public.countries as country on country.region_id = region.id
where region.slug = 'east-africa' and country.slug = 'uganda'
on conflict (slug) do update
set region_id = excluded.region_id,
    country_id = excluded.country_id,
    name = excluded.name,
    location_name = excluded.location_name,
    listing_summary = excluded.listing_summary,
    detail_intro = excluded.detail_intro,
    full_description = excluded.full_description,
    sort_order = excluded.sort_order,
    status = excluded.status,
    published_at = excluded.published_at,
    updated_at = now();

insert into public.media_assets (
    mediable_type, mediable_id, role, local_path, url, alt_text, source_page, creator,
    license, license_url, exact_subject_match, attribution_text, status, published_at, sort_order
)
select
    'attraction', attraction.id, 'hero',
    '/images/stock/destinations/bwindi-impenetrable-national-park.jpg',
    '/images/stock/destinations/bwindi-impenetrable-national-park.jpg',
    'Bwindi Impenetrable National Park in Southwestern Uganda',
    'https://commons.wikimedia.org/wiki/File:Bwindi_Impenetrable_National_Park_02.jpg',
    'Thomas Fuhrmann', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/',
    true, 'Photo by Thomas Fuhrmann / CC BY-SA 4.0', 'published', now(), 1
from public.attractions as attraction
where attraction.slug = 'bwindi-impenetrable-national-park'
on conflict (mediable_type, mediable_id, role, source_page) do update
set local_path = excluded.local_path,
    url = excluded.url,
    alt_text = excluded.alt_text,
    creator = excluded.creator,
    license = excluded.license,
    license_url = excluded.license_url,
    exact_subject_match = excluded.exact_subject_match,
    attribution_text = excluded.attribution_text,
    status = excluded.status,
    published_at = excluded.published_at,
    sort_order = excluded.sort_order,
    updated_at = now();
