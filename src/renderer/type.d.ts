import type { ExposedInMainWorld } from '../preload';

declare global {
  const electron: ExposedInMainWorld;
}
