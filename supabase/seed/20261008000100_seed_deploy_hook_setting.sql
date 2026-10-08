-- Seed: Netlify deploy hook for static site rebuilds.
-- Astro is a static site generator (SSG). When content is published via the
-- CMS, the Supabase database is updated, but the pre-built static HTML in dist/
-- does not reflect the new data until the site is rebuilt.
--
-- This seed inserts a `netlify_deploy_hook` setting into site_settings.
-- After configuring the deploy hook in the Netlify dashboard (Site settings >
-- Build & deploy > Build hooks), paste the deploy hook URL from Netlify
-- into the Netlify environment variable NETLIFY_DEPLOY_HOOK, then run
-- the following SQL to store it in site_settings:
--
--   update public.site_settings
--     set value = current_setting('netlify.deploy_hook', true)
--   where key = 'netlify_deploy_hook';
--
-- In development, the value stays null — the rebuild trigger no-ops silently.

insert into public.site_settings (group_name, key, value, created_at, updated_at)
values
  ('deployment', 'netlify_deploy_hook', null, now(), now())
on conflict (key) do update
  set group_name = excluded.group_name,
      value = excluded.value,
      updated_at = now();
