import React from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import { music } from '/@/managers';

const useStyles = makeStyles((theme) => ({
  flex: { display: 'flex', alignItems: 'center' },
  center: { justifyContent: 'center' },
  bar: { flexGrow: 1, height: '100%', position: 'relative' },
  time: { margin: theme.spacing(0, 2), width: 80, textAlign: 'center' },
  layer: { position: 'absolute', width: '100%', height: '100%' },
  midline: { width: '100%', borderBottom: '1px solid white' },
  progress: {
    position: 'absolute',
    height: '100%',
    borderLeft: '4px solid red',
  },
  timepoint: {
    position: 'absolute',
    height: '50%',
    borderLeft: '1px solid aquamarine',
    transition: 'left 0.2s',
  },
}));

const onWheel = (e: React.WheelEvent) => {
  e.stopPropagation();
  const dt = e.deltaY / 100 / music.duration;
  const target = music.progress - dt;
  music.seek(target);
};

const onMouse = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!(e.buttons & 3)) return;
  const bar = e.currentTarget;
  const x = e.pageX - bar.offsetLeft;
  music.seek(x / bar.clientWidth);
};

const onTouch = (e: React.TouchEvent<HTMLDivElement>) => {
  const bar = e.currentTarget;
  const x = e.changedTouches[0].pageX - bar.offsetLeft;
  music.seek(x / bar.clientWidth);
};

function formatDuration(seconds: number): string {
  return dayjs.duration(seconds, 's').format('mm:ss.SSS').slice(0, 9);
}

export default observer(function ScrollBar() {
  const cn = useStyles();

  return (
    <div
      className={clsx(cn.flex, cn.bar)}
      style={{ overflow: 'hidden' }}
      onWheel={onWheel}
    >
      <div className={clsx(cn.flex, cn.center, cn.time)}>
        {formatDuration(music.progress * music.duration)}
      </div>
      <div
        className={cn.bar}
        onMouseDown={onMouse}
        onMouseMove={onMouse}
        onTouchStart={onTouch}
        onTouchMove={onTouch}
      >
        <div className={clsx(cn.flex, cn.layer, cn.center)}>
          <div className={cn.midline} />
        </div>
        <div className={cn.layer}>
          <div
            className={cn.progress}
            style={{ left: `${music.progress * 100}%` }}
          />
        </div>
      </div>
      <div className={clsx(cn.flex, cn.center, cn.time)}>
        {formatDuration(music.duration)}
      </div>
    </div>
  );
});
