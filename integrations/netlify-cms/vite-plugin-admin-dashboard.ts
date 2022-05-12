import type { CmsCollection } from 'netlify-cms-core';
import type { Plugin } from 'vite';
import * as kleur from 'kleur';

const dashboardPath = 'astro-integration-netlify-cms/cms.ts';

/**
Arguments to admin page:

globalStyles: array of `[style: string, opts?: { raw: true }]`
Get it by: integration options — list of CSS paths or URLs (or raw CSS?)
If CSS path, we need to import it to get the CSS string.
If raw CSS we need to set `{ raw true }` (maybe require that of the user).

collections: configure directly from astro.config by passing a JS object?
Collections config is YAML compatible, so should be possible to JSON.stringify/parse
to pass this in our page template.
- additional field for path preview component (& css?)

components: custom interface? defines fields & path to component import
import would happen like styles.
 */

const AdminPage = ({
  adminPath,
  collections = [],
  dashboardPath,
  globalStyles = [],
}: {
  adminPath: string;
  collections: CmsCollection[];
  dashboardPath: string;
  globalStyles: Array<[string] | [string, { raw: boolean }]>;
}) => {
  const styleImports: string[] = [];
  const styles = globalStyles.map(([style, opts], index) => {
    if (opts?.raw || style.startsWith('http')) {
      return JSON.stringify([style, opts]);
    }
    styleImports.push(`import css__${index} from '${style}';`);
    return `[css__${index}, { raw: true }]`;
  });

  return `<html lang="en">
<head>
  <title>Content Manager</title>
  <meta
    name="description"
    content="Web admin page for managing website content"
  />
  <script type="module">
    ${styleImports.join('\n')}
    import init from '${dashboardPath}';
    init({
      adminPath: '${adminPath}',
      collections: JSON.parse('${JSON.stringify(collections)}'),
      globalStyles: [${styles.join(',')}],
    });
  </script>
</head>
<body></body>
</html>
`;
};

export default function AdminDashboardPlugin({
  adminPath = '/admin',
  collections,
}: {
  adminPath: string;
  collections: CmsCollection[];
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

  return {
    name: 'vite-plugin-netlify-cms-admin-dashboard',

    options(options) {
      let { input } = options;
      if (
        options.input &&
        (!Array.isArray(options.input) ||
          !options.input.includes('@astrojs-pages-virtual-entry'))
      ) {
        const originalInput =
          Array.isArray(options.input) || typeof options.input === 'object'
            ? options.input
            : [options.input];
        input = Array.isArray(originalInput)
          ? [...originalInput, dashboardPath]
          : { ...originalInput, dashboardPath };
      }
      return { ...options, input };
    },

    configureServer({ transformIndexHtml, middlewares }) {
      middlewares.use(async (req, res, next) => {
        if (req.url === adminPath || req.url === adminPath + '/') {
          const adminPage = await transformIndexHtml(
            adminPath,
            AdminPage({ dashboardPath, adminPath, collections })
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
      console.log('\n' + kleur.green().inverse(' generating admin dashboard '));
      const dashboardPath = `/${dashboardChunk.fileName}`;
      this.emitFile({
        type: 'asset',
        fileName: adminPath.replace(/((^\/)|(\/$))/g, '') + '/index.html',
        source: AdminPage({ adminPath, dashboardPath, collections }),
      });
    },
  };
}
