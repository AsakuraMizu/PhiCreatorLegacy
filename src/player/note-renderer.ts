import { Container, Sprite, Texture } from 'pixi.js';
import type { NoteData } from '../shared/chart-data';
import type JudgeLineRenderer from './judge-line-renderer';
import type Player from './player';

export default class NoteRenderer {
  judgeLineRenderer: JudgeLineRenderer;
  player: Player;

  sprite: Sprite | Container;
  holdHead?: Sprite;
  holdEnd?: Sprite;
  holdBody?: Sprite;
  holdBodyHeight?: number;

  note: NoteData;
  baseSpeed: number;
  side: number;
  effectTime = 0;
  judged = false;

  constructor(judgeLineRenderer: JudgeLineRenderer, note: NoteData) {
    this.judgeLineRenderer = judgeLineRenderer;
    this.player = judgeLineRenderer.player;

    this.note = note;
    this.baseSpeed = (note.speed ?? 1);
    this.side = (note.side ?? 1);

    if (note.type === 'hold') {
      this.sprite = new Container();

      this.holdEnd = new Sprite(judgeLineRenderer.player.textures.HoldEnd);
      this.holdBody = new Sprite(judgeLineRenderer.player.textures.Hold);
      this.holdHead = new Sprite(judgeLineRenderer.player.textures.HoldHead);

      this.holdBodyHeight = this.holdBody.height;
      this.holdBody.scale.y = this.baseSpeed * ((judgeLineRenderer.calcDist(note.endTime) - judgeLineRenderer.calcDist(note.startTime)) *
        judgeLineRenderer.player.height / 2) / this.holdBodyHeight;

      this.holdBody.y = this.holdEnd.height;
      this.holdHead.y = this.holdEnd.height + this.holdBody.height;

      this.sprite.addChild(this.holdEnd, this.holdBody, this.holdHead);
      this.sprite.pivot.set(this.sprite.width / 2, this.holdEnd.height);
      this.sprite.scale.y = this.side;
    } else {
      const hl = this.player.timeMap[note.endTime] > 1;

      let texture: Texture;
      switch (note.type) {
        case 'click':
          texture = hl ? judgeLineRenderer.player.textures.ClickHL : judgeLineRenderer.player.textures.Click;
          break;
        case 'flick':
          texture = hl ? judgeLineRenderer.player.textures.FlickHL : judgeLineRenderer.player.textures.Flick;
          break;
        case 'drag':
          texture = hl ? judgeLineRenderer.player.textures.DragHL : judgeLineRenderer.player.textures.Drag;
          break;
        default:
          break;
      }

      this.sprite = new Sprite(texture);
      this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
    }

    this.sprite.position.x = judgeLineRenderer.player.calcX(note.relativeX);
    this.sprite.position.y = judgeLineRenderer.player.calcY(this.side * this.baseSpeed * judgeLineRenderer.calcDist(this.note.endTime));

    judgeLineRenderer.noteContainer.addChild(this.sprite);
  }

  playJudge(): void {
    if (this.player.tick < this.note.endTime + 12) {
      this.player.judger.judgeAt(this.judgeLineRenderer.noteContainer.toGlobal({
        x: this.sprite.position.x,
        y: this.judgeLineRenderer.player.calcY(0),
      }));
    }
  }

  update(): void {
    this.sprite.position.y = this.player.calcY(this.side * this.baseSpeed * this.judgeLineRenderer.calcDist(this.note.endTime));

    if (this.player.tick >= this.note.startTime) {
      if (!this.judged && !this.note.isFake) {
        this.player.audioPlayer.judge(this.note.type);
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
        this.holdBody.scale.y = this.baseSpeed * ((this.judgeLineRenderer.calcDist(this.note.endTime)) *
          this.player.height / 2) / this.holdBodyHeight;
        if (!this.judged) {
          this.sprite.removeChild(this.holdHead);
        }
      }

      this.judged = true;
    }
  }
}
