import { Container, Graphics, Point } from 'pixi.js';
import { Cull } from '@pixi-essentials/cull';
import { ConstructEventData, FadeEventData, JudgeLineData, MoveEventData, RotateEventData, SpeedEventData } from './ChartData';
import { EaseCalc, EaseSumCalc } from './Easing';
import NoteRender from './NoteRender';
import Player from './Player';

export default class JudgeLineRender {
  player: Player;

  container: Container;
  notes: NoteRender[] = [];
  line: Graphics;
  cull: Cull;

  constructEvent: ConstructEventData;
  moveEventList: MoveEventData[] = [];
  rotateEventList: RotateEventData[] = [];
  fadeEventList: FadeEventData[] = [];
  speedEventList: SpeedEventData[] = [];

  prevPosition: Point;
  prevRotation: number;
  prevAlpha: number;
  prevSpeed: number;

  combo: number = 0;

  constructor(player: Player, judgeLine: JudgeLineData) {
    this.player = player;

    this.constructEvent = {
      id: -1,
      type: 'construct',
      startTime: 0,
      endTime: -1,
      properties: {
        x: 0,
        y: 0,
        angle: 0,
        alpha: 1,
        speed: 0.1,
      },
    };

    judgeLine.eventList.sort((a, b) => a.startTime - b.startTime);
    judgeLine.eventList.forEach(e => {
      switch (e.type) {
        case 'construct':
          this.constructEvent = e;
          break;
        case 'move':
          this.moveEventList.push(e);
          break;
        case 'rotate':
          this.rotateEventList.push(e);
          break;
        case 'fade':
          this.fadeEventList.push(e);
          break;
        case 'speed':
          this.speedEventList.push(e);
          break;
      }
    });

    this.container = new Container();
    this.container.position.set(player.calcX(this.constructEvent.properties.x), player.calcY(this.constructEvent.properties.y));
    this.container.pivot.set(player.calcX(0), player.calcY(0));
    this.container.rotation = this.constructEvent.properties.angle;
    player.app.stage.addChild(this.container);

    this.prevPosition = this.container.position;
    this.prevRotation = this.container.rotation;
    this.prevAlpha = this.container.alpha;
    this.prevSpeed = this.constructEvent.properties.speed;

    this.line = new Graphics();
    this.line.lineStyle(3, player.skin.color, this.constructEvent.properties.alpha);
    this.line.moveTo(player.calcX(-2), 0);
    this.line.lineTo(player.calcX(2), 0);
    this.line.y = player.calcY(0);
    this.container.addChild(this.line);

    judgeLine.noteList.sort((a, b) => a.startTime - b.startTime);

    this.notes.push(...judgeLine.noteList.map((n, i, arr) => {
      let hl = false;
      if (i > 0 && Math.abs(arr[i - 1].startTime - n.startTime) < 1e-5) {
        hl = true;
      }
      return new NoteRender(this, n, hl);
    }));

    this.cull = new Cull();
    this.cull.add(this.container);
  }

  update() {
    if (this.player.tick < this.constructEvent.startTime || this.player.tick > this.constructEvent.endTime) {
      this.container.visible = false;
      return;
    }

    while (this.moveEventList.length > 0) {
      const e = this.moveEventList[0];
      if (e.startTime > this.player.tick) {
        break;
      }

      const dt = Math.min(this.player.tick - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      this.container.position.x = EaseCalc(this.prevPosition.x, this.player.calcX(e.properties.x), dt / all, e.properties.easeX);
      this.container.position.y = EaseCalc(this.prevPosition.y, this.player.calcY(e.properties.y), dt / all, e.properties.easeY);

      if (e.endTime < this.player.tick) {
        this.prevPosition = this.container.position;
        this.moveEventList.shift();
        continue;
      }

      break;
    }

    while (this.rotateEventList.length > 0) {
      const e = this.rotateEventList[0];
      if (e.startTime > this.player.tick) {
        break;
      }

      const dt = Math.min(this.player.tick - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      this.container.rotation = EaseCalc(this.prevRotation, e.properties.angle, dt / all, e.properties.ease);

      if (e.endTime < this.player.tick) {
        this.prevRotation = this.container.rotation;
        this.rotateEventList.shift();
        continue;
      }

      break;
    }

    while (this.fadeEventList.length > 0) {
      const e = this.fadeEventList[0];
      if (e.startTime > this.player.tick) {
        break;
      }

      const dt = Math.min(this.player.tick - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      this.line.alpha = EaseCalc(this.prevAlpha, e.properties.alpha, dt / all, e.properties.ease);

      if (e.endTime < this.player.tick) {
        this.prevAlpha = this.line.alpha;
        this.fadeEventList.shift();
        continue;
      }

      break;
    }

    while (this.speedEventList.length > 0) {
      const e = this.speedEventList[0];
      if (e.startTime > this.player.tick) {
        break;
      }

      if (e.endTime < this.player.tick) {
        this.prevSpeed = e.properties.speed;
        this.speedEventList.shift();
        continue;
      }

      break;
    }

    this.notes = this.notes.filter(n => {
      n.update();
      if (this.player.tick > n.note.endTime) {
        this.container.removeChild(n.sprite);
        ++this.combo;
        return false;
      }
      return true;
    });

    this.cull.cull(this.player.app.renderer.screen);
  }

  calcDist(time: number) {
    let ans = 0, prevTime = this.player.tick, speed = this.prevSpeed;

    for (const e of this.speedEventList) {
      if (e.startTime > time) {
        break;
      }

      ans += speed * Math.max(0, e.startTime - prevTime);

      const dt0 = Math.max(0, prevTime - e.startTime);
      const dt = Math.min(time - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      ans += EaseSumCalc(speed, e.properties.speed, dt0 / all, dt / all, e.properties.ease) * all;

      prevTime = e.startTime + dt;
      speed = e.properties.speed;
    }

    ans += speed * (time - prevTime);
    return ans;
  }
}
