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
  width: number;
  speed: number;
  side: 1 | -1;
  isFake: boolean;
}

export interface State {
  id: number;
  time: number;
  value: number;
  easing?: number;
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
  noteList: NoteData[];
  props: Record<Props, State[]>;
}

export interface ChartData {
  schemaVersion: number;
  musicOffset: number;
  timingBase?: number;
  bpmList: BpmData[];
  judgeLineList: JudgeLineData[];
}
