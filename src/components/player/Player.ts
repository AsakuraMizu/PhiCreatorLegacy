import { cloneDeep, forEach, reduce } from 'lodash-es';
import { Application, Texture } from 'pixi.js';
import { OldEmitterConfig } from 'pixi-particles';
import { ChartData } from './ChartData';
import JudgeLineRender from './JudgeLineRender';
import Judger from './Judger';
import setupUI from './UI';

export type ResourceName = 'Click' | 'ClickHL' | 'Drag' | 'DragHL' | 'Flick' | 'FlickHL' | 'Hold' | 'HoldEnd' | 'HoldHead' | 'Effect' | 'Square';

export type Resources = {
  [k in ResourceName]: string;
};

export interface EffectOptions {
  ratio: number;
  size: number;
  duration: number;
  interval: number;
  particle: OldEmitterConfig;
}

export interface Skin {
  resources: Resources;
  noteRatio: number;
  effect: EffectOptions;
  color: number;
}

export type Textures = {
  [k in ResourceName]: Texture;
};

export interface DisplayOptions {
  title: string;
  diff: string;
  background: File;
  music: File;
}

export interface PlayerOptions {
  canvas: HTMLCanvasElement;
  chart: ChartData;
  skin: Skin;
  display: DisplayOptions;
  width?: number;
  height?: number;
  offset?: number;
}

export default class Player {
  app: Application;
  state: (dt: number) => void = () => { };

  judgeLines: JudgeLineRender[] = [];

  bpm: number;
  tick: number;
  width: number;
  height: number;

  chart: ChartData;

  skin: Skin;
  textures!: Textures;
  judger!: Judger;

  // set fullscreen(status: boolean) {
  //   if (status) {
  //     this.app.renderer.resize(window.innerWidth, window.innerHeight);
  //     this.app.stage.scale.set(window.innerWidth / this.width, window.innerHeight / this.height);
  //   } else {
  //     this.app.renderer.resize(this.width, this.height);
  //     this.app.stage.scale.set(1, 1);
  //   }
  // }

  constructor(options: PlayerOptions) {
    this.chart = cloneDeep(options.chart);
    this.skin = options.skin;
    this.width = options.width ?? 800;
    this.height = options.height ?? 480;
    this.bpm = this.chart.timing.bpmList[0].bpm;
    this.chart.timing.bpmList.shift();
    this.tick = ((options.offset ?? 0) - this.chart.timing.offset) * this.bpm * 1.2;
    this.app = new Application({
      width: this.width,
      height: this.height,
      view: options.canvas,
      antialias: true,
    });
    // this.fullscreen = false;

    forEach(this.skin.resources, (url) => {
      this.app.loader.add(url);
    });

    this.app.loader.load(() => this.setup());

    setupUI(this, options.display);
  }

  setup() {
    this.textures = reduce(this.skin.resources, (result, url, name) => {
      const t = this.app.loader.resources[url].texture;
      t.baseTexture.setResolution(1 / this.skin.noteRatio);
      result[<ResourceName>name] = t;
      return result;
    }, <Textures>{});

    this.judger = new Judger(this);
    this.judgeLines.push(...this.chart.judgeLineList.map(l => new JudgeLineRender(this, l)));

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

    let combo = 0;
    this.judgeLines = this.judgeLines.filter(l => {
      l.update();
      combo += l.combo;
      if (this.tick > l.constructEvent.endTime) {
        this.app.stage.removeChild(l.container);
        return false;
      }
      return true;
    });
  }

  calcX(x: number): number {
    return (x + 1) * this.width / 2;
  }

  calcY(y: number): number {
    return (1 - y) * this.height / 2;
  }
}
