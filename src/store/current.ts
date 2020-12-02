import { derived } from 'svelte/store';
import chart from './chart';
import { local } from './utils';
import { calcTick } from '../shared/tick';

export const currentLineIndex = local('currentLineIndex', -1);

export const currentNoteIndex = local('currentNoteIndex', -1);

export const currentEventIndex = local('currentEventIndex', -1);

export const currentBpmIndex = local('currentBpmIndex', -1);

export const currentTab = local('currentTab', 0);

export const currentTime = local('currentTime', 0);

export const currentTick = derived([chart, currentTime], ([$chart, $currentTime]) => calcTick($chart.timing, $currentTime));
