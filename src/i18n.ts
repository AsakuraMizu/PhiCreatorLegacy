import { getLocaleFromNavigator, init, addMessages } from 'svelte-i18n';

import en from './locales/en.json';
import zhcn from './locales/zh-CN.json';

addMessages('en', en);
addMessages('zh-CN', zhcn);

init({
  fallbackLocale: 'zh-CN',
  initialLocale: getLocaleFromNavigator(),
});
