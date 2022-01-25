import type { ReactNode } from 'react';
import Author from './Author';
import './BlogPost.css';

export interface Props {
  title: string;
  author: string;
  authorURL: string;
  publishDate: string;
  heroImage: string;
  alt: string;
  children: ReactNode;
}

export default function BlogPost({
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
