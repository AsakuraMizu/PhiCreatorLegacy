import { autorun, reaction } from 'mobx';
import { Container, Sprite, Text } from 'pixi.js';
import { background, meta, music, settings } from '/@/managers';
import { loadedRes, skin } from './resources';
import type Renderer from '.';

export default class UiRenderer {
  renderer: Renderer;
  container: Container;
  background: Sprite;
  prefix: Sprite;
  pause: Sprite;
  progress: Sprite;
  title: Text;
  difficulty: Text;
  combo: Text;
  label: Text;
  score: Text;
  intro: Container;
  songname: Text;
  artist: Text;
  illustrator: Text;
  charter: Text;

  constructor(renderer: Renderer) {
    this.renderer = renderer;

    this.container = new Container();
    renderer.app.stage.addChild(this.container);

    this.background = new Sprite();
    autorun(() => {
      this.background.alpha = settings.dim;
    });
    reaction(
      () => background.dirty,
      () => {
        if (background.texture) {
          this.background.texture = background.texture;
          this.background.texture.update();
          this.updateBackground();
        }
      },
      {
        fireImmediately: true,
      }
    );
    this.container.addChild(this.background);

    const {
      fontFamily,
      fill,
      fontSize,
      comboFontSize,
      scoreFontSize,
    } = skin.ui;

    this.prefix = new Sprite(loadedRes.Prefix);
    this.prefix.pivot.y = this.prefix.height;
    this.prefix.x = 15;
    this.container.addChild(this.prefix);

    this.pause = new Sprite(loadedRes.Pause);
    this.pause.x = 15;
    this.pause.y = 20;
    this.container.addChild(this.pause);

    this.progress = new Sprite(loadedRes.Progress);
    this.progress.pivot.x = this.progress.width;
    this.container.addChild(this.progress);

    this.title = new Text('', {
      fontFamily,
      fill,
      fontSize,
      align: 'left',
    });
    autorun(() => {
      this.title.text = meta.title;
      this.title.pivot.y = this.title.height;
    });
    this.title.x = 30;
    this.container.addChild(this.title);

    this.difficulty = new Text('', {
      fontFamily,
      fill,
      fontSize,
      align: 'right',
    });
    autorun(() => {
      this.difficulty.text = meta.difficulty;
      this.difficulty.pivot.x = this.difficulty.width;
      this.difficulty.pivot.y = this.difficulty.height;
    });
    this.container.addChild(this.difficulty);

    this.combo = new Text('', {
      fontFamily,
      fill,
      fontSize: comboFontSize,
    });
    this.combo.y = 10;
    this.container.addChild(this.combo);

    this.label = new Text('', {
      fontFamily,
      fill,
      fontSize,
    });
    this.label.y = 60;
    this.container.addChild(this.label);

    this.score = new Text('0000000', {
      fontFamily,
      fill,
      fontSize: scoreFontSize,
    });
    this.score.y = 20;
    this.container.addChild(this.score);

    this.intro = new Container();
    this.songname = new Text('', {
      fontFamily,
      fill,
      fontSize: comboFontSize,
      align: 'center',
    });
    autorun(() => {
      this.songname.text = meta.title;
      this.songname.pivot.x = this.songname.width / 2;
    });
    this.artist = new Text('', {
      fontFamily,
      fill,
      fontSize,
      align: 'center',
    });
    autorun(() => {
      this.artist.text = meta.artist;
      this.artist.pivot.x = this.artist.width / 2;
    });
    this.illustrator = new Text('', {
      fontFamily,
      fill,
      fontSize,
      align: 'center',
    });
    autorun(() => {
      this.illustrator.text = `Illustration designed by ${meta.illustrator}`;
      this.illustrator.pivot.x = this.illustrator.width / 2;
    });
    this.charter = new Text('', {
      fontFamily,
      fill,
      fontSize,
      align: 'center',
    });
    autorun(() => {
      this.charter.text = `Chart designed by ${meta.charter}`;
      this.charter.pivot.x = this.charter.width / 2;
    });
    this.intro.addChild(
      this.songname,
      this.artist,
      this.illustrator,
      this.charter
    );
    this.container.addChild(this.intro);

    autorun(() => {
      const { width, height } = this.renderer;

      this.prefix.y = height - 18;
      this.progress.scale.x = width / this.progress.texture.width;
      this.title.y = height - 17;
      this.difficulty.x = width - 20;
      this.difficulty.y = height - 17;
      this.combo.x = width / 2;
      this.label.x = width / 2;
      this.score.x = width - 20;
      this.songname.x = width / 2;
      this.songname.y = height * (1 / 4);
      this.artist.x = width / 2;
      this.artist.y = this.songname.y + this.songname.height + 10;
      this.illustrator.x = width / 2;
      this.illustrator.y = height * (2 / 3);
      this.charter.x = width / 2;
      this.charter.y = this.illustrator.y + this.illustrator.height + 10;
      this.updateBackground();
    });
  }

  updateBackground(): void {
    const { width, height } = this.renderer;

    this.background.x = width / 2;
    this.background.y = height / 2;
    this.background.pivot.x = this.background.texture.width / 2;
    this.background.pivot.y = this.background.texture.height / 2;
    if (this.background.texture.width !== 0) {
      const scale = Math.min(
        width / this.background.texture.width,
        height / this.background.texture.height
      );
      this.background.scale.set(scale, scale);
    }
  }

  update(): void {
    this.progress.x = music.progress * this.renderer.width;

    const { combo } = this.renderer;
    if (combo > 2) {
      this.combo.text = combo.toString();
      this.combo.pivot.x = this.combo.width / 2;
      this.label.text = 'autoplay';
      this.label.pivot.x = this.label.width / 2;
    } else {
      this.combo.text = this.label.text = '';
    }

    const score = (1e6 / this.renderer.comboList.length) * combo;
    this.score.text = Math.round(score).toString().padStart(7, '0');
    this.score.pivot.x = this.score.width;

    this.intro.alpha = Math.max(0, (0.5 - music.progress * music.duration) * 2);
  }
}
