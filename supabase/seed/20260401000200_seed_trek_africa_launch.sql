insert into public.site_settings (group_name, key, value)
values
    ('general', 'site_name', 'Trek Africa Guide'),
    ('general', 'site_tagline', 'African travel guide and booking directory for regions, destination countries, attractions, stays, dining, and trusted partner booking paths.'),
    ('branding', 'primary_color', '#284932'),
    ('branding', 'secondary_color', '#c56b3d'),
    ('branding', 'accent_color', '#c5b580'),
    ('branding', 'logo_path', '/logo to edit.png'),
    ('contact', 'contact_email', 'hello@trekafricaguide.com'),
    ('contact', 'contact_phone', '+256 700 000 000'),
    ('contact', 'contact_address', 'Kampala, Uganda'),
    ('contact', 'contact_note', 'These contact details are placeholders for launch setup and can be updated by the Trek Africa Guide team.'),
    ('seo', 'default_meta_description', 'Plan Africa travel by region and destination country, compare attractions, stays, and restaurants, then continue booking with trusted external partners.'),
    ('seo', 'default_og_image', 'image-slot:home-hero-east-africa')
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

-- Full region, destination country, attraction, accommodation, restaurant, tour-operator,
-- and page-section content is seeded from database/seeders/TrekAfricaGuideSeeder.php
-- so the Laravel-rendered app and Supabase Postgres deployment stay aligned
-- from one source of truth. Image fields intentionally use image-slot:* markers
-- until final generated or uploaded Supabase Storage assets are added.
