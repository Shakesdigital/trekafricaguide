begin;

select plan(20);

select tests.create_supabase_user('cms-viewer@example.com');
select tests.create_supabase_user('cms-editor@example.com');
select tests.create_supabase_user('cms-admin@example.com');
select tests.create_supabase_user('cms-super-admin@example.com');
select tests.create_supabase_user('cms-managed@example.com');
select tests.authenticate_as_service_role();

insert into public.profiles (id, role, display_name)
values
    (tests.get_supabase_uid('cms-viewer@example.com'), 'viewer', 'RLS Viewer'),
    (tests.get_supabase_uid('cms-editor@example.com'), 'editor', 'RLS Editor'),
    (tests.get_supabase_uid('cms-admin@example.com'), 'admin', 'RLS Admin'),
    (tests.get_supabase_uid('cms-super-admin@example.com'), 'super_admin', 'RLS Super Admin')
on conflict (id) do update set role = excluded.role, display_name = excluded.display_name;

select fk_ok('public', 'profiles', 'id', 'auth', 'users', 'id', 'profiles are anchored to Auth users');

insert into public.page_sections (page_key, section_key, title, status, published_at)
values ('rls', 'published', 'Published section', 'published', now()), ('rls', 'draft', 'Draft section', 'draft', null)
on conflict do nothing;

insert into public.districts (country_id, slug, name)
select id, 'rls-district', 'RLS district' from public.countries where slug = 'uganda'
on conflict (country_id, slug) do update set name = excluded.name;

set local role anon;
select is((select count(*) from public.page_sections where page_key = 'rls'), 1::bigint, 'anon reads only published content');
select throws_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'anon-write', 'draft')$$, '42501', null, 'anon cannot write CMS content');
select throws_ok($$select * from public.users$$, '42501', null, 'anon cannot read legacy users');
reset role;

select tests.authenticate_as('cms-viewer@example.com');
select is((select count(*) from public.page_sections where page_key = 'rls'), 2::bigint, 'viewer can inspect draft content');
select throws_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'viewer-write', 'draft')$$, '42501', null, 'viewer cannot create CMS content');

select tests.authenticate_as('cms-editor@example.com');
select lives_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'editor-draft', 'draft')$$, 'editor can create a draft');
select lives_ok($$update public.page_sections set title = 'Edited draft' where page_key = 'rls' and section_key = 'editor-draft'$$, 'editor can update a draft');
select is((with published as (update public.page_sections set status = 'published', published_at = now() where page_key = 'rls' and section_key = 'editor-draft' returning 1) select count(*) from published), 0::bigint, 'editor cannot publish a draft');
select is((with deleted as (delete from public.page_sections where page_key = 'rls' and section_key = 'editor-draft' returning 1) select count(*) from deleted), 0::bigint, 'editor cannot delete a draft');
select lives_ok($$insert into public.booking_offers (offerable_type, offerable_id, provider, label, active) values ('rls', 9001, 'test', 'Draft offer', false)$$, 'editor can create a draft booking offer');
select lives_ok($$update public.booking_offers set label = 'Edited draft offer' where offerable_type = 'rls' and offerable_id = 9001 and provider = 'test'$$, 'editor can update a draft booking offer');
select is((with deleted as (delete from public.districts where slug = 'rls-district' returning 1) select count(*) from deleted), 0::bigint, 'editor cannot delete a district');
select lives_ok($$insert into storage.objects (bucket_id, name) values ('media', 'regions/east-africa/hero.png')$$, 'editor can upload a media object at the documented path');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('media', 'cms/editor.png')$$, '42501', null, 'editor cannot upload outside documented media paths');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('branding', 'logos/editor.svg')$$, '42501', null, 'editor cannot upload branding assets');

select tests.authenticate_as('cms-admin@example.com');
select lives_ok($$update public.page_sections set status = 'published', published_at = now() where page_key = 'rls' and section_key = 'editor-draft'$$, 'admin can publish content');
select lives_ok($$delete from public.page_sections where page_key = 'rls' and section_key = 'editor-draft'$$, 'admin can delete content');
select lives_ok($$insert into storage.objects (bucket_id, name) values ('branding', 'logos/trek-africa-guide.svg')$$, 'admin can upload branding logos');

select tests.authenticate_as('cms-super-admin@example.com');
select lives_ok($$insert into public.profiles (id, role, display_name) values (tests.get_supabase_uid('cms-managed@example.com'), 'viewer', 'Managed Viewer')$$, 'super admin can manage Auth-backed profiles');

select * from finish();

rollback;
