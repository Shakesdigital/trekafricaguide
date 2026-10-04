-- Additive foundation only. No content, auth, supplier, or storage policies are replaced.
-- Requires the existing public.profiles, private.has_cms_role and set_updated_at migration.
begin;

create table public.ai_task_config (
  task_type text primary key check (task_type ~ '^[a-z][a-z0-9_]{0,63}$'),
  enabled boolean not null default false,
  provider text not null check (provider ~ '^[a-z][a-z0-9_-]{0,39}$'),
  model text not null check (length(model) between 1 and 160),
  timeout_ms integer not null default 15000 check (timeout_ms between 1000 and 25000),
  max_retries integer not null default 0 check (max_retries between 0 and 2),
  max_output_tokens integer not null default 1024 check (max_output_tokens between 1 and 8192),
  cache_ttl_seconds integer not null default 0 check (cache_ttl_seconds between 0 and 3600),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger ai_task_config_updated_at before update on public.ai_task_config
  for each row execute function public.set_updated_at();

-- This is an operation ledger, not a research queue. No prompts or outputs are logged.
create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  task_type text not null check (task_type ~ '^[a-z][a-z0-9_]{0,63}$'),
  status text not null check (status in ('running','completed','failed','timed_out','cancelled','cached')),
  provider text,
  model text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms bigint check (duration_ms >= 0),
  attempts integer not null default 0 check (attempts between 0 and 3),
  input_tokens bigint check (input_tokens >= 0),
  output_tokens bigint check (output_tokens >= 0),
  usage_complete boolean not null default false,
  error_code text check (length(error_code) <= 64),
  error_message text check (length(error_message) <= 200)
);
create index ai_jobs_task_started_idx on public.ai_jobs(task_type, started_at desc);
create index ai_jobs_started_idx on public.ai_jobs(started_at);
create index ai_jobs_running_idx on public.ai_jobs(started_at) where status = 'running';

create table public.ai_request_attempts (
  job_id uuid not null references public.ai_jobs(id) on delete cascade,
  attempt integer not null check (attempt between 1 and 3),
  task_type text not null,
  provider text not null,
  model text not null,
  status text not null check (status in ('running','completed','failed','timed_out')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  input_tokens bigint check (input_tokens >= 0),
  output_tokens bigint check (output_tokens >= 0),
  http_status integer check (http_status between 100 and 599),
  error_code text check (length(error_code) <= 64),
  error_message text check (length(error_message) <= 200),
  primary key(job_id, attempt)
);
create index ai_attempts_usage_idx on public.ai_request_attempts(started_at, provider, model);

-- Cache is explicitly public-content-only but server-readable only. Keys are HMACs.
create table public.ai_cache (
  cache_key text primary key check (cache_key ~ '^[a-f0-9]{64}$'),
  result_text text not null check (length(result_text) <= 128000),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index ai_cache_expiry_idx on public.ai_cache(expires_at);

alter table public.ai_task_config enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.ai_request_attempts enable row level security;
alter table public.ai_cache enable row level security;
revoke all on public.ai_task_config, public.ai_jobs, public.ai_request_attempts, public.ai_cache from public, anon, authenticated;
grant select on public.ai_task_config, public.ai_jobs, public.ai_request_attempts to authenticated;
-- All mutations go through server validation; even administrators cannot bypass it via REST.
grant select, insert, update, delete on public.ai_task_config, public.ai_jobs, public.ai_request_attempts, public.ai_cache to service_role;
create policy ai_config_admin_read on public.ai_task_config for select to authenticated
  using ((select private.has_cms_role(array['admin','super_admin'])));
create policy ai_jobs_admin_read on public.ai_jobs for select to authenticated
  using ((select private.has_cms_role(array['admin','super_admin'])));
create policy ai_attempts_admin_read on public.ai_request_attempts for select to authenticated
  using ((select private.has_cms_role(array['admin','super_admin'])));

create function public.ai_usage_summary()
returns table(day date, task_type text, provider text, model text, operations bigint,
  cached_operations bigint, failed_operations bigint, attempts bigint,
  known_input_tokens numeric, known_output_tokens numeric, incomplete_usage_operations bigint)
language sql stable security invoker set search_path = ''
as $$
  select (j.started_at at time zone 'UTC')::date, j.task_type, j.provider, j.model,
    count(*), count(*) filter (where j.status = 'cached'),
    count(*) filter (where j.status in ('failed','timed_out','cancelled')),
    sum(j.attempts)::bigint, sum(j.input_tokens), sum(j.output_tokens),
    count(*) filter (where not j.usage_complete)
  from public.ai_jobs j where j.started_at >= now() - interval '30 days'
  group by 1, 2, 3, 4 order by 1 desc, 2;
$$;
revoke all on function public.ai_usage_summary() from public, anon, authenticated;
grant execute on function public.ai_usage_summary() to service_role;

create function public.cleanup_ai_infrastructure()
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  -- Recover interrupted invocations without pretending their provider usage was zero.
  update public.ai_request_attempts set status = 'timed_out', finished_at = now(),
    error_code = 'INTERRUPTED', error_message = 'Execution ended before audit completion.'
    where status = 'running' and started_at < now() - interval '5 minutes';
  update public.ai_jobs set status = 'timed_out', finished_at = now(), usage_complete = false,
    error_code = 'INTERRUPTED', error_message = 'Execution ended before audit completion.'
    where status = 'running' and started_at < now() - interval '5 minutes';
  delete from public.ai_cache where expires_at <= now();
  delete from public.ai_jobs where started_at < now() - interval '30 days';
end;
$$;
revoke all on function public.cleanup_ai_infrastructure() from public, anon, authenticated;
grant execute on function public.cleanup_ai_infrastructure() to service_role;

-- Deliberately no enabled tasks, API keys, models, or provider endpoints seeded.
commit;
