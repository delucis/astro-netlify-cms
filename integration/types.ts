export type NormalizedPreviewStyle =
  | [pathOrUrl: string]
  | [rawCSS: string, meta: { raw: boolean }];

export type PreviewStyle = string | NormalizedPreviewStyle;
