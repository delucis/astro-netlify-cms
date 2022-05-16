import { CmsCollection, CmsField } from 'netlify-cms-core';

export type CMSCollection<P> = CmsCollection & {
  fields: (CmsField & {
    name:
      | 'title'
      | 'description'
      | 'setup'
      | keyof P
      | ('children' extends keyof P ? 'body' : never);
  })[];
};
