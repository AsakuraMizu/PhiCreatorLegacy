import { types } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';
import SingleBpm from './bpm';
import SingleJudgeLine from './judgeline';
import { ChartData } from './format';

const Chart = types
  .model('Chart', {
    schemaVersion: types.number,
    musicOffset: types.number,
    timingBase: types.number,
    bpmList: types.array(SingleBpm),
    judgeLineList: types.array(SingleJudgeLine),
  })
  .actions((self) => ({
    update(data: {
      schemaVersion?: number;
      musicOffset?: number;
      timingBase?: number;
    }) {
      Object.assign(self, data);
    },
  }))
  .volatile((self) => ({
    history: UndoManager.create({}, { targetStore: self }),
  }));

export default types.snapshotProcessor(Chart, {
  preProcessor(data: ChartData) {
    return {
      ...data,
      bpmList: data.bpmList.map(({ time, bpm }) => ({ time, bpm })),
      judgeLineList: data.judgeLineList.map(({ name, noteList, props }) => ({
        name,
        noteList: noteList.map(
          ({ type, time, holdTime, x, width, speed, side, isFake }) => ({
            type,
            time,
            holdTime,
            x,
            width,
            speed,
            side,
            isFake,
          })
        ),
        controlX: props.controlX,
        controlY: props.controlY,
        angle: props.angle,
        speed: props.speed,
        noteAlpha: props.noteAlpha,
        lineAlpha: props.lineAlpha,
        displayRange: props.displayRange,
      })),
    };
  },
  postProcessor(sn): ChartData {
    return {
      ...sn,
      bpmList: sn.bpmList.map(({ time, bpm }, index) => ({
        id: index,
        time,
        bpm,
      })),
      judgeLineList: sn.judgeLineList.map(
        (
          {
            name,
            noteList,
            controlX,
            controlY,
            angle,
            speed,
            noteAlpha,
            lineAlpha,
            displayRange,
          },
          index
        ) => ({
          id: index,
          name,
          noteList: noteList.map(
            (
              { type, time, holdTime, x, width, speed, side, isFake },
              index
            ) => ({
              id: index,
              type,
              time,
              holdTime,
              x,
              width,
              speed,
              side,
              isFake,
            })
          ),
          props: {
            controlX,
            controlY,
            angle,
            speed,
            noteAlpha,
            lineAlpha,
            displayRange,
          },
        })
      ),
    };
  },
});
