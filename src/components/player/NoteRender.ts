import { Container, Sprite, Texture, Point } from 'pixi.js';
import { NoteData } from './ChartData';
import JudgeLineRender from './JudgeLineRender';
import Player from './Player';

export default class NoteRender {
  judgeLineRender: JudgeLineRender;
  player: Player;

  sprite: Sprite | Container;
  holdHead?: Sprite;
  holdEnd?: Sprite;
  holdBody?: Sprite;
  holdBodyHeight?: number;

  note: NoteData;
  baseSpeed: number;
  effectTime: number = 0;
  judged: boolean = false;

  constructor(judgeLineRender: JudgeLineRender, note: NoteData, hl: boolean) {
    this.judgeLineRender = judgeLineRender;
    this.player = judgeLineRender.player;

    this.note = note;
    this.baseSpeed = (note.speed ?? 1) * (note.side ?? 1);

    if (note.type === 'hold') {
      this.sprite = new Container();

      this.holdEnd = new Sprite(judgeLineRender.player.textures.HoldEnd);
      this.holdBody = new Sprite(judgeLineRender.player.textures.Hold);
      this.holdHead = new Sprite(judgeLineRender.player.textures.HoldHead);

      this.holdBodyHeight = this.holdBody.height;
      this.holdBody.scale.y = ((judgeLineRender.calcDist(note.endTime) - judgeLineRender.calcDist(note.startTime))
        * judgeLineRender.player.height / 2) / this.holdBodyHeight;

      this.holdBody.y = this.holdEnd.height;
      this.holdHead.y = this.holdEnd.height + this.holdBody.height;

      this.sprite.addChild(this.holdEnd, this.holdBody, this.holdHead);
      this.sprite.pivot.set(this.sprite.width / 2, this.holdEnd.height + this.holdBody.height);
    } else {
      let texture: Texture;
      switch (note.type) {
        case 'click':
          if (hl) {
            texture = judgeLineRender.player.textures.ClickHL;
          } else {
            texture = judgeLineRender.player.textures.Click;
          }
          break;
        case 'flick':
          if (hl) {
            texture = judgeLineRender.player.textures.FlickHL;
          } else {
            texture = judgeLineRender.player.textures.Flick;
          }
          break;
        case 'drag':
          if (hl) {
            texture = judgeLineRender.player.textures.DragHL;
          } else {
            texture = judgeLineRender.player.textures.Drag;
          }
          break;
      }

      this.sprite = new Sprite(texture);
      this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
    }

    this.sprite.position.x = judgeLineRender.player.calcX(note.relativeX);
    this.sprite.position.y = judgeLineRender.player.calcY(this.baseSpeed * judgeLineRender.calcDist(this.note.startTime));

    judgeLineRender.container.addChild(this.sprite);
  }

  playJudge() {
    this.player.judger.judgeAt(this.judgeLineRender.container.toGlobal({
      x: this.sprite.position.x,
      y: this.judgeLineRender.player.calcY(0),
    }));
  }

  update() {
    this.sprite.position.y = this.player.calcY(this.baseSpeed * this.judgeLineRender.calcDist(this.note.startTime));

    if (this.player.tick >= this.note.startTime) {
      if (!this.judged) {
        this.playJudge();
        const next = (dt: number) => {
          this.effectTime += dt;
          if (this.effectTime >= this.player.skin.effect.interval) {
            this.effectTime -= this.player.skin.effect.interval;
            this.playJudge();
          }
          if (this.player.tick > this.note.endTime) {
            this.player.app.ticker.remove(next);
          }
        };
        this.player.app.ticker.add(next);
      }
      if (this.note.type === 'hold') {
        this.holdBody!.scale.y = ((this.judgeLineRender.calcDist(this.note.endTime))
          * this.player.height / 2) / this.holdBodyHeight!;
        if (!this.judged) {
          this.sprite.removeChild(this.holdHead!);
        }
      }
      this.judged = true;
    }
  }
}
