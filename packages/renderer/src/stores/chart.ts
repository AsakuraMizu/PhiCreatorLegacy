import { createEffect, createEvent, createStore } from 'effector';
import { initialChart } from '../common';
import type { ChartData, Patch } from '../common';

export const chart = createStore<ChartData>(initialChart);

export const undoPool = createStore<Patch[]>([]);
export const canUndo = undoPool.map((state) => state.length > 1);
export const redoPool = createStore<Patch[]>([]);
export const canRedo = redoPool.map((state) => state.length > 0);

export const apply = createEvent<Patch>('chart apply');
export const _apply = createEvent<{
  newDocument: ChartData;
  rev: Patch;
}>('(internal)chart apply');

export const undo = createEvent('chart undo');
export const _undo = createEvent<{
  newDocument: ChartData;
  rev: Patch;
}>('(internal)chart undo');
export const redo = createEvent('chart redo');
export const _redo = createEvent<{
  newDocument: ChartData;
  rev: Patch;
}>('(internal)chart redo');

// file operations
export const fileName = 'chart.json';

export const $load = createEffect({
  name: 'load chart',
  handler: () => window.api.project.readJSON<ChartData>(fileName),
});

export const save = createEvent('save chart');
export const $save = createEffect<(params: ChartData) => Promise<void>>({
  name: 'save chart',
  handler: (params) => window.api.project.outputJSON(fileName, params),
});
