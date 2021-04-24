import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';
import { chart, timing } from '/@/managers';
import { pceil, pfloor, pround } from '/@/common';
import track from './state';
import clsx from 'clsx';

const useStyles = makeStyles({
  line: {
    position: 'absolute',
    width: '100%',
    textAlign: 'right',
    userSelect: 'none',
  },
  line1: {
    borderTop: '1.2px lightgray solid',
  },
  line2: {
    borderTop: '1.2px gray solid',
  },
  line3: {
    borderTop: '1.2px teal solid',
  },
  line4: {
    borderTop: '1.2px burlywood solid',
  },
  line8: {
    borderTop: '1.2px purple solid',
  },
  cline: {
    borderTop: '1.2px red solid',
  },
  tpline: {
    textAlign: 'left',
    borderTop: '1.2px red dotted',
  },
  gdline: {
    position: 'absolute',
    height: '100%',
    borderLeft: '1px gray solid',
  },
});

function calcTimes(divisor: number) {
  const times: number[] = [];
  const delta = (chart.data?.timingBase ?? 48) / divisor;
  for (
    let i = pceil(track.yToTime(track.rect.height), delta);
    i <= pfloor(track.yToTime(0), delta);
    i += delta
  ) {
    times.push(i);
  }
  return times;
}

const Division = observer(() => {
  const cn = useStyles();

  return (
    <>
      <>
        {track.division % 16 == 0 &&
          calcTimes(16).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line8)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {track.division % 12 == 0 &&
          calcTimes(12).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line3)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {track.division % 8 == 0 &&
          calcTimes(8).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line8)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {track.division % 6 == 0 &&
          calcTimes(6).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line3)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {track.division % 4 == 0 &&
          calcTimes(4).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line4)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {track.division % 3 == 0 &&
          calcTimes(3).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line3)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {track.division % 2 == 0 &&
          calcTimes(2).map((time, index) => (
            <div
              key={index}
              className={clsx(cn.line, cn.line2)}
              style={{ top: track.timeToY(time) }}
            />
          ))}
      </>
      <>
        {calcTimes(1).map((time, index) => (
          <div
            key={index}
            className={clsx(cn.line, cn.line1)}
            style={{ top: track.timeToY(time) }}
          >
            {time / (chart.data?.timingBase ?? 48)}({time})
          </div>
        ))}
      </>
    </>
  );
});

const Timepoint = observer(() => {
  const cn = useStyles();

  return (
    <>
      {chart.data?.bpmList.map((b) => (
        <div
          key={b.id}
          className={clsx(cn.line, cn.tpline)}
          style={{ top: track.timeToY(b.time) }}
        >
          bpm:{b.bpm}
        </div>
      ))}
    </>
  );
});

const Current = observer(() => {
  const cn = useStyles();

  return (
    <>
      <div className={clsx(cn.line)} style={{ bottom: track.shiftHeight }}>
        {pround(timing.tick, 1)}
      </div>
      <div
        className={clsx(cn.line, cn.cline)}
        style={{ top: track.rect.height - track.shiftHeight }}
      ></div>
    </>
  );
});

const Guideline = observer(() => {
  const cn = useStyles();

  return (
    <>
      {Array.from({ length: track.guideline }, (_, i) => i).map((i) => (
        <div
          key={i}
          className={cn.gdline}
          style={{ left: (track.rect.width / track.guideline) * i }}
        />
      ))}
    </>
  );
});

export default function Grid(): JSX.Element {
  return (
    <>
      <Division />
      <Timepoint />
      <Current />
      <Guideline />
    </>
  );
}
