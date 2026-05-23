import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { devContentToolsPlugin } from './dev-content-tools.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://mathematik-unterrichten.de',
  integrations: [
    tailwind(),
    mdx(),
    //sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  vite: {
    plugins: [devContentToolsPlugin(process.cwd())],
  },
});

