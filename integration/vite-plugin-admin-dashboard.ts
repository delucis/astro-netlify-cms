import type { CmsConfig } from 'netlify-cms-core';
import type { Plugin } from 'vite';
import type { PreviewStyle } from './types';

const virtualModuleId = 'virtual:astro-netlify-cms/user-config';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

function generateVirtualConfigModule({
  config,
  previewStyles = [],
}: {
  config: CmsConfig;
  previewStyles: Array<string | [string] | [string, { raw: boolean }]>;
}) {
  const imports: string[] = [];
  const styles: string[] = [];

  previewStyles.forEach((entry, index) => {
    if (!Array.isArray(entry)) entry = [entry];
    const [style, opts] = entry;
    if (opts?.raw || style.startsWith('http')) {
      styles.push(JSON.stringify([style, opts]));
    } else {
      const name = `style__${index}`;
      imports.push(`import ${name} from '/${style}?raw';`);
      styles.push(`[${name}, { raw: true }]`);
    }
  });

  return `${imports.join('\n')}
import * as NCMS from 'netlify-cms-app';
export default {
  cms: NCMS,
  config: JSON.parse('${JSON.stringify(config)}'),
  previewStyles: [${styles.join(',')}],
};
`;
}

export default function AdminDashboardPlugin({
  config,
  previewStyles,
}: {
  config: Omit<CmsConfig, 'load_config_file' | 'local_backend'>;
  previewStyles: PreviewStyle[];
}): Plugin {
  return {
    name: 'vite-plugin-netlify-cms-admin-dashboard',

    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },

    load(id) {
      if (id === resolvedVirtualModuleId)
        return generateVirtualConfigModule({ config, previewStyles });
    },
  };
}
