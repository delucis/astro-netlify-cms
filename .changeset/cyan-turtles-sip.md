---
'astro-netlify-cms': minor
---

Add support for importing npm packages via `previewStyles` config

⚠️ **BREAKING CHANGE** ⚠️

This release changes how you import a local CSS file in `previewStyles`.
These must now be prefixed with a leading `/`:

```diff
{
  previewStyles: [
-   'src/styles/base.css',
+   '/src/styles/base.css',
  ],
}
```

This allows us to support importing CSS you may have installed from an npm module, for example importing font CSS from Fontsource:

```js
previewStyles: ['@fontsource/roboto'];
```
