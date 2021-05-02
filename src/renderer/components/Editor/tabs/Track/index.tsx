import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHotkeys } from 'react-hotkeys-hook';
import useOnWindowResize from '@rooks/use-on-window-resize';
import { music } from '/@/managers';
import store from '/@/store';
import CursorInfo from './CursorInfo';
import Grid from './Grid';
import Notes from './Notes';
import PropGrid from './PropGrid';
import PropEdit from './PropEdit';
import Frame from './Frame';

const useStyles = makeStyles(() => ({
  track: {
    position: 'absolute',
    width: '80%',
    height: 'calc(100% - 50px)',
    overflow: 'hidden',
    color: 'white',
    backgroundColor: 'black',
    userSelect: 'none',
  },
}));

const { track } = store.editor;

const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
  track.update({
    left: event.button === 0,
    ctrl: event.ctrlKey,
  });
  if (track.pressingMode !== 'none') return;
  if (track.tool === 'cursor') {
    track.startPressing('select');
    track.clearSelected();
  } else if (track.tool == 'note') {
    track.startPressing('newNote');
    track.virtualNote.update({
      type: track.left ? 1 : 2,
      time: track.time,
      holdTime: 0,
      x: track.x,
      width: 1,
    });
  } else if (track.tool === 'prop') {
    track.startPressing();
    track.update({ editingProp: true });
  }
};

const onMouseMove = ({
  clientX,
  clientY,
}: React.MouseEvent<HTMLDivElement>) => {
  track.update({
    clientX,
    clientY,
  });
  if (track.pressing) {
    if (track.pressingMode === 'noteStart') {
      if (track.dist2 > 500) track.update({ pressingMode: 'drag' });
    } else if (track.pressingMode === 'newNote') {
      if (track.dist2 > 400) {
        const holdTime = Math.abs(track.time - track.startTime);
        track.virtualNote.update({
          type: track.left ? (holdTime > 0 ? 3 : 1) : 4,
          holdTime: track.left ? holdTime : 0,
        });
      } else {
        track.virtualNote.update({ type: track.left ? 1 : 2, holdTime: 0 });
      }
    }
  }
};

const onMouseUp = () => {
  if (track.pressing) {
    if (track.pressingMode === 'select') {
      track.applySelection();
      if (!track.left) track.deleteSelected();
    } else if (track.pressingMode === 'newNote') {
      if (store.editor.line) {
        store.editor.line.addNote(track.virtualNote.clone());
      }
    } else if (track.pressingMode === 'noteStart') {
      if (!track.left) track.deleteSelected();
    } else if (track.pressingMode === 'drag') {
      const { history } = store.chart;
      history.startGroup(() => 0);
      track.selected.forEach((note) => {
        if (store.editor.line) {
          if (track.ctrl) store.editor.line.addNote(note.clone());
        }
        note.update({
          x: note.x + track.deltaX,
          time: note.time + track.deltaTime,
        });
      });
      history.stopGroup();
    } else if (track.pressingMode === 'stretch') {
      const note = track.selected[0];
      const holdTime = note.holdTime + track.deltaTime;
      if (holdTime > 0) note.update({ holdTime });
    }
    track.stopPressing();
  }
};

const onWheel = (e: React.WheelEvent) => {
  e.stopPropagation();
  if (e.ctrlKey) {
    if (e.deltaY < 0) track.zoomin();
    else track.zoomout();
  } else if (e.altKey) {
    const idx = track.divisions.indexOf(track.division);
    track.setDivision(track.divisions[idx - Math.sign(e.deltaY)]);
  } else {
    const dt = e.deltaY / track.beatHeight / music.duration;
    const target = music.progress - dt;
    music.seek(target);
  }
};

export default function Track(): JSX.Element {
  const cn = useStyles();
  const ref = React.useRef<HTMLDivElement>(null);

  const updateRect = () => {
    if (ref.current) {
      track.update({ rect: ref.current.getBoundingClientRect() });
    }
  };

  useEffect(updateRect);
  useOnWindowResize(updateRect);

  useHotkeys('ctrl+c', () => track.copy());
  useHotkeys('ctrl+v', () => track.paste());
  useHotkeys('ctrl+m', () => track.mirror());

  return (
    <>
      <div
        ref={ref}
        className={cn.track}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
      >
        <CursorInfo />
        <Frame />
        <Grid />
        <Notes />
        <PropGrid />
      </div>
      <PropEdit />
    </>
  );
}
