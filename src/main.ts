import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import '@icon-park/vue-next/styles/index.css';
import 'ant-design-vue/dist/antd.css';
import './index.css';

const app = createApp(App);

app.use(Antd);

app.mount('#app');
