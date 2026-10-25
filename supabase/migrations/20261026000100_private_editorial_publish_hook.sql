create table private.editorial_publish_settings (
  singleton boolean primary key default true check (singleton),
  hook_url text not null check (hook_url ~ '^https://api[.]netlify[.]com/build_hooks/[a-f0-9]+$'),
  updated_at timestamptz not null default now()
);
alter table private.editorial_publish_settings enable row level security;
revoke all on private.editorial_publish_settings from public, anon, authenticated, service_role;
create or replace function public.get_editorial_publish_hook()
returns text language sql stable security definer set search_path = ''
as $$ select hook_url from private.editorial_publish_settings where singleton = true $$;
revoke all on function public.get_editorial_publish_hook() from public, anon, authenticated;
grant execute on function public.get_editorial_publish_hook() to service_role;
