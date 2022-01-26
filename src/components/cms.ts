import type Components from '.';
import type { CMSComponent } from './types';
import { CMSAuthor } from './Author';

/**
 * This map should contain all components that a blog post might need.
 * Each component included will be available in the CMS editor as a custom
 * widget. A CMSComponent includes the React component itself as well as
 * a list of fields that the component expects to receive from the CMS.
 *
 * See the `<Author />` component for an example.
 */
const CMSComponents: Record<keyof typeof Components, CMSComponent<any>> = {
  Author: CMSAuthor,
};

export default CMSComponents;

/**
 * String to import all currently known components in setup front matter.
 * Results in something like:
 * ```js
 * import Components from '../../components';
 * const { Author, CoolComponent } = Components;
 * ```
 */
export const FrontMatterSetup = `import Layout from '../../layouts/BlogPost.astro';
import Components from '../../components';
const { ${Object.keys(CMSComponents).join(', ')} } = Components;`;
