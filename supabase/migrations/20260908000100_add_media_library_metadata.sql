-- Extend the shared media library for reusable images and video blocks.
-- Existing rows remain images unless their MIME type identifies another format.

alter table public.media_assets
    add column if not exists media_type text not null default 'image',
    add column if not exists source_type text not null default 'upload',
    add column if not exists mime_type text,
    add column if not exists file_size bigint,
    add column if not exists width integer,
    add column if not exists height integer,
    add column if not exists duration_seconds numeric(10,2),
    add column if not exists poster_url text,
    add column if not exists caption text,
    add column if not exists transcript text;

update public.media_assets
set media_type = case
    when lower(coalesce(mime_type, '')) like 'video/%' then 'video'
    else 'image'
end
where media_type is null or media_type = '';

alter table public.media_assets
    drop constraint if exists media_assets_media_type_check,
    add constraint media_assets_media_type_check check (media_type in ('image', 'video')),
    drop constraint if exists media_assets_source_type_check,
    add constraint media_assets_source_type_check check (source_type in ('upload', 'external'));

create index if not exists idx_media_assets_type_status
    on public.media_assets (media_type, status);
