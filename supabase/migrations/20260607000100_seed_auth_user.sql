-- ============================================================
-- Seed Supabase Auth User for CMS Login
-- ============================================================
-- The static CMS (public/cms.html) authenticates via
--   supabase.auth.signInWithPassword({ email, password })
-- which checks the Supabase Auth table (auth.users), NOT
-- the custom public.users table seeded by the launch SQL.
--
-- This migration ensures an admin user exists in auth.users
-- so CMS login succeeds against the correct project.
--
-- After running this migration, you can sign in at the CMS
-- with: shakesdigital@gmail.com / root
-- ============================================================

-- Only invite if the user doesn't already exist in auth.users
do $$
declare
  admin_email text := 'shakesdigital@gmail.com';
  admin_password text := 'root';
begin
  if not exists (
    select 1 from auth.users where email = admin_email
  ) then
    insert into auth.users (
      instance_id,
      id,
      email,
      encrypted_password,
      email_confirm_at,
      confirmed_at,
      recheck,
      role,
      created_at,
      updated_at
    )
    select
      0,
      gen_random_uuid(),
      admin_email,
      crypt(admin_password, gen_salt('bf', 12)),
      now(),
      now(),
      now(),
      'authenticated',
      now(),
      now()
    where not exists (
      select 1 from auth.users where email = admin_email
    );
  end if;
end $$;
