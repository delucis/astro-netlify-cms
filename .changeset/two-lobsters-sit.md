---
'astro-netlify-cms': minor
---

Don’t automatically inject `@astrojs/react` integration

⚠️ BREAKING CHANGE ⚠️

Previously, this integration included [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) and injected it to Astro’s integrations config for you. This is no longer the case.

If you are using React components and were relying on this, make sure to add the integration when upgrading. The simplest way to do this is to run:

```bash
npx astro add react
```
