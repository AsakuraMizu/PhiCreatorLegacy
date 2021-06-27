// import 'normalize.css';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

import './stores/init';

import App from './App.svelte';
import './index.css';

const app = new App({
  target: document.getElementById('app') || document.body,
});

export default app;
