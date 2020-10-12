import { Container, Sprite, utils } from 'pixi.js';
import { NoteData, SpeedEventData } from './ChartData';
import Player from './Player';

function calcDist(startTime: number, endTime: number, speedEventList: SpeedEventData[]) {
  let initSpeed = 1;
  for (const e of speedEventList) {
    initSpeed = e.properties.speed;
    if (e.endTime > startTime) {
      break;
    }
  }

}

export default class NoteRender {
  sprite: Sprite | Container;
  holdHead?: Sprite;
  holdBody?: Sprite;
  holdEnd?: Sprite;
  note: NoteData;
  speedEventList: SpeedEventData[];

  baseSpeed: number;
  speed: number;

  constructor(c: Container, note: NoteData, hl: boolean, speedEventList: SpeedEventData[]) {
    this.note = note;
    this.speedEventList = speedEventList;
    this.baseSpeed = note.speed ?? 1;
    this.speed = this.baseSpeed;

    if (note.type === 'hold') {
      this.sprite = new Container();

      this.holdBody = new Sprite(utils.TextureCache['HoldBody']);
      this.holdHead = new Sprite(utils.TextureCache['HoldHead']);
      this.holdEnd = new Sprite(utils.TextureCache['HoldEnd']);
      this.sprite.addChild(this.holdHead, this.holdBody, this.holdEnd);

    } else {
      let name: string;
      switch (note.type) {
        case 'click':
          name = 'Click';
          break;
        case 'flick':
          name = 'Flick';
          break;
        case 'drag':
          name = 'Drag';
          break;
      }

      if (hl) {
        name += 'HL';
      }

      this.sprite = new Sprite(utils.TextureCache[name]);
      this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
    }

    this.sprite.position.set(Player.I.x(note.relativeX), Player.I.y(0));
    this.sprite.scale.set(Player.I.skinScale, Player.I.skinScale);

    c.addChild(this.sprite);
  }

  update() {

  }
}
