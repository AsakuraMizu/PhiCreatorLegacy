import { Loader } from 'pixi.js';

export async function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => resolve(<string>reader.result));
    reader.addEventListener('error', error => reject(error));
    reader.readAsDataURL(file);
  });
}

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
