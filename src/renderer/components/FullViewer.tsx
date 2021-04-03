import React from 'react';
import { makeStyles } from '@material-ui/core';
import useRenderer from '/@/renderer/hook';

const useStyles = makeStyles({
  canvas: {
    width: '100%',
    height: '100%',
  },
});

export default function Viewer(): JSX.Element {
  const cn = useStyles();

  const ref = React.useRef<HTMLCanvasElement>(null);
  useRenderer(ref, true);

  return <canvas ref={ref} className={cn.canvas} />;
}
