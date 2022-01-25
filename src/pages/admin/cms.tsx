import CMS from 'netlify-cms-app';
import BlogPost from '../../components/BlogPost';
import CMSComponents from '../../components/cms';
import GlobalStyles from '../../styles/blog.css';
import BlogPostCSS from '../../components/BlogPost.css';

CMS.init({
  /**
   * This configures Netlify CMS adding a “posts” collection.
   * It might be possible to import layouts from a dedicated place
   * and auto-generate some of the fields configuration or locate
   * it alongside the layouts like is done for components below?
   */
  config: {
    backend: {
      name: 'git-gateway',
      branch: 'latest',
    },
    local_backend: true,
    media_folder: 'public/assets/blog',
    public_folder: 'assets/blog',
    collections: [
      {
        name: 'posts',
        label: 'Posts',
        label_singular: 'Post',
        folder: 'src/pages/posts',
        create: true,
        delete: true,
        fields: [
          {
            name: 'title',
            widget: 'string',
            label: 'Post Title',
          },
          {
            name: 'publishDate',
            widget: 'datetime',
            format: 'DD MMM YYYY',
            date_format: 'DD MMM YYYY',
            time_format: false,
            label: 'Publish Date',
          },
          {
            name: 'author',
            widget: 'string',
            label: 'Author Name',
          },
          {
            name: 'authorURL',
            widget: 'string',
            label: 'Author URL',
          },
          {
            name: 'description',
            widget: 'string',
            label: 'Post Description',
          },
          {
            name: 'body',
            widget: 'markdown',
            label: 'Post Body',
          },
          {
            name: 'heroImage',
            widget: 'image',
            label: 'Hero Image',
            required: false,
          },
          {
            name: 'alt',
            widget: 'string',
            label: 'Hero Image Alt Text',
            required: false,
          },
          {
            name: 'setup',
            widget: 'hidden',
            // Import all currently known components in setup front matter.
            // Results in something like:
            // `const { Author, CoolComponent } = Components;`
            default: `import Layout from '../../layouts/BlogPost.astro';
import Components from '../../components';
const { ${Object.keys(CMSComponents).join(', ')} } = Components;`,
          },
        ],
      },
    ],
  },
});

/**
 * Another drawback of using Netlify CMS is that it seems to register
 * all preview styles globally — not scoped to a specific collection.
 * You’ve lost Astro component’s scoped styling anyway by being forced
 * to use React, but just be extra careful.
 *
 * The (undocumented?) `raw: true` setting treats the first argument as
 * a raw CSS string to inject instead of as a URL to load a stylesheet from.
 *
 * As above, maybe we could auto-import layout-specific styles somehow?
 */
CMS.registerPreviewStyle(GlobalStyles, { raw: true });
CMS.registerPreviewStyle(
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;700&display=swap'
);
CMS.registerPreviewStyle(BlogPostCSS, { raw: true });

// There’s usually a little massaging needed to get the data from Netlify CMS
// into the shape of the layout component props.
CMS.registerPreviewTemplate('posts', ({ entry, widgetFor, getAsset }) => {
  const { heroImage, body, ...props } = entry.get('data').toJS();
  const heroImageSrc = heroImage && getAsset(heroImage).toString();

  return (
    <BlogPost {...{ ...props, heroImage: heroImageSrc }}>
      {widgetFor('body')}
    </BlogPost>
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
