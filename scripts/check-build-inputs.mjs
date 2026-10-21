import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const javascriptInputs = [
  'src/lib/photo-library.js',
  'public/photo-library.js',
];

for (const relativePath of javascriptInputs) {
  const filePath = resolve(relativePath);
  const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || `Syntax check failed: ${relativePath}\n`);
    process.exit(result.status ?? 1);
  }
}

const sourcePhotoLibrary = await readFile(resolve('src/lib/photo-library.js'), 'utf8');
const publicPhotoLibrary = await readFile(resolve('public/photo-library.js'), 'utf8');
if (sourcePhotoLibrary !== publicPhotoLibrary) {
  console.error('src/lib/photo-library.js and public/photo-library.js are out of sync; run node scripts/sync-photo-library.mjs.');
  process.exit(1);
}

for (const relativePath of ['content/editorial-overrides.json', 'content/local-destinations.json']) {
  try {
    JSON.parse(await readFile(resolve(relativePath), 'utf8'));
  } catch (error) {
    console.error(`Invalid build input ${relativePath}: ${error.message}`);
    process.exit(1);
  }
}

console.log('Build-input syntax, JSON, and photo-library mirror checks passed.');
