import { guard, sample } from 'effector';
import { superPatch } from '../common';
import type { Patch} from '../common';
import {
  chart,
  $load,
  save,
  $save,
  apply,
  _apply,
  undoPool,
  redoPool,
  undo,
  canUndo,
  _undo,
  redo,
  canRedo,
  _redo,
} from './chart';

// apply
sample({
  clock: apply,
  source: chart,
  fn: (chart, patch) => superPatch(chart, patch),
  target: _apply,
});

chart.on(_apply, (_, { newDocument }) => newDocument);
undoPool.on(_apply, (state, { rev }) => [...state, rev]);
redoPool.on(_apply, () => []);

// undo
const safeUndo = guard({
  clock: undo,
  source: undoPool,
  filter: canUndo,
});
sample({
  clock: safeUndo,
  source: chart,
  fn: (chart, pool) => superPatch(chart, pool[pool.length - 1]),
  target: _undo,
});

chart.on(_undo, (_, { newDocument }) => newDocument);
undoPool.on(_undo, (state) => [...state.slice(0, -1)]);
redoPool.on(_undo, (state, { rev }) => [...state, rev]);

// redo
const safeRedo = guard({
  clock: redo,
  source: redoPool,
  filter: canRedo,
});
sample({
  clock: safeRedo,
  source: chart,
  fn: (chart, pool) => superPatch(chart, pool[pool.length - 1]),
  target: _redo,
});

chart.on(_redo, (_, { newDocument }) => newDocument);
undoPool.on(_redo, (state, { rev }) => [...state, rev]);
redoPool.on(_redo, (state) => [...state.slice(0, -1)]);

// load
sample({
  clock: $load.doneData,
  fn: (data): Patch => [{ op: 'replace', path: '', value: data }],
  target: apply,
});

// save
sample({
  source: chart,
  clock: save,
  target: $save,
});
