import type { AstroIntegration, AstroUserConfig } from 'astro';
import type { CmsConfig } from 'netlify-cms-core';
import { spawn } from 'node:child_process';
import react from '@astrojs/react';
import AdminDashboard from './vite-plugin-admin-dashboard.js';

const widgetPath = 'astro-netlify-cms/identity-widget';

interface NetlifyCMSOptions {
  /**
   * Path at which the Netlify CMS admin dashboard should be served.
   * @default '/admin'
   */
  adminPath?: string;
  config: Omit<CmsConfig, 'load_config_file' | 'local_backend'>;
  previewStyles?: Array<string | [string] | [string, { raw: boolean }]>;
}

export default function NetlifyCMS({
  adminPath = '/admin',
  config: cmsConfig,
  previewStyles = [],
}: NetlifyCMSOptions) {
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
              AdminDashboard({
                adminPath,
                config: cmsConfig,
                previewStyles,
              }),
            ],
          },
        };
        updateConfig(newConfig);

        injectScript(
          'page',
          `import { initIdentity } from '${widgetPath}'; initIdentity('${adminPath}')`
        );
      },
      'astro:server:start': () => {
        const proxy = spawn('netlify-cms-proxy-server', { stdio: 'inherit' });
        process.on('exit', () => proxy.kill());
      },
    },
  };
  return [react(), NetlifyCMSIntegration];
}
