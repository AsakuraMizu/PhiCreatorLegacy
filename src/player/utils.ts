import type { Loader } from 'pixi.js';

export async function load(loader: Loader): Promise<void> {
  return new Promise((resolve, reject) => {
    loader.onError.once(error => {
      reject(error);
    });
    loader.load(() => {
      resolve();
    });
  })
}
