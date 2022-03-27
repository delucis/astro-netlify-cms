import type { AstroIntegration } from 'astro';
import react from '@astrojs/react';

export default function NetlifyCMS() {
  const NetlifyCMSIntegration: AstroIntegration = {
    name: 'netlify-cms',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        // Add Netlify Identity widget & login logic to the page bundle.
        injectScript(
          'page',
          `import identity from 'netlify-identity-widget';
          identity.on("init", user => {
            if (!user) {
              identity.on("login", () => {
                document.location.href = "/admin/";
              });
            }
          });
          identity.init();`
        );
      },
    },
  };
  return [react(), NetlifyCMSIntegration];
}
