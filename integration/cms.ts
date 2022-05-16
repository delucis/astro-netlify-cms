import type { CmsField, CmsConfig } from 'netlify-cms-core';
import CMS from 'netlify-cms-app';
import { initIdentity } from './identity-widget';

export default function initCMS({
  adminPath,
  config,
  components = {},
  previewStyles = [],
}: {
  adminPath: string;
  config: CmsConfig;
  // collections: {
  //   component;
  //   css: string;
  //   collection: CmsCollection;
  // }[];
  components: Record<
    string,
    {
      component: React.ComponentType<any>;
      fields: (CmsField & { name: keyof any })[];
    }
  >;
  previewStyles: Array<[string] | [string, { raw: boolean }]>;
}) {
  initIdentity(adminPath);

  // Provide default values given we can make a reasonable guess
  const mediaDefaults = !config.media_folder
    ? { media_folder: 'public', public_folder: '/' }
    : {};

  CMS.init({
    config: {
      // Don’t try to load config.yml as we’re providing the config below
      load_config_file: false,
      // Enable use of the Netlify CMS proxy server when working locally
      local_backend: true,
      ...mediaDefaults,
      ...config,
    },
  });

  /**
   * Another drawback of using Netlify CMS is that it registers all preview
   * styles globally — not scoped to a specific collection.
   * You’ve lost Astro component’s scoped styling anyway by being forced
   * to use React, but just be extra careful.
   *
   * The (undocumented?) `raw: true` setting treats the first argument as
   * a raw CSS string to inject instead of as a URL to load a stylesheet from.
   */
  previewStyles.forEach(([style, opts]) =>
    CMS.registerPreviewStyle(style, opts)
  );

  /**
   * Register each of our collections’ preview styles and components.
   */
  // collections.forEach(({ component, css, collection }) => {
  //   CMS.registerPreviewStyle(css, { raw: true });

  //   CMS.registerPreviewTemplate(
  //     collection.name,
  //     ({ entry, widgetFor, getAsset }) => {
  //       // Netlify CMS gives us an Immutable.js object for entry data.
  //       // Here we convert this into a plain JS object.
  //       const props = entry.get('data').toJS();

  //       // Some data types need extra work before passing them to the component.
  //       collection.fields.forEach(({ name, widget }) => {
  //         switch (widget) {
  //           // Images can be in-memory before they’re uploaded, so we use the
  //           // `getAsset` helper to get a useable source URL.
  //           case 'image':
  //             props[name] = props[name] && getAsset(props[name]).toString();
  //             break;
  //           // The `widgetFor` helper hands us rendered Markdown content.
  //           // We also map fields named `body` to `children` props.
  //           case 'markdown':
  //             props[name === 'body' ? 'children' : name] = widgetFor(name);
  //             break;
  //         }
  //       });

  //       return component(props);
  //     }
  //   );
  // });

  /**
   * Below implements the infrastructure for custom components in the Markdown
   * editor.
   *
   * Caveats:
   *   - Components MUST be block-level rather than inline
   *   - Accessing `frontmatter` is not supported.
   *   - Components MUST be imported in a post’s `setup` front matter.
   *     The default value for the hidden `setup` field above does this, but
   *     can’t update the value if new components are added after a post is
   *     created.
   *   - No `client:...` directive support yet. This should be do-able, just
   *     needs some more RegExp wrangling.
   *   - Attributes *must* be strings for now. Should be possible to support
   *     other data types eventually to some degree.
   */

  for (const Name in components) {
    const { component, fields } = components[Name];
    CMS.registerEditorComponent({
      id: Name,
      label: Name,
      fields,
      pattern: new RegExp(`^<${Name} (.*?)/>$`),
      fromBlock: (match) =>
        match[1]
          .split('" ')
          .map((attr) => attr.split('="'))
          .reduce((attrs, [attr, val]) => ({ ...attrs, [attr]: val }), {}),
      toBlock: (obj) => {
        const attrs = Object.entries(obj)
          .map(([attr, val]) => `${attr}="${val}"`)
          .join(' ');
        return `<${Name} ${attrs} />`;
      },
      toPreview: component,
    });
  }

  /**
   * Things that would be nice but are currently impossible:
   *
   * - Expression syntax:
   *   i. Netlify CMS doesn’t support creating custom inline widgets.
   *   ii. Even for a custom block widget, Netlify CMS won’t provide
   *      `frontmatter`, so you’re limited to plain JS, like `{5 * 2}`,
   *      which is not very useful. (Obviously Astro APIs are also
   *      not available in the browser.)
   */
}
