begin;

select plan(20);

insert into public.profiles (id, role, display_name)
values
    ('00000000-0000-0000-0000-000000000101', 'viewer', 'RLS Viewer'),
    ('00000000-0000-0000-0000-000000000102', 'editor', 'RLS Editor'),
    ('00000000-0000-0000-0000-000000000103', 'admin', 'RLS Admin'),
    ('00000000-0000-0000-0000-000000000104', 'super_admin', 'RLS Super Admin')
on conflict (id) do update set role = excluded.role, display_name = excluded.display_name;

insert into public.page_sections (page_key, section_key, title, status, published_at)
values
    ('rls', 'published', 'Published section', 'published', now()),
    ('rls', 'draft', 'Draft section', 'draft', null)
on conflict do nothing;

set local role anon;
select is((select count(*) from public.page_sections where page_key = 'rls'), 1::bigint, 'anon reads only published content');
select throws_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'anon-write', 'draft')$$, '42501', null, 'anon cannot write CMS content');
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
set local role authenticated;
select throws_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'viewer-write', 'draft')$$, '42501', null, 'viewer cannot create CMS content');
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
set local role authenticated;
select lives_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'editor-draft', 'draft')$$, 'editor can create a draft');
select lives_ok($$update public.page_sections set title = 'Edited draft' where page_key = 'rls' and section_key = 'editor-draft'$$, 'editor can update a draft');
select is((with published as (
    update public.page_sections
    set status = 'published', published_at = now()
    where page_key = 'rls' and section_key = 'editor-draft'
    returning 1
) select count(*) from published), 0::bigint, 'editor cannot publish a draft');
select is((with deleted as (
    delete from public.page_sections
    where page_key = 'rls' and section_key = 'editor-draft'
    returning 1
) select count(*) from deleted), 0::bigint, 'editor cannot delete a draft');
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000103', true);
set local role authenticated;
select lives_ok($$insert into public.page_sections (page_key, section_key, status) values ('rls', 'admin-draft', 'draft')$$, 'admin can create content');
select lives_ok($$update public.page_sections set status = 'published', published_at = now() where page_key = 'rls' and section_key = 'admin-draft'$$, 'admin can publish content');
select lives_ok($$delete from public.page_sections where page_key = 'rls' and section_key = 'admin-draft'$$, 'admin can delete content');
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000104', true);
set local role authenticated;
select lives_ok($$insert into public.profiles (id, role, display_name) values ('00000000-0000-0000-0000-000000000105', 'viewer', 'Managed Viewer')$$, 'super admin can manage profiles');
select lives_ok($$update public.profiles set display_name = 'Managed viewer updated' where id = '00000000-0000-0000-0000-000000000105'$$, 'super admin can update profiles');
reset role;

set local role anon;
select is((select count(*) from storage.objects where bucket_id = 'media'), 0::bigint, 'anon cannot enumerate a bucket without objects');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('media', 'cms/anon.png')$$, '42501', null, 'anon cannot upload media');
reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
set local role authenticated;
select lives_ok($$insert into storage.objects (bucket_id, name) values ('media', 'cms/editor-boundary.png')$$, 'editor can upload within the media path');
reset role;
set local role anon;
select is((select count(*) from storage.objects where bucket_id = 'media' and name = 'cms/editor-boundary.png'), 1::bigint, 'anon can read a public media object');
reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
set local role authenticated;
select lives_ok($$update storage.objects set name = 'cms/editor-boundary-renamed.png' where bucket_id = 'media' and name = 'cms/editor-boundary.png'$$, 'editor can update within the media path');
select lives_ok($$delete from storage.objects where bucket_id = 'media' and name = 'cms/editor-boundary-renamed.png'$$, 'editor can delete within the media path');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('media', 'outside/editor.png')$$, '42501', null, 'editor cannot upload outside the media path');
select throws_ok($$insert into storage.objects (bucket_id, name) values ('branding', 'branding/editor.png')$$, '42501', null, 'editor cannot upload branding assets');
reset role;

select * from finish();

rollback;
