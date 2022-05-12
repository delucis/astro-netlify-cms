# astro-integration-netlify-cms

This is an experimental way to add Netlify CMS’s admin dashboard to any Astro
project using the new Integrations API.

## Installation

```bash
npm i astro-integration-netlify-cms
```

## Usage

### Experimental status

Third-party integrations are currently only supported behind a flag, so you’ll
need to update your Astro scripts to include the flag:

```bash
astro dev --experimental-integrations
astro build --experimental-integrations
astro preview --experimental-integrations
```

### Adding the integration

To add Netlify CMS to your project, import and use the integration in your
Astro config file, adding it to the `integrations` array.

```js
// astro.config.mjs

import { defineConfig } from 'astro/config';
import NetlifyCMS from 'astro-integration-netlify-cms';

export default defineConfig({
  integrations: [
    NetlifyCMS({
      adminPath: '/admin',
      collections: [],
    }),
  ],
});
```

### Configuration options

You can pass an options object to the integration to configure how it behaves.

#### `adminPath`

**Type:** `string`  
**Default:** `'/admin'`

Determines the route where the Netlify CMS admin dashboard will be available on your site.

#### `collections`

**Type:** `CmsCollection[]`

This is the core of your Netlify CMS configuration and is an array of objects defining the content collections your site has.
