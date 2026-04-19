<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SupabaseStorageService
{
    public function upload(?UploadedFile $file, string $directory, ?string $filenameBase = null): ?string
    {
        if (! $file) {
            return null;
        }

        return $this->supabaseConfigured()
            ? $this->uploadToSupabase($file, $directory, $filenameBase)
            : $this->uploadLocally($file, $directory, $filenameBase);
    }

    public function publicUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://', '/storage/'])) {
            return $path;
        }

        if ($this->supabaseConfigured()) {
            $base = rtrim((string) config('services.supabase.url'), '/');
            $bucket = (string) config('services.supabase.storage_bucket', 'media');

            return "{$base}/storage/v1/object/public/{$bucket}/{$path}";
        }

        return Storage::disk('public')->url($path);
    }

    private function uploadToSupabase(UploadedFile $file, string $directory, ?string $filenameBase = null): string
    {
        $path = $this->buildPath($file, $directory, $filenameBase);
        $bucket = (string) config('services.supabase.storage_bucket', 'media');
        $base = rtrim((string) config('services.supabase.url'), '/');
        $key = (string) config('services.supabase.service_role_key');

        Http::withToken($key)
            ->withHeaders([
                'x-upsert' => 'true',
                'content-type' => $file->getMimeType() ?: 'application/octet-stream',
            ])
            ->withBody(file_get_contents($file->getRealPath()), $file->getMimeType() ?: 'application/octet-stream')
            ->post("{$base}/storage/v1/object/{$bucket}/{$path}")
            ->throw();

        return $this->publicUrl($path);
    }

    private function uploadLocally(UploadedFile $file, string $directory, ?string $filenameBase = null): string
    {
        $path = $file->storeAs(
            trim($directory, '/'),
            $this->buildFilename($file, $filenameBase),
            'public'
        );

        return Storage::disk('public')->url($path);
    }

    private function buildPath(UploadedFile $file, string $directory, ?string $filenameBase = null): string
    {
        return trim($directory, '/').'/'.$this->buildFilename($file, $filenameBase);
    }

    private function buildFilename(UploadedFile $file, ?string $filenameBase = null): string
    {
        $base = Str::slug($filenameBase ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $extension = $file->getClientOriginalExtension() ?: 'bin';

        return $base.'-'.Str::lower(Str::random(8)).'.'.$extension;
    }

    private function supabaseConfigured(): bool
    {
        return filled(config('services.supabase.url'))
            && filled(config('services.supabase.service_role_key'));
    }
}
