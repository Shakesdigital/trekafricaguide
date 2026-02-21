#!/usr/bin/env bash
set -e

echo "══════════════════════════════════════════"
echo "  Trek Africa Guide — Static Build"
echo "══════════════════════════════════════════"

# ── 1. PHP dependencies ──────────────────────────────────────────────
echo ""
echo "📦 Installing Composer dependencies…"
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# ── 2. Generate app key if missing ───────────────────────────────────
if [ ! -f .env ]; then
    echo "🔑 Creating .env from .env.netlify…"
    cp .env.netlify .env
    php artisan key:generate --force
fi

# ── 3. Node dependencies & Vite build ────────────────────────────────
echo ""
echo "📦 Installing Node dependencies…"
npm ci

echo ""
echo "⚡ Building frontend assets with Vite…"
npx vite build

# ── 4. Generate static HTML ──────────────────────────────────────────
echo ""
echo "🏗  Generating static HTML pages…"
php artisan static:build

echo ""
echo "✅ Build complete! Output in /dist"
echo "══════════════════════════════════════════"
