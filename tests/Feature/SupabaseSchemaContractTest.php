<?php

namespace Tests\Feature;

use Tests\TestCase;

class SupabaseSchemaContractTest extends TestCase
{
    private const MIGRATION = 'supabase/migrations/20260830000100_harden_cms_content_and_roles.sql';

    private const SEED = 'supabase/seed/20260830000200_seed_cms_content_and_media.sql';

    public function test_cms_migration_exposes_only_published_content_and_role_bound_writes(): void
    {
        $migration = $this->read(self::MIGRATION);

        foreach ([
            'create table if not exists public.profiles',
            "check (role in ('super_admin', 'admin', 'editor', 'viewer'))",
            'alter table public.profiles enable row level security',
            'alter table public.regions enable row level security',
            'alter table public.media_assets enable row level security',
            'revoke all on table public.profiles from anon, authenticated',
            'grant select on table public.regions to anon, authenticated',
            "status = ''published''",
            "published_at <= now()",
            'for update to authenticated',
            'using (',
            'with check (',
            'create schema if not exists private',
            'security definer',
            "set search_path = ''",
            'revoke execute on function private.has_cms_role(text[]) from public',
        ] as $required) {
            $this->assertStringContainsString($required, $migration);
        }
    }

    public function test_cms_migration_limits_storage_operations_by_role_and_path(): void
    {
        $migration = $this->read(self::MIGRATION);

        foreach ([
            "('media', 'media', true)",
            "('branding', 'branding', true)",
            'on storage.objects',
            'for select',
            'for insert',
            'for update',
            'for delete',
            'storage.foldername(name)',
            "bucket_id = 'media'",
            "bucket_id = 'branding'",
        ] as $required) {
            $this->assertStringContainsString($required, $migration);
        }
    }

    public function test_cms_migration_does_not_embed_unsafe_authorization_or_credentials(): void
    {
        $migration = $this->read(self::MIGRATION);

        foreach (['user_metadata', 'password', 'service_role', 'pmskfhfxnhkpiaykgnra'] as $forbidden) {
            $this->assertStringNotContainsString($forbidden, strtolower($migration));
        }
    }

    public function test_seed_uses_stable_catalogue_and_media_identifiers_without_auth_users(): void
    {
        $seed = $this->read(self::SEED);

        foreach ([
            'insert into public.regions',
            'on conflict (slug) do update',
            'insert into public.media_assets',
            'source_page',
            'on conflict (mediable_type, mediable_id, role, source_page) do update',
        ] as $required) {
            $this->assertStringContainsString($required, $seed);
        }

        $this->assertStringNotContainsString('auth.users', strtolower($seed));
        $this->assertStringNotContainsString('20260607000100_seed_auth_user.sql', $seed);
    }

    private function read(string $relativePath): string
    {
        $path = base_path($relativePath);

        $this->assertFileExists($path);

        return (string) file_get_contents($path);
    }
}
