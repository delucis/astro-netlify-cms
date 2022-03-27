// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @ts-check
import { defineConfig } from 'astro/config';
import NetlifyCMS from './integrations/netlify-cms';

export default defineConfig({
  integrations: [
    // Enable Netlify CMS integration.
    NetlifyCMS(),
  ],

  buildOptions: {
    // Use the URL provided by Netlify when building there. See:
    // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
    site: process.env.URL,
  },
});
