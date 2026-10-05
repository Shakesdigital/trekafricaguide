-- Knowledge Engine: discovered facts and discovery source registry.
-- Requires: cm_drafts, ai_jobs, ai_task_config, private.has_cms_role, set_updated_at.
begin;

-- ============================================================================
-- cm_knowledge: discovered facts with confidence scores, sources, and relationships.
-- This is the shared intelligence layer — findings are stored here, then
-- optionally escalated into cm_drafts when confidence is high enough.
-- ============================================================================
create table public.cm_knowledge (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type ~ '^[a-z][a-z0-9_]{0,63}$'),
  entity_id bigint, -- FK to the destination content table row (nullable)
  discovery_type text not null check (
    discovery_type in ('new', 'enrichment', 'update', 'duplicate', 'conflict')
  ),
  confidence real not null check (confidence >= 0.0 and confidence <= 1.0),
  knowledge_data jsonb not null, -- extracted structured fields
  source_url text check (length(source_url) <= 2048),
  source_name text,
  discovery_date timestamptz not null default now(),
  verification_status text not null default 'unverified' check (
    verification_status in ('unverified', 'confirmed', 'disputed')
  ),
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'rejected')
  ),
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- cm_discovery_sources: curated source list for continuous monitoring.
-- Each entry is a domain with seed URLs and a category for crawl scheduling.
-- ============================================================================
create table public.cm_discovery_sources (
  domain text primary key check (length(domain) <= 255),
  name text not null,
  seed_urls text[] not null default '{}',
  category text not null check (
    category in ('tourism_board', 'travel_blog', 'magazine', 'safari_operator')
  ),
  verified boolean not null default false,
  last_discovered_at timestamptz,
  last_checked_at timestamptz,
  check_interval_hours integer not null default 24 check (check_interval_hours between 1 and 168),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger cm_knowledge_updated_at before update on public.cm_knowledge
  for each row execute function public.set_updated_at();

create trigger cm_discovery_sources_updated_at before update on public.cm_discovery_sources
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.cm_knowledge enable row level security;
alter table public.cm_discovery_sources enable row level security;

revoke all on public.cm_knowledge, public.cm_discovery_sources from public, anon, authenticated;

-- Service role: full access (server-side mutations always)
grant select, insert, update, delete on public.cm_knowledge, public.cm_discovery_sources to service_role;
grant usage on all sequences in schema public to service_role;

-- cm_knowledge: admins can write, all CMS staff can read
create policy "CMS staff can read knowledge"
  on public.cm_knowledge for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

create policy "Admins manage knowledge"
  on public.cm_knowledge for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_discovery_sources: all CMS staff can read, admins can write
create policy "CMS staff can read discovery sources"
  on public.cm_discovery_sources for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

create policy "Admins manage discovery sources"
  on public.cm_discovery_sources for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- ============================================================================
-- Indexes for knowledge graph queries
-- ============================================================================
create index cm_knowledge_entity_type_idx on public.cm_knowledge(entity_type);
create index cm_knowledge_discovery_type_idx on public.cm_knowledge(discovery_type);
create index cm_knowledge_confidence_idx on public.cm_knowledge(confidence);
create index cm_knowledge_verification_idx on public.cm_knowledge(verification_status, review_status);
create index cm_knowledge_source_idx on public.cm_knowledge(source_url, source_name);
create index cm_knowledge_created_idx on public.cm_knowledge(created_at desc);
create index cm_knowledge_entity_lookup_idx on public.cm_knowledge(entity_type, entity_id) where entity_id is not null;

create index cm_discovery_sources_category_idx on public.cm_discovery_sources(category);
create index cm_discovery_sources_verified_idx on public.cm_discovery_sources(verified);
create index cm_discovery_sources_check_idx on public.cm_discovery_sources(last_checked_at);

-- ============================================================================
-- Helper: log a knowledge activity entry to the CM audit trail.
-- Mirrors the private.log_cm_activity pattern so knowledge engine actions
-- are visible in the same audit log as CM research/draft actions.
-- ============================================================================
create or replace function public.log_knowledge_activity(
  p_actor_id uuid,
  p_action text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_old_state jsonb default null,
  p_new_state jsonb default null,
  p_reason text default null
) returns uuid language plpgsql security invoker set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into public.cm_activity_log (
    actor_id, action, entity_type, entity_id, old_state, new_state, reason
  ) values (
    p_actor_id, p_action, p_entity_type, p_entity_id, p_old_state, p_new_state, p_reason
  ) returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.log_knowledge_activity from public, anon, authenticated;
grant execute on function public.log_knowledge_activity to service_role;

commit;
