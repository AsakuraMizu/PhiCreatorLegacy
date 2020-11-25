import { createApp } from 'vue';
import App from './App.vue';

import key from './key';
import store from './store';

import Antd from 'ant-design-vue';
import { createI18n } from 'vue-i18n';

import '@icon-park/vue-next/styles/index.css';
import 'ant-design-vue/dist/antd.css';
import './index.css';

const app = createApp(App);
const i18n = createI18n({
  legacy: false,
  locale: 'zh',
});

app.use(key);
app.use(store);

app.use(Antd);
app.use(i18n);

app.mount('#app');
