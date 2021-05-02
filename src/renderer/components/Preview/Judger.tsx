import React from 'react';
import * as PIXI from 'pixi.js';
import { Emitter } from 'pixi-particles';
import { PixiComponent, _ReactPixi } from '@inlet/react-pixi';

import skin from '/@/assets/skin/skin.json';
import Effect from '/@/assets/skin/Effect.png';
import Particle from '/@/assets/skin/Particle.png';

export class JudgerContainer extends PIXI.Container {
  textures: PIXI.Texture[] = [];

  constructor() {
    super();

    if (!(Effect in PIXI.Loader.shared.resources))
      PIXI.Loader.shared.add(Effect).load(() => {
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
      });
  }

  playOnce({ x, y }: { x: number; y: number }): void {
    let index = -1;
    let time = 0;

    const sprite = new PIXI.Sprite(this.textures[0]);
    sprite.tint = skin.color;
    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    sprite.position.set(x, y);
    this.addChild(sprite);

    const emitter = new Emitter(this, Particle, skin.effect.particle);
    emitter.updateSpawnPos(x, y);
    emitter.emit = true;
    emitter.update(0.01);
    emitter.emit = false;

    const { shared: ticker } = PIXI.Ticker;

    const next = () => {
      time += ticker.elapsedMS;
      emitter.update(ticker.elapsedMS / 1e3);
      if (time >= skin.effect.duration) {
        time -= skin.effect.duration;
        index += 1;
        if (index in this.textures) {
          sprite.texture = this.textures[index];
        } else {
          sprite.destroy();
          emitter.destroy();
          this.removeChild(sprite);
          ticker.remove(next);
        }
      }
    };

    ticker.add(next);
  }
}

export const JudgerWrapper: React.FC<
  _ReactPixi.Container<JudgerContainer>
> = PixiComponent('JudgerWrapper', {
  create() {
    return new JudgerContainer();
  },
});

export const JudgerCtx = React.createContext<JudgerContainer | null>(null);
