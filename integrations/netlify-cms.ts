import type { AstroIntegration } from 'astro';
import react from '@astrojs/react';

export default function NetlifyCMS() {
  const NetlifyCMSIntegration: AstroIntegration = {
    name: 'netlify-cms',
    hooks: {
    },
  };
  return [react(), NetlifyCMSIntegration];
}
