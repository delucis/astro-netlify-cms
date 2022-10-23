import { InitCmsOptions } from './types';

export default function initCMS({
  cms,
  config,
  previewStyles = [],
}: InitCmsOptions) {
  // Provide default values given we can make a reasonable guess
  const mediaDefaults = !config.media_folder
    ? { media_folder: 'public', public_folder: '/' }
    : {};

  cms.init({
    config: {
      // Don’t try to load config.yml as we’re providing the config below
      load_config_file: false,
      // Enable use of the Netlify CMS proxy server when working locally
      local_backend: true,
      ...mediaDefaults,
      ...config,
    },
  });

  /**
   * One drawback of using Netlify CMS is that it registers all preview
   * styles globally — not scoped to a specific collection.
   * You lose Astro components’ scoped styling anyway by being forced
   * to use React, but just be extra careful.
   *
   * The (undocumented?) `raw: true` setting treats the first argument as
   * a raw CSS string to inject instead of as a URL to load a stylesheet from.
   */
  previewStyles.forEach(([style, opts]) =>
    cms.registerPreviewStyle(style, opts)
  );
}
