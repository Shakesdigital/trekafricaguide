// Keep the CMS's public modules identical to the website's curated source modules.
import { copyFile } from 'node:fs/promises';
await copyFile(new URL('../src/lib/photo-library.js',import.meta.url), new URL('../public/photo-library.js',import.meta.url));
await copyFile(new URL('../src/lib/photo-defaults.mjs',import.meta.url), new URL('../public/photo-defaults.js',import.meta.url));
