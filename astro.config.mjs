// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE || 'https://s5sajid.github.io',
  integrations: [sitemap({
    filter: (page) => !/^\/legal-pk(?:\/|$)/.test(new URL(page).pathname),
  })],
  vite: {
    plugins: [tailwindcss()]
  }
});