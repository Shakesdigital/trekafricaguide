-- Apply only to Trek Africa Guide after inspecting the target schema.
-- Native CMS tables are retained. This revisioned layer stores the complete
-- effective Git + database documents without dropping editorial-only fields.
create table public.editorial_documents (
  entity text not null check (entity in ('countries','attractions','activities','accommodations','travel_articles','local_destinations')),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  automation_baseline jsonb not null,
  conflicts jsonb not null default '{}'::jsonb,
  revision bigint not null default 1,
  status text generated always as (coalesce(content->>'status','draft')) stored,
  source_commit text not null,
  source_time timestamptz not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  primary key (entity, slug),
  check (content->>'slug' = slug),
  check (coalesce(content->>'status','draft') in ('draft','published'))
);
create table public.editorial_document_history (
  id bigint generated always as identity primary key,
  entity text not null,
  slug text not null,
  revision bigint not null,
  content jsonb not null,
  conflicts jsonb not null,
  actor uuid,
  source_commit text not null,
  saved_at timestamptz not null default now(),
  reason text not null
);
alter table public.editorial_documents enable row level security;
alter table public.editorial_document_history enable row level security;
revoke all on public.editorial_documents, public.editorial_document_history from anon, authenticated;
grant select on public.editorial_documents, public.editorial_document_history to authenticated;
grant all on public.editorial_documents, public.editorial_document_history to service_role;
grant usage, select on sequence public.editorial_document_history_id_seq to service_role;
create policy editorial_staff_read on public.editorial_documents for select to authenticated
  using ((select private.has_cms_role(array['viewer','editor','admin','super_admin'])));
create policy editorial_history_staff_read on public.editorial_document_history for select to authenticated
  using ((select private.has_cms_role(array['viewer','editor','admin','super_admin'])));

-- One transaction and a shared lock serialize imports and manual saves.
-- A field edited manually is retained. A competing automation proposal is
-- recorded for explicit review, never substituted silently.
create or replace function public.sync_editorial_documents(p_documents jsonb, p_commit text, p_source_time timestamptz)
returns setof public.editorial_documents
language plpgsql security definer set search_path = '' as $$
declare item jsonb; old public.editorial_documents; incoming jsonb; merged jsonb; issues jsonb; field text;
begin
  if coalesce(auth.role(),'') <> 'service_role' then raise exception 'Service role required'; end if;
  if jsonb_typeof(p_documents) <> 'array' or p_commit is null or p_source_time is null then raise exception 'Invalid import'; end if;
  perform pg_advisory_xact_lock(20261025, 1);
  for item in select value from jsonb_array_elements(p_documents) loop
    incoming := item->'content';
    select * into old from public.editorial_documents where entity=item->>'entity' and slug=incoming->>'slug' for update;
    if not found then
      insert into public.editorial_documents(entity,slug,content,automation_baseline,source_commit,source_time)
        values(item->>'entity',incoming->>'slug',incoming,incoming,p_commit,p_source_time);
      continue;
    end if;
    if p_source_time < old.source_time then raise exception 'An older deployment cannot replace newer editorial content'; end if;
    merged := old.content; issues := old.conflicts;
    for field in select jsonb_object_keys(old.automation_baseline || incoming) loop
      if (old.content->field) is not distinct from (old.automation_baseline->field) then
        if incoming ? field then merged := jsonb_set(merged,array[field],incoming->field,true);
        else merged := merged - field; end if;
        issues := issues - field;
      elsif (incoming->field) is not distinct from (old.content->field) then
        issues := issues - field;
      elsif (incoming->field) is distinct from (old.automation_baseline->field) then
        issues := jsonb_set(issues,array[field],jsonb_build_object('manual',old.content->field,'automation',incoming->field,'source_commit',p_commit),true);
      end if;
    end loop;
    if merged is distinct from old.content or incoming is distinct from old.automation_baseline or issues is distinct from old.conflicts then
      insert into public.editorial_document_history(entity,slug,revision,content,conflicts,actor,source_commit,reason)
        values(old.entity,old.slug,old.revision,old.content,old.conflicts,old.updated_by,old.source_commit,'before automation merge');
      update public.editorial_documents set content=merged, automation_baseline=incoming, conflicts=issues,
        revision=old.revision+1, source_commit=p_commit, source_time=p_source_time, updated_at=now(), updated_by=null
        where entity=old.entity and slug=old.slug;
    else
      update public.editorial_documents set source_time=p_source_time, source_commit=p_commit where entity=old.entity and slug=old.slug;
    end if;
  end loop;
  -- An upstream removal withdraws the page but preserves its text/history.
  -- Restoring it requires restoring its canonical source record as well.
  for old in select d.* from public.editorial_documents d where not exists (
    select 1 from jsonb_array_elements(p_documents) i where i->>'entity'=d.entity and i->'content'->>'slug'=d.slug
  ) loop
    if p_source_time < old.source_time then raise exception 'An older deployment cannot withdraw newer editorial content'; end if;
    if old.status <> 'draft' or not (old.conflicts ? '__removed') then
      insert into public.editorial_document_history(entity,slug,revision,content,conflicts,actor,source_commit,reason)
        values(old.entity,old.slug,old.revision,old.content,old.conflicts,old.updated_by,old.source_commit,'withdrawn from automation source');
      update public.editorial_documents set content=jsonb_set(old.content,'{status}','"draft"'::jsonb),
        conflicts=old.conflicts || jsonb_build_object('__removed','Canonical source record removed; restore it before republishing'),
        revision=old.revision+1,source_commit=p_commit,source_time=p_source_time,updated_at=now(),updated_by=null
        where entity=old.entity and slug=old.slug;
    end if;
  end loop;
  return query select * from public.editorial_documents;
