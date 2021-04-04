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
dayjs.extend(relativeTime, {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y' },
    { l: 'yy', d: 'year' },
  ],
});
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    s: '%s second',
    ss: '%s seconds',
  },
});

install(PIXI);

render(<App />, document.getElementById('root'));
