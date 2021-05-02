import React from 'react';
import { makeStyles } from '@material-ui/core';
import useOnWindowResize from '@rooks/use-on-window-resize';
import { Stage, useApp } from '@inlet/react-pixi';
import store from '/@/store';
import Background from './Background';

const useStyles = makeStyles({
  canvas: {
    width: '100% !important',
    height: '100% !important',
  },
});

function Resizer() {
  const app = useApp();

  const resize = () => {
    const { clientWidth, clientHeight } = app.view;
    let width = clientWidth,
      height = clientHeight;
    if (clientWidth < 1200 && clientHeight < 900) {
      width = 1200;
      height = (width * clientHeight) / clientWidth;
      app.renderer.resolution = clientWidth / width;
    }
    console.log(width, height);
    app.renderer.resize(width, height);
    store.preview.updateSize(width, height);
  };

  useOnWindowResize(resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(resize, []);

  return <></>;
}

interface PreviewProps {
  full?: boolean;
}

export default function Preview({ full }: PreviewProps): JSX.Element {
  const cn = useStyles();

  return (
    <Stage className={cn.canvas} width={1200} height={900}>
      {full && <Resizer />}
      <Background />
    </Stage>
  );
}
