import React from 'react';
import * as PIXI from 'pixi.js';
import { Emitter } from 'pixi-particles';
import { PixiComponent, _ReactPixi } from '@inlet/react-pixi';

import skin from '/@/assets/skin/skin.json';
import Effect from '/@/assets/skin/Effect.png';
import Particle from '/@/assets/skin/Particle.png';

export class JudgerContainer extends PIXI.Container {
  textures: PIXI.Texture[] = [];

  emitter: Emitter;

  constructor() {
    super();

    const init = () => {
      const btx = PIXI.Loader.shared.resources[Effect].texture!.baseTexture;
      btx.setResolution(1 / skin.effect.ratio);
      const size = skin.effect.size * skin.effect.ratio;
      const col = Math.floor(btx.width / size);
      const row = Math.floor(btx.height / size);
      for (let index = 0; index < col * row; index += 1) {
        const ir = Math.floor(index / col);
        const ic = index % col;
        const tx = new PIXI.Texture(btx);
        tx._frame = new PIXI.Rectangle(ic * size, ir * size, size, size);
        tx.orig = tx._frame;
        tx.updateUvs();
        this.textures.push(tx);
      }
    };
    if (!(Effect in PIXI.Loader.shared.resources))
      PIXI.Loader.shared.add(Effect).load(init);
    else init();
    this.emitter = new Emitter(this, Particle, skin.effect.particle);
  }

  playOnce({ x, y }: { x: number; y: number }): void {
    let index = -1;
    let time = 0;

    const sprite = new PIXI.Sprite(this.textures[0]);
    sprite.tint = skin.color;
    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    sprite.position.set(x, y);
    this.addChild(sprite);

    this.emitter.updateSpawnPos(x, y);
    this.emitter.playOnce();

    const { shared: ticker } = PIXI.Ticker;

    const next = () => {
      time += ticker.elapsedMS;
      if (time >= skin.effect.duration) {
        time -= skin.effect.duration;
        index += 1;
        if (index in this.textures) {
          sprite.texture = this.textures[index];
        } else {
          this.removeChild(sprite);
          ticker.remove(next);
        }
      }
    };

    ticker.add(next);
  }

  destroy(options?: PIXI.IDestroyOptions | boolean): void {
    try {
      this.emitter.destroy();
    } catch (e) {
      /**
       * FIXME:
       * This is a temporary solution.
       * Find better way to clean up that do not use try-catch.
       */
    }
    super.destroy(options);
  }
}

export const JudgerWrapper: React.FC<
  _ReactPixi.Container<JudgerContainer>
> = PixiComponent('JudgerWrapper', {
  create() {
    return new JudgerContainer();
  },
});

export const JudgerCtx = React.createContext<React.RefObject<JudgerContainer> | null>(
  null
);
