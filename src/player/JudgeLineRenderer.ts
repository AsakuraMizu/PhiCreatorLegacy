import { Container, Graphics, Point } from 'pixi.js';
import { Cull } from '@pixi-essentials/cull';
import { ConstructEventData, FadeEventData, JudgeLineData, MoveEventData, RotateEventData, SpeedEventData } from './ChartData';
import { easeCalc, easeSumCalc } from './Easing';
import NoteRenderer from './NoteRenderer';
import Player from './Player';
import { forEach } from 'lodash-es';

export default class JudgeLineRenderer {
  player: Player;

  container: Container;
  notes: NoteRenderer[] = [];
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
    forEach(judgeLine.eventList, event => {
      switch (event.type) {
        case 'construct':
          this.constructEvent = event;
          break;
        case 'move':
          this.moveEventList.push(event);
          break;
        case 'rotate':
          this.rotateEventList.push(event);
          break;
        case 'fade':
          this.fadeEventList.push(event);
          break;
        case 'speed':
          this.speedEventList.push(event);
          break;
        default:
          break;
      }
    });

    this.container = new Container();
    this.container.position.set(player.calcX(this.constructEvent.properties.x), player.calcY(this.constructEvent.properties.y));
    this.container.pivot.set(player.calcX(0), player.calcY(0));
    this.container.rotation = this.constructEvent.properties.angle;
    player.app.stage.addChild(this.container);

    this.prevPosition = this.container.position.clone();
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

    this.notes.push(...judgeLine.noteList.map(n => new NoteRenderer(this, n)));

    this.cull = new Cull();
    this.cull.add(this.container);
  }

  update(): void {
    if (this.player.tick < this.constructEvent.startTime || this.player.tick > this.constructEvent.endTime) {
      this.container.visible = false;
      return;
    }

    while (this.moveEventList.length > 0) {
      const event = this.moveEventList[0];
      if (event.startTime > this.player.tick) {
        break;
      }

      const dt = Math.min(this.player.tick - event.startTime, event.endTime - event.startTime);
      const all = event.endTime - event.startTime;
      this.container.position.x = easeCalc(this.prevPosition.x, this.player.calcX(event.properties.x), dt / all, event.properties.easeX);
      this.container.position.y = easeCalc(this.prevPosition.y, this.player.calcY(event.properties.y), dt / all, event.properties.easeY);

      if (event.endTime < this.player.tick) {
        this.prevPosition = this.container.position.clone();
        this.moveEventList.shift();
        continue;
      }

      break;
    }

    while (this.rotateEventList.length > 0) {
      const event = this.rotateEventList[0];
      if (event.startTime > this.player.tick) {
        break;
      }

      const dt = Math.min(this.player.tick - event.startTime, event.endTime - event.startTime);
      const all = event.endTime - event.startTime;
      this.container.rotation = easeCalc(this.prevRotation, event.properties.angle, dt / all, event.properties.ease);

      if (event.endTime < this.player.tick) {
        this.prevRotation = this.container.rotation;
        this.rotateEventList.shift();
        continue;
      }

      break;
    }

    while (this.fadeEventList.length > 0) {
      const event = this.fadeEventList[0];
      if (event.startTime > this.player.tick) {
        break;
      }

      const dt = Math.min(this.player.tick - event.startTime, event.endTime - event.startTime);
      const all = event.endTime - event.startTime;
      this.line.alpha = easeCalc(this.prevAlpha, event.properties.alpha, dt / all, event.properties.ease);

      if (event.endTime < this.player.tick) {
        this.prevAlpha = this.line.alpha;
        this.fadeEventList.shift();
        continue;
      }

      break;
    }

    while (this.speedEventList.length > 0) {
      const event = this.speedEventList[0];
      if (event.startTime > this.player.tick) {
        break;
      }

      if (event.endTime < this.player.tick) {
        this.prevSpeed = event.properties.speed;
        this.speedEventList.shift();
        continue;
      }

      break;
    }

    this.notes = this.notes.filter(n => {
      n.update();
      if (this.player.tick > n.note.endTime) {
        this.container.removeChild(n.sprite);
        ++this.player.combo;
        return false;
      }

      return true;
    });

    this.cull.cull(this.player.app.renderer.screen);
  }

  calcDist(time: number): number {
    let ans = 0;
    let previousTime = this.player.tick;
    let speed = this.prevSpeed;

    for (const event of this.speedEventList) {
      if (event.startTime > time) {
        break;
      }

      ans += speed * Math.max(0, event.startTime - previousTime);

      const dt0 = Math.max(0, previousTime - event.startTime);
      const dt = Math.min(time - event.startTime, event.endTime - event.startTime);
      const all = event.endTime - event.startTime;
      ans += easeSumCalc(speed, event.properties.speed, dt0 / all, dt / all, event.properties.ease) * all;

      previousTime = event.startTime + dt;
      speed = event.properties.speed;
    }

    ans += speed * (time - previousTime);
    return ans;
  }
}
