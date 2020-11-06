import { OldEmitterConfig } from 'pixi-particles';

export type ResourceName = 'Click' | 'ClickHL' | 'Drag' | 'DragHL' | 'Flick' | 'FlickHL' | 'Hold' | 'HoldEnd' | 'HoldHead' | 'Effect' | 'Particle' | 'Pause' | 'Prefix' | 'Progress';

export type Resources = {
  [k in ResourceName]: string;
};

export interface EffectOptions {
  ratio: number;
  size: number;
  duration: number;
  interval: number;
  particle: OldEmitterConfig;
}

export interface UiOptions {
  fontFamily: string | string[];
  fill: number;
  fontSize: number;
  comboFontSize: number;
  scoreFontSize: number;
}

export interface Skin {
  resources: Resources;
  noteRatio: number;
  effect: EffectOptions;
  ui: UiOptions;
  color: number;
}
