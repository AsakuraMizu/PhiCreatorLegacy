import { types, Instance } from 'mobx-state-tree';

const Meta = types
  .model({
    title: '',
    difficulty: '',
    artist: '',
    illustrator: '',
    charter: '',
    music: '',
    background: '',
  })
  .actions((self) => ({
    update(data: Partial<Instance<typeof self>>) {
      Object.assign(self, data);
    },
  }));

export default Meta;
