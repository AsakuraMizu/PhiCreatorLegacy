import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';
import store from '/@/store';

const { track } = store.editor;

const useStyles = makeStyles(() => ({
  frame: {
    position: 'absolute',
    border: '3px dotted',
    borderColor: 'lightblue',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    userSelect: 'none',
  },
}));

export default observer(function Frame() {
  const cn = useStyles();

  const l = track.xToScreenX(Math.min(track.startExactX, track.exactX)) || 0,
    r = track.xToScreenX(Math.max(track.startExactX, track.exactX)) || 0,
    t = track.timeToY(Math.max(track.startExactTime, track.exactTime)) || 0,
    b = track.timeToY(Math.min(track.startExactTime, track.exactTime)) || 0;

  return (
    <div
      className={cn.frame}
      style={{ left: l, width: r - l, top: t, height: b - t }}
      hidden={track.pressingMode !== 'select'}
    />
  );
});
