import React, { useEffect } from 'react';
import { cloneDeep } from 'lodash-es';
import { action } from 'mobx';
import { makeStyles } from '@material-ui/core';
import useOnWindowResize from '@rooks/use-on-window-resize';
import { chart, music } from '/@/managers';
import track from './state';
import CursorInfo from './CursorInfo';
import Grid from './Grid';
import Notes from './Notes';
import PropGrid from './PropGrid';
import PropEdit from './PropEdit';

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

export default function Track(): JSX.Element {
  const cn = useStyles();
  const ref = React.useRef<HTMLDivElement>(null);

  const updateRect = action(() => {
    if (ref.current) {
      track.rect = ref.current.getBoundingClientRect();
    }
  });

  useEffect(updateRect);
  useOnWindowResize(updateRect);

  const [open, setOpen] = React.useState(false);

  const onMouseDown = action((event: React.MouseEvent<HTMLDivElement>) => {
    track.start();
    if (event.button === 0) {
      track.left = true;
    } else {
      track.left = false;
    }
    track.ctrl = event.ctrlKey;
    if (track.tool === 'cursor') {
      if (!track.ctrl) {
        track.selected.clear();
      }
    } else if (track.tool == 'note') {
      track.virtualNote.type = track.left ? 1 : 2;
      track.virtualNote.time = track.time;
      track.virtualNote.holdTime = 0;
      track.virtualNote.x = track.x;
      track.virtualNote.width = 1;
    } else if (track.tool === 'prop') {
      setOpen(true);
    }
    track.pressing = true;
  });

  const onMouseMove = action((event: React.MouseEvent<HTMLDivElement>) => {
    track.update(event.clientX, event.clientY);
    if (track.pressingNote) {
      if (track.dist2 > 500) {
        track.dragging = true;
      }
    }
    if (track.pressing && track.tool === 'note') {
      if (track.dist2 > 400) {
        track.virtualNote.type = track.left ? 3 : 4;
        if (track.left) {
          track.virtualNote.holdTime = Math.abs(track.time - track.startTime);
        }
      } else {
        track.virtualNote.type = track.left ? 1 : 2;
        track.virtualNote.holdTime = 0;
      }
    }
  });

  const onMouseUp = action(() => {
    if (track.pressing) {
      track.pressing = false;
      if (track.tool === 'cursor') {
        track.selecting.forEach((idx) => track.selected.add(idx));
        track.selecting.clear();
        track.unselecting.forEach((idx) => track.selected.add(idx));
        track.unselecting.clear();
        if (!track.left) track.deleteSelected();
      } else if (track.tool === 'note') {
        track.virtualNote.id = track.lastId + 1;
        if (track.lineData) {
          track.lineData.noteList.push(cloneDeep(track.virtualNote));
          chart.patch();
        }
      }
    }
    if (track.pressingNote) {
      if (track.dragging) {
        track.dragging = false;
        track.selected.forEach((idx) => {
          if (track.lineData) {
            const data = track.lineData.noteList[idx];
            if (track.ctrl) {
              track.lineData.noteList.push({
                ...data,
                id: track.lastId + 1,
              });
            }
            data.x += track.deltaX;
            data.time += track.deltaTime;
          }
        });
        chart.patch();
      }
      if (!track.left) track.deleteSelected();
      track.pressingNote = false;
    }
  });

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

  return (
    <>
      <div
        className={cn.track}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
      >
        <CursorInfo />
        <Grid />
        <Notes />
        <PropGrid />
      </div>
      <PropEdit
        open={open}
        onClose={action(() => {
          setOpen(false);
        })}
      />
    </>
  );
}
