// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
  // Enable the React renderer to support React JSX components.
  renderers: ['@astrojs/renderer-react'],

  buildOptions: {
    // Use the URL provided by Netlify when building there. See:
    // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
    site: process.env.URL,
  },
});
