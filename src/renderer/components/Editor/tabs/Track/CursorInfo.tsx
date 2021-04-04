import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';
import track from './state';
import { pround } from '/@/common';

const useStyles = makeStyles(() => ({
  info: {
    position: 'absolute',
  },
}));

export default observer(function CursorInfo() {
  const cn = useStyles();

  return (
    <div className={cn.info}>
      Time: {track.time}({pround(track.exactTime, 0.1)})
      <br />
      X: {track.x}({pround(track.exactX, 0.01)})
    </div>
  );
});
