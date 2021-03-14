import { Loader, Texture } from 'pixi.js';

// Notes
import Drag from '/@/assets/skin/Drag.png';
import DragHL from '/@/assets/skin/DragHL.png';
import Flick from '/@/assets/skin/Flick.png';
import FlickHL from '/@/assets/skin/FlickHL.png';
import Hold from '/@/assets/skin/Hold.png';
import HoldEnd from '/@/assets/skin/HoldEnd.png';
import HoldHead from '/@/assets/skin/HoldHead.png';
import Tap from '/@/assets/skin/Tap.png';
import TapHL from '/@/assets/skin/TapHL.png';

// GUI
import Effect from '/@/assets/skin/Effect.png';
import Particle from '/@/assets/skin/Particle.png';
import Pause from '/@/assets/skin/Pause.png';
import Prefix from '/@/assets/skin/Prefix.png';
import Progress from '/@/assets/skin/Progress.png';

// Skin setting
export { default as skin } from '/@/assets/skin/skin.json';

export const rawRes = {
  Drag,
  DragHL,
  Flick,
  FlickHL,
  Hold,
  HoldEnd,
  HoldHead,
  Effect,
  Particle,
  Pause,
  Prefix,
  Progress,
  Tap,
  TapHL,
};

export const loadedRes: Record<keyof typeof rawRes, Texture> = {
  Drag: Texture.EMPTY,
  DragHL: Texture.EMPTY,
  Flick: Texture.EMPTY,
  FlickHL: Texture.EMPTY,
  Hold: Texture.EMPTY,
  HoldEnd: Texture.EMPTY,
  HoldHead: Texture.EMPTY,
  Effect: Texture.EMPTY,
  Particle: Texture.EMPTY,
  Pause: Texture.EMPTY,
  Prefix: Texture.EMPTY,
  Progress: Texture.EMPTY,
  Tap: Texture.EMPTY,
  TapHL: Texture.EMPTY,
};

export async function preload(): Promise<void> {
  if (loadedRes.Effect !== Texture.EMPTY) return;
  const loader = Loader.shared;
  Object.entries(rawRes).forEach(([name, url]) => loader.add(name, url));
  return new Promise((resolve, reject) => {
    loader.onError.add((err) => reject(err));
    loader.load(() => {
      Object.keys(rawRes).forEach((name) => {
        loadedRes[<keyof typeof rawRes>name] = loader.resources[name].texture;
      });
      resolve();
    });
  });
}
