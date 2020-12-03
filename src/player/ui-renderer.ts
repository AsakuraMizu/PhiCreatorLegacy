import { Container, Loader, Sprite, Text } from 'pixi.js';
import type Player from './player';
import type { PreviewOptions } from './player';
import { load } from './utils';

export default class UiRenderer {
  player: Player;
  container: Container;

  hintText!: Text;
  comboText!: Text;
  scoreText!: Text;
  progressBar!: Sprite;

  score = 0;

  constructor(player: Player) {
    this.player = player;

    this.container = new Container();
    player.app.stage.addChild(this.container);
  }

  async setup({ title, diff, background }: PreviewOptions): Promise<void> {
    const { width, height } = this.player;
    const { fontFamily, fill, fontSize, comboFontSize, scoreFontSize } = this.player.skin.ui;

    if (background) {
      const loader = new Loader();
      loader.add(background);
      await load(loader);

      const back = new Sprite(loader.resources[background].texture);
      back.pivot.x = back.width / 2;
      back.pivot.y = back.height / 2;
      back.position.x = width / 2;
      back.position.y = height / 2;
      back.alpha = 0.3;
      const scale = Math.min(width / back.width, height / back.height);
      back.scale.set(scale, scale);

      this.container.addChild(back);
    }

    const prefix = new Sprite(this.player.textures.Prefix);
    prefix.pivot.y = prefix.height;
    prefix.position.x = 20;
    prefix.position.y = height - 25;
    this.container.addChild(prefix);

    const pause = new Sprite(this.player.textures.Pause);
    pause.position.x = 20;
    pause.position.y = 25;
    this.container.addChild(pause);

    this.progressBar = new Sprite(this.player.textures.Progress);
    this.progressBar.pivot.x = this.progressBar.width;
    this.progressBar.scale.x = width / this.progressBar.width;
    this.container.addChild(this.progressBar);

    const titleText = new Text(title, {
      fontFamily,
      fill,
      fontSize,
      align: 'left',
    });
    titleText.pivot.y = titleText.height;
    titleText.position.x = 40;
    titleText.position.y = height - 20;
    this.container.addChild(titleText);

    const diffText = new Text(diff, {
      fontFamily,
      fill,
      fontSize,
      align: 'right',
    });
    diffText.pivot.x = diffText.width;
    diffText.pivot.y = diffText.height;
    diffText.position.x = width - 30;
    diffText.position.y = height - 20;
    this.container.addChild(diffText);

    const hintText = new Text('', {
      fontFamily,
      fill,
      fontSize,
    });
    hintText.pivot.x = hintText.width / 2;
    hintText.position.x = width / 2;
    hintText.position.y = 60;
    this.container.addChild(hintText);
    this.hintText = hintText;

    const comboText = new Text('', {
      fontFamily,
      fill,
      fontSize: comboFontSize,
    });
    comboText.pivot.x = comboText.width / 2;
    comboText.position.x = width / 2;
    comboText.position.y = 10;
    this.container.addChild(comboText);
    this.comboText = comboText;

    const scoreText = new Text('0000000', {
      fontFamily,
      fill,
      fontSize: scoreFontSize,
    });
    scoreText.pivot.x = scoreText.width;
    scoreText.position.x = width - 20;
    scoreText.position.y = 20;
    this.container.addChild(scoreText);
    this.scoreText = scoreText;
  }

  update(): void {
    const { combo, comboTotal } = this.player;

    if (combo > 2) {
      this.hintText.text = 'autoplay';
      this.hintText.pivot.x = this.hintText.width / 2;
      this.comboText.text = combo.toString();
      this.comboText.pivot.x = this.comboText.width / 2;
    }

    this.score = 1000000 / comboTotal * combo;
    this.scoreText.text = Math.round(this.score).toString().padStart(7, '0');

    this.progressBar.position.x = this.player.width * this.player.audioPlayer.progress;
  }
}
