// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE || 'https://s5sajid.github.io',
  base: '/mono-portfolio',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});