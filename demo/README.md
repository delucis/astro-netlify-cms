# Astro Blog with Netlify CMS

This example is based on [the basic Astro blog starter kit][starter].

It adds:

- [Netlify CMS][cms] dashboard at `/admin`
- Live preview of posts in Netlify CMS
- [Local proxy server][proxy] to allow local content updates via the CMS
- Netlify Identity for authenticating with the admin app

## Quick deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][deploy]

☝️ Click this button to copy this project to your own GitHub (or GitLab)
account and set up continuous deployment with Netlify as if by magic. ✨

Once you’ve got the project set up, you do need to
[activate Netlify Identity in the Netlify UI][identity] and then enable
[“Git Gateway”][gateway] to allow e-mail/password authentication.

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Installs dependencies                              |
| `npm run dev`     | Starts local dev & Netlify CMS proxy servers       |
| `npm run build`   | Build your production site to `./dist/`            |
| `npm run preview` | Serve `./dist/` & run the Netlify CMS proxy server |

## Considerations

Netlify CMS is a single-page React app. It supports a live preview pane while
editing posts, but previews must also be React components. This means any
layouts/components that you want to preview in the CMS must be written using
React.

We can also get reasonably good preview support for components in Markdown, but
the same caveat applies: they’ve got to be React components. This project
[registers them as custom editor components][editor-components].

Astro makes it fairly simple to share our components across the site and in the
editor previews, but it does mean we opt out of some Astro benefits like
auto-scoped styles and are forced to use React (at least for things that need
previewing — this project still uses Astro components for other things).

### Blockers

- Expressions in Markdown, like `{frontmatter.value}` are not supported in live
  previews. Two blockers from Netlify CMS:

  1. [No support for custom _inline_ preview components][cms5065] (so
     expressions could work at a block-level, but not in the middle of text).

  2. Editor components can’t access other post data, so it’s not possible to
     provide variables like `frontmatter` to expressions. (More obviously,
     APIs like `Astro.request` aren’t available in the browser.)

- Component support in Markdown requires that components are imported in the
  front matter’s `setup` block. This repository suggests an architecture for
  providing components to the editor and sets a default `setup` block that
  imports all currently known components. [A bug][astro2474] in Astro means we
  can’t (currently) manage with a single `import Components` and then render
  `<Component.Button>` or `<Component.Whatever>`, but if that is fixed, this
  step can be more robust.

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│    └── ...
├── src/
│   ├── collections/       # CMS collection configurations
│   │   └── posts/
│   ├── components/
│   │   ├── index.ts       # Export custom CMS editor components
│   │   └── ...
│   ├── layouts/
│   ├── pages/
│   │   ├── admin/         # Page for the Netlify CMS admin dashboard
│   │   ├── posts/
│   │   └── ...
│   ├── scripts/
│   │   └── cms.ts         # Script that configures the CMS admin dashboard
│   └── styles/
└── package.json
```

This follows the same logic as a standard Astro project. The additional details
are:

- `src/collections` — This directory exports an array of collection
  configurations for use by the CMS. Each collection object contains the
  component used to render a collection item, its CSS, and a configuration
  object for Netlify CMS, telling it which fields it needs to edit it.

- `src/components/index.ts` — This file similarly exposes components that can
  be included in Markdown files. That means they also include configuration
  for what kind of inputs they need.

- `src/pages/admin/index.astro` — This page serves the admin dashboard for
  Netlify CMS.

- `src/scripts/cms.ts` — This script is imported by the `/admin` page and
  configures the CMS dynamically based on the components and collections
  above.

### Adding a new collection

_See `src/collections/posts/index.tsx` for an example._

1. Create a directory with the name of your collection under `src/collections`.

2. Write a component to render an item in the collection.

3. Export the component, its CSS (if any), and a collection object configuring
   it for Netlify CMS.

4. Add your collection to the export in `src/collections/index.ts`.

### Adding a new editor component

_See `src/components/Author.tsx` for an example._

1. Create a component.

2. Write a configuration object detailing the component’s inputs.

3. Add it to the `Components` and `CMSComponents` exports in
   `src/components/index.ts`.

[starter]: https://astro.new/blog?on=github
[cms]: https://www.netlifycms.org/
[proxy]: https://www.netlifycms.org/docs/beta-features/#working-with-a-local-git-repository
[deploy]: https://app.netlify.com/start/deploy?repository=https://github.com/delucis/astro-netlify-cms
[identity]: https://docs.netlify.com/visitor-access/identity/
[gateway]: https://docs.netlify.com/visitor-access/git-gateway/
[editor-components]: https://www.netlifycms.org/docs/custom-widgets/#registereditorcomponent
[cms5065]: https://github.com/netlify/netlify-cms/issues/5065
[astro2474]: https://github.com/withastro/astro/issues/2474
