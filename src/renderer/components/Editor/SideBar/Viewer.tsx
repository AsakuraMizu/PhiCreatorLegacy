import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import useOnWindowResize from '@rooks/use-on-window-resize';
import useRenderer from '/@/renderer/hook';

const useStyles = makeStyles({
  small: {
    width: '100%',
    transformOrigin: 'bottom left',
    position: 'relative',
    zIndex: 1,
  },
  bigger: {
    transform: 'scale(2)',
  },
});

export default function Viewer(): JSX.Element {
  const cn = useStyles();

  const [bigger, setBigger] = React.useState(false);

  const ref = React.useRef<HTMLCanvasElement>(null);
  useRenderer(ref);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.height = ref.current.width * 0.75;
    }
  }, []);

  useOnWindowResize(() => {
    if (ref.current) {
      ref.current.height = ref.current.width * 0.75;
    }
  });

  return (
    <canvas
      ref={ref}
      className={clsx(cn.small, bigger && cn.bigger)}
      onMouseOver={() => setBigger(true)}
      onMouseLeave={() => setBigger(false)}
    />
  );
}
