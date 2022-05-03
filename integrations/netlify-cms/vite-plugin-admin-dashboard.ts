import type { Plugin } from 'vite';
import * as kleur from 'kleur';

const dashboardPath = 'astro-integration-netlify-cms/cms.ts';

const AdminPage = ({ dashboardPath, adminPath }) => `<html lang="en">
<head>
  <title>Content Manager</title>
  <meta
    name="description"
    content="Web admin page for managing website content"
  />
  <script type="module">import init from '${dashboardPath}'; init({ adminPath: '${adminPath}' });</script>
</head>
<body></body>
</html>
`;

export default function AdminDashboardPlugin({
  adminPath = '/admin',
}: {
  adminPath: string;
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

    async configureServer({ transformIndexHtml, middlewares }) {
      const adminPage = await transformIndexHtml(
        adminPath,
        AdminPage({ dashboardPath, adminPath })
      );

      middlewares.use(async (req, res, next) => {
        if (req.url === adminPath || req.url === adminPath + '/') {
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
        source: AdminPage({ adminPath, dashboardPath }),
      });
    },
  };
}
