import type { AstroIntegration } from 'astro';
import { resolve } from 'node:path';
import react from '@astrojs/react';

const widgetPath = resolve(__dirname, './identity-widget.ts');

export default function NetlifyCMS() {
  const NetlifyCMSIntegration: AstroIntegration = {
    name: 'netlify-cms',
    hooks: {
      'astro:config:setup': ({ config, injectScript, updateConfig }) => {
        updateConfig({
          buildOptions: {
            // Default to the URL provided by Netlify when building there. See:
            // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
            site: config.buildOptions.site || process.env.URL,
          },
        });

        injectScript('page', `import '${widgetPath}';`);
      },
    },
  };
  return [react(), NetlifyCMSIntegration];
}
