import { cloneDeep } from 'lodash-es';
import { Application } from 'pixi.js';
import { ChartData } from './ChartData';
import JudgeLineRender from './JudgeLineRender';

interface PlayerOptions {
  canvas: HTMLCanvasElement;
  skin: Record<string, string>;
  skinScale: number;
  chart: ChartData;
  width?: number;
  height?: number;
  offset?: number;
}

export default class Player {
  static I: Player;

  app: Application;
  state: (dt: number) => void = () => { };

  judgeLines: JudgeLineRender[] = [];

  bpm: number;
  tick: number;
  size: number;
  width: number;
  height: number;
  skinScale: number;

  chart: ChartData;

  set fullscreen(status: boolean) {
    if (status) {
      const scale = Math.min(
        window.innerWidth / this.width,
        window.innerHeight / this.height
      );
      if (Math.abs(this.width * scale - window.innerWidth) < 1e-5) {
        this.size = this.height;
      } else {
        this.size = this.width;
      }
      this.app.renderer.resize(this.width * scale, this.height * scale);
      this.app.stage.scale.set(scale, scale);
      this.app.view.requestFullscreen();
    } else {
      this.size = this.height;
      this.app.renderer.resize(this.width, this.height);
      this.app.stage.scale.set(1, 1);
    }
  }

  constructor(options: PlayerOptions) {
    Player.I = this;
    this.chart = cloneDeep(options.chart);
    this.width = options.width ?? 800;
    this.height = options.height ?? 480;
    this.size = this.height;
    this.skinScale = options.skinScale;
    this.bpm = this.chart.timing.bpmList[0].bpm;
    this.chart.timing.bpmList.shift();
    this.tick = ((options.offset ?? 0) - this.chart.timing.offset) * this.bpm * 1.2;
    this.app = new Application({
      width: this.width,
      height: this.height,
      view: options.canvas
    });
    this.fullscreen = false;

    Object.entries(options.skin).forEach(([name, url]) => {
      this.app.loader.add(name, url);
    })
    this.app.loader.load(() => this.setup());
  }

  setup() {
    this.judgeLines.push(...this.chart.judgeLineList.map(l => new JudgeLineRender(this.app.stage, l)));

    this.state = this.play;
    this.app.ticker.add(dt => this.gameLoop(dt));
  }

  gameLoop(dt: number) {
    this.state(dt);
  }

  play(dt: number) {
    dt /= 100;
    while (this.chart.timing.bpmList.length > 0) {
      const b = this.chart.timing.bpmList[0];
      if (b.time > this.tick) {
        break;
      } else {
        this.bpm = b.bpm;
        this.chart.timing.bpmList.shift();
      }
    }

    this.tick += this.bpm * dt * 1.2;
    this.judgeLines = this.judgeLines.filter(l => {
      l.update();
      if (this.tick > l.constructEvent.endTime) {
        l.container.destroy();
        this.app.stage.removeChild(l.container);
        return false;
      }
      return true;
    })
  }

  x(x: number): number {
    return x * this.size + this.width / 2;
  }

  y(y: number): number {
    return this.height / 2 - y * this.size;
  }
}
