insert into public.site_settings (group_name, key, value)
values
    ('general', 'site_name', 'Trek Africa Guide'),
    ('general', 'site_tagline', 'African travel guide and booking directory for regions, countries, attractions, stays, dining, and trusted partner booking paths.'),
    ('branding', 'primary_color', '#284932'),
    ('branding', 'secondary_color', '#c56b3d'),
    ('branding', 'accent_color', '#c5b580'),
    ('branding', 'logo_path', '/logo to edit.png'),
    ('seo', 'default_meta_description', 'Plan Africa travel by region and country, compare attractions, stays, and restaurants, then continue booking with trusted external partners.')
on conflict (key) do update
set group_name = excluded.group_name,
    value = excluded.value,
    updated_at = now();

insert into public.users (name, email, password, role, email_verified_at)
values (
    'Trek Africa Guide Admin',
    'admin@trekafricaguide.com',
    '$2y$12$djqPCZrhrI4tkQ0L2.2OjekCkOFCMAbuExUbep4Q3CfTPPoXuPVQ.',
    'admin',
    now()
)
on conflict (email) do update
set name = excluded.name,
    role = excluded.role,
    email_verified_at = excluded.email_verified_at,
    updated_at = now();

-- Full content data is seeded from Laravel via database/seeders/TrekAfricaGuideSeeder.php
-- so the application and Supabase stay aligned from one source of truth.
