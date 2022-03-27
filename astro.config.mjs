// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    // Enable the React renderer to support React JSX components.
    react(),
  ],

  buildOptions: {
    // Use the URL provided by Netlify when building there. See:
    // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
    site: process.env.URL,
  },
});
