import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FAMILIES = ['regions', 'countries', 'attractions', 'accommodations'];

export async function extractLegacyRoutes({ seederPath = 'database/seeders/TrekAfricaGuideSeeder.php', distPath = 'dist' } = {}) {
  const manifest = Object.fromEntries(FAMILIES.map((family) => [family, new Set()]));
  if (existsSync(seederPath)) {
    const source = await readFile(seederPath, 'utf8');
    for (const family of FAMILIES) {
      const body = methodBody(source, family);
      for (const slug of slugsFrom(body, family)) manifest[family].add(slug);
    }
  }
  if (existsSync(distPath)) {
    for (const family of FAMILIES) {
      const dir = join(distPath, family);
      if (!existsSync(dir)) continue;
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) manifest[family].add(entry.name);
      }
    }
  }
  return Object.fromEntries(FAMILIES.map((family) => [family, [...manifest[family]].sort()]));
}

function methodBody(source, name) {
  const start = source.indexOf(`private function ${name}(): array`);
  if (start === -1) return '';
  const next = source.indexOf('\n    private function ', start + 1);
  return source.slice(start, next === -1 ? undefined : next);
}

function slugsFrom(source, family) {
  const slugs = new Set();
  for (const match of source.matchAll(/['"]slug['"]\s*=>\s*['"]([^'"]+)['"]/g)) slugs.add(match[1]);
  const helperPatterns = {
    countries: /\$this->country\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/g,
    attractions: /\$this->attraction\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/g,
    accommodations: /\$this->stay\(\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/g,
  };
  const pattern = helperPatterns[family];
  if (pattern) {
    for (const match of source.matchAll(pattern)) slugs.add(match[1]);
  }
  return [...slugs];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = await extractLegacyRoutes();
  await mkdir(dirname('content/legacy-route-manifest.json'), { recursive: true });
  await writeFile('content/legacy-route-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(manifest, null, 2));
}
