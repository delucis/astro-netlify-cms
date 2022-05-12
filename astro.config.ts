// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @ts-check
import { defineConfig } from 'astro/config';
import NetlifyCMS from 'astro-integration-netlify-cms';

export default defineConfig({
  integrations: [
    // Enable Netlify CMS integration.
    NetlifyCMS({
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
            // This is hidden here assuming a non-technical user will not need to
            // see or edit the `setup` front matter. You could also use a `code`
            // widget if you wanted direct access to editing the `setup` for each post.
        //     {
        //       name: 'setup',
        //       widget: 'hidden',
        //       default: `import Layout from '../../layouts/BlogPost.astro';
        // ${FrontMatterSetup}`,
        //     },
          ],
        },
      ],
    }),
  ],
});
