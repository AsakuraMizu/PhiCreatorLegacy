import { getSnapshot, Instance } from 'mobx-state-tree';
import store from '../store';

export const fileName = 'meta.json';

const meta = {
  async load(): Promise<void> {
    const meta = await api.readJSON<Partial<Instance<typeof store.meta>>>(
      fileName
    );
    if (meta) store.meta.update(meta);
  },
  async save(): Promise<void> {
    await api.outputJSON(fileName, getSnapshot(store.meta));
  },
};

export default meta;
