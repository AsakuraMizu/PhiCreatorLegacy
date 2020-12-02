export interface BpmData {
  id: number;
  time: number;
  bpm: number;
}

export interface TimingData {
  offset: number;
  bpmList: BpmData[];
}

export type Ease =
  'linear' | 'jump' |
  'backIn' | 'backOut' |
  'bounceIn' | 'bounceOut' |
  'circIn' | 'circOut' |
  'cubicIn' | 'cubicOut' |
  'elasticIn' | 'elasticOut' |
  'expoIn' | 'expoOut' |
  'quadIn' | 'quadOut' |
  'quartIn' | 'quartOut' |
  'quintIn' | 'quintOut' |
  'sineIn' | 'sineOut';

export interface BaseEventData {
  id: number;
  type: string;
  startTime: number;
  endTime: number;
  properties: Record<string, unknown>;
}

export interface ConstructEventData extends BaseEventData {
  type: 'construct';
  properties: {
    x: number;
    y: number;
    angle: number;
    alpha: number;
    speed: number;
  };
}

export interface MoveEventData extends BaseEventData {
  type: 'move';
  properties: {
    x: number;
    y: number;
    easeX: Ease;
    easeY: Ease;
  };
}

export interface RotateEventData extends BaseEventData {
  type: 'rotate';
  properties: {
    angle: number;
    ease: Ease;
  };
}

export interface FadeEventData extends BaseEventData {
  type: 'fade';
  properties: {
    alpha: number;
    ease: Ease;
  };
}

export interface SpeedEventData extends BaseEventData {
  type: 'speed';
  properties: {
    speed: number;
    ease: Ease;
  };
}

export interface NoteVisEventData extends BaseEventData {
  type: 'notevis';
  properties: {
    visibility: boolean;
  };
}

export type EventData = ConstructEventData | MoveEventData | RotateEventData | FadeEventData | SpeedEventData | NoteVisEventData;

export interface NoteData {
  id: number;
  type: 'click' | 'flick' | 'drag' | 'hold';
  startTime: number;
  endTime: number;
  relativeX: number;
  side: 1 | -1;
  speed: number;
  isFake: boolean;
}

export interface JudgeLineData {
  id: number;
  eventList: EventData[];
  noteList: NoteData[];
}

export interface ChartData {
  timing: TimingData;
  judgeLineList: JudgeLineData[];
}
