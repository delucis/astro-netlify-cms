// This file should export all components that a blog post might need.
// Blog posts will `import { Author, ...etc } from 'here'`.

import Author, { CMSAuthor } from './Author';
import type { CMSComponent } from './types';

const Components = {
  Author,
};
export default Components;

/**
 * This map should contain all components that a blog post might need.
 * Each component included will be available in the CMS editor as a custom
 * widget. A CMSComponent includes the React component itself as well as
 * a list of fields that the component expects to receive from the CMS.
 *
 * See the `<Author />` component for an example.
 */
export const CMSComponents: Record<
  keyof typeof Components,
  CMSComponent<any>
> = {
  Author: CMSAuthor,
};

/**
 * String to import all currently known components in setup front matter.
 * Results in something like:
 * ```js
 * import Components from '../../components';
 * const { Author, CoolComponent } = Components;
 * ```
 */
export const FrontMatterSetup = `import Components from '../../components';
const { ${Object.keys(CMSComponents).join(', ')} } = Components;`;
