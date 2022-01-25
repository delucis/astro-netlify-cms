import type { CmsField } from 'netlify-cms-core';

export interface CMSComponent<P> {
  component: React.ComponentType<P>;
  fields: (CmsField & { name: keyof P })[];
}
