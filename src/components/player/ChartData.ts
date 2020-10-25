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
  'linear'    | 'jump'       |
  'backIn'    | 'backOut'    |
  'bounceIn'  | 'bounceOut'  |
  'circIn'    | 'circOut'    |
  'cubicIn'   | 'cubicOut'   |
  'elasticIn' | 'elasticOut' |
  'expoIn'    | 'expoOut'    |
  'quadIn'    | 'quadOut'    |
  'quartIn'   | 'quartOut'   |
  'quintIn'   | 'quintOut'   |
  'sineIn'    | 'sineOut'    ;

export interface BaseEventData {
  id: number;
  type: string;
  startTime: number;
  endTime: number;
  properties: Record<string, any>;
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

export type EventData = ConstructEventData | MoveEventData | RotateEventData | FadeEventData | SpeedEventData;

export interface BaseNoteData {
  id: number;
  type: string;
  startTime: number;
  endTime: number;
  showTime: number;
  relativeX: number;
  side: 1 | -1;
  speed: number;
  isFake: boolean;
}

export interface ClickNoteData extends BaseNoteData {
  type: 'click';
}

export interface FlickNoteData extends BaseNoteData {
  type: 'flick';
}

export interface DragNoteData extends BaseNoteData {
  type: 'drag';
}

export interface HoldNoteData extends BaseNoteData {
  type: 'hold';
}

export type NoteData = ClickNoteData | FlickNoteData | DragNoteData | HoldNoteData;

export interface JudgeLineData {
  id: number;
  eventList: EventData[];
  noteList: NoteData[];
}

export interface ChartData {
  timing: TimingData;
  judgeLineList: JudgeLineData[];
}
