create extension if not exists pgcrypto;

create table if not exists public.settings (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    group_name text not null default 'general',
    value jsonb not null default '{}'::jsonb,
    is_public boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.regions (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    summary text,
    hero_image_url text,
    hero_priority integer not null default 0,
    status text not null default 'published' check (status in ('draft', 'published', 'archived')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.countries (
    id uuid primary key default gen_random_uuid(),
    region_id uuid not null references public.regions(id) on delete cascade,
    slug text not null unique,
    name text not null,
    summary text,
    hero_image_url text,
    visitor_priority integer not null default 0,
    status text not null default 'published' check (status in ('draft', 'published', 'archived')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.destinations (
    id uuid primary key default gen_random_uuid(),
    region_id uuid not null references public.regions(id) on delete cascade,
    country_id uuid not null references public.countries(id) on delete cascade,
    slug text not null unique,
    name text not null,
    category text not null default 'destination',
    summary text not null,
    short_brief text,
    how_to_get_there text,
    best_time text,
    hero_image_url text,
    map_embed_url text,
    price_band text not null default 'midrange' check (price_band in ('budget', 'midrange', 'luxury')),
    travel_styles text[] not null default '{}',
    visitor_priority integer not null default 0,
    status text not null default 'published' check (status in ('draft', 'published', 'archived')),
    published_at timestamptz,
    seo_title text,
    seo_description text,
    seo_image_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.destination_insights (
    id uuid primary key default gen_random_uuid(),
    destination_id uuid not null references public.destinations(id) on delete cascade,
    label text not null,
    value text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.listings (
    id uuid primary key default gen_random_uuid(),
    destination_id uuid not null references public.destinations(id) on delete cascade,
    region_id uuid not null references public.regions(id) on delete cascade,
    country_id uuid not null references public.countries(id) on delete cascade,
    listing_type text not null check (listing_type in ('tour', 'stay', 'restaurant', 'activity', 'experience')),
    slug text not null unique,
    name text not null,
    summary text not null,
    details text,
    listing_category text,
    travel_style text,
    price_band text not null default 'midrange' check (price_band in ('budget', 'midrange', 'luxury')),
    duration_days integer,
    price_from text,
    partner_name text,
    affiliate_url text,
    hero_image_url text,
    metadata jsonb not null default '{}'::jsonb,
    status text not null default 'published' check (status in ('draft', 'published', 'archived')),
    featured boolean not null default false,
    sort_order integer not null default 0,
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.articles (
    id uuid primary key default gen_random_uuid(),
    region_id uuid references public.regions(id) on delete set null,
    country_id uuid references public.countries(id) on delete set null,
    destination_id uuid references public.destinations(id) on delete set null,
    slug text not null unique,
    title text not null,
    category text not null,
    excerpt text not null,
    read_time text,
    cover_image_url text,
    body jsonb not null default '[]'::jsonb,
    featured boolean not null default false,
    status text not null default 'published' check (status in ('draft', 'published', 'archived')),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_countries_region_id on public.countries(region_id);
create index if not exists idx_destinations_region_id on public.destinations(region_id);
create index if not exists idx_destinations_country_id on public.destinations(country_id);
create index if not exists idx_listings_destination_id on public.listings(destination_id);
create index if not exists idx_listings_type_status on public.listings(listing_type, status);
create index if not exists idx_articles_category_status on public.articles(category, status);

alter table public.settings enable row level security;
alter table public.regions enable row level security;
alter table public.countries enable row level security;
alter table public.destinations enable row level security;
alter table public.destination_insights enable row level security;
alter table public.listings enable row level security;
alter table public.articles enable row level security;

create policy "Public can read public settings"
on public.settings
for select
using (is_public = true);

create policy "Public can read published regions"
on public.regions
for select
using (status = 'published');

create policy "Public can read published countries"
on public.countries
for select
using (status = 'published');

create policy "Public can read published destinations"
on public.destinations
for select
using (status = 'published');

create policy "Public can read destination insights"
on public.destination_insights
for select
using (
    exists (
        select 1
        from public.destinations
        where public.destinations.id = destination_insights.destination_id
          and public.destinations.status = 'published'
    )
);

create policy "Public can read published listings"
on public.listings
for select
using (status = 'published');

create policy "Public can read published articles"
on public.articles
for select
using (status = 'published');
