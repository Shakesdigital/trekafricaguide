-- Content Manager: admin-only AI-assisted research and publishing workflow.
-- Requires: private.has_cms_role, public.profiles, ai_jobs from prior migrations.
begin;

-- ============================================================================
-- cm_research_queue: research tasks awaiting AI extraction
-- Tracks the intake side of the workflow: an admin submits a URL or search
-- query, the system fetches + extracts structured data via AI, then
-- matches against existing content to detect duplicates.
-- ============================================================================
create table public.cm_research_queue (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('url', 'search')),
  source_url text check (length(source_url) <= 2048),
  search_query text check (length(search_query) <= 500),
  target_entity text not null check (target_entity ~ '^[a-z][a-z0-9_]{0,63}$'),
  region_id bigint references public.regions(id) on delete set null,
  country_id bigint references public.countries(id) on delete set null,
  status text not null default 'queued' check (
    status in ('queued', 'researching', 'extracted', 'matched', 'errored', 'completed')
  ),
  ai_job_id uuid references public.ai_jobs(id) on delete set null,
  assigned_provider text,
  model_used text,
  error_code text check (length(error_code) <= 64),
  error_message text check (length(error_message) <= 200),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- cm_drafts: AI-generated drafts (NEW listings or PROPOSED updates)
-- The central workflow table. Each draft is a snapshot of AI-extracted data
-- before admin approval. approval_status controls the gate to publishing.
-- ============================================================================
create table public.cm_drafts (
  id uuid primary key default gen_random_uuid(),
  target_entity text not null check (target_entity ~ '^[a-z][a-z0-9_]{0,63}$'),
  draft_type text not null check (draft_type in ('new', 'update')),
  target_id bigint, -- FK to the destination content table row (for updates only)
  draft_data jsonb not null, -- structured field values extracted by AI
  workflow_status text not null default 'draft' check (
    workflow_status in ('draft', 'needs_verification', 'ready_for_review', 'approved', 'rejected', 'published')
  ),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected')
  ),
  -- Source provenance — always retained
  source_url text check (length(source_url) <= 2048),
  source_name text,
  research_date timestamptz,
  verification_date timestamptz,
  -- AI metadata — every operation is attributable
  ai_model text,
  ai_task_type text check (ai_task_type ~ '^[a-z][a-z0-9_]{0,63}$'),
  ai_job_id uuid references public.ai_jobs(id) on delete set null,
  ai_generated boolean not null default true,
  -- Approval audit
  approver_id uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  approval_notes text,
  rejection_reason text,
  -- Publishing
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  -- Workflow versioning
  version integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- cm_draft_changes: per-field before/after diffs for update proposals
-- When draft_type='update', each changed field gets a row so an admin can
-- approve or reject individual fields independently.
-- ============================================================================
create table public.cm_draft_changes (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.cm_drafts(id) on delete cascade,
  field_name text not null,
  old_value jsonb,
  new_value jsonb,
  reviewer_decision text check (
    reviewer_decision in ('pending', 'approved', 'rejected')
  ) not null default 'pending',
  reviewer_notes text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  unique (draft_id, field_name)
);

-- ============================================================================
-- cm_sources: verified source URLs for attribution
-- A registry of sources the team has confirmed as reliable.
-- ============================================================================
create table public.cm_sources (
  url text primary key check (length(url) <= 2048),
  domain text not null,
  name text not null,
  verified boolean not null default false,
  last_checked_at timestamptz,
  added_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- cm_activity_log: immutable audit trail of all admin/research actions
-- ============================================================================
create table public.cm_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (
    action in ('research_started', 'extracted', 'duplicate_detected',
               'draft_created', 'draft_verified', 'draft_sent_for_review',
               'field_approved', 'field_rejected', 'draft_approved',
               'draft_rejected', 'draft_published', 'draft_rolled_back')
  ),
  entity_type text,
  entity_id uuid,
  old_state jsonb,
  new_state jsonb,
  reason text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger cm_research_queue_updated_at before update on public.cm_research_queue
  for each row execute function public.set_updated_at();

create trigger cm_drafts_updated_at before update on public.cm_drafts
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.cm_research_queue enable row level security;
alter table public.cm_drafts enable row level security;
alter table public.cm_draft_changes enable row level security;
alter table public.cm_sources enable row level security;
alter table public.cm_activity_log enable row level security;

revoke all on public.cm_research_queue, public.cm_drafts, public.cm_draft_changes,
  public.cm_sources, public.cm_activity_log from public, anon, authenticated;

-- Service role: full access (server-side mutations always)
grant select, insert, update, delete on public.cm_research_queue, public.cm_drafts,
  public.cm_draft_changes, public.cm_sources, public.cm_activity_log to service_role;
-- Allow service_role to use the PK sequences if any are added later
grant usage on all sequences in schema public to service_role;

-- cm_research_queue: admins manage, editors/viewers cannot access directly
-- (All mutations flow through server-side validation; even admins cannot
-- bypass via REST. Readers are admin-only for security.)
create policy "Admins manage research queue"
  on public.cm_research_queue for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_drafts: admins manage all
create policy "Admins manage all drafts"
  on public.cm_drafts for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_draft_changes: admins manage (for per-field approval)
create policy "Admins manage draft changes"
  on public.cm_draft_changes for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_sources: admins manage, all CMS staff can read
create policy "CMS staff can read verified sources"
  on public.cm_sources for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

create policy "Admins manage sources"
  on public.cm_sources for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_activity_log: immutable audit trail
create policy "Admins can read activity log"
  on public.cm_activity_log for select to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])));

create policy "System can insert activity log"
  on public.cm_activity_log for insert to authenticated
  using (true)
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- ============================================================================
-- Indexes for queue filtering, draft workflow, log sorting
-- ============================================================================
create index cm_research_queue_status_idx on public.cm_research_queue(status, created_at desc);
create index cm_research_queue_entity_idx on public.cm_research_queue(target_entity);
create index cm_drafts_workflow_idx on public.cm_drafts(workflow_status, approval_status, created_at desc);
create index cm_drafts_target_idx on public.cm_drafts(target_entity, target_id, draft_type);
create index cm_drafts_source_idx on public.cm_drafts(source_url, source_name);
create index cm_drafts_version_idx on public.cm_drafts(target_entity, target_id, version desc);
create index cm_draft_changes_draft_idx on public.cm_draft_changes(draft_id, field_name);
create index cm_activity_log_entity_idx on public.cm_activity_log(entity_type, entity_id, created_at desc);
create index cm_activity_log_actor_idx on public.cm_activity_log(actor_id, created_at desc);

-- ============================================================================
-- Helper function: append audit log entry (callable from server-side only)
-- ============================================================================
create or replace function public.log_cm_activity(
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

revoke all on function public.log_cm_activity from public, anon, authenticated;
grant execute on function public.log_cm_activity to service_role;

commit;
