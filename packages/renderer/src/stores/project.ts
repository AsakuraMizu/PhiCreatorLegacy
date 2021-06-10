import { createEvent, createStore } from 'effector';
import dayjs from 'dayjs';

export interface LoadOptions {
  reload?: boolean;
  quiet?: boolean;
}

export const load = createEvent<LoadOptions>('load project');
export const save = createEvent('save project');

export const editorOpen = createStore(dayjs(), { name: 'editor open time' });
export const lastSave = createStore<dayjs.Dayjs | null>(null, {
  name: 'last save time',
}).on(save, () => dayjs());
// TODO: autosave
