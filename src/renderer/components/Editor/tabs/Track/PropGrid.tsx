import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core';
import track from './state';

const useStyles = makeStyles(() => ({
  point: {
    position: 'absolute',
    width: '100%',
  },
  cursor: {
    position: 'absolute',
    width: '100%',
    borderTop: '1.5px yellow solid',
  },
}));

const Points = observer(() => {
  const cn = useStyles();

  return (
    <>
      {Array.from(track.propData).map(([time]) => (
        <div
          key={time}
          className={cn.point}
          style={{ top: track.timeToY(time) }}
        >
          <img src="../../../../assets/ww.png" />
        </div>
      ))}
    </>
  );
});

const Cursor = observer(() => {
  const cn = useStyles();

  return (
    <div className={cn.cursor} style={{ top: track.timeToY(track.time) }} />
  );
});

export default observer(function PropGrid() {
  return (
    <>
      {track.tool === 'prop' && (
        <>
          <Points />
          <Cursor />
        </>
      )}
    </>
  );
});
