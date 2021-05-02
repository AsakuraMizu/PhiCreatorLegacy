import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';
import { pround } from '/@/common';
import store from '/@/store';

const useStyles = makeStyles(() => ({
  info: {
    position: 'absolute',
  },
}));

export default observer(function CursorInfo() {
  const cn = useStyles();
  const { track } = store.editor;

  return (
    <div className={cn.info}>
      Time: {track.time}({pround(track.exactTime, 0.1)})
      <br />
      X: {pround(track.x, 0.001)}({pround(track.exactX, 0.01)})
    </div>
  );
});
