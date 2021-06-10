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
  easing: number;
}

export type Props =
  | 'controlX'
  | 'controlY'
  | 'angle'
  | 'speed'
  | 'noteAlpha'
  | 'lineAlpha'
  | 'displayRange';

export const props: Props[] = [
  'controlX',
  'controlY',
  'angle',
  'speed',
  'noteAlpha',
  'lineAlpha',
  'displayRange',
];

export const defv: Record<Props, number> = {
  controlX: 0,
  controlY: 0,
  angle: 0,
  speed: 1,
  noteAlpha: 1,
  lineAlpha: 1,
  displayRange: -1,
};

export interface JudgeLineData {
  id: number;
  name?: string;
  noteList: NoteData[];
  props: Record<Props, State[]>;
}

export interface ChartData {
  schemaVersion: number;
  musicOffset: number;
  timingBase: number;
  bpmList: BpmData[];
  judgeLineList: JudgeLineData[];
}

export const initialChart: ChartData = {
  schemaVersion: 1,
  musicOffset: 0,
  timingBase: 48,
  bpmList: [{ id: 0, time: 0, bpm: 100 }],
  judgeLineList: [
    {
      id: 0,
      noteList: [],
      props: {
        controlX: [{ id: 0, time: 0, value: defv.controlX, easing: 0 }],
        controlY: [{ id: 0, time: 0, value: defv.controlY, easing: 0 }],
        angle: [{ id: 0, time: 0, value: defv.angle, easing: 0 }],
        speed: [{ id: 0, time: 0, value: defv.speed, easing: 0 }],
        noteAlpha: [{ id: 0, time: 0, value: defv.noteAlpha, easing: 0 }],
        lineAlpha: [{ id: 0, time: 0, value: defv.lineAlpha, easing: 0 }],
        displayRange: [{ id: 0, time: 0, value: defv.displayRange, easing: 0 }],
      },
    },
  ],
};
