import type CMS from 'netlify-cms-app';
import type { CmsConfig } from 'netlify-cms-core';

export type NormalizedPreviewStyle =
  | [pathOrUrl: string]
  | [rawCSS: string, meta: { raw: boolean }];

export type PreviewStyle = string | NormalizedPreviewStyle;

export interface InitCmsOptions {
  cms: typeof CMS;
  config: CmsConfig;
  previewStyles?: NormalizedPreviewStyle[];
}
