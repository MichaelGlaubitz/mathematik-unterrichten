import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { devContentToolsPlugin } from './dev-content-tools.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://mathematik-unterrichten.de',
  integrations: [
    tailwind(),
    mdx(),
    //sitemap(),
  ],
  vite: {
    plugins: [devContentToolsPlugin(__dirname)],
    envPrefix: ['PUBLIC_', 'ADMIN_EDIT_'],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
