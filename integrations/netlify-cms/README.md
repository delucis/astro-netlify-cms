# astro-integration-netlify-cms

This is an experimental way to add Netlify CMS’s admin dashboard to any Astro
project using Astro’s Integrations API.

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
      config: {
        backend: {
          name: 'git-gateway',
          branch: 'main',
        },
        collections: [
          // Content collections
        ],
      },
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

Feeling nostalgic for WordPress? You could set this to `'/wp-admin'`!

#### `config`

**Type:** `CmsConfig`

This option is **required**. It allows you to configure Netlify CMS with the
same options you would use when using Netlify CMS’s `config.yml` file format.

You can see [a full list of configuration options in the Netlify CMS docs](https://www.netlifycms.org/docs/configuration-options/).

At a minimum, you _must_ set the `backend` and `collections` options.
