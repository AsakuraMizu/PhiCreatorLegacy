import React from 'react';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import store from '/@/store';
import SingleNote from '/@/store/chart/note';

import Tap from '/@/assets/skin/Tap.png';
import Drag from '/@/assets/skin/Drag.png';
import Hold from '/@/assets/skin/Hold.png';
import Flick from '/@/assets/skin/Flick.png';

const { track } = store.editor;

const useStyles = makeStyles({
  note: {
    transformOrigin: 'center',
    position: 'absolute',
    userSelect: 'none',
  },
  holdControl: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    border: '2px solid',
    borderColor: 'red',
    cursor: 'grab',
  },
  selected: {
    outline: '1.5px yellow solid',
  },
  virtual: {
    opacity: 0.5,
  },
});

const Note = observer(({ data }: { data: Instance<typeof SingleNote> }) => {
  const cn = useStyles();

  const state = useLocalObservable(() => ({
    get inselection() {
      return (
        data.x >= Math.min(track.startExactX, track.exactX) &&
        data.x <= Math.max(track.startExactX, track.exactX) &&
        data.time >= Math.min(track.startExactTime, track.exactTime) &&
        data.time + data.holdTime <=
          Math.max(track.startExactTime, track.exactTime) &&
        track.pressing &&
        track.pressingMode === 'select'
      );
    },
    get selected() {
      return this.inselection !== track.selected.includes(data);
    },
  }));
  React.useEffect(
    () =>
      reaction(
        () => state.inselection,
        () => {
          if (track.pressing && track.pressingMode === 'select') {
            if (track.selected.includes(data)) {
              if (state.selected) {
                track.addUnselecting(data);
              } else {
                track.delUnselecting(data);
              }
            } else {
              if (state.selected) {
                track.addSelecting(data);
              } else {
                track.delSelecting(data);
              }
            }
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const onMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
    if ((track.tool === 'note' && !event.ctrlKey) || track.tool === 'cursor') {
      track.switchTool('cursor');
      track.startPressing('noteStart');
      if (!state.selected) track.selectOne(data);
    }
  };

  const onHoldControl = () => {
    track.startPressing('stretch');
    track.clearSelected(true);
    track.selectOne(data);
  };

  const newX =
      data.x +
      (track.pressingMode === 'drag' && track.selected.includes(data)
        ? track.deltaX
        : 0),
    newTime =
      data.time +
      (track.pressingMode === 'drag' && track.selected.includes(data)
        ? track.deltaTime
        : 0),
    newHoldTime =
      data.holdTime +
      (track.pressingMode === 'stretch' && track.selected.includes(data)
        ? track.deltaTime
        : 0);

  const x = track.xToScreenX(newX),
    y = track.timeToY(newTime + newHoldTime);

  return (
    <>
      <img
        className={clsx(cn.note, state.selected && cn.selected)}
        draggable={false}
        src={{ 1: Tap, 2: Drag, 3: Hold, 4: Flick }[data.type]}
        style={{
          width: track.rect.width / 10,
          height:
            data.type === 3
              ? track.timeToY(data.time) -
                track.timeToY(data.time + newHoldTime)
              : 'initial',
          transform: `translate(calc(${x}px - 50%), calc(${y}px${
            data.type === 3 ? '' : ' - 50%'
          })) scaleX(${data.width})`,
        }}
        onMouseDown={onMouseDown}
        hidden={track.timeToY(newTime) < 0 || y > track.rect.height}
      />
      {data.type === 3 && track.tool === 'cursor' && (
        <div
          className={cn.holdControl}
          style={{
            transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
          }}
          onMouseDown={onHoldControl}
        />
      )}
    </>
  );
});

const VNote = observer(({ data }: { data: Instance<typeof SingleNote> }) => {
  const cn = useStyles();
  const x = track.xToScreenX(data.x),
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
      hidden={!track.pressing || track.pressingMode !== 'newNote'}
    />
  );
});

export default observer(function Notes() {
  return (
    <>
      {store.editor.line?.noteList.map((note) => (
        <Note key={note.id} data={note} />
      ))}
      <VNote data={track.virtualNote} />
    </>
  );
});
