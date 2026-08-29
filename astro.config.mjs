import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { devContentToolsPlugin } from './dev-content-tools.mjs';
import { rehypeTabellenScroll } from './src/lib/rehypeTabellenScroll.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://mathematik-unterrichten.de',
  integrations: [
    tailwind(),
    mdx(),
    // Sitemap: eigener Endpunkt src/pages/sitemap.xml.ts (liefert echte lastmod-Daten
    // aus den Content-Collections; @astrojs/sitemap 3.7 setzt Astro 5 voraus).
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeTabellenScroll],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  vite: {
    plugins: [devContentToolsPlugin(process.cwd())],
  },
});

