import CMS from 'netlify-cms-app';
import CMSComponents from '../../components/cms';
import GlobalStyles from '../../styles/blog.css';
import collections from '../../collections';

CMS.init({
  config: {
    backend: {
      name: 'git-gateway',
      branch: 'latest',
    },
    local_backend: true,
    media_folder: 'public/assets/blog',
    public_folder: 'assets/blog',
    collections: collections.map(({ collection }) => collection),
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
CMS.registerPreviewStyle(GlobalStyles, { raw: true });
CMS.registerPreviewStyle(
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;700&display=swap'
);

/**
 * Register each of our collections’ preview styles and components.
 */
collections.forEach(({ component, css, collection }) => {
  CMS.registerPreviewStyle(css, { raw: true });

  CMS.registerPreviewTemplate(
    collection.name,
    ({ entry, widgetFor, getAsset }) => {
      // Netlify CMS gives us an Immutable.js object for entry data.
      // Here we convert this into a plain JS object.
      const props = entry.get('data').toJS();

      // Some data types need extra work before passing them to the component.
      collection.fields.forEach(({ name, widget }) => {
        switch (widget) {
          // Images can be in-memory before they’re uploaded, so we use the
          // `getAsset` helper to get a useable source URL.
          case 'image':
            props[name] = props[name] && getAsset(props[name]).toString();
            break;
          // The `widgetFor` helper hands us rendered Markdown content.
          // We also map fields named `body` to `children` props.
          case 'markdown':
            props[name === 'body' ? 'children' : name] = widgetFor(name);
            break;
        }
      });

      return component(props);
    }
  );
});

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

for (const Name in CMSComponents) {
  const { component, fields } = CMSComponents[Name];
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
