import { getSnapshot, Instance } from 'mobx-state-tree';
import store from '../store';

class MetaManager {
  static fileName = 'meta.json';

  async load(): Promise<void> {
    const meta = await api.readJSON<Partial<Instance<typeof store.meta>>>(
      MetaManager.fileName
    );
    if (meta) store.meta.update(meta);
  }

  async save(): Promise<void> {
    await api.outputJSON(MetaManager.fileName, getSnapshot(store.meta));
  }
}

const meta = new MetaManager();

export default meta;
