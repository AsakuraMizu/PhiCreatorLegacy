import React from 'react';
import { render } from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import * as PIXI from 'pixi.js';
import { install } from '@pixi/unsafe-eval';
import App from './App';
import './index.css';

dayjs.extend(duration);
install(PIXI);

render(<App />, document.getElementById('root'));
