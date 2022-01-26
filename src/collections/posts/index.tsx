import type { ReactNode } from 'react';
import Author from '../../components/Author';
import { FrontMatterSetup } from '../../components';
import { CMSCollection } from '../types';
import css from './posts.css';

interface Props {
  title: string;
  author: string;
  authorURL: string;
  publishDate: string;
  heroImage: string;
  alt: string;
  children: ReactNode;
}

export function Post({
  title,
  author,
  authorURL,
  publishDate,
  heroImage,
  alt,
  children,
}: Props) {
  return (
    <div className="blog-post">
      <article className="content">
        <div>
          <header>
            {heroImage && (
              <img
                width="720"
                height="420"
                className="hero-image"
                loading="lazy"
                src={heroImage}
                alt={alt}
              />
            )}
            <p className="publish-date">{publishDate}</p>
            <h1 className="title">{title}</h1>
            <Author name={author} href={authorURL} />
          </header>
          <main>{children}</main>
        </div>
      </article>
    </div>
  );
}

const collection: CMSCollection<Props> = {
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
      default: `import Layout from '../../layouts/BlogPost.astro';
${FrontMatterSetup}`,
    },
  ],
};

export default { component: Post, css, collection };
