-- Ask Trek AI Assistant: session tracking, message log, and suggested prompts.
-- Supports the visual, contextual Ask Trek AI experience.
begin;

-- ============================================================================
-- cm_trek_sessions: tracks a traveler's Ask Trek conversation session.
-- Context captures what the traveler was viewing when they initiated the request.
-- ============================================================================
create table if not exists public.cm_trek_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text not null unique,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  context_entity_type text,
  context_entity_id bigint
);

-- ============================================================================
-- cm_trek_messages: per-message log with full AI response (structured JSON).
-- ============================================================================
create table if not exists public.cm_trek_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.cm_trek_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  query text not null,
  response jsonb,
  context_jsonb jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- cm_trek_suggested_prompts: curated prompt library for the Ask Trek interface.
-- Triggered by category and keywords when the traveler views specific content.
-- ============================================================================
create table if not exists public.cm_trek_suggested_prompts (
  id uuid primary key default gen_random_uuid(),
  prompt_text text not null,
  trigger_keywords text[],
  category text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Triggers
-- ============================================================================
create trigger cm_trek_sessions_updated_at before update on public.cm_trek_sessions
  for each row execute function public.set_updated_at();

create trigger cm_trek_prompts_updated_at before update on public.cm_trek_suggested_prompts
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Indexes
-- ============================================================================
create index if not exists cm_trek_messages_session_id_idx on public.cm_trek_messages(session_id);
create index if not exists cm_trek_messages_created_at_idx on public.cm_trek_messages(created_at);
create index if not exists cm_trek_sessions_token_idx on public.cm_trek_sessions(session_token);
create index if not exists cm_trek_sessions_context_idx on public.cm_trek_sessions(context_entity_type, context_entity_id);
create index if not exists cm_trek_prompts_category_idx on public.cm_trek_suggested_prompts(category, is_active, sort_order);
create index if not exists cm_trek_prompts_keywords_gin_idx on public.cm_trek_suggested_prompts using gin(trigger_keywords);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.cm_trek_sessions enable row level security;
alter table public.cm_trek_messages enable row level security;
alter table public.cm_trek_suggested_prompts enable row level security;

revoke all on public.cm_trek_sessions, public.cm_trek_messages, public.cm_trek_suggested_prompts from public, anon, authenticated;

-- Service role: full access (server-side mutations always)
grant select, insert, update, delete on public.cm_trek_sessions to service_role;
grant select, insert, update, delete on public.cm_trek_messages to service_role;
grant select, insert, update, delete on public.cm_trek_suggested_prompts to service_role;
grant usage on all sequences in schema public to service_role;

-- Public: read suggested prompts (used by the frontend interface)
grant select on public.cm_trek_suggested_prompts to public;

commit;
