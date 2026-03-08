// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.red-viva.org',
  output: 'server',
  security: {
    allowedDomains: [
      { hostname: 'https://www.red-viva.org/' }, 
      { hostname: 'localhost' }
    ]
  },
  integrations: [react()],
  image: {
    domains: ['res.cloudinary.com', 'via.placeholder.com']
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});