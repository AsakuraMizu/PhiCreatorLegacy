import { App } from 'vue';
import hotkeys from 'hotkeys-js';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $key: typeof hotkeys;
  }
}

export default function init(app: App): void {
  hotkeys.filter = () => true;
  hotkeys('ctrl', () => { /** */ });
  app.config.globalProperties.$key = hotkeys;
}
