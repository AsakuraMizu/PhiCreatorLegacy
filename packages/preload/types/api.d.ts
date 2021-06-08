import type { Api } from '../src/api';

declare global {
  interface Window {
    api: Api;
    electronRequire: NodeRequire;
  }
}