end; $$;
revoke all on function public.sync_editorial_documents(jsonb,text,timestamptz) from public, anon, authenticated;
grant execute on function public.sync_editorial_documents(jsonb,text,timestamptz) to service_role;

create or replace function public.save_editorial_document(p_entity text,p_slug text,p_revision bigint,p_content jsonb)
returns public.editorial_documents
language plpgsql security definer set search_path = '' as $$
declare old public.editorial_documents; saved public.editorial_documents;
begin
  if not private.has_cms_role(array['editor','admin','super_admin']) then raise exception 'CMS editor access required'; end if;
  if jsonb_typeof(p_content) <> 'object' or octet_length(p_content::text) > 2097152 then raise exception 'Invalid document'; end if;
  perform pg_advisory_xact_lock(20261025,1);
  select * into old from public.editorial_documents where entity=p_entity and slug=p_slug for update;
  if not found then raise exception 'Document not found'; end if;
  if old.revision <> p_revision then raise exception 'This page changed since you opened it. Reload before saving.' using errcode='40001'; end if;
  if (p_content->'slug') is distinct from (old.content->'slug') or (p_content->'id') is distinct from (old.content->'id') then raise exception 'Record identity cannot be changed here'; end if;
  if not private.has_cms_role(array['admin','super_admin']) and
    (old.status='published' or p_content->>'status'='published') then raise exception 'An administrator must edit or publish published content'; end if;
  insert into public.editorial_document_history(entity,slug,revision,content,conflicts,actor,source_commit,reason)
    values(old.entity,old.slug,old.revision,old.content,old.conflicts,old.updated_by,old.source_commit,'before manual save');
  update public.editorial_documents set content=p_content,conflicts='{}'::jsonb,revision=old.revision+1,updated_at=now(),updated_by=auth.uid()
    where entity=p_entity and slug=p_slug returning * into saved;
  return saved;
end; $$;
revoke all on function public.save_editorial_document(text,text,bigint,jsonb) from public, anon;
grant execute on function public.save_editorial_document(text,text,bigint,jsonb) to authenticated;
