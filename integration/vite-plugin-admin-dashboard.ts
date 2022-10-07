import type { CmsConfig } from 'netlify-cms-core';
import type { OutputBundle } from 'rollup';
import type { Plugin } from 'vite';
import type { PreviewStyle } from './types';

const dashboardPath = 'astro-netlify-cms/cms';

const AdminPage = ({
  adminPath,
  assets,
  config,
  previewStyles = [],
}: {
  adminPath: string;
  config: CmsConfig;
  previewStyles: Array<string | [string] | [string, { raw: boolean }]>;
  assets?: [id: string, filename: string][];
}) => {
  const imports: string[] = [];
  const styles: string[] = [];

  if (assets) {
    for (const [name, filename] of assets) {
      // At build time, pass the path of built styles straight to Netlify CMS.
      if (name.startsWith('style__')) {
        styles.push(`['/${filename}']`);
      } else {
        imports.push(`import ${name} from '/${filename}';`);
      }
    }
  } else {
    imports.push(`import cms from '${dashboardPath}';`);
  }

  previewStyles.forEach((entry, index) => {
    if (!Array.isArray(entry)) entry = [entry];
    const [style, opts] = entry;
    if (opts?.raw || style.startsWith('http')) {
      styles.push(JSON.stringify([style, opts]));
    } else if (!assets) {
      const name = `style__${index}`;
      imports.push(`import ${name} from '/${style}';`);
      styles.push(`[${name}, { raw: true }]`);
    }
  });

  return `<html lang="en">
  <head>
  <title>Content Manager</title>
  <meta
  name="description"
  content="Admin dahsboard for managing website content"
  />
  <script type="module">
  ${imports.join('\n')}
  cms({
    adminPath: '${adminPath}',
    config: JSON.parse('${JSON.stringify(config)}'),
    previewStyles: [${styles.join(',')}],
  });
  </script>
  </head>
  <body></body>
  </html>
  `;
};

export default function AdminDashboardPlugin({
  adminPath,
  config,
  previewStyles,
}: {
  adminPath: string;
  config: Omit<CmsConfig, 'load_config_file' | 'local_backend'>;
  previewStyles: PreviewStyle[];
}): Plugin {
  if (!adminPath.startsWith('/')) {
    throw new Error(
      '`adminPath` option must be a root-relative pathname, starting with "/", got "' +
        adminPath +
        '"'
    );
  }
  if (adminPath.endsWith('/')) {
    adminPath = adminPath.slice(0, -1);
  }

  let importMap: ImportMap;

  return {
    name: 'vite-plugin-netlify-cms-admin-dashboard',

    options(options) {
      let { input } = options;
      if (
        input &&
        (!Array.isArray(input) ||
          !input.includes('@astrojs-pages-virtual-entry'))
      ) {
        if (!Array.isArray(input) && typeof input !== 'object') input = [input];
        importMap = generateImportMap({
          previewStyles,
        });
        input = { ...input, ...importMap };
      }
      return { ...options, input };
    },

    configureServer({ transformIndexHtml, middlewares }) {
      middlewares.use(async (req, res, next) => {
        if (req.url === adminPath || req.url === adminPath + '/') {
          const adminPage = await transformIndexHtml(
            adminPath,
            AdminPage({
              adminPath,
              config,
              previewStyles,
            })
          );
          res.end(adminPage);
        } else {
          next();
        }
      });
    },

    generateBundle(options, bundle) {
      const dashboardChunk = Object.values(bundle).find(
        ({ name }) => name === 'cms'
      );
      if (!dashboardChunk) return;
      this.emitFile({
        type: 'asset',
        fileName: adminPath.replace(/((^\/)|(\/$))/g, '') + '/index.html',
        source: AdminPage({
          adminPath,
          assets: collectBundleAssets(bundle, importMap),
          config,
          previewStyles,
        }),
      });
    },
  };
}

interface ImportMap {
  cms: string;
  [id: `style__${number}`]: string;
}

/**
 * Generate a map of asset IDs to paths where they can be imported.
 * @returns An object like:
 * ```js
 * {
 *   cms: 'astro-netlify-cms/cms.ts',
 *   style__0: '/path/to/project/dir/path/to/style.css',
 * }
 * ```
 */
function generateImportMap({
  previewStyles,
}: {
  previewStyles: Array<string | [string] | [string, { raw: boolean }]>;
}): ImportMap {
  const imports: ImportMap = { cms: dashboardPath };
  previewStyles.forEach((entry, index) => {
    if (!Array.isArray(entry)) entry = [entry];
    const [style, opts] = entry;
    if (opts?.raw || style.startsWith('http')) return;
    imports[`style__${index}`] = `/${style}`;
  });
  return imports;
}

/**
 * Extract assets in the import map from Rollup’s bundle.
 */
function collectBundleAssets(
  bundle: OutputBundle,
  importMap: ImportMap
): [id: string, filename: string][] {
  const stripExtension = (filename: string) => filename.split('.')[0];
  return Object.values(bundle)
    .filter(
      ({ name, fileName }) =>
        !!name &&
        stripExtension(name) in importMap &&
        // Filter out non-CSS `style__` assets (a tiny JS file seems to get built for each)
        (!name.startsWith('style__') || fileName.endsWith('.css'))
    )
    .map(({ name, fileName }) => [stripExtension(name!), fileName]);
}
