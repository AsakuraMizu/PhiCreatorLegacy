import { Sprite, Text, Texture } from 'pixi.js';
import psound from 'pixi-sound';
import Player, { DisplayOptions } from './Player';

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(<string>reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

export default async function setupUI(player: Player, { title, diff, background, music }: DisplayOptions) {
  const { width, height } = player.app.renderer;

  const tt = new Text(title, {
    fontFamily: 'Exo Regular',
    fontSize: 20,
    fill : 0xffffff,
    align : 'left',
  });
  tt.pivot.y = tt.height;
  tt.position.x = 10;
  tt.position.y = height - 10;

  const dt = new Text(diff, {
    fontFamily: 'Exo Regular',
    fontSize: 20,
    fill : 0xffffff,
    align : 'right',
  });
  dt.pivot.x = dt.width;
  dt.pivot.y = dt.height;
  dt.position.x = width - 10;
  dt.position.y = height - 10;

  const b = new Sprite(Texture.from(await getBase64(background)));
  b.position.x = width / 2;
  b.position.y = height / 2;
  b.pivot.x = b.width / 2;
  b.pivot.y = b.height / 2;
  b.alpha = 0.5;

  player.app.stage.addChild(tt, dt, b);

  const sound = psound.Sound.from(await getBase64(music));
  sound.play();
}