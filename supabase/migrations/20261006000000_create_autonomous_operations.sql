-- Autonomous Operations: agent orchestrator tables for continuous
-- Research → Verify → Knowledge Base → CMS pipeline with permission gates.
-- Requires: cm_knowledge, cm_discovery_sources, cm_drafts, cm_content_opportunities,
--   cm_activity_log, ai_jobs, ai_task_config, private.has_cms_role.
begin;

-- ============================================================================
-- cm_agent_operations: high-level autonomous operation records.
-- Each row is one autonomous cycle (e.g. "daily_continuous_discovery").
-- ============================================================================
create table public.cm_agent_operations (
  id uuid primary key default gen_random_uuid(),
  operation_type text not null check (
    operation_type ~ '^[a-z][a-z0-9_]{0,63}$'
  ),
  status text not null default 'running' check (
    status in ('running', 'completed', 'failed', 'interrupted')
  ),
  actor_id uuid references auth.users(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  stats jsonb,                    -- {scanned, new_opportunities, drafts_created, discoveries, approvals_auto, approvals_pending, errors}
  error_code text check (length(error_code) <= 64),
  error_message text check (length(error_message) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- cm_agent_log: immutable per-action audit trail for every agent decision.
-- One row per agent action — what was discovered, what was changed, why,
-- whether it was auto-applied or requires approval.
-- ============================================================================
create table public.cm_agent_log (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid references public.cm_agent_operations(id) on delete cascade,
  action_type text not null check (
    action_type in (
      'discovery',          -- a finding stored in cm_knowledge
      'draft_created',      -- a draft created via createDraft
      'draft_verified',     -- verifyDraft run (before/after diff computed)
      'field_change',       -- a single field proposed for update
      'auto_publish',       -- a low-risk draft auto-published
      'auto_apply_enrichment', -- a non-forbidden enrichment field auto-applied to content
      'approval_required',  -- a restricted field change escalated to approval queue
      'approval_granted',   -- admin approved an escalated change
      'approval_rejected',  -- admin rejected an escalated change
      'opportunity_created',-- a content opportunity created
      'media_matched',      -- a media asset matched to an entity
      'internal_link_added',-- an internal link added between entities
      'metadata_improved',  -- metadata (meta_title, meta_description) improved
      'duplicate_confirmed',-- a duplicate finding confirmed as same entity
      'error'               -- an operation failed
    )
  ),
  entity_type text,               -- content entity type or 'knowledge' or 'opportunity'
  entity_id bigint,               -- FK to the content table row (when applicable)
  entity_slug text,               -- for human readability
  operation_detail jsonb not null default '{}',
  -- old_value / new_value for field-level changes. JSON to support any field type.
  old_value jsonb,
  new_value jsonb,
  -- Permission tier: 'auto' if the action was auto-permitted, 'approval' if escalated
  permission_tier text not null check (
    permission_tier in ('auto', 'approval')
  ) default 'auto',
  -- Confidence score from AI (0.0–1.0), when applicable
  confidence real check (confidence >= 0.0 and confidence <= 1.0),
  -- Source URL for the finding/action
  source_url text check (length(source_url) <= 2048),
  -- Who/what took the action — 'system' for autonomous, or a user ID
  actor_id uuid references auth.users(id) on delete set null,
  -- Status of this log entry: pending_review / approved / rejected / applied / discarded
  status text not null default 'applied' check (
    status in ('pending_review', 'applied', 'discarded', 'approved', 'rejected')
  ),
  -- Admin notes / review decision
  reviewer_id uuid references auth.users(id) on delete set null,
  review_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- cm_agent_approval_queue: items awaiting admin review.
-- Populated when the agent encounters FORBIDDEN_FIELDS or restricted content.
-- ============================================================================
create table public.cm_agent_approval_queue (
  id uuid primary key default gen_random_uuid(),
  log_id uuid references public.cm_agent_log(id) on delete cascade,
  operation_id uuid references public.cm_agent_operations(id) on delete cascade,
  entity_type text not null,
  entity_id bigint,
  entity_slug text,
  field_name text not null,
  proposed_value jsonb,
  current_value jsonb,
  reason text,                    -- why this requires approval
  priority_score real check (priority_score >= 0.0 and priority_score <= 1.0) default 0.5,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'applied')
  ),
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger cm_agent_operations_updated_at before update on public.cm_agent_operations
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.cm_agent_operations enable row level security;
alter table public.cm_agent_log enable row level security;
alter table public.cm_agent_approval_queue enable row level security;

revoke all on public.cm_agent_operations, public.cm_agent_log,
  public.cm_agent_approval_queue from public, anon, authenticated;

-- Service role: full access (server-side autonomous agent always)
grant select, insert, update, delete on
  public.cm_agent_operations,
  public.cm_agent_log,
  public.cm_agent_approval_queue
  to service_role;
grant usage on all sequences in schema public to service_role;

-- cm_agent_operations: admins full, CMS staff read
create policy "CMS staff can read agent operations"
  on public.cm_agent_operations for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

create policy "Admins manage agent operations"
  on public.cm_agent_operations for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_agent_log: admins full, CMS staff read-only
create policy "CMS staff can read agent log"
  on public.cm_agent_log for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

-- cm_agent_log: system can insert, admins full access
create policy "System can insert agent log"
  on public.cm_agent_log for insert to authenticated
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- cm_agent_approval_queue: admins manage, CMS staff read
create policy "CMS staff can read approval queue"
  on public.cm_agent_approval_queue for select to authenticated
  using ((select private.has_cms_role(array['viewer', 'editor', 'admin', 'super_admin'])));

create policy "Admins manage approval queue"
  on public.cm_agent_approval_queue for all to authenticated
  using ((select private.has_cms_role(array['admin', 'super_admin'])))
  with check ((select private.has_cms_role(array['admin', 'super_admin'])));

-- ============================================================================
-- Indexes
-- ============================================================================
create index cm_agent_log_operation_idx on public.cm_agent_log(operation_id, created_at desc);
create index cm_agent_log_entity_idx on public.cm_agent_log(entity_type, entity_id) where entity_id is not null;
create index cm_agent_log_action_idx on public.cm_agent_log(action_type, created_at desc);
create index cm_agent_log_permission_idx on public.cm_agent_log(permission_tier, created_at desc);
create index cm_agent_log_status_idx on public.cm_agent_log(status, created_at asc);
create index cm_agent_log_source_idx on public.cm_agent_log(source_url);

create index cm_approval_queue_status_idx on public.cm_agent_approval_queue(status, created_at asc);
create index cm_approval_queue_field_idx on public.cm_agent_approval_queue(entity_type, field_name, status);
create index cm_approval_queue_priority_idx on public.cm_agent_approval_queue(priority_score desc, created_at desc);
create index cm_approval_queue_entity_idx on public.cm_agent_approval_queue(entity_type, entity_id) where entity_id is not null;

create index cm_agent_ops_type_idx on public.cm_agent_operations(operation_type, started_at desc);
create index cm_agent_ops_actor_idx on public.cm_agent_operations(actor_id, started_at desc);

commit;
