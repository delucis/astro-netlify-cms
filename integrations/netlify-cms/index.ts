import type { AstroIntegration, AstroUserConfig } from 'astro';
import { resolve } from 'node:path';
import react from '@astrojs/react';
import AdminDashboard from './vite-plugin-admin-dashboard';

const widgetPath = resolve(__dirname, './identity-widget.ts');

interface NetlifyCMSOptions {
  /**
   * Path at which the Netlify CMS admin dashboard should be served.
   * @default '/admin'
   */
  adminPath?: string;
}

export default function NetlifyCMS({ adminPath }: NetlifyCMSOptions = {}) {
  const NetlifyCMSIntegration: AstroIntegration = {
    name: 'netlify-cms',
    hooks: {
      'astro:config:setup': ({ config, injectScript, updateConfig }) => {
        const newConfig: AstroUserConfig = {
          // Default to the URL provided by Netlify when building there. See:
          // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
          site: config.site || process.env.URL,
          vite: {
            plugins: [
              ...(config.vite?.plugins || []),
              AdminDashboard({ adminPath }),
            ],
          },
        };
        updateConfig(newConfig);

        injectScript(
          'page',
          `import { initIdentity } from '${widgetPath}'; initIdentity('${adminPath}')`
        );
      },
    },
  };
  return [react(), NetlifyCMSIntegration];
}
