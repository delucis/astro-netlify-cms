import type { AstroIntegration } from 'astro';
import { resolve } from 'node:path';
import react from '@astrojs/react';

const widgetPath = resolve(__dirname, './identity-widget.ts');

export default function NetlifyCMS() {
  const NetlifyCMSIntegration: AstroIntegration = {
    name: 'netlify-cms',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page', `import '${widgetPath}';`);
      },
    },
  };
  return [react(), NetlifyCMSIntegration];
}
