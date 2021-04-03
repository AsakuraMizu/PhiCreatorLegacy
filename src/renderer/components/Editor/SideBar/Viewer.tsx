import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import useRenderer from '/@/renderer/hook';

const useStyles = makeStyles({
  small: {
    width: '100%',
    transformOrigin: 'bottom left',
    position: 'relative',
    zIndex: 1,
  },
  bigger: {
    transform: 'scale(2.5)',
  },
});

export default function Viewer(): JSX.Element {
  const cn = useStyles();

  const [bigger, setBigger] = React.useState(false);

  const ref = React.useRef<HTMLCanvasElement>(null);
  useRenderer(ref);

  return (
    <canvas
      ref={ref}
      className={clsx(cn.small, bigger && cn.bigger)}
      onMouseDown={() => setBigger(true)}
      onMouseUp={() => setBigger(false)}
      width="800"
      height="600"
    />
  );
}
