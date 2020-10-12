import { Container, Graphics, Point, Rectangle } from 'pixi.js';
import { Cull } from '@pixi-essentials/cull';
import { ConstructEventData, FadeEventData, JudgeLineData, MoveEventData, RotateEventData, SpeedEventData } from './ChartData';
import EaseCalc from './Easing';
import NoteRender from './NoteRender';
import Player from './Player';

export default class JudgeLineRender {
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

  constructor(c: Container, judgeLine: JudgeLineData) {
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

    judgeLine.eventList.forEach(e => {
      switch (e.type) {
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
        case 'construct':
          this.constructEvent = e;
          break;
      }
    });

    this.container = new Container();
    this.container.position.set(Player.I.x(this.constructEvent.properties.x), Player.I.y(this.constructEvent.properties.y));
    this.container.pivot.set(Player.I.x(0), Player.I.y(0));
    this.container.rotation = this.constructEvent.properties.angle;
    c.addChild(this.container);

    this.prevPosition = this.container.position;
    this.prevRotation = this.container.rotation;
    this.prevAlpha = this.container.alpha;

    this.line = new Graphics();
    this.line.lineStyle(3, 0xfbfeb7, this.constructEvent.properties.alpha);
    this.line.moveTo(Player.I.x(-2), 0);
    this.line.lineTo(Player.I.x(2), 0);
    this.line.y = Player.I.y(0);
    this.container.addChild(this.line);

    judgeLine.noteList.sort((a, b) => a.endTime - b.endTime);

    this.notes.push(...judgeLine.noteList.map((n, i, arr) => {
      let hl = false;
      if (i > 0 && Math.abs(arr[i - 1].endTime - n.endTime) < 1e-5) {
        hl = true;
      }
      return new NoteRender(this.container, n, hl, this.speedEventList);
    }));

    this.cull = new Cull();
    this.cull.add(this.container);
  }

  update() {
    if (Player.I.tick < this.constructEvent.startTime || Player.I.tick > this.constructEvent.endTime) {
      this.container.visible = false;
      return;
    }

    while (this.moveEventList.length > 0) {
      const e = this.moveEventList[0];
      if (e.startTime > Player.I.tick) {
        break;
      }

      const dt = Math.min(Player.I.tick - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      this.container.position.x = EaseCalc(this.prevPosition.x, Player.I.x(e.properties.x), dt / all, e.properties.easeX);
      this.container.position.y = EaseCalc(this.prevPosition.y, Player.I.y(e.properties.y), dt / all, e.properties.easeY);

      if (e.endTime < Player.I.tick) {
        this.prevPosition = this.container.position;
        this.moveEventList.shift();
        continue;
      }

      break;
    }

    while (this.rotateEventList.length > 0) {
      const e = this.rotateEventList[0];
      if (e.startTime > Player.I.tick) {
        break;
      }

      const dt = Math.min(Player.I.tick - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      this.container.rotation = EaseCalc(this.prevRotation, e.properties.angle, dt / all, e.properties.ease);

      if (e.endTime < Player.I.tick) {
        this.prevRotation = this.container.rotation;
        this.rotateEventList.shift();
        continue;
      }

      break;
    }

    while (this.fadeEventList.length > 0) {
      const e = this.fadeEventList[0];
      if (e.startTime > Player.I.tick) {
        break;
      }

      const dt = Math.min(Player.I.tick - e.startTime, e.endTime - e.startTime);
      const all = e.endTime - e.startTime;
      this.line.alpha = EaseCalc(this.prevAlpha, e.properties.alpha, dt / all, e.properties.ease);

      if (e.endTime < Player.I.tick) {
        this.prevAlpha = this.line.alpha;
        this.fadeEventList.shift();
        continue;
      }

      break;
    }

    this.notes.forEach(n => n.update());

    this.cull.cull(Player.I.app.renderer.screen);
  }
}
