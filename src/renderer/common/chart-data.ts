export interface BpmData {
  id: number;
  time: number;
  bpm: number;
}

export interface NoteData {
  id: number;
  type: 1 | 2 | 3 | 4;
  time: number;
  holdTime: number;
  x: number;
  speed: number;
  side: 1 | -1;
  isFake: boolean;
}

export type Easing =
  | 'easeInBack'
  | 'easeInBounce'
  | 'easeInCirc'
  | 'easeInCubic'
  | 'easeInElastic'
  | 'easeInExpo'
  | 'easeInOutBack'
  | 'easeInOutBounce'
  | 'easeInOutCirc'
  | 'easeInOutCubic'
  | 'easeInOutElastic'
  | 'easeInOutExpo'
  | 'easeInOutQuad'
  | 'easeInOutQuart'
  | 'easeInOutQuint'
  | 'easeInOutSine'
  | 'easeInQuad'
  | 'easeInQuart'
  | 'easeInQuint'
  | 'easeInSine'
  | 'easeOutBack'
  | 'easeOutBounce'
  | 'easeOutCirc'
  | 'easeOutCubic'
  | 'easeOutElastic'
  | 'easeOutExpo'
  | 'easeOutQuad'
  | 'easeOutQuart'
  | 'easeOutQuint'
  | 'easeOutSine'
  | 'linear'
  | 'none';

export interface State {
  id: number;
  time: number;
  value: number;
  easing?: Easing;
}

export type Props =
  | 'controlX'
  | 'controlY'
  | 'angle'
  | 'speed'
  | 'noteAlpha'
  | 'lineAlpha'
  | 'displayRange';

export interface JudgeLineData {
  id: number;
  name?: string;
  constructTime: number;
  destructTime: number;
  noteList: NoteData[];
  props: Record<Props, State[]>;
}

export interface ChartData {
  musicOffset: number;
  timingBase?: number;
  bpmList: BpmData[];
  judgeLineList: JudgeLineData[];
}
