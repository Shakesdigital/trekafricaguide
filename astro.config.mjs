import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from './src/lib/content-repository.mjs';
import { readBuildEnv } from './src/lib/env.mjs';
import { buildSitemapPlan, isSitemapPath, serializeSitemapItem } from './scripts/sitemap-plan.mjs';

const content = await loadContent({ env: readBuildEnv() });
const sitemapPlan = buildSitemapPlan(content);

function sitemapAlias() {
  return {
    name: 'sitemap-alias',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outputDir = fileURLToPath(dir);
        await copyFile(join(outputDir, 'sitemap-0.xml'), join(outputDir, 'sitemap.xml'));
      },
    },
  };
}

export default defineConfig({
  site: 'https://trekafricaguide.com',
  output: 'static',
  outDir: './dist',
  publicDir: './public',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => isSitemapPath(page, sitemapPlan),
      serialize: (item) => serializeSitemapItem(item, sitemapPlan),
    }),
    sitemapAlias(),
  ],
});
