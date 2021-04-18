import { types } from 'mobx-state-tree';

const Preview = types
  .model({
    width: 1200,
    height: 900,
  })
  .actions((self) => ({
    updateSize(width: number, height: number) {
      self.width = width;
      self.height = height;
    },
  }));

export default Preview;
