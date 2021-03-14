import { Container, Rectangle, Sprite, Texture } from 'pixi.js';
import { Emitter } from 'pixi-particles';
import { loadedRes, skin } from './resources';
import type Renderer from '.';

export default class Judger {
  textures: Texture[] = [];

  renderer: Renderer;
  container: Container;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.container = new Container();
    this.renderer.app.stage.addChild(this.container);

    const btx = loadedRes.Effect.baseTexture;
    btx.setResolution(1 / skin.effect.ratio);
    const size = skin.effect.size * skin.effect.ratio;
    const col = Math.floor(btx.width / size);
    const row = Math.floor(btx.height / size);
    for (let index = 0; index < col * row; index += 1) {
      const ir = Math.floor(index / col);
      const ic = index % col;
      const tx = new Texture(btx);
      tx._frame = new Rectangle(ic * size, ir * size, size, size);
      tx.orig = tx._frame;
      tx.updateUvs();
      this.textures.push(tx);
    }
  }

  playOnce({ x, y }: { x: number; y: number }): void {
    let index = -1;
    let time = 0;

    const sprite = new Sprite(this.textures[0]);
    sprite.tint = skin.color;
    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    sprite.position.set(x, y);
    this.container.addChild(sprite);

    const emitter = new Emitter(
      this.container,
      loadedRes.Particle,
      skin.effect.particle
    );
    emitter.updateSpawnPos(x, y);
    emitter.emit = true;
    emitter.update(0.01);
    emitter.emit = false;

    const next = () => {
      const { elapsedMS: dt } = this.renderer.app.ticker;
      time += dt;
      emitter.update(dt / 1e3);
      if (time >= skin.effect.duration) {
        time -= skin.effect.duration;
        index += 1;
        if (index in this.textures) {
          sprite.texture = this.textures[index];
        } else {
          sprite.destroy();
          emitter.destroy();
          this.container.removeChild(sprite);
          this.renderer.app.ticker.remove(next);
        }
      }
    };

    this.renderer.app.ticker.add(next);
  }
}
