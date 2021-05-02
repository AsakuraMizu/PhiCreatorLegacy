import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { control, music, project } from '/@/managers';
import store from '../store';

export default observer(function Hotkeys() {
  useHotkeys('space', (e) => {
    e.preventDefault();
    if (music.loaded) music.toggle();
  });
  useHotkeys('alt+r', () => {
    project.reload();
  });
  useHotkeys('alt+f', () => {
    control.toggleFull();
  });
  useHotkeys('ctrl+s', () => {
    project.save();
  });
  useHotkeys('ctrl+z', () => {
    store.chart.history.canUndo && store.chart.history.undo();
  });
  useHotkeys('ctrl+y', () => {
    store.chart.history.canRedo && store.chart.history.redo();
  });
  useHotkeys('esc', () => {
    if (control.full) control.toggleFull();
  });
  useHotkeys('esc', () => {
    if (control.full) control.toggleFull();
  });

  return <></>;
});
