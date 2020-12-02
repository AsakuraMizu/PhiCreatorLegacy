import { Container, Point, Rectangle, Sprite, Texture } from 'pixi.js';
import { Emitter } from 'pixi-particles';
import type Player from './player';

export default class Judger {
  player: Player;

  container: Container;
  textures: Texture[] = [];

  constructor(player: Player) {
    this.player = player;
    this.container = new Container();
    player.app.stage.addChild(this.container);

    const btx = player.textures.Effect.baseTexture;
    btx.setResolution(1 / player.skin.effect.ratio);
    const size = player.skin.effect.size * player.skin.effect.ratio;
    const col = Math.floor(btx.width / size);
    const row = Math.floor(btx.height / size);
    for (let index = 0; index < col * row; index += 1) {
      const ir = Math.floor(index / col);
      const ic = index % col;
      const tx = new Texture(btx);
      tx._frame = new Rectangle(
        ic * size,
        ir * size,
        size,
        size,
      );
      tx.orig = tx._frame;
      tx.updateUvs();
      this.textures.push(tx);
    }
  }

  judgeAt({ x, y }: Point): void {
    let index = -1;
    let time = 0;
    const sprite = new Sprite(this.textures[0]);
    sprite.tint = this.player.skin.color;
    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    sprite.position.set(x, y);
    this.container.addChild(sprite);

    const emitter = new Emitter(this.container, this.player.textures.Particle, this.player.skin.effect.particle);
    emitter.updateSpawnPos(x, y);
    emitter.emit = true;
    emitter.update(0);
    emitter.emit = false;

    const next = (dt: number) => {
      time += dt;
      emitter.update(dt * 0.001);
      if (time >= this.player.skin.effect.duration) {
        time -= this.player.skin.effect.duration;
        index += 1;
        if (index in this.textures) {
          sprite.texture = this.textures[index];
        } else {
          sprite.destroy();
          emitter.destroy();
          this.container.removeChild(sprite);
          this.player.app.ticker.remove(next);
        }
      }
    };

    this.player.app.ticker.add(next);
  }
}
