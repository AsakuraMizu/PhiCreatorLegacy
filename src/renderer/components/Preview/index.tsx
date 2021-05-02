import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import useOnWindowResize from '@rooks/use-on-window-resize';
import { Stage, useApp } from '@inlet/react-pixi';
import store from '/@/store';
import Background from './Background';
import JudgeLines from './JudgeLines';
import Ui from './Ui';
import { JudgerWrapper, JudgerCtx, JudgerContainer } from './Judger';

const useStyles = makeStyles({
  small: {
    width: '100% !important',
    height: 'initial !important',
    transformOrigin: 'bottom left',
    position: 'relative',
    zIndex: 1,
  },
  bigger: {
    transform: 'scale(2.5)',
  },
  full: {
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
  const judger = React.useRef<JudgerContainer>(null);

  const [bigger, setBigger] = React.useState(false);

  return (
    <Stage
      className={clsx(full ? cn.full : cn.small, !full && bigger && cn.bigger)}
      onMouseDown={() => setBigger(true)}
      onMouseUp={() => setBigger(false)}
      width={1200}
      height={900}
    >
      {full && <Resizer />}
      <Background />
      <JudgerCtx.Provider value={judger.current}>
        <JudgeLines />
      </JudgerCtx.Provider>
      {full && <Ui />}
      <JudgerWrapper ref={judger} />
    </Stage>
  );
}
