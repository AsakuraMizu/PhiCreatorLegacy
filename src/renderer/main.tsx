import React from 'react';
import { render } from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import * as PIXI from 'pixi.js';
import { install } from '@pixi/unsafe-eval';
import App from './App';
import './index.css';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

install(PIXI);

render(<App />, document.getElementById('root'));
