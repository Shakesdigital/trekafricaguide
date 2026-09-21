import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://trekafricaguide.com',
  output: 'static',
  outDir: './dist',
  publicDir: './public',
  trailingSlash: 'never',
});
