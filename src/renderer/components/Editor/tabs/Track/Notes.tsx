import React from 'react';
import { action, reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import track from './state';

import Tap from '/@/assets/skin/Tap.png';
import Drag from '/@/assets/skin/Drag.png';
import Hold from '/@/assets/skin/Hold.png';
import Flick from '/@/assets/skin/Flick.png';

const useStyles = makeStyles({
  note: {
    transformOrigin: 'center',
    position: 'absolute',
    userSelect: 'none',
  },
  selected: {
    outline: '1.5px yellow solid',
  },
  virtual: {
    opacity: 0.5,
  },
});

interface NoteProps {
  idx: number;
}

const Note = observer(({ idx }: NoteProps) => {
  const cn = useStyles();

  const data = track.lineData?.noteList[idx];

  if (data) {
    const state = useLocalObservable(() => ({
      get inselection() {
        return (
          data &&
          data.x >= Math.min(track.startExactX, track.exactX) &&
          data.x <= Math.max(track.startExactX, track.exactX) &&
          data.time >= Math.min(track.startExactTime, track.exactTime) &&
          data.time + data.holdTime <=
            Math.max(track.startExactTime, track.exactTime) &&
          track.pressing &&
          track.tool === 'cursor'
        );
      },
      get selected() {
        return this.inselection !== track.selected.has(idx);
      },
    }));
    React.useEffect(
      () =>
        reaction(
          () => state.inselection,
          () => {
            if (track.pressing) {
              (track.selected.has(idx) ? track.unselecting : track.selecting)[
                state.selected ? 'add' : 'delete'
              ](idx);
            }
          }
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [idx]
    );

    const onMouseDown = action((event: React.MouseEvent<HTMLImageElement>) => {
      if (
        (track.tool === 'note' && !event.ctrlKey) ||
        track.tool === 'cursor'
      ) {
        event.stopPropagation();
        track.tool = 'cursor';
        if (event.button === 0) {
          track.left = true;
        } else {
          track.left = false;
        }
        track.ctrl = event.ctrlKey;
        track.start();
        if (!state.selected) track.selectOne(idx);
        track.pressingNote = true;
      }
    });

    const x =
        ((data.x +
          (track.dragging && track.selected.has(idx) ? track.deltaX : 0) +
          1) /
          2) *
        track.rect.width,
      y = track.timeToY(
        data.time +
          (track.dragging && track.selected.has(idx) ? track.deltaTime : 0) +
          data.holdTime
      );

    if (
      track.timeToY(
        data.time +
          (track.dragging && track.selected.has(idx) ? track.deltaTime : 0)
      ) >= 0 &&
      track.timeToY(
        data.time +
          (track.dragging && track.selected.has(idx)
            ? track.deltaTime
            : 0 + data.holdTime)
      ) <= track.rect.height
    )
      return (
        <img
          className={clsx(cn.note, state.selected && cn.selected)}
          draggable={false}
          src={{ 1: Tap, 2: Drag, 3: Hold, 4: Flick }[data.type]}
          style={{
            width: track.rect.width / 10,
            height:
              data.type === 3
                ? track.timeToY(data.time) -
                  track.timeToY(data.time + data.holdTime)
                : 'initial',
            transform: `translate(calc(${x}px - 50%), calc(${y}px${
              data.type === 3 ? '' : ' - 50%'
            })) scaleX(${data.width})`,
          }}
          onMouseDown={onMouseDown}
        />
      );
    else return <></>;
  } else {
    return <></>;
  }
});

const VNote = observer(() => {
  const cn = useStyles();
  if (track.tool === 'note' && track.pressing) {
    const data = track.virtualNote;
    const x = ((data.x + 1) / 2) * track.rect.width,
      y = track.timeToY(data.time + data.holdTime);
    return (
      <img
        className={clsx(cn.note, cn.virtual)}
        draggable={false}
        src={{ 1: Tap, 2: Drag, 3: Hold, 4: Flick }[data.type]}
        style={{
          width: (track.rect.width / 10) * data.width,
          height:
            data.type === 3
              ? track.timeToY(data.time) -
                track.timeToY(data.time + data.holdTime)
              : 'initial',
          transform: `translate(calc(${x}px - 50%), calc(${y}px${
            data.type === 3 ? '' : ' - 50%'
          }))`,
        }}
      />
    );
  } else {
    return <></>;
  }
});

export default observer(function Notes() {
  return (
    <>
      {track.lineData?.noteList.map((n, idx) => (
        <Note key={idx} idx={idx} />
      ))}
      <VNote />
    </>
  );
});
