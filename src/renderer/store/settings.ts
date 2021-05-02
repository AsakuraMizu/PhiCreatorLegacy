import { types, Instance } from 'mobx-state-tree';

const Settings = types
  .model({
    fxVolume: 1.0,
    musicVolume: 1.0,
    rate: 1.0,
    dim: 0.3,
    autosave: 2,
  })
  .actions((self) => ({
    update(data: Partial<Instance<typeof self>>) {
      Object.assign(self, data);
    },
  }));

export default Settings;
