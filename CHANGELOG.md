# astro-netlify-cms

## 0.3.3

### Patch Changes

- [#38](https://github.com/delucis/astro-netlify-cms/pull/38) [`9b2802c`](https://github.com/delucis/astro-netlify-cms/commit/9b2802cb1727d9e1e2f695ad1631c71af9bb9a52) Thanks [@delucis](https://github.com/delucis)! - Restart Netlify CMS proxy server when astro.config reloads

## 0.3.2

### Patch Changes

- [#33](https://github.com/delucis/astro-netlify-cms/pull/33) [`d62b891`](https://github.com/delucis/astro-netlify-cms/commit/d62b8917f78ba7520c32ba0ba6bd32d818183c28) Thanks [@Marocco2](https://github.com/Marocco2)! - Add `disableIdentityWidgetInjection` option

- [#36](https://github.com/delucis/astro-netlify-cms/pull/36) [`c508be4`](https://github.com/delucis/astro-netlify-cms/commit/c508be466b0c46dcd9bc6897045e0b90f173b9ab) Thanks [@delucis](https://github.com/delucis)! - Fix an issue in some browsers with the rich text editor.

  Adds the workaround documented in [netlify/netlify-cms#5092](https://github.com/netlify/netlify-cms/issues/5092) to the admin dashboard.

## 0.3.2-next.0

### Patch Changes

- [#33](https://github.com/delucis/astro-netlify-cms/pull/33) [`d62b891`](https://github.com/delucis/astro-netlify-cms/commit/d62b8917f78ba7520c32ba0ba6bd32d818183c28) Thanks [@Marocco2](https://github.com/Marocco2)! - Add `disableIdentityWidgetInjection` option

## 0.3.1

### Patch Changes

- [`bd64e05`](https://github.com/delucis/astro-netlify-cms/commit/bd64e057e5df57f8e1b494336a98617fb239f5ac) Thanks [@delucis](https://github.com/delucis)! - Upgrade React dependencies

## 0.3.0

### Minor Changes

- [#30](https://github.com/delucis/astro-netlify-cms/pull/30) [`6757440`](https://github.com/delucis/astro-netlify-cms/commit/6757440b968332f0b1dc6a52ee70a6c1852f7b15) Thanks [@delucis](https://github.com/delucis)! - Refactor to use Astro’s built-in `injectRoute` helper to add the admin dashboard.

  Significantly simplifies the Vite plugin logic and should make future improvements easier to implement.

## 0.2.5

### Patch Changes

- [`013a42d`](https://github.com/delucis/astro-netlify-cms/commit/013a42d0e7d656b760283af19422c9602d83a9e3) Thanks [@delucis](https://github.com/delucis)! - Fix preview styles in production builds

## 0.2.4

### Patch Changes

- [#25](https://github.com/delucis/astro-netlify-cms/pull/25) [`eba6556`](https://github.com/delucis/astro-netlify-cms/commit/eba65563e2815242877498bf43f8a1d8b3e4f41a) Thanks [@Opposedmatty](https://github.com/Opposedmatty)! - Fix typo in description meta tag

## 0.2.3

### Patch Changes

- [#23](https://github.com/delucis/astro-netlify-cms/pull/23) [`26243d5`](https://github.com/delucis/astro-netlify-cms/commit/26243d54ebee46122053d315ad929c4636a123e2) Thanks [@codelastnight](https://github.com/codelastnight)! - remove node join() from vite-plugin-admin-dashboard to allow windows to run dev

## 0.2.2

### Patch Changes

- [`a7c4e43`](https://github.com/delucis/astro-netlify-cms/commit/a7c4e43511af695b91c0b2b19a750d769d692f98) Thanks [@delucis](https://github.com/delucis)! - Hot fix: remove comment clashing with over-eager whitespace collapsing by astro-compress

## 0.2.1

### Patch Changes

- [`cb7adcc`](https://github.com/delucis/astro-netlify-cms/commit/cb7adcc8c0a61756817449cf240efacf82cd79c1) Thanks [@delucis](https://github.com/delucis)! - Fix for compression support: end import statements with semi-colons

## 0.2.0

### Minor Changes

- [`0726494`](https://github.com/delucis/astro-netlify-cms/commit/0726494a5908a50ac859a92c7bf78f18f2399437) — Update to Astro v1 🚀

### Patch Changes

- [`f5b06ed`](https://github.com/delucis/astro-netlify-cms/commit/f5b06ed24ec3f90ed17a6dd33def80e531e9ffd3) — Run `netlify-cms-proxy-server` in shell on Windows (fixes [#13](https://github.com/delucis/astro-netlify-cms/issues/13))

## 0.1.0

Initial release
