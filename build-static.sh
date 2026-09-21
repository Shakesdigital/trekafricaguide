#!/usr/bin/env bash
set -euo pipefail

echo "Trek Africa Guide static build"

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

if [ ! -f .env ]; then
    echo "Creating .env from .env.netlify..."
    cp .env.netlify .env
fi

php artisan key:generate --force

echo "Preparing SQLite content database..."
mkdir -p database
touch database/database.sqlite
php artisan migrate:fresh --seed --force

echo "Installing Node dependencies..."
npm ci

echo "Building frontend assets with Vite..."
npx vite build

echo "Generating static HTML pages..."
php artisan static:build

echo "Build complete. Output in /dist"
