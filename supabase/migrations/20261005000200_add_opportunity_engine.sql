-- Content Opportunity & Media Engine: content gap scanner queue and media attribution columns.
-- Requires: cm_knowledge, cm_discovery_sources, cm_activity_log, media_assets.
begin;

-- ============================================================================
-- cm_content_opportunities: proactive content gap detection queue.
-- The Content Opportunity Engine scans existing CMS content for gaps, sparsity,
-- staleness, missing media, missing metadata, and missing relationships.
-- Each row represents a single opportunity to improve content.
-- ============================================================================
create table public.cm_content_opportunities (
  id uuid primary key default gen_random_uuid(),
  opportunity_type text not null check (
    opportunity_type in (
      'missing_listing',       -- a country/region with no entry in its table
      'sparse_listing',        -- content row with < 50% field completeness
      'stale_content',         -- content not updated in > 90 days
      'missing_media',         -- listing without hero_image_url or gallery
      'missing_metadata',      -- listing without meta_title or meta_description
      'missing_relationship',  -- activity without attraction_id, etc.
      'missing_internal_link', -- content lacking cross-entity links
      'orphaned_content'       -- published content with no media and no relationships
    )
  ),
  entity_type text check (entity_type ~ '^[a-z][a-z0-9_]{0,63}$'),
  entity_id bigint,
  entity_slug text,
  priority text not null check (priority in ('daily', 'weekly', 'monthly', 'quarterly')),
  priority_score real not null check (priority_score >= 0.0 and priority_score <= 1.0),
  cadence text not null check (cadence in ('daily', 'weekly', 'monthly', 'quarterly')),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'resolved', 'dismissed')
  ),
  title text not null,
  description text,
  gap_details jsonb,            -- structured details: which fields are missing, etc.
  affected_entities jsonb,     -- list of affected slugs/IDs
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  resolution_notes text,
  last_scan_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- media_assets extension: add structured license + association columns.
-- The existing media_assets table has license text, source_page, creator,
-- attribution_text, url, alt_text. We add structured columns for programmatic
-- license filtering and content-entity association.
-- ============================================================================
alter table public.media_assets
    add column if not exists source_url text check (length(source_url) <= 2048),
    add column if not exists license_type text check (
        license_type in ('cc0', 'cc_by', 'cc_by_sa', 'cc_by_nd', 'cc_by_nc',
                         'cc_by_nc_sa', 'cc_by_nc_nd', 'proprietary', 'royalty_free', 'rights_managed')
    ),
    add column if not exists usage_terms text,
    add column if not exists associated_entity_type text,
    add column if not exists associated_entity_id bigint;

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger cm_content_opportunities_updated_at before update on public.cm_content_opportunities
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.cm_content_opportunities enable row level security;

revoke all on public.cm_content_opportunities from public, anon, authenticated;

-- Service role: full access (server-side mutations always)
grant select, insert, update, delete on public.cm_content_opportunities to service_role;
grant usage on all sequences in schema public to service_role;

-- cm_content_opportunities: all CMS staff can read, admins manage
create policy "CMS staff can read content opportunities"
  on public.cm_content_opportunities for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

create policy "Admins manage content opportunities"
  on public.cm_content_opportunities for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- media_assets: allow CMS staff to read all media (with attribution already stored),
-- admins can insert/update. Existing policies on media_assets may already exist
-- from prior migrations, so we use IF NOT EXISTS-style logic via DO blocks.
do $$
begin
  if not exists (
    select 1 from pg_roles where rolname = 'service_role'
  ) then
    create role service_role;
  end if;
  grant select, insert, update, delete on public.media_assets to service_role;
end;
$$;

-- ============================================================================
-- Indexes for opportunity queries
-- ============================================================================
create index if not exists cm_opportunities_cadence_idx on public.cm_content_opportunities(cadence);
create index if not exists cm_opportunities_priority_idx on public.cm_content_opportunities(priority, priority_score desc);
create index if not exists cm_opportunities_status_idx on public.cm_content_opportunities(status, last_scan_at);
create index if not exists cm_opportunities_type_idx on public.cm_content_opportunities(opportunity_type);
create index if not exists cm_opportunities_entity_idx on public.cm_content_opportunities(entity_type, entity_id) where entity_id is not null;
create index if not exists cm_opportunities_created_idx on public.cm_content_opportunities(created_at desc);

-- Indexes for media association lookups
create index if not exists media_assets_entity_idx on public.media_assets(associated_entity_type, associated_entity_id)
  where associated_entity_type is not null;
create index if not exists media_assets_license_type_idx on public.media_assets(license_type);

commit;
