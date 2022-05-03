import { initIdentity } from './identity-widget.ts';
import '../../src/scripts/cms.ts';

export default function initCMS(opts: { adminPath: string }) {
  initIdentity(opts.adminPath);
}
